/**
 * @module port/mod/Boat 船舶
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var imageUrl = '../../src/js/mod/boat/images/icon-boat.png';
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
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.zlevel = cfg.zlevel;
            this.berthPoints = cfg.berthPoints;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            //this.drawX = this.initX + this.deltaX;
            //this.drawY = this.initY + this.deltaY;
            this.rotation = cfg.rotation || 0; // -0.3
            this.posFrom = cfg.posFrom;
            this.posTo = cfg.posTo;
            //console.log(this.posFrom, this.posTo );
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.jobStatus = cfg.jobStatus || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.initPosition = null;
            this.deviceType = 'ship';
            this.deviceData = cfg.deviceData || {};
            this.width = cfg.boatWidth || 144;
            this.imagePoint = { x: this.width, y: 34 };//图片尺寸大小
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

            /* 初始化的时候：根据坐标转化的drawX、drawY来获取船中心点的drawX、drawY，从而获取船的坐标 */
            // this.getBoatPos();
            return this;
        },

        update: function (cfg) {
            this.amap = cfg.map || this.map;
            this.mapType = cfg.mapType || this.mapType;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || this.bubble;
            this.berthMile = cfg.berthMile || this.berthMile;
            //this.drawX = this.initX + this.deltaX;
            //this.drawY = this.initY + this.deltaY;
            this.posFrom = cfg.posFrom;
            this.posTo = cfg.posTo;
            this.rotation = cfg.rotation || this.rotation; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.jobStatus = cfg.jobStatus || this.jobStatus;
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
                this.isShow = cfg.isShow
            }

            this.routeName = cfg.routeName || this.routeName;
            this.targetEfficiency = cfg.targetEfficiency || this.targetEfficiency;
        },

        getBoatPos: function () {
            var that = this;
            var berthMilePos = [];
            var obj, x1, y1, x2, y2;
            $.each(that.berthPoints[0].POINT, function (idx, item) {
                var obj = that.observer._overMap.getXY(item.lng, item.lat);
                berthMilePos.push({
                    x: obj.drawX,
                    y: obj.drawY
                })
            })

            x1 = that.posFrom / 2030 * (berthMilePos[1].x - berthMilePos[0].x) + berthMilePos[0].x;
            y1 = that.posFrom / 2030 * (berthMilePos[1].y - berthMilePos[0].y) + berthMilePos[0].y;
            obj = that.amap.containerToLngLat(new AMap.Pixel(x1, y1));
            that.lng = obj.getLng();
            that.lat = obj.getLat();
            x2 = that.posTo / 2030 * (berthMilePos[1].x - berthMilePos[0].x) + berthMilePos[0].x;
            y2 = that.posTo / 2030 * (berthMilePos[1].y - berthMilePos[0].y) + berthMilePos[0].y;
            that.boatDrawWidth = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            that.rotation = Math.atan((y2 - y1) / (x2 - x1));
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
        *  根据位置重置
        */
        redrawByPosScale: function (args) {
            this.drawX = this.realPosFrom.x + args.x;
            this.drawY = this.realPosFrom.y + args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            // this.isArriving && (this.isArrived = true);     // 到达后动画结束拖动地图，船定位到相应泊位

            this.draw();
        },

        /*
        *  根据状态重置
        */
        reDrawByJobStatus: function (jobStatus) {    // 状态重置
            this.jobStatus = jobStatus;
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
            if (!this._group || !this._group._children) {      // 注意children层级
                return false;
            }
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.hide();
                }
            });
        },
        /*
         *  响应缩放
         */
        onZoomEnd: function (scaleLevel) {
            this.scaleLevel = scaleLevel;
            this.draw();

            //console.log( this.marker)

        },
        /*
        *  绘制船舶
        */
        draw: function () {
            var that = this;
            if (this.marker) {
                this.amap.remove([this.marker]);
            }
            this.getBoatPos();
            this.icon = new AMap.Icon({
                image: '../../src/js/mod/boat/images/icon-boat.png',
                size: new AMap.Size(that.boatDrawWidth, that.boatDrawWidth / 198 * 40),
                imageOffset: new AMap.Pixel(0, 0),
                imageSize: new AMap.Size(that.boatDrawWidth, that.boatDrawWidth / 198 * 40)
            });


            // this.shadow = new AMap.Icon({
            //  image : '../../src/js/mod/container/images/max/inCar/icon-shadow.png',
            //        size : new AMap.Size(60,60),
            //        imageSize : new AMap.Size(3*this.width,3*this.width)
            // });

            this.marker = new AMap.Marker({
                icon: this.icon,
                position: new AMap.LngLat(this.lng, this.lat),
                offset: new AMap.Pixel(-12, 6),
                // autoRotation: true,
                zIndex: 20,
                bubble: this.bubble,
                angle: this.rotation / Math.PI * 180,
                map: this.amap,
                cursor: this.cursor
            })
                .on('click', function (ev) {
                    var pixel = that.amap.lnglatTocontainer(new AMap.LngLat(that.lng, that.lat));
                    that.drawX = pixel.getX();
                    that.drawY = pixel.getY();
                    var obj = $.extend({}, that);
                    that.observer._overMap.hideSelectedEquipment();
                    that.isSelected = true;
                    // that.showHighLight(that.marker.getPosition());
                    that.observer.showProfilePop(obj);
                    ev.cancelBubble = true;

                });

            //  var circle = new AMap.Circle({
            //          center: new AMap.LngLat(that.lng, that.lat),// 圆心位置
            //          radius: 1, //半径
            //          strokeColor: "#F33", //线颜色
            //          strokeOpacity: 1, //线透明度
            //          strokeWeight: 3, //线粗细度
            //          fillColor: "#ee2200", //填充颜色
            //          fillOpacity: 0.35//填充透明度
            //      });
            // circle.setMap(that.amap);

        },

        /*
        * 根据状态获得相应的图片路径   
        */
        getImageUrl: function (jobStatus) {
            if (this.scaleRatio < this.maxShowScale) {
                this.imagePoint = { x: 8, y: 10 };
                switch (jobStatus) {
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
                switch (jobStatus) {
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
