


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
        /*map.plugin(["AMap.Heatmap"],function() {      //加载热力图插件
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

            'W6-0': [[122.034813, 29.891694], [122.051796, 29.886650]],
            'W6-1': [[122.034770, 29.891538], [122.051834, 29.886506]],


            'W5-0': [[122.030285, 29.891487], [122.051067, 29.885115]],
            'W5-1': [[122.029963, 29.891431], [122.050981, 29.884920]],

            'D9': [[122.029650, 29.891375], [122.050817, 29.884724]],
            'D8': [[122.028919, 29.891029], [122.050872, 29.884034]],
            'D7': [[122.028444, 29.890503], [122.050674, 29.883522]],
            'D6': [[122.031573, 29.888901], [122.050534, 29.883015]],
            'D5': [[122.028428, 29.889262], [122.050304, 29.882480]],
            'D4': [[122.031149, 29.887897], [122.050139, 29.881915]],

            'W4-0': [[122.028127, 29.888271], [122.049844, 29.881395]],
            'W4-1': [[122.028080, 29.888162], [122.049806, 29.881292]],

            // 'D3': [[122.027952, 29.887590], [122.033949, 29.885674]],

            'W3-0': [[122.034164, 29.885581], [122.049849, 29.880706]],
            'W3-1': [[122.034110, 29.885450], [122.049806, 29.880548]],

            // 'D2': [[122.027866, 29.886957], [122.033734, 29.885088]],
            // 'D1': [[122.027694, 29.886362], [122.033445, 29.884539]],

            'W2-0': [[122.040215, 29.882632], [122.049313, 29.879943]],
            'W2-1': [[122.040118, 29.882418], [122.049248, 29.879748]],

            // 'W1-0': [[122.027522, 29.885655], [122.040193, 29.881869]],
            // 'W1-1': [[122.027458, 29.885515], [122.040118, 29.881711]],


            // 'W7-0': [[122.027083, 29.884111], [122.033016, 29.882297]],
            // 'W7-1': [[122.027018, 29.883934], [122.032941, 29.882129]],


        }
        var arr2 = {
            // 'J1-0': [[122.029379, 29.891366], [122.027126, 29.885469]],
            // 'J1-1': [[122.029518, 29.891338], [122.027276, 29.885441]],

            // 'J2-0': [[122.032383, 29.890920], [122.029969, 29.884799]],
            // 'J2-1': [[122.032533, 29.890873], [122.030108, 29.884678]],

            // 'J3-0': [[122.035944, 29.890985], [122.032524, 29.882198]],
            // 'J3-1': [[122.036051, 29.890947], [122.032674, 29.882166]],

            // 'J4-0': [[122.039158, 29.890052], [122.035823, 29.881718]],
            // 'J4-1': [[122.039258, 29.890021], [122.035972, 29.881683]],

            'J5-0': [[122.042299, 29.889134], [122.039427, 29.881938]],
            'J5-1': [[122.042401, 29.889098], [122.039587, 29.881910]],

            'J6-0': [[122.045450, 29.888236], [122.042833, 29.881483]],
            'J6-1': [[122.045633, 29.888171], [122.042993, 29.881390]],

            'J7-0': [[122.048583, 29.887343], [122.045987, 29.880441]],
            'J7-1': [[122.048733, 29.887297], [122.046169, 29.880367]],

            'J8-0': [[122.051609, 29.886446], [122.049109, 29.879385]],
            'J8-1': [[122.051748, 29.886381], [122.049302, 29.879320]]
        }
        // getIntersection(arr2, arr1);



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

    /*var initBaseMap = function(){
        if( !zr ){
            var dom = document.getElementById("J_monitorMain");
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
        //initBaseMap(); // 初始化画布、主控器、地图底图     
        //bindEvent();

    };

    init();

});
