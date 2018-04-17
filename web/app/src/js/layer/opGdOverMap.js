/**
 * @module port/mod/overMap 地图附着物层
 */
define(function (require) {
    'use strict';

    var McBase = require('base/mcBase');
    var Label = require('mod/titleLabel/titleLabel'); // 标签场区
    var Yard = require('mod/yard/index'); // 堆场
    var Ship = require('mod/boat/boat'); // 船舶
    var Camera = require('mod/camera/camera'); // 摄像头
    var Hydrant = require('mod/hydrant/hydrant'); // 消防栓
    var Sensor = require('mod/sensor/sensor'); //传感器
    var JobPoint = require('mod/titleCircle/titleCircle'); // 工作点
    var Container = require('mod/container/container'); // 集卡
    var Gantrycrane = require('mod/gantrycrane/gantrycrane'); // 龙门吊
    var Bridgecrane = require('mod/bridgecrane/bridgecrane'); // 桥吊 
    var Stacker = require('mod/stacker/stacker'); // 堆高机
    var Reachstacker = require('mod/reachstacker/reachstacker'); // 正面吊
    var TRAIL = require('mod/trail/index'); // 轨迹
    var POINTS = require('mod/points/index'); // 点
    var BerthFlag = require('mod/berthFlag/berthFlag'); // 泊位标记
    var Track = require('mod/track/track'); // 轨道
    var berthPosition = [
        { 'x': 450, 'y': 88, 'rotation': -0.35 },
        { 'x': 590, 'y': 136, 'rotation': -0.35 },
        { 'x': 738, 'y': 188, 'rotation': -0.35 },
        { 'x': 886, 'y': 240, 'rotation': -0.35 },
        { 'x': 1059, 'y': 275, 'rotation': -0.35 },
        { 'x': 1256, 'y': 282, 'rotation': -0.35 }
        /*{'x':1059,'y':275,'rotation':-0.04},
        {'x':1256,'y':282,'rotation':-0.04}*/
    ];

    // 左上角堆场左上角位置信息
    var posInfo = {
        left_top_yard: {
            yardName: 'WA',
            points: [[122.029362, 29.890845], [122.031916, 29.890064]],     // 取自高德地图
            initX: 120.91,
            initY: 125.05
        }
    }

    var updateX = 0;
    var updateY = 0;


    var OVERMAP = function (cfg) {
        if (!(this instanceof OVERMAP)) {
            return new OVERMAP().init(cfg);
        }

    };

    OVERMAP.prototype = $.extend(new McBase(), {

        /*
         * 初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.is25d = cfg.is25d;
            this.map = cfg.map;
            this._observer = cfg.observer;
            this.showScale = cfg.showScale || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.baseshowScale = cfg.showScale || 1;
            this.updateX = cfg.updateX || 0;
            this.updateY = cfg.updateY || 0;
            this.initX = cfg.initX || 0;
            this.initY = cfg.initY || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.lastDrawX = this.initX + this.deltaX;  // 上一次挪动后的定位
            this.lastDrawY = this.initY + this.deltaY;
            this.newDrawX = this.lastDrawX + this.deltaX;  // 当前地图定位偏移
            this.newDrawY = this.lastDrawY + this.deltaY;
            this.isShowQuotaYard = true; // 是否显示堆场指标
            this.isShowEquipmentObject = true; // 是否显示设备
            this.isShowQuotaDevice = true; // 是否显示设备指标
            this.isShowYardByThermodynamic = false; //是否以热力图显示堆场
            this.isShowJobLine = false; //是否显示堆场作业线路图，默认不显示
            this.isShowJobPoints = false; // 是否显示作业点，默认不显示
            this.isShowDeviceJobType = false; // 是否显示设备作业状态
            this.initObjects();
            this.isInit = true; // 初始化数据
            this.trailMap = null;
            this.GPSLineMap = null;
            this.pointsMap = null;

            this.setDevicePos();
            this.baseyardLength = this._observer.getDistance(posInfo.left_top_yard.points[0], posInfo.left_top_yard.points[1]);     // 保存初始化时的堆场长度
            return this;
        },
        /*
         *  渲染设备对象
         */
        startRenderObjects: function (during) {
            var that = this;
            var duringTime = during || 3000;
            that.renderEquipments();
            window.setTimeout(function () {
                that.startRenderObjects(duringTime);
            }, duringTime);
        },
        /*
         *  绘制集卡
         */
        renderContainers: function () {
            // console.log( this.containers );
            if (!this.containers.length) {
                return true;
            }
            $.each(this.containers, function (k, v) {
                v.draw();
                v.moveToTarget(3500);
            })
        },
        /*
         *  绘制设备
         */
        renderEquipments: function () {
            var equipments = [
                this.yards, this.ships, this.cameras,this.hydrants, this.sensors, 
                this.containers, this.gantrycranes,this.bridgecranes, this.stackers, this.reachstackers
            ];
            // console.log( equipments )

            $.each(equipments, function (k, v) {
                if (!v.length) {
                    return true;
                }
                // console.log( v );
                $.each(v, function (j, equ) {
                    // console.log( equ );
                    equ['draw'] && equ.draw();
                    equ['moveToTarget'] && equ.moveToTarget(3500);
                });
            })

        },
        /*
         *  重置设备对象
         */
        initObjects: function () {
            //delete this._equipments;
            //this._equipments = [];
            delete this.labels;
            this.labels = []; // 0标签
            //this._equipments.push( this.labels );
            delete this.berths;
            this.berths = []; // 1泊位区
            //this._equipments.push( this.berths );
            delete this.yards;
            this.yards = [];  // 2堆场   
            //this._equipments.push( this.yards );   
            delete this.ships;
            this.ships = []; // 3船舶  
            //this._equipments.push( this.ships ); 
            delete this.containers;
            this.containers = [];  // 4集卡
            //this._equipments.push( this.containers );
            delete this.gantrycranes;
            this.gantrycranes = []; // 5龙门吊
            //this._equipments.push( this.gantrycranes );
            delete this.bridgecranes;
            this.bridgecranes = []; // 6桥吊            
            //this._equipments.push( this.bridgecranes );    
            delete this.stackers;
            this.stackers = []; // 7堆高机
            //this._equipments.push( this.stackers ); 
            delete this.reachstackers;
            this.reachstackers = []; // 8正面吊
            //this._equipments.push( this.reachstackers );  
            delete this.cameras;
            this.cameras = []; // 9摄像头
            //this._equipments.push( this.cameras );  
            delete this.hydrants;
            this.hydrants = []; // 10消防栓
            //this._equipments.push( this.hydrants );  
            delete this.sensors;
            this.sensors = []; // 11传感器
            delete this.jobPoints;
            this.jobPoints = []; // 12工作点
            delete this.tracks;
            this.tracks = []; // 轨道
            delete this.roads;
            this.roads = []; // 轨道
            delete this.berthFlags;
            this.berthFlags = []; // 泊位标记
            delete this.milestones;
            this.milestones = [];
            //this._equipments.push( this.sensors );
            // 用于记录是否选中需要显示
            this.containersChecked = {};  // 集卡是否选中
            this.gantrycranesChecked = {}; // 龙门吊是否选中
            this.bridgecranesChecked = {}; // 桥吊是否选中
            this.stackersChecked = {}; // 堆高机是否选中
            this.bridgecranesChecked = {}; // 桥吊是否选中
            this.reachstackersChecked = {}; // 正面吊是否选中  
            this.shipsChecked = {}; // 船舶是否选中  
            this._selectedEquipment = null;
        },


        /*
         *  添加对象
         */
        addObject: function (type, datas) {
            switch (type) {
                case 'label': this.addLabels(datas); break;
                case 'berth': this.addBerths(datas); break;
                case 'berthFlag': this.addBerthFlags(datas); break;
                case 'jobPoints': this.addJobPoints(datas); break;
                case 'yard': this.addYards(datas); break;
                case 'ship': this.addShips(datas); break;
                case 'camera': this.addCameras(datas); break;
                case 'hydrant': this.addHydrant(datas); break;
                case 'sensor': this.addSensor(datas); break;
                case 'container': this.addContainers(datas); break;
                case 'gantrycrane': this.addGantrycranes(datas); break;
                case 'bridgecrane': this.addBridgecranes(datas); break;
                case 'bridgeBox': this.addBridgeBoxs(datas); break;
                case 'stacker': this.addStackers(datas); break;
                case 'reachstacker': this.addReachstackers(datas); break;
                case 'track': this.addTracks(datas); break;
                case 'roads': this.addRoads(datas); break;
            }

            this._selectedEquipment && this._observer._popLayer._infoPop.setInfoPopPositionByDevice(this._selectedEquipment);
        },

        /*
         *  隐藏设备的对象
         */
        showEquipmentObject: function () {
            this.isShowEquipmentObject = true;
        },

        /*
         *  隐藏设备的对象
         */
        hideEquipmentObject: function () {
            var that = this;
            var equipments = ['berth', 'ship', 'container', 'gantrycrane', 'bridgecrane', 'stacker', 'reachstacker']
            $.each(equipments, function (k, v) {
                that.hideObjectByType(v);
            })
            this.isShowEquipmentObject = false;
        },

        /*
         *  隐藏制定类型的对象
         */
        hideObjectByType: function (type) {
            var equps = null;
            switch (type) {
                case 'label': equps = this.labels; break;
                case 'berth': equps = this.berths; break;
                case 'yard': equps = this.yards; break;
                case 'ship': equps = this.ships; break;
                case 'container': equps = this.containers; break;
                case 'gantrycrane': equps = this.gantrycranes; break;
                case 'bridgecrane': equps = this.bridgecranes; break;
                case 'stacker': equps = this.stackers; break;
                case 'reachstacker': equps = this.reachstackers; break;
            }
            $.each(equps, function (j, c) {
                c.hide();
            });
        },

        /*
         *
         */
        updateObjectChecked: function (type, datas) {
            //console.log( type );       
            switch (type) {
                case 'container':
                    this.containersChecked = datas;
                    break;
                case 'gantrycrane':
                    this.gantrycranesChecked = datas;
                    break;
                case 'bridgecrane':
                    this.bridgecranesChecked = datas;
                    break;
                case 'stacker':
                    this.stackersChecked = datas;
                    break;
                case 'reachstacker':
                    this.reachstackersChecked = datas;
                    break;
                case 'ship':
                    this.shipsChecked = datas;
                    break;
            }
        },

        /*
         *
         */
        addLabels: function (datas) {
            var that = this;
            $.each(datas, function (k, v) {
                $.each(v.vertices, function (k, p) {
                    p.x = p.x + that.updateX;
                    p.y = p.y + that.updateY;
                })
                if (!that.isInTheView(v.vertices)) {
                    return true;
                }
                var oldOne = _.findWhere(that.labels, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 20,
                    'fillColor': v.fillColor,
                    'strokeColor': v.strokeColor,
                    'vertices': v.vertices,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'text': v.text,
                    'isShow': true
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('label');
                    that.labels.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            })
            //this._equipments[0] = this.labels;   
        },

        /*
         *  泊位
         */
        addBerths: function (datas) {
            //console.log(datas);
            var that = this;
            var berthPoints = datas.berth;
            var mileStones = datas.milestone;
            $.each(berthPoints, function (k, v) {
                var strokeColor = '#449fe6';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                $.each(v.POINT, function (k, p) {
                    p.x = p.x + that.updateX;
                    p.y = p.y + that.updateY;
                })
                var oldOne = _.findWhere(that.berths, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'fillColor': 'transparent',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': that.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('berth');
                    that.berths.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            })
            $.each(mileStones, function (k, v) {
                var strokeColor = '#449fe6';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                $.each(v.POINT, function (k, p) {
                    p.x = p.x + that.updateX;
                    p.y = p.y + that.updateY;
                })
                var oldOne = _.findWhere(that.berths, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'fillColor': '#b7d7ea',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': that.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('milestone');
                    that.milestones.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            })
        },

        /*
         *  泊位标记
         */
        addBerthFlags: function (datas) {
            var that = this;
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                var oldOne = _.findWhere(that.berthFlags, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 32,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'deviceData': v,
                    'berthTitle': v.berthTitle,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': that.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = BerthFlag(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('berthFlag');
                    that.berthFlags.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
            })
        },

        /*
         *  轨道
         */
        addTracks: function (datas) {
            var that = this;
            $.each(datas, function (k, v) {
                $.each(v.POINT, function (l, n) {
                    n.x += that.updateX;
                    n.y += that.updateY;
                })
                /*if( !that.isInTheView( v.POINT ) ){
                    return true;
                }*/
                var oldOne = _.findWhere(that.tracks, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 19,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'points': v.POINT,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': that.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Track(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('track');
                    that.tracks.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
            })
        },

        /*
         *  道路线
         */
        addRoads: function (datas) {
            var that = this;
            datas = _.groupBy(datas, function (item) {
                return item.name
            })
            var arr = [];
            $.each(datas, function (idx, item) {
                var temp = [];
                $.each(item, function (idx, item) {
                    temp.push([that._observer.convertFromLng(item.lng) + that.updateX, that._observer.convertFromLat(item.lat) + that.updateY]);
                })
                arr.push(temp);
            })
            var cfg = {
                'zr': that._zr,
                'observer': that._observer,
                'zlevel': 20,
                'points': arr,
                'strokeColor': '#ccc',
                'isShow': true,
                // 'initX': -163,
                // 'initY': -77,
                'lineWidth': 1,
                'deltaX': that.lastDrawX,
                'deltaY': that.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel
            };
            var oldOne = TRAIL(cfg);
            oldOne.draw();
            that.roads.push(oldOne);
        },

        addJobPoints: function (datas) {
            var that = this;
            $.each(datas, function (k, v) {
                var strokeColor = '#F58F00';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                // y值偏移
                // v.y = v.y + 100;
                var oldOne = _.findWhere(that.jobPoints, { '_mapId': v._mapId });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 45,
                    'fillColor': v.fillColor,
                    'strokeColor': v.fillColor,
                    'position': { x: v.x + that.updateX, y: v.y + that.updateY },
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'text': '123',
                    'isShow': that.isShowJobPoints,
                    'jobType': v.type,
                };
                if (!oldOne) {
                    oldOne = JobPoint(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('jobPoint');
                    that.jobPoints.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
            })
        },

        /*
         *
         */
        addYards: function (datas) {
            var that = this;
            $.each(datas, function (k, v) {
                var POINT = [];
                $.each(v.GPS_COORDINATES, function (m, n) {
                    POINT.push(
                        {
                            'x': that._observer.convertFromLng(n.lng) + that.updateX,
                            'y': that._observer.convertFromLat(n.lat) + that.updateY
                        }
                    );
                });
                if (!that.isInTheView(POINT)) {
                    return true;
                }
                // 判断箱堆种类
                if (v.STA_BLOCK_TYPE) {
                    $.trim(v.STA_BLOCK_TYPE) === 'D' && (v.FUNCTIONTYPE = 'DANGEROUS');
                    $.trim(v.STA_BLOCK_TYPE) === 'S' && (v.FUNCTIONTYPE = 'SPECIAL');
                    $.trim(v.STA_BLOCK_TYPE) === 'ES' && (v.FUNCTIONTYPE = 'ES');
                    $.trim(v.STA_BLOCK_TYPE) === 'RTG' && (v.FUNCTIONTYPE = 'RTG');
                } else if (v.STA_YARD_EQUIPMENT_TYPE) {
                    $.trim(v.STA_YARD_EQUIPMENT_TYPE) === 'R' && (v.FUNCTIONTYPE = 'RTG');
                    $.trim(v.STA_YARD_EQUIPMENT_TYPE) === 'P' && (v.FUNCTIONTYPE = 'ES');
                }
                var randomDelta = 10 - 20 * Math.random(); // 模拟堆场动画                
                randomDelta = Math.abs(randomDelta) > 0 ? randomDelta : 0;
                var oldOne = _.findWhere(that.yards, { '_mapId': v.OBJ_YARD_CODE });
                var sourceTeu = oldOne && oldOne.teu ? oldOne.teu : v.TEU;
                // var sourceTeu = v.TEU + randomDelta; 
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 22,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'identity': v.OBJ_ID,
                    'yardId': v.OBJ_ID,
                    'yardCode': v.OBJ_YARD_CODE,
                    'yardName': v.OBJ_YARD_CNAME,
                    'vertices': POINT,
                    'capability': v.OBJ_YARD_CAPABILITY,
                    'teu': v.TEU,
                    'sourceTeu': sourceTeu,
                    'useratio': v.USERATIO,
                    'number': v.STA_YARD_COUNT,
                    'functiontype': v.FUNCTIONTYPE,
                    'isShowQuota': that.isShowQuotaYard,
                    'jobLine': v.jobLine,
                    'isShowByThemodynamic': that.isShowYardByThermodynamic,
                    'isShowJobLine': that.isShowJobLine,
                    'nextContainer': v.nextCtns && v.nextCtns[0],
                    'jobContainer': v.currentCtns && v.currentCtns[0],
                    'nextBoxBayNum': v.nextCtns && v.nextCtns[0] && v.nextCtns[0].bay
                };
                if (!oldOne) {
                    oldOne = Yard(cfg);
                    oldOne.setMapId(v.OBJ_YARD_CODE);
                    oldOne.setMapType('yard');
                    that.yards.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();

            })
            //this._equipments[2] = this.yards; 
            // this.switchQuota(true);
            this.isShowJobPoints && this.showJobPoints();
        },

        /*
         *
         */
        addShips: function (datas) {
            var that = this;
            var ships = [];
            var isSelected = false;
            var selected = that._selectedEquipment;
            //console.log( datas );
            $.each(datas, function (k, v) {
                if (v.STA_BERTH_REFERENCE > 6) return;
                v.x = berthPosition[v.STA_BERTH_REFERENCE - 1].x + that.updateX;
                v.y = berthPosition[v.STA_BERTH_REFERENCE - 1].y + that.updateY;
                v.rotation = berthPosition[v.STA_BERTH_REFERENCE - 1].rotation;
                var timeDiff;
                v.stopAnimator = true; v.isArriving = false; v.isLeaving = false; v.isLeaved = false;

                if (selected && selected._type === 'ship' && selected._equipmentCode === v.STA_VESSEL_REFERENCE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                if (that.shipsChecked[v.STA_VESSEL_REFERENCE] === undefined || that.shipsChecked[v.STA_VESSEL_REFERENCE] === true) {
                    v.isShow = true;
                    that.shipsChecked[v.STA_VESSEL_REFERENCE] = true;
                } else {
                    v.isShow = false;
                    that.shipsChecked[v.STA_VESSEL_REFERENCE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                // 船舶状态：V_ATA:抵锚 ， V_BERTH:靠泊 ，V_WAIT_WORK:等开工， V_WORK：开工，V_STOP:停工，V_WAIT_ATD:等离泊，V_ATD:离泊
                //console.log(v.STA_CURRENT_STATUS);  

                var oldOne = _.findWhere(that.ships, { '_equipmentCode': v.STA_VESSEL_REFERENCE });
                if (!oldOne) {
                    // 靠泊
                    if (v.STA_CURRENT_STATUS === 'V_BERTH' || v.STA_CURRENT_STATUS === 'V_ATA') {
                        v.stopAnimator = false; v.isArriving = true;
                    }
                    // 离港
                    if (v.STA_CURRENT_STATUS === 'V_ATD' || v.STA_CURRENT_STATUS === 'V_WAIT_ATD') {
                        v.stopAnimator = false; v.isLeaving = true;
                    };

                } else {
                    // 靠泊
                    if ((v.STA_CURRENT_STATUS === 'V_BERTH' || v.STA_CURRENT_STATUS === 'V_ATA') && oldOne.curStatus !== v.STA_CURRENT_STATUS) {
                        v.stopAnimator = false; v.isArriving = true; v.isLeaving = false;
                        //console.log( v.stopAnimator, v.isArriving, v.isLeaving );
                    }
                    // 离港
                    if ((v.STA_CURRENT_STATUS === 'V_ATD' || v.STA_CURRENT_STATUS === 'V_WAIT_ATD') && (oldOne.curStatus !== v.STA_CURRENT_STATUS || ((oldOne.curStatus === v.STA_CURRENT_STATUS) && (oldOne.curStatus === 'V_ATD')))) {
                        v.stopAnimator = false; v.isArriving = false; v.isLeaving = true; v.isLeaved = true;
                        //console.log( v.stopAnimator, v.isArriving, v.isLeaving );

                    };
                }


                /*if　( v.STA_VESSEL_REFERENCE == 'GL5814' ) {
                    console.log( v.STA_CURRENT_STATUS );  
                    if ( oldOne ){
                        console.log( oldOne.curStatus );
                    }   
                }*/


                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'startPos': { 'x': 330 + that.updateX, 'y': 49 + that.updateY },
                    'endPos': { 'x': 973 + that.updateX, 'y': 269 + that.updateY },
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'curStatus': v.STA_CURRENT_STATUS,
                    'isArriving': v.isArriving,
                    'isLeaving': v.isLeaving,
                    'isLeaved': v.isLeaved,
                    'stopAnimator': v.stopAnimator,
                    'routeName': v.OBJ_VESSEL_UN_CODE,
                    'boatWidth': v.boatWidth,
                    'posFrom': parseInt(v.GPS_ACTUAL_POSITION_FROM),
                    'posTo': parseInt(v.GPS_ACTUAL_POSITION_TO),
                    'isShow': v.isShow,
                    'isSelected': isSelected,
                    'isShowQuota': that.isShowQuotaDevice,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Ship(cfg);
                    oldOne.setMapType('ship');
                    oldOne.setEquipmentCode(v.STA_VESSEL_REFERENCE);
                    that.ships.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                ships.push(v);
            })
            //this._equipments[3] = this.ships;     
            this._observer._popLayer.addObject('ship', ships);
        },

        /*
         *  
         */
        addCameras: function (datas) {
            var that = this;
            var selected = that._selectedEquipment;
            var isSelected;
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (selected && selected._type === 'camera' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(that.cameras, { '_equipmentCode': v.ID });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 34,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': that.isShowEquipmentObject,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Camera(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('camera');
                    oldOne.setEquipmentCode(v.ID);
                    that.cameras.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
            })
            //this._equipments[3] = this.cameras;          
        },

        /**
         * desc: 添加消防栓数据
         */
        addHydrant: function (datas) {
            var that = this;
            var selected = that._selectedEquipment;
            var isSelected = false;
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (selected && selected._type === 'hydrant' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(that.hydrants, { '_equipmentCode': v.ID });
                // 过滤前4个消防栓的位置
                if (k < 4) {
                    v.y = v.y + 5;
                }
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 42,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    // 'gps': v.GPS_COORDINATES,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'deviceData': v,
                    // 'rotation' : v.rotation,
                    // 'jobStatus': v.jobStatus,
                    'isShow': that.isShowEquipmentObject || true,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Hydrant(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('hydrant');
                    oldOne.setEquipmentCode(v.ID);
                    that.hydrants.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
            })
        },

        /**
         * desc: 添加传感器数据
         */
        addSensor: function (datas) {
            var that = this;
            var selected = that._selectedEquipment;
            var isSelected = false;
            var sensors = [];
            $.each(datas, function (k, v) {
                if (selected && selected._type === 'sensor' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(that.sensors, { '_equipmentCode': v.ID });
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 42,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    // 'gps': v.GPS_COORDINATES,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'deviceData': v,
                    // 'rotation' : v.rotation,
                    // 'jobStatus': v.jobStatus,
                    'isSelected': isSelected,
                    'isShow': that.isShowEquipmentObject || true,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Sensor(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('sensor');
                    oldOne.setEquipmentCode(v.ID);
                    that.sensors.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
            })
        },

        addContainers: function (datas) {
            //var startTime = new Date().valueOf();
            var that = this;
            var selected = that._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var containers = [];
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (that.containersChecked[v.OBJ_TRUCK_CODE] === undefined || that.containersChecked[v.OBJ_TRUCK_CODE] === true) {
                    v.isShow = true;
                    that.containersChecked[v.OBJ_TRUCK_CODE] = true;
                } else {
                    v.isShow = false;
                    that.containersChecked[v.OBJ_TRUCK_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'container' && selected._equipmentCode === v.OBJ_TRUCK_CODE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }

                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;
                //console.log( randomDelta );
                var oldOne = _.findWhere(that.containers, { '_equipmentCode': v.OBJ_TRUCK_CODE });
                // console.log( oldOne );
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var rotation = Math.atan2(v.x - sourceX, v.y - sourceY) - 1.5;  // 弧度数
                if (rotation === -1.5) {
                    rotation = - 1.05 * Math.PI;
                }

                /*if( v.OBJ_TRUCK_CODE == 'T231'){
                    console.log( v.GPS_LATITUDE, v.GPS_LONGITUDE, sourceX , v.x, sourceY , v.y , new Date());                   
                }*/
                // v.INYARDTIME && console.log(v.INYARDTIME);
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    //'offsetX': -165,
                    //'offsetY': -75,
                    'offsetX': 0,
                    'offsetY': 0,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    //'rotation' : -(v.GPS_DIRECTION / 180 * Math.PI), // GPS返回设备方向范围0~359，测试后猜测角度可能为水平0°顺时针旋转，zrender旋转方向为水平0°逆时针旋转，故做一个负向转换
                    'rotation': rotation,
                    'jobStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'workType': v.OBJ_TRUCK_WORK_TYPE,
                    'inOutStatus': v.OBJ_TRUCK_NW,
                    'identity': v.OBJ_ID,
                    'deviceData': v,
                    'profileData': [{
                        'license': v.OBJ_TRUCK_LICENSE,
                        'number': v.OBJ_TRUCK_CODE,
                        'id': v.OBJ_ID,
                        'status': v.STA_WORK_STATUS,
                        'ctnWeight': v.STA_LOAD_CTN_WEIGHT_1 + v.STA_LOAD_CTN_WEIGHT_2
                    }],
                    'speed': v.GPS_SPEED,
                    'edgeSpeed': 50,
                    'isShow': v.isShow,
                    'isSelected': isSelected,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': that.isShowQuotaDevice,
                    'isCarryCargo': !v.OBJ_TRUCK_EMPTYCTN_FLAG,
                    'isShowDeviceJobType': that.isShowDeviceJobType,
                    'presenceTime': v.STA_END_TIME - v.STA_START_TIME,
                    'alarm': v.alarm
                };
                // rotation = 1 * Math.PI;
                if (!oldOne) {
                    oldOne = Container(cfg);
                    oldOne.setMapType('container');
                    oldOne.setEquipmentCode(v.OBJ_TRUCK_CODE);
                    that.containers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000, true);
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                containers.push(v);
            })


            //this.renderContainers();
            //console.log( containers );
            this._observer._popLayer.addObject('container', containers);

        },


        /*
         *  龙门吊
         */
        addGantrycranes: function (datas) {
            //var startTime = new Date().valueOf();
            var that = this;
            var selected = that._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var gantrycranes = [];

            $.each(datas, function (k, v) {
                if (!that._zr) {
                    return true;
                }
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === undefined || that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'gantrycrane' && selected._equipmentCode === v.OBJ_EQUIPMENT_CODE) {
                    isSelected = true;

                } else {
                    isSelected = false;
                }
                // 设备工作状态
                var isShipment = false,
                    shipmentStatus = '';

                // DLVR : 提箱,   RECV : 进箱 ， DSCH ： 卸船， LOAD ：装船
                if (v.STA_WORK_STATUS === 'WORK') {
                    isShipment = true;
                    if (v.STA_JOB_TYPE === 'DLVR' || v.STA_JOB_TYPE === 'LOAD') {
                        shipmentStatus = 'containerOut';
                    }
                    if (v.STA_JOB_TYPE === 'RECV' || v.STA_JOB_TYPE === 'DSCH') {
                        shipmentStatus = 'containerIn';
                    } /*else {
                        shipmentStatus = 'hide';
                    }*/
                } else {
                    isShipment = false;
                }

                var oldOne = _.findWhere(that.gantrycranes, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var randomDelta = 0;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;

                // 真实两个龙门吊方向处理 （仅显示 后期根据实际情况）
                /*if ( v.GPS_EQUIPMENT_CODE == 'R02' || v.GPS_EQUIPMENT_CODE == 'R01' ) {
                    // v.GPS_DIRECTION = -(v.GPS_DIRECTION / 180 * Math.PI); // R02 35° 基线以y轴为准
                    v.GPS_DIRECTION = -(25 / 180 * Math.PI);
                } */
                var cfg = {
                    'zr': that._zr,
                    'is25d': that.is25d,
                    'observer': that._observer,
                    'zlevel': 32,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'rotation': v.GPS_DIRECTION || 0,
                    'jobStatus': v.STA_WORK_STATUS,
                    'workType': v.STA_JOB_TYPE,
                    'identity': v.OBJ_ID,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShipment': v.isShipment,
                    'shipmentStatus': shipmentStatus,
                    'isShow': v.isShow,
                    'deviceData': v,
                    'isSelected': isSelected,
                    'isShowQuota': that.isShowQuotaDevice,
                    'isShowDeviceJobType': that.isShowDeviceJobType

                };

                // rotation = 1 * Math.PI;
                if (!oldOne) {
                    oldOne = Gantrycrane(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('gantrycrane');
                    that.gantrycranes.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000, true);
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                gantrycranes.push(v);
            })

            this._observer._popLayer.addObject('gantrycrane', gantrycranes);

        },



        /*
         *
         */
        addBridgecranes: function (datas) {
            var that = this; //
            var selected = that._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var rotation = 0;
            var bridgecranes = [];

            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (!v.x && v.x !== 0) {
                    return true;
                }
                if (v.x < 950) {
                    rotation = -0.4;
                    v.y += 6;
                } else {
                    rotation = -0.04;
                    v.y += 15;
                }
                if (that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === undefined || that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'bridgecrane' && selected._equipmentCode === v.OBJ_EQUIPMENT_CODE) {
                    isSelected = true;

                } else {
                    isSelected = false;
                }

                //判断桥吊是否在工作和工作类型
                //var runStatus = 1;
                var isShipment = false,
                    shipmentStatus = '';
                // if ( v.STA_WORK_STATUS == 'WORK') {
                //     isShipment = true;
                if (v.STA_JOB_TYPE === 'DSCH') {
                    shipmentStatus = 'containerOut';
                    isShipment = true;
                } else if (v.STA_JOB_TYPE === 'LOAD') {
                    shipmentStatus = 'containerIn';
                    isShipment = true;
                } else {
                    shipmentStatus = 'hide';
                    isShipment = false;
                }
                var oldOne = _.findWhere(that.bridgecranes, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var randomDelta = 0;
                //randomDelta = Math.random() * 5 % 5;
                //console.log( randomDelta );
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': that._zr,
                    'is25d': that.is25d,
                    'observer': that._observer,
                    'zlevel': 40,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'rotation': rotation,
                    'jobStatus': v.STA_WORK_STATUS,
                    //'types':v.types,    //桥吊类型（长、中、短）
                    // 'types':v.OBJ_EQUIPMENT_TYPE,
                    'workType': v.STA_JOB_TYPE,
                    'identity': v.OBJ_ID,
                    'overMap': that,
                    'isShow': v.isShow,
                    'isShipment': isShipment,
                    'shipmentStatus': shipmentStatus,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isSelected': isSelected,
                    'isShowQuota': that.isShowQuotaDevice,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };

                if (!oldOne) {
                    oldOne = Bridgecrane(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('bridgecrane');
                    that.bridgecranes.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000, true);
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                bridgecranes.push(v);
            })
            //this._equipments[6] = this.bridgecranes;
            // this.switchQuota(true);
            this._observer._popLayer.addObject('bridgecrane', bridgecranes);
        },

        /*
         *
         */
        addStackers: function (datas) {
            var that = this;
            var selected = that._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var stackers = [];
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (that.stackersChecked[v.OBJ_EQUIPMENT_CODE] === undefined || that.stackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    that.stackersChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    that.stackersChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'stacker' && selected._equipmentCode === v.OBJ_EQUIPMENT_CODE) {
                    isSelected = true;

                } else {
                    isSelected = false;
                }

                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;               
                var oldOne = _.findWhere(that.stackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'zlevel': 31,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x + that.updateX,
                    'targetY': v.y + that.updateY,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'rotation': v.rotation,        // ???????
                    'jobStatus': v.STA_WORK_STATUS,
                    'workType': v.STA_JOB_TYPE,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': that.isShowQuotaDevice,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Stacker(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('stacker');
                    that.stackers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000);
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }

                stackers.push(v);
            })
            this._observer._popLayer.addObject('stacker', stackers);

        },

        /*
         *
         */
        addReachstackers: function (datas) {
            var that = this;
            var selected = that._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var reachstackers = [];
            $.each(datas, function (k, v) {
                if (!that.isInTheView(v)) {
                    return true;
                }
                if (that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === undefined || that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'reachstacker' && selected._equipmentCode === v.OBJ_EQUIPMENT_CODE) {
                    isSelected = true;

                } else {
                    isSelected = false;
                }
                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;
                //console.log( randomDelta );
                var oldOne = _.findWhere(that.reachstackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': that._zr,
                    'observer': that._observer,
                    'zlevel': 30,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x + that.updateX,
                    'y': v.y + that.updateY,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': that.lastDrawX,
                    'deltaY': that.lastDrawY,
                    'rotation': v.rotation,       // ????
                    'jobStatus': v.STA_WORK_STATUS,
                    'workType': v.STA_JOB_TYPE,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': that.isShowQuotaDevice,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Reachstacker(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('reachstacker');
                    that.reachstackers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000);
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                reachstackers.push(v);
            })
            //console.log(that.reachstackers);
            //this._equipments[8] = this.reachstackers;
            // this.switchQuota(true);
            this._observer._popLayer.addObject('reachstacker', reachstackers);
        },
        /*
        * 以热力图方式显示堆场
        */
        showYardByThermodynamic: function (arg) {
            this.isShowYardByThermodynamic = true;
            $.each(this.yards, function (k, v) {
                v.showByThemodynamic(arg);
            })
        },
        /*
         * 以类型方式显示堆场
         */
        showYardByFunctiontype: function () {
            this.isShowYardByThermodynamic = false;
            $.each(this.yards, function (k, v) {
                v.showByFunctiontype();
            })
        },
        /*
         * 显示堆场的作业动线图
         */
        showYardJobLine: function (arg) {
            this.isShowJobLine = true;
            $.each(this.yards, function (k, v) {
                v.showJobLine(arg);
            })
        },
        /*
         * 显示卡车轨迹
         */
        showContainerTrailMap: function (data) {
            if (this.trailMap) {
                this.trailMap.remove();
                delete this.trailMap;
            }
            this.trailMap = TRAIL({
                'zr': this._zr,
                'observer': this._observer,
                'zlevel': 32,
                'initX': 0,
                'initY': 0,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel,
                'points': data,
                'isShow': true
            });
            this.trailMap.draw();
        },
        /*
         * 隐藏卡车轨迹
         */
        hideContainerTrailMap: function () {
            this.trailMap && this.trailMap.remove();
        },
        /*
         * 显示GPSLine
         */
        showGPSLineMap: function (data) {
            if (this.GPSLineMap) {
                this.GPSLineMap.remove();
                delete this.GPSLineMap;
            }
            this.GPSLineMap = TRAIL({
                'zr': this._zr,
                'observer': this._observer,
                // 'zlevel': 23,
                'zlevel': 100,
                'initX': 0,
                'initY': 0,
                // 'deltaX': -35,
                // 'deltaY': -84,
                // 'position': [-158, -76],
                'deltaX': this.lastDrawX,
                'deltaY': this.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel,
                'points': data,
                'isShow': true
            });
            this.GPSLineMap.draw();
            this.GPSPointMap = POINTS({
                'zr': this._zr,
                'observer': this._observer,
                // 'zlevel': 23,
                'zlevel': 101,
                'initX': 0,
                'initY': 0,
                'fillColor': 'red',
                'deltaX': this.lastDrawX,
                'deltaY': this.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel,
                'points': data,
                'isShow': true
            })
            this.GPSPointMap.draw();
        },
        /*
         * 隐藏卡车轨迹
         */
        hideGPSLineMap: function () {
            this.GPSLineMap && this.GPSLineMap.remove();
            this.GPSPointMap && this.GPSPointMap.remove();
        },
        /*
         * 显示摄像头
         */
        showCamera: function () {
            $.each(this.cameras, function (idx, item) {
                item.switchCamera(true);
            })
        },
        /*
         * 隐藏摄像头
         */
        hideCamera: function () {
            $.each(this.cameras, function (idx, item) {
                item.switchCamera(false);
            })
        },
        /*
         * 显示摄像头
         */
        showHydrant: function () {
            $.each(this.hydrants, function (idx, item) {
                item.switchHydrant(true);
            })
        },
        /*
         * 隐藏摄像头
         */
        hideHydrant: function () {
            $.each(this.hydrants, function (idx, item) {
                item.switchHydrant(false);
            })
        },
        /*
         * 显示传感器
         */
        showSensor: function () {
            $.each(this.sensors, function (idx, item) {
                item.switchSensor(true);
            })
        },
        /*
         * 隐藏传感器
         */
        hideSensor: function () {
            $.each(this.sensors, function (idx, item) {
                item.switchSensor(false);
            })
        },
        /*
         * 显示道路线
         */
        showRoadPolyline: function () {
            if (this.roads) {
                this.roads.forEach(function (item) {
                    item.show();
                })
            }
        },
        // /*
        //  * 显示道路线
        //  */
        // showRoadPolyline: function(data) {
        //     var that = this;
        //     if (this.roadPolyline) {
        //         delete this.roadPolyline;
        //     }
        //     this.roadPolyline = [];
        //     var arr = [];
        //     $.each(data, function(idx, item){
        //         var temp = [];
        //         $.each(item, function(idx, item){
        //             temp.push([that._observer.convertFromLng(item[0]), that._observer.convertFromLat(item[1])]);
        //         })
        //         arr.push(temp);
        //     })
        //     var cfg = {
        //         'zr': that._zr,
        //         'observer': that._observer,
        //         'zlevel': 1000,
        //         'points': arr,
        //         'strokeColor': 'blue',
        //         'isShow': true,
        //         // 'initX': -163,
        //         // 'initY': -77,
        //         'lineWidth': 1,
        //         'deltaX': that.lastDrawX,
        //         'deltaY': that.lastDrawY,
        //         'scaleRatio': this.showScale,
        //         'scaleLevel': this.scaleLevel,
        //     };
        //     var roadPolyline = TRAIL(cfg);
        //     roadPolyline.draw();
        //     that.roadPolyline.push(roadPolyline);

        // },
        /*
         * 隐藏道路线
         */
        hideRoadPolyline: function () {
            if (this.roads) {
                this.roads.forEach(function (item) {
                    item.hide();
                })
            }
        },
        /*
         * 显示道路状况点
         */
        showRoadConditionMap: function (data) {
            var that = this;
            if (this.pointsMap) {
                this.pointsMap.remove();
                delete this.pointsMap;
            }
            this.pointsMap = POINTS({
                'zr': this._zr,
                'observer': this._observer,
                'zlevel': 23,
                'initX': 0,
                'initY': 0,
                'deltaX': that.lastDrawX,
                'deltaY': that.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel,
                'points': data,
                'isShow': true
            });
            this.pointsMap.draw();
        },
        hideRoadConditionMap: function () {
            this.pointsMap && this.pointsMap.remove();
        },
        // /*
        //  * 显示堆场作业点
        //  */
        // showJobPoints:function() {
        //    this.isShowJobPoints = true;
        //    var jobNum = {
        //        'LOAD': 0,
        //        'DSCH': 0,
        //        'RECV': 0,
        //        'DLVR': 0,
        //    };
        //    $.each( this.yards, function(k,v){
        //        $.each( v.jobLine, function( m, n ) {
        //            switch(n.type) {
        //                case 'LOAD': jobNum['LOAD'] = jobNum['LOAD'] + n.NUM; break;
        //                case 'DSCH': jobNum['DSCH'] = jobNum['DSCH'] + n.NUM; break;
        //                case 'RECV': jobNum['RECV'] = jobNum['RECV'] + n.NUM; break;
        //                case 'DLVR': jobNum['DLVR'] = jobNum['DLVR'] + n.NUM; break;
        //            }
        //        })
        //    })
        //    $.each( this.jobPoints, function(k,v){
        //        v.isShow = true;
        //        switch(v.jobType) {
        //            case 'LOAD': v.labelTitle = '装箱量'; v.labelNum = jobNum.LOAD; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //            case 'DSCH': v.labelTitle = '卸箱量'; v.labelNum = jobNum.DSCH; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //            case 'RECV': v.labelTitle = '进箱量'; v.labelNum = jobNum.RECV; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //            case 'DLVR': v.labelTitle = '提箱量'; v.labelNum = jobNum.DLVR; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //        };
        //        // switch(v.jobType) {
        //        //     case 'LOAD': v.labelTitle = '装箱量'; v.labelNum = jobNum.LOAD; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //        //     case 'DSCH': v.labelTitle = '卸箱量'; v.labelNum = jobNum.DSCH; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //        //     case 'RECV': v.labelTitle = '进箱量'; v.labelNum = jobNum.RECV; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //        //     case 'DLVR': v.labelTitle = '提箱量'; v.labelNum = jobNum.DLVR; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
        //        // };
        //        v.draw(); 
        //        switch(v.jobType) {
        //            case 'LOAD': v.sourceText = v.labelNum; break;
        //            case 'DSCH': v.sourceText = v.labelNum; break;
        //            case 'RECV': v.sourceText = v.labelNum; break;
        //            case 'DLVR': v.sourceText = v.labelNum; break;
        //        };
        //    })
        // },
        /*
         * 显示堆场作业点
         */
        showJobPoints: function () {
            this.isShowJobPoints = true;
            var jobNum = {
                'LOAD': { 'berth0': 0, 'berth1': 0, 'berth2': 0, 'berth3': 0, 'berth4': 0, 'berth5': 0 },
                'DSCH': { 'berth0': 0, 'berth1': 0, 'berth2': 0, 'berth3': 0, 'berth4': 0, 'berth5': 0 },
                'RECV': 0,
                'DLVR': 0
            };
            $.each(this.yards, function (k, v) {
                $.each(v.jobLine, function (m, n) {
                    switch (n.type) {
                        case 'LOAD': jobNum['LOAD']['berth' + n.BERTH.trim()] += n.NUM; break;
                        case 'DSCH': jobNum['DSCH']['berth' + n.BERTH.trim()] += n.NUM; break;
                        case 'RECV': jobNum['RECV'] = jobNum['RECV'] + n.NUM; break;
                        case 'DLVR': jobNum['DLVR'] = jobNum['DLVR'] + n.NUM; break;
                    }
                })
            })
            $.each(this.jobPoints, function (k, v) {
                v.isShow = true;
                switch (v.jobType) {
                    case 'berth0': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth0, jobNum.DSCH.berth0]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'berth1': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth1, jobNum.DSCH.berth1]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'berth2': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth2, jobNum.DSCH.berth2]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'berth3': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth3, jobNum.DSCH.berth3]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'berth4': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth4, jobNum.DSCH.berth4]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'berth5': v.labelTitle = ['装箱量', '卸箱量']; v.labelNum = [jobNum.LOAD.berth5, jobNum.DSCH.berth5]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-30, -100]; v.linePoints = [[0, 0], [20, -44]]; break;
                    case 'RECV': v.labelTitle = ['进箱量']; v.labelNum = [jobNum.RECV]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                    case 'DLVR': v.labelTitle = ['提箱量']; v.labelNum = [jobNum.DLVR]; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                };
                v.draw();
                v.sourceText = v.labelNum;
            })
        },
        /*
         * 隐藏堆场的作业动线图
         */
        hideYardJobLine: function () {
            this.isShowJobLine = false;
            $.each(this.yards, function (k, v) {
                v.hideJobLine();
            })
        },
        /*
         * 隐藏场内作业点
         */
        hideJobPoints: function () {
            this.isShowJobPoints = false;
            $.each(this.jobPoints, function (k, v) {
                v.isShow = false;
                v.hide();
            })
        },
        /*
         * 获取设备下标及信息
         */
        getIndexOfListAndInfo: function (args) {
            var eqps = [];
            var idxObj = {};
            var k = 0;
            switch (args.deviceType) {
                case 'TRUCK':
                case 'container':
                    eqps = this.containers; k = 4;
                    break;
                case 'RTG':
                case 'gantrycrane':
                    eqps = this.gantrycranes;
                    k = 5;
                    break;
                case 'QC':
                case 'bridgecrane':
                    eqps = this.bridgecranes;
                    k = 6;
                    break;
                case 'ES':
                case 'stacker':
                    eqps = this.stackers;
                    k = 7;
                    break;
                case 'RS':
                case 'reachstacker':
                    eqps = this.reachstackers;
                    k = 8;
                    break;
            }
            $.each(eqps, function (m, v) {
                //console.log(v._mapId);
                if (v.identity === args.identity || v._mapId === args._mapId) {
                    idxObj.arrIdx = k;
                    idxObj.devIdx = m;
                    idxObj.obj = v;
                    return false;
                }
            })
            return idxObj.obj ? idxObj : null;
        },
        /*
         * 隐藏选中的设备对象
         */
        hideSelectedEquipment: function () {
            if (this._selectedEquipment) {
                this._selectedEquipment.setSelectedProp && this._selectedEquipment.setSelectedProp(false);
                delete this._selectedEquipment;
            }
        },
        /*
        *  将指定的设备对象设置已选中的设备
        */
        setSelectedEquipmentByDevice: function (device) {
            // this.hideSelectedEquipment();
            var that = this;
            var type = device.deviceType;
            var code = device._equipmentCode;
            var eqps = undefined;
            switch (type) {
                case 'TRUCK':
                case 'container':
                    eqps = this.containers;
                    break;
                case 'RTG':
                case 'gantrycrane':
                    eqps = this.gantrycranes;
                    break;
                case 'QC':
                case 'bridgecrane':
                    eqps = this.bridgecranes;
                    break;
                case 'ES':
                case 'stacker':
                    eqps = this.stackers;
                    break;
                case 'RS':
                case 'reachstacker':
                    eqps = this.reachstackers;
                    break;
                case 'camera':
                    eqps = this.cameras;
                    break;
                case 'hydrant':
                    eqps = this.hydrants;
                    break;
                case 'sensor':
                    eqps = this.sensors;
                    break;
                case 'ship':
                    eqps = this.ships;
                    break;
            }

            $.each(eqps, function (m, v) {
                if (v._equipmentCode === code) {
                    that._selectedEquipment = v;
                    return false;
                }
            })
            //console.log(that._selectedEquipment);
        },
        /*
         *  根据设备类型和序号，设置选中设备
         */
        setSelectedEquipment: function (type, equipmentId) {
            var eqps = [];
            var that = this;
            this.hideSelectedEquipment();
            switch (type) {
                case 'TRUCK':
                case 'container':
                    eqps = this.containers;
                    break;
                case 'RTG':
                case 'gantrycrane':
                    eqps = this.gantrycranes;
                    break;
                case 'QC':
                case 'bridgecrane':
                    eqps = this.bridgecranes;
                    break;
                case 'ES':
                case 'stacker':
                    eqps = this.stackers;
                    break;
                case 'RS':
                case 'reachstacker':
                    eqps = this.reachstackers;
                    break;
                case 'camera':
                    eqps = this.cameras;
                    break;
                case 'hydrant':
                    eqps = this.hydrants;
                    break;
                case 'sensor':
                    eqps = this.sensors;
                    break;
                case 'ship':
                    eqps = this.ships;
                    break;
            }
            //console.log( eqps );
            $.each(eqps, function (m, v) {
                //console.log(v);
                if (v._equipmentCode === equipmentId) {
                    //console.log(v);
                    that._selectedEquipment = v;
                    return false;
                }
            })

            if (!that._selectedEquipment) {
                return false;
            }

            that._selectedEquipment.setSelectedProp && that._selectedEquipment.setSelectedProp(true);
            this._observer.showProfilePop(that._selectedEquipment);
            // var args = {
            //         x: type == 'ship' ? (that._selectedEquipment.realPosFrom.x + that._selectedEquipment.realPosTo.x) /2 : that._selectedEquipment.initX,
            //         y: type == 'ship' ? (that._selectedEquipment.realPosFrom.y + that._selectedEquipment.realPosTo.y) /2 : that._selectedEquipment.initY
            // }
            var args = {
                x: that._selectedEquipment.drawX * that.showScale,
                y: that._selectedEquipment.drawY * that.showScale
            }
            this._observer._baseMap.setMapCenter(args);
        },

        /*
         *
         *  根据告警模块的参数定位设备，
         *  {
         *     'name': '',
         *     'number': 'T109',
         *     'type': 'TRUNCK',
         *  }
         *
         */
        setSelectedEquipmentFromAlarm: function (arg) {
            var type = arg.type;
            var equipmentCode = arg.equipmentCode;
            var eqps = null;
            var that = this;
            this.hideSelectedEquipment();
            //console.log( 'setSelectedEquipmentFromAlarm', type, equipmentCode);
            switch (type) {
                case 'TRUCK':
                case 'container':
                case 'T':
                    eqps = this.containers;
                    break;
                case 'RTG':
                case 'gantrycrane':
                    eqps = this.gantrycranes;
                    break;
                case 'QC':
                case 'CR':
                case 'bridgecrane':
                    eqps = this.bridgecranes;
                    break;
                case 'ES':
                case 'stacker':
                    eqps = this.stackers;
                    break;
                case 'RS':
                case 'reachstacker':
                    eqps = this.reachstackers;
                    break;
                case 'camera':
                    eqps = this.cameras;
                    break;
                case 'hydrant':
                    eqps = this.hydrants;
                    break;
                case 'sensor':
                    eqps = this.sensors;
                    break;
                case 'ship':
                    eqps = this.ships;
                    break;
            }

            $.each(eqps, function (m, v) {
                //console.log(v._equipmentCode);
                if (v._equipmentCode === equipmentCode) {
                    //console.log( v._equipmentCode, equipmentCode );
                    that._selectedEquipment = v;
                    return false;
                }
            })

            if (!this._selectedEquipment) {
                return false;
            }
            this._selectedEquipment.setSelectedProp && this._selectedEquipment.setSelectedProp(true);
            this._observer.showProfilePop(this._selectedEquipment);
            var args = {
                x: this._selectedEquipment.initX,
                y: this._selectedEquipment.initY
            }
            this._observer._baseMap.setMapCenter(args);
        },

        /*
         * @ 根据设备类型和id获取设备对象
         * @ param ：
         * @ type | string : 类型
         * @ mapId | num : 地图上的唯一标识
         * @ return: object | object 
         */
        getEqpObjectByTypeId: function (type, mapId) {
            //var pos = { x:0, y:0};
            var eqps = [];
            var obj = null;
            //console.log( 'getEqpObjectByTypeId', type, mapId);
            switch (type) {
                case 'container': eqps = this.containers; break;
                case 'gantrycrane': eqps = this.gantrycranes; break;
                case 'bridgecrane': eqps = this.bridgecranes; break;
                case 'stacker': eqps = this.stackers; break;
                case 'reachstacker': eqps = this.reachstackers; break;
                case 'camera': eqps = this.cameras; break;
                case 'hydrant': eqps = this.hydrants; break;
                case 'sensor': eqps = this.sensors; break;
                case 'ship': eqps = this.ships; break;
            }
            $.each(eqps, function (k, v) {
                if (v._equipmentCode === mapId) {
                    obj = v;
                    return false;
                }
            })
            return obj;
        },

        /*
         *  设置设备偏移位置：根据左上角堆场WA设置
         */
        setDevicePos: function () {
            var obj = this._observer.getXY(posInfo.left_top_yard.points[0][0], posInfo.left_top_yard.points[0][1]);
            this.lastDrawX = (obj.x - posInfo.left_top_yard.initX * this.showScale) / this.showScale;
            this.lastDrawY = (obj.y - posInfo.left_top_yard.initY * this.showScale) / this.showScale;

            // var temp;
            // $.each(this.yards, function(idx, item){
            //     if(item.yardName == 'WA'){
            //         temp = item;
            //         return true;
            //     }
            // })
            // var offsetX = obj.x - item.initX;
            // var offsetY = obj.y - item.initY;
        },

        /*
         * 设置地图中心位置
         */
        mapDragEndByMapCenter: function (args) {
            var obj = this._observer.getLngLat(args.x, args.y);
            this.map.setCenter(new AMap.LngLat(obj.lng, obj.lat));
        },

        /*
         * 响应地图拖放
         */
        mapDragEnd: function (args) {
            this.setDevicePos();
            this.handler(args);

        },

        /*
         * @ 响应地图放大
         */
        mapZoomChange: function (arg) {
            var curYardLength = this._observer.getDistance(posInfo.left_top_yard.points[0], posInfo.left_top_yard.points[1]);
            this.showScale = curYardLength / this.baseyardLength * this.baseshowScale;        // 跟初始化的时候比较
            this.scaleLevel = this.showScale > 2 ? 3 : 1;
            this.mapDragEnd();
        },

        /*
         * @ 所有地图附着物层响应地图拖动及缩放动作
         * @ {
         *    x: 横向位移数据,
         *    y: 纵向位移数据,
         *    scale: 缩放比例,
         *    scaleLevel: 显示级别
         *   }
         */
        handler: function () {
            var equipments = [
                this.labels, this.berths, this.berthFlags, this.milestones, this.tracks, 
                this.jobPoints, this.yards, this.ships, this.cameras,this.hydrants, 
                this.sensors, this.containers, this.gantrycranes,this.bridgecranes, 
                this.stackers, this.reachstackers, this.roads
            ];
            var event = {
                type: 'redrawByPosScale',
                args: {
                    x: this.lastDrawX,
                    y: this.lastDrawY,
                    scale: this.showScale,
                    scaleLevel: this.scaleLevel
                }
            }
            // if( args && args.isSetCenter ){
            //      this._observer.moveToPosition( event.args, true );
            // }else{
            //      this._observer.moveToPosition( event.args );
            // }

            $.each(equipments, function (k, equ) {
                if (!equ.length) {
                    return true;
                }
                /*var type = equ[0]._type;               
                var startTime = new Date().valueOf();*/

                $.each(equ, function (l, v) {
                    v['redrawByPosScale'] && v['redrawByPosScale'].call(this, event.args);
                })
                /*var endTime = new Date().valueOf();
                if( type == 'gantrycrane'){
                    console.log(type, endTime - startTime );
                }*/


            })
            // this.roads && this.roads.redrawByPosScale(event.args);
            this.trailMap && this.trailMap.redrawByPosScale(event.args);
            this.pointsMap && this.pointsMap.redrawByPosScale(event.args);
            this.GPSLineMap && this.GPSLineMap.redrawByPosScale(event.args);
            this.GPSPointMap && this.GPSPointMap.redrawByPosScale(event.args);

            this._observer._popLayer._infoPop.setInfoPopPositionByDevice(this._selectedEquipment);
        },

        /*
         * @ 响应切换显示关键指标
         * @ param: bool 
         * @ 是否显示（true：显示, false: 隐藏）
         */
        switchDeviceQuota: function (isShowQuota) {
            this.isShowQuotaDevice = isShowQuota;
            var equipments = [
                this.labels, this.berths, this.berthFlags, this.tracks, this.jobPoints, this.ships, 
                this.cameras, this.hydrants, this.containers, this.gantrycranes, this.bridgecranes, 
                this.stackers, this.reachstackers
            ];
            $.each(equipments, function (k, equ) {
                $.each(equ, function (l, v) {
                    v['switchQuota'] && v['switchQuota'].call(this, isShowQuota);
                })
            })

        },
        switchYardQuota: function (isShowQuota) {
            this.isShowQuotaYard = isShowQuota;
            var equipments = [this.yards];
            $.each(equipments, function (k, equ) {
                $.each(equ, function (l, v) {
                    v['switchQuota'] && v['switchQuota'].call(this, isShowQuota);
                })
            })

        },

        /*
          * 显示设备作业状态
          */
        showDeviceJobType: function () {
            this.isShowDeviceJobType = true;
            var equipments = [
                this.tracks, this.ships, this.cameras, this.hydrants, this.containers, this.gantrycranes,
                this.bridgecranes, this.stackers, this.reachstackers
            ];
            $.each(equipments, function (k, equ) {
                $.each(equ, function (l, v) {
                    v['showDeviceJobType'] && v['showDeviceJobType'].call(this, true);
                })
            })

        },

        /*
          * 隱藏设备作业状态
          */
        hideDeviceJobType: function () {
            this.isShowDeviceJobType = false;
            var equipments = [
                this.tracks, this.ships, this.cameras, this.hydrants, this.containers, this.gantrycranes,
                this.bridgecranes, this.stackers, this.reachstackers
            ];
            $.each(equipments, function (k, equ) {
                $.each(equ, function (l, v) {
                    v['hideDeviceJobType'] && v['hideDeviceJobType'].call(this, false);
                })
            })

        },

        /*
         * 获取时间间隔
         */
        getTimeDiff: function (startTime, endTime) {
            var timeDiff = 0;
            if (!!startTime) {
                startTime = new Date(startTime).getTime();
            }
            if (!!endTime) {
                endTime = new Date(endTime).getTime();
            }
            timeDiff = endTime - startTime;
            timeDiff = timeDiff / 1000 / 60;
            return Math.round(timeDiff);
        },
        /*
         * @ 是否在可见区域
         * @ param: points 
         * @ 是否显示（true：显示, false: 隐藏）
        */
        isInTheView: function (points) {
            var borderX = 950;
            var isVisible = true;
            if (!_.isArray(points)) {
                if (points.x && points.x > borderX) {
                    isVisible = false;
                }
                return isVisible;
            }
            $.each(points, function (k, p) {
                if (p.x && p.x > borderX) {
                    isVisible = false;
                    return true;
                }
            })
            return isVisible;
        }
    });


    return OVERMAP;
});