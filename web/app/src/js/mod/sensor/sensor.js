/**
 * module mod/sensor/sensor	传感器
 */
define(function (require) {
    'use strict'
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var Text = require('zrender/graphic/Text');
    var PolygonShape = require('zrender/graphic/shape/Polygon');
    var imageUrl = '../../src/js/mod/sensor/images/min/icon-sensor.png';

    var SENSOR = function (cfg) {
        if (!(this instanceof SENSOR)) {
            return new SENSOR().init(cfg);
        }
    };

    SENSOR.prototype = $.extend(new McBase, {
        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.initX = cfg.x || 0;
            this.initY = cfg.y || 0;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.offset = { x: 0, y: 0 };
            this.initPosition = null;
            this.deviceType = cfg.sensorType === 'smoke' ? 'smokeSensor' : 'temperatureSensor';
            this.workStatus = cfg.workStatus || 'WORK';
            this.deviceData = cfg.deviceData || {};
            this.imagePoint = { x: 26, y: 26 };
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
            this.offset = { x: 0, y: 0 };
            this.initPosition = null;
            this.deviceType = cfg.sensorType === undefined ? this.sensorType : (cfg.sensorType === 'smoke' ? 'smokeSensor' : 'temperatureSensor');
            this.workStatus = cfg.workStatus || this.workStatus;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.imagePoint = { x: 26, y: 26 };
            this.alarm = cfg.alarm || this.alarm;
        },
        /**
         * desc: 缩放后重绘
         */
        mapZoomChange: function (zoom) {
            this.reDrawByScale(zoom);
        },
        /**
         * desc: 移除对象
         */
        remove: function () {
            this._remove();
            delete this;
        },
        /**
         * desc: 按比例重绘
         */
        reDrawByScale: function (zoom) {

        },
        /**
         * desc: 根据位置和比例重绘
         */
        redrawByPosScale: function (args) {
            this.drawX = this.initX + args.x;
            this.drawY = this.initY + args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            this.draw();
        },
        /**
         * desc: 显示状态切换
         */
        switchHydrant: function (isShow) {
            this.isShow = isShow;
            this.draw();
        },
        /**
         * desc: 设置高亮状态
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
        /**
         * desc: 绘制
         */
        draw: function () {
            var scaleRatio = this.scaleRatio,
                group = this._group,
                zr = this._zr,
                that = this;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                scale: [scaleRatio, scaleRatio]
            });
            var highLight = null,
                warnHighLight = null,
                highLightRadius = 0,
                hyImage = null;
            imageUrl = this.getImageUrl();
            scaleRatio < 2 ? highLightRadius = 10 : highLightRadius = 10;
            highLight = new CircleShape({
                position: [0, 0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: highLightRadius
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
            warnHighLight = new CircleShape({
                position: [0, 0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: highLightRadius
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
            hyImage = new ImageShape({
                style: {
                    image: imageUrl,
                    x: -parseInt(this.imagePoint.x) / 2,
                    y: -parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            });
            // 告警内容没有配置  （未完成）
            if (this.alarm && this.alarm.ALARM_NAME === '') {
                group.add(warnHighLight);
            }
            group.add(highLight);
            group.add(hyImage);
            group && group.on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.showHighLight();
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            zr.add(group);
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            return this;
        },
        /**
         * desc: 获取图片
         */
        getImageUrl: function () {
            var scaleRatioFolder = 'min';
            if (this.scaleRatio < 2) {
                scaleRatioFolder = 'min';
                this.imagePoint = { x: 7, y: 7 };
            } else {
                scaleRatioFolder = 'max';
                this.imagePoint = { x: 7, y: 7 };
            }

            imageUrl = '../../src/js/mod/sensor/images/' + scaleRatioFolder + '/icon-sensor.png';

            return imageUrl;
        },
        /*
         * 查找高亮元素调用 隐藏方法
         */
        hideHighLight: function () {
            this.isSelected = false;
            if (!this._group || !this._group._children) {
                return false;
            }
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape && v.style.type === 'highLight') {
                    v.hide();
                }
            });
        },

        /*
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            this.isSelected = true;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape && v.style.type === 'highLight') {
                    v.show();
                }
            });
        }
    });

    return SENSOR;
});