/**
 * @moudle mod/biGraphy/biGraphy bi图表
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');
    var PieChart = require('mod/chart/PieChart');
    var GaugeChart = require('mod/chart/GaugeChart');
    var mTable = require('mod/chart/mc_table');
    var BarChart = require('mod/chart/BarChart');
    var XbarChart = require('mod/chart/XbarChart');

    // 图表概况
    var biGraphyOverviewTemplate =
        '<div class="mc-bigraphy-panel">' +
            '<div class="panel-title">' +
                '<ul class="nav nav-tabs">' +
                    '<li date-id="0" role="presentation" class="active"><a href="javascript:void(0)">今日</a></li>' +
                    '<li date-id="1" role="presentation"><a href="javascript:void(0)">本周</a></li>' +
                    '<li date-id="2" role="presentation"><a href="javascript:void(0)">本月</a></li>' +
                    '<li date-id="3" role="presentation"><a href="javascript:void(0)">本年</a></li>' +
                '</ul>' +
                '<span class="j-close">关闭</span>' +
            '</div>' +
            '<div class="panel panel-default">' +
                '<div class="panel-body">' +
                    '<div class="col-md-12 port-indicator">' +
                        '<div class="col-md-6">' +
                            '<div class="indicator-item container-throughput clearfix">' +
                                '<span class="pull-left">集装箱吞吐量(TEU)</span>' +
                                '<span class="pull-right"></span>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-6">' +
                            '<div class="indicator-item yard-statistical clearfix">' +
                                '<div class="indicator-cell real-time-statistical clearfix">' +
                                    '<span class="pull-left">实时堆存箱量 (TEU)</span>' +
                                    '<span class="pull-right"></span>' +
                                '</div>' +
                                '<div class="indicator-cell gantrycrane-efficiency">' +
                                    '<span class="pull-left">龙门吊平均作业效率（MPH）</span>' +
                                    '<span class="pull-right"></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-6">' +
                            '<div class="indicator-item shore-statistical clearfix">' +
                                '<div class="indicator-cell shore-cumulative clearfix">' +
                                    '<span class="pull-left">累计岸边作业量(Unit)</span>' +
                                    '<span class="pull-right"></span>' +
                                '</div>' +
                                '<div class="mc-efficiency-progress clearfix">' +
                                    '<div class="indicator-cell single-bridge">' +
                                        '<span class="pull-left">单桥平均作业效率(MPH)</span>' +
                                        '<span class="pull-right"></span>' +
                                    '</div>' +
                                    '<div class="indicator-cell single-boat">' +
                                        '<span class="pull-left">单船平均作业效率(MPH)</span>' +
                                        '<span class="pull-right"></span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col-md-6">' +
                            '<div class="indicator-item gate-statistical clearfix">' +
                                '<div class="indicator-cell clearfix">' +
                                    '<span class="pull-left">累计闸口作业量 (Unit)</span>' +
                                    '<span class="gate-work-val pull-right"></span>' +
                                '</div>' +
                                '<div class="indicator-cell clearfix">' +
                                    '<span class="pull-left">外拖平均在场时间 (MIN)</span>' +
                                    '<span class="out-truck-val pull-right"></span>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var biGraphyWrapperBtnTemp =
        '<div class="biTodayDataWraper mc-bigraphy-panel j-biTodayDataWraper j-biGraphyWrapperBtn">' +
            '<div id="J_biTodayData" class="biTodayData">' +
                '<ul>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">集装箱吞吐量(TEU)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">实时堆存箱量(TEU)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">龙门吊平均作业效率(MPH)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">累计岸边作业量(Unit)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">单桥平均作业效率(MPH)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">单船平均作业效率(MPH)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">累计闸口作业量(Unit)</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                    '<li class="clearfix">' +
                        '<span class="pull-left">外拖平均在场时间(MIN）</span>' +
                        '<span class="pull-right"></span>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>';

    var biGraphyModalTemplate =
        '<div class="masker"></div>' +
        '<div class="j-biGraphyModal">' +
            '<div class="panel panel-default">' +
                '<div class="panel-heading">' +
                    '<h3 class="panel-title">标题</h3>' +
                    '<span class="j-close">关闭</span>' +
                '</div>' +
                '<div class="panel-body">' +
                    'content' +
                '</div>' +
            '</div>' +
        '</div>';
    var yardThroughputTemp =
        '<div class="yard-throughput-body hpheight">' +
            '<div class="col-md-6 hpheight">' +
                '<h3 class="mc-chart-title throughput-title">本月吞吐量(完成率)</h3>' +
                '<div id="J_gaugeChart"></div>' +
                '<div id="J_plan"></div>' +
            '</div>' +
            '<div class="col-md-6">' +
                '<h3 class="mc-chart-title compose-title">本月吞吐量组成</h3>' +
                '<div id="J_throughput_chart"></div>' +
            '</div>' +
        '</div>';
    var yardYearThroughputTemp =
        '<div class="yard-throughput-body hpheight">' +
            '<div class="col-md-12 hpheight">' +
                '<div id="J_plan"></div>' +
                '<div class="hpheight">' +
                    '<h3 class="mc-chart-title compose-title">本年吞吐量组成</h3>' +
                    '<div id="J_throughput_chart"></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var gateWorkingTemp =
        '<div class="gate-working-body hpheight">' +
            '<div class="col-md-12" id="J_GateTable"></div>' +
            '<div class="col-md-6">' +
                '<h3 class="mc-chart-title chart-title-top">不同时间段进箱作业占比</h3>' +
                '<div id="J_GateinChart"></div>' +
            '</div>' +
            '<div class="col-md-6">' +
                '<h3 class="mc-chart-title chart-title-top">不同时间段提箱作业占比</h3>' +
                '<div id="J_GateoutChart"></div>' +
            '</div>' +
        '</div>';
    var shoreWorkingTemp =
        '<div class="shore-working-body hpheight">' +
            '<div class="col-md-8">' +
                '<h3 class="mc-chart-title">岸边作业量明细</h3>' +
                '<div id="J_ShoreTable"></div>' +
            '</div>' +
            '<div class="col-md-4">' +
                '<h3 class="mc-chart-title">岸边各作业类型占比</h3>' +
                '<div id="J_ShoreChart" class="j-shoreChart"></div>' +
            '</div>' +
            '<div class="col-md-12">' +
                '<div class="text-center chart-title-top">' +
                    '<div class="btn-group" role="group" aria-label="...">' +
                        '<button type="button" class="btn btn-default btn-primary">单桥平均效率</button>' +
                        '<button type="button" class="btn btn-default">单船平均效率</button>' +
                    '</div>' +
                '</div>' +
                '<div id="J_ShoreBar"></div>' +
            '</div>' +
        '</div>';
    var yardWorkingTemp =
        '<div class="yard-working-body hpheight">' +
            '<div class="col-md-12">' +
                '<h3 class="mc-chart-title pull-left">堆存量明细</h3>' +
                '<div id="J_YardSelect0" class="select"></div>' +
                '<h3 class="mc-chart-title pull-right">堆场利用率TOP10</h3>' +
            '</div>' +
            '<div class="col-md-8">' +
                '<div id="J_YardTable"></div>' +
            '</div>' +
            '<div class="col-md-4">' +
                '<div id="J_YardXBar" class="clearfix"></div>' +
            '</div>' +
            '<div class="col-md-12">' +
                '<h3 class="mc-chart-title pull-left chart-title-top">机械效率</h3>' +
                '<div id="J_YardSelect1" class="select"></div>' +
                '<div id="J_YardBar" class="clearfix"></div>' +
            '</div>' +
        '</div>';

    var BIGRAPHY = function(cfg) {
        if (!(this instanceof BIGRAPHY)) {
            return new BIGRAPHY().init(cfg);
        }
    };

    BIGRAPHY.prototype = $.extend(new McBase, {
        init: function(cfg) {
            this.wraper = $('#J_biGraphy');
            if (!this.wraper || !this.wraper.length) {
                return false;
            }
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.timeOption = 0;
            this.timeOptionStr = 'DAY';
            this.data = {
                yard: {},
                shore: {},
                gate: {},
                throughput: {}
            };
            // if( !this._popLayer ){
            //     this._popLayer =  PopLayer({
            //         'zr':this._zr,
            //         'observer': this._observer,
            //         'scale':this.showScale,
            //     });
            // };
            this.bindEvent();
            return this;
        },
        bindEvent: function() {
            var that = this;
            // $(document).off('click', '.report-item')
            // .on('click', '.report-item', function( ev ) {
            //     if ($('.mc-bigraphy-panel').hasClass('active')) {
            //         $('.mc-bigraphy-panel').removeClass('active');
            //     } else {
            //         $('.mc-bigraphy-panel').addClass('active');
            //     }
            // });
            this.wraper.off()
                .on('click', '.j-biGraphyWrapperBtn', function() {
                    that._observer.hidePop();
                    var wraper = jsrender.templates(biGraphyOverviewTemplate).render();
                    // var wraper = jsrender.templates( biGraphyOverviewTemplate ).render();
                    $('#J_biGraphy').html(wraper);
                    // TODO: 加请稍候效果
                    that.showGetIntroDataLoading();
                    $('.mc-bigraphy-panel li:first-child').trigger('click');
                    that._observer.getIntroData(that.timeOptionStr);
                })
                // .on('click', '.j-biTodayDataWraper', function(){
                //     that.render();
                // })
                .on('click', 'li', function(ev) {
                    $('#J_biGraphy li').removeClass('active');
                    var currOption = $(ev.currentTarget);
                    currOption.addClass('active');
                    that.timeOption = parseInt(currOption.attr('date-id'));
                    that.timeOptionSelect();
                    that._observer.getIntroData(that.timeOptionStr);
                })
                .on('click', '.indicator-item', function(ev) {
                    $('.indicator-item').removeClass('active');
                    $(ev.currentTarget).addClass('active');
                })
                .on('click', '.mc-bigraphy-panel .j-close', function() {
                    that.render();
                })
                .on('click', '.container-throughput', function() {
                    // that.hidePop();
                    that._observer.hidePop();
                    that.timeOptionSelect();
                    that._observer._popLayer._biGraphyCenterPop.show();
                    var url = '/data/throughput/detail',
                        method = 'GET',
                        params = { 'time': that.timeOptionStr },
                        fnSuccess = that.renderThroughput;
                    that.postData(url, method, params, fnSuccess);
                })
                .on('click', '.yard-statistical', function() {
                    that._observer.hidePop();
                    that._observer._popLayer._biGraphyCenterPop.show();
                    var url = '/data/storageCtn/detail',
                        method = 'GET',
                        params = { 'time': that.timeOptionStr },
                        fnSuccess = that.renderYardWorking;
                    that.postData(url, method, params, fnSuccess);
                })
                .on('click', '.shore-statistical', function() {
                    that._observer.hidePop();
                    that.timeOptionSelect();
                    that._observer._popLayer._biGraphyCenterPop.show();
                    // that.renderShoreWorking();        // 注意：现在是静态数据，接口没数据，回调函数没执行？
                    var url = '/data/vesselJob/detail',
                        method = 'GET',
                        params = { 'time': that.timeOptionStr },
                        fnSuccess = that.renderShoreWorking;
                    that.postData(url, method, params, fnSuccess);
                })
                .on('click', '.gate-statistical', function() {
                    that._observer.hidePop();
                    that.timeOptionSelect();
                    that._observer._popLayer._biGraphyCenterPop.show();
                    var url = '/data/gateJob/detail',
                        method = 'GET',
                        params = { 'time': that.timeOptionStr },
                        fnSuccess = that.renderGateWorking;
                    that.postData(url, method, params, fnSuccess);
                });
            // bi图表弹框
            $(document)
                // 堆场图表下拉框
                .on('change', '#J_YardSelect0 select', function() {
                    // $('#J_YardXBar').css('height', $('#J_YardTable').parent().height()+'px');
                    console.log(that.data);
                    var xbarChart = new XbarChart();
                    xbarChart.init({
                        dom: document.getElementById('J_YardXBar'),
                        option: {
                            grid: {
                                left: '3%',
                                right: '5%',
                                bottom: '2%',
                                top: '0%',
                                containLabel: true
                            }
                        },
                        data: that.data.yard.xbarData[$(this).val()]
                    });

                    // 堆场表格
                    var myTableOne = new mTable();
                    var myOption = {
                        'data': {
                            'title': ['堆场名称', '堆存量', '堆存利用率'],
                            isFirstColHead: true, // 第一列是否作为头部(有颜色填充)
                            overScroll: 145,
                            'content': that.data.yard.tableData[$(this).val()]
                        }
                    }
                    myTableOne.init({
                        'dom': '#J_YardTable',
                        'option': myOption
                    })
                })
                .on('change', '#J_YardSelect1 select', function() {
                    var barChart = new BarChart();
                    switch ($(this).val()) {
                        case '龙门吊':
                            barChart.init({
                                dom: document.getElementById('J_YardBar'),
                                data: {
                                    name: '123',
                                    xAxis: that.data.shore.gantryName,
                                    data: that.data.shore.gantryEfficiency
                                },
                                isXTextRotate: false
                            });
                            break;
                        case '正面吊':
                            barChart.init({
                                dom: document.getElementById('J_YardBar'),
                                data: {
                                    name: '123',
                                    xAxis: that.data.shore.stackerName,
                                    data: that.data.shore.stackerEfficiency
                                },
                                isXTextRotate: false
                            });
                            break;
                        case '堆高机':
                            barChart.init({
                                dom: document.getElementById('J_YardBar'),
                                data: {
                                    name: '123',
                                    xAxis: that.data.shore.emptyName,
                                    data: that.data.shore.emptyEfficiency
                                },
                                isXTextRotate: false
                            });
                            break;
                    }
                })
                // 岸边切换按钮组
                .on('click', '.shore-working-body .btn-group button', function() {
                    $(this).addClass('btn-primary').siblings().removeClass('btn-primary');
                    var barChart = new BarChart();
                    if ($(this).text().indexOf('单桥') > -1) {
                        barChart.init({
                            dom: document.getElementById('J_ShoreBar'),
                            data: {
                                name: '123',
                                xAxis: that.data.shore.bridgeEfficiencyName,
                                data: that.data.shore.bridgeEfficiencyData
                            },
                            isXTextRotate: false
                        });
                    } else {
                        barChart.init({
                            dom: document.getElementById('J_ShoreBar'),
                            data: {
                                name: '123',
                                xAxis: that.data.shore.vesselEfficiencyName,
                                data: that.data.shore.vesselEfficiencyData
                            },
                            isXTextRotate: false
                        });
                    }

                })

        },
        listLoop: function() {
            // var height = $("#J_biTodayData").children('ul').height();
            // $("#J_biTodayData li").css("height", height/16 + 'px');
            $('#J_biTodayData li').css('height', 24 + 'px');
            $('#J_biTodayData').kxbdSuperMarquee({
                distance: 24,
                scrollAmount: 1,
                time: 3,
                duration: 0,
                loop: 0,
                direction: 'up'
            });
        },
        timeOptionSelect: function() {
            switch (this.timeOption) {
                case 0:
                    this.timeOptionStr = 'DAY';
                    break;
                case 1:
                    this.timeOptionStr = 'WEEK';
                    break;
                case 2:
                    this.timeOptionStr = 'MONTH';
                    break;
                case 3:
                    this.timeOptionStr = 'YEAR';
                    break;
            }
            // TODO: 加请稍候效果
            // this.showGetIntroDataLoading();
        },
        /**
         * 显示
         */
        show: function() {
            this.wraper.show();
        },
        /**
         * 隐藏
         */
        hide: function() {
            this.wraper.hide();
        },
        zoomOut: function() {
            this.render();
        },
        /**
         * 渲染
         */
        render: function() {
            var wraper = jsrender.templates(biGraphyWrapperBtnTemp).render({ teu: this.todayThroughtData });
            $('#J_biGraphy').html(wraper);
            // var wraper = jsrender.templates( biGraphyOverviewTemplate ).render();
            // $('#J_biGraphy').html( wraper );
            this._observer.getTodayThroughtData();
            this._observer.getIntroData('DAY');
            this.listLoop();
            // 获取图表内容
            // this._observer.getIntroData( this.timeOptionStr );
        },
        // 渲染下拉列表
        renderSelect: function(obj, data) {
            var temp = '';
            $.each(data, function(idx, item) {
                temp += '<option value="' + item.val + '">' + item.name + '</option>';
            })
            temp = '<select name="" id="">' + temp + '</select>';
            obj.html(temp);
        },
        // 渲染计划和完成量
        renderPlan: function(obj, data) {
            var temp = '<div>' +
                '<p>' + data.finish[1] + '</p>' +
                '<h3>' + data.finish[0] + '</h3>' +
                '</div>' +
                '<div>' +
                '<p>' + data.plan[1] + '</p>' +
                '<h3>' + data.plan[0] + '</h3>' +
                '</div>';
            obj.html(temp);
        },
        // 排序函数
        sortData: function(arr, compareAttr) {
            arr.sort(function(value2, value1) {
                if (value2[compareAttr] < value1[compareAttr]) {
                    return 1;
                } else if (value2[compareAttr] > [value1.compareAttr]) {
                    return -1;
                } else {
                    return 0;
                }
            })
        },
        /**
         * 渲染吞吐量
         */
        renderThroughput: function(args) {
            var planTitle = '',
                finishTitle = '',
                throughputTitle = '',
                composeTitle = '';

            $('.j-biGraphyModal .panel-title').html('集装箱吞吐量');
            if (this.timeOption === 3) {
                $('#J_biGraphyModal .panel-body').html(yardYearThroughputTemp);
                $('#J_plan').css({
                    'position': 'absolute',
                    'left': '10%',
                    'top': '30%'
                });
                $('.compose-title').css({
                    'position': 'absolute',
                    'top': '10%',
                    'left': '45%'
                });
                $('#J_throughput_chart').css('height', $('.yard-throughput-body').height() + 'px');
                var pieChart = new PieChart();
                pieChart.init({
                    dom: document.getElementById('J_throughput_chart'),
                    option: {
                        legend: {
                            orient: 'vertical',
                            bottom: '8%',
                            left: '8%',
                            itemHeight: 15,
                            align: 'auto',
                            data: ['进口', '出口', '国际中转', '国内中转', '倒箱'],
                            icon: 'circle'
                        },
                        center: ['70%', '60%']

                    },
                    data: [
                        { name: '国内中转', value: args.T },
                        { name: '倒箱', value: args.R },
                        { name: '进口', value: args.I },
                        { name: '出口', value: args.E },
                        { name: '国际中转', value: args.Z }
                    ]
                });
                // 计划和完成
                var temp = '<div>' +
                    '<h3>' + '本年累计已完成(TEU)' + '</h3>' +
                    '<p>' + '700000.00' + '</p>' +
                    '</div>';
                $('#J_plan').html(temp);
                return;
            } else {
                planTitle = '月计划(TEU)';
                finishTitle = '当月累计已完成(TEU)';
                throughputTitle = '本月';

                this.timeOption === 2 && (composeTitle = '本月');
                this.timeOption === 1 && (composeTitle = '本周');
                this.timeOption === 0 && (composeTitle = '今日');
                throughputTitle = throughputTitle + '吞吐量(完成率)';
                composeTitle = composeTitle + '吞吐量组成';
                $('#J_biGraphyModal .panel-body').html(yardThroughputTemp);
                $('.throughput-title').html(throughputTitle);
                $('.compose-title').html(composeTitle);

                // 吞吐量组成饼图
                $('#J_throughput_chart').css('height', $('.yard-throughput-body').height() * 0.8 + 'px');
                var throughPieChart = new PieChart();
                throughPieChart.init({
                    dom: document.getElementById('J_throughput_chart'),
                    option: {
                        legend: {
                            orient: 'horizontal',
                            bottom: '0%',
                            itemHeight: 15,
                            align: 'auto',
                            data: ['进口', '出口', '国际中转', '国内中转', '倒箱'],
                            icon: 'circle'
                        }
                    },
                    data: [
                        { name: '国内中转', value: args.T },
                        { name: '倒箱', value: args.R },
                        { name: '进口', value: args.I },
                        { name: '出口', value: args.E },
                        { name: '国际中转', value: args.Z }
                    ]
                });
                // 仪表盘
                $('#J_gaugeChart').css('height', $('.yard-throughput-body').height() * 0.69 + 'px'); // 渲染的时候才设置，所以改变屏幕大小时要刷新
                var gaugeChart = new GaugeChart();
                gaugeChart.init({
                    dom: document.getElementById('J_gaugeChart'),
                    data: 30
                });
                // 计划和完成
                var data = { plan: [planTitle, '21000.00'], finish: [finishTitle, '7000.00'] };
                this.renderPlan($('#J_plan'), data);
            }
        },
        /**
         * 渲染闸口作业
         */
        renderGateWorking: function(args) {
            $('#J_biGraphyModal .panel-body').html(gateWorkingTemp);
            $('.j-biGraphyModal .panel-title').html('闸口作业明细');

            // 闸口表格
            var myTableOne = new mTable();
            var myOption = {
                'data': {
                    'title': ['作业类型', '集装箱作业量(Unit)', '外拖车次', '外拖平均在场时间'],
                    isFirstColHead: true, // 第一列是否作为头部(有颜色填充)
                    'content': [
                        ['进箱', args.RECV_TEU, args.RECV_CHE, args.RECV_TIME],
                        ['提箱', args.DLVR_TEU, args.DLVR_CHE, args.DLVR_TIME]
                    ]
                }
            }

            myTableOne.init({
                'dom': '#J_GateTable',
                'option': myOption
            })

            // 闸口饼图1
            $('#J_GateinChart').css('height', ($('.gate-working-body').height() - $('#J_GateTable').height()) * 0.9 + 'px');
            var pieChart1 = new PieChart();
            pieChart1.init({
                dom: document.getElementById('J_GateinChart'),
                option: {
                    legend: {
                        orient: 'horizontal',
                        bottom: '0%',
                        itemHeight: 10,
                        align: 'auto',
                        data: ['0-15(min)', '15-30(min)', '30-60(min)', '60-90(min)', '90+(min)'],
                        icon: 'circle'
                    }
                },
                data: [
                    { name: '0-15(min)', value: args.RECV_ONE },
                    { name: '15-30(min)', value: args.RECV_TWO },
                    { name: '30-60(min)', value: args.RECV_THREE },
                    { name: '60-90(min)', value: args.RECV_FOUR },
                    { name: '90+(min)', value: args.RECV_FIVE }
                ]
            });

            // 闸口饼图2
            $('#J_GateoutChart').css('height', ($('.gate-working-body').height() - $('#J_GateTable').height()) * 0.9 + 'px');
            var pieChart2 = new PieChart();
            pieChart2.init({
                dom: document.getElementById('J_GateoutChart'),
                option: {
                    legend: {
                        orient: 'horizontal',
                        bottom: '0%',
                        itemHeight: 10,
                        align: 'auto',
                        data: ['0-15(min)', '15-30(min)', '30-60(min)', '60-90(min)', '90+(min)'],
                        icon: 'circle'
                    }
                },
                data: [
                    { name: '0-15(min)', value: args.DLVR_ONE },
                    { name: '15-30(min)', value: args.DLVR_TWO },
                    { name: '30-60(min)', value: args.DLVR_THREE },
                    { name: '60-90(min)', value: args.DLVR_FOUR },
                    { name: '90+(min)', value: args.DLVR_FIVE }
                ]
            });
        },
        /**
         * 渲染岸边作业
         */
        renderShoreWorking: function(args) {
            var that = this;
            $('#J_biGraphyModal .panel-body').html(shoreWorkingTemp);
            $('.j-biGraphyModal .panel-title').html('岸边作业量统计');

            var downBoatNams = [],
                dschBoatNams = [],
                loadBoatNams = [];
            $.each(args.DOWN, function(k, v) {
                downBoatNams.push(v.VESSEL_CODE);
            });
            $.each(args.DSCH, function(k, v) {
                dschBoatNams.push(v.VESSEL_CODE);
            });
            $.each(args.LOAD, function(k, v) {
                loadBoatNams.push(v.VESSEL_CODE);
            });

            var boatNameArr = _.union(downBoatNams, dschBoatNams, loadBoatNams);
            var tableContent = [];
            $.each(boatNameArr, function(k, v) {
                var tempArr = [];
                var loadB = 0,
                    dschB = 0,
                    downB = 0;
                $.each(args.LOAD, function(m, o) {
                    v === o.VESSEL_CODE && (loadB = o.TEU);
                })
                $.each(args.DSCH, function(m, o) {
                    v === o.VESSEL_CODE && (dschB = o.TEU);
                })
                $.each(args.DOWN, function(m, o) {
                    v === o.VESSEL_CODE && (downB = o.TEU);
                })

                tempArr.push(v, loadB, dschB, downB);
                tableContent.push(tempArr);
            });

            // 岸边表格
            var myTableOne = new mTable();
            var myOption = {
                'data': {
                    'title': ['船舶名称', '装箱量(Unit)', '卸箱量(Unit)', '倒箱量(Unit)'],
                    isFirstColHead: true, // 第一列是否作为头部(有颜色填充)
                    overScroll: 145,
                    'content': tableContent
                }
            }

            myTableOne.init({
                'dom': '#J_ShoreTable',
                'option': myOption
            })

            // 岸边饼图
            $('#J_ShoreChart').css('height', $('#J_ShoreTable').height() + 'px');
            var pieChart = new PieChart();
            pieChart.init({
                dom: document.getElementById('J_ShoreChart'),
                option: {
                    grid: {
                        top: '15%'
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: '0%',
                        itemHeight: 10,
                        align: 'auto',
                        data: ['倒箱量', '卸箱量', '装箱量'],
                        icon: 'circle'
                    }
                },
                data: [
                    { name: '倒箱量', value: args.DOWNPERCENT },
                    { name: '卸箱量', value: args.DSCHPERCENT },
                    { name: '装箱量', value: args.LOADPERCENT }
                ]
            });

            var bridgeEfficiencyName = [],
                bridgeEfficiencyData = [],
                vesselEfficiencyName = [],
                vesselEfficiencyData = [];
            $.each(args.BRIDGE, function(idx, item) {
                bridgeEfficiencyName.push(item.EQUIPMENT_CODE);
                item.BRIDGEEFFICIENCY = item.BRIDGEEFFICIENCY ? item.BRIDGEEFFICIENCY.toFixed(2) : 0;
                bridgeEfficiencyData.push(item.BRIDGEEFFICIENCY);
            })
            $.each(args.VESSEL, function(idx, item) {
                vesselEfficiencyName.push(item.VESSEL_CODE);
                item.VESSELEFFICIENCY = item.VESSELEFFICIENCY ? item.VESSELEFFICIENCY.toFixed(2) : 0;
                vesselEfficiencyData.push(item.VESSELEFFICIENCY);
            })
            that.data.shore.bridgeEfficiencyName = bridgeEfficiencyName;
            that.data.shore.bridgeEfficiencyData = bridgeEfficiencyData;
            that.data.shore.vesselEfficiencyName = vesselEfficiencyName;
            that.data.shore.vesselEfficiencyData = vesselEfficiencyData;

            // 岸边柱状图
            $('#J_ShoreBar').css('height', ($('.shore-working-body').height() - $('#J_ShoreChart').parent().height() - $('.shore-working-body .btn-group').height() + 'px'));
            var barChart = new BarChart();
            barChart.init({
                dom: document.getElementById('J_ShoreBar'),
                data: {
                    name: '123',
                    xAxis: bridgeEfficiencyName,
                    data: bridgeEfficiencyData
                },
                isXTextRotate: false
            });
        },
        /**
         * 渲染堆场堆存
         */
        renderYardWorking: function(args) {
            var that = this;
            var arr = [];
            var selectData = {};
            var selectDataCopy = {};
            var selectDataPart = {};
            $('#J_biGraphyModal .panel-body').html(yardWorkingTemp);
            $('.j-biGraphyModal .panel-title').html('堆场作业量统计');

            that.sortData(args.YARD, 'BLOCK_TYPE');
            $.each(args.YARD, function(idx, item) { // 添加表格数据 && 添加arr中的堆场类型
                if (arr[arr.length - 1] !== item.BLOCK_TYPE) {
                    arr.push(item.BLOCK_TYPE);
                }
            })
            for (var i = 0; i < arr.length; i++) { // selectData对象中的数组初始化
                selectData[arr[i]] = [];
                selectDataCopy[arr[i]] = [];
                selectDataPart[arr[i]] = {
                    subject: [],
                    percent: []
                };
            }
            $.each(args.YARD, function(idx, item) { // selectData对象数组添加数据
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] === item.BLOCK_TYPE) {
                        selectData[item.BLOCK_TYPE].push(item);
                        selectDataCopy[item.BLOCK_TYPE].push([item.YARD_CODE, item.TEU, item.USERATIO]);
                        break;
                    }
                }
            })
            for (var i = 0; i < arr.length; i++) { // selectData对象数组数据排序，并截取前十个
                that.sortData(selectData[arr[i]], 'USERATIO');
                (selectData[arr[i]].length > 10) && (selectData[arr[i]] = $.extend({}, selectData[arr[i]].slice(0, 10)));
            }
            for (var i = 0; i < arr.length; i++) { // selectDataPart数据组成
                $.each(selectData[arr[i]], function(idx, item) {
                    item.USERATIO = item.USERATIO === null ? 0 : item.USERATIO;
                    selectDataPart[arr[i]].subject.push(item.YARD_CODE);
                    selectDataPart[arr[i]].percent.push(item.USERATIO);
                })
                selectDataPart[arr[i]].subject.reverse();
                selectDataPart[arr[i]].percent.reverse();
            }

            // 堆场表格
            var myTableOne = new mTable();
            var myOption = {
                'data': {
                    'title': ['堆场名称', '堆存量', '堆存利用率'],
                    isFirstColHead: true, // 第一列是否作为头部(有颜色填充)
                    overScroll: 145,
                    'content': selectDataCopy[arr[1]]
                }
            }
            myTableOne.init({
                'dom': '#J_YardTable',
                'option': myOption
            })
            that.data.yard.xbarData = $.extend(true, {}, selectDataPart);
            that.data.yard.tableData = $.extend(true, {}, selectDataCopy);

            var yardTpData = [{ 'val': 'RTG', 'name': 'RTG堆场' }, { 'val': 'ES', 'name': 'ES堆场' }, { 'val': 'D', 'name': '特种堆场' }, { 'val': 'S', 'name': '危险品堆场' }]
            this.renderSelect($('#J_YardSelect0'), yardTpData);

            // 堆场横向柱状图
            $('#J_YardXBar').css('height', $('#J_YardTable').parent().height() + 'px');
            var xbarChart = new XbarChart();
            xbarChart.init({
                dom: document.getElementById('J_YardXBar'),
                option: {
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '2%',
                        top: '0%',
                        containLabel: true
                    }
                },
                // data:[65,48,20,45,61,64,84,31,64,87]
                data: selectDataPart[arr[1]]
            });


            var deviceTpData = [{ 'val': '龙门吊', 'name': '龙门吊' }, { 'val': '堆高机', 'name': '堆高机' }, { 'val': '正面吊', 'name': '正面吊' }]
            this.renderSelect($('#J_YardSelect1'), deviceTpData);

            // 堆场纵向柱状图
            var data = {
                gantry: {
                    gantryName: [],
                    gantryEfficiency: []
                },
                stacker: {
                    stackerName: [],
                    stackerEfficiency: []
                },
                empty: {
                    emptyName: [],
                    emptyEfficiency: []
                }
            };
            $.each(args.GANTRY, function(idx, item) {
                data.gantry.gantryName.push(item.EQUIPMENT_CODE);
                item.EFFICIENCY = item.EFFICIENCY ? item.EFFICIENCY.toFixed(2) : 0;
                data.gantry.gantryEfficiency.push(item.EFFICIENCY);
            })
            $.each(args.STACKER, function(idx, item) {
                data.stacker.stackerName.push(item.EQUIPMENT_CODE);
                item.EFFICIENCY = item.EFFICIENCY ? item.EFFICIENCY.toFixed(2) : 0;
                data.stacker.stackerEfficiency.push(item.EFFICIENCY);
            })
            $.each(args.EMPTY, function(idx, item) {
                data.empty.emptyName.push(item.EQUIPMENT_CODE);
                item.EFFICIENCY = item.EFFICIENCY ? item.EFFICIENCY.toFixed(2) : 0;
                data.empty.emptyEfficiency.push(item.EFFICIENCY);
            })
            that.data.shore.gantryName = data.gantry.gantryName;
            that.data.shore.gantryEfficiency = data.gantry.gantryEfficiency;

            that.data.shore.stackerName = data.stacker.stackerName;
            that.data.shore.stackerEfficiency = data.stacker.stackerEfficiency;

            that.data.shore.emptyName = data.empty.emptyName;
            that.data.shore.emptyEfficiency = data.empty.emptyEfficiency;

            $('#J_YardBar').css('height', ($('.yard-working-body').height() - $('#J_YardTable').parent().height()) * 0.7 + 'px');
            var barChart = new BarChart();
            barChart.init({
                dom: document.getElementById('J_YardBar'),
                data: {
                    name: '123',
                    xAxis: data.gantry.gantryName,
                    data: data.gantry.gantryEfficiency
                },
                isXTextRotate: false
            });
        },
        hideGraphy: function() {

        },
        // 设置当天吞吐量数据
        setTodayThroughtData: function(data) {
            this.todayThroughtData = data.TEU.toFixed(2);
            $('.biGraphyWrapperBtn span:nth-child(2)').html(data.TEU.toFixed(2));
        },
        // 请求当天吞吐量数据
        // getTodayThroughtData: function(){
        //     var that = this,
        //         TPUrl = '/data/throughput',
        //         TPMethod = 'GET',
        //         TPParams = {'time': 'DAY'},
        //         TPFnSuccess = function( data ) {
        //             $('.biGraphyWrapperBtn span:nth-child(2)').html(data.TEU.toFixed(2));
        //             // that.setTodayThroughtData( data );
        //         };
        //     this.postData( TPUrl, TPMethod, TPParams, TPFnSuccess );
        // },
        // 获取统计数据时候显示loading
        showGetIntroDataLoading: function() {
            this.setThroughtputData('请稍候...');
            this.setDepositData('请稍候...');
            this.setVesselJobData('请稍候...');
            this.setGateJobData('请稍候...');

        },
        // 设置集装箱吞吐量数据
        setThroughtputData: function(data) {
            if (typeof(data) === 'string') {
                $('.container-throughput span:nth-child(2)').html(data);
                $('.biTodayData li:first-child span:nth-child(2)').html(data);
            } else {
                $('.container-throughput span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:first-child span:nth-child(2)').html(data.TEU.toFixed(2));

            }

        },
        // 设置集装箱存箱量数据
        setDepositData: function(data) {
            if (typeof(data) === 'string') {
                $('.yard-statistical .real-time-statistical span:last-child').html(data);
                $('.gantrycrane-efficiency span:last-child').html(data);
                $('.biTodayData li:nth-child(2) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(3) span:nth-child(2)').html(data);
            } else {
                $('.yard-statistical .real-time-statistical span:last-child').html(data.TEU.toFixed(2));
                $('.gantrycrane-efficiency span:last-child').html(data.GANTRY.toFixed(2));
                $('.biTodayData li:nth-child(2) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(3) span:nth-child(2)').html(data.GANTRY.toFixed(2));
            }

        },

        // 设置岸边作业量数据
        setVesselJobData: function(data) {
            if (typeof(data) === 'string') {
                $('.shore-statistical .shore-cumulative span:last-child').html(data);
                $('.shore-statistical .single-bridge span:last-child').html(data);
                $('.shore-statistical .single-boat span:last-child').html(data);
                $('.biTodayData li:nth-child(4) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(5) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(6) span:nth-child(2)').html(data);
            } else {
                $('.shore-statistical .shore-cumulative span:last-child').html(data.TEU.toFixed(2));
                $('.shore-statistical .single-bridge span:last-child').html(data.BRIDGEEFFICIENCY.toFixed(2));
                $('.shore-statistical .single-boat span:last-child').html(data.VESSELEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(4) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(5) span:nth-child(2)').html(data.BRIDGEEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(6) span:nth-child(2)').html(data.VESSELEFFICIENCY.toFixed(2));
            }

        },
        // 设置闸口作业量作业量数据
        setGateJobData: function(data) {
            if (typeof(data) === 'string') {
                $('.gate-work-val').html(data);
                $('.out-truck-val').html(data);
                $('.biTodayData li:nth-child(7) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(8) span:nth-child(2)').html(data);
            } else {
                $('.gate-work-val').html(data.TEU.toFixed(2));
                $('.out-truck-val').html(data.AVE.toFixed(2));
                $('.biTodayData li:nth-child(7) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(8) span:nth-child(2)').html(data.AVE.toFixed(2));
            }


        },
        // 请求存箱量数据
        /*getIntroData: function( timeOptionStr ) {
            // 集装箱吞吐量 throughtput
            var that = this,
                TPUrl = '/data/throughput',
                TPMethod = 'GET',
                TPParams = {'time': timeOptionStr},
                TPFnSuccess = function( data ) {
                    //$('.container-throughput span:nth-child(2)').html(data.TEU.toFixed(2));
                    that.setThroughtputData(data );
                };
            this.postData( TPUrl, TPMethod, TPParams, TPFnSuccess );

            // 集装箱存箱量 deposit box
            var DBUrl = '/data/storageCtn',
                DBMethod = 'GET',
                DBParams = {'time': this.timeOptionStr},
                DBFnSuccess = function( data ) {
                    that.setDepositData(data);
                    //$('.yard-statistical .real-time-statistical span:last-child').html(data.TEU.toFixed(2));
                    //$('.gantrycrane-efficiency span:last-child').html(data.GANTRY.toFixed(2));
                };
            this.postData( DBUrl, DBMethod, DBParams, DBFnSuccess );

            // 岸边作业量 shore work
            var SWUrl = '/data/vesselJob',
                SWMethod = 'GET',
                SWParams = {'time': this.timeOptionStr},
                SWFnSuccess = function( data ) {
                    that.setShoreJobData(data);
                    //$('.shore-statistical .shore-cumulative span:last-child').html(data.TEU.toFixed(2));
                    //$('.shore-statistical .single-bridge span:last-child').html(data.BRIDGEEFFICIENCY.toFixed(2));
                    //$('.shore-statistical .single-boat span:last-child').html(data.VESSELEFFICIENCY.toFixed(2));
                };
            this.postData( SWUrl, SWMethod, SWParams, SWFnSuccess );

            // 闸口作业量 gate work
            var DBUrl = '/data/gateJob',
                DBMethod = 'GET',
                DBParams = {'time': this.timeOptionStr},
                DBFnSuccess = function( data ) {
                    that.setGateJobData( data );
                    //$('.gate-work-val').html(data.TEU.toFixed(2));
                    //$('.out-truck-val').html(data.AVE.toFixed(2));
                };
            this.postData( DBUrl, DBMethod, DBParams, DBFnSuccess );

            // 外拖平均在场时间 out truck
            // var DBUrl = '',
            //     DBMethod = 'GET',
            //     DBParams = {'time': this.timeOptionStr},
            //     DBFnSuccess = function() {

            //     };
            // this.postData( DBUrl, DBMethod, DBParams, DBFnSuccess );
        },*/
        postData: function(url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var that = this;
            url = '/portvision' + url;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function(data) {
                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._observer._popLayer._biGraphyCenterPop.removeLoading();
                    fnSuccess && fnSuccess.call(that, data);
                },
                error: function(error) {
                    fnError && fnError(error);
                }
            })
            return defer.promise;
        }
    });

    return BIGRAPHY;
})