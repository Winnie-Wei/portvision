/**
 * 鹰眼
 */
define(function(require) {
    'use strict';

    var jsrender = require('plugin/jsrender/jsrender');
    var Zrender = require('zrender');
    var Group = require('zrender/container/Group');
    var ImageShape = require('zrender/graphic/Image');
    var ImageUrl = '../../src/js/mod/eagleEye/images/map.png';
    var RADIAN = Math.PI / 180; // 弧度

    /* var eagleEyeTemp =
        '<div class="eagle-eye">\
            <div id="J_eagleMap"></div>\
            <div class="marquee"><div style="position: absolute; left: 50%; top: 50%; width: 4px; height: 4px; border: 1px solid blue;"></div> \</div>\
        </div>'; */

    var eagleEyeTemp =
        '<div class="eagle-eye">\
            <div id="J_eagleMap"></div>\
            <div class="marquee"></div>\
        </div>';

    var EAGLEEYE = function(cfg) {
        if (!(this instanceof EAGLEEYE)) {
            return new EAGLEEYE().init(cfg);
        }
    };

    EAGLEEYE.prototype = $.extend({}, {
        init: function(cfg) {
            var that = this;
            this.grid = cfg.grid;
            this.gridProportion = {
                topBottom: this.grid.top / (this.grid.top + this.grid.bottom)
            };
            this.initCameraPos = cfg.initCameraPos;
            this.callBackFun = cfg.callBackFun;
            this.outthat = cfg.outthat;
            this.zr = null;
            this.wrapper = $('#J_eagleEye');
            this._observer = cfg.observer;
            this.marqueeColor = cfg.marqueeColor || 'red';
            this.eagleW = cfg.eagleW || 300; // 鹰眼地图大小
            this.rotation = cfg.rotation || -19;
            // this.eagleH = cfg.eagleH || 200;
            this.screenRatio = $(window).width() / $(window).height(); // 屏幕比例
            this.deltaX = 0; // 偏移量
            this.deltaY = 0;
            // this.marqueeW = this.eagleW / 1.52; // 选框尺寸
            this.marqueeW = this.eagleW / 2.432; // 选框尺寸
            this.marqueeH = this.marqueeW / this.screenRatio;
            // this.initMarqL = (this.eagleW - this.marqueeW) / 2;     // 初始化选框left值
            // this.initMarqT = (this.eagleH - this.marqueeH) / 2;
            this.initMarqL = 0;
            this.initMarqT = 0;
            this.showMapX = 0; // 屏幕中Map的左上角坐标
            this.showMapY = 0;
            this.eagleImgRatio = $(window).width() / this.eagleW; // 原图与鹰眼图比例
            this.imgW = this.eagleW;
            this.imgH = this.eagleH;
            var img = new Image();
            img.onload = function() {
                console.log(img.width, img.height);
                that.imgRatio = img.width / img.height;
                that.eagleH = that.imgH = that.imgW / that.imgRatio;
                that.initView();
                that.bindEvent();
                that.setPositionByCenter();
                // that.getPosition();
            }
            img.src = ImageUrl;
            return this;
        },
        initView: function() {
            var eagleWraper = jsrender.templates(eagleEyeTemp).render();
            this.wrapper.html(eagleWraper);

            // 在此添加页面上的属性 后期改放css文件中
            this.wrapper.css({
                // 'display': 'none',
                'width': this.eagleW,
                'height': this.eagleH
            });
            $('.marquee').css({
                'top': this.initMarqT,
                'left': this.initMarqL,
                'width': this.marqueeW,
                'height': this.marqueeH
            });

            this.drawEagleMap();
        },
        bindEvent: function() {
            var that = this;
            this.wrapper.off('mousedown').on('mousedown', '.marquee', function(ev) {
                that.callBackFun(that.outthat);
                ev.stopPropagation();
                var marqueeBound = $(this)[0].getBoundingClientRect();
                var mLeft = ev.clientX - marqueeBound.left;
                var mTop = ev.clientY - marqueeBound.top;
                var left = parseInt($(this).css('left'));
                var top = parseInt($(this).css('top'));

                /* var tempLeft = (ev.clientX - that.wrapper[0].getBoundingClientRect().left - 1) / that.eagleW * $(window).width();
                var tempTop = (ev.clientY - that.wrapper[0].getBoundingClientRect().top - 1) / that.eagleH * $(window).height();
                that.outthat.controls.handleMouseDownPan({clientX: -tempLeft, clientY: -tempTop}); */

                that.wrapper.off('mousemove').on('mousemove', function(ev) {
                    that.callBackFun(that.outthat);
                    ev.stopPropagation();
                    var wrapperBound = that.wrapper[0].getBoundingClientRect();
                    left = ev.clientX - wrapperBound.left - mLeft;
                    top = ev.clientY - wrapperBound.top - mTop;
                    $('.marquee').css({ left: left, top: top });
                    ev.cancelBubble = true;

                    /* var tempLeft = (ev.clientX - that.wrapper[0].getBoundingClientRect().left - 1) / that.eagleW * $(window).width();
                    var tempTop = (ev.clientY - that.wrapper[0].getBoundingClientRect().top - 1) / that.eagleH * $(window).height();
                    that.outthat.controls.handleMouseMovePan({clientX: -tempLeft, clientY: -tempTop}); */
                })
                that.wrapper.off('mouseup').on('mouseup', function(ev) {
                    that.callBackFun(that.outthat);
                    ev.stopPropagation();
                    that.wrapper.off('mousemove');
                    /* 高德鹰眼实现
                    // 将选框和地图重绘到中心点
                    $('.marquee').css({
                        'top': that.initMarqT,
                        'left': that.initMarqL,
                    });
                    that.drawEagleMap();
                    */

                    /*left < 0 && (left = 0);
                    top < 0 && (top = 0);
                    left + that.marqueeW > that.eagleW && (left = that.eagleW - that.marqueeW - 2);
                    top + that.marqueeH > that.eagleH && (top = that.eagleH - that.marqueeH - 2);*/

                    $('.marquee').css({
                        'top': top,
                        'left': left
                    });
                    // 返回一个左上角相对底图的坐标
                    var proportion = that.getPositionByCenter();
                    var cameraPos = {
                        x: proportion.x * that.grid.left + that.initCameraPos.x,
                        y: proportion.y >= 0 ? -proportion.y * that.grid.top + that.initCameraPos.z : -proportion.y * that.grid.bottom + that.initCameraPos.z
                    }
                    that.outthat.setCameraPosition(cameraPos.x, cameraPos.y);
                    that.outthat.resetCameraRotation();
                    that.outthat.resetControlsTarget();
                    window.setTimeout(function() {
                        that.outthat.drawContainerByVisibleYard();
                    }, 0);
                    ev.cancelBubble = true;
                    that.wrapper.off('mouseup');
                })
            })
        },
        drawEagleMap: function() {
            var zr = this.zr,
                group = this._group,
                that = this;
            if (!this.zr) {
                zr = this.zr = Zrender.init(document.getElementById('J_eagleMap'));
            }
            if (group) {
                group.removeAll();
                zr.remove(this._group);
            };

            group = this._group = new Group({
                position: [0, 0]
            });
            var l = Math.sqrt(that.imgW * that.imgW + that.imgH * that.imgH) / 2 * Math.sin(19 * RADIAN / 2) * 2;
            var imageMap = new ImageShape({
                position: [0, 0],
                draggable: false,
                style: {
                    // x: -that.deltaX, // 高德
                    // y: -that.deltaY,

                    // x: l * Math.sin(19 * 0.5 * RADIAN + Math.atan(that.imgH / that.imgW)),
                    // y: -l * Math.cos(19 * 0.5 * RADIAN + Math.atan(that.imgH / that.imgW)),
                    x: l * Math.sin(19 * 0.5 * RADIAN + Math.atan(that.imgH / that.imgW)) - 18,
                    y: -l * Math.cos(19 * 0.5 * RADIAN + Math.atan(that.imgH / that.imgW)) - 8,

                    // x: 0,
                    // y: 0,
                    image: ImageUrl,
                    width: that.imgW, // 原始屏幕尺寸宽度 940
                    height: that.imgH
                },
                rotation: -19 * RADIAN
            });

            group.add(imageMap);
            zr.add(group);
        },
        getPosition: function() {
            /*
            // 获取选框左上角相对于底图的坐标
            this.showMapX = this.initMarqL - (-this.deltaX);
            this.showMapY = this.initMarqT - (-this.deltaY);
            console.log({x: this.showMapX, y: this.showMapY});
            // TODO:
            // x, y比例转换
            return {x: this.showMapX, y: this.showMapY};
            */
            var left = parseInt($('.marquee').css('left'));
            var top = parseInt($('.marquee').css('top'));
            console.log({ x: left + this.marqueeW / 2 + 1 - this.eagleW / 2, y: top + this.marqueeH / 2 + 1 - this.eagleH / 2 });
            return { x: left, y: top };
        },
        // setPosition: function (args) {
        //     /*
        //     // TODO:
        //     // x, y比例转换

        //     // 根据传进来的坐标点计算地图偏移量
        //     this.deltaX = x - this.initMarqL;
        //     this.deltaY = y - this.initMarqT;
        //     this.drawEagleMap();
        //     */
        //     this.initMarqL = args[0].x;
        //     this.initMarqT = args[0].y;
        //     this.marqueeW = args[1].x - args[0].x;
        //     this.marqueeH = this.marqueeW / this.screenRatio;
        //     $('.marquee').css({
        //         'left': this.initMarqL,
        //         'top': this.initMarqT,
        //         'width': this.marqueeW,
        //         'height': this.marqueeH,
        //     });
        // },

        // 获取marquee的中心点的坐标比例，坐标轴圆点为中心点，y轴方向上面占5/11，下面占6/11
        getPositionByCenter: function() {
            var left = parseInt($('.marquee').css('left'));
            var top = parseInt($('.marquee').css('top'));
            return { x: (left + this.marqueeW / 2 + 1 - this.eagleW / 2) / (this.eagleW / 2), y: top <= this.eagleH * this.gridProportion.topBottom ? (this.eagleH * this.gridProportion.topBottom - (top + this.marqueeH / 2 + 1)) / (this.eagleH * this.gridProportion.topBottom) : -(top - this.eagleH * this.gridProportion.topBottom + 1 + this.marqueeH / 2) / (this.eagleH * (1 - this.gridProportion.topBottom)) };
        },
        // 根据传进来的坐标比例，设置marquee位置
        setPositionByCenter: function(args) {
            var x = args && (args.x * this.eagleW / 2) || 0;
            var y = args && (args.y >= 0 ? args.y * this.eagleH * this.gridProportion.topBottom : args.y * this.eagleH * (1 - this.gridProportion.topBottom)) || 0;
            var left = x - this.marqueeW / 2 - 1 + this.eagleW / 2;
            var top = y - this.marqueeH / 2 - 1 + this.eagleH * this.gridProportion.topBottom;
            $('.marquee').css({
                left: left,
                top: top
            })
        }
    });

    return EAGLEEYE;
});