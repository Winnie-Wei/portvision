/**
 * @module port/gdBerth
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcGdBase');


    var BERTH = function (cfg) {
        if (!(this instanceof BERTH)) {
            return new BERTH().init(cfg);
        }
    };

    // function change(lng, lat) {
    //     return {
    //         'lng': parseFloat(lng) + 0.0044,
    //         'lat': lat - 0.0019
    //     };
    // }

    BERTH.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function (cfg) {
            this.amap = cfg.map;
            this.mapType = cfg.mapType;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
            this.observer = cfg.observer;
            this.berthPoints = cfg.berthPoints;
            this.vertices = cfg.vertices;
            this.fillColor = cfg.fillColor || 'transparent'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#ead6b3'; // 边框颜色
            this.strokeStyle = cfg.strokeStyle || 'dashed';
            this.labelTitle = cfg.text;
            this.rotation = cfg.rotation;
            // var event = this;
            this.zoom = this.amap.getZoom();
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
        /*
        *  绘制到地图
        */
        draw: function () {
            // var that = this;
            if (this.labelTitle && this.berthPoints) {
                this.getPos();
                this.Marker = new AMap.Marker({
                    position: new AMap.LngLat(this.lng, this.lat),
                    content: this.labelTitle,
                    zIndex: 100,
                    // angle: -this.rotation / Math.PI * 180,
                    offset: { x: 0, y: -8 },
                    map: this.amap,
                    bubble: this.bubble
                })
                return;
            }
            //this.marker.hide();
            var path = [];
            $.each(this.vertices, function (idx, item) {
                path.push(_.toArray(item));
            })
            this.polygon = new AMap.Polygon({
                path: path,
                strokeColor: this.strokeColor,
                strokeWeight: 2,
                fillColor: this.fillColor,
                strokeStyle: this.strokeStyle,
                strokeDasharray: [10, 10],
                bubble: this.bubble,
                cursor: this.cursor
            });
            this.polygon.setMap(this.amap);
        },
        // 海岸线标尺位置
        getPos: function () {
            var that = this;
            var point = this.berthPoints[0]['POINT'];
            that.lng = ~~this.labelTitle / 2030 * (point[1].lng - point[0].lng) + point[0].lng;
            that.lat = ~~this.labelTitle / 2030 * (point[1].lat - point[0].lat) + point[0].lat;
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
            this.amap = cfg.map || this.map;
            this.bubble = cfg.bubble || this.bubble;
            this.mapType = cfg.mapType || this.mapType;
            this.zlevel = cfg.zlevel || this.zlevel;
            this.berthPoints = cfg.berthPoints || this.berthPoints;
            this.observer = cfg.observer || this.observer;
            this.vertices = cfg.vertices || this.vertices;
            this.fillColor = cfg.fillColor || this.fillColor; // 底色
            this.textColor = cfg.textColor || this.textColor; // 文字颜色
            this.strokeColor = cfg.strokeColor || this.strokeColor; // 边框颜色
            this.strokeStyle = cfg.strokeStyle || this.strokeStyle;
            this.labelTitle = cfg.text || this.text;
            this.rotation = cfg.rotation || this.rotation;
        }
    });

    return BERTH;
})