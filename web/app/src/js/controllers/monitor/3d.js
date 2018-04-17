'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MonitorCtrl  
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */


require(['zrender', 'controllers/monitor/observer3d'], function (Zrender, McObserver) {
    // some code here
    //console.log('init');

    var viewWidth = 0;
    var viewHeight = 0;
    var mcPortObserver;
    var initView = function () {
        viewWidth = $(window).width();
        viewHeight = $(window).height();
        $('#J_monitorMain').css('height', viewHeight).css('width', viewWidth);
    }

    var initBaseMap = function () {

        if (!mcPortObserver) {
            var observer = McObserver({
                //'zr':zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom': 'J_monitorMain'
            });
            mcPortObserver = observer;
        }


        mcPortObserver.startMonitor();
    }

    var bindEvent = function () {
        $(window).on('resize', function () {
            initView();

        })

    }

    var init = function () {
        initView();  // 初始化页面可视部分的外观
        initBaseMap(); // 初始化画布、主控器、地图底图     
        bindEvent();

    };

    init();

});