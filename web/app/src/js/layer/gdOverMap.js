/**
 * @module port/mod/overMap 地图附着物层
 */
define(function (require) {
    'use strict';

    var McBase = require('base/mcBase');
    //var Label = require('mod/titleLabel/gdTextLabel'); // 标签场区
    var Yard = require('mod/yard/gdYard'); // 堆场    
    var Container = require('mod/container/gdContainer'); // 集卡
    var Camera = require('mod/camera/gdCamera'); // 摄像头
    //var Hydrant = require('mod/hydrant/hydrant'); // 消防栓
    var Sensor = require('mod/sensor/gdSensor'); //传感器
    //var JobPoint = require('mod/titleCircle/titleCircle'); // 工作点
    var Ship = require('mod/boat/gdBoat'); // 船舶
    var Label = require('mod/titleLabel/gdTitleLabel'); // 标签场区

    var Gantrycrane = require('mod/gantrycrane/gdGantrycrane'); // 龙门吊
    var Bridgecrane = require('mod/bridgecrane/gdBridgecrane'); // 桥吊 
    var Stacker = require('mod/stacker/gdStacker'); // 堆高机
    var Reachstacker = require('mod/reachstacker/gdReachstacker'); // 正面吊
    var POLYLINE = require('mod/track/gdTrack'); // 

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
    var updateX = 0.0043; // 0.0044
    var updateY = -0.0020; //-0.0019

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
            this.amap = cfg.map;
            this.is25d = cfg.is25d;
            this._observer = cfg.observer;
            this.showScale = cfg.showScale || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.isInit = true; // 初始化数据  
            this.isShowQuotaYard = true; // 是否显示堆场指标
            this.isShowEquipmentObject = true; // 是否显示设备
            this.isShowQuotaDevice = true; // 是否显示设备指标
            this.isShowYardByThermodynamic = false; //是否以热力图显示堆场
            this.isShowJobLine = false; //是否显示堆场作业线路图，默认不显示
            this.isShowJobPoints = false; // 是否显示作业点，默认不显示
            this.isShowDeviceJobType = false; // 是否显示设备作业状态
            this.initObjects();
            this.cursor = 'pointer';
            this.bubble = false;
            this.mapType = 'gd';
            this.isInit = true; // 初始化数据
            this.trailMap = null;
            this.pointsMap = null;
            this.mapType = 'gd';
            this.containerLineArr = {};
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
            delete this.bridgePackings;
            this.bridgePackings = [];   // 桥吊停靠
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
        	/*if( this.containers.length > 0 ){
        		console.log( type, datas );
            	return false;
        	}*/
            switch (type) {
                // case 'label' : this.addLabels( datas ); break;   
                // case 'berth' : this.addBerths( datas ); break;             
                case 'yard': this.addYards(datas); break;
                case 'container': this.addContainers(datas); break;
                // case 'camera' : this.addCameras( datas ); break;                
                // case 'sensor' : this.addSensors( datas ); break;
                case 'gantrycrane': this.addGantrycranes(datas); break;
                // case 'bridgecrane' : this.addBridgecranes( datas ); break;
                // case 'stacker' : this.addStackers( datas ); break;
                // case 'reachstacker' : this.addReachstackers( datas ); break;  
                // case 'ship' : this.addShips( datas ); break;              
                //case 'hydrant' : this.addHydrant( datas ); break;

            }
            this.setInfoPopPosition();

        },

        setInfoPopPosition: function () {
            if (this._selectedEquipment) {
                var obj = this.getXY(this._selectedEquipment.lng, this._selectedEquipment.lat);
                // console.log(obj.drawY);
                this._selectedEquipment.drawX = obj.drawX;
                this._selectedEquipment.drawY = obj.drawY;
                this._observer._popLayer._infoPop.gd_setInfoPopPositionByDevice(this._selectedEquipment);
            }
        },

        // setAttr: function(attr, val){
        //     // var equipments = [ this.labels, this.berths, this.berthFlags, this.milestones, this.tracks, this.jobPoints, this.yards, this.ships, this.cameras, 
        //     //   this.hydrants, this.sensors, this.containers, this.gantrycranes, 
        //     // this.bridgecranes, this.stackers, this.reachstackers, ];
        //     var equipments = [this.gantrycranes,];
        //      $.each( equipments , function(k,equ){
        //        if(!equ.length){
        //            return true;
        //        }
        //        $.each( equ , function(l,v){
        //             v.marker.setExtData(attr + '?' + val);
        //        })      
        //    }) 
        //      console.log(this.gantrycranes)
        // },

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
            this.amap.setCenter(new AMap.LngLat(this._selectedEquipment.lng, this._selectedEquipment.lat));
            this._observer.showProfilePop(this._selectedEquipment);
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

            if (!this._selectedEquipment) {
                return false;
            }
            this._selectedEquipment.setSelectedProp && this._selectedEquipment.setSelectedProp(true);
            this.amap.setCenter(new AMap.LngLat(this._selectedEquipment.lng, this._selectedEquipment.lat));
            this._observer.showProfilePop(this._selectedEquipment);

        },

        /*
         *  通过经纬度获取在屏幕上的位置
         */
        getXY: function (lng, lat) {
            var obj = {};
            var pixel = this.amap.lnglatTocontainer([lng, lat]);
            obj.drawX = pixel.getX();
            obj.drawY = pixel.getY();
            return obj;
        },

        /*
         *  泊位
         */
        addBerths: function (datas) {
            //console.log(datas);
            var that = this;
            var berthPoints = datas.berth;
            var mileStones = datas.milestone;
            that.berthPoints = berthPoints;     // 把milestones数据存下来给boat用;
            var bridgePacking = datas.bridgePacking;
            $.each(berthPoints, function (k, v) {
                var strokeColor = '#449fe6';
                if (!!v.TEXT) {
                    strokeColor = '#b0b5b8';
                };
                var oldOne = _.findWhere(that.berths, { '_mapId': v._mapId });
                var cfg = {
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'fillColor': 'transparent',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': that.isShowEquipmentObject,
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
            $.each(bridgePacking, function (k, v) {
                var oldOne = _.findWhere(that.bridgePackings, { '_mapId': v._mapId });
                var cfg = {
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 21,
                    'strokeColor': '#fff',
                    'strokeStyle': 'solid',
                    'vertices': v.POINT,
                    'fillColor': '#fff',
                    'isShow': that.isShowEquipmentObject,
                };
                if (!oldOne) {
                    oldOne = Label(cfg);
                    oldOne.setMapId(k);
                    oldOne.setMapType('berth');
                    that.bridgePackings.push(oldOne);
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
                var oldOne = _.findWhere(that.berths, { '_mapId': v._mapId });
                var cfg = {
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 21,
                    'vertices': v.POINT,
                    'fillColor': '#b7d7ea',
                    'textColor': '#667987',
                    'strokeColor': strokeColor,
                    'text': v.TEXT,
                    'isShow': that.isShowEquipmentObject,
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
         *  堆场
         */
        addYards: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            $.each(datas, function (k, v) {
                var POINT = [];
                $.each(v.GPS_COORDINATES, function (m, n) {
                    POINT.push({
                        'x': parseFloat(n.lng) + updateX,
                        'y': parseFloat(n.lat) + updateY
                    });
                });
                /*if( !that.isInTheView( POINT) ){
                	return true;
                } */
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
                var oldOne = _.findWhere(that.yards, { '_equipmentCode': v.OBJ_YARD_CODE });
                var sourceTeu = v.TEU + randomDelta;
                //console.log(oldOne);
                var cfg = {
                    'observer': that._observer,
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'zlevel': 22,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    //'identity': v.OBJ_ID,
                    //'yardId': v.OBJ_ID,
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
                    //'isShowByThemodynamic':that.isShowYardByThermodynamic,
                    //'isShowJobLine':that.isShowJobLine,
                };
                if (!oldOne) {
                    oldOne = Yard(cfg);
                    oldOne.setEquipmentCode(v.OBJ_YARD_CODE);
                    oldOne.setMapType('yard');
                    that.yards.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            })

        },


        /*
         *
         */
        addShips: function (datas) {

            // console.log( datas );
            var that = this;
            var ships = [];
            var isSelected = false;
            var selected = that._selectedEquipment;
            $.each(datas, function (k, v) {
                var timeDiff;
                v.stopAnimator = true; v.isArriving = false; v.isLeaving = false; v.isLeaved = false;

                if (selected && selected._type === 'ship' && selected._equipmentCode === v.STA_VESSEL_REFERENCE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                if (that.shipsChecked[v.OBJ_VESSEL_CODE] == undefined || that.shipsChecked[v.OBJ_VESSEL_CODE] === true) {
                    v.isShow = true;
                    that.shipsChecked[v.OBJ_VESSEL_CODE] = true;
                } else {
                    v.isShow = false;
                    that.shipsChecked[v.OBJ_VESSEL_CODE] = false;
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
                    if ((v.STA_CURRENT_STATUS === 'V_ATD' || v.STA_CURRENT_STATUS === 'V_WAIT_ATD') && (oldOne.curStatus !== v.STA_CURRENT_STATUS || ((oldOne.curStatus == v.STA_CURRENT_STATUS) && (oldOne.curStatus == 'V_ATD')))) {
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
                    'map': that.amap,
                    'mapType': that.mapType,
                    'observer': that._observer,
                    'mapType': that.mapType,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'zlevel': 34,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'x': v.x,
                    'y': v.y,
                    'berthPoints': that.berthPoints,
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
         *  集卡
         */
        addContainers: function (datas) {
            var that = this;
            var isSelected = false;
            var selected = that._selectedEquipment;
            var isShow = true;
            var containers = [];
            $.each(datas, function (k, v) {
                if (that.containersChecked[v.OBJ_TRUCK_CODE] == undefined || that.containersChecked[v.OBJ_TRUCK_CODE] === true) {
                    v.isShow = true;
                    that.containersChecked[v.OBJ_TRUCK_CODE] = true;
                } else {
                    v.isShow = false;
                    that.containersChecked[v.OBJ_TRUCK_CODE] = false;
                }
                if (!that.isShowEquipmentObject) {
                    v.isShow = false; // 全局隐藏设备时，不显示
                }
                if (selected && selected._type == 'container' && selected._equipmentCode == v.OBJ_TRUCK_CODE) {
                    isSelected = true;
                } else {
                    isSelected = false;
                }
                var randomDelta = 0;
                //randomDelta = Math.random() * 10 % 10;
                //console.log( randomDelta );
                var oldOne = _.findWhere(that.containers, { '_equipmentCode': v.OBJ_TRUCK_CODE });
                var sourceX = oldOne && oldOne.initX ? oldOne.initX + randomDelta : v.x + randomDelta;
                var sourceY = oldOne && oldOne.initY ? oldOne.initY + randomDelta : v.y + randomDelta;
                var rotation = Math.atan2(v.x - sourceX, v.y - sourceY) - 1.5;  // 弧度数
                if (rotation === -1.5) {
                    rotation = - 1.05 * Math.PI;
                }
                v.INYARDTIME && console.log(v.INYARDTIME);

                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'mapType': that.mapType,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'lng': parseFloat(v.GPS_LONGITUDE) + 0.0043, // 0.0043
                    'lat': parseFloat(v.GPS_LATITUDE) - 0.0027, // -0.0020
                    'x': v.x,
                    'y': v.y,
                    // 'rotation': rotation,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'jobType': v.STA_JOB_TYPE,
                    'profileData': [{
                        'license': v.OBJ_TRUCK_LICENSE,
                        'number': v.OBJ_TRUCK_CODE,
                        'id': v.OBJ_ID,
                        'status': v.STA_WORK_STATUS,
                        'ctnWeight': v.STA_LOAD_CTN_WEIGHT_1 + v.STA_LOAD_CTN_WEIGHT_2
                    }],
                    'speed': v.GPS_SPEED,
                    'edgeSpeed': 50,
                    'deviceData': v,
                    //'isShow': v.isShow,
                    //'isSelected': isSelected,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'isShowQuota': that.isShowQuotaDevice,
                    'isCarryCargo': !v.OBJ_TRUCK_EMPTYCTN_FLAG,
                    'isShowDeviceJobType': that.isShowDeviceJobType
                };

                if (!oldOne) {
                    oldOne = Container(cfg);
                    oldOne.setMapType('container');
                    oldOne.setEquipmentCode(v.OBJ_TRUCK_CODE);
                    that.containers.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();

                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                containers.push(v);

                // ====== 真实数据 =======
                var temp = that.containerLineArr[oldOne._equipmentCode] || []
                var point = new AMap.LngLat(oldOne.lng, oldOne.lat);

                if (temp.length > 0) {
                    var lastPoint = temp[temp.length - 1];
                    if (lastPoint.lng !== point.lng && lastPoint.lat !== point.lat) {
                        temp.push(point);
                    }
                } else {
                    temp.push(point);
                }
                that.containerLineArr[oldOne._equipmentCode] = temp;
                oldOne.moveToTarget(that.containerLineArr[oldOne._equipmentCode]);
                // ===== 测试 ======
                // var temp = [];
                // temp.push(new AMap.LngLat(122.033300, 29.884157));
                // temp.push(new AMap.LngLat(122.034684, 29.887683));
                // oldOne.moveToTarget(temp);
            })
            this._observer._popLayer.addObject('container', containers);

        },
        /**
         * desc: 优化方案 与上面方法互斥
         * @param {object} datas 集卡数据
         */
        // addContainers: function( datas ){
        //     var that = this; 
        //     var isSelected = false;
        //     var isShow = true;
        //     var selected = that._selectedEquipment;
        //     if(that.containers.length){
        //         that.containers[0].remove();
        //         that.containers = [];
        //     }
        //     var containers = Container({datas: datas, map: this.amap, observer: this._observer});
        //     that.containers.push(containers);
        // },
        /*
         *  摄像头
         */
        addCameras: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var cameras = [];
            $.each(datas, function (k, v) {
                var oldOne = _.findWhere(that.cameras, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'lng': parseFloat(v.LONGITUDE) + updateX,
                    'lat': parseFloat(v.LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修                      
                };

                if (!oldOne) {
                    oldOne = Camera(cfg);
                    oldOne.setMapType('camera');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.cameras.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            	/*if(isSelected){
                	that._selectedEquipment = oldOne;
                }*/
                cameras.push(v);
            })

        },

        /*
         *  传感器
         */
        addSensors: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var sensors = [];
            $.each(datas, function (k, v) {
                var oldOne = _.findWhere(that.sensors, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'lng': parseFloat(v.LONGITUDE) + updateX,
                    'lat': parseFloat(v.LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修                   
                };

                if (!oldOne) {
                    oldOne = Sensor(cfg);
                    oldOne.setMapType('sensor');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.sensors.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            	/*if(isSelected){
                	that._selectedEquipment = oldOne;
                }*/
                sensors.push(v);
            })

        },
        /*
         *  龙门吊
         */
        addGantrycranes: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var selected = that._selectedEquipment;
            var gantrycranes = [];
            $.each(datas, function (k, v) {
                // if( !that.isInTheView( v ) ){
                //     return true;
                // }
                if (that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] == undefined || that.gantrycranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(that.gantrycranes, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'mapType': that.mapType,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'is25d': that.is25d,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'lng': parseFloat(v.GPS_LONGITUDE) + updateX,
                    'lat': parseFloat(v.GPS_LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'deviceData': v
                };

                if (!oldOne) {
                    oldOne = Gantrycrane(cfg);
                    oldOne.setMapType('gantrycrane');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.gantrycranes.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                gantrycranes.push(v);
            })
            this._observer._popLayer.addObject('gantrycrane', gantrycranes);
        },

        // addGantrycranes:function( datas ){
        //     var that = this; 
        //     var isSelected = false;
        //     var isShow = true;
        //     var selected = that._selectedEquipment;
        //     if(that.gantrycranes.length){
        //         that.gantrycranes[0].remove();
        //         that.gantrycranes = [];
        //     }
        //     var gantrycranes = Gantrycrane({datas: datas, map: this.amap, observer: this._observer});
        //     that.gantrycranes.push( gantrycranes );
        // },
        /*
         *  桥吊
         */
        addBridgecranes: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var rotation = 0;
            var selected = that._selectedEquipment;
            var bridgecranes = [];
            $.each(datas, function (k, v) {
                // if( !that.isInTheView( v ) ){
                //     return true;
                // }
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
                if (that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] == undefined || that.bridgecranesChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'is25d': that.is25d,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'mapType': that.mapType,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'lng': parseFloat(v.GPS_LONGITUDE) + updateX,
                    'lat': parseFloat(v.GPS_LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'deviceData': v
                };

                if (!oldOne) {
                    oldOne = Bridgecrane(cfg);
                    oldOne.setMapType('bridgecrane');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.bridgecranes.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
            	/*if(isSelected){
                	that._selectedEquipment = oldOne;
                }*/
                bridgecranes.push(v);
            })
            this._observer._popLayer.addObject('bridgecrane', bridgecranes);
        },
        /*
         *  正面吊
         */
        addReachstackers: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var selected = that._selectedEquipment;
            var reachstackers = [];
            $.each(datas, function (k, v) {
                // if( !that.isInTheView( v ) ){
                //     return true;
                // }
                if (that.stackersChecked[v.OBJ_EQUIPMENT_CODE] == undefined || that.stackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(that.reachstackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'mapType': that.mapType,
                    'bubble': that.bubble,
                    'cursor': that.cursor,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'lng': parseFloat(v.GPS_LONGITUDE) + updateX,
                    'lat': parseFloat(v.GPS_LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'deviceData': v
                };

                if (!oldOne) {
                    oldOne = Reachstacker(cfg);
                    oldOne.setMapType('reachstacker');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.reachstackers.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                reachstackers.push(v);
            })
            this._observer._popLayer.addObject('reachstacker', reachstackers);
        },
        /*
         *  堆高机
         */
        addStackers: function (datas) {
            var that = this;
            var isSelected = false;
            var isShow = true;
            var selected = that._selectedEquipment;
            var stackers = [];
            $.each(datas, function (k, v) {
                // if( !that.isInTheView( v ) ){
                //     return true;
                // }
                if (that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] == undefined || that.reachstackersChecked[v.OBJ_EQUIPMENT_CODE] === true) {
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
                var oldOne = _.findWhere(that.stackers, { '_equipmentCode': v.OBJ_EQUIPMENT_CODE });
                var cfg = {
                    //'zr': that._zr,
                    'map': that.amap,
                    'mapType': that.mapType,
                    'observer': that._observer,
                    'zlevel': 33,
                    'scaleRatio': that.showScale,
                    'scaleLevel': that.scaleLevel,
                    'efficiency': v.EFFICIENCY && v.EFFICIENCY.toFixed(2),
                    'lng': parseFloat(v.GPS_LONGITUDE) + updateX,
                    'lat': parseFloat(v.GPS_LATITUDE) + updateY,
                    'workStatus': v.STA_WORK_STATUS, // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
                    'deviceData': v

                };

                if (!oldOne) {
                    oldOne = Stacker(cfg);
                    oldOne.setMapType('stacker');
                    oldOne.setEquipmentCode(v.OBJ_EQUIPMENT_CODE);
                    that.stackers.push(oldOne);
                } else {
                    oldOne.update(cfg);
                }
                oldOne.draw();
                if (isSelected) {
                    that._selectedEquipment = oldOne;
                }
                stackers.push(v);
            })
            this._observer._popLayer.addObject('stacker', stackers);
        },
        /*
         * 显示道路线
         */
        // showRoadPolyline: function(data) {
        //     var that = this;
        //     if (this.roadPolyline) {
        //         delete this.roadPolyline;
        //     }
        //     this.roadPolyline = [];
        //     $.each(data, function(idx, item){
        //         var cfg = {
        //             'map': that.amap, 
        //             'mapType': that.mapType,
        //             'observer': that._observer,
        //             'zlevel': 1000,
        //             'points': item,
        //             'strokeColor': 'blue',
        //             'bubble': true,
        //             'cursor': 'pointer',
        //         };
        //         var roadPolyline = POLYLINE(cfg);
        //         roadPolyline.draw();
        //         that.roadPolyline.push(roadPolyline);
        //     })

        // },
        /*
         * 显示道路线
         */
        showRoadPolyline: function (data) {
            var that = this;
            if (this.roadPolyline) {
                delete this.roadPolyline;
            }
            this.roadPolyline = [];
            data = _.groupBy(data, function (item) {
                return item.name
            })

            $.each(data, function (idx, item) {
                var arr = [];
                $.each(item, function (idx, item) {
                    arr.push([item.lng, item.lat]);
                })

                var cfg = {
                    'map': that.amap,
                    'mapType': that.mapType,
                    'observer': that._observer,
                    'zlevel': 1000,
                    'points': arr,
                    'strokeColor': 'blue',
                    'bubble': true,
                    'cursor': 'pointer'
                };
                var roadPolyline = POLYLINE(cfg);
                roadPolyline.draw();
                that.roadPolyline.push(roadPolyline);
            })

        },
        /*
         * 隐藏卡车轨迹
         */
        hideRoadPolyline: function () {
            var that = this;
            if (this.roadPolyline) {
                $.each(this.roadPolyline, function (idx, item) {
                    item.remove();
                })
                delete this.roadPolyline;
            }
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
         * 隐藏选中的设备对象
         */
        hideSelectedEquipment: function () {
            if (this._selectedEquipment) {
                this._selectedEquipment.setSelectedProp && this._selectedEquipment.setSelectedProp(false);
                delete this._selectedEquipment;
            }
        },
        /*
         *  响应滚轮缩放
         */
        onZoomEnd: function (scaleLevel) {
            var equipments = [
                this.labels, this.berths, this.berthFlags, this.tracks, this.jobPoints, 
                this.yards, this.ships, this.cameras,this.hydrants, this.sensors, 
                this.containers, this.gantrycranes,this.bridgecranes, this.stackers, this.reachstackers
            ];
            $.each(equipments, function (k, equ) {
                if (!equ || !equ.length) {
                    return true;
                }

                $.each(equ, function (l, v) {
                    if (scaleLevel <= 0) {
                        // v.hide();
                    } else {
                        // v.show();
                        v['onZoomEnd'] && v['onZoomEnd'].call(this, scaleLevel);
                    }

                })

            })
        },

    });


    return OVERMAP;
});
