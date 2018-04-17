'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MonitorCtrl  
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */


require(['zrender', 'controllers/bdmap/observer'], function (Zrender, McObserver) {　　 // some code here 'zrender/graphic/shape/Circle','zrender/container/Group
    //console.log('init');
    var viewWidth = 0;
    var viewHeight = 0;
    var zr, mcPortObserver, CircleShape, infoPop;
    var domOverlay = document.createElement('div');
    var initView = function () {
        viewWidth = $(window).width();
        viewHeight = $(window).height();
        domOverlay.style.width = viewWidth + 'px';
        domOverlay.style.height = viewHeight + 'px';
        $(domOverlay).css('height', viewHeight).css('width', viewWidth);
        $('#J_monitorMain').css('height', viewHeight).css('width', viewWidth);
    }


    var initBaseMap = function () {
        if (!zr) {
            var dom = domOverlay;
            zr = Zrender.init(dom);
        }
        if (!mcPortObserver) {
            var observer = McObserver({
                'zr': zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom': 'J_monitorMain'
            });
            mcPortObserver = observer;
        }
        // if( !infoPop ){
        //     var iPop = InfoPop({
        //         'zr':zr,
        //         'viewHeight': viewHeight,
        //         'viewWidth': viewWidth,
        //         'mainDom':'J_monitorMain',
        //         'observer': mcPortObserver,
        //     });
        //     infoPop = iPop;
        // }  

        mcPortObserver.showMonitorMap();
        // mcPortObserver.showThermodynamicMap();

    }

    var bindEvent = function () {
        $(window).on('resize', function () {
            initView();
            zr && zr.resize();
        })

    }

    function canvasOverlay(center, color) {
        this._color = color;
        this._center = center;
    }
    canvasOverlay.prototype = new BMap.Overlay();
    canvasOverlay.prototype.initialize = function (map) {
        this._map = map;
        if (!zr) {
            var dom = this._dom = domOverlay;
            dom.setAttribute('id', 'J_domOverlay');
            dom.style.width = viewWidth;
            dom.style.height = viewHeight;
        }

        dom.style.position = 'absolute';
        map.getPanes().markerPane.appendChild(dom);
        // 监听bdmap缩放，响应事件
        map.addEventListener('zoomend', function () {
            // var currentBdMapScaleLevel = map.getZoom();

            //var BaseMapScaleLevel = "1.5";
            //mcPortObserver._baseMap.observer.notice('_baseMap', 'zoomChange', BaseMapScaleLevel); //?
        })
        return dom;
    }
    canvasOverlay.prototype.adjustSize = function () {
        var size = this._map.getSize();
        var canvas = this._canvas;
        var pixelRatio;

        if (this.context === 'webgl') {
            pixelRatio = 1;
        } else {
            pixelRatio = (function (context) {
                var backingStore = context.backingStorePixelRatio ||
                    context.webkitBackingStorePixelRatio ||
                    context.mozBackingStorePixelRatio ||
                    context.msBackingStorePixelRatio ||
                    context.oBackingStorePixelRatio ||
                    context.backingStorePixelRatio || 1;
                return (window.devicePixelRatio || 1) / backingStore;
            }(canvas.getContext('2d')));
        }

        canvas.width = size.width * pixelRatio;
        canvas.height = size.height * pixelRatio;
        canvas.style.width = size.width + 'px';
        canvas.style.height = size.height + 'px';
    };
    canvasOverlay.prototype.draw = function () {
        var position = this._map.pointToOverlayPixel(this._center);

        this._dom.style.left = position.x - viewWidth / 2 - 50 + 'px';
        this._dom.style.top = position.y - viewHeight / 2 + 100 + 'px';
    }

    function initMap() {
        var map = new BMap.Map('J_monitorMain');
        var point = new BMap.Point(122.04686, 29.893934);
        map.centerAndZoom(point, 17);
        map.enableScrollWheelZoom(true);

        var myCanvas = new canvasOverlay(map.getCenter(), 'red');
        map.addOverlay(myCanvas);
    }

    function init() {
        initView(); // 初始化页面可视部分的外观
        initMap();
        initBaseMap(); // 初始化画布、主控器、地图底图     
        bindEvent();
    };

    init();

});