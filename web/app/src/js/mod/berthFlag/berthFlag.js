/**
 * @module port/mod/BerthFlag 泊位标记
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Rect = require('zrender/graphic/shape/Rect');
    var Group = require('zrender/container/Group');
    var imageUrl = '../../src/js/mod/berthFlag/images/icon-berthFlag.png';

    var BERTHFLAG = function (cfg) {
        if (!(this instanceof BERTHFLAG)) {
            return new BERTHFLAG().init(cfg);
        }
    };

    BERTHFLAG.prototype = $.extend(new McBase(), {

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
            this.bubble = cfg.bubble || false;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.rotation = cfg.rotation || 0; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.jobStatus = cfg.jobStatus || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.deviceType = 'berthFlag';
            this.deviceData = cfg.deviceData || {};
            // this.width = cfg.BERTHFLAGWidth || 144;
            this.berthTitle = cfg.berthTitle;
            this.imagePoint = { x: 13, y: 13 };//图片尺寸大小
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || '0';
            this.isShow = cfg.isShow === true ? true : false;
            return this;
        },

        /*
        *
        */
        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.x || 0;
            this.initY = cfg.y || 0;
            this.bubble = cfg.bubble || this.bubble;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.rotation = cfg.rotation || 0; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.jobStatus = cfg.jobStatus || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.deviceType = 'ship';
            this.deviceData = cfg.deviceData || {};
            // this.width = cfg.BERTHFLAGWidth || 144;
            this.berthTitle = cfg.berthTitle;
            this.imagePoint = { x: 13, y: 13 };//图片尺寸大小
            this.isSelected = cfg.isSelected === undefined ? this.isSelected : cfg.isSelected;
            this.isShowQuota = cfg.isShowQuota === undefined ? this.isShowQuota : cfg.isShowQuota;
            this.efficiency = cfg.efficiency || '0';
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
        },

        /*
        *
        */
        remove: function () {
            //console.log('remove');
            this._remove();
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
        reDrawByJobStatus: function (jobStatus) {    // 状态重置
            this.jobStatus = jobStatus;
            this.draw();
        },

        /*
        *
        */
        draw: function () {
            var scaleRatio = this.scaleRatio,
                berthTitle = this.berthTitle,
                group = this._group,
                that = this,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio]
            });

            // 设置泊位区
            var rectTemp = new Rect({
                shape: {
                    r: 0,
                    x: -10,
                    y: -15,
                    width: 50,
                    height: 30
                },
                style: {
                    textFont: 10 * scaleRatio + 'px Microsoft Yahei',
                    textColor: '#000',
                    text: berthTitle,
                    textPosition: 'inside',
                    textRotation: -this.rotation,
                    textOffset: [0, -9],
                    fill: 'transparent',
                    textAlign: 'center'
                },
                zlevel: this.zlevel
            });
            group.add(rectTemp);

            // 根据不同颜色设置不同的图片背景
            imageUrl = this.getImageUrl(this.jobStatus);
            var berthIcon = new ImageShape({
                position: [-24, 0],
                style: {
                    image: imageUrl,
                    // x: -parseInt(this.imagePoint.x) / 2,
                    y: -parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            })

            /*var berthText = new Text({
                // position: [0, 4],
                style: {
                    text: berthTitle,
                    // textFont: 8 * scaleRatio + 'px Microsoft Yahei',
                    // textFont: '6px Microsoft Yahei',
                    textFont: '12px Microsoft Yahei',
                    x: 0,
                    y: 4,

                },
                zlevel: this.zlevel,
            });*/

            group.add(berthIcon);
            // group.add( berthText );
            group.on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            zr.add(group);
            this.isShow ? this.show() : this.hide();
            return this;
        },

        /*
        * 根据状态获得相应的图片路径
        */
        getImageUrl: function () {
            if (this.scaleLevel < this.maxScaleLevel - 1) {
                this.imagePoint = { x: 16, y: 20 };
            } else {
                this.imagePoint = { x: 20, y: 26 };
            }
            return imageUrl;
        }
    });

    return BERTHFLAG;
});