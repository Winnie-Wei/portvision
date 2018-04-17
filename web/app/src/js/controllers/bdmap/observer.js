/**
 * @module port/controllers/monitor/monitorObserver 监控控制器
 */
define(function (require) {
    'use strict';

    var BaseObserver = require('base/mcObserver');
    // var BaseMap = require('layer/baseMap');
    var OverMap = require('layer/overMap');
    var PopLayer = require('layer/mapPop');
    var Attachment = require('layer/monitorPop/attachment');
    //var updateX = -35;
    //var updateY = -100;
    var updateX = 0;
    var updateY = 0;



    var MONITOROBSERVER = function (cfg) {
        if (!(this instanceof MONITOROBSERVER)) {
            return new MONITOROBSERVER().init(cfg);
        }
    };

    MONITOROBSERVER.prototype = $.extend(new BaseObserver(), {
        /*
         * 初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.origionWidth = 940;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.initScale = (this.viewWidth / this.origionWidth);
            this.mainDom = cfg.mainDom || 'main';
            this.scaleLevel = cfg.scaleLevel || 1;
            this.mapType = 'bdmap';
            this.showZoomRatio = this.scaleLevel;
            this.ratioStep = Math.sqrt(3); // 根号8
            this.showScale = this.initScale * Math.pow(this.ratioStep, (this.showZoomRatio - 1));
            if (!this._baseMap) {
                /*this._baseMap = BaseMap({
                    'zr':this._zr,
                    'observer': this,
                    'viewWidth': this.viewWidth,
                    'viewHeight': this.viewHeight,
                    'initScale': this.showScale,
                    'showScale': this.showScale,
                    'scaleLevel':this.scaleLevel,
                    'maxScaleLevel':cfg.maxScaleLevel,
                    'minScaleLevel':cfg.minScaleLevel,
                    'ratioStep': this.ratioStep,
                    'mainDom': this.mainDom,
                    'origionWidth':this.origionWidth,
                    'initX': cfg.initX || -35,
                    'initY': cfg.initY || -84,
                    'is25d': cfg.is25d,
                });                
                this._baseMap.draw(); */
            };

            if (!this._overMap) {
                this._overMap = OverMap({
                    'zr': this._zr,
                    'observer': this,
                    'showScale': this.showScale,
                    'scaleLevel': this.scaleLevel,
                    'ratioStep': this.ratioStep,
                    'initX': cfg.initX || -35,
                    'initY': cfg.initY || -84,
                    'is25d': cfg.is25d
                });
            };
            if (!this._attachment) {
                this._attachment = Attachment({
                    'zr': this._zr,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            if (!this._popLayer) {
                this._popLayer = PopLayer({
                    'zr': this._zr,
                    'observer': this,
                    'scale': this.showScale,
                    'scaleLevel': this.scaleLevel
                });
            };
            this.bindEvent();
            return this;
        },
        /**
         * desc: 显示监控场区
         */
        showMonitorMap: function () {
            this.startMonitor();
            this._attachment.showFunctiontypeLegend();
            //this._overMap.showYardByFunctiontype();
        },
        /**
         * desc: 暂停监控
         */
        stopMonitor: function () {
            var that = this;
            that.warnIntervelObj && window.clearInterval(that.warnIntervelObj);
            that.moveableIntervelObj && window.clearInterval(that.moveableIntervelObj);
            that.stableIntervelObj && window.clearInterval(that.stableIntervelObj);
            that.immediateIntervelObj && window.clearInterval(that.immediateIntervelObj);
            that.reloadIntervelObj && window.clearInterval(that.reloadIntervelObj);
        },
        /**
         * desc: 开启监控
         */
        startMonitor: function () {
            var stableIntervel = 30 * 60; // 单位为秒
            var moveableIntervel = 10 * 60; // 单位为秒
            //var moveBridgeIntervel = 10; // 10秒刷新桥吊
            var immediateIntervel = 3; // 单位为秒
            var warnIntervel = 10; // 单位为秒
            var that = this;
            that.getYards();  // 获取堆场信息
            that.getLabels();   // 获取标签场区信息
            that.getJobPoints(); // 获取作业点信息
            that.getBerths();  // 获取泊位区信息 
            that.getBerthFlags();  // 获取泊位标记信息 
            that.getShips();  // 获取船舶信息 
            that.getCameras();  // 获取摄像头信息     
            that.getHydrant();  // 获取消防栓信息
            that.getSensor();  // 获取传感器信息       
            that.getTracks();  // 获取轨道信息 
            that.getReachstackers();  // 获取正面吊信息 
            that.getBridgecranes();  // 获取桥吊信息    
            that.getGantrycranes();  // 获取龙门吊信息  
            that.getStackers();  // 获取堆高机信息   
            that.getContainers(); // 获取集卡信息
            that.getNewWarns(); // 获取最新告警信息

            that.warnIntervelObj && window.clearInterval(that.warnIntervelObj);
            that.moveableIntervelObj && window.clearInterval(that.moveableIntervelObj);
            that.stableIntervelObj && window.clearInterval(that.stableIntervelObj);
            that.immediateIntervelObj && window.clearInterval(that.immediateIntervelObj);
            that.reloadIntervelObj && window.clearInterval(that.reloadIntervelObj);

            // 静态物体 ，stableIntervel（30分钟）加载一次 
            that.stableIntervelObj = window.setInterval(function () {
                that.getLabels();   // 获取标签场区信息
                that.getBerths();  // 获取泊位区信息  
                that.getTracks();  // 获取轨道信息
                that.getBerthFlags();  // 获取泊位标记信息   
                that.getJobPoints(); // 获取作业点信息
                that.getCameras();  // 获取摄像头信息
                that.getHydrant();  // 获取消防栓信息
                that.getSensor();   // 获取传感器信息
            }, stableIntervel * 1000);


            // 活动设备物体，moveableIntervel（1分钟）加载一次
            that.moveableIntervelObj = window.setInterval(function () {
                that.getShips();  // 获取船舶信息                  
            }, moveableIntervel * 1000);



            // 实时监控信息，immediateIntervel（3秒钟）加载一次
            that.immediateIntervelObj = window.setInterval(function () {
                that.getContainers();  // 获取集卡信息
                that.getYards();  // 获取堆场信息               
                that.getShips();  // 获取堆场信息
                window.setTimeout(function () {
                    that.getReachstackers();  // 获取正面吊信息 
                    that.getBridgecranes();  // 获取桥吊信息                       
                    window.setTimeout(function () {
                        that.getGantrycranes();  // 获取龙门吊信息  
                        that.getStackers();  // 获取堆高机信息   
                    }, 1000);
                }, 500);

            }, immediateIntervel * 1000);

            // 实时告警信息，warnIntervel（30秒钟）加载一次
            that.warnIntervelObj = window.setInterval(function () {
                that.getNewWarns(); // 实时告警信息
                that.getBiGraphData();  // 获取bi弹框信息                       
            }, warnIntervel * 1000);

            that.reloadIntervelObj = window.setInterval(function () {
                console.log('update page');
                window.location.reload();
            }, 2 * 60 * 60 * 1000);  // 2小时后刷页面
            //console.log( 'start monitor' );
        },
        /**
         * desc: 显示设备作业状态
         */
        showDeviceJobType: function (cfg) {
            this._overMap.showDeviceJobType(cfg);
        },
        /**
         * desc: 隐藏设备作业状态
         */
        hideDeviceJobType: function () {
            this._overMap.hideDeviceJobType();
        },

        /**
         * desc: 显示热力图场区
         */
        showThermodynamicMap: function (cfg) {
            this._attachment.showThermodynamicLegend();
            this._overMap.showYardByThermodynamic(cfg);
        },
        /**
         * desc: 隐藏热力图场区
         */
        hideThermodynamicMap: function () {
            this._attachment.showFunctiontypeLegend();
            this._overMap.showYardByFunctiontype();
        },
        /**
         * desc: 显示道路状况图场区
         */
        showRoadConditionMap: function () {
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/road?cycle=DAY',
                data: '',
                success: function (data) {
                    $('.wharfRoad').prop('checked', true);
                    var result = data.ROAD;
                    $.each(result, function (idx, item) {
                        item.LONGITUDE = that.convertFromLng(item.LONGITUDE) + updateX;
                        item.LATITUDE = that.convertFromLat(item.LATITUDE) + updateY;
                    })
                    that._overMap.showRoadConditionMap(result);
                    that._isgetRoadConditioning = false;
                },
                error: function (e) {
                    that._isgetRoadConditioning = false;
                    console.log(e);
                }
            };
            if (this._isgetRoadConditioning) {
                return false;
            }
            this._isgetRoadConditioning = true;
            $.ajax(ajaxConfig);

        },
        /**
         * desc: 隐藏道路状况图场区
         */
        hideRoadConditionMap: function () {

            this._overMap.hideRoadConditionMap();
        },
        /**
         * desc: 显示作业分析场区
         */
        showJobAnalysisMap: function () {
            this._overMap.showYardJobLine && this._overMap.showYardJobLine();
            this._overMap.showJobPoints && this._overMap.showJobPoints();

        },
        /**
         * desc: 隐藏作业分析场区
         */
        hideJobAnalysisMap: function () {
            this._overMap.hideYardJobLine && this._overMap.hideYardJobLine();
            this._overMap.hideJobPoints && this._overMap.hideJobPoints();
        },
        /**
         * desc: 显示摄像头
         */
        showCamera: function () {
            this._overMap.showCamera && this._overMap.showCamera();
        },
        /**
         * desc: 隐藏摄像头
         */
        hideCamera: function () {
            this._overMap.hideCamera && this._overMap.hideCamera();
        },
        /**
         * desc: 显示消防栓
         */
        showHydrant: function () {
            this._overMap.showHydrant && this._overMap.showHydrant();
        },
        /**
         * desc: 隐藏消防栓
         */
        hideHydrant: function () {
            this._overMap.hideHydrant && this._overMap.hideHydrant();
        },
        /**
         * desc: 显示传感器
         */
        showSensor: function () {
            this._overMap.showSensor && this._overMap.showSensor();
        },
        /**
         * desc: 隐藏传感器
         */
        hideSensor: function () {
            this._overMap.hideSensor && this._overMap.hideSensor();
        },
        /**
         * desc: 开启GPS to Line
         */
        showTailLine: function () {
            this._overMap.showTailLine && this._overMap.showTailLine();
        },
        /**
         * desc: 隐藏GPS to Line
         */
        hideTailLine: function () {
            this._overMap.hideTailLine && this._overMap.hideTailLine();
        },
        /**
         * desc: 显示集装箱作业列表
         */
        showContainerJobList: function () {
            this._popLayer.showContainerJobList();
            // this._overMap.showContainerJobList();
        },
        /**
         * desc: 隐藏集装箱作业列表
         */
        hideContainerJobList: function () {
            this._popLayer.hideContainerJobList();
            // this._overMap.hideContainerJobList();
        },
        /*
         *  开通鼠标取点功能
         */
        showGetPoint: function () {
            var that = this;
            if (!this._baseMap) {
                return false;
            }
            this._baseMap.showGetPoint();
            this._zr.on('click', function (ev) {
                //console.log(ev.offsetX , ev.offsetY);
                //console.log( (POINT[0].x + that.lastDrawX ) * that.showScale, (POINT[0].y + that.lastDrawY )  * that.showScale );
                var x = ev.offsetX;
                var y = ev.offsetY;
                var lng, lat, nx, ny;
                nx = x / that.showScale + 35;
                ny = y / that.showScale + 84;
                //console.log( nx, ny );
                lng = that.convertToLng(nx);
                lat = that.convertToLat(ny);
                $('#J_consolePanel').html('x : ' + x + ' , ' + 'y : ' + y + ' , ' + 'lng : ' + lng + ' , ' + 'lat : ' + lat);
            })
        },

        /*
         *  关闭鼠标取点功能
       */
        hideGetPoint: function () {
            this._baseMap.hideGetPoint();
            this._zr.off('click');
        },
        switchDeviceQuota: function (isShowQuota) {
            this._overMap && this._overMap.switchDeviceQuota(isShowQuota);
        },
        switchYardQuota: function (isShowQuota) {
            this._overMap && this._overMap.switchYardQuota(isShowQuota);
        },
        /*
         * 隐藏bi分析弹框，响应地图放大缩小
         */
        hideBiGraphyPop: function () {
            this._popLayer && this._popLayer.hideBiGraphyPop();
        },
        /*
         * 显示bi分析弹框，响应地图放大缩小
         */
        showBiGraphyPop: function () {
            this._popLayer && this._popLayer.showBiGraphyPop();
        }
    });
    return MONITOROBSERVER;
});