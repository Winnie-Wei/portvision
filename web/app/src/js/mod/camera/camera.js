/**
 * @module port/mod/Camera 摄像头
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var CircleShape = require('zrender/graphic/shape/Circle');

    var CAMERA = function (cfg) {
        if (!(this instanceof CAMERA)) {
            return new CAMERA().init(cfg);
        }
    };

    CAMERA.prototype = $.extend(new McBase(), {

        /*
        *
        */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.initX || cfg.x;
            this.initY = cfg.initY || cfg.y;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.rotation = cfg.rotation || 0; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.deviceType = 'camera';
            this.deviceData = cfg.deviceData || {};
            // this.width = cfg.CAMERAWidth || 144;
            this.imagePoint = { x: 6, y: 8 };//图片尺寸大小
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            this.alarm = cfg.alarm;
            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.x || this.initX;
            this.initY = cfg.y || this.initY;
            this.deltaX = cfg.deltaX || this.deltaX;
            this.deltaY = cfg.deltaY || this.deltaY;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.maxScaleLevel = cfg.maxScaleLevel || this.maxScaleLevel;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
            this.isSelected = cfg.isSelected === undefined ? this.isSelected : cfg.isSelected;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === undefined ? this.isShowDeviceJobType : cfg.isShowDeviceJobType;
            this.offset = { x: 0, y: 0 };
            this.initPosition = null;
            this.workStatus = cfg.workStatus || this.workStatus;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.alarm = cfg.alarm || this.alarm;
        },

        /*
        *
        */
        switchCamera: function (isShow) {
            this.isShow = isShow;
            this.draw();
        },

        /*
        *
        */
        remove: function () {
            //console.log('remove');
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
        reDrawByWorkStatus: function (workStatus) {    // 状态重置
            this.workStatus = workStatus;
            this.draw();
        },

        /*
        *
        */
        draw: function () {
            if (!this.isShow) {
                this.hide();
                return;
            }
            var scaleRatio = this.scaleRatio,
                group = this._group,
                that = this,
                zr = this._zr,
                imageUrl;

            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio],
                zlevel: this.zlevel
            });

            if (scaleRatio < 1) {
                imageUrl = '../../src/js/mod/camera/images/min/icon-active.png';
            } else {
                imageUrl = '../../src/js/mod/camera/images/max/icon-active.png';
            }

            var smallgroup = new Group({
                position: [0, 0]
            });
            var hightLightRadius = 10;
            var warnHighLight = new CircleShape({
                position: [0, 0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: hightLightRadius
                },
                style: {
                    type: 'warn',
                    fill: '#fff',
                    stroke: 'red',
                    opacity: 0.6,
                    lineWidth: 1
                },
                zlevel: this.zlevel - 1
            });

            var highLight = new CircleShape({
                position: [0, 0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: hightLightRadius
                },
                style: {
                    type: 'highLight',
                    fill: '#CADAED',
                    stroke: '#3195E5',
                    opacity: 0.6,
                    lineWidth: 1
                },
                zlevel: this.zlevel - 1
            });



            var cameraImage = new ImageShape({
                style: {
                    image: imageUrl,
                    x: -parseInt(this.imagePoint.x) / 2,
                    y: -parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            }).on('click', function () {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.showHighLight();
                that.observer.showProfilePop(obj);
            });
            // console.log( cameraImage );
            // 告警内容没有配置  （未完成）
            if (this.alarm && this.alarm.ALARM_NAME === '') {
                smallgroup.add(warnHighLight);
            }
            smallgroup.add(cameraImage);
            smallgroup.add(highLight);
            group.add(smallgroup);
            zr.add(group);
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            // this.isShowCamera ? this.show() : this.hide();
            return this;
        },

        /*
         * 显示摄像机高亮状态
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            this.isSelected = true;
            $.each(this._group._children[0]._children, function (k, v) {
                if (v instanceof CircleShape && v.style.type === 'highLight') {
                    v.show();
                }
            });
        },

        /*
         * 隐藏摄像机高亮状态
         * 查找高亮元素调用 隐藏方法
         */
        hideHighLight: function () {
            this.isSelected = false;
            if (!this._group || !this._group._children[0]._children) {      // 注意children层级
                return false;
            }
            $.each(this._group._children[0]._children, function (k, v) {
                if (v instanceof CircleShape && v.style.type === 'highLight') {
                    v.hide();
                }
            });
        },

        /*
         *
         */
        setSelectedProp: function (isSelected) {
            this.isSelected = isSelected;
            if (isSelected) {
                this.showHighLight();
            } else {
                this.hideHighLight();
            }
            return this;
        },

        /*
        * 根据状态获得相应的图片路径
        */
        getImageUrl: function (workStatus) {
            var imageUrl = '';
            if (this.scaleRatio < this.maxShowScale) {
                this.imagePoint = { x: 8, y: 10 };
                switch (workStatus) {
                    case 1:
                        imageUrl = 'src/js/mod/BERTH/images/icon-i-active.png';
                        break;
                    case 2:
                        imageUrl = 'src/js/mod/BERTH/images/icon-i-freeHasJob.png';
                        break;
                    case 3:
                        imageUrl = 'src/js/mod/BERTH/images/icon-i-free.png';
                        break;
                    case 4:
                        imageUrl = 'src/js/mod/BERTH/images/icon-i-broken.png';
                        break;
                    default:
                        imageUrl = 'src/js/mod/BERTH/images/icon-i-active.png';
                }
            } else {
                this.imagePoint = { x: 36, y: 50 };
                switch (workStatus) {
                    case 1:
                        imageUrl = 'src/js/mod/BERTH/images/icon-hang-active.png';
                        break;
                    case 2:
                        imageUrl = 'src/js/mod/BERTH/images/icon-hang-freeHasJob.png';
                        break;
                    case 3:
                        imageUrl = 'src/js/mod/BERTH/images/icon-hang-free.png';
                        break;
                    case 4:
                        imageUrl = 'src/js/mod/BERTH/images/icon-hang-broken.png';
                        break;
                    default:
                        imageUrl = 'src/js/mod/BERTH/images/icon-hang-active.png';
                }
            }
            return imageUrl;
        }
    });

    return CAMERA;
});