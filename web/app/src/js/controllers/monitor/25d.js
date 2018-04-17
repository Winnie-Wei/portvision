'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MonitorCtrl  
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */


require(['zrender', 'controllers/monitor/observer', 'layer/mapPop'], function (Zrender, McObserver, InfoPop) {
    // some code here
    //console.log('init');

    var viewWidth = 0;
    var viewHeight = 0;
    var zr, mcPortObserver, infoPop;
    var initView = function () {
        viewWidth = $(window).width() * 1.5;
        viewHeight = $(window).height() * 1.5;
        $('#J_monitorMain').css('height', viewHeight).css('width', viewWidth);
    }

    var initBaseMap = function () {
        if (!zr) {
            var dom = document.getElementById('J_monitorMain');
            zr = Zrender.init(dom);
        }
        if (!mcPortObserver) {
            var observer = McObserver({
                'zr': zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom': 'J_monitorMain',
                'scaleLevel': 1,
                'maxScaleLevel': 2,
                'minScaleLevel': 1,
                'initX': -35,
                'initY': -84,
                'is25d': true
            });
            mcPortObserver = observer;
        }


        mcPortObserver.showMonitorMap();

    }

    var bindEvent = function () {
        $(window).on('resize', function () {
            initView();
            zr && zr.resize();
        })

    }

    var init = function () {
        initView();  // 初始化页面可视部分的外观
        initBaseMap(); // 初始化画布、主控器、地图底图     
        bindEvent();

    };

    init();

});
