// 

/**
 * @module port/mod/container 集卡车
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var Text = require('zrender/graphic/Text');
    var PolygonShape = require('zrender/graphic/shape/Polygon');
    var ProgressBar = require('mod/progressBar/progressBar');
    var Box = require('mod/jobMarkBox/jobMarkBox');
    var imageUrl = '../../src/js/mod/container/images/icon-lorry-active.png';

    var CONTAINER = function (cfg) {
        if (!(this instanceof CONTAINER)) {
            return new CONTAINER().init(cfg);
        }
    };

    CONTAINER.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.observer = cfg.observer;
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
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.workStatus = cfg.workStatus || 'NOINS'; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.jobType = cfg.jobType || 'DSCH'; //OBJ_TRUCK_WORK_TYPE
            this.offset = {
                x: 0,
                y: 0
            };
            this.initPosition = null;
            this.speed = cfg.speed || 0;
            this.edgeSpeed = cfg.edgeSpeed;
            this.identity = cfg.identity;
            this.rotation = cfg.rotation || 0;
            this.boxColor = cfg.boxColor || '#33AF19';
            this.deviceType = 'container';
            this.profileData = cfg.profileData || {};
            this.deviceData = cfg.deviceData || {};
            this.isCarryCargo = cfg.isCarryCargo;
            this.inOutStatus = cfg.inOutStatus || 'N';
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
            // this.getLorryDetailById(0);
            this.alarm = cfg.alarm;
            this.boxMarker = null;
            return this;
        },

        update: function (cfg) {
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.observer = cfg.observer;
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
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow;
            this.isSelected = cfg.isSelected === undefined ? this.isSelected : cfg.isSelected;
            this.isShowQuota = cfg.isShowQuota === undefined ? this.isShowQuota : cfg.isShowQuota;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === undefined ? this.isShowDeviceJobType : cfg.isShowDeviceJobType;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.workStatus = cfg.workStatus || this.workStatus; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.jobType = cfg.jobType || this.jobType; //OBJ_TRUCK_WORK_TYPE            
            this.speed = cfg.speed || this.speed;
            this.edgeSpeed = cfg.edgeSpeed || this.edgeSpeed;
            this.identity = cfg.identity || this.identity;
            this.rotation = cfg.rotation || this.rotation;
            this.boxColor = cfg.boxColor || this.boxColor;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.isCarryCargo = cfg.isCarryCargo;
            this.inOutStatus = cfg.inOutStatus || this.inOutStatus;
            this.emptyWeightStatus = cfg.Status || this.emptyWeightStatus;
            this.boxType = cfg.Status || this.boxType;
            this.boxCount = cfg.Status || this.boxCount;
            this.boxWidth = cfg.boxWidth || this.boxWidth;
            this.boxHeight = cfg.boxHeight || this.boxHeight;
            this.efficiency = cfg.efficiency || this.efficiency;
            this.presenceTime = cfg.presenceTime || this.presenceTime;
            this.target = cfg.target || this.target;
            this.alarm = cfg.alarm;
            this.boxMarker = cfg.boxMarker || this.boxMarker;
        },

        /*
         *
         */
        mapZoomChange: function (zoom) {
            this.reDrawByScale(zoom);
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
        reDrawByScale: function () {
            //console.log( zoom );
            /*this.scaleRatio = zoom;
            this.draw();*/
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
        reDrawByWorkStatus: function (workStatus) {
            this.workStatus = workStatus;
            this.draw();
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
         * 
         */
        draw: function () {
            var scaleRatio = this.scaleRatio,
                // posX = this.drawX,
                // posY = this.drawY,
                group = this._group,
                // rotation = this.rotation,
                // boxColor = this.boxColor,
                // isCarryCargo = this.isCarryCargo,
                that = this,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scaleRatio, this.drawY * scaleRatio],
                //position: [this.sourceX * scaleRatio, this.sourceY * scaleRatio],
                // rotation: rotation,
                scale: [scaleRatio, scaleRatio],
                width: 20 * scaleRatio,
                height: 20 * scaleRatio
            });
            var truckGroup = new Group({
                rotation: this.rotation
            }).on('click', function (ev) {
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                (that.speed < that.edgeSpeed) && that.showHighLight();
                that.observer.showProfilePop(obj);
                ev.cancelBubble = true;
            });
            var highLight = null;
            var warnHighLight = null;
            var rectPolygon = null;
            var lorryImage = null;
            var lorryText = null;
            var hightLightRadius = 10;
            var imageUrl = this.getImageUrl();
            var rectPoints = [
                [-5, -3],
                [1, -3],
                [1, 0],
                [-5, 0]
            ];
            var rotBox = 0;
            var rotText = 0;
            var posBox = [-8, -6];
            if (this.rotation < -0.5 * Math.PI) {
                rectPoints = [
                    [-5, -2],
                    [1, -2],
                    [1, 1],
                    [-5, 1]
                ];
                rotText = Math.PI;
                rotBox = Math.PI;
                posBox = [2, 2];
            }


            warnHighLight = new CircleShape({
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
                zlevel: this.zlevel - 1
            });

            highLight = new CircleShape({
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
                    stroke: '#3095E5',
                    opacity: 0.7,
                    lineWidth: 1
                },
                zlevel: this.zlevel - 1
            });

            var posText = [0, -15];
            lorryText = new Text({
                scale: [1 / scaleRatio, 1 / scaleRatio],
                position: posText,
                style: {
                    text: this.inOutStatus === 'N' ? (this.efficiency ? (~~this.efficiency).toFixed(0) + 'MPH' : 0)
                        : this.presenceTime,
                    textAlign: 'center',
                    x: 0,
                    y: 0,
                    textFont: 12 + 'px Microsoft Yahei'
                },
                zlevel: this.zlevel
            });

            rectPolygon = new Box({
                rotation: rotBox,
                emptyWeightStatus: this.emptyWeightStatus,
                boxType: this.boxType,
                boxCount: this.boxCount,
                zlevel: this.zlevel,
                width: this.boxWidth,
                height: this.boxHeight,
                position: posBox,
                yardOrCar: 'car'
                // emptyWeightStatus: 'weight'
            })


            lorryImage = new ImageShape({
                // rotation: rotation,
                style: {
                    image: imageUrl,
                    x: - parseInt(this.imagePoint.x) / 2,
                    y: - parseInt(this.imagePoint.y) / 2,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel
            });
            // var boxMarkerGroup = BoxMarker({

            // });
            truckGroup.add(lorryImage);
            group.add(highLight);
            if (this.alarm && this.alarm.ALARM_NAME === '集卡超速') {
                group.add(warnHighLight);
            }
            this.isCarryCargo && truckGroup.add(rectPolygon);

            /* 构建进度条 */
            var progressGroup = new ProgressBar({
                zlevel: this.zlevel + 1,
                efficiency: this.efficiency,
                target: this.target
            });
            (this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota && this.workStatus === 'WORK') && (group.add(progressGroup));
            group.add(truckGroup);
            this.boxMarker && group.add(this.boxMarker);
            zr.add(group);
            (this.isSelected && (!this.alarm || !this.alarm.ALARM_NAME === '集卡超速')) ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            // this.isCarryCargo ? this.showBoxImage() : this.hideBoxImage();
            // this.showBoxImage();
            return this;
        },

        /*
         * 
         */
        getImageUrl: function () {
            var inorOut = this.inOutStatus === 'N' ? 'inCar' : 'outCar';
            var imageX = 10;
            var imageY = 5;
            var imageLeftX = 10;
            var imageLeftY = 10;
            //判断图层
            var scaleRatioFolder = 'max';
            /*if (this.scaleRatio < 2 this.maxShowScale ) {
                scaleRatioFolder = 'min';
                // mm豆尺寸
                // this.imagePoint ={x:24,y:24};
                this.imagePoint = {
                    x: imageX,
                    y: imageY
                };
            } else {
                scaleRatioFolder = 'max';
                this.imagePoint = {
                    x: imageX,
                    y: imageY
                };
            }*/
            //判断状态（工作中、维修、故障） // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            //工作状态：LOAD: '#6587FF' 装船; DLVR: '#38D016' 提箱; DSCH: '#F58F00' 卸船 ;   RECV: '#F36067' 进箱
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
            // mm豆图标
            // imageUrl = 'src/js/mod/container/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';

            // 修改为圆点图标
            // if (scaleRatioFolder == 'max') {
            //     imageUrl = '../../src/js/mod/container/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';
            //     if (this.rotation < -0.5 * Math.PI) {
            //         imageUrl = '../../src/js/mod/container/images/' + scaleRatioFolder + '/icon-' + iconType + '-left.png';
            //         this.imagePoint = {
            //             x: 8,
            //             y: 8
            //         };
            //     }
            // } 
            // else if (scaleRatioFolder == 'min') {
            //     imageUrl = '../../src/js/mod/container/images/' + 'temp' + '/icon-triangle-' + iconType + '.png';
            // }

            imageUrl = '../../src/js/mod/container/images/' + 'max/' + inorOut + '/icon-' + iconType + '.png';
            this.imagePoint = {
                x: imageX,
                y: imageY
            };
            if (this.rotation < -0.5 * Math.PI) {
                imageUrl = '../../src/js/mod/container/images/' + 'max/' + inorOut + '/icon-' + iconType + '-left.png';
                this.imagePoint = {
                    x: imageLeftX,
                    y: imageLeftY
                };
            }

            return imageUrl;
        },



        /*
         * 隐藏集卡高亮状态
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
         * 显示集卡高亮状态
         * 查找高亮元素调用 显示方法
         */
        showHighLight: function () {
            this.isSelected = true;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape && v.style.type === 'highLight') {
                    v.show();
                }
            });
        },
        /*
         * 显示装运状态指示图片
         */
        showBoxImage: function () {
            $.each(this._group._children, function (k, v) {
                if (v instanceof PolygonShape && v.style.type === 'box') {
                    v.show();
                }
            });
        },

        /*
         * 隐藏装运状态指示图片
         */
        hideBoxImage: function () {
            $.each(this._group._children, function (k, v) {
                if (v instanceof PolygonShape && v.style.type === 'box') {
                    v.hide();
                }
            });
        }
    });

    return CONTAINER;
});
