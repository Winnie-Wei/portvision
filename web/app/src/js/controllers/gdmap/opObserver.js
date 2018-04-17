/**
 * @module port/controllers/gdmap/observer 监控控制器
 */
define(function (require) {
    'use strict';

    var BaseObserver = require('controllers/monitor/observer');
    var OverMap = require('layer/opGdoverMap');
    var PopLayer = require('layer/mapPop');
    var Attachment = require('layer/monitorPop/attachment');
    var BaseMap = require('layer/opGdBaseMap');

    var updateX = 0, updateY = 0;


    var GDMONITOROBSERVER = function (cfg) {
        if (!(this instanceof GDMONITOROBSERVER)) {
            return new GDMONITOROBSERVER().init(cfg);
        }
    };

    GDMONITOROBSERVER.prototype = $.extend(new BaseObserver(), {
        init: function (cfg) {
            //console.log( cfg );
            var that = this;
            this.is25d = cfg.is25d;
            this._zr = cfg.zr || cfg.zr;
            this.map = cfg.map;
            this.customLayer = cfg.customLayer;
            // this.origionWidth = 940;           
            this.origionWidth = 853.2;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.showScale = (this.viewWidth / this.origionWidth);
            this.baseZoom = 16;
            this.currentZoom = cfg.currentZoom;
            //this.scaleLevel = this.map.getZoom() - this.baseZoom;  // 放大级别，第一级对应16。
            this.mainDom = cfg.mainDom || 'main';
            if (!this._baseMap) {
                this._baseMap = BaseMap({
                    'zr': this._zr,
                    'observer': this,
                    'viewWidth': this.viewWidth,
                    'viewHeight': this.viewHeight,
                    'initScale': this.showScale,
                    'showScale': this.showScale,
                    'scaleLevel': this.scaleLevel,
                    'maxScaleLevel': cfg.maxScaleLevel,
                    'minScaleLevel': cfg.minScaleLevel,
                    'ratioStep': this.ratioStep,
                    'mainDom': this.mainDom,
                    'origionWidth': this.origionWidth,
                    'initX': cfg.initX || -35,
                    'initY': cfg.initY || -84,
                    'is25d': cfg.is25d
                });
            };
            if (!this._overMap) {
                this._overMap = OverMap({
                    'zr': this._zr,
                    'map': this.map,
                    'observer': this,
                    'showScale': this.showScale,
                    // 'initX': 40,
                    // 'initY': -25,
                    // 'initX': 650 / this.showScale,
                    // 'initY': 280 / this.showScale,
                    'is25d': this.is25d,
                    'showScale': 1.28
                });
            };
            // TODO: 将原overmap拆解成yardLayer,equipmentLayer两类，绘制堆场层和设备层。
            if (!this._attachment) {
                this._attachment = Attachment({
                    'zr': this._zr,
                    //'map':this.map,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            if (!this._popLayer) {
                this._popLayer = PopLayer({
                    'zr': this._zr,
                    //'map':this.map,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            this.bindEvent();
            var that = this;
            // this.map.panBy(-180, -180);         
            return this;
        },
        bindEvent: function () {
            var it = this;
    		/*this.map.on('zoomstart',function(ev){
    			it.scaleLevel = it.map.getZoom() - it.baseZoom;    			
    			// it._overMap && it._overMap.onZoomEnd( it.scaleLevel );
    		})
            .on('zoomchange', function(){
                it._overMap && it._overMap.setInfoPopPosition();
                it._overMap && it._overMap.onZoomEnd( it.scaleLevel );
            })
            .on('dragging', function(){
                it._overMap && it._overMap.setInfoPopPosition();
            })*/

            // this.map.on('movestart', function(){
            //     // if(!that.moveFlag)   return;
            //     it.customLayer.hide();
            // })
            // .on('moveend', function(){
            //     // if(!that.moveFlag)   return;
            //     it.operateMap(it);
            //     window.setTimeout(function(){
            //         it.customLayer.show();
            //     });
            // })


            this.map.on('movestart', function () {
                it.customLayer.hide();
            })
                .on('moveend', function () {
                    it._overMap.mapDragEnd();
                    window.setTimeout(function () {
                        it.customLayer.show();
                    });
                })
                .on('zoomstart', function () {
                    it.customLayer.hide();
                })
                .on('zoomend', function () {
                    it._overMap.mapZoomChange();
                    window.setTimeout(function () {
                        it.customLayer.show();
                    });
                })
        },
        /*
         *  开通鼠标取点功能
         */
        showGetPoint: function () {
            // this._overMap.setAttr('bubble', true);
            $('#J_consolePanel').html('').show();
        },
        clickEventListener: function (that, e) {
            var lng = e.lnglat.getLng();
            var lat = e.lnglat.getLat();
            var obj = that.getXY(lng, lat);
            $('#J_consolePanel').html('x：' + obj.drawX.toFixed(6) + ',y：' + obj.drawY.toFixed(6) + '，' + 'lng：' + lng.toFixed(6) + ',lat：' + lat.toFixed(6));
        },
        /*
         *  关闭鼠标取点功能
       */
        hideGetPoint: function () {
            // this._overMap.setAttr('bubble', false);
            $('#J_consolePanel').hide();
        },

        showPaintPolyline: function () {
            this.mousetool = new AMap.MouseTool(this.map);
            this.mousetool.polyline(); //使用鼠标工具，在地图上画标记点
        },
        hidePaintPolyline: function () {
            this.mousetool.close(false);
        },

        showRoadPolyline: function () {
            this._overMap.showRoadPolyline();
        },
        hideRoadPolyline: function () {
            this._overMap.hideRoadPolyline();
        },

        /*
         *  通过经纬度获取在屏幕上的位置
         */
        getXY: function (lng, lat) {
            var obj = {};
            var pixel = this.map.lnglatTocontainer([lng, lat]);
            obj.x = pixel.getX();
            obj.y = pixel.getY();
            return obj;
        },

        getLngLat: function (x, y) {
            var obj = {};
            var lnglat = this.map.containTolnglat(new AMap.Pixel(x, y));
            obj.lng = lnglat.getLng();
            obj.lat = lnglat.getLat();
            return obj;
        },
        /*
         *  获取两点间的距离
         */
        getDistance: function (p1, p2) {
            var p1 = this.getXY(p1[0], p1[1]);
            var p2 = this.getXY(p2[0], p2[1]);
            var distance = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
            return distance;
        }
    });
    return GDMONITOROBSERVER;
});
