/**
 * @module port/gdReachstacker
 */

define(function (require) {
    'use strict';
    var McBase = require('base/mcGdBase');


    var REACHSTACKER = function (cfg) {
        if (!(this instanceof REACHSTACKER)) {
            return new REACHSTACKER().init(cfg);
        }
    };


    REACHSTACKER.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
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
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.rotation = cfg.rotation || 0; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
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
            this.width = cfg.width || 25;
            this.height = cfg.height || 20;
            this.deviceType = 'reachstacker';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || 0;
            this.target = cfg.target || 9;

            var event = this;


            /*this.zoom = this.amap.getZoom();
            
             AMap.event.addListener(this.amap,'zoomend',function(){
                 var zoom = event.zoom - cfg.map.getZoom();
                 event.width = zoom > 0 ? event.width / (2 * zoom) :event.width * (2 * (-zoom));
                 event.height = zoom > 0 ? event.height / (2 * zoom) :event.height * (2 * (-zoom));
                 $('.amap-icon img').css('width',event.width);
                 $('.amap-icon img').css('height',event.height);
                 event.zoom = cfg.map.getZoom();
             });*/
            return this;
        },
        /*
        *  绘制到地图
        */
        draw: function () {
            var that = this;
            if (this.marker) {
                this.amap.remove([this.marker]);
            }
            this.icon = new AMap.Icon({
                image: '../../src/js/mod/reachstacker/images/max/icon-active.png',
                size: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel),
                imageSize: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel)
            });

            this.marker = new AMap.Marker({
                icon: this.icon,
                position: new AMap.LngLat(this.lng, this.lat),
                offset: new AMap.Pixel(-12, -12),
                autoRotation: true,
                zIndex: 101,
                bubble: this.bubble,
                map: this.amap,
                cursor: this.cursor
            }).on('click', function () {
                var pixel = that.amap.lnglatTocontainer([that.lng, that.lat]);
                that.drawX = pixel.getX();
                that.drawY = pixel.getY();
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                // that.showHighLight();
                that.observer.showProfilePop(obj);
            });


            //this.marker.hide();
        },
        /*
         *  响应缩放
         */

        onZoomEnd: function (scaleLevel) {
            this.scaleLevel = scaleLevel;
            this.draw();
        },
        /*
         *  删除
         */
        remove: function () {
            this.marker && this.amap.remove([this.marker]);
        },
        /*
         *  显示
        */
        show: function () {
            this.marker.show();
        },
        /*
         *  隐藏
        */
        hide: function () {
            this.marker.hide();
        },
        /*
         *  移动
        */
        moveTo: function (targetPoint) {
            var that = this;
            this.marker.moveTo(targetPoint, that.speed);
        },
        update: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.bubble = cfg.bubble || this.bubble;
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
            this.scaleRatio = cfg.scaleRatio || 1;
            // this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.rotation = cfg.rotation || 0; // -0.3
            //工作状态：1-绿色－作业中  2-蓝色－有指令空闲 3-黄色－无指令空闲 4-红色－故障
            this.workStatus = cfg.workStatus || 1;
            this.offset = {
                x: 0,
                y: 0
            };
            this.lng = cfg.lng || this.lng;
            this.lat = cfg.lat || this.lat;
            this.observer = cfg.observer;
            this.identity = cfg.identity;
            this.initPosition = null;
            this.imagePoint = {
                x: 26,
                y: 26
            };
            this.deviceType = 'reachstacker';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || 0;
            this.target = cfg.target || 9;
        }
    });

    return REACHSTACKER;
})
