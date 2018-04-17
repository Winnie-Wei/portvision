'use strict';
/**
 * @ngdoc function
 * @name myappApp.controller:RecordCtrl
 * @description
 * # RecordCtrl
 * Controller of the myappApp
 */
//console.log('init');

require(['zrender', 'controllers/record/observer', 'controllers/record/recordPop'], function (Zrender, McObserver, recordPopLayerServer) {
    // some code here
    var viewWidth = 0;
    var viewHeight = 0;
    var zr, mcRecordObserver, mcRecordPopLayer;
    var initView = function () {
        viewWidth = $(window).width();
        viewHeight = $(window).height();
        $('#main').css('height', viewHeight).css('width', viewWidth);
    }

    var initBaseMap = function () {
        if (!zr) {
            var dom = document.getElementById('main');
            zr = Zrender.init(dom);
        }
        if (!mcRecordObserver) {
            var observer = McObserver({
                'zr': zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth
                //'mainDom':'#main',
            });
            mcRecordObserver = observer;
        }

        // if( !mcRecordPopLayer ){
        //     var PopLayer = recordPopLayerServer({
        //         'zr':zr,
        //         'viewHeight': viewHeight,
        //         'viewWidth': viewWidth,
        //         'observer': mcRecordObserver
        //     });
        //     mcRecordPopLayer = PopLayer;
        // }

        mcRecordObserver.showMonitorMap();
        mcRecordObserver.pausePlayback(); // 初始化时先暂停播放
        //mcRecordObserver.showThermodynamicMap();
    }

    var getSettings = function () {
        var date = new Date();
        showYear = date.getFullYear(); // 显示年
        showMonth = date.getMonth() + 1; // 显示月
        showDay = date.getDate(); // 开始回放的日期
        showStartTime = '08:00'; // 开始回放的时间		 
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

