/**
 * @moudle prot/mod/titleCircle 区域标签
 */
define(function (require) {
    'use strict'

    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    var Text = require('zrender/graphic/Text');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var PolylineShape = require('zrender/graphic/shape/Polyline');
    var RectShape = require('zrender/graphic/shape/Rect');

    var TITLECIRCLE = function (cfg) {
        if (!(this instanceof TITLECIRCLE)) {
            return new TITLECIRCLE().init(cfg);
        }
    };

    TITLECIRCLE.prototype = $.extend(new McBase(), {


        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.position = cfg.position || {
                x: 0,
                y: 0
            };
            this.bubble = cfg.bubble || false;
            this.initX = cfg.initX || this.position.x;
            this.initY = cfg.initY || this.position.y || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || '#f9efe5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#ead6b3'; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.textPosition = cfg.textPosition || 'top';
            this.labelTitle = cfg.text;
            this.labelNum = [0, 0];
            this.sourceText = cfg.sourceText || this.labelNum - 10;
            this.targetText = cfg.targetText || this.labelNum;
            this.jobType = cfg.jobType || 'LOAD';
            this.location = cfg.location;
            this.isShow = cfg.isShow === true ? true : false;
            // this.changeTo();
            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.position = cfg.position || {
                x: 0,
                y: 0
            };
            this.bubble = cfg.bubble || this.bubble;
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
            this.textPosition = cfg.textPosition || this.textPosition;
            this.labelTitle = cfg.text;
            this.labelNum = cfg.text || this.labelNum;
            this.sourceText = cfg.sourceText || this.sourceText;
            this.targetText = cfg.targetText || this.targetText;
            this.jobType = cfg.jobType || this.jobType;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
            // this.changeTo();
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
            this.titleTimeOutObj && window.clearTimeout(this.titleTimeOutObj);
            // this.titleIntervalObj && window.clearInterval(this.titleIntervalObj);
            this.drawPath();
            // this.drawText();
            this.changeTo();
        },
        refreshImmediately: function () {

        },
        /*
         *
         */
        drawPath: function () {
            if (!this.recPosition) return;
            var zr = this._zr,
                group = this._group,
                scale = this.scaleRatio,
                fillColor = this.fillColor,
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
            var groupRec = new Group({
                position: [this.recPosition[0], this.recPosition[1] + 8]
            })
            // var points = [[0,0]];
            // for( var i = 1; i < vertices.length; i ++){
            //     points.push([(vertices[i].x - vertices[0].x),(vertices[i].y - vertices[0].y)]);
            // }
            //console.log(points);
            // 中心点
            var circle = new CircleShape({
                style: {
                    fill: fillColor,
                    // fill: 'transparent',
                    stroke: strokeColor,
                    lineWidth: 1
                    // opacity: 0.6,
                    // text:labelTitle, // 绘制数值
                    // textFill: textColor,
                    // textPosition: that.textPosition,
                    // textFont: 6 * scale + 'px Microsoft Yahei',
                },
                shape: {
                    cx: 0,
                    cy: 0,
                    // r: 20
                    r: 8

                },
                zlevel: this.zlevel
            });
            var circle0 = new CircleShape({
                style: {
                    fill: 'transparent',
                    stroke: strokeColor,
                    lineWidth: 1,
                    opacity: 0.8
                },
                shape: {
                    cx: 0,
                    cy: 0,
                    r: 16
                },
                zlevel: this.zlevel
            });
            // this.circle = circle;
            // circle.animate('shape', true)
            //     .when(500, {
            //         r: 22,
            //     })
            //     .when(1000, {
            //         r: 20,
            //     })
            //     .start();
            var flag = false;
            $.each(this.sourceText, function (idx, item) {
                if (item) flag = true;
            })
            if (flag) {
                var circle1 = new CircleShape({
                    style: {
                        fill: 'transparent',
                        stroke: strokeColor,
                        lineWidth: 1
                    },
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: 16
                    },
                    zlevel: this.zlevel
                });
                var circle2 = new CircleShape({
                    style: {
                        fill: 'transparent',
                        stroke: strokeColor,
                        lineWidth: 1
                    },
                    shape: {
                        cx: 0,
                        cy: 0,
                        r: 22
                    },
                    zlevel: this.zlevel
                });

                circle1.animate('shape', true)
                    .when(1000, {
                        r: 22
                    })

                    .start();
                circle1.animate('style', true)
                    .when(1000, {
                        opacity: 0.8
                    })

                    .start();

                circle2.animate('shape', true)
                    .when(1000, {
                        r: 28
                    })

                    .start();
                circle2.animate('style', true)
                    .when(1000, {
                        opacity: 0.4
                    })

                    .start();
                group.add(circle1);
                group.add(circle2);
            }

            // 矩形框底
            // var rectPolygon = new PolygonShape({
            //     style: {
            //         // type: 'box',
            //         fill: '#fff',
            //         opacity: 0.6,
            //         stroke: strokeColor,
            //         lineWidth: 1,
            //         // text: this.sourceText + '\n' + this.labelTitle,
            //         // textColor: '#000',
            //         // textFont: 16 * this.scaleRatio + 'px Microsoft Yahei',
            //         // textAlign: 'center',
            //         // textPosition: 'inside',
            //     },
            //     // position: this.recPosition,
            //     shape: {
            //         // points: this.scaleLevel < 3 ? [[0, 0], [96, 0], [96, 48], [0, 48]] : [[0, 0], [130, 0], [130, 65], [0, 65]],
            //         points: [
            //             [0, 0],
            //             [96, 0],
            //             [96, 48],
            //             [0, 48]
            //         ],
            //     },
            //     zlevel: this.zlevel,
            // });
            var roundRect = new RectShape({
                style: {
                    fill: '#fff',
                    stroke: strokeColor,
                    lineWidth: 1,
                    opacity: 0.6
                },
                shape: {
                    width: 96,
                    height: 48,
                    r: 10
                },
                zlevel: this.zlevel
            });

            // 连接线
            var polyline = new PolylineShape({
                style: {
                    smooth: 'bezier',
                    stroke: strokeColor,
                    lineWidth: 1
                },
                shape: {
                    points: this.linePoints
                },
                zlevel: this.zlevel
            });

            var text0 = new Text({
                position: this.labelTitle.length === 1 ? [48, 30] : [48, 20],
                style: {
                    text: this.labelTitle[0] + '：' + this.sourceText[0],
                    textAlign: 'center',
                    // textFont: 2 * this.scaleRatio + 'px Microsoft Yahei',
                    // textFont: '14px Arial',
                    textFont: '12px Arial'
                },
                zlevel: this.zlevel + 1
            });
            groupRec.add(text0);
            if (this.labelTitle.length === 2) {
                var text1 = new Text({
                    position: [48, 38],
                    style: {
                        text: this.labelTitle[1] + '：' + this.sourceText[1],
                        textAlign: 'center',
                        // textFont: 2 * this.scaleRatio + 'px Microsoft Yahei',
                        // textFont: '14px Arial',
                        textFont: '12px Arial'
                    },
                    zlevel: this.zlevel + 1
                });
                groupRec.add(text1);
            }


            // textNum.animate('style', true)
            //     .when(1000, {
            //         text: this.sourceText + 4,
            //     })
            //     .when(2000, {
            //         text: this.sourceText + 8,
            //     })
            //     .start();

            groupRec.add(roundRect);

            group.add(circle);
            group.add(circle0);
            // group.add(rectPolygon);
            group.add(polyline);
            group.add(groupRec);
            // group.add(text);
            zr.add(group);
            this.isShow ? this.show() : this.hide();
        },
        // hide: function(){
        //     this.titleTimeOutObj && window.clearTimeout(this.titleTimeOutObj);
        // },

        // drawText: function(){
        //     var that = this;
        //     this._text && this._group.remove(this._text);
        //     var text = new Text({
        //         // rotation: Math.PI/180*2,
        //         position: [0, -30],
        //         style: {
        //             text: this.labelTitle + this.sourceText,
        //             textAlign: 'center',
        //             x: 0,
        //             y: 0,
        //             textFont: 6 * this.scaleRatio + 'px Microsoft Yahei',
        //         },
        //         zlevel: this.zlevel,
        //     });
        //     this._text = text;
        //     this._group.add(text);
        //     this._zr.add(this._group);
        //     this.isShow ? this.show() : this.hide();
        // },
        changeTo: function () {
            // var that = this;
            // var during = 3 / (~~that.targetText[0] - ~~that.sourceText[0]);
            // that.titleTimeOutObj = window.setTimeout(function () {
            //     if (~~that.sourceText[0] >= ~~that.targetText[0]) {
            //         return;
            //     }
            //     that.sourceText[0] = ~~that.sourceText[0] + 1;
            //     that.drawPath();
            //     that.changeTo();
            // }, during);
            // if(that.targetText.length == 2){
            //     var during = 3 / (~~that.targetText[1] - ~~that.sourceText[1]);
            //     that.titleTimeOutObj = window.setTimeout(function () {
            //         if (~~that.sourceText[1] >= ~~that.targetText[1]) {
            //             return;
            //         }
            //         that.sourceText[1] = ~~that.sourceText[1] + 1;
            //         that.drawPath();
            //         that.changeTo();
            //     }, during);
            // }

            // that.titleIntervalObj = window.setInterval(function(){
            //     if(~~that.sourceText >= ~~that.targetText){
            //         return;
            //     }
            //     that.sourceText = ~~that.sourceText + 4;
            //     // that.drawText();
            //     that.drawPath();
            // }, 1000);
        }
    });

    return TITLECIRCLE;
});