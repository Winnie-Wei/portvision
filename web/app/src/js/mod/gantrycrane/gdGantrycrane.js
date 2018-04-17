/**
 * @module port/gdGantrycrane
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcGdBase');
    

    var GANTRYCRANE = function(cfg) {
        if (!(this instanceof GANTRYCRANE)) {
            return new GANTRYCRANE().init(cfg);
        }
    };
    
    function change(lng, lat){
        return [parseFloat(lng) + 0.0044, parseFloat(lat) - 0.0019];
    }

    GANTRYCRANE.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function(cfg) {			
            this.amap = cfg.map;
            this.is25d = cfg.is25d;
            this.mapType = cfg.mapType;
            this.bubble = cfg.bubble || false;
            this.containerData = cfg.containerData;
            this._zr = cfg.zr;
            this.zlevel = cfg.zlevel;
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
            //this.rotation = cfg.rotation || 0;
            this.boxColor = cfg.boxColor || '#33AF19';
            this.deviceType = 'gantrycrane';
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

            // this.imageUrl = this.getImageUrl(this.workStatus);
            
            this.width = 14;
            this.height = 28;
            // this.zoom = this.amap.getZoom();

            this.datas = cfg.datas;
            this.draw();
            
            
            /*AMap.event.addListener(this.amap,'zoomend',function(){
                 var zoom = event.zoom - cfg.map.getZoom();
                 event.width = zoom > 0 ? event.width / (2 * zoom) :event.width * (2 * (-zoom));
                 event.height = zoom > 0 ? event.height / (2 * zoom) :event.height * (2 * (-zoom));
                 $('.amap-icon img').css('width',event.width);
                 $('.amap-icon img').css('height',event.height);
                 event.zoom = cfg.map.getZoom();
             });*/
            return this;
        },
        /**
         * desc: 使用marker绘制龙门吊
         */
        draw: function(){   
            var that = this;
            // var imageUrl = this.getImageUrl(this.workStatus);
            if(this.marker){
                this.amap.remove([this.marker]);
            }

            this.icon = new AMap.Icon({
                image : this.getImageUrl(this.workStatus),
                size : new AMap.Size(this.width * this.scaleLevel,this.height * this.scaleLevel),
                imageSize : new AMap.Size(this.width * this.scaleLevel,this.height * this.scaleLevel)
            });
            
            if( this.marker ){
                this.remove();
            }
            this.marker = new AMap.Marker({
                icon: this.icon,
                position: [this.lng,this.lat],
                offset: new AMap.Pixel(-12,-12),
                angle: 20,
                autoRotation: true,
                zIndex: 101,
                bubble: true,
                map: this.amap,
                bubble: false,
            }).on('click', function(ev){
                var pixel = that.amap.lnglatTocontainer([that.lng, that.lat]);
                that.drawX = pixel.getX();
                that.drawY = pixel.getY();
                var obj = $.extend({}, that);
                that.observer._overMap.hideSelectedEquipment();
                that.isSelected = true;
                // that.showHighLight();
                that.observer.showProfilePop(obj);
            });
            // ====== 分割线 ======
            // this.gantryImgCenter = new AMap.LngLat(this.lng, this.lat);
            // var containerImgUrl = this.getImageUrl(this.workStatus), // '../../src/js/mod/container/images/max/outCar/abc.png',
            //     southWest = new AMap.LngLat(this.gantryImgCenter.lng - 0.00011, this.gantryImgCenter.lat - 0.00005),
            //     northEast = new AMap.LngLat(this.gantryImgCenter.lng + 0.00011, this.gantryImgCenter.lat + 0.00005),
            //     bounds = new AMap.Bounds(southWest, northEast),
            //     groundImageOpts = {
            //         map: this.amap,
            //         clickable: true,
            //         opacity: 1,
            //         zIndex: 101
            //     };
            // this.gantryImg = new AMap.GroundImage( containerImgUrl, bounds, groundImageOpts );
            // this.gantryImg.on('click', function (ev) {
            //     var pixel = that.amap.lnglatTocontainer(new AMap.LngLat(that.lng, that.lat));
            //     that.drawX = pixel.getX();
            //     that.drawY = pixel.getY();
            //     var obj = $.extend({}, that);
            //     that.observer._overMap.hideSelectedEquipment();
            //     that.isSelected = true;
            //     // that.showHighLight(gantryImgCenter);
            //     that.observer.showProfilePop(obj);
            // });
            
        },

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
        //             'size': new AMap.Size(11, 11),
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
         * desc: canvas绘制
         * @return {null}
         */
        // draw: function(){
        //     this.canvas = document.createElement('canvas');
        //     this.canvas.width = this.amap.getSize().width;
        //     this.canvas.height = this.amap.getSize().height;
        //     this.customLayer = new AMap.CustomLayer(this.canvas, {
        //                 zooms: [-3, 22],
        //                 zIndex: 1000
        //             });
        //     this.customLayer.setMap(this.amap);
        //     this.onRender();
        //     // customLayer.render = this.onRender;
        // },
        onRender: function(){
            var that = this;
            var ctx = that.canvas.getContext('2d');
            $.each(this.datas, function(idx, item){
                var pixel = that.amap.lnglatTocontainer(change(item.GPS_LONGITUDE, item.GPS_LATITUDE));
                var image = new Image();
                image.src = that.getImageUrl(item.STA_WORK_STATUS);
                image.onload = function(){
                    ctx.save();
                    ctx.translate(pixel.getX(), pixel.getY());
                    ctx.rotate(20 * Math.PI / 180);
                    ctx.drawImage(image, -0, -0);
                    ctx.restore(); 
                }
                
            })
        },
        /*
         *  响应缩放
         */
        onZoomEnd: function (scaleLevel) {
            // this.imageUrl = this.getImageUrl(this.workStatus);
            //console.log( scaleLevel );
            this.scaleLevel = scaleLevel;
            // this.icon.setImageSize( this.width,this.height ); // 重设Size会延迟 出现图标变形的状况
            this.draw(); // 重绘性能消耗大
            // var styles = [], that = this;
            // $.each(this.datas, function(idx, item){
            //     styles.push({
            //         'url': that.getImageUrl(item.STA_WORK_STATUS),
            //         'anchor': new AMap.Pixel(6, 6),
            //         'size': new AMap.Size(11 * scaleLevel, 11 * scaleLevel),
            //     })
            // })
            // this.mass.setStyle(styles);
        },

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

        /*
         *  删除
         */
        remove:function(){        	
            this.marker && this.amap.remove([this.marker]);
        },

        // remove:function(){          
        //     this.mass && this.amap.remove([this.mass]);
        // },

        // remove:function(){          
        //     this.customLayer && this.amap.remove([this.customLayer]);
        // },
        /*
         *  显示
        */
        show: function(){
            this.marker.show();
        },
        /*
         *  隐藏
        */
        hide: function(){
            this.marker.hide();
        },
        /*
         *  移动
        */
        moveTo: function( targetPoint ){
            var that = this;        
            this.marker.moveTo(targetPoint , that.speed); 
        },
        update: function(cfg) {	        	
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            // this.scaleLevel = cfg.scaleLevel || this.scaleLevel;
            this.bubble = cfg.bubble || this.bubble;
            this.isShow = cfg.isShow === true ? true : this.isShow;
            this.isSelected = cfg.isSelected === true ? true : this.isSelected;
            this.isShowQuota = cfg.isShowQuota === true ? true : this.isShowQuota;
            this.isShowDeviceJobType = cfg.isShowDeviceJobType === true ? true : this.isShowDeviceJobType;
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
            
            this.lng = cfg.lng;
            this.lat = cfg.lat;
            var targetPoint = [this.lng, this.lat];
            // this.moveTo( targetPoint);
        },
        /*
         * 根据状态获得相应的图片路径   
         */
        getImageUrl: function (workStatus) {
            var imageUrl;
            //判断图层
            var scaleRatioFolder = 'min';
            if (this.scaleRatio < 2 /*this.maxShowScale*/ ) {
                scaleRatioFolder = 'min';
                this.imagePoint = {
                    x: 7,
                    y: 11
                };
            } else {
                scaleRatioFolder = 'max';
                this.imagePoint = {
                    x: 7,
                    y: 14
                };
            }
            //判断状态（工作中、维修、故障）
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
            // imageUrl = '../../src/js/mod/gantrycrane/images/' + scaleRatioFolder + '/icon-' + iconType + '.png';
            imageUrl = '../../src/js/mod/gantrycrane/images/' + 'max' + '/icon-' + iconType + '.png';
            if( this.is25d ){
                this.imagePoint = {
                    x: 7,
                    y: 20
                };
                imageUrl = '../../src/js/mod/gantrycrane/images/25d/icon-active.png';
            }
            return imageUrl;
        },
    
    });
    
    return GANTRYCRANE;
})