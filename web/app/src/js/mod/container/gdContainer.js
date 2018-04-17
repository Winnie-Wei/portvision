/**
 * @module port/gdContainer
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcGdBase');
    var imageUrl = '../../src/js/mod/container/images/icon-lorry-active.png';

    var CONTAINER = function (cfg) {
        if (!(this instanceof CONTAINER)) {
            return new CONTAINER().init(cfg);
        }
    };

    // function change(lng, lat){
    //     return [parseFloat(lng) + 0.0044, parseFloat(lat) - 0.0019];
    // }

    CONTAINER.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.containerData = cfg.containerData;
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
            this.observer = cfg.observer;
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            this.drawX = this.observer.convertFromLng(cfg.lng);
            this.drawY = this.observer.convertFromLat(cfg.lat);
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
            this.offset = {
                x: 0,
                y: 0
            };
            this.initPosition = null;
            this.speed = cfg.speed || 35;
            this.edgeSpeed = cfg.edgeSpeed;
            this.identity = cfg.identity;
            this.rotation = cfg.rotation || 0;
            this.boxColor = cfg.boxColor || '#33AF19';
            this.deviceType = 'container';
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

            this.width = 16;
            this.height = 8;
            
            this.bindEvent();
            this.zoomLevel = 17;

            this.canvas = null;

            this.datas = cfg.datas;

            this.draw();
            return this;
        },
        /**
         * 
         */
        bindEvent: function() {
            // var that = this;
            // this.amap.on('zoomstart', function( ev ) {
            //     console.log(that.amap.getZoom());
            //     // that.reDrawByScale(that.amap.getZoom())
            //     that.zoomLevel = that.amap.getZoom();
            //     that.reDrawByScale(that.zoomLevel - 17);
            // })
        },
        // reDrawByScale: function( scale ) {
        //     // this.width = scale * this.width;
        //     // this.height = scale * this.height;
        //     // this.draw();
        // },
        /**
         * desc: marker 使用marker绘制集卡 与 mass 互斥
         * @return {null}
         */
        draw: function () {
            if (this.marker) {
                this.remove();
                // this.marker.hide();
            }
            if( !this.icon ){
            	this.icon = new AMap.Icon({           
	                image: this.getImageUrl(),
	                size: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel),
	                imageSize: new AMap.Size(this.width * this.scaleLevel, this.height * this.scaleLevel)
	            });
            }

            // this.shadow = new AMap.Icon({
            //  image : '../../src/js/mod/container/images/max/inCar/icon-shadow.png',
            //        size : new AMap.Size(60,60),
            //        imageSize : new AMap.Size((that.zoomLevel - 16)*this.width,(that.zoomLevel - 16)*this.width)
            // });
            if( !this.marker ){
	            this.marker = new AMap.Marker({
	                icon: this.icon,
                    position: new AMap.LngLat(this.lng, this.lat),
                    offset: new AMap.Pixel(-12,-6),
                    // autoRotation: true,
                    zIndex: 101,
                    bubble: this.bubble,
                    map: this.amap,
                    cursor: this.cursor
	            });
            }

            this.marker.hide();
            // ====== 分割线 ====== (覆盖物图层 可以接收事件)
            // this.testImgCenter = new AMap.LngLat(this.lng, this.lat);
            // var containerImgUrl = this.getImageUrl(), // '../../src/js/mod/container/images/max/outCar/abc.png',
            //     southWest = new AMap.LngLat(this.testImgCenter.lng - 0.00011, this.testImgCenter.lat - 0.00005),
            //     northEast = new AMap.LngLat(this.testImgCenter.lng + 0.00011, this.testImgCenter.lat + 0.00005),
            //     bounds = new AMap.Bounds(southWest, northEast),
            //     groundImageOpts = {
            //         map: this.amap,
            //         clickable: true,
            //         opacity: 1,
            //         zIndex: 101
            //     };
            // this.testImg = new AMap.GroundImage( containerImgUrl, bounds, groundImageOpts );
            // this.testImg.on('click', function (ev) {
            //     var pixel = that.amap.lnglatTocontainer(new AMap.LngLat(that.lng, that.lat));
            //     that.drawX = pixel.getX();
            //     that.drawY = pixel.getY();
            //     var obj = $.extend({}, that);
            //     that.observer._overMap.hideSelectedEquipment();
            //     that.isSelected = true;
            //     that.showHighLight(testImgCenter);
            //     that.observer.showProfilePop(obj);
            // });
            // this.testImg.hide();
            // ====== 分割线 ====== ()
            // this.containerImg = new AMap.ImageLayer({
            //     bounds: bounds,
            //     url: that.getImageUrl(),
            //     map: that.amap,
            //     zIndex: 101,
            //     zooms: [16, 20],
            // })
            // .on('click', function (ev) {
            //     var pixel = that.amap.lnglatTocontainer(new AMap.LngLat(that.lng, that.lat));
            //     that.drawX = pixel.getX();
            //     that.drawY = pixel.getY();
            //     var obj = $.extend({}, that);
            //     that.observer._overMap.hideSelectedEquipment();
            //     that.isSelected = true;
            //     that.showHighLight(that.testImgCenter);
            //     that.observer.showProfilePop(obj);
            // });
            // this.containerImg.hide();

            // // ====== 分割线 ======
            // if ( !this.canvas ) {
            //     this.canvas = document.createElement('canvas');
            //     this.canvas.width = this.amap.getSize().width;
            //     this.canvas.height = this.amap.getSize().height;
            //     var deviceLayer = new AMap.CustomLayer(this.canvas, {
            //         opacity: 0,
            //         zooms:[16,20]
            //     });
            //     this.amap.setLayers([deviceLayer]);
            // }
        },

        /**
         * desc: marker 使用marker绘制集卡 与 mass 互斥
         * @return {null}
         */
        // draw: function(){
        //     var that = this;
        //     var styles = [];
        //     var datas = [];
        //     $.each(this.datas, function(idx, item){
        //         datas.push({
        //             lnglat: change(item.GPS_LONGITUDE, item.GPS_LATITUDE),
        //             style: idx,
        //         });
        //         styles.push({
        //             'url': that.getImageUrl(item.STA_WORK_STATUS),
        //             'anchor': new AMap.Pixel(6, 6),
        //             'size': new AMap.Size(11 * that.scaleLevel, 11 * that.scaleLevel),
        //         })
        //     })
        //     this.mass = new AMap.MassMarks(datas, {
        //         zooms: [-3, 22],
        //         opacity:0.8,
        //         zIndex: 111,
        //         cursor:'pointer',
        //         style: styles
        //     })
        //     .on('click', function(ev){
        //         var pixel = that.amap.lnglatTocontainer([ev.data.lnglat.lng, ev.data.lnglat.lat]);
        //         that.drawX = pixel.getX();
        //         that.drawY = pixel.getY();
        //         var obj = $.extend({}, that);
        //         that.observer._overMap.hideSelectedEquipment();
        //         that.isSelected = true;
        //         // that.showHighLight();
        //         obj._type = 'gantrycrane';
        //         obj.mapType = 'gd';
        //         that.observer.showProfilePop(obj);
        //     });
        //     this.mass.setMap(this.amap);
        // },
        /**
         * desc: 获取图片的路径
         * @param  {string} workStatus 工作状态
         * @return {string}           图片地址
         */
        getImageUrl: function(workStatus) {
            var inorOut = this.inOutStatus === 'N' ? 'inCar' : 'outCar';
            var imageX = 10;
            var imageY = 5;
            var imageLeftX = 10;
            var imageLeftY = 10;
            //判断图层
            // var scaleRatioFolder = 'max';
            //判断状态（工作中、维修、故障） // NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            //工作状态：LOAD: '#6587FF' 装船; DLVR: '#38D016' 提箱; DSCH: '#F58F00' 卸船 ;   RECV: '#F36067' 进箱
            var iconType, iconTypeWork, iconTypeStatus ;
            switch(this.jobType){
                case 'LOAD': iconTypeWork = 'load';break;
                case 'DLVR': iconTypeWork = 'dlvr';break;
                case 'DSCH': iconTypeWork = 'dsch';break;
                case 'RECV': iconTypeWork = 'recv';break;
                case 'CHECK': iconTypeWork = 'check';break;
                default:iconTypeWork = 'load';
            }
            switch(workStatus){
                case 'WORK': iconTypeStatus = 'active';break;
                case 'NOINS': iconTypeStatus = 'free';break;
                case 'YESINS': iconTypeStatus = 'hasJob';break;
                case 'REPAIR': iconTypeStatus = 'repair';break;
                case 'FAULT': iconTypeStatus = 'error';break;
                default: iconTypeStatus = 'active';
            }           
            iconType = this.isShowDeviceJobType ? iconTypeWork : iconTypeStatus;
            
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
        /**
         * desc: marker 响应缩放方法 与 mass 互斥
         * @param  {number} scaleLevel 缩放比例
         * @return
         */
        onZoomEnd: function (scaleLevel) {
            this.scaleLevel = scaleLevel;
            // this.icon.setImageSize( this.width,this.height ); // 重设Size会延迟 出现图标变形的状况
            this.draw(); // 重绘性能消耗大
        },
        /**
         * desc: mass 响应缩放方法 与 marker 互斥
         * @param  {number} scaleLevel 缩放比例
         * @return
         */
        // onZoomEnd: function (scaleLevel) {
        //     // this.imageUrl = this.getImageUrl(this.workStatus);
        //     //console.log( scaleLevel );
        //     this.scaleLevel = scaleLevel;
        //     // this.icon.setImageSize( this.width,this.height ); // 重设Size会延迟 出现图标变形的状况
        //     // this.draw(); // 重绘性能消耗大
        //     var styles = [], that = this;
        //     $.each(this.datas, function(idx, item){
        //         styles.push({
        //             'url': that.getImageUrl(item.STA_WORK_STATUS),
        //             'anchor': new AMap.Pixel(6, 6),
        //             'size': new AMap.Size(11 * scaleLevel, 11 * scaleLevel),
        //         })
        //     })
        //     this.mass.setStyle(styles);
        // },
        /**
         * desc: marker 删除marker标记 与 mass 互斥
         * @return {null}
         */
        remove: function () {
            this.marker && this.amap.remove([this.marker]);
        },
        /**
         * desc: mass 删除mass标记 与 marker 互斥
         * @return {null}
         */
        // remove: function () {
        //     this.mass && this.amap.remove([this.mass]);
        // },
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
        /**
         * desc: 显示高亮
         */
        showHighLight: function (position) {
            var that = this;

            !this.circle && (this.circle = new AMap.Circle({
                radius: 30,
                center: position,
                strokeColor: '#3095E5',
                fillColor: '#CADAED',
                fillOpacity: 0.5,
                strokeWeight: 1,
                zIndex: 81
            }));
            this.circle.setMap(this.amap);
            
            this.highLightInterval = setInterval(function () {
                that.circle.setCenter(this.marker.getPosition(), 100);
                // console.log('abc' + that.testImg.getBounds());
            });

            /*AMapUI.loadUI(['overlay/SvgMarker'], function(SvgMarker) {

                if (!SvgMarker.supportSvg) {
                    
                }

                var shape = new SvgMarker.Shape.Circle({
                    height: 60, 
                    fillColor: 'orange', 
                    strokeWidth: 1, 
                    strokeColor: '#666' 
                });

                var marker = new SvgMarker(
                    shape,
                    {
                        map: that.amap,
                        position: new AMap.LngLat(lng, lat)
                    }
                );
            });*/
        },
        hideHighLight: function () {
            this.circle && this.circle.hide();
            this.highLightInterval && clearInterval(this.highLightInterval);
        },
        /*
         *  移动
         */
        moveToTarget: function (lineArr) {
            // var that = this;
            // var lineArr = [];
            // var polyline = new AMap.Polyline({
            //     path: lineArr,
            //     strokeColor: '#3366ff',
            //     strokeWeight: 1,
            //     strokeStyle: 'solid',
            //     strokeOpacity: 1,
            // })
            // polyline.setMap(this.amap);
            
            this.marker.moveAlong(lineArr, 230);
            // if(this.shadow){
            //  this.shadow.moveTo(targetPoint , that.speed); 
            // }
        },
        update: function (cfg) {
        	
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            // this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
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
            var sourcePoint = new AMap.LngLat(this.lng, this.lat);
            this.lng = cfg.lng || this.lng;
            this.lat = cfg.lat || this.lat;
            var targetPoint = new AMap.LngLat(this.lng, this.lat);;
            var distance = sourcePoint.distance(targetPoint);
            this.speed = (distance / 1000 / 3) * 3600;
            // distance && this.moveTo(targetPoint);
            this.zoomLevel = cfg.zoomLevel || this.zoomLevel;
            // this.draw();

        }
    });

    return CONTAINER;
})