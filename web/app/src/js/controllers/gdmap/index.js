


'use strict';

/**
 * @ngdoc function
 * @name myappApp.controller:MonitorCtrl
 * @description
 * # HomeCtrl
 * Controller of the myappApp
 */


require(['zrender', 'controllers/gdmap/observer'], function (Zrender, McObserver, InfoPop) {
    // some code here
    //console.log('init');

    var viewWidth = 0;
    var viewHeight = 0;
    var zr, mcPortObserver, infoPop;
    //var canvas = document.createElement('canvas');
    var initView = function () {
        viewWidth = $(window).width();
        viewHeight = $(window).height();
        $('#J_monitorMain').css('height', viewHeight).css('width', viewWidth);
    }

    var initAMap = function () {
        var map = new AMap.Map('J_monitorMain', {
            resizeEnable: true,
            center: [122.03676, 29.888334],
            //center:[122.191031,29.988585], // 绘制热力图使用
            expandZoomRange: true,
            zoom: 17,
            zooms: [17, 20],
            // zooms:[16,20],
            pitch: 75
            //viewMode:'3D',

        });

        var heatmap;
        var points = [
            { 'lng': 122.191031, 'lat': 29.988585, 'count': 10 },
            { 'lng': 122.389275, 'lat': 29.925818, 'count': 11 },
            { 'lng': 122.287444, 'lat': 29.810742, 'count': 12 },
            { 'lng': 122.481707, 'lat': 29.940089, 'count': 13 },
            { 'lng': 122.410588, 'lat': 29.880172, 'count': 14 },
            { 'lng': 122.394816, 'lat': 29.91181, 'count': 15 },
            { 'lng': 122.416002, 'lat': 29.952917, 'count': 16 }
        ];
        // 绘制热力图
        /*map.plugin(['AMap.Heatmap'],function() {      //加载热力图插件
            heatmap = new AMap.Heatmap(map, {
                radius: 25, //给定半径
                opacity: [0, 0.8]
            });    //在地图对象叠加热力图
            heatmap.setDataSet({data:points,max:100}); //设置热力图数据集
            //具体参数见接口文档
        }); */

        map.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MouseTool'],
            function () {
                map.addControl(new AMap.ToolBar());

                map.addControl(new AMap.Scale());

                map.addControl(new AMap.OverView({ isOpen: true }));

                map.addControl(new AMap.MouseTool());
            });
        map.setDefaultCursor('pointer');

        // [ [[lng, lat], [lng, lat]], [[lng, lat], [lng, lat]], ........]
        var allData = [];
        function getIntersection(arr1, arr2) {
            $.each(arr1, function (idx, item) {
                console.log('------------------');
                var p1 = item[0];
                var p2 = item[1];
                var i = 0;
                $.each(arr2, function (jdx, jtem) {
                    var p3 = jtem[0];
                    var p4 = jtem[1];
                    // console.log(getPoint(p1, p2, p3, p4));
                    var gps = getPoint(p1, p2, p3, p4);
                    var obj = {
                        name: idx,
                        idx: i,
                        lng: gps.lng,
                        lat: gps.lat
                    }
                    i += 1;
                    allData.push(obj);
                })
            })
            console.log(JSON.stringify(allData));
        }

        function getPoint(p1, p2, p3, p4) {
            var k1 = (p1[1] - p2[1]) / (p1[0] - p2[0]);
            var b1 = p1[1] - k1 * p1[0];
            var k2 = (p3[1] - p4[1]) / (p3[0] - p4[0]);
            var b2 = p3[1] - k2 * p3[0];
            var x = (b2 - b1) / (k1 - k2);
            var y = k2 * x + b2;
            return { lng: x, lat: y };
            // return 'lng: ' + x + ', lat: ' + y;
        }


        var arr1 = {

            // 'W6-0': [[122.03184, 29.893689], [122.04749, 29.888814]],
            // 'W6-1': [[122.03177, 29.893541], [122.04744, 29.888699]],


            // 'W5-0': [[122.02515, 29.893838], [122.04689 , 29.887096]],
            // 'W5-1': [[122.02511 , 29.893706], [122.04685 , 29.886914]],

            // 'D9': [[122.02498 , 29.893408], [122.04674 , 29.886583]],
            // 'D8': [[122.02476 , 29.892846], [122.04650 , 29.885922]],
            // 'D7': [[122.02454 , 29.892268], [122.04632 , 29.885427]],
            // 'D6': [[122.02714 , 29.890814], [122.04615 , 29.884947]],
            // 'D5': [[122.02414 , 29.891177], [122.04597 , 29.884369]],
            // 'D4': [[122.02675 , 29.889789], [122.04576 , 29.883791]],

            // 'W4-0': [[122.02655 , 29.889261], [122.04558 , 29.883278]],
            // 'W4-1': [[122.02651 , 29.889145], [122.04553 , 29.883130]],

            // 'D3': [[122.02434 , 29.889244], [122.02938 , 29.887625]],

            // 'W3-0': [[122.02973 , 29.887476], [122.04536 , 29.882634]],
            // 'W3-1': [[122.02954 , 29.887377], [122.04531 , 29.882452]],

            // 'D2': [[122.02471 , 29.888467], [122.02912 , 29.887096]],
            // 'D1': [[122.02438 , 29.887905], [122.02885 , 29.886550]],

            // 'W2-0': [[122.03534 , 29.884650], [122.04505 , 29.881791]],
            // 'W2-1': [[122.03525 , 29.884452], [122.04501 , 29.881609]],

            'W1-0': [[122.02473, 29.887046], [122.03205, 29.884898]],
            'W1-1': [[122.02515, 29.886765], [122.03175, 29.884782]]

            // 'W7-0': [[122.02386  , 29.885657], [122.02556, 29.885154]],

            // 'W7-0': [[122.02414 , 29.885559], [122.02817 , 29.884320]],
            // 'W7-1': [[122.02427 , 29.885295], [122.02774, 29.884253]],


        }
        var arr2 = {
            // 'J1-0': [[122.02506 , 29.893607], [122.02414 , 29.891144]],
            // 'J1-1': [[122.02524 , 29.893607], [122.02427 , 29.891095]],

            // 'J2-0': [[122.02789 , 29.892681], [122.02622 , 29.888467]],
            // 'J2-1': [[122.02804 , 29.892599], [122.02607 , 29.887608]],

            // 'J3-0': [[122.03079 , 29.891210], [122.02940 , 29.887575]],
            // 'J3-1': [[122.03114 , 29.891624], [122.02901 , 29.886088]],

            // 'J4-0': [[122.03394 , 29.890202], [122.03265 , 29.886881]],
            // 'J4-1': [[122.03412 , 29.890054], [122.03260 , 29.886121]],

            'J5-0': [[122.03732, 29.889723], [122.03556, 29.885278]],
            'J5-1': [[122.03727, 29.889062], [122.03622, 29.886385]]

            // 'J6-0': [[122.04051 , 29.888715], [122.03913 , 29.885179]],
            // 'J6-1': [[122.04062 , 29.888500], [122.03911 , 29.884683]],

            // 'J7-0': [[122.04380 , 29.888170], [122.04196 , 29.883328]],
            // 'J7-1': [[122.04400 , 29.888286], [122.04205 , 29.883080]],

            // 'J8-0': [[122.04667 , 29.886897], [122.04503 , 29.882303]],
            // 'J8-1': [[122.04703 , 29.887443], [122.04518 , 29.882039]]
        }
        // getIntersection(arr1, arr2);



        /*AMapUI.loadUI(['overlay/AwesomeMarker'], function(AwesomeMarker) {

            new AwesomeMarker({

                //设置awesomeIcon
                awesomeIcon: 'arrows', //可用的icons参见： http://fontawesome.io/icons/

                //下列参数继承自父类

                //iconLabel中不能包含innerHTML属性（内部会利用awesomeIcon自动构建）
                iconLabel: {
                    style: {
                        color: '#333' //设置颜色
                    }
                },
                iconStyle: 'orange', //设置图标样式

                //基础的Marker参数
                map: map,
                position: map.getCenter()
            });
        });*/

        //canvas.height = viewHeight;
        //canvas.width = viewWidth;

        /*var customLayer = new AMap.CustomLayer(canvas, {
            zooms: [-3, 22],
            zIndex: 1000
        });
        customLayer.setMap(map);*/

        //map.addControl(new AMap.ToolBar({liteStyle:true}));
        if (!mcPortObserver) {
            mcPortObserver = McObserver({
                'map': map,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom': 'J_monitorMain'
                //'is25d': true,
            });
        }
        mcPortObserver.startMonitor();
        //mcPortObserver.stopMonitor();

        map.on('click', function () {
            mcPortObserver.hidePop();
        })
    }

    // var initBaseMap = function() {
    //     if (!zr) {
    //         var dom = canvas;
    //         zr = Zrender.init(dom);
    //     }
    //     if (!mcPortObserver) {
    //         var observer = McObserver({
    //             'zr': zr,
    //             'viewHeight': viewHeight,
    //             'viewWidth': viewWidth,
    //             'mainDom': 'J_monitorMain',
    //         });
    //         mcPortObserver = observer;
    //     }
    //     // if( !infoPop ){
    //     //     var iPop = InfoPop({
    //     //         'zr':zr,
    //     //         'viewHeight': viewHeight,
    //     //         'viewWidth': viewWidth,
    //     //         'mainDom':'J_monitorMain',
    //     //         'observer': mcPortObserver,
    //     //     });
    //     //     infoPop = iPop;
    //     // }

    //     mcPortObserver.showMonitorMap();
    //     // mcPortObserver.showThermodynamicMap();

    // }

    /*var initBaseMap = function(){
        if( !zr ){
            var dom = document.getElementById('J_monitorMain');
            zr = Zrender.init( dom );
        }
        if( !mcPortObserver ){
            var observer = McObserver({
                'zr':zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom':'J_monitorMain',
            });
            mcPortObserver = observer;
        }
        if( !infoPop ){
            var iPop = InfoPop({
                'zr':zr,
                'viewHeight': viewHeight,
                'viewWidth': viewWidth,
                'mainDom':'J_monitorMain',
                'observer': mcPortObserver,
            });
            infoPop = iPop;
        }

        mcPortObserver.showMonitorMap();
        mcPortObserver.showThermodynamicMap();

    }*/

    /*var bindEvent = function(){
        $(window).on('resize', function(ev){
            initView();
            zr && zr.resize();
        })

    }*/

    var init = function () {
        initView();  // 初始化页面可视部分的外观
        initAMap();
        // initBaseMap(); // 初始化画布、主控器、地图底图
        //bindEvent();

    };

    init();

});
