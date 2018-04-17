/**
 * @module port/gdBridgecrane
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcGdBase');

    var BRIDGECRANE = function (cfg) {
        if (!(this instanceof BRIDGECRANE)) {
            return new BRIDGECRANE().init(cfg);
        }
    };



    BRIDGECRANE.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.cursor = cfg.cursor || '';
            this.is25d = cfg.is25d;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.observer = cfg.observer;
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            this.rotation = cfg.rotation || 20;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.workStatus = cfg.workStatus || 'NOINS'; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.jobType = cfg.jobType || 'LOAD'; //OBJ_TRUCK_WORK_TYPE
            if (this.workStatus === 'NOINS') {
                this.types = cfg.types || 1; //类型
            } else {
                this.types = cfg.types || 3; //类型
            }
            this.offset = {
                x: 0,
                y: 0
            };
            this.boxType = cfg.boxType || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.overMap = cfg.overMap;
            this.initPosition = null;
            this.boxLayer = {};
            this.deviceType = 'bridgecrane';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || '0';
            this.targetEfficiency = cfg.targetEfficiency || 29.5;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShipment = cfg.isShipment || false;
            this.shipmentStatus = cfg.shipmentStatus || 'hide'; // 进箱containerIn or 出箱containerOut			
            // this.draw();
            return this;
        },
        /*
        *  绘制到地图
        */
        draw: function () {
            var self = this;
            if (this.marker) {
                this.amap.remove([this.marker]);
            }
            var imageUrl = this.getImageUrl(this.workStatus, this.types);
            this.icon = new AMap.Icon({
                image: imageUrl,
                size: new AMap.Size(this.imagePoint.x * this.scaleLevel, this.imagePoint.y * this.scaleLevel),
                imageSize: new AMap.Size(this.imagePoint.x * this.scaleLevel, this.imagePoint.y * this.scaleLevel)
            });

            this.marker = new AMap.Marker({
                icon: this.icon,
                position: [this.lng, this.lat],
                //offset: new AMap.Pixel(-9,-47), //默认图片大小（36*36）
                angle: 20,
                autoRotation: true,
                zIndex: 101,
                map: this.amap,
                bubble: false,
                cursor: this.cursor
            })
                .on('click', function () {
                    var pixel = self.amap.lnglatTocontainer([self.lng, self.lat]);
                    self.drawX = pixel.getX();
                    self.drawY = pixel.getY();
                    var obj = $.extend({}, self);
                    self.observer._overMap.hideSelectedEquipment();
                    self.isSelected = true;
                    // self.showHighLight();
                    self.observer.showProfilePop(obj);
                });

            /*this.marker = new AMap.Marker({
                map: this.amap,
                position: [this.lng,this.lat],
                //position: [122.03676,29.888334],
                icon: new AMap.Icon({            
                    size: new AMap.Size(40, 50),  //图标大小
                    image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                    imageOffset: new AMap.Pixel(0, -60)
                }),
                zIndex : this.zlevel,
            });
            */
            /*this.marker = new AMap.Marker({ //添加自定义点标记
                map: this.amap,
                position: [this.lng, this.lat], //基点位置
                offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置        	       
                content: '<div class="marker-bridgecrane" style="transform: rotate(' + this.rotation + 'deg);"></div>'   //自定义点标记覆盖物内容
            });*/

            /*AMapUI.loadUI(['overlay/AwesomeMarker'],function(AwesomeMarker) {
                it.marker = new AwesomeMarker({
                    awesomeIcon: 'arrows', //my-font-awesome.css中包含的icon
                    
                    iconLabel: {
                        style: {
                            color: '#333', //设置颜色
                            height: 60, //高度
                            //width: **, //不指定时会维持默认的宽高比
                            fillColor: 'red', //填充色
                            strokeWidth: 1, //描边宽度
                            strokeColor: '#666', //描边颜色
                        }
                    },
                    iconStyle: 'red', //设置图标样式

                    map: it.amap,
                    position: [it.lng, it.lat], //基点位置
                    offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置   
                 });
                
            });*/



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
         *  删除
         */
        remove: function () {
            this.marker && this.amap.remove([this.marker]);
        },
        /*
         *  显示
        */
        show: function () {
            this.marker && this.marker.show();
        },
        /*
         *  隐藏
        */
        hide: function () {
            this.marker && this.marker.hide();
        },
        /*
         *  移动
        */
        moveTo: function (targetPoint) {
            var self = this;
            this.marker.moveTo(targetPoint, self.speed);
        },
        update: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || this.bubble;
            this.observer = cfg.observer;
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            this.rotation = cfg.rotation || this.rotation;
            this.scaleRatio = cfg.scaleRatio || 1;
            this.maxScaleLevel = cfg.maxScaleLevel || 3;
            this.isShow = cfg.isShow === true ? true : false;
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : false;
            //工作状态：1-绿色－作业中  2-蓝色－无令空闲 3-黄色－有指令空闲 4-红色－故障;            
            this.workStatus = cfg.workStatus || 'NOINS'; //NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            this.jobType = cfg.jobType || 'LOAD'; //OBJ_TRUCK_WORK_TYPE
            if (this.workStatus === 'NOINS') {
                this.types = cfg.types || 1; //类型
            } else {
                this.types = cfg.types || 3; //类型
            }
            this.offset = {
                x: 0,
                y: 0
            };
            this.boxType = cfg.boxType || 1;
            this.offset = { x: 0, y: 0 };
            this.observer = cfg.observer;
            this.overMap = cfg.overMap;
            this.initPosition = null;
            // this.imagePoint = cfg.imagePoint || this.imagePoint;//图片尺寸大小
            this.boxLayer = {};
            this.deviceType = 'bridgecrane';
            this.deviceData = cfg.deviceData || {};
            this.isSelected = cfg.isSelected === true ? true : false;
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.efficiency = cfg.efficiency || '0';
            this.targetEfficiency = cfg.targetEfficiency || 29.5;
            this.isShow = cfg.isShow === true ? true : false;
            this.isShipment = cfg.isShipment || false;
            this.shipmentStatus = cfg.shipmentStatus || 'hide'; // 进箱containerIn or 出箱containerOut  
        },
        /*
        * 根据状态获得相应的图片路径   
        */
        getImageUrl: function (workStatus, types) {
            var imageUrl;
            //判断图层
            var scaleRatioFolder = 'min';
            if (this.scaleRatio < 2 /*this.maxShowScale*/) {
                scaleRatioFolder = 'min';
                // if(types == 1){
                //     this.imagePoint ={x:18,y:44};
                // }else if(types == 2){
                //     this.imagePoint ={x:18,y:64};
                // }else if(types == 3){
                //     this.imagePoint ={x:18,y:95};
                // }
            } else {
                scaleRatioFolder = 'max';
                // if(types == 1){
                //     this.imagePoint ={x:81,y:199};
                // }else if(types == 2){
                //     this.imagePoint ={x:81,y:290};
                // }else if(types == 3){
                //     this.imagePoint ={x:81,y:426};
                // }
            }
            if (types === 1) {
                this.imagePoint = { x: 18, y: 44 };
            } else if (types === 2) {
                this.imagePoint = { x: 18, y: 64 };
            } else if (types === 3) {
                this.imagePoint = { x: 18, y: 95 };
            }
            //判断桥吊类型（大、中、小）
            var iconSize = 's';
            if (types === 1) {//大
                iconSize = 's';
            } else if (types === 2) {//中
                iconSize = 'm';
            } else if (types === 3) {//小
                iconSize = 'l';
            }
            //判断桥吊状态（工作中、维修、故障）
            if (workStatus === 'WORK') {
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-active.png';
            } else if (workStatus === 'NOINS') {
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-free.png';
            } else if (workStatus === 'YESINS') {
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-hasJob.png';
            } else if (workStatus === 'FAULT') {
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-broken.png';
            } else if (workStatus === 'REPAIR') {
                imageUrl = '../../src/js/mod/bridgecrane/images/' + scaleRatioFolder + '/icon-' + iconSize + '-repair.png';
            }
            //console.log(this.is25d);
            if (this.is25d) {
                imageUrl = '../../src/js/mod/bridgecrane/images/25d/icon-l-active.png';
            }
            return imageUrl;
        }
    });

    return BRIDGECRANE;
})
