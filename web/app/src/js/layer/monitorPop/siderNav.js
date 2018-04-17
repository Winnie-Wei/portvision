/**
 * @module port/layer/monitorPop/siderNav 侧导航
 */
define(function(require) {
    'use strict';

    var McBase = require('base/mcBase');
    var NavigationBar = require('mod/toolBar/toolBar');
    var EquipmentPop = require('mod/equipmentPop/index');
    var BIGraphyPop = require('mod/biGraphy/biGraphy');
    var GlobalSearchPop = require('mod/globalSearch/globalSearch');
    var ContainerJobList = require('mod/containerJobList/containerJobList');


    var SIDERNAV = function ( cfg ) {
        if( !(this instanceof SIDERNAV) ){
            return new SIDERNAV().init(cfg);
        }

    };

    SIDERNAV.prototype = $.extend(  new McBase(), {

        /*
         * 初始化
         */
        init: function( cfg ){
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.initPops();
            return this;
        },

        /*
         *
         */
        initPops: function(){
            if ( !this._navigationBar ) {
                this._navigationBar = NavigationBar({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                })
                this._navigationBar.render();
            };
            //console.log('init pop');
            if( !this._legendPop ){
                this._legendPop = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'elementId': 'J_mapLegend',
                    'templatesType': 'mapLegend'
                });
            };
            // 设备统计弹框
            if( !this._equipmentPop ){
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
            if( !this._newWarns ){
                this._newWarns = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._newWarns.render();
            };

            // 历史告警消息框
            if( !this._warnHistorys ){
                this._warnHistorys = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._warnHistorys.render();
            };

            // 当前告警消息框
            if( !this._currentWarns ){
                this._currentWarns = InfoPop({
                    'zr':this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._currentWarns.render();
            };
            // 当前告警条目数
            if( !this._warnNum ){
                this._warnNum = InfoPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                })
                this._warnNum.render();
            };

            // BI图表弹框
            if ( !this._biGraphyPop ) {
                this._biGraphyPop = BIGraphyPop({
                    'zr': this._zr,//zr
                    'observer': this._observer,//观察者
                    'showScale': this.showScale,//缩放倍数
                    'initScale': this.initScale
                });
                if(this._biGraphyPop) {     // 注意回放页面没有wrapper元素，返回false，会报错
                    this._biGraphyPop.render();
                }
            };
            // 全局搜索
            if ( !this._globalSearchPop ) {
                this._globalSearchPop = GlobalSearchPop({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                });
                this._globalSearchPop && this._globalSearchPop.render();
            };
            if ( !this._containerJobList ) {
                this._containerJobList = ContainerJobList({
                    'zr': this._zr,//zr
                    'observer': this._observer//观察者
                });
                this._containerJobList && this._containerJobList.render();
            };
            // 回放
            if ( !this._record ) {
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
        initObjects: function( ){
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
        initLegend: function( legends ){
            // 图例层
            this._legendPop.renderMapLegend( legends );
        },

        /*
         * 隐藏弹框：设备统计、设备概况、设备详情、历史告警
         */
        hidePop:function(){
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
        hideBiGraphyPop:function(){
        	this._biGraphyPop && this._biGraphyPop.hide();
        },
        /*
         * 显示bi分析弹框，响应地图放大缩小
         */
        showBiGraphyPop:function(){
        	this._biGraphyPop && this._biGraphyPop.show();
        },
        /**
         * desc: 显示集装箱作业列表
         */
        showContainerJobList: function() {
            this._containerJobList && this._containerJobList.show()
        },
        /**
         * desc: 隐藏集装箱作业列表
         */
        hideContainerJobList: function() {
            this._containerJobList && this._containerJobList.hide()
        }
    });


    return SIDERNAV;
});
