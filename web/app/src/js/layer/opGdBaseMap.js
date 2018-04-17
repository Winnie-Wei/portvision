/**
 * @module port/mod/baseMap 地图底图
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    // var updateX = 35;
    // var updateY = 90;
    //var updateX = 0;
    //var updateY = 0;

    var BASEMAP = function (cfg) {
        if (!(this instanceof BASEMAP)) {
            return new BASEMAP().init(cfg);
        }
    };

    BASEMAP.prototype = $.extend(new McBase(), {

        /*
         *  
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.viewWidth = cfg.viewWidth;
            this.viewHeight = cfg.viewHeight;
            this.mainDom = cfg.mainDom || 'main';
            //updateX = cfg.updateX || updateX;
            //updateY = cfg.updateY || updateY;
            this.initX = cfg.x || 0;
            this.initY = cfg.y || 0;
            this.drawX = this.initX;
            this.drawY = this.initY || 0;
            this.lastX = this.initX;
            this.lastY = this.initY || 0;
            this.is25d = cfg.is25d;

            this.origionWidth = cfg.origionWidth;
            this.initZoomRatio = cfg.zoomRatio || 1;
            this.showZoomRatio = this.initZoomRatio;
            this.maxZoomRatio = cfg.maxScaleLevel || 3;  // 总共3级，分别对应1，4，8
            this.minZoomRatio = cfg.minScaleLevel || 1;
            this.ratioStep = cfg.ratioStep || Math.sqrt(3); // 根号8
            this.initScale = cfg.initScale;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.showZoomRatio = this.scaleLevel;
            this.showScale = cfg.showScale;
            this.deltaX = 0;
            this.deltaY = 0;
            this.bindEvent();
            return this;
        },

        /*
         *
         */
        bindEvent: function () {
        },
        setGdMapCenter: function (args) {
            this.observer.fire('mapDragEndByMapCenter', { x: args.x, y: args.y })
        }
    });
    return BASEMAP;
});