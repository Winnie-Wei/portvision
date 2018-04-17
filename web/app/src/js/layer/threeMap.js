/**
 * @module port/mod/threeMap 3d地图底图
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var EAGLEEYE = require('mod/eagleEye/eagleEye');
    var updateX = -483;
    var updateY = -315;
    var intervelSeconds = 60; // 镜头自动移动的间隔时间（秒）
    var GROUND = 0;
    var TRUCKY = GROUND + 0.5; // 集卡 贴近地面
    var GANTRYCRANEY = GROUND + 4.5; // 龙门吊 挨近地面
    var BRIDGECRANEY = GROUND + 6; // 桥吊 贴近地面
    var CONTAINERY = GROUND + 1; // 集装箱 贴近地面
    var STACKERY = GROUND + 1; // 堆高机贴近地面
    var REACHSTACKERY = GROUND + 1; // 正面吊贴近地面
    var SHIP = GROUND - 0; // 正面吊贴近地面

    var TRUCKYSPRITE = 3; // 集卡标记 贴近地面
    var GANTRYCRANEYSPRITE = 6; // 龙门吊标记 挨近地面
    var BRIDGECRANEYSPRITE = 12; // 桥吊标记 贴近地面
    var STACKERSPRITE = 3;
    var REACHSTACKERSPRITE = 3;
    var SHIPSPRITE = 3;

    var RADIAN = Math.PI / 180; // 弧度
    var baseY = {
        'ground': GROUND,
        'truck': TRUCKY,
        'gantrycrane': GANTRYCRANEY,
        'bridgecrane': BRIDGECRANEY,
        'container': CONTAINERY,
        'stacker': STACKERY,
        'reachstacker': REACHSTACKERY,
        'ship': SHIP
    };

    var spriteY = {
        'truck': TRUCKYSPRITE,
        'gantrycrane': GANTRYCRANEYSPRITE,
        'bridgecrane': BRIDGECRANEYSPRITE,
        'stacker': STACKERSPRITE,
        'reachstacker': REACHSTACKERSPRITE,
        'ship': SHIPSPRITE
    };

    var rotationY = {
        'ground': 270,
        'truck': 0,
        'gantrycrane': 0,
        'bridgecrane': 0,
        'container': 0,
        'stacker': 0,
        'reachstacker': 0,
        'ship': 0
    };

    // DLVR : 提箱,   RECV : 进箱 ， DSCH ： 卸船， LOAD ：装船
    // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
    var spriteType = {
        'DLVR': 'up', // 提箱
        'RECV': 'down', // 进箱
        'LOAD': 'up', // 装船
        'DSCH': 'down', // 卸船
        'WARN': 'warn', // 警告
        'REPAIR': 'repair', // 故障
        'NOINS': 'noins', // 无指令空闲
        'YESINS': 'yesins' // 有指令空闲
    };


    // groud模型在grid网格中所占的格子
    var grid = {
        top: 250,
        bottom: 300,
        left: 500,
        right: 500
    }

    var containerGroupScale = 0.52;

    var cameraHeight = 61.42159316213704;
    var cameraPosition = { x: 0, y: 500, z: 200 };

    // 镜头移动的关键帧位置
    var posLoop = [
        [-350, 0, -200],
        [-100, 0, -110],
        [200, 0, -10],
        [400, 0, 60]
    ];

    /* var yardVertexPos = {
        x: [-454.684320963388, ]
    } */

    var THREEMAP = function (cfg) {
        if (!(this instanceof THREEMAP)) {
            return new THREEMAP().init(cfg);
        }
    };
    THREEMAP.prototype = $.extend(new McBase(), {

        /*
         *  初始化，定义变量
         */
        init: function (cfg) {
            //this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.viewWidth = cfg.viewWidth;
            this.viewHeight = cfg.viewHeight;
            this.mainDom = cfg.mainDom || 'main';

            this.SCREEN_WIDTH = this.viewWidth;
            this.SCREEN_HEIGHT = this.viewHeight;
            this.VIEW_ANGLE = 20;
            // this.VIEW_ANGLE = 90;
            this.ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT;
            this.NEAR = 1;
            this.FAR = 20000;

            this.Trucks = [];
            this.Gantrycranes = [];
            this.Bridgecranes = [];
            this.Containers = [];
            this.equipments = {
                'truck': [],
                'gantrycrane': [],
                'container': [],
                'bridgecrane': [],
                'stacker': [],
                'reachstacker': [],
                'yard': [],
                'ship': []
            }

            /** 模型对象 **/
            this.truckModel = null;
            this.gantrycraneModel = null;
            this.bridgecraneModel = null;
            this.groundModel = null;

            this.upSpriteModel = null;
            this.downSpriteModel = null;
            this.warnSpriteModel = null;
            this.repairSpriteModel = null;

            this.annies = [];
            this.visibleRegionYard = []; // 可见区域的堆场名称

            this.initWorld();
            this.initEagleEye();
            this.bindEvent();

            return this;
        },
        addObject: function (type, datas) {
            var self = this;
            /*if(type === 'container') {
                this.addYard(datas);
                return;
            }*/
            $.each(datas, function (k, obj) {

                obj.objId = obj.OBJ_EQUIPMENT_CODE || obj.OBJ_TRUCK_CODE || obj.YARD_CODE || obj.GPS_VESSEL_CODE;
                var cfg = {
                    objId: obj.OBJ_EQUIPMENT_CODE || obj.OBJ_TRUCK_CODE || obj.YARD_CODE || obj.GPS_VESSEL_CODE,
                    x: type === 'bridgecrane' ? obj.x + 10 : obj.x,
                    y: type === 'bridgecrane' ? obj.y - 10 : obj.y,
                    targetX: type === 'bridgecrane' ? obj.x + 10 : obj.x,
                    targetY: type === 'bridgecrane' ? obj.y - 10 : obj.y,
                    workType: obj.STA_JOB_TYPE,
                    obj: obj
                };
                var oldOne, idx;

                oldOne = _.findWhere(self.equipments[type], {
                    'objId': obj.objId
                });
                if (oldOne) {
                    var idx = _.indexOf(self.equipments[type], oldOne);
                    cfg.x = oldOne.cfg.targetX;
                    cfg.y = oldOne.cfg.targetY;
                    self.updateObjectModel(type, idx, cfg);
                } else {
                    self.createObjectModel(type, cfg);
                }
            })

            var objTobeRemoved = []; // 缓存多余对象
            $.each(this.equipments[type], function (j, equipment) {
                var objId = equipment.objId;
                var existObj = _.findWhere(datas, {
                    'objId': objId
                });
                if (!existObj) {
                    objTobeRemoved.push(objId);
                }
            });
            // 删除缓存中多余的对象
            $.each(objTobeRemoved, function (l, objId) {
                self.removeFromPortObject(type, objId);
            })
        },

        drawContainer: function (obj, object, group) {
            var self = this;
            // 绘制箱子
            var boxesRows = obj.yardblock;

            /* var bigCube = object.clone();
            var smallCube = object.clone(); 
            var box = new THREE.Box3().setFromObject(object);
            smallCube.scale.x = 0.5; */

            // var transparentCube = object.clone();

            var bigCubeSize = {
                width: 9.85,
                height: 2.46,
                depth: 2.35
            };
            var smallCubeSize = {
                width: bigCubeSize.width / 2,
                height: bigCubeSize.height,
                depth: bigCubeSize.depth
            };
            var bigCubeGeometry = new THREE.BoxGeometry(bigCubeSize.width, bigCubeSize.height, bigCubeSize.depth, 1, 1, 1);

            var bigCubeMaterial = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 'blue'
            });
            //var transparentCube = new THREE.Mesh(bigCubeGeometry, bigCubeMaterial);

            /* var bigCubeMaterial = new THREE.MeshBasicMaterial({
                wireframe: false,
                color: '#000'
            });
            var bigCube = new THREE.Mesh(bigCubeGeometry, bigCubeMaterial); */
            var bigCube = this.createContainerMesh(bigCubeGeometry, {
                path: '../../src/3d/images/',
                format: '.png',
                imgNames: ['blueLeft', 'blueLeft', 'blueFace', 'blueFace', 'blueFace', 'blueFace']
            });
            var smallCubeGeometry = new THREE.BoxGeometry(smallCubeSize.width, smallCubeSize.height, smallCubeSize.depth, 1, 1, 1);
            /* var smallCubeMaterial = new THREE.MeshBasicMaterial({
                wireframe: false,
                color: '#ccc'
            });
            var smallCube = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial); */
            var smallCube = this.createContainerMesh(smallCubeGeometry, {
                path: '../../src/3d/images/',
                format: '.png',
                imgNames: ['yellowLeft', 'yellowLeft', 'yellowFace', 'yellowFace', 'yellowFace', 'yellowFace']
            });

            var z = 0;
            $.each(boxesRows, function (idx, item) {
                var x = 0;
                var z1 = z + smallCubeSize.depth / 2;
                $.each(item, function (k, v) {
                    var y = 0;
                    var bayIndex = v.bayIndex + 1;
                    x = bayIndex % 2 === 0 ? ((bayIndex / 2 - 1) * smallCubeSize.width) : ((bayIndex - 1) / 2 * smallCubeSize.width);
                    var x1 = x + (bayIndex % 2 !== 0 ? smallCubeSize.width / 2 : bigCubeSize.width / 2); // 开始都在圆点，偏移自己的一半 + 之前的width和
                    for (var i = 0; i < v.value; i++) {
                        var judge = self.judgeCurAndNextContainer(obj, { bayIndex: bayIndex, rows: idx + 1, tower: i + 1 });
                        //judge && console.log(judge);
                        // 判断是否大小箱
                        var cube = bayIndex % 2 !== 0 ? smallCube.clone() : bigCube.clone();
                        // var cube = transparentCube.clone();
                        cube.equipmentType = 'container';
                        cube.yardCode = obj.YARD_CODE;
                        cube.containerPos = '' + bayIndex + (idx + 1) + (i + 1);
                        var y1 = y + smallCubeSize.height / 2;
                        cube.position.set(x1, y1, z1);
                        group.add(cube);
                        y += smallCubeSize.height;
                        /* cube.pos = {
                            x: group.position.x,
                            y: group.position.y,
                            z: group.position.z
                        } */
                    }
                })
                z += smallCubeSize.depth;
            })
            return group;
        },


        // 移除箱子
        removeContainerByYardCode: function (yardCode) {
            var self = this;
            var sceneCopy = $.extend(true, [], this.scene); // 要复制一份scene，因为循环中会减少原scene数组中的数据，循环会出错
            $.each(sceneCopy.children, function (idx, item) {
                if (item && item.equipmentType && item.equipmentType === 'yard' && yardCode === item.equipmentId)
                    self.scene.remove(item);
            })
        },


        // 根据可见堆场绘制箱子
        drawContainerByVisibleYard: function () {
            var self = this;
            $.each(this.equipments.yard, function (idx, item) {
                var obj = item.cfg.obj;
                var visibleFlag = self.isVisible(obj.GPS_COORDINATES);
                if (visibleFlag && self.visibleRegionYard.indexOf(obj.objId) === -1) {
                    var topLeftX = self.observer.convertFromLng(obj.GPS_COORDINATES[0].lng) + updateX;
                    var topLeftY = self.observer.convertFromLat(obj.GPS_COORDINATES[0].lat) + updateY;
                    if (_.indexOf(['WA', 'WB', 'WC', 'WD', '1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X'], obj.objId) > -1) {
                        topLeftX -= 16;
                        topLeftY -= 6;
                    }
                    var object = self.containerModel && self.containerModel.clone();
                    var group = new THREE.Group();
                    group.equipmentId = obj.YARD_CODE;
                    group.equipmentType = 'yard';
                    group.position.set(topLeftX, 0, topLeftY);
                    group.rotation.y = -19 * RADIAN;
                    group.scale.set(containerGroupScale, containerGroupScale, containerGroupScale);
                    group = self.drawContainer(obj, object, group);
                    self.scene.add(group);
                    self.visibleRegionYard.push(obj.objId);
                }
                if (!visibleFlag && self.visibleRegionYard.indexOf(obj.objId) > -1) {
                    self.removeContainerByYardCode(obj.objId);
                    self.visibleRegionYard = _.without(self.visibleRegionYard, obj.objId);
                }
            })
        },


        // 创建箱子网格，并贴图
        createContainerMesh: function (geom, imgData) {
            var materials = [];
            $.each(imgData.imgNames, function (idx, item) {
                var texture = {
                    color: 0xffffff,
                    map: new THREE.TextureLoader().load(imgData.path + item + imgData.format),
                    transparent: true,
                    depthTest: true
                };
                materials.push(new THREE.MeshBasicMaterial(texture));
            })
            var faceMaterial = new THREE.MultiMaterial(materials);
            var mesh = new THREE.Mesh(geom, faceMaterial);
            return mesh;
        },

        createTextureAnimate: function (runnerTexture, animateParameter) {
            this.annies.push(new this.textureAnimator(runnerTexture, animateParameter.horiz, animateParameter.vert, animateParameter.total, animateParameter.duration)); // texture, #horiz, #vert, #total, duration.
            /* var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.DoubleSide } );
            var runnerGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
            var runner = new THREE.Mesh(runnerGeometry, runnerMaterial); */

            /* var runnerMaterial = new THREE.SpriteMaterial({ map: runnerTexture, side: THREE.DoubleSide });
            var runner = new THREE.Sprite(runnerMaterial);
            return runner; */
        },

        textureAnimator: function (texture, tilesHoriz, tilesVert, numTiles, tileDispDuration) {
            // note: texture passed by reference, will be updated by the update function.

            this.tilesHorizontal = tilesHoriz;
            this.tilesVertical = tilesVert;
            // how many images does this spritesheet contain?
            //  usually equals tilesHoriz * tilesVert, but not necessarily,
            //  if there at blank tiles at the bottom of the spritesheet. 
            this.numberOfTiles = numTiles;
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

            // how long should each image be displayed?
            this.tileDisplayDuration = tileDispDuration;

            // how long has the current image been displayed?
            this.currentDisplayTime = 0;

            // which image is currently being displayed?
            this.currentTile = 0;

            this.updateMilliSec = function (milliSec) {
                this.currentDisplayTime += milliSec;
                while (this.currentDisplayTime > this.tileDisplayDuration) {
                    this.currentDisplayTime -= this.tileDisplayDuration;
                    this.currentTile++;
                    if (this.currentTile === this.numberOfTiles)
                        this.currentTile = 0;
                    var currentColumn = this.currentTile % this.tilesHorizontal;
                    texture.offset.x = currentColumn / this.tilesHorizontal;
                    var currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
                    texture.offset.y = 1 - currentRow / this.tilesVertical;
                }
            };
        },

        // 判断是否是current || next 箱子
        judgeCurAndNextContainer: function (obj, pos) {
            $.each(obj.currentCtns, function (idx, item) {
                var p = item.GPS_ACTUAL_SLOT_POSITION;
                if (~~p.substring(0, 2) === ~~pos.bayIndex && ~~p.substring(2, 4) === pos.rows && ~~p[p.length - 1] === pos.tower)
                    return 'currentCtns';
            })
            $.each(obj.nextCtns, function (idx, item) {
                var p = item.GPS_ACTUAL_SLOT_POSITION;
                if (~~p.substring(0, 2) === ~~pos.bayIndex && ~~p.substring(2, 4) === pos.rows && ~~p[p.length - 1] === pos.tower)
                    return 'nextCtns';
            })
        },



        /*
         *
         */
        bindEvent: function () {
            var self = this;
            this.mouse = new THREE.Vector3();
            this.raycaster = new THREE.Raycaster();
            var onDocumentMouseDown = function (event) {
                // self.redrawContainers(['3A', '3B', '3C', '3D']);
                event.preventDefault();
                self.mouse.x = (event.clientX / self.renderer.domElement.clientWidth) * 2 - 1;
                self.mouse.y = -(event.clientY / self.renderer.domElement.clientHeight) * 2 + 1;

                var raycaster = new THREE.Raycaster(); // 定义投影射线
                raycaster.setFromCamera(self.mouse, self.camera);
                // 遍历场景子对象，依次和投影射线计算交集
                $.each(self.scene.children, function (idx, item) {
                    var intersects;
                    intersects = raycaster.intersectObjects(item.children, true);
                    // 存在交集说明被点击
                    if (intersects.length > 0) {
                        item.equipmentId && console.log(item.equipmentId); // 点击设备的时候
                        if (item.equipmentType === 'yard') { // 点击堆场箱子的时候
                            console.log(intersects[0].distance, intersects[0].object.containerPos);
                        }
                    }
                })
                document.addEventListener('mouseup', onDocumentMouseUp, false);
            };
            var onDocumentMouseUp = function (event) {
                // event.preventDefault();
                window.setTimeout(function () { // 避免拖拽过快出现marquee定位问题
                    self.getScreenCenterPos();
                    self.drawContainerByVisibleYard();
                }, 0);
                document.removeEventListener('mouseup', onDocumentMouseUp, false);
            };
            // 响应鼠标点击事件
            document.addEventListener('mousedown', onDocumentMouseDown, false);

        },
        initScene: function () {
            //var VIEW_ANGLE = 20, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 20000; 
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(this.VIEW_ANGLE, this.ASPECT, this.NEAR, this.FAR);
            this.scene.add(this.camera);
            // this.setCameraPosition(0, 500);
            this.setCameraPosition(0, 200, cameraHeight);
            this.setCameraPosition(-54.286881703463976, 208.03837531652428, cameraHeight);
            this.initCameraPos = { x: this.camera.position.x, y: this.camera.position.y, z: this.camera.position.z };
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            // 保存初始化的camera的rotation
            this.cameraRotation = {
                x: this.camera.rotation.x,
                y: this.camera.rotation.y,
                z: this.camera.rotation.z
            }
        },
        // 重新设置camera的rotation
        resetCameraRotation: function (x, y, z) {
            this.camera.rotation.set(x || this.cameraRotation.x, y || this.cameraRotation.y, z || this.cameraRotation.z);
        },
        // 重新设置controls中的target
        resetControlsTarget: function (x, y, z) {
            // 经过观察得出controls的target位置关系如下
            this.controls.target.set(x || this.camera.position.x - this.initCameraPos.x, y || this.camera.position.y - this.initCameraPos.y, z || this.camera.position.z - this.initCameraPos.z);
            // console.log(this.controls.target);
            // this.controls.target = new THREE.Vector3(-87.64013618827107, -10.70224991018172, 42.808994380437916);
            // this.controls.object.position.set(-87.64013618827107, 789.2977500898182, 242.80899438043798);
        },
        initLight: function () {
            // create a light
            var ambientLight = new THREE.AmbientLight(0xffffff);
            ambientLight.castShadow = false;
            this.scene.add(ambientLight);

            var leftLight = new THREE.SpotLight(0xe5e5e5);
            leftLight.position.set(10000, 1000, -1000);
            leftLight.castShadow = false;
            this.scene.add(leftLight);
            this.initGrid(); //辅助网格
        },
        //初始化辅助网格
        initGrid: function () {
            var helper = new THREE.GridHelper(1000, 10);
            this.scene.add(helper);
            var axes = new THREE.AxisHelper(1500); // 坐标轴
            this.scene.add(axes);
        },
        initSkybox: function () {
            var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
            var skyBoxMaterial = new THREE.MeshBasicMaterial({ color: 0x2678de, side: THREE.BackSide });
            var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
            skyBox.name = 'sky';
            this.scene.add(skyBox);
        },
        intiThreeDWorld: function () {
            // 兼容不支持WebGL的浏览器 
            this.renderer = Detector.webgl ? new THREE.WebGLRenderer({ antialias: true }) : new THREE.CanvasRenderer();
            this.initScene();
            this.initLight();
            this.initSkybox();
            this.renderer.shadowMap.enabled = false;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap            
            this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
            this.containerDom = document.getElementById(this.mainDom);
            this.containerDom.appendChild(this.renderer.domElement);
            // 添加控制器
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement, this, this.stopMovingCamera); // 鼠标控制视图
            // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement); // 鼠标控制视图
            // this.controls = new THREE.TrackballControls(this.camera);   // 轨迹球控制视图
            // this.controls.autoRotate = false; //设置平面自动旋转 
            // 添加状态查看窗口
            this.clock = new THREE.Clock();
            this.stats = new Stats();
            this.stats.domElement.style.position = 'absolute';
            this.stats.domElement.style.top = '20px';
            this.stats.domElement.style.left = '20px';
            this.stats.domElement.style.zIndex = 100;
            this.stats.domElement.style.display = 'none';
            this.containerDom.appendChild(this.stats.domElement);
        },
        initEagleEye: function () {
            this.eagleEye = EAGLEEYE({
                observer: this.observer,
                callBackFun: this.stopMovingCamera,
                outSelf: this,
                grid: grid,
                initCameraPos: this.initCameraPos
            })
        },
        // 像可视化对象中增加一条记录，包含场景对象的信息，以objId为主键标识
        insertToPortObject: function (type, cfg) {
            this.equipments[type] && this.equipments[type].push(cfg);
        },
        /* 
         *  从可视化对象和场景对象中删除指定objId的设备
         *  @param  type string 设备类型
         *  @param  objId string 设备id
         */
        removeFromPortObject: function (type, objId) {
            if (!type) return false;
            var self = this;
            var existObject = _.findWhere(self.equipments[type], { 'objId': objId });
            if (existObject) {
                existObject.groupObject && this.scene.remove(existObject.groupObject);
                self.equipments[type] = _.without(self.equipments[type], existObject);
            }
        },
        /* 
         * 构建状态精灵对象
         * @param  type string 图标类型
         */
        createSprite: function (type) {
            if (!type) return null;
            var self = this;
            var Sprite;
            switch (type) {
                case 'up':
                    Sprite = self.upSpriteModel.clone();
                    break;
                case 'down':
                    Sprite = self.downSpriteModel.clone();
                    break;
                case 'warn':
                    Sprite = self.warnSpriteModel.clone();
                    break;
                case 'repair':
                    Sprite = self.repairSpriteModel.clone();
                    break;
                case 'yesins':
                    Sprite = self.yesinsSpriteModel.clone();
                    break;
                case 'noins':
                    Sprite = self.noinsSpriteModel.clone();
                    break;
            }
            return Sprite;
        },

        /* 
         *  构建模型可视化对象
         *  @param type string 对象类型
         *  @param cfg object 数据对象，objId、状态等
         */
        createObjectModel: function (type, cfg) {
            if (!type) return null;
            var self = this;
            var objId = cfg && cfg.objId || 0;
            var posX = cfg && cfg.x || 0;
            var posY = cfg && cfg.y || 0;
            var obj = cfg && cfg.obj;
            var rotation = cfg && cfg.rotation || 0;
            var targetX = cfg && cfg.targetX || posX;
            var targetY = cfg && cfg.targetY || posY;
            var workType = cfg && cfg.workType && cfg.workType.toUpperCase() || 'DLVR';
            var sprite = null;
            var group = new THREE.Group();
            var object;
            THREE.Cache.clear();
            var objCfg = {
                'type': type,
                'objId': objId,
                'cfg': cfg
            }
            var scaleRatio = 0.70;
            switch (type) {
                case 'truck':
                    object = this.truckModel && this.truckModel.clone();
                    break;
                case 'gantrycrane':
                    object = this.gantrycraneModel && this.gantrycraneModel.clone();
                    break;
                case 'bridgecrane':
                    object = this.bridgecraneModel && this.bridgecraneModel.clone();
                    break;
                case 'ground':
                    object = this.groundModel && this.groundModel.clone();
                    break;
                case 'stacker':
                    object = this.stackerModel && this.stackerModel.clone();
                    break;
                case 'reachstacker':
                    object = this.reachstackerModel && this.reachstackerModel.clone();
                    break;
                case 'yard':
                    object = this.containerModel && this.containerModel.clone();
                    break;
                case 'ship':
                    object = this.shipModel && this.shipModel.clone();
                    break;
            }
            if (!object) return false;

            if (type.toLowerCase() === 'ship') {
                object.rotation.y = -19 * RADIAN;
                group.add(object);
                group.position.set(70, baseY[type], -158);
                group.scale.set(0.006, 0.006, 0.006);
                this.scene.add(group);
                this.equipments[type] && this.equipments[type].push(objCfg);
                return false;
            }

            if (type.toLowerCase() === 'yard') {
                // if (this.visibleRegionYard.indexOf(obj.YARD_CODE) > -1) {
                var topLeftX = this.observer.convertFromLng(obj.GPS_COORDINATES[0].lng) + updateX;
                var topLeftY = this.observer.convertFromLat(obj.GPS_COORDINATES[0].lat) + updateY;
                // self.drawYardVertex(obj.GPS_COORDINATES);
                // console.log(objId);
                if (this.isVisible(obj.GPS_COORDINATES)) {
                    if (_.indexOf(['WA', 'WB', 'WC', 'WD', '1X', '2X', '3X', '4X', '5X', '6X', '7X', '8X'], obj.objId) > -1) {
                        topLeftX -= 16;
                        topLeftY -= 6;
                    }
                    group.position.set(topLeftX, 0, topLeftY);
                    group.rotation.y = -19 * RADIAN;
                    group.scale.set(containerGroupScale, containerGroupScale, containerGroupScale);
                    group.equipmentId = objId;
                    group.equipmentType = type;
                    objCfg.groupObject = group;
                    group = this.drawContainer(obj, object, group);
                    self.scene.add(group);
                    self.visibleRegionYard.push(objId);
                    // console.log('show');
                } else {
                    // console.log('not show')
                }
                this.equipments[type] && this.equipments[type].push(objCfg);
                return false;
            }

            object.rotation.y = rotation * RADIAN;
            object.rotation.x = rotationY[type] * RADIAN;
            if (type.toLowerCase() === 'ground') {
                object.position.set(posX, baseY[type], posY); //地图                
                object.rotation.z = -19 * RADIAN;
                group.name = 'ground';
            } else {
                object.rotation.y = -19 * RADIAN;
            }
            if (type.toLowerCase() === 'gantrycrane') {
                //object.position.set(-21, 0, -10);
            }
            if (type.toLowerCase() === 'bridgecrane') {
                object.rotation.y = -180 + 35 * RADIAN;
                group.position.set(posX + updateX, baseY[type], posY + updateY);
                // group.position.set(100, baseY[type], 100);
            }
            group.add(object);
            if (type.toLowerCase() !== 'ground' && workType !== '') {
                group.position.set(posX + updateX, baseY[type], posY + updateY);
                sprite = self.createSprite(spriteType[workType]);

                // sprite = self.createTextureAnimate(self.runnerTexture);

                sprite && sprite.position.set(0, spriteY[type], 0);
                sprite && sprite.scale.set(16 / 5, 16 / 5, 1.0); // imageWidth, imageHeight
                sprite && group.add(sprite);

                group.equipmentId = objId;
                group.equipmentType = type;
                objCfg.groupObject = group;

            }

            if (type.toLowerCase() !== 'ground') {
                object.scale.x = 0.5 * scaleRatio;
                object.scale.y = 0.5 * scaleRatio;
                object.scale.z = 0.5 * scaleRatio;
            }

            this.equipments[type] && this.equipments[type].push(objCfg);
            self.scene.add(group);
        },
        // 绘制堆场的四个顶点
        drawYardVertex: function (gps) {
            var self = this;
            var cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
            var cubeMaterial = new THREE.MeshBasicMaterial({
                wireframe: true,
                color: 'red'
            });
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            $.each(gps, function (idx, item) {
                var x = self.observer.convertFromLng(item.lng) + updateX;
                var y = self.observer.convertFromLat(item.lat) + updateY;
                cube.position.set(x, 0.5, y);
                self.scene.add(cube.clone());
            })

        },
        // 世界坐标转换为屏幕坐标
        transformVectorFormWorldToScreen: function (pos) {
            var projector = new THREE.Projector();
            var world_vector = new THREE.Vector3(pos.x, pos.y, pos.z);
            var vector = world_vector.project(this.camera);
            var halfWidth = window.innerWidth / 2;
            var halfHeight = window.innerHeight / 2;

            var result = {
                x: Math.round(vector.x * halfWidth + halfWidth),
                y: Math.round(-vector.y * halfHeight + halfHeight)
            };
            return result;
        },
        // 判断点阵范围是否可见
        isVisible: function (points) {
            var self = this;
            var pointsX = [],
                pointsY = [];
            var result = false;
            $.each(points, function (k, p) {
                var x = self.observer.convertFromLng(p.lng) + updateX;
                var y = self.observer.convertFromLat(p.lat) + updateY;
                if (self.isPointVisible(x, y)) {
                    result = true;
                    return true;
                }
            })
            return result;
        },
        // 判断某个点是否可见
        isPointVisible: function (x, y) {
            var projector = new THREE.Projector();
            var world_vector = new THREE.Vector3(x, 0, y);
            var vector = world_vector.project(this.camera);
            var halfWidth = window.innerWidth / 2;
            var halfHeight = window.innerHeight / 2;

            var result = {
                x: Math.round(vector.x * halfWidth + halfWidth),
                y: Math.round(-vector.y * halfHeight + halfHeight)
            };

            return result.x > 0 && result.x < 2 * halfWidth && result.y > 0 && result.y < 2 * halfHeight;

        },
        updateObjectModel: function (type, idx, cfg) {
            var self = this;
            if (!self.equipments[type][idx]) return false;
            if (type === 'yard' || type === 'ship') return false;
            //self.equipments[type][idx].groupObject.position.set(cfg.x + updateX, baseY[type], cfg.y + updateY);            
            self.equipments[type][idx].tweening && self.equipments[type][idx].tweening.stop();
            new TWEEN.Tween(self.equipments[type][idx].groupObject.position).to({ x: cfg.x + updateX, z: cfg.y + updateY }, 100).repeat(0).start();
            self.equipments[type][idx].cfg = cfg;
            if (type === 'truck') {
                self.changeRotation('truck', self.equipments[type][idx]);
            }
            self.equipments[type][idx].tweening = new TWEEN.Tween(self.equipments[type][idx].groupObject.position).to({ x: cfg.targetX + updateX, z: cfg.targetY + updateY }, 4000).repeat(0).start();

        },
        changeRotation: function (type, equipment) {
            var cfg = equipment.cfg;
            // var rotation = Math.atan2(cfg.y - cfg.targetY, cfg.x - cfg.targetX) + 19 * RADIAN;
            var rotation = -Math.atan2(cfg.y - cfg.targetY, cfg.x - cfg.targetX) + 19 * RADIAN - 180 * RADIAN;
            // var rotation = -Math.atan2(cfg.y - cfg.targetY, cfg.x - cfg.targetX) + 19 * RADIAN + 180 * RADIAN;
            equipment.groupObject.rotation.y = rotation;
        },
        createGround: function (cfg) {
            this.createObjectModel('ground');
        },

        // 主线更新，实现数据状态和动画的更新
        update: function () {
            // delta = change in time since last call (in seconds)
            var delta = this.clock.getDelta();
            //this.controls.update();
            this.stats.update();
            TWEEN.update();
            $.each(this.annies, function (idx, item) {
                item.updateMilliSec(1000 * delta);
            })
        },
        // 主线渲染，根据场景、摄像头渲染动画
        render: function () {
            this.renderer.render(this.scene, this.camera);
        },
        // 构造工作类型图标
        createSpriteModel: function (type) {
            if (!type) return null;

            if (type === 'run') {
                this.runnerTexture = new THREE.TextureLoader().load('../../src/3d/images/run.png');
                return;
            }

            var self = this;
            var spritesPath = '../../src/3d/images/' + type + '.png';
            var Texture = new THREE.TextureLoader().load(spritesPath);
            var Material = new THREE.SpriteMaterial({ map: Texture, transparent: false });
            var Sprite = new THREE.Sprite(Material);
            switch (type) {
                case 'up':
                    self.upSpriteModel = Sprite;
                    self.createTextureAnimate(Texture, {
                        horiz: 1,
                        vert: 3,
                        total: 10,
                        duration: 500
                    });
                    break;
                case 'down':
                    self.downSpriteModel = Sprite;
                    self.createTextureAnimate(Texture, {
                        horiz: 1,
                        vert: 3,
                        total: 10,
                        duration: 500
                    });
                    break;
                case 'warn':
                    self.warnSpriteModel = Sprite;
                    break;
                case 'repair':
                    self.repairSpriteModel = Sprite;
                    break;
                case 'yesins':
                    self.yesinsSpriteModel = Sprite;
                    break;
                case 'noins':
                    self.noinsSpriteModel = Sprite;
                    break;
            }

        },
        // 初始化工作类型图标
        initSpriteModel: function () {
            this.createSpriteModel('up');
            this.createSpriteModel('down');
            this.createSpriteModel('warn');
            this.createSpriteModel('repair');
            this.createSpriteModel('yesins');
            this.createSpriteModel('noins');

            this.createSpriteModel('run');
        },
        createModel: function (type) {
            if (!type) return null;
            var self = this;
            var onProgress = function (xhr) {
                if (xhr.lengthComputable) {
                    var percentComplete = xhr.loaded / xhr.total * 100;
                }
            };
            var onError = function (xhr) {
                console.log(xhr);
            };
            var path = {
                'ground': '地图',
                'truck': '集卡',
                'gantrycrane': '龙门吊',
                'bridgecrane': '桥吊',
                'container': '箱子2',
                'stacker': '堆高机',
                'reachstacker': '正面吊',
                'ship': '船'
            };

            THREE.Cache.clear();
            var MtlLoader = new THREE.MTLLoader();
            MtlLoader.setPath('../../src/3d/model/');
            var ObjLoader = new THREE.OBJLoader();
            ObjLoader.setPath('../../src/3d/model/');
            MtlLoader.load(path[type] + '.mtl', function (materials) {
                materials.preload();
                ObjLoader.setMaterials(materials);
                ObjLoader.load(path[type] + '.obj', function (object) {
                    switch (type) {
                        case 'truck':
                            self.truckModel = object;
                            break;
                        case 'gantrycrane':
                            self.gantrycraneModel = object;
                            break;
                        case 'bridgecrane':
                            self.bridgecraneModel = object;
                            break;
                        case 'ground':
                            self.groundModel = object;
                            break;
                        case 'stacker':
                            self.stackerModel = object;
                            break;
                        case 'reachstacker':
                            self.reachstackerModel = object;
                            break;
                        case 'container':
                            self.containerModel = object;
                            break;
                        case 'ship':
                            self.shipModel = object;
                            break;
                    }
                    // 地图模型下载完成后，直接构建底图
                    if (type === 'ground') {
                        self.createGround();
                        self.stopMovingCamera();
                    }
                }, onProgress, onError);
            });
        },
        setCameraPosition: function (x, z, y) {
            this.camera.position.set(x, y || cameraHeight, z); // 0 , 1000 , -1000  
            this.camera.updateProjectionMatrix();
        },
        getScreenCenterPos: function (that) {
            var self = that || this;
            var mouse = new THREE.Vector3(0, 0, 0);
            /* mouse.x = self.mouse.x;
            mouse.y = self.mouse.y; */
            /* mouse.x = (0 / self.renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(0 / self.renderer.domElement.clientHeight) * 2 + 1; */
            var raycaster = new THREE.Raycaster(); // 定义投影射线
            raycaster.setFromCamera(mouse, self.camera);
            // 遍历场景子对象，依次和投影射线计算交集
            $.each(self.scene.children, function (idx, item) {
                var intersects;
                /* if (item.name == 'sky') {
                    intersects = raycaster.intersectObject(item);
                } */
                // 在ground模型上
                item.name === 'ground' && (intersects = raycaster.intersectObjects(item.children[0].children, true));
                // 存在交集说明被点击
                if (intersects && intersects.length > 0) {
                    // console.log(intersects[0].point);
                    self.eagleEye.setPositionByCenter({
                        x: intersects[0].point.x / 500,
                        y: intersects[0].point.z >= 0 ? intersects[0].point.z / 250 : intersects[0].point.z / 300
                    })
                }
            })
        },
        initKeyCube: function () {
            // 构建关键帧的立方体
            var cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
            var cubeMaterial = new THREE.MeshBasicMaterial({
                wireframe: true
            });
            cubeMaterial.color = new THREE.Color('red');
            this.basecube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            this.basecube.position.set(-350, 0, -200);
            this.scene.add(this.basecube);

            this.secondcube = this.basecube.clone();
            this.secondcube.position.set(-100, 0, -110);
            this.scene.add(this.secondcube);

            this.thirdcube = this.basecube.clone();
            this.thirdcube.position.set(200, 0, -10);
            this.scene.add(this.thirdcube);

            this.forthcube = this.basecube.clone();
            this.forthcube.position.set(400, 0, 60);
            this.scene.add(this.forthcube);


        },
        initModel: function () {
            this.createModel('truck');
            this.createModel('gantrycrane');
            this.createModel('bridgecrane');
            this.createModel('stacker');
            this.createModel('reachstacker');
            this.createModel('ground');
            this.createModel('container');
            this.createModel('ship');
        },
        // 开始移动摄像头
        startMovingCamera: function () {
            var self = this;
            // camera.position: (0, 400, 400)
            var basePos = self.basecube.position;
            var secondPos = self.secondcube.position;
            var thirdPos = self.thirdcube.position;
            var forthPos = self.forthcube.position;
            var posLoop = [basePos, secondPos];
            var duringSeconds = 1 * 1000;

            this.cameraTween = new TWEEN.Tween(self.camera.position).to({ x: basePos.x, z: basePos.z + 250 }, duringSeconds);
            var secondcameraTween = new TWEEN.Tween(self.camera.position).to({ x: secondPos.x, z: secondPos.z + 250 }, duringSeconds);
            var thirdcameraTween = new TWEEN.Tween(self.camera.position).to({ x: thirdPos.x, z: thirdPos.z + 250 }, duringSeconds);
            var forthcameraTween = new TWEEN.Tween(self.camera.position).to({ x: forthPos.x, z: forthPos.z + 250 }, duringSeconds);

            this.resetCameraRotation();
            this.resetControlsTarget();

            this.cameraTween.onComplete(function () {
                self.getScreenCenterPos();
                secondcameraTween.delay(intervelSeconds * 1000).start();
            }).onStop(function () {
                secondcameraTween._isPlaying = true;
                secondcameraTween.stop();
                // self.lastClickBtn = undefined;
            })

            secondcameraTween.onComplete(function () {
                self.getScreenCenterPos();
                thirdcameraTween.delay(intervelSeconds * 1000).start();
            }).onStop(function () {
                thirdcameraTween._isPlaying = true;
                thirdcameraTween.stop();
            })

            thirdcameraTween.onComplete(function () {
                self.getScreenCenterPos();
                forthcameraTween.delay(intervelSeconds * 1000).start();
            }).onStop(function () {
                forthcameraTween._isPlaying = true;
                forthcameraTween.stop();
            })

            forthcameraTween.onComplete(function () {
                self.getScreenCenterPos();
                self.stopMovingCamera();
            })

            /*if (this.cameraTween) {
                this.cameraTween.stop();
                TWEEN.remove(this.cameraTween);
            }*/

            // this.initCameraPosition(); // 摄像头位置回归原点
            this.cameraTween.start();
            if (this.cameraMovingCountdown) {
                window.clearTimeout(this.cameraMovingCountdown); // 清除倒计时
            }

        },
        // 开始移动摄像头
        stopMovingCamera: function (that) {
            var self = that || this;
            //console.log( '静止到计时开始');
            // 停止移动摄像头
            if (self.cameraTween) {
                self.cameraTween._isPlaying = true; // 为了使onStop()执行，查看Tween.js源码得出
                self.cameraTween.stop();
                TWEEN.remove(self.cameraTween);
            }

            // 计时清零，重新开始
            if (self.cameraMovingCountdown) {
                window.clearTimeout(self.cameraMovingCountdown);
            }
            self.cameraMovingCountdown = setTimeout(function () {
                //console.log( '静止到计时结束');
                // self.startMovingCamera(); // 计时结束后移动摄像头
            }, intervelSeconds * 1000);
        },

        // 移除不可见的箱子
        /* removeInvisibleContainer: function() {
            var self = this;
            var sceneCopy = $.extend(true, [], this.scene); // 要复制一份scene，因为循环中会减少原scene数组中的数据，循环会出错
            $.each(sceneCopy.children, function(idx, item) {
                if (item.equipmentType === 'yard') {
                    $.each(item.children, function(jdx, jtem) {
                        if (jtem.containerPos) {
                            var screenPos = self.transformVectorFormWorldToScreen(jtem.pos);
                            var x = (screenPos.x / self.renderer.domElement.clientWidth) * 2 - 1;
                            var y = -(screenPos.y / self.renderer.domElement.clientHeight) * 2 + 1;
                            var mouse = new THREE.Vector3();
                            mouse.x = x;
                            mouse.y = y;
                            var raycaster = new THREE.Raycaster(); // 定义投影射线
                            raycaster.setFromCamera(mouse, self.camera);
                            var intersects = raycaster.intersectObjects(item.children, true);
                            console.log(intersects);
                        }
                    })
                }

            })
        }, */

        initWorld: function () {
            var self = this;
            this.intiThreeDWorld();
            this.initModel();
            this.initSpriteModel();
            // this.initKeyCube();


            // 启动动画，实现自动刷新页面
            var animate = function () {
                requestAnimationFrame(animate);
                self.render();
                self.update();
                //console.log( self.camera.position );
            }
            animate();
        }

    });
    return THREEMAP;
});