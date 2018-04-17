/**
 * @module port/gdSensor
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcGdBase');


    var CONTAINER = function (cfg) {
        if (!(this instanceof CONTAINER)) {
            return new CONTAINER().init(cfg);
        }
    };

    function change(lng, lat) {
        return {
            "lng": parseFloat(lng) + 0.0044,
            "lat": lat - 0.0019
        };
    }

    CONTAINER.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this.amap = cfg.map;
            this.containerData = cfg.containerData;
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
            this.observer = cfg.observer;
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.jobStatus = cfg.jobStatus || 'NOINS'; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.workType = cfg.workType || 'LOAD'; //OBJ_TRUCK_WORK_TYPE
            this.offset = {
                x: 0,
                y: 0
            };
            this.initPosition = null;
            this.speed = cfg.speed || 35;
            this.edgeSpeed = cfg.edgeSpeed;
            this.identity = cfg.identity;
            //this.rotation = cfg.rotation || 0;
            this.boxColor = cfg.boxColor || '#33AF19';
            this.deviceType = 'sensor';
            this.profileData = cfg.profileData || {};
            this.deviceData = cfg.deviceData || {};
            this.isCarryCargo = cfg.isCarryCargo || true;
            this.inOutStatus = cfg.Status || 'in';
            this.emptyWeightStatus = cfg.Status || 'empty';
            this.boxType = cfg.Status || '';
            this.boxCount = cfg.Status || 1;
            this.imagePoint = {
                x: 26,
                y: 26
            };
            this.boxWidth = cfg.boxWidth || 5;
            this.boxHeight = cfg.boxHeight || 3;
            this.efficiency = cfg.efficiency || '0';
            this.presenceTime = cfg.presenceTime || '0';
            this.target = cfg.target || 7.00;

            this.width = 17;
            this.height = 17;

            var event = this;
            this.draw();

            this.zoom = this.amap.getZoom();

            // AMap.event.addListener(this.amap,'zoomend',function(){
            //  var zoom = event.zoom - cfg.map.getZoom();
            //  event.width = zoom > 0 ? event.width / (2 * zoom) :event.width * (2 * (-zoom));
            //  event.height = zoom > 0 ? event.height / (2 * zoom) :event.height * (2 * (-zoom));
            //  $('.amap-icon img').css('width',event.width);
            //  $('.amap-icon img').css('height',event.height);
            //  event.zoom = cfg.map.getZoom();
            // });
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
                image: '../../src/js/mod/sensor/images/max/icon-sensor.png',
                size: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel),
                imageSize: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel)
            });

            this.marker = new AMap.Marker({
                icon: this.icon,
                position: [this.lng, this.lat],
                offset: new AMap.Pixel(-12, -12),
                autoRotation: true,
                zIndex: 101,
                bubble: this.bubble,
                map: this.amap,
                cursor: this.cursor,
            })
                .on('click', function (ev) {
                    var pixel = that.amap.lnglatTocontainer([that.lng, that.lat]);
                    that.drawX = pixel.getX();
                    that.drawY = pixel.getY();
                    var obj = $.extend({}, that);
                    that.observer._overMap.hideSelectedEquipment();
                    that.isSelected = true;
                    // that.showHighLight();
                    that.observer.showProfilePop(obj);
                    ev.cancelBubble = true;
                });

            //this.marker.hide();
        },
        /*
         *  响应缩放
         */
        onZoomEnd: function (scaleLevel) {
            //console.log( scaleLevel );
            this.scaleLevel = scaleLevel;
            // this.icon.setImageSize( this.width,this.height ); // 重设Size会延迟 出现图标变形的状况
            this.draw(); // 重绘性能消耗大
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


        update: function (cfg) {
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            // this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.bubble = cfg.bubble || this.bubble;
            this.isShow = cfg.isShow === true ? true : this.isShow;
            this.isSelected = cfg.isSelected === true ? true : this.isSelected;
            this.isShowQuota = cfg.isShowQuota === true ? true : this.isShowQuota;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : this.isShowDeviceJobType;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.jobStatus = cfg.jobStatus || this.jobStatus; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.workType = cfg.workType || this.workType; //OBJ_TRUCK_WORK_TYPE			
            this.speed = cfg.speed || this.speed;
            this.edgeSpeed = cfg.edgeSpeed || this.edgeSpeed;
            this.identity = cfg.identity || this.identity;
            //this.rotation = cfg.rotation || this.rotation;
            this.boxColor = cfg.boxColor || this.boxColor;

            this.isCarryCargo = cfg.isCarryCargo || this.isCarryCargo;
            this.inOutStatus = cfg.Status || this.inOutStatus;
            this.emptyWeightStatus = cfg.Status || this.emptyWeightStatus;
            this.boxType = cfg.Status || this.boxType;
            this.boxCount = cfg.Status || this.boxCount;
            this.boxWidth = cfg.boxWidth || this.boxWidth;
            this.boxHeight = cfg.boxHeight || this.boxHeight;
            this.efficiency = cfg.efficiency || this.efficiency;
            this.presenceTime = cfg.presenceTime || this.presenceTime;
            this.target = cfg.target || this.target;
            this.speed = cfg.speed || this.speed;

            this.lng = cfg.lng;
            this.lat = cfg.lat;
            var targetPoint = [this.lng, this.lat];

        },


    });

    return CONTAINER;
})