/**
 * @moudle prot/mod/titleLabel 区域标签
 */
define(function (require) {
    'use strict'
    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    // var RectShape = require('zrender/graphic/shape/Rect');
    var PolygonShape = require('zrender/graphic/shape/Polygon');

    var TITLELABEL = function (cfg) {
        if (!(this instanceof TITLELABEL)) {
            return new TITLELABEL().init(cfg);
        }
    };

    TITLELABEL.prototype = $.extend(new McBase(), {

        /*
         *
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.observer = cfg.observer;
            this.vertices = cfg.vertices || [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }];
            this.initX = cfg.initX || this.vertices[0].x;
            this.initY = cfg.initY || this.vertices[0].y || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || '#f9efe5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#ead6b3'; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.labelTitle = cfg.text;
            this.deviceType = cfg.deviceType;
            var relateX = this.vertices[1].x - this.vertices[0].x;
            var relateY = this.vertices[1].y - this.vertices[0].y;
            this.rotation = Math.atan2(relateY, relateX) + 1.5; // 弧度
            this.isShow = cfg.isShow === true ? true : false;
            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.observer = cfg.observer || this.observer;
            this.vertices = cfg.vertices || this.vertices;
            this.initX = cfg.initX || this.initX;
            this.initY = cfg.initY || this.initY;
            this.deltaX = cfg.deltaX || this.deltaX;
            this.deltaY = cfg.deltaY || this.deltaY;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || this.fillColor; // 底色
            this.textColor = cfg.textColor || this.textColor; // 文字颜色
            this.strokeColor = cfg.strokeColor || this.strokeColor; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.labelTitle = cfg.text || this.text;
            this.deviceType = cfg.deviceType || this.deviceType;
            var relateX = this.vertices[1].x - this.vertices[0].x;
            var relateY = this.vertices[1].y - this.vertices[0].y;
            this.rotation = Math.atan2(relateY, relateX) + 1.5; // 弧度
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
        },


        /*
         *
         */
        remove: function () {
            this._remove();
            delete this;
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
            this.drawPath();
        },

        /*
         *
         */
        drawPath: function () {
            var zr = this._zr,
                group = this._group,
                labelTitle = this.labelTitle + '',
                vertices = this.vertices,
                scale = this.scaleRatio,
                fillColor = this.fillColor,
                textColor = this.textColor,
                strokeColor = this.strokeColor;
                // that = this;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scale, this.drawY * scale],
                scale: [scale, scale],
                rotation: 0
            });
            var points = [[0, 0]];
            for (var i = 1; i < vertices.length; i++) {
                points.push([(vertices[i].x - vertices[0].x), (vertices[i].y - vertices[0].y)]);
            }
            //console.log(points);
            var rectPolygon = new PolygonShape({
                style: {
                    fill: fillColor,
                    stroke: strokeColor,
                    lineWidth: 1,
                    text: labelTitle,
                    //textBaseline: 'bottom',
                    //textRotation: this.rotation,
                    textFill: textColor,
                    textFont: 6 * scale + 'px Microsoft Yahei',
                    lineDash: [10, 10]
                },
                shape: {
                    // points: [[0, 0], [108, 37], [102, 56], [-6, 19]],
                    // points: [[0, 0], [596, 202], [970, 220], [970, 276], [579, 258], [-17, 51]],
                    points: points
                },
                zlevel: this.zlevel + 1
            });
            group.add(rectPolygon);
            zr.add(group);
            this.isShow ? this.show() : this.hide();
        }
    });

    return TITLELABEL;
});