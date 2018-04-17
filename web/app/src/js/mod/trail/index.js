/**
 * @moudle prot/mod/trail/index 轨迹
 */
define(function (require) {
    'use strict'

    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    // var CircleShape = require('zrender/graphic/shape/Circle');
    var PolylineShape = require('zrender/graphic/shape/Polyline');

    var TRAIL = function (cfg) {
        if (!(this instanceof TRAIL)) {
            return new TRAIL().init(cfg);
        }
    };

    TRAIL.prototype = $.extend(new McBase(), {


        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.lineWidth = cfg.lineWidth || 2;
            this.points = cfg.points || [[[300, 400], [300, 430], [350, 460], [380, 490]], [[400, 410], [410, 503], [435, 506], [450, 540]]];
            // this.points = [[[300,400],[300,430],[350,460],[380,490]],[[400,410],[410,503],[435,506],[450,540]]];
            this.initX = cfg.initX || 0;
            this.initY = cfg.initY || 0;
            // this.position = [ this.initX, this.initY ];
            this.position = cfg.position || [0, 0];
            // this.deltaX = cfg.deltaX || -35;
            // this.deltaY = cfg.deltaY || -84;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || '#f9efe5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#479de7'; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.isShow = cfg.isShow === true ? true : false;
            return this;
        },

        /*
         *
         */
        remove: function () {
            // this._remove();
            this._group && this._zr.remove(this._group);
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
            this.drawTrail();
        },

        /*
         *  绘制轨迹
         */
        drawTrail: function () {
            var that = this;
            var zr = this._zr,
                scale = this.scaleRatio,
                // fillColor = this.fillColor,
                // textColor = this.textColor,
                strokeColor = this.strokeColor,
                parent = this;
            if (this.points.length === 0) {
                return false;
            }
            if (this._group) {
                zr.remove(this._group);
            };
            this._group = new Group({
                position: [this.drawX * scale, this.drawY * scale],
                scale: [scale, scale],
                rotation: 0

            });

            $.each(this.points, function (k, pointArray) {
                if (pointArray.length === 0) {
                    return false;
                }
                var polyline = new PolylineShape({
                    position: parent.position,
                    style: {
                        smooth: 'bezier',
                        stroke: strokeColor,
                        lineWidth: that.lineWidth
                    },
                    shape: {
                        points: pointArray
                    },
                    zlevel: parent.zlevel
                });
                parent._group.add(polyline);
            })

            zr.add(parent._group);
            this.isShow ? this.show() : this.hide();
        }
    });

    return TRAIL;
});