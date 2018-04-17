/**
 * @moudle portvision/mod/TOOLBAR 全局导航工具条
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');
    var GlobalSearchPop = require('mod/globalSearch/globalSearch');

    var toolContentTmpl =
        '<div class="tool-box">' +
            '<div class="j-fixToolBar pack-up"></div>' +
            '<div id="J_userCenter" class="userCenter"></div>' +
            '<div class="mc-panel tool-container">' +
                '<a class="item search-item j-search"  href="javascript:void(0)">' +
                    '<span>搜索</span>' +
                '</a>' +
                '<a class="item biAnaly-item j-biAnaly"  href="javascript:void(0)">' +
                    '<span>设备</span>' +
                '</a>' +
                '<a class="item dataAnalyse-item j-dataAnalyse" href="javascript:void(0)">' +
                    '<span>图层</span>' +
                    '<div id="J_dataAnalyse" class="dataAnalyse-panel">' +
                    '</div>' +
                    '<div id="J_dataAnalysePopup"></div>' +
                    '<div id="J_thermodynamicLegend"></div>' +
                    // '<div id="J_todayJobCount"></div>' +
                '</a>' +
                '<a class="item warning-item j-warning"  href="javascript:void(0)">' +
                    '<span>告警</span>' +
                    '<div id="J_warnNum" class="smallPanel">' +
                    '</div>' +
                '</a>' +
                '<a class="item jobs-item j-jobs"  href="javascript:void(0)">' +
                    '<span>作业</span>' +
                    '<div id="J_jobsOption" class="smallPanel"></div>' +
                '</a>' +
                '<a class="item setting-item j-setting"  href="javascript:void(0)">' +
                    '<span>配置</span>' +
                '</a>' +
            '</div>' +
        '</div>';

    var templateDataAnalyse =
        '<div class="">' +
            '<div class="tab-content">' +
                '<ul>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>码头作业情况</h5>' +
                            '<input type="checkbox" class="wharfJob" />' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>堆场利用情况</h5>' +
                            '<input type="checkbox" class="yardUse" checked/>' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>作业关键指标</h5>' +
                            '<input type="checkbox" class="jobQuota" checked/>' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>堆场关键指标</h5>' +
                            '<input type="checkbox" class="yardQuota" checked/>' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>设备关键指标</h5>' +
                            '<input type="checkbox" class="deviceQuota" checked/>' +
                        '</label>' +
                    '</li>' +
                    // '<li class="quota-item">' +
                    // 	'<label>' +
                    //      '<h5>码头道路状况</h5>' +
                    //      '<input type="checkbox" class="wharfRoad" />' +
                    //  '</label>' +
                    // '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>集装箱作业情况</h5>' +
                            '<input type="checkbox" class="j-containerJob"/>' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>移动设备作业类型</h5>' +
                            '<input type="checkbox" class="j-deviceJobType" />' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>摄像头</h5>' +
                            '<input type="checkbox" class="j-camera"  checked/>' +
                        '</label>' +
                    '</li>' +
                    '<li class="quota-item">' +
                        '<label>' +
                            '<h5>消防栓</h5>' +
                            '<input type="checkbox" class="j-hydrant"  checked/>' +
                        '</label>' +
                    '</li>' +
                    // '<li class="quota-item">' +
                    //     '<label>' +
                    //         '<h5>地图取点</h5>' +
                    //         '<input type="checkbox" class="j-getPoint"/>' +
                    //     '</label>' +
                    // '</li>' +
                    // '<li class="quota-item">' +
                    //     '<label>' +
                    //         '<h5>地图画线</h5>' +
                    //         '<input type="checkbox" class="j-paintPolyline"/>' +
                    //     '</label>' +
                    // '</li>' +
                    // '<li class="quota-item">' +
                    //     '<label>' +
                    //         '<h5>显示道路线</h5>' +
                    //         '<input type="checkbox" class="j-roadLine" checked/>' +
                    //     '</label>' +
                    // '</li>' +
                    // '<li class="quota-item">' +
                    //     '<label>' +
                    //         '<h5>GPSLine</h5>' +
                    //         '<input type="checkbox" class="j-tailLine"/>' +
                    //     '</label>' +
                    // '</li>' +
                '</ul>' +
            '</div>' +
        '</div>';

    var templateDataAnalysePopup =
        '{{if type=="box"}}' +
            '<div class="j-dataAnalysePopup boxPop hide">' +
                '<div class="right panel smallPanel">' +
                    '<div class="panel-title">' +
                        '<h5>今日累计作业统计</h5>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        '<p class="clearfix text-blue">' +
                            '<span class="pull-left">装箱今日累计</span>' +
                            '<span class="pull-right">10345.25</span>' +
                        '</p>' +
                        '<p class="clearfix text-red">' +
                            '<span class="pull-left">进箱今日累计</span>' +
                            '<span class="pull-right">10345.25</span>' +
                        '</p>' +
                        '<p class="clearfix text-yellow">' +
                            '<span class="pull-left">卸箱今日累计</span>' +
                            '<span class="pull-right">10345.25</span>' +
                        '</p>' +
                        '<p class="clearfix text-green">' +
                            '<span class="pull-left">提箱今日累计</span>' +
                            '<span class="pull-right">10345.25</span>' +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            // '<div class="right panel">' +
            // 	'<div class="panel-title">' +
            // 		'<h5>今日累计作业统计</h5>' +
            // 	'</div>' +
            // 	'<div class="panel-body">' +

            // 	'</div>' +
            // '</div>' +
            '{{else type=="yard"}}' +
                '<div class="j-dataAnalysePopup yardPop hide">' +
                    '<div class="right panel bigPanel">' +
                        '<div class="panel-title">' +
                            '<h5>今日累计作业统计</h5>' +
                        '</div>' +
                        '<div class="panel-body">' +

                        '</div>' +
                    '</div>' +
                    '</div>' +
                '{{/if}}';

    var templateThermodynamicLegend =
        '<div class="j-thermodynamicLegend hide">' +
            '<h5 class="title">堆存量热力图图例</h5>' +
            '<ul class="legend">' +
                '{{for bgColors}}' +
                    '<li style="background-color: {{>#data}}">bgColors</li>' +
                '{{/for}}' +
                // '<li>1</li>' +
                // '<li>2</li>' +
                // '<li>3</li>' +
                // '<li>4</li>' +
                // '<li>5</li>' +
                // '<li>6</li>' +
                // '<li>7</li>' +
                // '<li>8</li>' +
                // '<li>9</li>' +
                // '<li>10</li>' +
            '</ul>' +
        '</div>';

    var TOOLBAR = function (cfg) {
        if (!(this instanceof TOOLBAR)) {
            return new TOOLBAR().init(cfg);
        }
    }

    TOOLBAR.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.lastItem = null;
            this.lastItemStr = '';
            this.initComponent();
            this.bindEvent();
            return this;
        },
        initComponent: function () {
            // 全局搜索弹框
            if (!this._globalSearchPop) {
                this._globalSearchPop = GlobalSearchPop({
                    'zr': this._zr, //zr
                    'observer': this._observer //观察者
                });
                this._globalSearchPop && this._globalSearchPop.render();
            }
        },
        bindEvent: function () {
            var that = this;
            $(document).on('click', '.j-toolBarSwitch', function () {
                $('.toolBar').addClass('active');
                $('.toolBarSwitch').removeClass('active');
                $('.containerJobList').removeClass('contJobListLayout');
            })
            $('#J_toolBar').off('click')
                .on('click', '.j-fixToolBar', function () {
                    that._observer.hidePop();
                    $('.toolBar').removeClass('active');
                    $('.toolBarSwitch').addClass('active');
                    $('.containerJobList').addClass('contJobListLayout');
                })
                .on('click', '.tool-container .item', function (ev) {
                    if ($(this).hasClass('active')) {
                        that._observer.hidePop();
                        $(ev.currentTarget).removeClass('active');
                        return;
                    }
                    that._observer.hidePop();
                    $('.tool-container .item').removeClass('active');
                    $(ev.currentTarget).addClass('active');
                    // if(!$(this).hasClass('j-dataAnalyse')){
                    // 	that._observer.showMonitorMap();
                    // 	$('.j-dataAnalysePopup').addClass('hide');
                    // 	// $('.j-dataAnalyse .j-clearSelect ').trigger('click');
                    // }
                })
                .on('click', '.tool-container .item>div', function (ev) {
                    ev.stopPropagation();
                })
                .on('click', '.j-search', function (ev) {
                    // $(ev.currentTarget).hasClass('active') ? $('.global-search').addClass('active') : $('.global-search').removeClass('active');
                    $(ev.currentTarget).hasClass('active') ? that._globalSearchPop.show() : that._globalSearchPop.hide();
                    $('#J_global_searchList').addClass('curr-active'); // 展示搜索结果面板
                })
                .on('click', '.j-biAnaly', function () {
                    var panelGroup = $('.mc-panel-group');
                    if ($('.biAnaly-item').hasClass('active')) {
                        // 统计窗口展开时，读popLayer中的数据
                        that._observer._popLayer.showEquipmentPop();
                    } else {
                        panelGroup.removeClass('active-panel');
                    }
                })
                .on('click', '.j-warning', function () {
                    if (!$(this).hasClass('active')) return;
                    // $('#J_warnList').show();
                    // that._observer.getCurrentWarns();

                    // 告警新选项列表
                    that.renderWarnOptionList();
                    $('#J_warnNum').show();
                })
                .on('click', '.j-dataAnalyse', function (ev) {
                    $(ev.currentTarget).hasClass('active') ? $('.dataAnalyse-panel').addClass('active') : $('.dataAnalyse-panel').removeClass('active');
                })
                // 作业
                .on('click', '.j-jobs', function () {
                    if (!$(this).hasClass('active')) return;
                    // if ($('#J_jobsOption').html()) {
                    //     $('#J_jobsOption').css('display') == 'block' ? $('#J_jobsOption').css('display', 'none') : $('#J_jobsOption').css('display', 'block');
                    // } else {
                    //     that.renderJobsOptionPop();
                    //     $('#J_jobsOption').css('display', 'block');
                    // }
                    that.renderJobsOptionPop();
                    $('#J_jobsOption').show();
                })
                /*.on('click','#J_aGoRecord',function(){
                    //console.log('stop monitor');
                    that._observer.stopMonitor();
                    window.location.href = '#/record'; ///portvision/web/app/index.html#/home
                })*/
                /*.on('click', '.j-dataAnalyse', function( ev ) {
                    if($('.dataAnalyse-panel').hasClass('active')){
                        return;
                    }
                    $(this).find('.nav-tabs li:first-child').trigger('click');
                    $(ev.currentTarget).hasClass('active') ? $('.dataAnalyse-panel').addClass('active') : $('.dataAnalyse-panel').removeClass('active');
                })

                .on('click', '.j-dataAnalyse .nav-tabs li', function(ev){
                    ev.stopPropagation();
                    if($(this).index() == 1){
                        that._observer.showMonitorMap();
                        $('.j-dataAnalysePopup').addClass('hide');
                        // $('.j-dataAnalyse .j-clearSelect ').trigger('click');
                    }else{
                        if(that.getSelectedObj($('.j-dataAnalyse .tab-pane0')).length){
                            var $box = $('.j-dataAnalyse .box');
                            var $boxInput = $box.find('input');
                            var $boxArr = that.getSelectedObj($box);
                            if($boxArr.length){
                                that.selectedTriggerClick($boxInput, that.reverseSelected($boxInput));
                            }
                            var $yard = $('.j-dataAnalyse .yard');
                            var $yardInput = $yard.find('input');
                            var $yardArr = that.getSelectedObj($yard);
                            if($yardArr.length){
                                that.selectedTriggerClick($yardInput, that.reverseSelected($yardInput));
                            }
                        }
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.j-dataAnalyse .tab-pane').eq($(this).index()).addClass('active').siblings().removeClass('active');

                })
                // 数据分析勾选
                .on('click', '.j-dataAnalyse .box input', function(ev){
                    if(that.getSelectedObj($('.j-dataAnalyse .box')).length == 0){
                        $('.j-dataAnalysePopup').addClass('hide');
                        that._observer.showMonitorMap();
                        return;
                    }
                    that.clearSelected($('.j-dataAnalyse .yard input'));
                    that._observer.showJobAnalysisMap(that.getSelectedVal($('.j-dataAnalyse .box input')));
                    that.renderDataAnalysePopupByData({type: 'box'});
                    that.showPop($('.j-dataAnalysePopup'));
                })
                .on('click', '.j-dataAnalyse .box .j-clearSelect', function(ev){
                    if(that.getSelectedObj($('.j-dataAnalyse .yard')).length != 0){
                        return;
                    }
                    that.clearSelected($('.j-dataAnalyse .box input'));
                    $('.j-dataAnalysePopup').addClass('hide');
                    that._observer.showMonitorMap();
                })
                .on('click', '.j-dataAnalyse .yard input', function(ev){
                    if(that.getSelectedObj($('.j-dataAnalyse .yard')).length == 0){
                        $('.j-dataAnalysePopup').addClass('hide');
                        that._observer.showMonitorMap();
                        return;
                    }
                    that.clearSelected($('.j-dataAnalyse .box input'));
                    that._observer.showThermodynamicMap(that.getSelectedVal($('.j-dataAnalyse .yard input')));
                    that.renderDataAnalysePopupByData({type: 'yard'});
                    that.showPop($('.j-dataAnalysePopup'));
                })
                .on('click', '.j-dataAnalyse .yard .j-clearSelect', function(ev){
                    if(that.getSelectedObj($('.j-dataAnalyse .box')).length != 0){
                        return;
                    }
                    that.clearSelected($('.j-dataAnalyse .yard input'));
                    $('.j-dataAnalysePopup').addClass('hide');
                    that._observer.showMonitorMap();
                    // that._observer.showJobAnalysisMap();
                })*/
                // 数据分析勾选
                .on('click', '.wharfJob', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showJobAnalysisMap();
                    } else {
                        that._observer.hideJobAnalysisMap();
                    }
                })
                .on('click', '.yardUse', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showThermodynamicMap();
                        $('.j-thermodynamicLegend').removeClass('hide');
                    } else {
                        that._observer.hideThermodynamicMap();
                        $('.j-thermodynamicLegend').addClass('hide');
                    }
                })
                .on('click', '.jobQuota', function () {
                    $('#J_biGraphy').toggleClass('hide');
                })
                .on('change', '.yardQuota', function () {
                    if (!$(this).prop('checked')) {
                        that._observer.switchYardQuota(false);
                    } else {
                        that._observer.switchYardQuota(true);
                    }
                })
                .on('change', '.deviceQuota', function () {
                    if (!$(this).prop('checked')) {
                        that._observer.switchDeviceQuota(false);
                    } else {
                        that._observer.switchDeviceQuota(true);
                    }
                })
                .on('change', '.wharfRoad', function () {
                    // if(that._observer._isgetRoadConditioning){
                    // 	return;
                    // }
                    if ($(this).prop('checked')) {
                        that._observer.showRoadConditionMap();
                    } else {
                        that._observer.hideRoadConditionMap();
                    }
                })
                .on('change', '.j-containerJob', function () {
                    // if(that._observer._isgetRoadConditioning){
                    // 	return;
                    // }
                    if ($(this).prop('checked')) {
                        that._observer.showContainerJobList();
                        that._observer._isgetContainerJobList = false; // 开启循环请求
                    } else {
                        that._observer.hideContainerJobList();
                        that._observer._isgetContainerJobList = true;
                    }
                })
                .on('change', '.j-camera', function () {
                    // if(that._observer._isgetRoadConditioning){
                    // 	return;
                    // }
                    if ($(this).prop('checked')) {
                        that._observer.showCamera();
                    } else {
                        that._observer.hideCamera();
                    }
                })
                .on('change', '.j-hydrant', function () {
                    // if(that._observer._isgetRoadConditioning){
                    // 	return;
                    // }
                    if ($(this).prop('checked')) {
                        that._observer.showHydrant();
                    } else {
                        that._observer.hideHydrant();
                    }
                })
                .on('change', '.j-getPoint', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showGetPoint();
                    } else {
                        that._observer.hideGetPoint();
                    }
                })
                .on('change', '.j-paintPolyline', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showPaintPolyline && that._observer.showPaintPolyline();
                    } else {
                        that._observer.hidePaintPolyline && that._observer.hidePaintPolyline();
                    }
                })
                .on('change', '.j-roadLine', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showRoadPolyline && that._observer.showRoadPolyline();
                    } else {
                        that._observer.hideRoadPolyline && that._observer.hideRoadPolyline();
                    }
                })
                .on('change', '.j-tailLine', function () {
                    if ($(this).prop('checked')) {
                        that._observer.renderGPSLine();
                    } else {
                        that._observer.hideGPSLineMap();
                    }
                })
                .on('change', '.j-deviceJobType', function () {
                    if ($(this).prop('checked')) {
                        that._observer.showDeviceJobType();
                    } else {
                        that._observer.hideDeviceJobType();
                    }
                });

        },
        // selectedTriggerClick: function(obj, idxArr){
        // 	$.each(idxArr, function(idx, item){
        // 		obj.eq(item).trigger('click');
        // 	})
        // },
        // // 将选中取消掉并返回之前选中的下标
        // reverseSelected: function(obj){
        // 	var arr = [];
        // 	$.each(obj, function(idx, item){
        // 		if($(item).prop('checked')){
        // 			$(item).prop('checked', false);
        // 			arr.push(idx);
        // 		}
        // 	})
        // 	return arr;
        // },
        // getSelectedVal: function(obj){
        // 	var arr = [];
        // 	$.each(obj, function(idx, item){
        // 		if($(item).prop('checked')){
        // 			arr.push($(item).val());
        // 		}
        // 	})
        // 	return arr;
        // },
        // clearSelected: function(obj){
        // 	obj.prop('checked', false);
        // },
        // getSelectedObj: function(obj){		// 注意传入元素
        // 	return obj.find('input:checked');
        // },
        showPop: function (obj) {
            obj.removeClass('hide');
        },
        /**
         * 渲染告警选项
         */
        renderWarnOptionList: function () {
            var htmlValue = '<ul>' +
                '<li><a href="/portvision/web/app/views/warn/list.html">告警列表</a></li>' +
                '<li><a href="/portvision/web/app/views/warn/rule.html">告警规则</a></li>' +
                '</ul>';
            $('#J_warnNum').html(htmlValue);
        },
        /**
         * 渲染作业选项弹框
         */
        renderJobsOptionPop: function () {
            $('#J_jobsOption').html('');
            // this.wraper.show();
            //var htmlValue = templateJobs.render();
            var htmlValue = '<ul>' +
                // '<li><a href="javascript:void(0)" id="J_aGoRecord">作业回放</a></li>' +
                '<li><a href="/portvision/web/app/views/record/index.html" id="J_aGoRecord">作业回放</a></li>' +
                '<li><a href="javascript:void(0)">作业预演</a></li>' +
                '</ul>';
            $('#J_jobsOption').html(htmlValue);
            //this.bindEvent();
        },
        /*
         * 根据参数渲染数据分析浮层
         */
        renderDataAnalyseByData: function () {
            var template = jsrender.templates(templateDataAnalyse).render(this.isSelected);
            $('#J_dataAnalyse').html(template);
        },
        renderDataAnalysePopupByData: function (data) {
            var template = jsrender.templates(templateDataAnalysePopup).render(data);
            $('#J_dataAnalysePopup').html(template);
        },
        /*renderThermodynamicLegendByData: function(data){
            var data = data || ['#ffcccc','#ffb8b8','#ffa2a2','#ff9090','#ff7777','#f46666','#e55656','#d94a4a','#ce3d3d','#c33333'];
            var template = jsrender.templates(templateThermodynamicLegend).render({bgColors: data});
            $('#J_thermodynamicLegend').html(template);
        },*/
        render: function () {
            $('#J_toolBar').html(jsrender.templates(toolContentTmpl).render());
            this.renderDataAnalyseByData();
            /*this.renderThermodynamicLegendByData();*/
        },
        hide: function () {
            // 隐藏搜索弹框
            // $('.global-search').removeClass('active');
            this._globalSearchPop && this._globalSearchPop.hide();
            // 隐藏设备清单
            $('.dataAnalyse-panel').removeClass('active');
            // 隐藏弹框后去除item的 active样式
            $('.tool-container .item').removeClass('active');
            $('#J_jobsOption').html('').hide();
            $('#J_warnNum').html('').hide();
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
                    // that.removeLoading();
                    fnSuccess && fnSuccess.call(that, data);
                },
                error: function (data, status) {
                    fnError && fnError(status);
                }
            });
            return defer.promise;
        }
    })

    return TOOLBAR;
});
