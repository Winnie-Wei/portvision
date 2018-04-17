/**
 * @module port/controllers/gdmap/observer 监控控制器
 */
define(function (require) {
    'use strict';

    var BaseObserver = require('controllers/monitor/observer');
    var OverMap = require('layer/gdOverMap');
    var PopLayer = require('layer/mapPop');
    var Attachment = require('layer/monitorPop/attachment');



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
            //this._zr = cfg.zr || cfg.zr;
            this.map = cfg.map;
            this.origionWidth = 940;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.showScale = (this.viewWidth / this.origionWidth);
            this.baseZoom = 16;
            this.scaleLevel = this.map.getZoom() - this.baseZoom;  // 放大级别，第一级对应16。
            this.mainDom = cfg.mainDom || 'main';
            if (!this._overMap) {
                this._overMap = OverMap({
                    //'zr':this._zr,
                    'map': this.map,
                    'observer': this,
                    'showScale': this.showScale,
                    'initX': -35,
                    'initY': -84,
                    'is25d': this.is25d
                });
            };
            if (!this._attachment) {
                this._attachment = Attachment({
                    //'zr':this._zr,
                    'map': this.map,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            if (!this._popLayer) {
                this._popLayer = PopLayer({
                    //'zr':this._zr,
                    'map': this.map,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            this.bindEvent();
            this.map.on('click', function (e) {
                that.clickEventListener(that, e);
            });
            return this;
        },
        bindEvent: function () {
            var it = this;
            this.map.on('zoomstart', function () {
                // it.scaleLevel = it.map.getZoom() - it.baseZoom;    			
                // it._overMap && it._overMap.onZoomEnd( it.scaleLevel );
            })
                .on('zoomchange', function () {
                    it.scaleLevel = it.map.getZoom() - it.baseZoom;
                    it._overMap && it._overMap.setInfoPopPosition();
                    it._overMap && it._overMap.onZoomEnd(it.scaleLevel);
                })
                .on('dragging', function () {
                    it._overMap && it._overMap.setInfoPopPosition();
                })
        },
        /**
         * desc: 获取泊位信息
         */
        getBerths: function () {
            var that = this;
            if (this._isgetBerthsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/boat/gdBerth.json',
                data: '',
                success: function (data) {
                    that._isgetBerthsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('berth', data);
                },
                error: function (e) {
                    that._isgetBerthsing = false;
                    console.log(e);
                }
            };
            this._isgetBerthsing = true;
            $.ajax(ajaxConfig);
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
            var obj = that._overMap.getXY(lng, lat);
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
            var that = this;
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/track/gdRoad.json',             
                url: '../../src/js/mod/track/gdRoadPoints.json',
                data: '',
                success: function (data) {
                    that._overMap.showRoadPolyline(data);
                    that._isgetRoadPolylineing = false;
                },
                error: function (e) {
                    that._isgetRoadPolylineing = false;
                    console.log(e);
                }
            };
            if (this._isgetRoadPolylineing) {
                return false;
            }
            this._isgetRoadPolylineing = true;
            $.ajax(ajaxConfig);

        },
        hideRoadPolyline: function () {
            this._overMap.hideRoadPolyline();
        }
    });
    return GDMONITOROBSERVER;
});
