/**
 * @module port/mod/STACKER 堆高机
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var ProgressBar = require('mod/progressBar/progressBar');
    var imageUrl = '';

    var STACKER = function (cfg) {
        if (!(this instanceof STACKER)) {
            return new STACKER().init(cfg);
        }
    };

    STACKER.prototype = $.extend(new McBase(), {

        /*
         *
         */
        init: function (cfg) {
            this._zr = cfg.zr;
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
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
            this.jobType = cfg.jobType || 'LOAD';
            this.offset = {
                x: 0,
                y: 0
            };
            this.observer = cfg.observer;
            this.identity = cfg.identity;
            this.initPosition = null;
            this.imagePoint = {
                x: 26,
                y: 26
            };
            this.deviceType = 'stacker';
            this.deviceData = cfg.deviceData || {};
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || 0;
            this.target = cfg.target || 9;
            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
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
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.maxScaleLevel = cfg.maxScaleLevel || this.maxScaleLevel;
            this.rotation = cfg.rotation || this.rotation; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || this.workStatus;
            this.jobType = cfg.jobType || this.jobType;
            this.observer = cfg.observer || this.observer;
            this.identity = cfg.identity || this.identity;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
            this.isSelected = cfg.isSelected === undefined ? this.isSelected : cfg.isSelected;
            this.isShowQuota = cfg.isShowQuota === undefined ? this.isShowQuota : cfg.isShowQuota;
            this.efficiency = cfg.efficiency || this.efficiency;
            this.target = cfg.target || this.target;
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
            //console.log( 'stack' , args );
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
         *
         */
        draw: function () {
            var that = this,
                scaleRatio = this.scaleRatio,
                group = this._group,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio],
                width: 20 * scaleRatio,
                height: 20 * scaleRatio
            });

            var hightLightRadius = 0;
            this.scaleRatio < this.maxShowScale ? hightLightRadius = 10 : hightLightRadius = 10;
            //根据不同颜色设置不同的图片背景
            imageUrl = this.getImageUrl(this.workStatus);
            // 先构造一个数据
            /*that.profileData = [
                {"license":"浙AZT280","number":"t60","id":"001","status":"作业中（36km/h）","mileage":"27856"}
            ];*/
            var highLight = new CircleShape({
                position: [0, 0],
                scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: hightLightRadius
                },
                style: {
                    fill: '#CADAED',
                    stroke: '#3195E5',
                    opacity: 0.6,
                    lineWidth: 1
                },
                zlevel: this.zlevel - 1
            });
            var lorryImage = new ImageShape({
                style: {
                    image: imageUrl,
                    x: -parseInt(this.imagePoint.x) / 2,
                    y: -parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            })

            // var stackerText = new Text({
            //     position: [0, -14],
            //     rotation: -this.rotation,
            //     scale: [1 / scaleRatio, 1 / scaleRatio],
            //     style: {
            //         text: this.efficiency ? Number(this.efficiency).toFixed(0) + 'MPH' : 0 + 'MPH',
            //         textAlign: 'center',
            //         x: 0,
            //         y: 0,
            //         textFont: 12 + 'px Microsoft Yahei'
            //     },
            //     zlevel: this.zlevel
            // });

            group.add(highLight);
            group.add(lorryImage);
            group.on('click', function (ev) {
                console.log('click');
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.showHighLight();
                console.log(obj);
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            // (this.scaleLevel > this.edgeScaleLevel && this.isShowQuota && this.workStatus == "WORK") && (group.add(stackerText));
            var progressGroup = new ProgressBar({
                zlevel: this.zlevel,
                efficiency: this.efficiency,
                target: this.target
            });
            (this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota && this.workStatus === 'WORK') && (group.add(progressGroup));
            zr.add(group);
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            return this;
        },

        /*
         *
         */
        getImageUrl: function () {
            //判断图层
            var scaleRatioFolder = 'min';
            /*if( this.scaleRatio < this.maxShowScale ){
                scaleRatioFolder = 'min';
                // mm豆尺寸
                // this.imagePoint ={x:24,y:24};
                this.imagePoint ={x:8,y:8};
            }else{
                scaleRatioFolder = 'max';
                this.imagePoint ={x:12,y:8};
            }*/
            scaleRatioFolder = 'max';
            this.imagePoint = {
                x: 12,
                y: 8
            };
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

            // 修改为圆点图标
            imageUrl = '../../src/js/mod/stacker/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';
            return imageUrl;
        },

        /*
         * 隐藏集卡高亮状态
         * 查找高亮元素调用 隐藏方法
         */
        hideHighLight: function () {
            if (!this._group || !this._group._children) {
                return false;
            }
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.hide();
                }
            });
        },

        /*
         * 显示集卡高亮状态
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            if (!this._group || !this._group._children) {
                return false;
            }
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.show();
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
        }
    });

    return STACKER;
});