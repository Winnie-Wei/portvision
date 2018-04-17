/**
 * @module port/mod/GANTRYCRANE 龙门吊
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var Text = require('zrender/graphic/Text');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var ProgressBar = require('mod/progressBar/progressBar');
    var directionAnimate = require('mod/directionAnimate/directionAnimate');
    var imageUrl = '';

    var GANTRYCRANE = function (cfg) {
        if (!(this instanceof GANTRYCRANE)) {
            return new GANTRYCRANE().init(cfg);
        }
    };

    GANTRYCRANE.prototype = $.extend(new McBase(), {

        /*
         *  初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            if (!this._zr) {
                return this;
            }
            this.is25d = cfg.is25d;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.x || 0;
            this.initY = cfg.y || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.sourceX = cfg.sourceX + this.deltaX;
            this.sourceY = cfg.sourceY + this.deltaY;
            this.targetX = cfg.targetX + this.deltaX;
            this.targetY = cfg.targetY + this.deltaY;
            this.targetXY = cfg.targetXY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.rotation = cfg.rotation || 0; // -0.3
            this.rotation = this.is25d ? -0.3 : cfg.rotation;
            //this.rotation = -0.3;
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
            this.jobType = cfg.jobType || 'LOAD';
            this.offset = {
                x: 0,
                y: 0
            };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.imagePoint = {
                x: 8,
                y: 10
            }; //图片尺寸大小
            this.identity = cfg.identity;
            this.deviceType = 'gantrycrane';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShipment = cfg.isShipment || false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            this.shipmentStatus = cfg.shipmentStatus || 'hide'; // 进箱containerIn or 出箱containerOut
            this.efficiency = cfg.efficiency || '0';
            this.targetEfficiency = cfg.targetEfficiency || 10;
            return this;
        },
        /*
         *  更新
         */
        update: function (cfg) {
            this.initX = cfg.x || this.initX;
            this.initY = cfg.y || this.initY;
            this.deltaX = cfg.deltaX || this.deltaX;
            this.deltaY = cfg.deltaY || this.deltaY;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.sourceX = cfg.sourceX + this.deltaX;
            this.sourceY = cfg.sourceY + this.deltaY;
            this.targetX = cfg.targetX + this.deltaX;
            this.targetY = cfg.targetY + this.deltaY;
            this.targetXY = cfg.targetXY || this.targetXY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.rotation = this.is25d ? -0.3 : cfg.rotation;
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || this.workStatus;
            this.jobType = cfg.jobType || this.jobType;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.isSelected = cfg.isSelected === undefined ? this.isSelected : cfg.isSelected;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
            this.isShipment = cfg.isShipment === undefined ? this.isShipment : cfg.isShipment;
            this.isShowQuota = cfg.isShowQuota === undefined ? this.isShowQuota : cfg.isShowQuota;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === undefined ? this.isShowDeviceJobType : cfg.isShowDeviceJobType;
            this.shipmentStatus = cfg.shipmentStatus || 'hide'; // 进箱containerIn or 出箱containerOut
            this.efficiency = cfg.efficiency || this.efficiency;
            this.targetEfficiency = cfg.targetEfficiency || this.targetEfficiency;
            this.draw();
            this.moveToTarget(5000, true);
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
         * @ 响应切换显示关键指标
         * @ param: bool 
         * @ 是否显示（true：显示, false: 隐藏）
         */
        switchQuota: function (isShowQuota) {
            this.isShowQuota = isShowQuota;
            this.draw();
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
        reDrawByWorkStatus: function (workStatus) { //状态重置
            this.workStatus = workStatus;
            this.draw();
        },


        /*
         * 隐藏高亮状态
         * 查找高亮元素调用 隐藏方法
         */
        hideHighLight: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.hide();
                }
            });
        },

        /*
         * 显示高亮状态
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.show();
                }
            });
        },

        /*
         * 
         */
        showTipImage: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof ImageShape && v.style.type === 'trans') {
                    v.show();
                }
            });
        },

        /*
         * 
         */
        hideTipImage: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof ImageShape && v.style.type === 'trans') {
                    v.hide();
                }
            });
        },

        /*
         * 设置是否显示属性
         */
        setShowProp: function (isShow) {
            this.isShow = isShow;
            if (isShow) {
                this.draw();
            } else {
                this.hide();
            }
            return this;
        },

        /*
         * 设置是否高亮属性
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
        draw: function () {
            var space = 30, // 堆区间隔
                lorryW = 25,
                lorryH = 20,
                posX = this.drawX,
                posY = this.drawY,
                scaleRatio = this.scaleRatio,
                rotation = this.rotation,
                group = this._group,
                that = this,
                zr = this._zr;
            if (!zr) {
                return false;
            }
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio]
                // rotation: this.rotation,
                // scale: [scaleRatio, scaleRatio],
            });
            var loadingUploadImg = null;
            var highLight = null;
            var hightLightRadius = 0;
            scaleRatio < 2 /*this.maxShowScale*/ ? hightLightRadius = 15 : hightLightRadius = 15;
            var highLight = new CircleShape({
                position: [0, 0],
                scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: hightLightRadius * scaleRatio
                },
                style: {
                    fill: '#CADAED',
                    stroke: '#3195E5',
                    opacity: 0.6,
                    lineWidth: 1
                },
                zlevel: this.zlevel - 1
            });
            // if (scaleRatio >= 2 /*this.maxShowScale*/) {
            imageUrl = this.getImageUrl(this.workStatus);
            var imgX = -((this.imagePoint.x - 5) * scaleRatio) / 2;
            var loadingUploadImg = new directionAnimate({
                imageUrl: '../../src/js/mod/directionAnimate/images/transmission-direction.png',
                zlevel: this.zlevel + 1,
                rotation: this.shipmentStatus === 'containerOut' ? this.rotation : this.rotation - 3.14,
                x: this.shipmentStatus === 'containerOut' ? imgX = imgX + (10 * scaleRatio / 2) : imgX = imgX + (10 * scaleRatio / 2),
                y: -(this.imagePoint.y / 2),
                // width: (this.imagePoint.x - 5) * scaleRatio,
                // height: (this.imagePoint.y - 9) * scaleRatio,
                width: 5 * scaleRatio,
                height: 9 * scaleRatio,
                sWidth: 10,
                sHeight: 18,
                sx: 0,
                sy: 0,
                during: 800,
                csy: 18
            })


            //根据不同颜色设置不同的图片背景
            imageUrl = this.getImageUrl(this.workStatus);
            var gantryImage = new ImageShape({
                style: {
                    image: imageUrl,
                    x: -parseInt(this.imagePoint.x * scaleRatio) / 2,
                    y: -parseInt(this.imagePoint.y * scaleRatio) / 2,
                    // y: 0,
                    width: this.imagePoint.x * scaleRatio,
                    height: this.imagePoint.y * scaleRatio
                },
                zlevel: this.zlevel + 1,
                rotation: this.rotation
            })

            var gantryText = new Text({
                position: [5, -15 * this.scaleRatio],
                style: {
                    text: this.efficiency ? Number(this.efficiency).toFixed(0) + 'MPH' : 0,
                    textAlign: 'center',
                    x: 0,
                    y: 0,
                    textFont: 12 + 'px Microsoft Yahei'
                },
                zlevel: this.zlevel
            });

            group.add(highLight);
            group.add(gantryImage);
            (this.scaleLevel >= this.edgeScaleLevel) && (group.add(loadingUploadImg));
            group.on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.showHighLight();
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            (this.scaleLevel > this.edgeScaleLevel && this.isShowQuota && this.workStatus === 'WORK') && (group);
            /* 构建进度条 */
            this.progressGroup = new ProgressBar({
                zlevel: this.zlevel,
                efficiency: this.efficiency,
                target: this.targetEfficiency,
                scale: this.scaleRatio,
                position: [-this.imagePoint.x * scaleRatio, -this.imagePoint.y * scaleRatio]
                // rotation: this.rotation
            });
            //this.progressGroup.add(gantryText);
            group.add(this.progressGroup);
            if (this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota && this.workStatus === 'WORK') {
                this.progressGroup.show();
            } else {
                this.progressGroup.hide();
            }
            zr.add(group);
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            this.shipmentStatus !== 'hide' ? this.showTipImage() : this.hideTipImage();
            return this;
        },

        /*
         * 根据状态获得相应的图片路径   
         */
        getImageUrl: function () {
            //判断图层
            var scaleRatioFolder = 'min';
            if (this.scaleLevel < 2 /*this.maxShowScale*/) {
                scaleRatioFolder = 'min';
                this.imagePoint = {
                    x: 7,
                    y: 11
                };
            } else {
                scaleRatioFolder = 'max';
                this.imagePoint = {
                    x: 7,
                    y: 14
                };
            }
            //判断状态（工作中、维修、故障）
            var iconType, iconTypeWork, iconTypeStatus;
            switch (this.jobType) {
                case 'LOAD': iconTypeWork = 'load'; break;
                case 'DLVR': iconTypeWork = 'dlvr'; break;
                case 'DSCH': iconTypeWork = 'dsch'; break;
                case 'RECV': iconTypeWork = 'recv'; break;
                case 'CHECK': iconTypeWork = 'check'; break;
                default: iconTypeWork = 'load';
            }
            switch (this.workStatus) {
                case 'WORK': iconTypeStatus = 'active'; break;
                case 'NOINS': iconTypeStatus = 'free'; break;
                case 'YESINS': iconTypeStatus = 'hasJob'; break;
                case 'REPAIR': iconTypeStatus = 'repair'; break;
                case 'FAULT': iconTypeStatus = 'error'; break;
                default: iconTypeStatus = 'active';
            }
            iconType = this.isShowDeviceJobType ? iconTypeWork : iconTypeStatus;
            // imageUrl = '../../src/js/mod/gantrycrane/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';
            imageUrl = '../../src/js/mod/gantrycrane/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';
            if (this.is25d) {
                this.imagePoint = {
                    x: 7,
                    y: 20
                };
                imageUrl = '../../src/js/mod/gantrycrane/images/25d/icon-active.png';
            }
            return imageUrl;
        },

        toString: function () {
            return 'GANTRYCRANE';
        }
    });

    return GANTRYCRANE;
});
