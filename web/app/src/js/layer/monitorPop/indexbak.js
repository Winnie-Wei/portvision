/**
 * @module port/mod/popLayer 弹框层
 */
define(function (require) {
    'use strict';

    var McBase = require('base/mcBase');
    var NavigationBar = require('mod/toolBar/toolBar');
    // var Popup = require('mod/popup/index');
    var BlockPopup = require('mod/popup/bottomPop');
    var CenterPopup = require('mod/popup/centerPop');
    var CenterDetailPopup = require('mod/popup/centerDetailPop');
    var InfoPop = require('mod/infoPop/infoPop');
    var EquipmentPop = require('mod/equipmentPop/index');
    var BIGraphyPop = require('mod/biGraphy/biGraphy');
    var GlobalSearchPop = require('mod/globalSearch/globalSearch');
    var ContainerJobList = require('mod/containerJobList/containerJobList');


    var POPLAYER = function (cfg) {
        if (!(this instanceof POPLAYER)) {
            return new POPLAYER().init(cfg);
        }

    };

    POPLAYER.prototype = $.extend(new McBase(), {

        /*
         * 初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.initScale = cfg.initScale || 1;
            this.showScale = cfg.initScale;
            this._currentPop = undefined;
            this.initPops();
            this.initObjects();
            return this;
        },

        /*
         *
         */
        initPops: function () {
            if (!this._navigationBar) {
                this._navigationBar = NavigationBar({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                })
                this._navigationBar.render();
            };
            //console.log('init pop');
            if (!this._legendPop) {
                this._legendPop = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'elementId': 'J_mapLegend',
                    'templatesType': 'mapLegend'
                });
            };
            // 设备统计弹框
            if (!this._equipmentPop) {
                this._equipmentPop = EquipmentPop({
                    'zr': this._zr,
                    'observer': this._observer,
                    'showScale': this.showScale,
                    'initScale': this.initScale
                });
                this._equipmentPop.render();
                // console.log($('#device-statistical .panel-default .panel-body').find('table')); // 找不到因为里面的东西也是动态加载的
            };
            // 最新告警消息弹框
            if (!this._newWarns) {
                this._newWarns = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._newWarns.render();
            };

            // 历史告警消息框
            if (!this._warnHistorys) {
                this._warnHistorys = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._warnHistorys.render();
            };

            // 当前告警消息框
            if (!this._currentWarns) {
                this._currentWarns = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._currentWarns.render();
            };
            // 当前告警条目数
            if (!this._warnNum) {
                this._warnNum = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._warnNum.render();
            };
            // 设备概况消息内弹框
            if (!this._infoPop) {
                this._infoPop = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                });
                this._infoPop.render();
            };
            // 设备详情消息内弹框
            if (!this._infoDetailPop) {
                this._infoDetailPop = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                });
                this._infoDetailPop.render();
            };
            // BI图表弹框
            if (!this._biGraphyPop) {
                this._biGraphyPop = BIGraphyPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                });
                if (this._biGraphyPop) {     // 注意回放页面没有wrapper元素，返回false，会报错
                    this._biGraphyPop.render();
                }
            };
            // 全局搜索
            if (!this._globalSearchPop) {
                this._globalSearchPop = GlobalSearchPop({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                });
                this._globalSearchPop && this._globalSearchPop.render();
            };
            if (!this._containerJobList) {
                this._containerJobList = ContainerJobList({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                });
                this._containerJobList && this._containerJobList.render();
            };
            // 回放
            if (!this._record) {
                this._record = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                });
                this._record && this._record.render();
            };
        },

        /*
         *
         */
        initObjects: function () {
            this.containers = [];  // 集卡
            this.gantrycranes = []; // 龙门吊
            this.bridgecranes = []; // 桥吊
            this.stackers = []; // 堆高机
            this.bridgecranes = []; // 桥吊
            this.reachstackers = []; // 正面吊 
            this.ships = []; // 船舶             
            this.containersChecked = [];  // 集卡是否选中
            this.gantrycranesChecked = []; // 龙门吊是否选中
            this.bridgecranesChecked = []; // 桥吊是否选中
            this.stackersChecked = []; // 堆高机是否选中
            this.bridgecranesChecked = []; // 桥吊是否选中
            this.reachstackersChecked = []; // 正面吊是否选中  
            this.shipsChecked = []; // 船舶是否选中                      
        },

        /*
         *
         */
        addObject: function (type, datas) {
            switch (type) {
                case 'gantrycrane':
                    this.gantrycranes = datas;
                    break;
                case 'container':
                    this.containers = datas;
                    break;
                case 'reachstacker':
                    this.reachstackers = datas;
                    break;
                case 'bridgecrane':
                    this.bridgecranes = datas;
                    break;
                case 'stacker':
                    this.stackers = datas;
                    break;
                case 'ship':
                    this.ships = datas;
                    break;
                case 'mapLegend': this.initLegend(datas);
                default: break;
            }
        },

        /*
         *
         */
        initLegend: function (legends) {
            // 图例层            
            this._legendPop.renderMapLegend(legends);
        },

        /*
         * 隐藏弹框：设备统计、设备概况、设备详情、历史告警
         */
        hidePop: function () {
            // this._equipmentPop.hide();
            // this._newWarnPop.hide();
            this._equipmentPop && this._equipmentPop.hide();
            this._infoPop && this._infoPop.hide();
            this._infoDetailPop && this._infoDetailPop.hide();
            this._warnHistorys && this._warnHistorys.hide();
            this._globalSearchPop && this._globalSearchPop.hide();
            this._currentWarns && this._currentWarns.hide();
            // this._record && this._record.hide();
            this._navigationBar && this._navigationBar.hide();
        },
        /*
         * 隐藏bi分析弹框，响应地图放大缩小
         */
        hideBiGraphyPop: function () {
            this._biGraphyPop && this._biGraphyPop.hide();
        },
        /*
         * 显示bi分析弹框，响应地图放大缩小
         */
        showBiGraphyPop: function () {
            this._biGraphyPop && this._biGraphyPop.show();
        },
        /**
         * desc: 显示集装箱作业列表
         */
        showContainerJobList: function () {
            this._containerJobList && this._containerJobList.show()
        },
        /**
         * desc: 隐藏集装箱作业列表
         */
        hideContainerJobList: function () {
            this._containerJobList && this._containerJobList.hide()
        },
        /*
         *
         */
        updateEquipmentWarns: function (args) {
            var self = this;
            $.each(args.result, function (k, v) {
                self._equipmentPop.showWarningItem(v.EQUIPMENT_NUMBER);
            });
        },

        /*
         *
         */
        showEquipmentPop: function () {
            // this.hidePop();
            this._equipmentPop.updateEquipments('gantrycrane', this.gantrycranes);
            this._equipmentPop.updateEquipments('container', this.containers);
            this._equipmentPop.updateEquipments('reachstacker', this.reachstackers);
            this._equipmentPop.updateEquipments('bridgecrane', this.bridgecranes);
            this._equipmentPop.updateEquipments('stacker', this.stackers);
            this._equipmentPop.updateEquipments('ship', this.ships);
            // $('#device-statistical .device-tbody').css('max-height', $(window).height()*0.4);
            this._equipmentPop.show();
        },

        /*
         *
         */
        showProfilePop: function (obj) {
            this.hidePop();
            this._infoPop.showProfilePopByData(obj);
        },

        /*
         * 将数据传递给指定的弹框对象
         */
        showPop: function (type, args) {
            //console.log( type );            
            switch (type) {
                case 'newWarn': //实时告警
                    this._newWarns.renderNewWarnsByData(args);
                    break;
                case 'currentWarns': //当前告警
                    this._currentWarns.renderCurrentWarnsByData(args);
                    break;
                case 'warnNum': //告警数量
                    this._warnNum.renderWarnNum(args);
                    break;
                case 'blockDetail':
                    this.hidePop();
                    //console.log(args);
                    var data = args;
                    var pop = BlockPopup({
                        'data': data,
                        'elementId': '#J_blockPop',
                        'bayElementId': '#J_centerPop',
                        'observer': this._observer,
                        'yardId': args.yardId
                    });
                    pop.render();
                    break;
                case 'bayDetail':
                    //console.log( args );
                    this.hidePop();
                    var pop = CenterPopup({
                        //'data':data,
                        'elementId': '#J_centerPop',
                        'type': 'center',
                        'observer': this._observer
                    });
                    pop.getBayDetailByParam(args.yard, args.bay);

                    /*var pop = CenterDetailPopup({
                        //'data':data,
                        'elementId': '#J_centerPop',
                        'type':'center',
                        'observer': this,
                    });*/

                    break;
                case 'boxDetail':
                    this.hidePop();
                    var pop = CenterPopup({
                        'elementId': '#J_centerPop',
                        'type': 'center',
                        'observer': this._observer
                    });
                    pop.getContainerDetail(args.boxId);
                    break;
                case 'equipmentDetail':
                    this.hidePop();
                    //console.log( args );
                    var data = {
                        row: args.row,
                        bay: args.bay
                    };
                    var pop = CenterDetailPopup({
                        'data': data,
                        'elementId': '#J_centerPop',
                        'type': 'center',
                        'observer': this._observer
                    });
                    break;
                case 'BIDivice':
                    this.hidePop();
                    // 如果未选中 则找到监听的对象吧对应的监听从设置的监听对象list里边移除
                    // 2. 删除在图上的对象实例
                    // 反之添加
                    // if ( args.deviceType == 'RTG') {
                    var params = this._observer.getIndexOfListAndInfo(args);
                    console.log(params);
                    if (!params || !params.obj) {
                        return false;
                    }
                    if (args.option === 'add') {
                        // 添加监听设备对象
                        this._observer.showDevice(params);

                    } else if (args.option === 'remove') {
                        // 删除设备监听对象
                        this._observer.hideDevice(params);
                    } else if (args.option === 'location') {
                        this.lastSelDev && this._observer.hideHighLight(this.lastSelDev);
                        this.lastSelDev = params;
                        this._observer.showHighLight(params);
                        this._observer._baseMap.setMapCenter({ x: params.obj.initX, y: params.obj.initY });
                        params.obj.observer.showPop('deviceProfile', params.obj);
                    }
                    break;
                case 'deviceProfile'://设备概况
                    // console.log( args );
                    // this.currentInfoPop = InfoPop({
                    //     'pos': {x:args.drawX*args.scaleRatio, y:args.drawY*args.scaleRatio},
                    //     'data': $.extend({url: args.toString()+'-'+args.jobStatus, jobStatus:args.jobStatus}, args.profileData[0]),
                    //     //'type': args.type,
                    //     'mapId': args._mapId,
                    //     'showScale': this.showScale,
                    //     'elementId': 'J_deviceProfile',
                    //     'templatesType': 'deviceProfile',
                    //     'observer': this._observer,
                    // });                    
                    // this.currentInfoPop.render();
                    this.hidePop();
                    break;
                case 'deviceDetail'://设备详情 
                    this.hidePop();
                    this._biGraphyPop && this._biGraphyPop.zoomOut && this._biGraphyPop.zoomOut();
                    this._infoDetailPop && this._infoDetailPop.renderDeviceDetail(args);
                    break;
                default:
                    //console.log('showpop');
                    break;
            }
        },

        /*
         *
         */
        setInfoPopPosition: function (args) {
            //console.log( this._infoPop );
            this._infoPop && this._infoPop.setInfoPopPosition(args);
        },

        /*
         *
         */
        setInfoPopPositionByDevice: function (device) {
            this._infoPop && this._infoPop.setInfoPopPositionByDevice(device);
        },

        /*
         *
         */
        moveToPosition: function (args, flag) {
            //console.log( this._infoPop );
            this._infoPop && this._infoPop.moveToPosition(args, flag);
        },

        /*
         * 响应地图拖放
         */
        mapDragEnd: function (args) {
            //this.setInfoPopPosition( args );
            this._infoPop && this._infoPop.setInfoPopPosition(args);
        },

        /*
         * 响应地图放大
         */
        mapZoomChange: function (arg) {
            this.showScale = arg;
            this._infoPop.mapZoomChange(arg);
        },

        /*
         * 设置地图中心位置
         */
        mapDragEndByMapCenter: function (arg) {
            this._infoPop && this._infoPop.moveToMapCenter(arg);
        }


    });


    return POPLAYER;
});
