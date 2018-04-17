define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    var ImageShape = require('zrender/graphic/Image');
    var BaseIamgeUrl = '../../src/js/mod/boxMarker/images/';
    var ImageUrl = BaseIamgeUrl + 'icon-boxmarker.png';

    var BOXMARKER = function (cfg) {
        if (!(this instanceof BOXMARKER)) {
            return new BOXMARKER().init(cfg);
        }
    };

    BOXMARKER.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel || 60;
            this._observer = cfg.observer;
            this.boxData = cfg.boxData;
            this.boxData && this.getMarkerPosition('init');
            // this.initX = cfg.x || 200;
            // this.initY = cfg.y || 300;
            this.deltaX = cfg.deltaX || 18;
            this.deltaY = cfg.deltaY || 21;
            // this.drawX = this.initX + this.deltaX;
            // this.drawY = this.initY + this.deltaY;
            // this.sourceX = cfg.sourceX + this.deltaX;
            // this.sourceY = cfg.sourceY + this.deltaY;
            // this.targetX = cfg.targetX + this.deltaX;
            // this.targetY = cfg.targetY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.isShow = cfg.isShow === true ? true : false;
            this.deviceType = 'boxMarker';
            this.imagePoint = {
                x: 18,
                y: 21
            };
            this.container = null;
            return this;
        },
        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this._observer = cfg.observer;
            this.boxData = cfg.boxData;
            this.boxData && this.getMarkerPosition('update');
            // this.initX = cfg.x || this.initX;
            // this.initY = cfg.y || this.initY;
            // this.deltaX = cfg.deltaX || this.deltaX;
            // this.drawX = this.initX + this.deltaX;
            // this.drawY = this.initY + this.deltaY;
            // this.sourceX = cfg.sourceX + this.deltaX;
            // this.sourceY = cfg.sourceY + this.deltaY;
            // this.targetX = cfg.targetX + this.deltaX;
            // this.targetY = cfg.targetY + this.deltaY;
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.maxScaleLevel = cfg.maxScaleLevel || this.maxScaleLevel;
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
        },
        getMarkerPosition: function (behavior) {
            var that = this, offsetWidth = 0;;
            switch (this.boxData.STA_CURRENT_STATUS) { //判断箱子所在
                case 'Y':
                    var yardName = this.boxData.GPS_ACTUAL_POSITION_BLOCK;
                    var bayNum = this.boxData.GPS_ACTUAL_SLOT_POSITION.substr(0, 2);
                    $.each(this._observer._overMap.yards, function (k, v) {
                        if (v.yardName === yardName) {
                            offsetWidth = bayNum / v.totalBayNum * v.yardWidth;
                            that.drawX = v.drawX + offsetWidth;
                            that.drawY = v.drawY + Math.tan(v.rotation) * offsetWidth + v.yardHeight / 2;
                            behavior === 'init' && (that.initX = that.drawX, that.initY = that.drawY);
                        }
                    });
                    break;
                case 'RT':
                    break;
                case 'V':
                    var boatName = this.boxData.GPS_ACTUAL_LOCATION;
                    // var bayNum = this.boxData.GPS_ACTUAL_SLOT_POSITION.substr(0, 3);
                    $.each(this._observer._overMap.ships, function (k, v) {
                        if (v._equipmentCode === boatName) {
                            offsetWidth = bayNum / v.totalBayNum * v.drawLength;
                            that.drawX = v.drawX + offsetWidth;
                            that.drawY = v.drawY + Math.tan(v.rotation) * offsetWidth + v.boatHeight / 2;
                            behavior === 'init' && (that.initX = that.drawX, that.initY = that.drawY);
                        }
                    });
                    break;
                case 'T':
                    var truckCode = this.boxData.GPS_ACTUAL_LOCATION;
                    // var bayNum = this.boxData.GPS_ACTUAL_SLOT_POSITION.substr(0, 3);
                    // var mDrawX = 0, mDrawY = 0, offsetWidth = 0;
                    this.currDeviceType = 'T';
                    $.each(this._observer._overMap.containers, function (k, v) {
                        if (v._equipmentCode === truckCode) {
                            offsetWidth = bayNum / v.totalBayNum * v.drawLength;
                            that.drawX = v.drawX;
                            that.drawY = v.drawY;
                            behavior === 'init' && (that.initX = v.initX, that.initY = v.initY);
                        }
                    });
                    break;
                case 'CR':
                    break;
            }
        },
        /**
         * desc: 缩放后重绘
         */
        mapZoomChange: function (zoom) {
            this.reDrawByScale(zoom);
        },
        /**
         * desc: 根据位置和比例重绘
         */
        redrawByPosScale: function (args) {
            if (this.currDeviceType !== 'T') {
                this.drawX = this.initX + args.boxDeltaX;
                this.drawY = this.initY + args.boxDeltaY;
            } else {
                this.drawX = this.initX + args.x;
                this.drawY = this.initY + args.y;
            }
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            this.currDeviceType === 'T' ? this.drawAsCompnents() : this.draw();
        },
        /*
         *
         */
        remove: function () {
            //console.log('remove');
            this._remove();
            delete this;
            //console.log( this );
        },
        draw: function () {
            var scaleRatio = this.scaleRatio,
                group = this._group,
                self = this,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            }
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                scale: [scaleRatio, scaleRatio],
                width: this.imagePoint.x * scaleRatio,
                height: this.imagePoint.y * scaleRatio
            })
            var boxMarkerImage = new ImageShape({
                style: {
                    image: ImageUrl,
                    x: -parseInt(this.imagePoint.x) / 2,
                    y: -parseInt(this.imagePoint.y),
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            });
            group.add(boxMarkerImage);
            zr.add(group);
            var obj = $.extend({}, self);
            self._observer.showProfilePop(obj);
            return this;
        },
        /**
         * desc: 作为小车组件绘制
         * @return {object} zrender的Group类型
         */
        drawAsCompnents: function (code) {
            var scaleRatio = this.scaleRatio,
                group = this.group,
                self = this,
                zr = this._zr,
                obj = $.extend({}, self);
            // 立即更新并且重绘集卡
            $.each(this._observer._overMap.containers, function (k, v) {
                if (v._equipmentCode === code) {
                    // obj.drawX = v.drawX;
                    // obj.drawY = v.drawY;
                    self.container = v;
                }
            })
            // 集卡不在场内
            if (!this.container) return;
            if (group) {
                zr.remove(this._group);
            }
            group = this._group = new Group({
                position: [0, 0],
                scale: [scaleRatio, scaleRatio],
                width: this.imagePoint.x,
                height: this.imagePoint.y
            });
            var boxMarkerImage = new ImageShape({
                style: {
                    image: ImageUrl,
                    x: -parseInt(this.imagePoint.x) / 3,
                    y: -parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x / 2,
                    height: this.imagePoint.y / 2
                },
                zlevel: this.zlevel
            });
            group.add(boxMarkerImage);
            // 重绘集卡
            self.container.boxMarker = group;
            self.container.draw();
            // 展示箱子描述
            self._observer.showProfilePop(obj);
            // zr.add(group);
            return group;
        },
        hide: function () {
            var zr = this._zr,
                group = this._group;
            if (group) {
                zr.remove(this._group);
            }
            this._observer._isgetSearchBox = true;
            this._observer.searchBoxNum = '';
            this._observer._overMap.boxMarkers = [];
            if (this.container) { // 如果作为集卡组件删除对应集卡的boxMarker属性 进入判断调用对象是集卡
                $.each(this._observer._overMap.containers, function (k, v) {
                    if (v._equipmentCode === this._equipmentCode) {
                        v.boxMarker = null;
                        v.draw();
                    }
                })
                this.container = null;
            }
        }
    });
    return BOXMARKER;
});