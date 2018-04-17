/**
 * @moudle mod/biGraphy/biGraphy bi图表
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');

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
			'</div>'+
		'</div>';

    var BIGRAPHY = function (cfg) {
        if (!(this instanceof BIGRAPHY)) {
            return new BIGRAPHY().init(cfg);
        }
    };

    BIGRAPHY.prototype = $.extend(new McBase, {
        init: function (cfg) {
            this.wraper = $('#J_biGraphy');
            if (!this.wraper || !this.wraper.length) {
                return false;
            }
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            return this;
        },
        bindEvent: function () {

        },
        listLoop: function () {
            // var height = $("#J_biTodayData").children('ul').height();
            // $("#J_biTodayData li").css("height", height/16 + 'px');
            $('#J_biTodayData li').css('height', 24 + 'px');
            $('#J_biTodayData').kxbdSuperMarquee({
                distance: 24,
                // scrollAmount: 1,
                time: 1,
                isEqual: true,
                duration: 0,
                loop: 0,
                direction: 'up',
                isMarquee: true
            });
        },
        timeOptionSelect: function () {
            switch (this.timeOption) {
                case 0: this.timeOptionStr = 'DAY'; break;
                case 1: this.timeOptionStr = 'WEEK'; break;
                case 2: this.timeOptionStr = 'MONTH'; break;
                case 3: this.timeOptionStr = 'YEAR'; break;
            }
            // TODO: 加请稍候效果
            // this.showGetIntroDataLoading();
        },
        /**
         * 显示
         */
        show: function () {
            this.wraper.show();
        },
        /**
         * 隐藏
         */
        hide: function () {
            this.wraper.hide();
        },
        zoomOut: function () {
            this.render();
        },
        /**
         * 渲染
         */
        render: function () {
            var that = this;
            var wraper = jsrender.templates(biGraphyWrapperBtnTemp).render({ teu: this.todayThroughtData });
            $('#J_biGraphy').html(wraper);
            // var wraper = jsrender.templates( biGraphyOverviewTemplate ).render();
            // $('#J_biGraphy').html( wraper );
            this._observer.getTodayThroughtData();
            this._observer.getIntroData('DAY');
            /* window.setTimeout(function() {
                that.listLoop();
            }, 5000); */
            that.listLoop();
            // 获取图表内容
            // this._observer.getIntroData( this.timeOptionStr );
        },
        // 渲染下拉列表
        renderSelect: function (obj, data) {
            var temp = '';
            $.each(data, function (idx, item) {
                temp += '<option value="' + item.val + '">' + item.name + '</option>';
            })
            temp = '<select name="" id="">' + temp + '</select>';
            obj.html(temp);
        },
        // 渲染计划和完成量
        renderPlan: function (obj, data) {
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
        sortData: function (arr, compareAttr) {
            arr.sort(function (value2, value1) {
                if (value2[compareAttr] < value1[compareAttr]) {
                    return 1;
                } else if (value2[compareAttr] > [value1.compareAttr]) {
                    return -1;
                } else {
                    return 0;
                }
            })
        },
        // 设置当天吞吐量数据
        setTodayThroughtData: function (data) {
            this.todayThroughtData = data.TEU.toFixed(2);
            $('.biGraphyWrapperBtn span:nth-child(2)').html(data.TEU.toFixed(2));
        },
        // 获取统计数据时候显示loading
        showGetIntroDataLoading: function () {
            this.setThroughtputData('请稍候...');
            this.setDepositData('请稍候...');
            this.setVesselJobData('请稍候...');
            this.setGateJobData('请稍候...');

        },
        // 设置集装箱吞吐量数据
        setThroughtputData: function (data) {
            if (typeof (data) === 'string') {
                $('.container-throughput span:nth-child(2)').html(data);
                $('.biTodayData li:first-child span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(9) span:nth-child(2)').html(data);
            } else {
                $('.container-throughput span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:first-child span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(9) span:nth-child(2)').html(data.TEU.toFixed(2));

            }

        },
        // 设置集装箱存箱量数据
        setDepositData: function (data) {
            if (typeof (data) === 'string') {
                $('.yard-statistical .real-time-statistical span:last-child').html(data);
                $('.gantrycrane-efficiency span:last-child').html(data);
                $('.biTodayData li:nth-child(2) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(10) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(3) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(11) span:nth-child(2)').html(data);
            } else {
                $('.yard-statistical .real-time-statistical span:last-child').html(data.TEU.toFixed(2));
                $('.gantrycrane-efficiency span:last-child').html(data.GANTRY.toFixed(2));
                $('.biTodayData li:nth-child(2) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(10) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(3) span:nth-child(2)').html(data.GANTRY.toFixed(2));
                $('.biTodayData li:nth-child(11) span:nth-child(2)').html(data.GANTRY.toFixed(2));
            }

        },

        // 设置岸边作业量数据
        setVesselJobData: function (data) {
            if (typeof (data) === 'string') {
                $('.shore-statistical .shore-cumulative span:last-child').html(data);
                $('.shore-statistical .single-bridge span:last-child').html(data);
                $('.shore-statistical .single-boat span:last-child').html(data);
                $('.biTodayData li:nth-child(4) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(12) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(5) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(13) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(6) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(14) span:nth-child(2)').html(data);
            } else {
                $('.shore-statistical .shore-cumulative span:last-child').html(data.TEU.toFixed(2));
                $('.shore-statistical .single-bridge span:last-child').html(data.BRIDGEEFFICIENCY.toFixed(2));
                $('.shore-statistical .single-boat span:last-child').html(data.VESSELEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(4) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(12) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(5) span:nth-child(2)').html(data.BRIDGEEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(13) span:nth-child(2)').html(data.BRIDGEEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(6) span:nth-child(2)').html(data.VESSELEFFICIENCY.toFixed(2));
                $('.biTodayData li:nth-child(14) span:nth-child(2)').html(data.VESSELEFFICIENCY.toFixed(2));
            }

        },
        // 设置闸口作业量作业量数据
        setGateJobData: function (data) {
            if (typeof (data) === 'string') {
                $('.gate-work-val').html(data);
                $('.out-truck-val').html(data);
                $('.biTodayData li:nth-child(7) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(15) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(8) span:nth-child(2)').html(data);
                $('.biTodayData li:nth-child(16) span:nth-child(2)').html(data);
            } else {
                $('.gate-work-val').html(data.TEU.toFixed(2));
                $('.out-truck-val').html(data.AVE.toFixed(2));
                $('.biTodayData li:nth-child(7) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(15) span:nth-child(2)').html(data.TEU.toFixed(2));
                $('.biTodayData li:nth-child(8) span:nth-child(2)').html(data.AVE.toFixed(2));
                $('.biTodayData li:nth-child(16) span:nth-child(2)').html(data.AVE.toFixed(2));
            }


        },
        postData: function (url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var that = this;
            url = '/portvision' + url;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._observer._popLayer._biGraphyCenterPop.removeLoading();
                    fnSuccess && fnSuccess.call(that, data);
                },
                error: function (error) {
                    fnError && fnError(error);
                }
            })
            return defer.promise;
        }
    });

    return BIGRAPHY;
})
