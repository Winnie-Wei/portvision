/**
 * @moudle prot/mod/titleLabel 区域标签
 */
define(function (require) {
    'use strict'
    var CAMERA = require('mod/camera/camera');
    // var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    // var RectShape = require('zrender/graphic/shape/Rect');
    // var PolygonShape = require('zrender/graphic/shape/Polygon');
    var ImageShape = require('zrender/graphic/Image');
    // var CircleShape = require('zrender/graphic/shape/Circle');

    var GATE = function (cfg) {
        if (!(this instanceof GATE)) {
            return new GATE().init(cfg);
        }
    };

    GATE.prototype = $.extend(new CAMERA(), {
        init: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.vertices = cfg.vertices || [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 0 }, { x: 1, y: 1 }];
            this.initX = cfg.initX || this.vertices[0].x;
            this.initY = cfg.initY || this.vertices[0].y || 0;
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
            this.deviceType = 'gate';

            this.gateText = cfg.text;
            this.workStatus = cfg.workStatus;
            this.workData = cfg.workData;
            this.gateType = cfg.gateType;

            this.imagePoint = { x: 74, y: 32 };//图片尺寸大小
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            this.alarm = cfg.alarm;
            var relateX = this.vertices[1].x - this.vertices[0].x;
            var relateY = this.vertices[1].y - this.vertices[0].y;
            this.rotation = Math.atan2(relateY, relateX) - 0.61; // 弧度
            return this;
        },
        /*
        *
        */
        draw: function () {
            if (!this.isShow) {
                this.hide();
                return;
            }
            var posX = this.drawX,
                gps = this.gps,
                posY = this.drawY,
                scaleRatio = this.scaleRatio,
                rotation = this.rotation,
                group = this._group,
                workStatus = this.workStatus,
                that = this,
                zr = this._zr,
                imageUrl;
            this.imagePoint = { x: 74, y: 32 };//图片尺寸大小

            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio],
                zlevel: this.zlevel
            });

            if (workStatus === 'on') {
                imageUrl = '../../src/images/gate-on.png';
            } else {
                imageUrl = '../../src/images/gate-off.png';
            }

            var smallgroup = new Group({
                position: [0, 0]
            });
            //var hightLightRadius = 10;
            /*var warnHighLight = new CircleShape({
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
                zlevel: this.zlevel - 1,
            });*/

            /* var highLight = new CircleShape({
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
                     zlevel: this.zlevel - 1,
                 }); */



            var cameraImage = new ImageShape({
                style: {
                    image: imageUrl,
                    //x: -parseInt(this.imagePoint.x) / 2,
                    //y: -parseInt(this.imagePoint.y) / 2,
                    x: 0,
                    y: 0,
                    width: this.imagePoint.x / 1.5,
                    height: this.imagePoint.y / 1.5
                },
                zlevel: this.zlevel
            });
            group.on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            })
            //console.log( cameraImage );
            // 告警内容没有配置  （未完成）
            /*if(this.alarm && this.alarm.ALARM_NAME == ''){
                smallgroup.add(warnHighLight);
            }*/
            smallgroup.add(cameraImage);
            //smallgroup.add( highLight );
            group.add(smallgroup);
            zr.add(group);
            //this.isSelected ? this.showHighLight() : this.hideHighLight();
            return this;
        }
    });

    return GATE;
});