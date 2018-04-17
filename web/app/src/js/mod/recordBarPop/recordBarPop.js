/**
 * @moudule portvision/mod/RECORDINFOPOP 回放页面弹框
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');

    var recordToolBarTemp =
        '<div class="back-filter-group record-search-item">' +
            '<div id="go-back-btn"><a href="/portvision/web/app/views/monitor/index.html">返回</a></div>' +
            '<div id="record-filter-btn"><a href="javascript:void(0)">筛选</a></div>' +
        '</div>' +
        '<div class="search-bar record-search-item short">' +
            '<div class="btn-group">' +
                    '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">船名航次 <span class="caret"></span></button>' +
                    '<ul class="dropdown-menu">' +
                    '<li><a href="javascript:void(0)">船名航次</a></li>' +
                    '<li><a href="javascript:void(0)">机械设备</a></li>' +
                    '</ul>' +
            '</div>' +
            '<div class="input-group">' +
                    '<input type="text" id="search" class="form-control" placeholder="请输入船名航次编号">' +
                    '<span class="clear">删除</span>' +
                    '<span class="input-group-btn hide">' +
                    '<button class="btn btn-default mc-btn-goback" type="button">清除结果</button>' +
                    '</span>' +
            '</div>' +
            '<!-- <input type="text" placeholder=""> -->' +
        '</div>' +
        '<!-- 搜索结果 -->' +
        '<div id="J_search_result">' +
        '</div>' +
        '<!-- 筛选框 -->' +
        '<div id="J_filter_option">' +
        '</div>' +
        '<!-- 事件回放 -->' +
        '<div id="J_device_replay">' +

        '</div>';
    var filterPanelTemp =
        '<div class="panel panel-default mc-panel filter-popup">' +
            '<div class="panel-heading mc-panel-heading">' +
                '<h3 class="panel-title">' +
                    '<p class="pull-left mg0">筛选条件</p>' +
                    '<p class="pull-right mg0">' +
                        // '<label for="" class="mg0 j-selectAll">全选<input type="checkbox" class="mg0" checked /></label>' +
                        // '<label for="" class="mg0 j-selectReverse">反选<input type="checkbox" class="mg0" /></label>' +
                        '<label for="" class="mg0 mgr10 j-selectAll">全选</label>' +
                        '<label for="" class="mg0 j-selectReverse">反选</label>' +
                    '</p>' +
                '</h3>' +
                '</h3>' +
            '</div>' +
            '<div class="panel-body">' +

            '</div>' +
        '</div>';
    var filterOptionTemp =
        '<table filter-type="{{:filterType}}">' +
            '<thead>' +
                '<th>{{:filterType}}</th>' +
            '</thead>' +
            '<tbody>' +
                '{{for options}}' +
                '<tr>' +
                '<td>{{:optionName}}</td>' +
                '<td>' +
                    '<div class="mc-switch" data-id="{{:idx}}">' +
                        '{{if status == 1}}' +
                        '<div class="mc-switch-item mc-switch-on mc-switch-active">ON</div>' +
                        '<div class="mc-switch-item mc-switch-off">OFF</div>' +
                        '{{else}}' +
                        '<div class="mc-switch-item mc-switch-on">ON</div>' +
                        '<div class="mc-switch-item mc-switch-off mc-switch-active">OFF</div>' +
                        '{{/if}}' +
                    '</div>' +
                '</td>' +
            '</tr>' +
            '{{/for}}' +
            '</tbody>' +
        '</table>';
    var searchPanelTemp =
        '<div class="panel panel-default mc-panel search-result-popup">' +
            '<div class="panel-heading mc-panel-heading">' +
                '<h3 class="panel-title">搜索结果</h3>' +
            '</div>' +
            '<div class="panel-body">' +
                '<div class="result-list">' +
                    '<table>' +
                        '<tbody>' +
                            '{{if searchList.length}}' +
                                '{{for searchList}}' +
                                    '{{if ~root.searchType == "eq"}}' +
                                        '<tr searchType="{{:#data.TYPE}}">' +
                                            '<td>{{:#data.CODE}}</td>' +
                                        '</tr>' +
                                    '{{else}}' +
                                        '<tr searchType="voyage">' +
                                            '<td>{{:#data.CODE}}</td>' +
                                        '</tr>' +
                                    '{{/if}}' +
                                '{{/for}}' +
                            '{{else}}' +
                                '<tr class="disabled"><td>无搜索结果</td></tr>' +
                            '{{/if}}' +
                        '</tbody>' +
                    '</table>' +
                '</div>' +
                '<div class="device-info-bottom">' +
                    '<div class="loading" style="display: none;"></div>' +
                    '<input class="datainp wicon" id="J_date_input" type="text" placeholder="YYYY-MM-DD" value=""  readonly>' +
                    '<div id="J_date_refix"></div>' +
                    '<div>' +
                     	// '<span>选择工班</span>' +
                     	// '<ul class="work-class-list clearfix">' +
                     	// 	'<li>' +
                        //         '<div class="checkbox">' +
                        //             '<label>' +
                        //               	'<input type="checkbox" period-id="MORNING">早班' +
                        //             '</label>' +
                        //         '</div>' +
                     	// 	'</li>' +
                     	// 	'<li>' +
                        //         '<div class="checkbox">' +
                        //             '<label>' +
                        //               	'<input type="checkbox" period-id="NOON">中班' +
                        //             '</label>' +
                        //         '</div>' +
                     	// 	'</li>' +
                     	// 	'<li>' +
                        //         '<div class="checkbox">' +
                        //             '<label>' +
                        //               	'<input type="checkbox" period-id="NIGHT">晚班' +
                        //             '</label>' +
                        //         '</div>' +
                     	// 	'</li>' +
                     	// '</ul>' +
                        '<div class="select-result-btns">' +
                            '<div class="search-cancel j-search-cancel pull-left"><span>取消</span></div>' +
                            '<div class="search-confirm j-search-confirm pull-right"><span>确定</span></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var deviceReplayPanelTemp =
        '<div class="replay-action-switch"></div>' +
        '<div class="panel panel-default mc-panel curr-active">' +
            '<div class="device-profile-close"><span class="j-close">关闭</span></div>' +
            '<div class="panel-heading mc-panel-heading">' +
                '<h3 class="panel-title">事件回放</h3>'            +
            '</div>' +
            '<div class="panel-body">' +
                '<ul class="device-action-list">' +
                    '<li>' +
                        '<div>' +
                            '<div class="device-action-time">' +
                                '<span>{{>JOB_START_TIME}}</span>' +
                                '<span></span>' +
                            '</div>' +
                            '<div class="device-action-directive">' +
                                '<span>作业指令：</span>' +
                                '<span>{{>FROM_SLOT_POSITION}}>>{{>TO_SLOT_POSITION}}</span>' +
                            '</div>' +
                        '</div>' +
                    '</li>' +
                '</ul>' +
            '</div>' +
        '</div>';

    var RECORDINFOPOP = function (cfg) {
        if (!(this instanceof RECORDINFOPOP)) {
            return new RECORDINFOPOP().init(cfg);
        }
    }

    RECORDINFOPOP.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this.filterObj = {};
            this.dateOption = {};
            this.observer = cfg.observer || null;
            this.nowDate = $.nowDate(0);
            this.prevDate = this.nowDate.substr(0, 10);
            this.prevMonth = this.nowDate.substr(0, 7);
            this.filterObj.selDate = this.nowDate.substring(0, 10);
            this.isSingleDeviceRp = false;
            this.filterData = cfg.filterData || {
                'jobs': [
                    { 'optionName': '装船', 'status': 1 },
                    { 'optionName': '卸船', 'status': 1 },
                    { 'optionName': '进箱', 'status': 1 },
                    { 'optionName': '提箱', 'status': 1 }
                ],
                'devices': [
                    { 'optionName': '内集卡', 'status': 1 },
                    { 'optionName': '龙门吊', 'status': 1 },
                    { 'optionName': '堆高机', 'status': 1 },
                    { 'optionName': '正面吊', 'status': 1 },
                    { 'optionName': '桥吊', 'status': 1 }
                ]
            };
            this.defaultFilterData = $.extend(true, {}, this.filterData);
            this.inWhichTypeRecord = 'global';
            this.defaultSearchList = [
                { 'CODE': 'T01', 'license': '1423751' },
                { 'CODE': 'T02', 'license': '1423752' },
                { 'CODE': 'T03', 'license': '1423753' }
            ];
            this.baseSortWeight = {
                number: 1,
                status: 10
            };
            this.statusWeight = {
                device: { // 排序：内集卡>桥吊>龙门吊>堆高机>正面吊>其他设备
                    'TRUCK_NW': 9,
                    'bridgeCrane': 8,
                    'gantryCrane': 7,
                    'emptyContainerHandlers': 6,
                    'reachStacker': 5,
                    'other': 4
                },
                voyage: { // 排序：作业中>等开工>停工>其他
                    'V_WORK': 9,
                    'V_WALT_WORK': 8,
                    'V_STOP': 7,
                    'other': 6
                }
            };
            this.initCustomJQEvent();
            this.bindEvent();
            return this;
        },
        initCustomJQEvent: function () {
            jQuery.fn.valuechange = function (fn) {
                return this.bind('valuechange', fn);
            };

            jQuery.event.special.valuechange = {
                setup: function () {
                    jQuery(this).watch('value', function () {
                        jQuery.event.handle.call(this, { type: 'valuechange' });
                    });
                },
                teardown: function () {
                    jQuery(this).unwatch('value');
                }
            };
        },
        bindEvent: function () {
            var that = this;
            $('#recordToolBar')
                .on('click', '#record-filter-btn', function () {
                    $('#record-filter-btn').toggleClass('active');
                    // 隐藏搜索结果框
                    $('#J_search_result').removeClass('curr-active');
                    var filterOptionPanel = $('#J_filter_option');
                    filterOptionPanel.toggleClass('curr-active');
                }).on('click', '.dropdown-menu li', function () {
                    $('#J_search_result').removeClass('curr-active');
                    $('.btn-group button.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
                    $('.input-group input').attr('placeholder', $(this).text().indexOf('船名航次') > -1 ? '请输入船名航次编号' : '请输入设备编号');
                })
                .on('click', '#go-back-btn', function () {
                    that.observer.pausePlayback();
                    $('.mc-btn-goback').trigger('click');
                })
                .on('click', '.j-selectAll', function () {
                    if (that.inWhichTypeRecord === 'singleDevice') return;
                    that.initFilterData();
                    that.renderFilterOptions(that.filterData);
                    var filterObj = that.getFilterObj(that.filterData);
                    var obj = {
                        searchCode: that.inWhichTypeRecord === 'global' ? '' : that.selectData,
                        searchJobType: that.getSearchJobs()
                    }
                    that.observer.resetSearchInfo(obj);
                    that.observer.playWithFiter(filterObj);
                    // !that.observer._isPause && that.observer.restartPlayback();
                })
                .on('click', '.j-selectReverse', function () {
                    if (that.inWhichTypeRecord === 'singleDevice') return;
                    that.reverseSelect(that.filterData);
                    var filterObj = that.getFilterObj(that.filterData);
                    var obj = {
                        searchCode: that.inWhichTypeRecord === 'global' ? '' : that.selectData,
                        searchJobType: that.getSearchJobs()
                    }
                    that.observer.resetSearchInfo(obj);
                    that.observer.playWithFiter(filterObj);
                    that.renderFilterOptions(that.filterData);
                    // !that.observer._isPause && that.observer.restartPlayback();
                })
                .on('click', '.mc-switch', function (ev) { // 筛选选项按钮
                    if (that.inWhichTypeRecord === 'singleDevice') return;
                    var currSwitch = $(ev.currentTarget);
                    var selItem = currSwitch.children('.mc-switch-active');
                    var thatilterType = (currSwitch.parents('table').attr('filter-type') === '按作业类型') ? 'jobs' : 'devices';
                    var thatilterIdx = currSwitch.attr('data-id');
                    selItem.removeClass('mc-switch-active');
                    var checkedList = [];
                    var type = '';
                    if (thatilterType === 'devices') {
                        switch (+thatilterIdx) {
                            case 0: type = 'containers'; break;
                            case 1: type = 'gantrycranes'; break;
                            case 2: type = 'stackers'; break;
                            case 3: type = 'reachstackers'; break;
                            case 4: type = 'bridgecranes'; break;
                        }
                    }
                    if (selItem.text() === 'ON') {
                        currSwitch.children('.mc-switch-off').addClass('mc-switch-active');
                        that.filterData[thatilterType][thatilterIdx].status = 0;
                        // $.each(that.observer._overMap[type], function() {
                        // 	checkedList.push('false');
                        // })
                    } else {
                        currSwitch.children('.mc-switch-on').addClass('mc-switch-active');
                        that.filterData[thatilterType][thatilterIdx].status = 1;
                        // $.each(that.observer._overMap[type], function() {
                        // 	checkedList.push('true');
                        // })
                    }
                    var filterObj = that.getFilterObj(that.filterData);

                    var obj = {
                        searchCode: that.inWhichTypeRecord === 'global' ? '' : that.selectData,
                        searchJobType: that.getSearchJobs()
                    }
                    that.observer.resetSearchInfo(obj);

                    /*var $input = $('.j-selectAll input');
                    if(!that.judgeSelectAll(filterObj)){
                        $input.prop('checked', true);
                    }else{
                        $input.prop('checked', false);
                    }*/

                    that.observer.playWithFiter(filterObj);
                    // !that.observer._isPause && that.observer.restartPlayback();
                    // todo:
                    // 通知隐藏相关设备
                    if (thatilterType === 'devices') {
                        that.observer.updateObjectChecked(type, checkedList);
                    }
                })
                .on('keyup', '#search', function () { // 搜索框键盘事件
                    var val = $(this).val();
                    that.searchVal = val;
                    if (val === '') {
                        $('#J_search_result').removeClass('curr-active');
                        return;
                    }
                    var text = $(this).attr('placeholder');
                    if (text.indexOf('船名航次') > -1) {
                        if (val.length >= 4) {
                            that.searchType = 'ctn';
                            that.showSearchResultPop();
                            var url = '/lycos/playback/' + val + '?type=voyage',
                                method = 'GET',
                                params = {
                                    searchVal: val
                                },
                                fnSuccess = that.renderSearchResult;
                            that.postData(url, method, params, fnSuccess);
                            // that.renderSearchResult(that.defaultSearchList);
                        } else {
                            $('#J_search_result').removeClass('curr-active');
                        }
                    }
                    else if (text.indexOf('设备') > -1) {
                        if (val.length >= 2) {
                            that.searchType = 'eq';
                            that.showSearchResultPop();
                            var url = '/lycos/playback/' + val + '?type=equip',
                                method = 'GET',
                                params = {
                                    searchVal: val
                                },
                                fnSuccess = that.renderSearchResult;
                            that.postData(url, method, params, fnSuccess);
                        } else {
                            $('#J_search_result').removeClass('curr-active');
                        }
                    }
                })
                .on('focus', '#search', function () {
                    $('.input-group .clear').addClass('active');
                })
                .on('blur', '#search', function () {
                    $('.input-group .clear').removeClass('active');
                })
                .on('click', '.input-group .clear', function () {
                    $('#search').val('');
                    $('#J_search_result').removeClass('curr-active');
                })
                .on('click', '.input-group-btn .mc-btn-goback', function () {
                    that.observer._overMap.hideContainerTrailMap();
                    that.observer.searchEqType = '';
                    that.inWhichTypeRecord = 'global';
                    that.hidePop();
                    $('#search').val('');
                    $('#J_device_replay .mc-panel').removeClass('curr-active');
                    $('.record-search-item').addClass('short');
                    $(this).parent().addClass('hide');
                    that.isSingleDeviceRp = false;
                    that.observer._recordPop._playerPop.workingClassInfo = {};
                    that.observer._recordPop._playerPop.dateData.flagC = false;
                    // that.observer.setDate($.nowDate(0));
                    $('.j-workingTip').addClass('hide');
                    that.observer.resetSearchInfo({
                        searchCode: '',
                        searchEqType: '',
                        searchJobType: ['LOAD', 'DSCH', 'RECV', 'DLVR']
                    })
                    that.initFilterData();
                    that.renderFilterOptions(that.filterData);
                    var filterObj = that.getFilterObj(that.filterData);
                    that.observer.playWithFiter(filterObj);
                    that.observer._recordPop._playerPop.dateData.flagS = true;
                    that.observer._recordPop._playerPop.setTimeChange(that.nowDate);
                    that.observer.setDate(that.nowDate);
                    that.observer._recordPop._playerPop.dateData.flagS = false;
                    !that.observer._isPause && that.observer.restartPlayback();
                })
                // .on('click', '.checkbox input', function( ev ) { // 工班 periods
                // 	var currTarget = $(ev.currentTarget)[0];
                // 	var period = $(currTarget).attr('period-id');
                // 	console.log(currTarget);
                // 	if ( currTarget.checked ) {
                // 		periodArr.push(period);
                // 	} else {
                // 		$.inArray(period, periodArr) > -1 && periodArr.splice($.inArray(period, periodArr), 1);
                // 	}
                // 	console.log($(ev.currentTarget).attr('period-id'));
                // })
                .on('click', '.j-search-cancel', function () {
                    that.hidePop();
                })
                .on('click', '.j-search-confirm', function () {
                    if (!that.filterObj.selDate) return;
                    if ($('.search-confirm').hasClass('disabled')) return;
                    !($('.result-list').text().indexOf('无搜索结果') > -1) && ($('.record-search-item').removeClass('short'));
                    that.observer._overMap.hideContainerTrailMap();
                    // 设置时间
                    that.filterObj.selDate = $('.jedaul li.action').attr('data-ymd');
                    that.observer._recordPop._playerPop.dateData.flagC = false;
                    that.observer._recordPop._playerPop.dateData.flagS = true;
                    that.observer._recordPop._playerPop.setTimeChange(that.filterObj.selDate + ' 00:00:00');
                    that.observer._recordPop._playerPop.getWorkingClassInfo(that.workingClassInfo, that.deliverDate);

                    that.observer.setDate(that.filterObj.selDate + ' 00:00:00');

                    $('#search').val(that.selectData);

                    var searchCode = '',
                        searchEqType = '',
                        searchJobType = '';
                    switch (that.selectType) {
                        case 'truck': searchEqType = 'T'; break;
                        case 'bridgeCrane': searchEqType = 'CR'; break;
                        case 'gantryCrane': searchEqType = 'RT'; break;
                        case 'emptyContainerHandlers': searchEqType = 'P'; break;
                        case 'reachStacker': searchEqType = 'F'; break;
                        case 'voyage': searchEqType = 'V'; break;
                    }

                    // 显示事件回放面板
                    if ($('.btn-group>button').text().indexOf('机械设备') > -1) {
                        that.inWhichTypeRecord = 'singleDevice';
                        that.initFilterData();
                        that.renderFilterOptions(that.filterData);
                        that.isSingleDeviceRp = true;
                        // that.renderDeviceReplay();
                        var searchJobs = [];
                        searchJobs = ['LOAD', 'DSCH', 'RECV', 'DLVR'];
                        that.searchJobs = searchJobs;
                        var obj = {
                            searchCode: that.selectData,
                            searchEqType: searchEqType,
                            searchJobType: searchJobs
                        }
                        // TODO: 需要传值（搜索的设备或船名）
                        var filterObj = that.getFilterObj(that.filterData);
                        that.observer.playWithFiter(filterObj);
                        // that.observer.playTheSingleEquipment( obj );
                        // !this._isPause && that.getSingleDeviceReplay(that.filterObj.selDate);
                    } else {
                        that.inWhichTypeRecord = 'vessel';
                        $('#J_device_replay').html('');
                        var filterObj = that.getFilterObj(that.filterData);
                        that.observer.playWithFiter(filterObj);
                        var obj = {
                            searchCode: that.selectData,
                            searchEqType: searchEqType,
                            searchJobType: that.getSearchJobs()
                        }
                        // that.observer.playTheVoyageEquipment( obj );
                    }
                    that.observer.resetSearchInfo(obj);
                    !that.observer._isPause && that.observer.restartPlayback();
                    //console.log(that.observer.getDate());
                    that.hidePop();
                })
                .on('click', '.result-list tr:not(".disabled")', function (ev) {
                    $('#J_date_refix').empty();
                    // 需要获取当前选择的设备类型
                    $('.result-list tr').removeClass('active');
                    $('.mc-btn-goback').parent().removeClass('hide');
                    // $('.input-group .clear').css('right', '80px');
                    $('#recordToolBar .record-search-item').removeClass('short');
                    var currDevice = $(ev.target).parent();
                    currDevice.addClass('active');

                    that.renderSearchResult([{ CODE: $(this).text() }]);
                    that.selectData = $(this).text();
                    that.selectType = $(this).attr('searchType');
                    $('.result-list tr').addClass('disabled');		// 选定一条重新渲染后，不能点击
                    $('.search-result-popup .loading').css('display', 'block');
                    // that.prevMonth = that.nowDate.substr(0,10); // 用来记录判断日历时间发生变化
                    // that.getDeviceWorkDate(that.nowDate.substr(0, 10)); // 获取当前月份的工作状况
                    // that.prevMonth = that.prevDate.substr(0, 7);
                    that.getDeviceWorkDate(that.prevDate); // 获取当前月份的工作状况
                    // // todo: 请求设备当月的工作情况
                    // // that.renderDate(that);
                    // setTimeout(function(){that.renderDate(that)}, 1 * 1000);
                })
                .on('click', '#J_device_replay .j-close', function () {
                    // 隐藏
                    // var deviceReplayPanel = $('#J_device_replay .mc-panel');
                    // var replayActSwitch = $('.replay-action-switch');
                    // if ( !deviceReplayPanel.hasClass('curr-active') ) {
                    // 	deviceReplayPanel.addClass('curr-active');
                    // 	replayActSwitch.removeClass('curr-active');
                    // } else {
                    // 	deviceReplayPanel.removeClass('curr-active');
                    // 	replayActSwitch.addClass('curr-active');
                    // }
                    $('.replay-action-switch').addClass('curr-active');
                    $('#J_device_replay .mc-panel').removeClass('curr-active');
                })
                .on('click', '.replay-action-switch', function () {
                    $('.replay-action-switch').removeClass('curr-active');
                    $('#J_device_replay .mc-panel').addClass('curr-active');
                })
                .on('click', '.jedateym i, .jedatetopym li', function () { // jeDate日期处理 获取
                    var nowMonth = $('.jedateyear').text() + '-' + $('.jedatemm').text();
                    if (that.prevMonth === nowMonth) return;
                    that.prevMonth = nowMonth;
                    that.getDeviceWorkDate(nowMonth + '-1');
                });
            // 告诉record改变时间的方法
            that.observer.setTimeChangeCallback && that.observer.setTimeChangeCallback(that.setTimeChange, that);
        },
        getSearchJobs: function () {
            var searchJobs = [];
            this.filterData.jobs[0].status === 1 && searchJobs.push('LOAD');
            this.filterData.jobs[1].status === 1 && searchJobs.push('DSCH');
            this.filterData.jobs[2].status === 1 && searchJobs.push('RECV');
            this.filterData.jobs[3].status === 1 && searchJobs.push('DLVR');
            return searchJobs;
        },
        getFilterObj: function (data) {
            return {
                'LOAD': data.jobs[0].status,
                'DSCH': data.jobs[1].status,
                'RECV': data.jobs[2].status,
                'DLVR': data.jobs[3].status,
                'container': data.devices[0].status,
                'gantrycrane': data.devices[1].status,
                'emptyContainer': data.devices[2].status,
                'reachstacker': data.devices[3].status,
                'bridgecrane': data.devices[4].status
            };
        },
        // 重新置为默认的filterData
        initFilterData: function () {
            this.filterData = $.extend(true, {}, this.defaultFilterData);
        },
        // 反选将filterData中status取反
        reverseSelect: function (data) {
            $.each(data, function (idx, item) {
                $.each(item, function (jdx, jtem) {
                    jtem.status = ~~!jtem.status;
                })
            })
        },
        /*// 判断是否全选中
        judgeSelectAll: function(data){
            var temp = _.filter(data, function(item){
                return item == 0;
            })
            return temp.length;
        },*/
        renderFilterOptions: function (data) {
            var $wrap = $('.filter-popup .panel-body');
            $wrap.html('');
            $.each(data, function (k, v) {
                var optionData = {};
                optionData.filterType = k === 'jobs' ? '按作业类型' : '按设备类型';
                optionData.options = v;
                $.each(optionData.options, function (m, n) {
                    n.idx = m;
                })
                var filterOptWrapper = jsrender.templates(filterOptionTemp).render(optionData);
                $wrap.append(filterOptWrapper);
            });
        },
        showSearchResultPop: function () {
            this.hidePop();
            $('#J_search_result').addClass('curr-active');
        },
        showFilterPop: function () {
            this.hidePop();
            $('#J_filter_option').addClass('curr-active');
        },
        hidePop: function () {
            // 隐藏筛选框
            $('#record-filter-btn').removeClass('active');
            $('#J_filter_option').removeClass('curr-active');
            // 隐藏搜索结果框
            $('#J_search_result').removeClass('curr-active');
            // 删除上次的时间选择
            $('#J_date_refix').empty();
        },
        /*
        *  将模板数据插入到页面节点
        */
        render: function () {
            $('#recordToolBar').html(jsrender.templates(recordToolBarTemp).render());
            $('#recordToolBar .record-search-item').addClass('short');
            // this.observer.hidePop();
            //console.log($('#J_filter_option'));
            $('#J_filter_option').html(filterPanelTemp);
            this.renderFilterOptions(this.filterData);
            // this.renderSearchResult( this.defaultSearchList );
            // this.hidePop();
        },
        /**
         * render搜索结果弹框
         */
        renderSearchResult: function (data) {
            var that = this;
            if(!data.length || data[0].SEARCHVALUE !== that.searchVal )
                return true;
            $.each(data, function (k, d) {
                d.sortWeight = that.searchType === 'ctn' ? that.countSortWeight(d, 'voyage') : that.countSortWeight(d, 'device');
            })
            data = that.sortEachGroup(data, 'sortWeight');
            var renderData = {
                'searchList': data,
                'searchType': this.searchType
            }
            that.ascSortData(data, 'sortWeight', 'des');
            var searchWraper = jsrender.templates(searchPanelTemp).render(renderData);
            $('#J_search_result').html(searchWraper);
            //console.log(this.filterObj.selDate);
        },
        /**
         * desc: 分组后内部排序
         *
         */
        sortEachGroup: function (data, attr) {
            var that = this;
            data = _.groupBy(data, function (item) {
                return item[attr];
            })
            $.each(data, function (idx, item) {
                item.sort(that.sortData(item, 'CODE', 'des'));
            })
            return _.flatten(_.toArray(data));
        },
        /**
         * desc: 计算设备排序权重
         * @return {number} 权重值
         */
        countSortWeight: function (data, type) {
            // 当前只计算状态值权重
            var weight = 0;
            if (type === 'voyage') {
                weight = weight + this.baseSortWeight.status * this.statusWeight['voyage'][data['STA_CURRENT_STATUS']] ? this.statusWeight['device'][data['STA_CURRENT_STATUS']] : this.statusWeight['device']['other'];
            } else {
                weight = weight + this.baseSortWeight.status * this.statusWeight['device'][data['TYPE']] ? this.statusWeight['device'][data['TYPE']] : this.statusWeight['device']['other'];
            }
            // for (k in )
            return weight;
        },
        ascSortData: function (data, property, direc) {
            if (!data || !data.length || !(data instanceof Array)) return [];
            return data.sort(this.sortData(data, property, direc));
        },
        /**
         * desc: 按照编号进行排序
         * @param  {Array} data 需要排序的数据
         * @return {number}     交换位置的标记
         */
        sortData: function (data, property, type) {
            return function (object1, object2) {
                var value1 = object1[property];
                var value2 = object2[property];

                if (value1 < value2) {
                    return type.toUpperCase() === 'ASC' ? -1 : 1;
                } else if (value1 > value2) {
                    return type.toUpperCase() === 'ASC' ? 1 : -1;
                } else {
                    return 0;
                }
            };
        },
        /**
         * render事件回放面板
         */
        renderDeviceReplay: function (data) {
            var deviceReplay = data && data.JOBLIST[0] && jsrender.templates(deviceReplayPanelTemp).render(data.JOBLIST[0]);
            $('#J_device_replay').html(deviceReplay);
        },
        /**
         * desc: 获取单事件回放列表
         */
        getSingleDeviceReplay: function (time) {
            if (!this.isSingleDeviceRp) return;
            time = _.isDate(time) ? time : new Date(time);
            time = time.valueOf();
            var searchEqType = '';
            switch (this.selectType) {
                case 'truck': searchEqType = 'T'; break;
                case 'bridgeCrane': searchEqType = 'CR'; break;
                case 'gantryCrane': searchEqType = 'RT'; break;
                case 'emptyContainerHandlers': searchEqType = 'P'; break;
                case 'reachStacker': searchEqType = 'F'; break;
                case 'voyage': searchEqType = 'V'; break;
            }

            var url = '/equip/job/' + this.selectData,
                method = 'get',
                params = { 'equipType': searchEqType, 'jobType': ['LOAD', 'DSCH', 'RECV', 'DLVR'], 'time': time },
                fnSuccess = this.renderDeviceReplay;
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * 获取月份内设备的工作状态
         */
        getDeviceWorkDate: function (date) {
            this.deliverDate = date;
            var dataTp;
            switch (this.selectType) {
                case 'truck': dataTp = 'truckSta'; break;
                case 'bridgeCrane': dataTp = 'bridgeCraneSta'; break;
                case 'gantryCrane': dataTp = 'gantryCraneSta'; break;
                case 'emptyContainerHandlers': dataTp = 'emptySta'; break;
                case 'reachStacker': dataTp = 'reachStackerSta'; break;
                case 'voyage': dataTp = 'vesselSta'; break;
            }
            if (!dataTp) {
                return false;
            }
            var url = '/lycos/' + dataTp + '/' + this.selectData,
                method = 'get',
                params = { 'time': date },
                fnSuccess = this.renderDate;
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * 渲染日历插件
         * 1、loading&& 获取选择的设备或船名的指令在月份中的分布情况
         * 2、根据工作情况渲染日历展示
         */
        renderDate: function (data) {
            this.workingClassInfo = data;
            // 清空date
            $('#J_date_refix').empty();
            var dateStr = '';
            var dateArr = [];
            $.each(data, function (k, v) {
                dateArr.push(v.DD);
                // if ( v.DD < 10 ) v.DD = parseInt(v.DD);
                // k == 0 ? dateStr = v.DD + '' : dateStr = dateStr + ',' + v.DD; // dateStr必须是字符串，v<10要转换
            });
            dateArr = _.uniq(dateArr);
            $.each(dateArr, function (k, v) {
                if (v < 10) v = parseInt(v);
                k === 0 ? dateStr = v + '' : dateStr = dateStr + ',' + v; // dateStr必须是字符串，v<10要转换
            });
            var addVal = this.getTimeChangeObj(this.prevMonth + (dateArr.length ? '-' + dateArr[0] : '-1'));
            var that = this;
            this.dateOption = {
                isinitVal: true,
                isvalid: dateArr.length ? [dateStr, true] : ['1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31', false],
                ishmsVal: false,
                // initAddVal: {YYYY:-1, MM: -1, DD: -3},
                language: {
                    name: 'en',
                    month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                    weeks: ['SUN', 'MON', 'TUR', 'WED', 'THU', 'FRI', 'SAT'],
                    times: ['小时', '分钟', '秒数'],
                    clear: '清空',
                    today: '今天',
                    yes: '确定',
                    close: '关闭'
                },
                fixedCell: 'J_date_refix',
                minDate: '1970-01-01',
                maxDate: '2099-01-01',
                format: 'YYYY-MM-DD',
                zIndex: 3000,
                choosefun: function (elem, val, date) {
                    that.filterObj.selDate = val;
                    // elem.val($.nowDate({DD: "+3"}, 'YYYY-MM-DD', val));
                }
            };
            $('.search-result-popup .loading').css('display', 'none');
            $('#J_date_input').val($.nowDate(addVal, 'YYYY-MM-DD', this.nowDate));
            $('#J_date_input').jeDate(this.dateOption);
            // 处理正月没有可选数据的情况
            if (!data.length) {
                $('.jedaul li.action').removeClass('action').addClass('disabled');
                $('.search-confirm').addClass('disabled');
            } else {
                $('.search-confirm').removeClass('disabled');
            }
            // $('#J_date_input').setVaild([dateStr, true]);
        },
        removeLoading: function () {
            $('.result-list').removeClass('loading');
        },
        /**
         * 获取改变的时间参数
         */
        getTimeChangeObj: function (newDate) {
            newDate = _.isDate(newDate) ? newDate : new Date(newDate);
            var oldDate = _.isDate(this.nowDate) ? this.nowDate : new Date(this.nowDate);
            var year = newDate.getFullYear(),
                month = newDate.getMonth() + 1,
                day = newDate.getDate(),
                oldYear = oldDate.getFullYear(),
                oldMonth = oldDate.getMonth() + 1,
                oldDay = oldDate.getDate();
            var changeYear, changeMonth, changeDay;
            year - oldYear >= 0 ? (changeYear = '+' + (year - oldYear)) : (changeYear = year - oldYear);
            month - oldMonth >= 0 ? (changeMonth = '+' + (month - oldMonth)) : (changeMonth = month - oldMonth);
            day - oldDay >= 0 ? (changeDay = '+' + (day - oldDay)) : (changeDay = day - oldDay);
            return { YYYY: changeYear, MM: changeMonth, DD: changeDay };
        },
        /**
         * 设置日历时间
         * @param {新的时间} newDate 外界传递当前新的时间，并更新日历显示
         */
        setTimeChange: function (newDate) {
            newDate = _.isDate(newDate) ? newDate : new Date(newDate);
            // var oldDate = _.isDate(this.nowDate) ? this.nowDate : new Date(this.nowDate);
            var oldDate = _.isDate(this.prevDate) ? this.prevDate : new Date(this.prevDate);
            var year = newDate.getFullYear(),
                month = newDate.getMonth() + 1,
                day = newDate.getDate(),
                oldYear = oldDate.getFullYear(),
                oldMonth = oldDate.getMonth() + 1,
                oldDay = oldDate.getDate(),
                that = this;
            var changeYear, changeMonth, changeDay;
            // 获取单事件回放作业列表
            !this.observer._isPause && this.inWhichTypeRecord === 'singleDevice' && this.getSingleDeviceReplay(newDate);
            if ((oldYear + '-' + oldMonth + '-' + oldDay) === (year + '-' + month + '-' + day)) return;
            // $("#J_date_refix").empty();
            //  		year - oldYear >= 0 ? (changeYear = '+' + (year - oldYear)) : (changeYear = year - oldYear);
            //  		month - oldMonth >= 0 ? (changeMonth = '+' + (month - oldMonth)) : (changeMonth = month - oldMonth);
            //  		day - oldDay >= 0 ? (changeDay = '+' + (day - oldDay)) : (changeDay = day - oldDay);

            //  		$('#J_date_input').val($.nowDate({YYYY: changeYear, MM: changeMonth, DD: changeDay}, 'YYYY-MM-DD', this.nowDate));
            // $('#J_date_input').jeDate(this.dateOption);
            this.prevDate = (year + '-' + month + '-' + day);
            this.prevMonth = year + '-' + month;

            if (!this.observer._recordPop._playerPop.dateData.flagS) return;
            // 时间改变重新加载工作时间的状态
            this.getDeviceWorkDate(year + '-' + month + '-' + day);
            window.setTimeout(function () {
                that.observer._recordPop._playerPop.getWorkingClassInfo(that.workingClassInfo, that.deliverDate);
            }, 0);
            // return {'YYYY': changeYear, 'MM': changeMonth, 'DD': changeDay};
        },
        postData: function (url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var that = this;
            url = '/portvision' + url;
            $.ajax({
                traditional: true,
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
                    //defer.resolve(data);
                },
                error: function (data, status) {
                    fnError && fnError(status);
                }
            });
            return defer.promise;
        }
    });

    return RECORDINFOPOP;
});
