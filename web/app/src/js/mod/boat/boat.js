/**
 * @module port/mod/Boat 船舶
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var imageUrl = '../../src/js/mod/boat/images/icon-boat.png';
    var PolylineShape = require('zrender/graphic/shape/Polyline');
    var Text = require('zrender/graphic/Text');
    var ProgressBar = require('mod/progressBar/progressBar');
    var CircleShape = require('zrender/graphic/shape/Circle');


    var BOAT = function (cfg) {
        if (!(this instanceof BOAT)) {
            return new BOAT().init(cfg);
        }
    };

    BOAT.prototype = $.extend(new McBase(), {

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
            this.startPos = cfg.startPos;
            this.endPos = cfg.endPos;
            //this.drawX = this.initX + this.deltaX;
            //this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.rotation = cfg.rotation || 0; // -0.3
            this.posFrom = cfg.posFrom;
            this.posTo = cfg.posTo;
            //console.log(this.posFrom, this.posTo );
            this.calcRealPos();
            this.drawX = this.realPosFrom.x + this.deltaX;
            this.drawY = this.realPosFrom.y + this.deltaY;
            this.devicePopX = (this.realPosFrom.x + this.realPosTo.x) / 2 + this.deltaX;
            this.devicePopY = (this.realPosFrom.y + this.realPosTo.y) / 2 + this.deltaY;
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.deviceType = 'ship';
            this.deviceData = cfg.deviceData || {};
            this.width = cfg.boatWidth || 144;
            this.imagePoint = { x: this.width, y: 34 }; //图片尺寸大小
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || '0';
            this.curStatus = cfg.curStatus || '';
            this.isArriving = cfg.isArriving;
            this.isLeaving = cfg.isLeaving;
            this.isLeaved = cfg.isLeaved;
            this.isShow = cfg.isShow === true ? true : false;
            this.stopAnimator = cfg.stopAnimator;
            this.routeName = cfg.routeName;
            this.targetEfficiency = cfg.targetEfficiency || 54.5;
            this.totalBayNum = cfg.totalBayNum || 100;

            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.x || this.initX;
            this.initY = cfg.y || this.initY;
            this.deltaX = cfg.deltaX || this.deltaX;
            this.deltaY = cfg.deltaY || this.deltaY;
            this.startPos = cfg.startPos || this.endPos;
            this.endPos = cfg.endPos || this.endPos;
            //this.drawX = this.initX + this.deltaX;
            //this.drawY = this.initY + this.deltaY;
            this.posFrom = cfg.posFrom;
            this.posTo = cfg.posTo;
            this.calcRealPos();
            this.drawX = this.realPosFrom.x + this.deltaX;
            this.drawY = this.realPosFrom.y + this.deltaY;
            this.devicePopX = (this.realPosFrom.x + this.realPosTo.x) / 2 + this.deltaX;
            this.devicePopY = (this.realPosFrom.y + this.realPosTo.y) / 2 + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.rotation = cfg.rotation || this.rotation; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || this.workStatus;
            this.observer = cfg.observer || this.observer;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.width = cfg.boatWidth || this.boatWidth;
            this.isSelected = cfg.isSelected === true ? true : this.isSelected;
            this.isShowQuota = cfg.isShowQuota === true ? true : this.isShowQuota;
            this.isShow = cfg.isShow;
            this.efficiency = cfg.efficiency || this.efficiency;
            this.curStatus = cfg.curStatus || this.curStatus;

            if (this.isArriving != undefined) {
                this.isArriving = cfg.isArriving
            }

            if (this.isLeaving != undefined) {
                this.isLeaving = cfg.isLeaving
            }

            if (this.stopAnimator != undefined) {
                this.stopAnimator = cfg.stopAnimator
            }

            if (this.isLeaved != undefined) {
                this.isLeaved = cfg.isLeaved
            }

            if (this.isShow != undefined) {
                this.isShow = cfg.isShow || this.isShow;
            }

            this.routeName = cfg.routeName || this.routeName;
            this.targetEfficiency = cfg.targetEfficiency || this.targetEfficiency;
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
         *  根据位置重置
         */
        redrawByPosScale: function (args) {
            this.drawX = this.realPosFrom.x + args.x;
            this.drawY = this.realPosFrom.y + args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            // this.isArriving && (this.isArrived = true);     // 到达后动画结束拖动地图，船定位到相应泊位
            this.devicePopX = (this.realPosFrom.x + this.realPosTo.x) / 2 + args.x;
            this.devicePopY = (this.realPosFrom.y + this.realPosTo.y) / 2 + args.y;
            this.draw();
        },

        /*
         *  根据状态重置
         */
        reDrawByworkStatus: function (workStatus) { // 状态重置
            this.workStatus = workStatus;
            this.draw();
        },

        /*
         *  根据参数设置是否被选中状态
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
         * 显示摄像机高亮状态
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            this.isSelected = true;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
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
            if (!this._group || !this._group._children) { // 注意children层级
                return false;
            }
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.hide();
                }
            });
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
        calcRealPos: function () {
            var berthLenth = 2100;
            var startPos = this.startPos;
            var endPos = this.endPos;
            /*var startPos = { "x":340, "y":20 };
            var endPos = { "x":983,"y":240 };
            this.posFrom = 0;
            this.posTo = 2030;*/

            this.realPosFrom = {};
            this.realPosTo = {};
            this.realPosFrom.x = startPos.x + this.posFrom * (endPos.x - startPos.x) / berthLenth;
            this.realPosFrom.y = startPos.y + this.posFrom * (endPos.y - startPos.y) / berthLenth;
            this.realPosTo.x = startPos.x + this.posTo * (endPos.x - startPos.x) / berthLenth;
            this.realPosTo.y = startPos.y + this.posTo * (endPos.y - startPos.y) / berthLenth;
            this.realLength = this.posTo - this.posFrom;
            this.drawLength = Math.sqrt((this.realPosTo.x - this.realPosFrom.x) * (this.realPosTo.x - this.realPosFrom.x) + (this.realPosTo.y - this.realPosFrom.y) * (this.realPosTo.y - this.realPosFrom.y)).toFixed(1);
            //console.log( this.posFrom, this.posTo, this.realPosTo, this.realLength );
        },
        /**
         *  绘制船舶
         */
        draw: function () {
            var posY = this.drawY,
                scaleRatio = this.scaleRatio,
                group = this._group,
                that = this,
                isArriving = this.isArriving,
                isLeaving = this.isLeaving,
                isLeaved = this.isLeaved,
                stopAnimator = this.stopAnimator,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: !isLeaved ? [this.drawX * scaleRatio, this.drawY * scaleRatio] : [-9999, -9999],
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio]
            });

            var smallGroup = new Group({
                position: [0, 0]
            });

            var imageLength = 440; // 原始图片对应440m长的船
            // 根据不同颜色设置不同的图片背景
            // imageUrl = this.getImageUrl(this.workStatus);
            var imageHeight = this.realLength > imageLength ? this.imagePoint.y : this.imagePoint.y * this.realLength / imageLength;
            var imageWidth = this.realLength > imageLength ? this.imagePoint.x * this.realLength / imageLength : this.imagePoint.x * this.realLength / imageLength;
            posY = imageHeight > 16 ? 23 - imageHeight / 2 : 15; // 控制最大靠边距离
            this.boatHeight = this.imagePoint.y * this.realLength / imageLength
            //posY = 25 - imageHeight / 2;
            // 船舶图片
            var boatImage = new ImageShape({
                style: {
                    image: imageUrl,
                    //y: - parseInt(this.imagePoint.y * this.realLength / imageLength) / 2,
                    x: 0,
                    //y: 23 - imageHeight / 2,
                    y: posY,
                    //width: this.imagePoint.x * this.realLength / imageLength,
                    width: imageWidth,
                    //width: 10,
                    height: this.imagePoint.y * this.realLength / imageLength
                },
                zlevel: this.zlevel
            }).on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.showHighLight();
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            // 船舶高亮组件
            var highLight = null;
            var hightLightRadius = 30;
            highLight = new CircleShape({
                //position: [0, 0],
                position: [imageWidth / 2, posY / 2 + hightLightRadius / 2],
                // scale: [1, 1],
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

            if (!stopAnimator && isArriving && that.observer._isgetShipsing) {
                // 船舶动画
                boatImage.animate('', false)
                    .when(0, {
                        position: [-50, -100]

                    })
                    .when(1000, {
                        position: [-25, -75]
                    })
                    .when(3000, {
                        position: [0, 0]
                    })
                    .start();
                // 航线及对应线条
                var polyline = new PolylineShape({
                    style: {
                        stroke: '#B5BBBB',
                        lineWidth: 1
                    },
                    shape: {
                        points: [
                            [-50, -100],
                            [-25, -75],
                            [0, 10]
                        ],
                        smooth: 0.5
                    },
                    zlevel: this.zlevel
                });
                // 航线名
                var text = new Text({
                    position: [-50, -50],
                    scale: [1 / scaleRatio, 1 / scaleRatio],
                    style: {
                        text: this.routeName,
                        textAlign: 'center',
                        textFont: 12 /** this.scaleRatio*/ + 'px Microsoft Yahei'
                    },
                    zlevel: this.zlevel
                });
                smallGroup.add(polyline);
                smallGroup.add(text);

                setTimeout(function () {
                    group.remove(smallGroup);
                }, 4000);

            }

            if (!stopAnimator && isLeaving && that.observer._isgetShipsing) {
                boatImage.animate('', false)
                    .when(0, {
                        position: [0, 0]
                    })
                    .when(1500, {
                        position: [25, -50]
                    })
                    .when(3000, {
                        position: [50, -100]

                    })
                    .start();

                var polyline = new PolylineShape({
                    style: {
                        stroke: '#B5BBBB',
                        lineWidth: 1
                    },
                    shape: {
                        points: [
                            [40, -100],
                            [25, -75],
                            [0, 0]
                        ],
                        smooth: 0.5
                    },
                    zlevel: this.zlevel
                });
                var text = new Text({
                    scale: [1 / scaleRatio, 1 / scaleRatio],
                    position: [50, -50],
                    style: {
                        text: this.routeName,
                        textAlign: 'center',
                        textFont: 12 + 'px Microsoft Yahei'
                    },
                    zlevel: this.zlevel
                });
                smallGroup.add(polyline);
                smallGroup.add(text);

                setTimeout(function () {
                    group.remove(smallGroup);
                }, 4000);

            }

            group.add(highLight);
            group.add(boatImage);
            group.add(smallGroup);
            /* 构建进度条 */
            var progressGroup = new ProgressBar({
                zlevel: this.zlevel,
                efficiency: this.efficiency,
                target: this.targetEfficiency,
                width: 36,
                position: [imageWidth / 2 - 18, -10],
                rotation: -this.rotation
                //position: [imageWidth/2-9, -this.imagePoint.y]
            });
            (this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota) && (group.add(progressGroup));
            // group.add(progressGroup)
            zr.add(group);
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            return this;
        },

        /*
         * 根据状态获得相应的图片路径
         */
        getImageUrl: function (workStatus) {
            if (this.scaleRatio < this.maxShowScale) {
                this.imagePoint = { x: 8, y: 10 };
                switch (workStatus) {
                    case 1:
                        imageUrl = '../../js/mod/BERTH/images/icon-i-active.png';
                        break;
                    case 2:
                        imageUrl = '../../js/mod/BERTH/images/icon-i-freeHasJob.png';
                        break;
                    case 3:
                        imageUrl = '../../js/mod/BERTH/images/icon-i-free.png';
                        break;
                    case 4:
                        imageUrl = '../../js/mod/BERTH/images/icon-i-broken.png';
                        break;
                    default:
                        imageUrl = '../../js/mod/BERTH/images/icon-i-active.png';
                }
            } else {
                this.imagePoint = { x: 36, y: 50 };
                switch (workStatus) {
                    case 1:
                        imageUrl = '../../js/mod/BERTH/images/icon-hang-active.png';
                        break;
                    case 2:
                        imageUrl = '../../js/mod/BERTH/images/icon-hang-freeHasJob.png';
                        break;
                    case 3:
                        imageUrl = '../../js/mod/BERTH/images/icon-hang-free.png';
                        break;
                    case 4:
                        imageUrl = '../../js/mod/BERTH/images/icon-hang-broken.png';
                        break;
                    default:
                        imageUrl = '../../js/mod/BERTH/images/icon-hang-active.png';
                }
            }
            return imageUrl;
        }
    });

    return BOAT;
});