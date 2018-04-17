/**
 * @moudle prot/mod/track/track 道路
 */
define(function (require) {
    'use strict'

    var McBase = require('base/mcBase');

    var TRACK = function (cfg) {
        if (!(this instanceof TRACK)) {
            return new TRACK().init(cfg);
        }
    };

    TRACK.prototype = $.extend(new McBase(), {


        init: function (cfg) {
            this.amap = cfg.map;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
            this.points = cfg.points || [[[300, 400], [300, 430], [350, 460], [380, 490]], [[400, 410], [410, 503], [435, 506], [450, 540]]];
            this.fillColor = cfg.fillColor || '#f9efe5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#ccc'; // 边框颜色
            this.strokeOpacity = cfg.strokeOpacity || 1;
            this.strokeWeight = cfg.strokeWeight || 2;
            this.strokeStyle = cfg.strokeStyle || 'solid';
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.isShow = cfg.isShow === true ? true : false;
            return this;
        },

        update: function (cfg) {
            this.amap = cfg.map;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || this.bubble;
            this.points = cfg.points || this.points;
            this.fillColor = cfg.fillColor || this.fillColor; // 底色
            this.textColor = cfg.textColor || this.textColor; // 文字颜色
            this.strokeColor = cfg.strokeColor || this.strokeColor; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
        },

        hide: function () {
            this.polyline.hide();
        },

        /*
         *
         */
        remove: function () {
            // this._remove();
            this.polyline && this.amap.remove([this.polyline]);
        },

        /*
         *
         */
        redrawByPosScale: function (args) {
            this.drawX = this.initX + args.x;
            this.drawY = this.initY + args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            this.draw();
        },

        /*
         *
         */
        draw: function () {
            this.polyline = new AMap.Polyline({
                path: this.points,
                strokeColor: this.strokeColor,
                strokeOpacity: this.strokeOpacity,
                strokeWeight: this.strokeWeight,
                strokeStyle: this.strokeStyle,
                zIndex: this.zlevel,
                cursor: this.cursor,
                bubble: this.bubble
            });
            this.polyline.setMap(this.amap);
        }
    })

    return TRACK;
});