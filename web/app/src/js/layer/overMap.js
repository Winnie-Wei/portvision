/**
 * @module port/mod/overMap 地图附着物层
 */
define(function (require) {
    'use strict';

    var McBase = require('base/mcBase');
    var Label = require('mod/titleLabel/titleLabel'); // 标签场区
    var Gate = require('mod/gate/gate'); // 闸口
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
    var BoxMarker = require('mod/boxMarker/boxMarker'); // 箱子标记
    var berthPosition = [{
        'x': 450,
        'y': 88,
        'rotation': -0.35
    },
    {
        'x': 590,
        'y': 136,
        'rotation': -0.35
    },
    {
        'x': 738,
        'y': 188,
        'rotation': -0.35
    },
    {
        'x': 886,
        'y': 240,
        'rotation': -0.35
    },
    {
        'x': 1059,
        'y': 275,
        'rotation': -0.35
    },
    {
        'x': 1256,
        'y': 282,
        'rotation': -0.35
    }
        /*{'x':1059,'y':275,'rotation':-0.04},
        {'x':1256,'y':282,'rotation':-0.04}*/
    ];

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
            this._observer = cfg.observer;
            this.showScale = cfg.showScale || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.updateX = cfg.updateX || 0;
            this.updateY = cfg.updateY || 0;
            this.initX = cfg.initX || 0;
            this.initY = cfg.initY || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.lastDrawX = this.initX + this.deltaX; // 上一次挪动后的定位
            this.lastDrawY = this.initY + this.deltaY;
            this.newDrawX = this.lastDrawX + this.deltaX; // 当前地图定位偏移
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
            return this;
        },
        /*
         *  渲染设备对象
         */
        startRenderObjects: function (during) {
            var self = this;
            var duringTime = during || 3000;
            self.renderEquipments();
            window.setTimeout(function () {
                self.startRenderObjects(duringTime);
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
                this.yards, this.ships, this.cameras, this.hydrants, this.sensors, this.containers,
                this.gantrycranes, this.bridgecranes, this.stackers, this.reachstackers, this.boxMarkers
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
            this.yards = []; // 2堆场   
            //this._equipments.push( this.yards );   
            delete this.ships;
            this.ships = []; // 3船舶  
            //this._equipments.push( this.ships ); 
            delete this.containers;
            this.containers = []; // 4集卡
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
            delete this.boxMarkers; // 箱子当前位置标记
            this.boxMarkers = [];
            delete this.gates; // 闸口
            this.gates = [];
            //this._equipments.push( this.sensors );
            // 用于记录是否选中需要显示
            this.containersChecked = {}; // 集卡是否选中
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
                case 'label':
                    this.addLabels(datas);
                    break;
                case 'berth':
                    this.addBerths(datas);
                    break;
                case 'berthFlag':
                    this.addBerthFlags(datas);
                    break;
                case 'jobPoints':
                    this.addJobPoints(datas);
                    break;
                case 'yard':
                    this.addYards(datas);
                    break;
                case 'ship':
                    this.addShips(datas);
                    break;
                case 'camera':
                    this.addCameras(datas);
                    break;
                case 'hydrant':
                    this.addHydrant(datas);
                    break;
                case 'sensor':
                    this.addSensor(datas);
                    break;
                case 'container':
                    this.addContainers(datas);
                    break;
                case 'gantrycrane':
                    this.addGantrycranes(datas);
                    break;
                case 'bridgecrane':
                    this.addBridgecranes(datas);
                    break;
                case 'bridgeBox':
                    this.addBridgeBoxs(datas);
                    break;
                case 'stacker':
                    this.addStackers(datas);
                    break;
                case 'reachstacker':
                    this.addReachstackers(datas);
                    break;
                case 'track':
                    this.addTracks(datas);
                    break;
                case 'roads':
                    this.addRoads(datas);
                    break;
                case 'boxMarker':
                    this.addBoxMarker(datas);
                    break;
                case 'gate':
                    this.addGates(datas);
                    break;
            }

            this._selectedEquipment && this._observer._popLayer._infoPop.setInfoPopPositionByDevice(this._selectedEquipment);

        },

        /*
         *  显示设备的对象
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
                case 'label':
                    equps = this.labels;
                    break;
                case 'berth':
                    equps = this.berths;
                    break;
                case 'yard':
                    equps = this.yards;
                    break;
                case 'ship':
                    equps = this.ships;
                    break;
                case 'container':
                    equps = this.containers;
                    break;
                case 'gantrycrane':
                    equps = this.gantrycranes;
                    break;
                case 'bridgecrane':
                    equps = this.bridgecranes;
                    break;
                case 'stacker':
                    equps = this.stackers;
                    break;
                case 'reachstacker':
                    equps = this.reachstackers;
                    break;
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
         * 透视坐标变换
         */
        transToPerspective: function (x, y) {
            if (!this.is25d) {
                return {
                    x: x,
                    y: y
                }
            }
            var C = 0;
            var point = {};
            var wx = x * Math.cos(C) - y * Math.sin(C);
            var wy = (x * Math.sin(C) + y * Math.cos(C)) / 2;
            point.x = wx;
            point.y = wy;
            //console.log( point );
            return point;
        },
        /*
         *
         */
        addLabels: function (datas) {
            var self = this;
            $.each(datas, function (k, v) {
                $.each(v.vertices, function (k, p) {
                    p.x = p.x + self.updateX;
                    p.y = p.y + self.updateY;
                    var pp = self.transToPerspective(p.x, p.y);
                    p.x = pp.x;
                    p.y = pp.y;
                })
                if (!self.isInTheView(v.vertices)) {
                    return true;
                }
                var oldOne = _.findWhere(self.labels, {
                    '_mapId': v._mapId
                });
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
         * 闸口
         */
        addGates: function (datas) {
            var self = this;
            $.each(datas, function (k, v) {
                $.each(v.vertices, function (k, p) {
                    p.x = p.x + self.updateX;
                    p.y = p.y + self.updateY;
                    var pp = self.transToPerspective(p.x, p.y);
                    p.x = pp.x;
                    p.y = pp.y;
                })
                if (!self.isInTheView(v.vertices)) {
                    return true;
                }
                var oldOne = _.findWhere(self.gates, {
                    '_mapId': v._mapId
                });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 50,
                    'vertices': v.vertices,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'text': v.text,
                    'isShow': true,
                    'deviceType': 'gate',
                    'workStatus': v.workStatus,
                    'gateType': v.gateType,
                    'workData': v.workData,
                };
                if (!oldOne) {
                    oldOne = Gate(cfg);
                    oldOne.setMapId(k);
                    oldOne.setEquipmentCode(k);
                    oldOne.setMapType('gate');
                    self.gates.push(oldOne);
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
                    p.x = p.x + self.updateX;
                    p.y = p.y + self.updateY;
                    var pp = self.transToPerspective(p.x, p.y);
                    p.x = pp.x;
                    p.y = pp.y;
                })
                var oldOne = _.findWhere(self.berths, {
                    '_mapId': v._mapId
                });
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
                    p.x = p.x + self.updateX;
                    p.y = p.y + self.updateY;
                })
                var oldOne = _.findWhere(self.milestones, {
                    '_mapId': v._mapId
                });
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
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var oldOne = _.findWhere(self.berthFlags, {
                    '_equipmentCode': v.ID
                });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 32,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x + self.updateX,
                    'y': v.y + self.updateY,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'berthTitle': v.REGION_NAME,
                    'rotation': v.rotation || -0.35,
                    'workStatus': v.REGION_STATUS,
                    'isShow': self.isShowEquipmentObject
                };
                if (!oldOne) {
                    oldOne = BerthFlag(cfg);
                    oldOne.setMapId(k);
                    oldOne.setEquipmentCode(v.ID);
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
                    n.x += self.updateX;
                    n.y += self.updateY;
                    var pp = self.transToPerspective(n.x, n.y);
                    n.x = pp.x;
                    n.y = pp.y;
                })
                /*if( !self.isInTheView( v.POINT ) ){
                    return true;
                }*/
                var oldOne = _.findWhere(self.tracks, {
                    '_mapId': v._mapId
                });
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
                    'workStatus': v.jobStatus,
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

        /*
         *  道路线
         */
        addRoads: function (datas) {
            var self = this;
            datas = _.groupBy(datas, function (item) {
                return item.name
            })
            var arr = [];
            $.each(datas, function (idx, item) {
                var temp = [];
                $.each(item, function (idx, item) {
                    var p = [self._observer.convertFromLng(item.lng) + self.updateX, self._observer.convertFromLat(item.lat) + self.updateY];
                    var pp = self.transToPerspective(p[0], p[1]);
                    p[0] = pp.x;
                    p[1] = pp.y;
                    temp.push(p);
                })
                arr.push(temp);
            })
            var cfg = {
                'zr': self._zr,
                'observer': self._observer,
                'zlevel': 20,
                'points': arr,
                'strokeColor': '#ccc',
                'isShow': true,
                // 'initX': -163,
                // 'initY': -77,
                'lineWidth': 1,
                'deltaX': self.lastDrawX,
                'deltaY': self.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel
            };
            var oldOne = TRAIL(cfg);
            oldOne.draw();
            self.roads.push(oldOne);
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
                var pos = {
                    x: v.x + self.updateX,
                    y: v.y + self.updateY
                };
                var pp = self.transToPerspective(pos.x, pos.y);
                pos.x = pp.x;
                pos.y = pp.y;
                var oldOne = _.findWhere(self.jobPoints, {
                    '_mapId': v._mapId
                });
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 45,
                    'fillColor': v.fillColor,
                    'strokeColor': v.fillColor,
                    'position': {
                        x: pos.x,
                        y: pos.y
                    },
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'text': '123',
                    'isShow': self.isShowJobPoints,
                    'jobType': v.type,
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
                    var x = self._observer.convertFromLng(n.lng) + self.updateX;
                    var y = self._observer.convertFromLat(n.lat) + self.updateY;
                    var pp = self.transToPerspective(x, y);
                    x = pp.x;
                    y = pp.y;
                    POINT.push({
                        'x': x,
                        'y': y
                    });
                });
                // if(v.GPS_YARD_CODE == '4J') 
                //     console.log(POINT);
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
                randomDelta = Math.abs(randomDelta) > 0 ? randomDelta : 0;
                var oldOne = _.findWhere(self.yards, {
                    '_mapId': v.OBJ_YARD_CODE
                });
                //var sourceTeu = oldOne && oldOne.teu ? oldOne.teu : v.TEU;  
                var sourceTeu = oldOne && oldOne.teu ? oldOne.teu : v.UNIT;
                // var sourceTeu = v.TEU + randomDelta;                 

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
                    //'capability': v.OBJ_YARD_CAPABILITY,
                    'capability': (14 + 15) * 6 * 5,
                    'teu': v.UNIT,
                    'sourceTeu': sourceTeu,
                    'useratio': v.USERATIO,
                    'number': v.STA_YARD_COUNT,
                    'functiontype': v.FUNCTIONTYPE,
                    'isShowQuota': self.isShowQuotaYard,
                    'jobLine': v.jobLine,
                    'isShowByThemodynamic': self.isShowYardByThermodynamic,
                    'isShowJobLine': self.isShowJobLine,
                    'nextContainer': v.nextCtns && v.nextCtns.length && v.nextCtns[0],
                    'jobContainer': v.currentCtns && v.currentCtns.length && v.currentCtns[0],
                    'jobBoxBayNum': v.currentCtns && v.currentCtns.length && v.currentCtns[0] && v.currentCtns[0].bay,
                    'nextBoxBayNum': v.nextCtns && v.nextCtns.length && v.nextCtns[0] && v.nextCtns[0].bay,
                    'bays': v.bays
                    // 'isShowBox': self.
                };
                /*if( v.nextCtns.length ){
                    console.log( v.OBJ_YARD_CNAME, JSON.stringify(v.nextCtns), v.currentCtns);
                }*/

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
            if (this._observer._playSpeed && this._observer.filterObj.ship === 0) {
                this.removeRecordDeviceByFilter(this.ships);
                return;
            }
            var self = this;
            var ships = [];
            var isSelected = false;
            var selected = self._selectedEquipment;
            //console.log( datas );
            $.each(datas, function (k, v) {
                if (v.STA_BERTH_REFERENCE > 6) return;
                v.x = berthPosition[v.STA_BERTH_REFERENCE - 1].x + self.updateX;
                v.y = berthPosition[v.STA_BERTH_REFERENCE - 1].y + self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                v.rotation = self.is25d ? 0 : berthPosition[v.STA_BERTH_REFERENCE - 1].rotation;
                var timeDiff;
                v.stopAnimator = true;
                v.isArriving = false;
                v.isLeaving = false;
                v.isLeaved = false;

                if (selected && selected._type === 'ship' && selected._equipmentCode === v.STA_VESSEL_REFERENCE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                if (self.shipsChecked[v.STA_VESSEL_REFERENCE] === undefined || self.shipsChecked[v.STA_VESSEL_REFERENCE] === true) {
                    v.isShow = true;
                    self.shipsChecked[v.STA_VESSEL_REFERENCE] = true;
                } else {
                    v.isShow = false;
                    self.shipsChecked[v.STA_VESSEL_REFERENCE] = false;
                }
                if (!self.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                // 船舶状态：V_ATA:抵锚 ， V_BERTH:靠泊 ，V_WAIT_WORK:等开工， V_WORK：开工，V_STOP:停工，V_WAIT_ATD:等离泊，V_ATD:离泊
                //console.log(v.STA_CURRENT_STATUS);  

                var oldOne = _.findWhere(self.ships, {
                    '_equipmentCode': v.STA_VESSEL_REFERENCE
                });
                if (!oldOne) {
                    // 靠泊
                    if (v.STA_CURRENT_STATUS === 'V_BERTH' || v.STA_CURRENT_STATUS === 'V_ATA') {
                        v.stopAnimator = false;
                        v.isArriving = true;
                    }
                    // 离港
                    if (v.STA_CURRENT_STATUS === 'V_ATD' || v.STA_CURRENT_STATUS === 'V_WAIT_ATD') {
                        v.stopAnimator = false;
                        v.isLeaving = true;
                    };

                } else {
                    // 靠泊
                    if ((v.STA_CURRENT_STATUS === 'V_BERTH' || v.STA_CURRENT_STATUS === 'V_ATA') && oldOne.curStatus !== v.STA_CURRENT_STATUS) {
                        v.stopAnimator = false;
                        v.isArriving = true;
                        v.isLeaving = false;
                        //console.log( v.stopAnimator, v.isArriving, v.isLeaving );
                    }
                    // 离港
                    if ((v.STA_CURRENT_STATUS === 'V_ATD' || v.STA_CURRENT_STATUS === 'V_WAIT_ATD') && (oldOne.curStatus !== v.STA_CURRENT_STATUS || ((oldOne.curStatus === v.STA_CURRENT_STATUS) && (oldOne.curStatus === 'V_ATD')))) {
                        v.stopAnimator = false;
                        v.isArriving = false;
                        v.isLeaving = true;
                        v.isLeaved = true;
                        //console.log( v.stopAnimator, v.isArriving, v.isLeaving );

                    };
                }


                /*if　( v.STA_VESSEL_REFERENCE == 'GL5814' ) {
                    console.log( v.STA_CURRENT_STATUS );  
                    if ( oldOne ){
                        console.log( oldOne.curStatus );
                    }   
                }*/
                var startPos = {
                    'x': 330 + self.updateX,
                    'y': 49 + self.updateY
                };
                var endPos = {
                    'x': 973 + self.updateX,
                    'y': 269 + self.updateY
                };
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var spp = self.transToPerspective(startPos.x, startPos.y);
                startPos.x = spp.x;
                startPos.y = spp.y;
                var epp = self.transToPerspective(endPos.x, endPos.y);
                endPos.x = epp.x;
                endPos.y = epp.y;

                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 33,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'startPos': startPos,
                    'endPos': endPos,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'workStatus': v.jobStatus,
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
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Ship(cfg);
                    oldOne.setMapType('ship');
                    oldOne.setEquipmentCode(v.STA_VESSEL_REFERENCE);
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
                if (selected && selected._type === 'camera' && selected._equipmentCode === v.OBJ_ID) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var oldOne = _.findWhere(self.cameras, {
                    '_equipmentCode': v.OBJ_ID
                });
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 34,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x + self.updateX,
                    'y': v.y + self.updateY,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    'rotation': v.rotation,
                    'workStatus': v.jobStatus,
                    'isShow': self.isShowEquipmentObject,
                    'isSelected': isSelected,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Camera(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('camera');
                    oldOne.setEquipmentCode(v.OBJ_ID);
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
                var oldOne = _.findWhere(self.hydrants, {
                    '_equipmentCode': v.ID
                });
                // 过滤前4个消防栓的位置
                if (k < 4) {
                    v.y = v.y + 5;
                }
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 42,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    'x': v.x + self.updateX,
                    'y': v.y + self.updateY,
                    // 'gps': v.GPS_COORDINATES,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'deviceData': v,
                    // 'rotation' : v.rotation,
                    // 'workStatus': v.jobStatus,
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
         * desc: 添加传感器数据
         */
        addSensor: function (datas) {
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected = false;
            var sensors = [];
            $.each(datas, function (k, v) {
                if (selected && selected._type === 'sensor' && selected._equipmentCode === v.OBJ_DETECTOR_CODE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var oldOne = _.findWhere(self.sensors, {
                    '_equipmentCode': v.OBJ_DETECTOR_CODE
                });
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
                    'sensorType': v.OBJ_DETECTOR_TYPE,
                    // 'rotation' : v.rotation,
                    // 'workStatus': v.jobStatus,
                    'isSelected': isSelected,
                    'isShow': self.isShowEquipmentObject || true,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Sensor(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('sensor');
                    oldOne.setEquipmentCode(v.OBJ_DETECTOR_CODE);
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
            if (this._observer._playSpeed && this._observer.filterObj.container === 0) {
                this.removeRecordDeviceByFilter(this.containers);
                this.containers = [];
                return;
            }
            var self = this;
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var containers = [];
            var datasGroup = _.groupBy(datas, function (item) {
                return item.OBJ_TRUCK_CODE;
            })
            // datasGroup = [datasGroup['T202'] ? datasGroup['T202'] : []];
            $.each(datasGroup, function (idx, item) {
                item.sort(self.compare('GPS_INSERT_TIME'));
                var v = item[0];
                if (!v) return true;
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.containersChecked[v.OBJ_TRUCK_CODE] === undefined || self.containersChecked[v.OBJ_TRUCK_CODE] === true) {
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

                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;
                //console.log( randomDelta );

                // 判断是在场集卡，还是新增集卡
                var oldOne = _.findWhere(self.containers, {
                    '_equipmentCode': v.OBJ_TRUCK_CODE
                });
                var sourceX, sourceY;
                // console.log( oldOne );
                if (!self._observer._playSpeed) {
                    sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                } else {
                    // sourceX = oldOne && oldOne.targetXY && oldOne.targetXY[oldOne.count >= oldOne.targetXY.length ? oldOne.targetXY.length - 1 : oldOne.count].x ? oldOne.targetXY[oldOne.count >= oldOne.targetXY.length ? oldOne.targetXY.length - 1 : oldOne.count].x + randomDelta : v.x + randomDelta;
                    // sourceY = oldOne && oldOne.targetXY && oldOne.targetXY[oldOne.count >= oldOne.targetXY.length ? oldOne.targetXY.length - 1 : oldOne.count].y ? oldOne.targetXY[oldOne.count >= oldOne.targetXY.length ? oldOne.targetXY.length - 1 : oldOne.count].y + randomDelta : v.y + randomDelta;
                    sourceX = oldOne && oldOne.targetXY && oldOne.targetXY[oldOne.targetXY.length - 1].x ? oldOne.targetXY[oldOne.targetXY.length - 1].x + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.targetXY && oldOne.targetXY[oldOne.targetXY.length - 1].y ? oldOne.targetXY[oldOne.targetXY.length - 1].y + randomDelta : v.y + randomDelta;
                }
                var rotation = Math.atan2(v.x - sourceX, v.y - sourceY) - 1.5;

                if (v.x === sourceX && v.y === sourceY) {
                    rotation = v.rotation;
                }
                if (rotation === -1.5) {
                    rotation = -1.05 * Math.PI;
                }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;

                /*if( v.OBJ_TRUCK_CODE == 'T231'){
                    console.log( v.GPS_LATITUDE, v.GPS_LONGITUDE, sourceX , v.x, sourceY , v.y , new Date());                   
                }*/
                // v.INYARDTIME && console.log(v.INYARDTIME);
                //console.log(v.OBJ_TRUCK_EMPTYCTN_FLAG);
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
                    //'offsetX': -165,
                    //'offsetY': -75,
                    'offsetX': 0,
                    'offsetY': 0,
                    'targetX': v.x,
                    'targetY': v.y,
                    'targetXY': item,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    //'rotation' : -(v.GPS_DIRECTION / 180 * Math.PI), // GPS∑µªÿ…Ë±∏∑ΩœÚ∑∂Œß0~359£¨≤‚ ‘∫Û≤¬≤‚Ω«∂»ø…ƒ‹Œ™ÀÆ∆Ω0°„À≥ ±’Î–˝◊™£¨zrender–˝◊™∑ΩœÚŒ™ÀÆ∆Ω0°„ƒÊ ±’Î–˝◊™£¨π ◊ˆ“ª∏ˆ∏∫œÚ◊™ªª
                    'rotation': rotation,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:Œﬁ÷∏¡Óø’œ–, YESINS:”–÷∏¡Óø’œ–, WORK£∫π§◊˜÷–£¨ FAULT:π ’œ, REPAIR:Œ¨–ﬁ
                    'jobType': v.OBJ_TRUCK_WORK_TYPE,
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
                    // 'edgeSpeed': 50,
                    'isShow': v.isShow,
                    'isSelected': isSelected,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': self.isShowQuotaDevice,
                    //'isCarryCargo': !v.OBJ_TRUCK_EMPTYCTN_FLAG,
                    'isCarryCargo': v.STA_WORK_STATUS === 'WORK', // ‘›∂®∑Ω∞∏£∫≥µ…œ”–√ª”–œ‰◊”£¨ø…“‘¥”stauts±Ì≈–∂œ£¨work_status◊¥Ã¨Œ™workµƒ”¶∏√æÕ «”–œ‰◊”£¨∆‰À˚ ±∫ÚæÕ «√ªœ‰◊”
                    'isShowDeviceJobType': self.isShowDeviceJobType,
                    'presenceTime': v.STA_END_TIME - v.STA_START_TIME,
                    'alarm': v.alarm
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
                oldOne.moveToTarget(3500 / (item.length), true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                containers.push(v);

            })


            //this.renderContainers();
            //console.log( containers );
            this._observer._popLayer.addObject('container', containers);
            // «Â≥˝≤ª‘⁄≥°≥µ¡æ
            // this._observer._playSpeed && (datas = this.uniqueListByProp(datas, 'OBJ_TRUCK_CODE'));
            // self.containers && (self.containers = self.removeNotInPortDevice(self.containers, datas, 'OBJ_TRUCK_CODE'));
        },

        // 对象数组根据属性去重
        uniqueListByProp: function (array, keys) {
            var hash = {};
            array = array.reduce(function (item, next) {
                hash[next[keys]] ? '' : hash[next[keys]] = true && item.push(next);
                return item
            }, [])

            return array;
        },

        /**
         * desc: 去除不在场设备
         * @param  {[type]} oldDevices [description]
         * @param  {[type]} newDevices [description]
         * @param  {[type]} prop       [description]
         * @return {[type]}            [description]
         */
        removeNotInPortDevice: function (oldDevices, newDevices, prop) {
            var tempArr = [],
                isInPort = '',
                inOldArr;
            // 和并新旧数组。
            $.each(newDevices, function (k, v) {
                inOldArr = false;
                $.each(oldDevices, function (m, n) {
                    if (v[prop] === n.deviceData[prop]) {
                        inOldArr = true;
                    }
                });
                !inOldArr && oldDevices.push(v);
            })
            // 去除newDevices中没有的设备得到当前在场设备
            $.each(oldDevices, function (k, v) {
                isInPort = false;
                $.each(newDevices, function (m, n) {
                    if (v.deviceData[prop] === n[prop]) {
                        isInPort = true;
                        tempArr.push(v);
                    }
                });
                !isInPort && v.stopAnimation();
                !isInPort && v.hide();
                !isInPort && v.remove();
            });
            return tempArr;
        },
        /*
         * 根据筛选移除回放中的设备
         */
        removeRecordDeviceByFilter: function (datas) {
            _.each(datas, function (item, idx, list) {
                item.stopAnimation();
                item.hide();
                item.remove();
            })
        },

        /*
         *  龙门吊
         */
        addGantrycranes: function (datas) {
            if (this._observer._playSpeed && this._observer.filterObj.gantrycrane === 0) {
                this.removeRecordDeviceByFilter(this.gantrycranes);
                this.gantrycranes = [];
                return;
            }
            //var startTime = new Date().valueOf();
            var self = this;
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var gantrycranes = [];

            var datasGroup = _.groupBy(datas, function (item) {
                return item.OBJ_EQUIPMENT_CODE;
            })

            $.each(datasGroup, function (idx, item) {
                item.sort(self.compare('GPS_INSERT_TIME'));
                var v = item[0];
                if (!self._zr) {
                    return true;
                }
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === undefined || self.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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

                // DLVR : 提箱,   RECV : 进箱 ， DSCH ： 卸船， LOAD ：装船
                if (v.STA_WORK_STATUS === 'WORK') {
                    isShipment = true;
                    if (v.STA_JOB_TYPE === 'DLVR' || v.STA_JOB_TYPE === 'LOAD') {
                        shipmentStatus = 'containerOut';
                    }
                    if (v.STA_JOB_TYPE === 'RECV' || v.STA_JOB_TYPE === 'DSCH') {
                        shipmentStatus = 'containerIn';
                    }
                    /*else {
                        shipmentStatus = 'hide';
                    }*/
                } else {
                    isShipment = false;
                }

                var oldOne = _.findWhere(self.gantrycranes, {
                    '_equipmentCode': v.OBJ_EQUIPMENT_CODE
                });
                var randomDelta = 0;
                var sourceX, sourceY;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                if (!self._observer._playSpeed || (oldOne && oldOne.targetY.length === 1)) {
                    sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                } else {
                    sourceX = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].x ? oldOne.targetXY[oldOne.targetXY.length - 1].x + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].y ? oldOne.targetXY[oldOne.targetXY.length - 1].y + randomDelta : v.y + randomDelta;
                }
                // 真实两个龙门吊方向处理 （仅显示 后期根据实际情况）
                /*if ( v.GPS_EQUIPMENT_CODE == 'R02' || v.GPS_EQUIPMENT_CODE == 'R01' ) {
                    // v.GPS_DIRECTION = -(v.GPS_DIRECTION / 180 * Math.PI); // R02 35° 基线以y轴为准
                    v.GPS_DIRECTION = -(25 / 180 * Math.PI);
                } */
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var cfg = {
                    'zr': self._zr,
                    'is25d': self.is25d,
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
                    'targetXY': item,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.GPS_DIRECTION || 0,
                    'workStatus': v.STA_WORK_STATUS,
                    'jobType': v.STA_JOB_TYPE,
                    'identity': v.OBJ_ID,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
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
                oldOne.moveToTarget(5000 / (item.length), true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                gantrycranes.push(v);
            })

            this._observer._popLayer.addObject('gantrycrane', gantrycranes);
            // 清除不在场龙门吊
            this._observer._playSpeed && (datas = this.uniqueListByProp(datas, 'OBJ_EQUIPMENT_CODE'));
            self.gantrycranes && (self.gantrycranes = self.removeNotInPortDevice(self.gantrycranes, datas, 'OBJ_EQUIPMENT_CODE'));
        },



        /*
         *
         */
        addBridgecranes: function (datas) {
            if (this._observer._playSpeed && this._observer.filterObj.bridgecrane === 0) {
                this.removeRecordDeviceByFilter(this.bridgecranes);
                this.bridgecranes = [];
                return;
            }
            var self = this; //
            var selected = self._selectedEquipment;
            var isShowQuota = true;
            var isSelected;
            var rotation = 0;
            var bridgecranes = [];

            var datasGroup = _.groupBy(datas, function (item) {
                return item.OBJ_EQUIPMENT_CODE;
            })
            // datasGroup = [datasGroup['CR7'] ? datasGroup['CR7'] : []];
            $.each(datasGroup, function (idx, item) {
                item.sort(self.compare('GPS_INSERT_TIME'));
                var v = item[0];
                if (!v) return true;
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (!v.x && v.x !== 0) {
                    return true;
                }
                // if (v.x < 950) {
                //     rotation = -0.4;
                //     v.y += 6;
                // } else {
                //     console.log(343434);
                //     rotation = -0.04;
                //     v.y += 15;
                // }
                rotation = -0.4;
                if (self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === undefined || self.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(self.bridgecranes, {
                    '_equipmentCode': v.OBJ_EQUIPMENT_CODE
                });
                var randomDelta = 0;
                var randomDelta = 0;
                var sourceX, sourceY;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                if (!self._observer._playSpeed) {
                    sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                } else {
                    sourceX = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].x ? oldOne.targetXY[oldOne.targetXY.length - 1].x + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].y ? oldOne.targetXY[oldOne.targetXY.length - 1].y + randomDelta : v.y + randomDelta;
                }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
                var cfg = {
                    'zr': self._zr,
                    'is25d': self.is25d,
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
                    'targetXY': item,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': rotation,
                    'workStatus': v.STA_WORK_STATUS,
                    //'types':v.types,    //桥吊类型（长、中、短）
                    // 'types':v.OBJ_EQUIPMENT_TYPE,
                    'jobType': v.STA_JOB_TYPE,
                    'identity': v.OBJ_ID,
                    'overMap': self,
                    'isShow': v.isShow,
                    'isShipment': isShipment,
                    'shipmentStatus': shipmentStatus,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
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
                //oldOne.moveToTarget(3000 / item.length, true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                bridgecranes.push(v);
            })
            //this._equipments[6] = this.bridgecranes;
            // this.switchQuota(true);
            this._observer._popLayer.addObject('bridgecrane', bridgecranes);
            // 清除不在场桥吊
            this._observer._playSpeed && (datas = this.uniqueListByProp(datas, 'OBJ_EQUIPMENT_CODE'));
            self.bridgecranes && (self.bridgecranes = self.removeNotInPortDevice(self.bridgecranes, datas, 'OBJ_EQUIPMENT_CODE'));
        },

        /**
         *  龙门吊
         */
        addStackers: function (datas) {
            if (this._observer._playspeed && this._observer.filterObj.emptyContainer === 0) {
                this.removeRecordDeviceByFilter(this.stackers);
                this.stackers = [];
                return;
            }
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var stackers = [];
            var datasGroup = _.groupBy(datas, function (item) {
                return item.OBJ_EQUIPMENT_CODE;
            })
            $.each(datasGroup, function (idx, item) {
                item.sort(self.compare('GPS_INSERT_TIME'));
                var v = item[0];
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.stackersChecked[v.OBJ_EQUIPMENT_CODE] === undefined || self.stackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(self.stackers, {
                    '_equipmentCode': v.OBJ_EQUIPMENT_CODE
                });
                var sourceX, sourceY;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                if (!self._observer._playSpeed) {
                    sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                } else {
                    sourceX = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].x ? oldOne.targetXY[oldOne.targetXY.length - 1].x + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].y ? oldOne.targetXY[oldOne.targetXY.length - 1].y + randomDelta : v.y + randomDelta;
                }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
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
                    'targetXY': item,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.rotation, // ???????
                    'workStatus': v.STA_WORK_STATUS,
                    'jobType': v.STA_JOB_TYPE,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
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
                oldOne.moveToTarget(3000 / item.length, true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }

                stackers.push(v);
            })
            this._observer._popLayer.addObject('stacker', stackers);
            // 清除不在场桥吊
            this._observer._playSpeed && (datas = this.uniqueListByProp(datas, 'OBJ_EQUIPMENT_CODE'));
            self.stackers && (self.stackers = self.removeNotInPortDevice(self.stackers, datas, 'OBJ_EQUIPMENT_CODE'));
        },

        /*
         *
         */
        addReachstackers: function (datas) {
            if (this._observer._playspeed && this._observer.filterObj.reachstacker === 0) {
                this.removeRecordDeviceByFilter(this.reachstackers);
                this.reachstackers = [];
                return;
            }
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            var isShowQuota = true;
            var reachstackers = [];
            var datasGroup = _.groupBy(datas, function (item) {
                return item.OBJ_EQUIPMENT_CODE;
            })
            $.each(datasGroup, function (idx, item) {
                item.sort(self.compare('GPS_INSERT_TIME'));
                var v = item[0];
                if (!self.isInTheView(v)) {
                    return true;
                }
                if (self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === undefined || self.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(self.reachstackers, {
                    '_equipmentCode': v.OBJ_EQUIPMENT_CODE
                });
                var sourceX, sourceY;
                //randomDelta = Math.random() * 2 % 2;
                //console.log( randomDelta );
                if (!self._observer._playSpeed) {
                    sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                } else {
                    sourceX = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].x ? oldOne.targetXY[oldOne.targetXY.length - 1].x + randomDelta : v.x + randomDelta;
                    sourceY = oldOne && oldOne.targetXY[oldOne.targetXY.length - 1].y ? oldOne.targetXY[oldOne.targetXY.length - 1].y + randomDelta : v.y + randomDelta;
                }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;
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
                    'targetXY': item,
                    'deltaX': self.lastDrawX,
                    'deltaY': self.lastDrawY,
                    'rotation': v.rotation, // ????
                    'workStatus': v.STA_WORK_STATUS,
                    'jobType': v.STA_JOB_TYPE,
                    'isShow': v.isShow,
                    'identity': v.OBJ_ID,
                    'isSelected': isSelected,
                    'deviceData': v,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': self.isShowQuotaDevice,
                    'isShowDeviceJobType': self.isShowDeviceJobType
                };
                if (!oldOne) {
                    oldOne = Reachstacker(cfg);
                    oldOne.setMapId(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    oldOne.setMapType('reachstacker');
                    self.reachstackers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                oldOne.draw();
                oldOne.moveToTarget(3000 / item.length, true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
                reachstackers.push(v);
            })
            //console.log(self.reachstackers);
            //this._equipments[8] = this.reachstackers;
            // this.switchQuota(true);
            this._observer._popLayer.addObject('reachstacker', reachstackers);
            // 清除不在场桥吊
            this._observer._playSpeed && (datas = this.uniqueListByProp(datas, 'OBJ_EQUIPMENT_CODE'));
            self.reachstackers && (self.reachstackers = self.removeNotInPortDevice(self.reachstackers, datas, 'OBJ_EQUIPMENT_CODE'));
        },

        addBoxMarker: function (datas) {
            var self = this;
            var selected = self._selectedEquipment;
            var isSelected;
            var boxMarkers = [];
            $.each(datas, function (k, v) {
                if (!self.isInTheView(v)) {
                    return true;
                }
                // if( self.containersChecked[v.OBJ_Marker_CODE] == undefined || self.containersChecked[v.OBJ_Marker_CODE] === true ){
                //     v.isShow = true;
                //     self.containersChecked[v.OBJ_Marker_CODE] = true;
                // }else{
                //     v.isShow = false;
                //     self.containersChecked[v.OBJ_Marker_CODE] = false;
                // }
                // if( !self.isShowEquipmentObject ){
                //     v.isShow = false; // 全局隐藏设备时，不显示
                // }
                // if( selected && selected._type == 'boxMarker' && selected._equipmentCode == v.OBJ_Marker_CODE){
                //     isSelected = true;                   
                // }else{
                //     isSelected = false;
                // }

                var randomDelta = 0;
                var oldOne = _.findWhere(self.boxMarkers, {
                    '_equipmentCode': v.markerCode
                });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                // var rotation =  Math.atan2( v.x - sourceX , v.y - sourceY ) - 1.5;


                // if( v.x == sourceX && v.y == sourceY){
                //     rotation = v.rotation;
                // }             
                // if( rotation == -1.5 ){
                //     rotation = - 1.05 * Math.PI;
                // }
                v.x += self.updateX;
                v.y += self.updateY;
                var pp = self.transToPerspective(v.x, v.y);
                v.x = pp.x;
                v.y = pp.y;

                var cfg = {
                    'zr': self._zr,
                    'observer': self._observer,
                    'zlevel': 60,
                    'scaleRatio': self.showScale,
                    'scaleLevel': self.scaleLevel,
                    // 'x': v.x,
                    // 'y': v.y,
                    // 'offsetX': 0,
                    // 'offsetY': 0,
                    'deltaX': self.deltaX,
                    'deltaY': self.deltaY,
                    'identity': v.markerCode,
                    'boxData': v
                    // 'profileData': [{
                    //     'license': v.OBJ_TRUCK_LICENSE,
                    //     'number': v.OBJ_Marker_CODE,
                    //     'id': v.OBJ_ID,
                    //     'status': v.STA_WORK_STATUS,
                    //     'ctnWeight': v.STA_LOAD_CTN_WEIGHT_1 + v.STA_LOAD_CTN_WEIGHT_2
                    // }],
                    // 'isShow': v.isShow,
                    // 'isSelected': isSelected,
                };
                // rotation = 1 * Math.PI;
                if (!oldOne) {
                    self.boxMarkers = []; // 确保页面上只有一个marker
                    oldOne = BoxMarker(cfg);
                    oldOne.setMapType('boxMarker');
                    oldOne.setEquipmentCode(v.markerCode);
                    self.boxMarkers.push(oldOne);
                } else {
                    oldOne.update && oldOne.update(cfg);
                }
                if (oldOne.boxData.STA_CURRENT_STATUS !== 'T') {
                    oldOne.draw();
                    boxMarkers.push(v);
                } else { // 如果当前的位置在集卡上，就作为组件返回到对应集卡对象里
                    this.truckBoxMaker = oldOne.drawAsCompnents(oldOne.boxData.GPS_ACTUAL_LOCATION);
                }
                // oldOne.moveToTarget( 3500, true);
                if (isSelected) {
                    self._selectedEquipment = oldOne;
                }
            })

            this._observer._popLayer.addObject('boxMarker', boxMarkers);
        },
        /**
         * todo: 隐藏marker操作与点击操作冲突 需要与产品确认交互方式
         */
        hideBoxMarker: function () {
            if (!this.boxMarkers || this.boxMarkers.length === 0) return;
            $.each(this.boxMarkers, function (k, v) {
                v.hide();
            })
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
                'deltaX': this.lastDrawX,
                'deltaY': this.lastDrawY,
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
            this.trailMap && this.trailMap.hide();
            this.trailMap && this.trailMap.remove();
            this.trailMap = null;
        },
        /*
         * 显示GPSLine
         */
        showGPSLineMap: function (data) {
            this.GPSLineMap = TRAIL({
                'zr': this._zr,
                'observer': this._observer,
                // 'zlevel': 23,
                'zlevel': 100,
                'initX': 0,
                'initY': 0,
                'deltaX': self.lastDrawX,
                'deltaY': self.lastDrawY,
                // 'position': [-158, -76],
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
                'deltaX': self.lastDrawX,
                'deltaY': self.lastDrawY,
                'scaleRatio': this.showScale,
                'scaleLevel': this.scaleLevel,
                'points': data,
                'isShow': true,
                'radius': 2
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
        //     var self = this;
        //     if (this.roadPolyline) {
        //         delete this.roadPolyline;
        //     }
        //     this.roadPolyline = [];
        //     var arr = [];
        //     $.each(data, function(idx, item){
        //         var temp = [];
        //         $.each(item, function(idx, item){
        //             temp.push([self._observer.convertFromLng(item[0]), self._observer.convertFromLat(item[1])]);
        //         })
        //         arr.push(temp);
        //     })
        //     var cfg = {
        //         'zr': self._zr,
        //         'observer': self._observer,
        //         'zlevel': 1000,
        //         'points': arr,
        //         'strokeColor': 'blue',
        //         'isShow': true,
        //         // 'initX': -163,
        //         // 'initY': -77,
        //         'lineWidth': 1,
        //         'deltaX': self.lastDrawX,
        //         'deltaY': self.lastDrawY,
        //         'scaleRatio': this.showScale,
        //         'scaleLevel': this.scaleLevel,
        //     };
        //     var roadPolyline = TRAIL(cfg);
        //     roadPolyline.draw();
        //     self.roadPolyline.push(roadPolyline);

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
            var self = this;
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
                'deltaX': self.lastDrawX,
                'deltaY': self.lastDrawY,
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
                'LOAD': {
                    'berth1': 0,
                    'berth2': 0,
                    'berth3': 0,
                    'berth4': 0,
                    'berth5': 0,
                    'berth6': 0
                },
                'DSCH': {
                    'berth1': 0,
                    'berth2': 0,
                    'berth3': 0,
                    'berth4': 0,
                    'berth5': 0,
                    'berth6': 0
                },
                'RECV': 0,
                'DLVR': 0
            };
            $.each(this.yards, function (k, v) {
                $.each(v.jobLine, function (m, n) {
                    switch (n.type) {
                        case 'LOAD':
                            jobNum['LOAD']['berth' + n.BERTH.trim()] += n.NUM;
                            break;
                        case 'DSCH':
                            jobNum['DSCH']['berth' + n.BERTH.trim()] += n.NUM;
                            break;
                        case 'RECV':
                            jobNum['RECV'] = jobNum['RECV'] + n.NUM;
                            break;
                        case 'DLVR':
                            jobNum['DLVR'] = jobNum['DLVR'] + n.NUM;
                            break;
                    }
                })
            })
            $.each(this.jobPoints, function (k, v) {
                v.isShow = true;
                switch (v.jobType) {
                    case 'berth1':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth1, jobNum.DSCH.berth1];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'berth2':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth2, jobNum.DSCH.berth2];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'berth3':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth3, jobNum.DSCH.berth3];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'berth4':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth4, jobNum.DSCH.berth4];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'berth5':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth5, jobNum.DSCH.berth5];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'berth6':
                        v.labelTitle = ['装箱量', '卸箱量'];
                        v.labelNum = [jobNum.LOAD.berth6, jobNum.DSCH.berth6];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-30, -100];
                        v.linePoints = [
                            [0, 0],
                            [20, -44]
                        ];
                        break;
                    case 'RECV':
                        v.labelTitle = ['进箱量'];
                        v.labelNum = [jobNum.RECV];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-160, -100];
                        v.linePoints = [
                            [0, 0],
                            [-30, -67],
                            [-64, -67]
                        ];
                        break;
                    case 'DLVR':
                        v.labelTitle = ['提箱量'];
                        v.labelNum = [jobNum.DLVR];
                        v.sourceText = v.sourceText || v.labelNum;
                        v.targetText = v.labelNum;
                        v.recPosition = [-160, -100];
                        v.linePoints = [
                            [0, 0],
                            [-30, -67],
                            [-64, -67]
                        ];
                        break;
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
                    eqps = this.containers;
                    k = 4;
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
            // this.hideSelectedEquipment();
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
                case 'smokeSensor':
                case 'temperatureSensor':
                    eqps = this.sensors;
                    break;
                case 'ship':
                    eqps = this.ships;
                    break;
                case 'berthFlag':
                    eqps = this.berthFlags;
                    break;
                case 'gate':
                    eqps = this.gates;
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
            // this.hideSelectedEquipment();            
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
                x: type === 'ship' ? (self._selectedEquipment.realPosFrom.x + self._selectedEquipment.realPosTo.x) / 2 : self._selectedEquipment.initX,
                y: type === 'ship' ? (self._selectedEquipment.realPosFrom.y + self._selectedEquipment.realPosTo.y) / 2 : self._selectedEquipment.initY
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
            // this.hideSelectedEquipment();
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
        compare: function (propertyName) {
            return function (object1, object2) {
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                if (value2 < value1) {
                    return 1;
                } else if (value2 > value1) {
                    return -1;
                } else {
                    return 0;
                }
            }
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
                case 'container':
                    eqps = this.containers;
                    break;
                case 'gantrycrane':
                    eqps = this.gantrycranes;
                    break;
                case 'bridgecrane':
                    eqps = this.bridgecranes;
                    break;
                case 'stacker':
                    eqps = this.stackers;
                    break;
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
                case 'boxMarker':
                    eqps = this.boxMarkers;
                    break;
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
                this.gates, this.labels, this.berths, this.berthFlags, this.milestones,
                this.tracks, this.jobPoints, this.yards, this.ships, this.cameras,
                this.hydrants, this.sensors, this.containers, this.gantrycranes,
                this.bridgecranes, this.stackers, this.reachstackers, this.roads, this.boxMarkers
            ];
            var event = {
                type: 'redrawByPosScale',
                args: {
                    x: this.lastDrawX,
                    y: this.lastDrawY,
                    scale: this.showScale,
                    scaleLevel: this.scaleLevel,
                    boxDeltaX: this.deltaX,
                    boxDeltaY: this.deltaY
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
            // this.roads && this.roads.redrawByPosScale(event.args);
            this.trailMap && this.trailMap.redrawByPosScale(event.args);
            this.pointsMap && this.pointsMap.redrawByPosScale(event.args);
            this.GPSLineMap && this.GPSLineMap.redrawByPosScale(event.args);
            this.GPSPointMap && this.GPSPointMap.redrawByPosScale(event.args);

            this._observer._popLayer._infoPop.setInfoPopPositionByDevice(this._selectedEquipment);
        },

        // 回放停止设备的移动动画
        stopDeviceAnimator: function () {
            var equipments = [this.containers, this.gantrycranes, this.bridgecranes, this.stackers, this.reachstackers];
            $.each(equipments, function (idx, item) {
                if (!item.length) {
                    return true;
                }
                $.each(item, function (k, v) {
                    v['stopAnimation'] && v['stopAnimation'].call(this);
                })
            })
        },

        // 回放开始设备的移动动画
        startDeviceAnimator: function () {
            var equipments = [this.containers, this.gantrycranes, this.bridgecranes, this.stackers, this.reachstackers];
            $.each(equipments, function (idx, item) {
                if (!item.length) {
                    return true;
                }
                $.each(item, function (k, v) {
                    v['startAnimation'] && v['startAnimation'].call(this);
                })
            })
        },

        /*
         * @ 响应切换显示关键指标
         * @ param: bool 
         * @ 是否显示（true：显示, false: 隐藏）
         */
        switchDeviceQuota: function (isShowQuota) {
            this.isShowQuotaDevice = isShowQuota;
            var equipments = [
                this.labels, this.berths, this.berthFlags, this.tracks, this.jobPoints,
                this.ships, this.cameras, this.hydrants, this.containers, this.gantrycranes,
                this.bridgecranes, this.stackers, this.reachstackers
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
                this.tracks, this.ships, this.cameras, this.hydrants, this.containers,
                this.gantrycranes, this.bridgecranes, this.stackers, this.reachstackers
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
                this.tracks, this.ships, this.cameras, this.hydrants, this.containers,
                this.gantrycranes, this.bridgecranes, this.stackers, this.reachstackers
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