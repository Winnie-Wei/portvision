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
    //var updateX = -35;
    //var updateY = -100;
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
            this._observer = cfg.observer;
            this.showScale = cfg.showScale || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
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
            this.pointsMap = null;
            return this;
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
            }
        },

        /*
         *
         */
        addLabels: function (datas) {
            var self = this;
            $.each(datas, function (k, v) {
                $.each(v.vertices, function (k, p) {
                    p.x = p.x + updateX;
                    p.y = p.y + updateY;
                })
                if (!self.isInTheView(v.vertices)) {
                    return true;
                }
                var oldOne = _.findWhere(self.labels, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 20,
                    'fillColor': v.fillColor,
                    'strokeColor': v.strokeColor,
                    'vertices': v.vertices,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'text': v.text,
                    'isShow': true
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('label');
                    self.labels.push(oldOne);
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
            var self = this;
            var berthPoints = datas.berth;
            var mileStones = datas.milestone;
            $.each(berthPoints, function (k, v) {
                var strokeColor = '#449fe6';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                $.each(v.POINT, function (k, p) {
                    p.x = p.x + updateX;
                    p.y = p.y + updateY;
                })
                var oldOne = _.findWhere(self.berths, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'fillColor': '#b7d7ea',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': self.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('berth');
                    self.berths.push(oldOne);
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
                    p.x = p.x + updateX;
                    p.y = p.y + updateY;
                })
                var oldOne = _.findWhere(self.berths, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'fillColor': '#b7d7ea',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': self.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('milestone');
                    self.milestones.push(oldOne);
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
            var self = this;
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                var oldOne = _.findWhere(self.berthFlags, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 34,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'berthTitle': v.berthTitle,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': self.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = BerthFlag(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('berthFlag');
                    self.berthFlags.push(oldOne);
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
            var self = this;
            $.each(datas, function (k, v) {
                $.each(v.POINT, function (l, n) {
                    n.x += updateX;
                    n.y += updateY;
                })
                /*if( !self.isInTheView( v.POINT ) ){
                    return true;
                }*/
                var oldOne = _.findWhere(self.tracks, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 19,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'points': v.POINT,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': self.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = Track(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('track');
                    self.tracks.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
            })
        },

        addJobPoints: function (datas) {
            var self = this;
            $.each(datas, function (k, v) {
                var strokeColor = '#F58F00';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                // y值偏移
                // v.y = v.y + 100;
                var oldOne = _.findWhere(self.jobPoints, { '_mapId': v._mapId });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 45,
                    'fillColor': v.fillColor,
                    'strokeColor': v.fillColor,
                    'position': { x: v.x, y: v.y },
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'text': '123',
                    'isShow': self.isShowJobPoints,
                    'jobType': v.type
                };
                if (!oldOne) {
                    oldOne = JobPoint(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('jobPoint');
                    self.jobPoints.push(oldOne);
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
            var self = this;
            $.each(datas, function (k, v) {
                var POINT = [];
                $.each(v.GPS_COORDINATES, function (m, n) {
                    POINT.push(
                        {
                            'x': self._observer.convertFromLng(n.lng) + updateX,
                            'y': self._observer.convertFromLat(n.lat) + updateY
                        }
                    );
                });
                if (!self.isInTheView(POINT)) {
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
                randomDelta = Math.abs(randomDelta) > 5 ? randomDelta : 0;
                var oldOne = _.findWhere(self.yards, { '_mapId': v.OBJ_YARD_CODE });
                //oldOne && console.log( oldOne.teu );
                //var sourceTeu = oldOne && oldOne.teu ? oldOne.teu : (v.TEU - randomDelta) < 0 ? 0 : v.TEU - randomDelta;  
                var sourceTeu = v.TEU + randomDelta;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 22,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
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
                    'isShowQuota': self.isShowQuotaYard,
                    'jobLine': v.jobLine,
                    'isShowByThemodynamic': self.isShowYardByThermodynamic,
                    'isShowJobLine': self.isShowJobLine
                };
                if (!oldOne) {
                    oldOne = Yard(cfg);
                    oldOne.setMapId(v.OBJ_YARD_CODE);
                    oldOne.setMapType('yard');
                    self.yards.push(oldOne);
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
            var self = this;
            var ships = [];
            var isSelected = false;
            var selected = self._selectedEquipment;
            $.each(datas, function (k, v) {
                if (v.STA_BERTH_REFERENCE > 6) return;
                v.x = berthPosition[v.STA_BERTH_REFERENCE - 1].x + updateX;
                v.y = berthPosition[v.STA_BERTH_REFERENCE - 1].y + updateY;
                v.rotation = berthPosition[v.STA_BERTH_REFERENCE - 1].rotation;
                console.log(v.rotation, berthPosition[v.STA_BERTH_REFERENCE - 1]);
                var timeDiff;
                if (v.STA_ATA) {
                    // timeDiff = self.getTimeDiff('2017-9-20 11:27:00', new Date());
                    timeDiff = self.getTimeDiff(v.STA_ATA, new Date());
                    v.isArriving = timeDiff < 1 ? true : false;
                } else {
                    v.isArriving = false;
                }

                if (v.STA_ATD) {
                    // timeDiff = self.getTimeDiff(new Date(), new Date());
                    timeDiff = self.getTimeDiff(v.STA_ATD, new Date());
                    v.isLeaving = timeDiff < 1 ? true : false;
                    // v.isLeaved = timeDiff > 1 ? true : false;
                } else {
                    v.isLeaving = false;
                }
                if (selected && selected._type === 'ship' && selected._equipmentCode === v.OBJ_VESSEL_CODE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(self.ships, { '_equipmentCode': v.OBJ_VESSEL_CODE });
                console.log(v);
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 34,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isArriving': v.isArriving,
                    'isLeaving': v.isLeaving,
                    'isLeaved': v.isLeaved,
                    'routeName': v.OBJ_VESSEL_UN_CODE,
                    'boatWidth': v.boatWidth,
                    'posFrom': parseInt(v.GPS_ACTUAL_POSITION_FROM),
                    'posTo': parseInt(v.GPS_ACTUAL_POSITION_TO),
                    'isShow': self.isShowEquipmentObject,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Ship(cfg);
                    oldOne.setMapType('ship');
                    oldOne.setEquipmentCode(v.OBJ_VESSEL_CODE);
                    self.ships.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    self._selectedEquipment = oldOne;
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
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (selected && selected._type === 'camera' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(self.cameras, { '_equipmentCode': v.ID });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 34,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'jobStatus': v.jobStatus,
                    'isShow': self.isShowEquipmentObject,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Camera(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('camera');
                    oldOne.setEquipmentCode(v.ID);
                    self.cameras.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
            })
            //this._equipments[3] = this.cameras;          
        },

        /**
         * desc: 添加消防栓数据
         */
        addHydrant: function (datas) {
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected = false;
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (selected && selected._type === 'hydrant' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(self.sensors, { '_equipmentCode': v.ID });
                // 过滤前4个消防栓的位置
                if (k < 4) {
                    v.y = v.y + 5;
                }
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 42,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    // 'gps': v.GPS_COORDINATES,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    // 'rotation' : v.rotation,
                    // 'jobStatus': v.jobStatus,
                    'isShow': self.isShowEquipmentObject || true,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Hydrant(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('hydrant');
                    oldOne.setEquipmentCode(v.ID);
                    self.hydrants.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
            })
        },

        /**
         * desc: 添加消防栓数据
         */
        addSensor: function (datas) {
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected = false;
            var sensors = [];
            $.each(datas, function (k, v) {
                if (selected && selected._type === 'sensor' && selected._equipmentCode === v.ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(self.sensors, { '_equipmentCode': v.ID });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 42,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    // 'gps': v.GPS_COORDINATES,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    // 'rotation' : v.rotation,
                    // 'jobStatus': v.jobStatus,
                    'isSelected': isSelected,
                    'isShow': self.isShowEquipmentObject || true,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Sensor(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('sensor');
                    oldOne.setEquipmentCode(v.ID);
                    self.sensors.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
            })
        },

        addContainers: function (datas) {
            //var startTime = new Date().valueOf();
            var self = this;
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var containers = [];
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.containersChecked[v.OBJ_TRUCK_CODE] == undefined || self.containersChecked[v.OBJ_TRUCK_CODE] === true) {
                    v.isShow = true;
                    self.containersChecked[v.OBJ_TRUCK_CODE] = true;
                } else {
                    v.isShow = false;
                    self.containersChecked[v.OBJ_TRUCK_CODE] = false;
                }
                if (!self.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'container' && selected._equipmentCode === v.OBJ_TRUCK_CODE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                //console.log( _.findWhere(oldContainers, {'identity': v.OBJ_ID}));
                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;
                //console.log( randomDelta );
                var oldOne = _.findWhere(self.containers, { '_equipmentCode': v.OBJ_TRUCK_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var rotation = Math.atan2(v.x - sourceX, v.y - sourceY) - 1.5;  // 弧度数
                if (rotation === -1.5) {
                    rotation = - 1.05 * Math.PI;
                }

                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 33,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
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
                    'efficiency': v.EFFICIENCY,
                    'isShowQuota': self.isShowQuotaDevice,
                    'isCarryCargo': !v.OBJ_TRUCK_EMPTYCTN_FLAG,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                // rotation = 1 * Math.PI;
                if (!oldOne) {
                    oldOne = Container(cfg);
                    oldOne.setMapType('container');
                    oldOne.setEquipmentCode(v.OBJ_TRUCK_CODE);
                    self.containers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                containers.push(v);

            })

            /*var endTime = new Date().valueOf();
            if((endTime - startTime)>10){
                console.log( this.containers );
                console.log(containers.length)
                console.log('containers', endTime - startTime );
            }*/

            this._observer._popLayer.addObject('container', containers);
        },



        /*
         *  龙门吊
         */
        addGantrycranes: function (datas) {
            //var startTime = new Date().valueOf();
            var self = this;
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var gantrycranes = [];

            $.each(datas, function (k, v) {
                if (!self._zr) {
                    return true;
                }
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] == undefined || self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!self.isShowEquipmentObject) {
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

                if (v.STA_WORK_STATUS === 'WORK') {
                    isShipment = true;
                    if (v.STA_JOB_TYPE === 'DLVR') {
                        shipmentStatus = 'containerOut';
                    } else if (v.STA_JOB_TYPE === 'RECV') {
                        shipmentStatus = 'containerIn';
                    } else {
                        shipmentStatus = 'hide';
                    }
                } else {
                    isShipment = false;
                }

                var oldOne = _.findWhere(self.gantrycranes, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var randomDelta = 0;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;

                // 真实两个龙门吊方向处理 （仅显示 后期根据实际情况）
                if (v.GPS_EQUIPMENT_CODE === 'R02' || v.GPS_EQUIPMENT_CODE === 'R01') {
                    // v.GPS_DIRECTION = -(v.GPS_DIRECTION / 180 * Math.PI); // R02 35° 基线以y轴为准
                    v.GPS_DIRECTION = -(25 / 180 * Math.PI);
                }

                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 32,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.GPS_DIRECTION || 0,
                    'jobStatus': v.STA_WORK_STATUS,
                    'identity': v.OBJ_ID,
                    'efficiency': v.EFFICIENCY,
                    'isShipment': v.isShipment,
                    'shipmentStatus': shipmentStatus,
                    'isShow': v.isShow,
                    'deviceData': v,
                    'isSelected': isSelected,
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType

                };

                // rotation = 1 * Math.PI;
                if (!oldOne) {
                    oldOne = Gantrycrane(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('gantrycrane');
                    self.gantrycranes.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                gantrycranes.push(v);
            })

            /*var endTime = new Date().valueOf();
            //console.log('gantrycrane', endTime - startTime );
            if((endTime - startTime)>10){
                console.log( this.gantrycranes );
                console.log(gantrycranes.length)
                console.log('gantrycrane', endTime - startTime );
            }*/

            //this._equipments[5] = this.gantrycranes;  
            // this.switchQuota(true);     
            this._observer._popLayer.addObject('gantrycrane', gantrycranes);

        },

        /*
         *
         */
        addBridgecranes: function (datas) {
            var self = this; //
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var rotation = 0;
            var bridgecranes = [];

            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
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
                if (self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] == undefined || self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!self.isShowEquipmentObject) {
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
                var oldOne = _.findWhere(self.bridgecranes, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var randomDelta = 0;
                //randomDelta = Math.random() * 5 % 5;
                //console.log( randomDelta );
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 40,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': rotation,
                    'jobStatus': v.STA_WORK_STATUS,
                    //'types':v.types,    //桥吊类型（长、中、短）
                    // 'types':v.OBJ_EQUIPMENT_TYPE,
                    'identity': v.OBJ_ID,
                    'overMap': self,
                    'isShow': v.isShow,
                    'isShipment': isShipment,
                    'shipmentStatus': shipmentStatus,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY,
                    'isSelected': isSelected,
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };

                if (!oldOne) {
                    oldOne = Bridgecrane(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('bridgecrane');
                    self.bridgecranes.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(5000, true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
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
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var stackers = [];
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.stackersChecked[v.OBJ_EQUIPMENT_CODE] == undefined || self.stackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    self.stackersChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    self.stackersChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!self.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type === 'stacker' && selected._equipmentCode === v.OBJ_EQUIPMENT_CODE) {
                    isSelected = true;

                } else {
                    isSelected = false;
                }

                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;               
                var oldOne = _.findWhere(self.stackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'zlevel': 31,
                    'x': v.x,
                    'y': v.y,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.rotation,        // ???????
                    'jobStatus': v.STA_WORK_STATUS,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY,
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Stacker(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('stacker');
                    self.stackers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(4000);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }

                stackers.push(v);
            })
            this._observer._popLayer.addObject('stacker', stackers);

        },

        /*
         *
         */
        addReachstackers: function (datas) {
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var reachstackers = [];
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] == undefined || self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
                    v.isShow = true;
                    self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] = true;
                } else {
                    v.isShow = false;
                    self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] = false;
                }
                if (!self.isShowEquipmentObject) {
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
                var oldOne = _.findWhere(self.reachstackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 30,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'sourceX': sourceX,
                    'sourceY': sourceY,
                    'targetX': v.x,
                    'targetY': v.y,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.rotation,       // ????
                    'jobStatus': v.STA_WORK_STATUS,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY,
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Reachstacker(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('reachstacker');
                    self.reachstackerse.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(4000);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                reachstackers.push(v);
            })
            //console.log(self.reachstackers);
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
                'zlevel': 22,
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
         * 显示道路状况点
         */
        showRoadConditionMap: function (data) {
            if (this.pointsMap) {
                this.pointsMap.remove();
                delete this.pointsMap;
            }
            this.pointsMap = POINTS({
                'zr': this._zr,
                'observer': this._observer,
                'zlevel': 220,
                'initX': 0,
                'initY': 0,
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
        /*
         * 显示堆场作业点
         */
        showJobPoints: function () {
            this.isShowJobPoints = true;
            var jobNum = {
                'LOAD': 0,
                'DSCH': 0,
                'RECV': 0,
                'DLVR': 0
            };
            $.each(this.yards, function (k, v) {
                $.each(v.jobLine, function (m, n) {
                    switch (n.type) {
                        case 'LOAD': jobNum['LOAD'] = jobNum['LOAD'] + n.NUM; break;
                        case 'DSCH': jobNum['DSCH'] = jobNum['DSCH'] + n.NUM; break;
                        case 'RECV': jobNum['RECV'] = jobNum['RECV'] + n.NUM; break;
                        case 'DLVR': jobNum['DLVR'] = jobNum['DLVR'] + n.NUM; break;
                    }
                })
            })
            $.each(this.jobPoints, function (k, v) {
                v.isShow = true;
                switch (v.jobType) {
                    case 'LOAD': v.labelTitle = '装箱量'; v.labelNum = jobNum.LOAD; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                    case 'DSCH': v.labelTitle = '卸箱量'; v.labelNum = jobNum.DSCH; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                    case 'RECV': v.labelTitle = '进箱量'; v.labelNum = jobNum.RECV; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                    case 'DLVR': v.labelTitle = '提箱量'; v.labelNum = jobNum.DLVR; v.sourceText = v.sourceText || v.labelNum; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                };
                // switch(v.jobType) {
                //     case 'LOAD': v.labelTitle = '装箱量'; v.labelNum = jobNum.LOAD; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                //     case 'DSCH': v.labelTitle = '卸箱量'; v.labelNum = jobNum.DSCH; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                //     case 'RECV': v.labelTitle = '进箱量'; v.labelNum = jobNum.RECV; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                //     case 'DLVR': v.labelTitle = '提箱量'; v.labelNum = jobNum.DLVR; v.sourceText = v.labelNum - 10; v.targetText = v.labelNum; v.recPosition = [-160, -100]; v.linePoints = [[0, 0], [-30, -67], [-64, -67]]; break;
                // };
                v.draw();
                switch (v.jobType) {
                    case 'LOAD': v.sourceText = v.labelNum; break;
                    case 'DSCH': v.sourceText = v.labelNum; break;
                    case 'RECV': v.sourceText = v.labelNum; break;
                    case 'DLVR': v.sourceText = v.labelNum; break;
                };
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
        *  将指定的设备对象设置已选中的设备
        */
        setSelectedEquipmentByDevice: function (device) {
            this.hideSelectedEquipment();
            var self = this;
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
                    self._selectedEquipment = v;
                    return false;
                }
            })
            //console.log(self._selectedEquipment);
        },
        /*
         *  根据设备类型和序号，设置选中设备
         */
        setSelectedEquipment: function (type, equipmentId) {
            var eqps = [];
            var self = this;
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
            }
            //console.log( eqps );
            $.each(eqps, function (m, v) {
                //console.log(v);
                if (v._equipmentCode === equipmentId) {
                    //console.log(v);
                    self._selectedEquipment = v;
                    return false;
                }
            })

            if (!self._selectedEquipment) {
                return false;
            }

            self._selectedEquipment.setSelectedProp && self._selectedEquipment.setSelectedProp(true);
            this._observer.showProfilePop(self._selectedEquipment);
            var args = {
                x: self._selectedEquipment.initX,
                y: self._selectedEquipment.initY
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
            var self = this;
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
            }

            $.each(eqps, function (m, v) {
                //console.log(v._equipmentCode);
                if (v._equipmentCode === equipmentCode) {
                    //console.log( v._equipmentCode, equipmentCode );
                    self._selectedEquipment = v;
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
         * 隐藏选中的设备对象
         */
        hideSelectedEquipment: function () {
            if (this._selectedEquipment) {
                this._selectedEquipment.setSelectedProp && this._selectedEquipment.setSelectedProp(false);
                delete this._selectedEquipment;
            }
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
         * 设置地图中心位置
         */
        mapDragEndByMapCenter: function (args) {
            this.deltaX = args.x;
            this.deltaY = args.y;
            this.lastDrawX = this.initX + this.deltaX;
            this.lastDrawY = this.initY + this.deltaY;
            this.newDrawX = this.lastDrawX + this.deltaX;
            this.newDrawY = this.lastDrawY + this.deltaY;
            this.handler(args);
        },

        /*
         * 响应地图拖放
         */
        mapDragEnd: function (args) {
            this.deltaX = args.x;
            this.deltaY = args.y;
            this.lastDrawX = this.initX + this.deltaX;
            this.lastDrawY = this.initY + this.deltaY;
            this.newDrawX = this.lastDrawX + this.deltaX;
            this.newDrawY = this.lastDrawY + this.deltaY;
            this.handler(args);

        },

        /*
         * @ 响应地图放大
         */
        mapZoomChange: function (arg) {
            this.showScale = arg;
            this.handler();

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
        handler: function (args) {
            var equipments = [
                this.labels, this.berths, this.berthFlags, this.milestones, this.tracks, 
                this.jobPoints, this.yards, this.ships, this.cameras,this.hydrants, 
                this.sensors, this.containers, this.gantrycranes,this.bridgecranes, this.stackers, this.reachstackers
            ];
            var event = {
                type: 'redrawByPosScale',
                args: {
                    x: this.lastDrawX,
                    y: this.lastDrawY,
                    scale: this.showScale,
                    scaleLevel: this.scaleLevel
                }
            };
            if (args && args.isSetCenter) {
                this._observer.moveToPosition(event.args, true);
            } else {
                this._observer.moveToPosition(event.args);
            }

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
            this.trailMap && this.trailMap.redrawByPosScale(event.args);
            this.pointsMap && this.pointsMap.redrawByPosScale(event.args);
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
                this.labels, this.berths, this.berthFlags, this.tracks, this.jobPoints, this.ships, this.cameras, 
                this.hydrants, this.containers, this.gantrycranes,this.bridgecranes, this.stackers, this.reachstackers
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
