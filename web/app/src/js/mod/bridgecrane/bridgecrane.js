/**
 * @module port/mod/BRIDGECRANE 桥吊
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var Text = require('zrender/graphic/Text');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var ProgressBar = require('mod/progressBar/progressBar');
    var imageUrl = '../../src/js/mod/bridgecrane/images/icon-bridgeS-active.png';
    var directionAnimate = require('mod/directionAnimate/directionAnimate');
    var boxImageUrl = '';
    //var BridgeBox = require('mod/bridgecrane/BridgeBox'); // 桥吊箱子

    var BRIDGECRANE = function (cfg) {
        if (!(this instanceof BRIDGECRANE)) {
            return new BRIDGECRANE().init(cfg);
        }
    };

    BRIDGECRANE.prototype = $.extend(new McBase(), {

        /*
         *
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.is25d = cfg.is25d;
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
            this.worKStatus = cfg.worKStatus || 1;
            //判断桥吊状态（工作中、维修、故障）
            if (this.worKStatus === 'NOINS') {
                this.types = cfg.types || 1; //类型
            } else {
                this.types = cfg.types || 3; //类型
            }
            this.jobType = cfg.jobType || 'LOAD';

            this.boxType = cfg.boxType || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.overMap = cfg.overMap;
            this.initPosition = null;
            this.imagePoint = { x: 6, y: 15 }; //图片尺寸大小
            this.boxLayer = {};
            this.deviceType = 'bridgecrane';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            this.efficiency = cfg.efficiency || '0';
            this.targetEfficiency = cfg.targetEfficiency || 29.5;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShipment = cfg.isShipment || false;
            this.shipmentStatus = cfg.shipmentStatus || 'hide'; // 进箱containerIn or 出箱containerOut
            //this.boxLayerMoving = undefined;
            this.draw();
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
            this.worKStatus = cfg.worKStatus || this.worKStatus;
            this.cname = this.deviceData.OBJ_EQUIPMENT_CNAME;
            //判断桥吊状态（工作中、维修、故障）
            if (this.worKStatus === 'NOINS') {
                this.types = cfg.types || 1; //类型
            } else {
                this.types = cfg.types || 3; //类型
            }
            this.jobType = cfg.jobType || this.jobType;
            this.boxType = cfg.boxType || this.boxType;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer || this.observer;
            this.overMap = cfg.overMap || this.overMap;
            this.deviceData = cfg.deviceData || this.deviceData;
            this.isSelected = cfg.isSelected === 'undefined' ? this.isSelected : cfg.isSelected;
            this.isShowQuota = cfg.isShowQuota;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === undefined ? this.isShowDeviceJobType : cfg.isShowDeviceJobType;
            this.efficiency = cfg.efficiency || this.efficiency;
            this.targetEfficiency = cfg.targetEfficiency || this.targetEfficiency;
            this.isShow = cfg.isShow === 'undefined' ? this.isShow : cfg.isShow;
            this.isShipment = cfg.isShipment || this.isShipment;
            this.shipmentStatus = cfg.shipmentStatus || this.shipmentStatus; // 进箱containerIn or 出箱containerOut
            //this.draw();

        },

        /*
         *
         */
        remove: function () {
            // console.log('删除桥吊remove');
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
        startBoxMoving: function () {
            var that = this;
            that.initAnimate(0, 35, 6 * 1000);
            /*setTimeout( function(){
                that.initAnimate( 0, 45, 1000 );
                // that.showTipImage();
            }, 100);*/
            /* setTimeout( function(){
                 that.stopBoxMoving();
             }, 6100);*/
        },

        /*
         *
         */
        stopBoxMoving: function () {
            this.boxLayerMoving && this.boxLayerMoving.stop === undefined && console.log(this);
            if (this instanceof BRIDGECRANE) {
                this.boxLayerMoving && this.boxLayerMoving.stop && this.boxLayerMoving.stop();
                this.boxLayer.hide(); //隐藏
                this.hideTipImage();
            }
        },

        /*
         *
         */
        draw: function () {
            var scaleRatio = this.scaleRatio,
                group = this._group,
                that = this,
                zr = this._zr;
            if (group) {
                zr.remove(this._group);
            };
            //console.log( this.drawX , this.drawY );
            group = this._group = new Group({
                position: [this.drawX * scaleRatio + 20 * scaleRatio, this.drawY * scaleRatio - 90 * scaleRatio], // 这里可能是Group的计算bug，必须分着写，不能合并计算
                rotation: this.rotation,
                scale: [scaleRatio, scaleRatio]
            });

            // 先构造一个数据
            /*that.profileData = [
                {"license":"浙AZT280","number":"t60","id":"001","status":"作业中（36km/h）","mileage":"27856"}
            ];*/

            //根据不同颜色设置不同的图片背景
            imageUrl = this.getImageUrl(this.workStatus, this.types);
            this.bridgcraneLayer = new ImageShape({
                style: {
                    image: imageUrl,
                    x: 0,
                    y: 85 - this.imagePoint.y,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
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

            //加入桥吊上的箱子
            boxImageUrl = this.getBoxImageUrl();
            this.boxLayer = new ImageShape({
                style: {
                    image: boxImageUrl,
                    x: 4,
                    y: 25,
                    width: 8,
                    height: 12
                },
                zlevel: this.zlevel - 1
            });

            // var bridgeText = new Text({
            //     rotation: -this.rotation,
            //     // position: [3, -(this.types - 1) * 20 + 30],
            //     position: [10, 100],
            //     scale: [1 / scaleRatio, 1 / scaleRatio],
            //     style: {
            //         text: this.efficiency ? Number(this.efficiency).toFixed(0) + 'MPH' : 0,
            //         textAlign: 'center',
            //         x: 0,
            //         y: 0,
            //         textFont: 12 + 'px Microsoft Yahei'
            //     },
            //     zlevel: this.zlevel
            // });
            //console.log(this.deviceData.OBJ_EQUIPMENT_CNAME);
            // 编号
            var deviceCodeText = this.deviceData.OBJ_EQUIPMENT_CNAME.replace(/#桥吊/, ''); //#桥吊、CR
            var serialNumText = new Text({
                // rotation: -this.rotation,
                position: [5, 74],
                scale: [1 / scaleRatio, 1 / scaleRatio],
                style: {
                    text: deviceCodeText,
                    textAlign: 'center',
                    x: 0,
                    y: 0,
                    textFont: 12 * this.scaleRatio / 1.9 + 'px Microsoft Yahei'
                },
                zlevel: this.zlevel
            });

            var hightLightRadius = 0;
            this.scaleLevel < 2 /*this.maxShowScale*/ ? hightLightRadius = 15 : hightLightRadius = 32;
            /* 高亮 */
            var highLight = new CircleShape({
                position: [0, 0],
                scale: [1, 1],
                shape: {
                    cx: 8,
                    cy: 75,
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

            var loadingUploadImg = new directionAnimate({
                imageUrl: '../../src/js/mod/directionAnimate/images/transmission-direction.png',
                // zlevel: this.zlevel + 1,
                rotation: 3.14,
                //rotation: this.shipmentStatus == 'containerOut' ? 0 : 3.14,
                //x: this.shipmentStatus == 'containerOut' ? parseInt(this.imagePoint.x)/2 + 12 : -(parseInt(this.imagePoint.x)/2 + 20),
                //y: this.shipmentStatus == 'containerOut' ? parseInt(this.imagePoint.y) * 3 : -(parseInt(this.imagePoint.y) * 4),
                x: -parseInt(this.imagePoint.x),
                y: -74,
                width: 5,
                height: 9,
                sWidth: 10,
                sHeight: 18,
                sx: 0,
                sy: 0,
                during: 800,
                csy: 18,
                //isShow: this.scaleLevel >= this.edgeScaleLevel,
                zlevel: this.zlevel - 1
            })
            group.add(highLight);
            group.add(this.bridgcraneLayer);
            (this.scaleLevel >= this.edgeScaleLevel) && (group.add(loadingUploadImg));
            //group.add(loadingUploadImg)
            (this.scaleLevel >= this.edgeScaleLevel) && (group.add(this.boxLayer));
            group.add(this.boxLayer)
            group.add(serialNumText);
            //(this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota && this.workStatus == 'WORK') && (group.add( bridgeText ));
            //group.add( bridgeText )
            /* 构建进度条 */
            var progressGroup = new ProgressBar({
                zlevel: this.zlevel,
                efficiency: this.efficiency,
                target: this.targetEfficiency,
                rotation: -this.rotation,
                //position: [-5, -(this.types - 1) * 20 + 36]
                position: [0, 90]
            });
            (this.scaleLevel >= this.edgeScaleLevel && this.isShowQuota && this.workStatus === 'WORK') && (group.add(progressGroup));

            //执行动画
            if (this.isShipment === false) {
                this.boxLayer.hide(); //隐藏
            }

            // this.hideTipImage();
            zr.add(group);
            //桥吊箱子
            //this.drawX = posX;
            //this.drawY = posY;
            this.isSelected ? this.showHighLight() : this.hideHighLight();
            this.isShow ? this.show() : this.hide();
            this.shipmentStatus !== 'hide' ? this.showTipImage() : this.hideTipImage();
            //执行动画

            if (this.workStatus === 'WORK' /* && (this.boxLayerMoving == undefined)*/) {
                /*console.log( this.workStatus, this.cname );
                console.log( this.boxLayerMoving );*/
                /*if( this.boxLayerMoving ){
                	return this;
                };*/
                this.startBoxMoving();
            } else {
                //console.log( this.workStatus, this.cname );
                //console.log( this.boxLayerMoving );
                this.stopBoxMoving();
            }
            return this;
        },

        /*
         * 根据状态获得相应的图片路径
         */
        getBoxImageUrl: function () {
            //判断图层
            var scaleRatioFolder = 'min';
            if (this.scaleRatio < 2 /*this.maxShowScale*/) {
                scaleRatioFolder = 'min';
                // this.imagePoint ={x:10,y:16};
            } else {
                scaleRatioFolder = 'max';
                // this.imagePoint ={x:45,y:74};
            }
            //this.imagePoint = { x:10, y:16 };
            //判断桥吊类型--暂时未实现，后续接口
            if (this.boxType === 1) {
                boxImageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-box.png';
            }
            return boxImageUrl;
        },

        /*
         * 根据状态获得相应的图片路径
         */
        getImageUrl: function (workStatus, types) {
            //判断图层
            var scaleRatioFolder = 'max';

            if (types === 1) {
                this.imagePoint = { x: 12, y: 30 };
            } else if (types === 2) {
                this.imagePoint = { x: 12, y: 45 };
            } else if (types === 3) {
                this.imagePoint = { x: 12, y: 60 };
            }
            //判断桥吊类型（大、中、小）
            var iconSize = 's';
            if (types === 1) { //大
                iconSize = 's';
            } else if (types === 2) { //中
                iconSize = 'm';
            } else if (types === 3) { //小
                iconSize = 'l';
            }
            //判断桥吊状态（工作中、维修、故障）
            /*if(workStatus == 'WORK'){
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-active.png';
            }else if(workStatus == 'NOINS'){
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-free.png';
            }else if(workStatus == 'YESINS'){
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-hasJob.png';
            }else if(workStatus == 'FAULT'){
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-broken.png';
            }else if(workStatus == 'REPAIR'){
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-repair.png';
            }*/

            var iconType, iconTypeWork, iconTypeStatus;
            switch (this.jobType) {
                case 'LOAD':
                    iconTypeWork = 'load';
                    break;
                case 'DLVR':
                    iconTypeWork = 'dlvr';
                    break;
                case 'DSCH':
                    iconTypeWork = 'dsch';
                    break;
                case 'RECV':
                    iconTypeWork = 'recv';
                    break;
                case 'CHECK':
                    iconTypeWork = 'check';
                    break;
                default:
                    iconTypeWork = 'load';
            }
            switch (this.workStatus) {
                case 'WORK':
                    iconTypeStatus = 'active';
                    break;
                case 'NOINS':
                    iconTypeStatus = 'free';
                    break;
                case 'YESINS':
                    iconTypeStatus = 'hasJob';
                    break;
                case 'REPAIR':
                    iconTypeStatus = 'repair';
                    break;
                case 'FAULT':
                    iconTypeStatus = 'error';
                    break;
                default:
                    iconTypeStatus = 'active';
            }
            iconType = this.isShowDeviceJobType ? iconTypeWork : iconTypeStatus;
            imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-' + iconType + '.png';
            if (this.is25d) {
                imageUrl = '../../src/js/mod/bridgecrane/images/25d/icon-l-active.png';
            }
            return imageUrl;
        },


        /*
         * 隐藏集卡高亮状态
         * 查找高亮元素调用 隐藏方法
         */
        hideHighLight: function () {

            if (!this._group || !this._group._children) return false;
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

            //if ( !this._group ||  !this._group._children ) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof CircleShape) {
                    v.show();
                }
            });
        },

        /*
         * 显示装运状态指示图片
         */
        showTipImage: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof ImageShape && v.style.type === 'trans') {
                    v.show();
                }
            });
        },

        /*
         * 隐藏装运状态指示图片
         */
        hideTipImage: function () {
            if (!this._group || !this._group._children) return false;
            $.each(this._group._children, function (k, v) {
                if (v instanceof ImageShape && v.style.type === 'trans') {
                    v.hide();
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
        },

        /*
         * 根据参数实现固定时间，位置的变化
         */
        /*run: function( positionData ){
            if ( !positionData ) {
                return false;
            }
            this.initPosition = positionData;
            var lorryAnimator = this._group.animate('', true);
            for (var i = 0; i < positionData.length; i++) {
                var _duration = positionData[i].duration,
                    _targetX = (positionData[i].targetX + this.offset.x) * this.scaleRatio,
                    _targetY = (positionData[i].targetY + this.offset.y) * this.scaleRatio,
                    scaleRatio = this.scaleRatio;
                lorryAnimator.when(_duration, {
                    position: [_targetX , _targetY ]
                })
            }
            lorryAnimator.start();
            return this;
        },*/

        /*
         *
         */
        initAnimate: function (deltX, deltY, duration) {
            // 输入校验
            if (!this._group) {
                return false;
            }
            var targetX = deltX || 0,
                targetY = deltY || -50,
                sourceX = 0,
                sourceY = 10;
            // 设置单循环
            this.boxLayerMoving = this.boxLayer.animate('', false)
                .when(duration / 2, {
                    position: [targetX, targetY]
                }).when(duration, {
                    position: [sourceX, sourceY]
                }).start();

        }
    });

    return BRIDGECRANE;
});