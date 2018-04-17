/**
 * @moudule portvision/mod/RECORDINFOPOP 回放页面弹框
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');

    var recordToolBarTemp =
        '<div class="back-filter-group record-search-item">' +
            '<div id="go-back-btn"><a href="#/home">返回</a></div>' +
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
                '<h3 class="panel-title">筛选条件</h3>' +
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
            this._observer = cfg._observer || null;
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
            this.defaultSearchList = {
                'searchList': [
                    { 'num': 'T01', 'license': '1423751' },
                    { 'num': 'T02', 'license': '1423752' },
                    { 'num': 'T03', 'license': '1423753' }
                ]
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
            var self = this;
            var periodArr = [];
            $('#recordToolBar').on('click', '#record-filter-btn', function () {
                $('#record-filter-btn').toggleClass('active');
                // 隐藏搜索结果框
                $('#J_search_result').removeClass('curr-active');
                self.renderFilterOptions();
                var filterOptionPanel = $('#J_filter_option');
                filterOptionPanel.toggleClass('curr-active');
            })
                .on('click', '.dropdown-menu li', function () {
                    $('#J_search_result').removeClass('curr-active');
                    $('.btn-group button.dropdown-toggle').html($(this).text() + ' <span class="caret"></span>');
                    $('.input-group input').attr('placeholder', $(this).text().indexOf('船名航次') > -1 ? '请输入船名航次编号' : '请输入设备编号');
                })
                .on('click', '#go-back-btn', function (ev) {
                    self.observer.pausePlayback();
                    $('.mc-btn-goback').trigger('click');
                    console.log(ev)
                })
                .on('click', '.mc-switch', function (ev) { // 筛选选项按钮
                    var currSwitch = $(ev.currentTarget);
                    var selItem = currSwitch.children('.mc-switch-active');
                    var selFilterType = (currSwitch.parents('table').attr('filter-type') === '按作业类型') ? 'jobs' : 'devices';
                    var selFilterIdx = currSwitch.attr('data-id');
                    selItem.removeClass('mc-switch-active');
                    var checkedList = [];
                    var type = '';
                    if (selFilterType === 'devices') {
                        switch (+selFilterIdx) {
                            case 0: type = 'container'; break;
                            case 1: type = 'gantrycrane'; break;
                            case 2: type = 'stacker'; break;
                            case 3: type = 'reachstacker'; break;
                            case 4: type = 'bridgecrane'; break;
                        }
                    }
                    if (selItem.text() === 'ON') {
                        currSwitch.children('.mc-switch-off').addClass('mc-switch-active');
                        self.filterData[selFilterType][selFilterIdx].status = 0;
                        $.each(self.observer._overMap[type], function () {
                            checkedList.push('false');
                        })
                    } else {
                        currSwitch.children('.mc-switch-on').addClass('mc-switch-active');
                        self.filterData[selFilterType][selFilterIdx].status = 1;
                        $.each(self.observer._overMap[type], function () {
                            checkedList.push('true');
                        })
                    }
                    var filterObj = {
                        'LOAD': self.filterData.jobs[0].status,
                        'DSCH': self.filterData.jobs[1].status,
                        'RECV': self.filterData.jobs[2].status,
                        'DLVR': self.filterData.jobs[3].status,
                        'container': self.filterData.devices[0].status,
                        'gantrycrane': self.filterData.devices[1].status,
                        'emptyContainer': self.filterData.devices[2].status,
                        'reachstacker': self.filterData.devices[3].status,
                        'bridgecrane': self.filterData.devices[4].status
                    };

                    self.observer.playWithFiter(filterObj);
                    // todo:
                    // 通知隐藏相关设备
                    if (selFilterType === 'devices') {
                        // self.observer.updateObjectChecked( type, checkedList );
                    }
                })
                .on('keyup', '#search', function () { // 搜索框键盘事件

                    var val = $(this).val();
                    if (val === '') {
                        $('#J_search_result').removeClass('curr-active');
                        return;
                    }
                    var text = $(this).attr('placeholder');
                    if (text.indexOf('船名航次') > -1) {
                        if (val.length >= 4) {
                            self.searchType = 'ctn';
                            self.showSearchResultPop();
                            var url = '/lycos/' + val + '?type=voyage',
                                method = 'GET',
                                params = {},
                                fnSuccess = self.renderSearchResult;
                            self.postData(url, method, params, fnSuccess);
                        } else {
                            $('#J_search_result').removeClass('curr-active');
                        }
                    }
                    else if (text.indexOf('设备') > -1) {
                        if (val.length >= 2) {
                            self.searchType = 'eq';
                            self.showSearchResultPop();
                            var url = '/lycos/' + val + '?type=equip',
                                method = 'GET',
                                params = {},
                                fnSuccess = self.renderSearchResult;
                            self.postData(url, method, params, fnSuccess);
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
                    self.hidePop();
                    $('#search').val('');
                    $('#J_device_replay .mc-panel').removeClass('curr-active');
                    $('.record-search-item').addClass('short');
                    $(this).parent().addClass('hide');
                    self.isSingleDeviceRp = false;
                    self._observer._playerPop.workingClassInfo = {};
                    self._observer._playerPop.dateData.flagS = false;
                    self._observer._playerPop.dateData.flagC = false;
                    // self.observer.setDate($.nowDate(0));
                    $('.j-workingTip').addClass('hide');
                    self.observer.playTheSingleEquipment({
                        searchCode: '',
                        searchEqType: '',
                        searchJobType: ''
                    });
                    // self.observer.setDate(self.nowDate);
                    // self.observer.startPlayback(true);
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
                    self.hidePop();
                })
                .on('click', '.j-search-confirm', function () {
                    if (!self.filterObj.selDate) return;
                    if ($('.search-confirm').hasClass('disabled')) return;
                    !($('.result-list').text().indexOf('无搜索结果') > -1) && ($('.record-search-item').removeClass('short'));
                    // 设置时间
                    console.log(self.filterObj.selDate);
                    self.filterObj.selDate = $('.jedaul li.action').attr('data-ymd');
                    self._observer._playerPop.dateData.flagC = false;
                    self._observer._playerPop.dateData.flagS = true;
                    self._observer._playerPop.setTimeChange(self.filterObj.selDate);
                    self._observer._playerPop.getWorkingClassInfo(self.workingClassInfo, self.deliverDate);
                    self.observer.setDate(self.filterObj.selDate);

                    $('#search').val(self.selectData);

                    var searchCode = '',
                        searchEqType = '',
                        searchJobType = '';
                    switch (self.selectType) {
                        case 'truck': searchEqType = 'T'; break;
                        case 'bridgeCrane': searchEqType = 'CR'; break;
                        case 'gantryCrane': searchEqType = 'RT'; break;
                        case 'emptyContainerHandlers': searchEqType = 'P'; break;
                        case 'reachStacker': searchEqType = 'F'; break;
                        case 'voyage': searchEqType = 'V'; break;
                    }

                    // 显示事件回放面板
                    if ($('.btn-group>button').text().indexOf('机械设备') > -1) {
                        self.isSingleDeviceRp = true;
                        // self.renderDeviceReplay();
                        // switch(self.selectType) {
                        // 	case 'truck': searchEqType = 'T'; break;
                        // 	case 'bridgeCrane': searchEqType = 'CR'; break;
                        // 	case 'gantryCrane': searchEqType = 'RT'; break;
                        // 	case 'emptyContainerHandlers': searchEqType = 'P'; break;
                        // 	case 'reachStacker': searchEqType = 'F'; break;
                        // }
                        var searchJobs = [];
                        // 未设置作业筛选时，默认全部显示
                        if (!self.filterObj.jobs) {
                            searchJobs.push('LOAD');
                            searchJobs.push('DSCH');
                            searchJobs.push('RECV');
                            searchJobs.push('DLVR');
                        } else {
                            self.filterObj.jobs[0].status === 1 && searchJobs.push('LOAD');
                            self.filterObj.jobs[1].status === 1 && searchJobs.push('DSCH');
                            self.filterObj.jobs[2].status === 1 && searchJobs.push('RECV');
                            self.filterObj.jobs[3].status === 1 && searchJobs.push('DLVR');
                        }
                        self.searchJobs = searchJobs;
                        var obj = {
                            searchCode: self.selectData,
                            searchEqType: searchEqType,
                            searchJobType: searchJobs
                        }
                        // TODO: 需要传值（搜索的设备或船名）
                        self.observer.playTheSingleEquipment(obj);
                        self.getSingleDeviceReplay(self.filterObj.selDate);
                    } else {
                        $('#J_device_replay').html('');
                        var searchJobs = [];
                        if (!self.filterObj.jobs) {
                            searchJobs.push('LOAD');
                            searchJobs.push('DSCH');
                        } else {
                            self.filterObj.jobs[0].status === 1 && searchJobs.push('LOAD');
                            self.filterObj.jobs[1].status === 1 && searchJobs.push('DSCH');
                        }

                        var obj = {
                            searchCode: self.selectData,
                            searchEqType: searchEqType,
                            searchJobType: searchJobs
                        }
                        self.observer.playTheVoyageEquipment(obj);
                    }

                    //console.log(self.observer.getDate());
                    self.hidePop();
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

                    self.renderSearchResult([{ CODE: $(this).text() }]);
                    self.selectData = $(this).text();
                    self.selectType = $(this).attr('searchType');
                    $('.result-list tr').addClass('disabled');		// 选定一条重新渲染后，不能点击
                    $('.search-result-popup .loading').css('display', 'block');
                    // self.prevMonth = self.nowDate.substr(0,10); // 用来记录判断日历时间发生变化
                    // self.getDeviceWorkDate(self.nowDate.substr(0, 10)); // 获取当前月份的工作状况
                    // self.prevMonth = self.prevDate.substr(0, 7);
                    self.getDeviceWorkDate(self.prevDate); // 获取当前月份的工作状况
                    // // todo: 请求设备当月的工作情况
                    // // self.renderDate(self);
                    // setTimeout(function(){self.renderDate(self)}, 1 * 1000);
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
                    if (self.prevMonth === nowMonth) return;
                    self.prevMonth = nowMonth;
                    self.getDeviceWorkDate(nowMonth + '-1');
                });
            // 告诉record改变时间的方法
            self.observer.setTimeChangeCallback && self.observer.setTimeChangeCallback(self.setTimeChange, self);
        },
        renderFilterOptions: function (data) {
            $.each(data, function (k, v) {
                var optionData = {};
                optionData.filterType = k === 'jobs' ? '按作业类型' : '按设备类型';
                optionData.options = v;
                $.each(optionData.options, function (m, n) {
                    n.idx = m;
                })
                var filterOptWrapper = jsrender.templates(filterOptionTemp).render(optionData);
                $('.filter-popup .panel-body').append(filterOptWrapper);
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
            this.observer.startPlayback();
        },
        /**
         * render搜索结果弹框
         */
        renderSearchResult: function (data) {
            var renderData = {
                'searchList': data,
                'searchType': this.searchType
            }
            var searchWraper = jsrender.templates(searchPanelTemp).render(renderData);
            $('#J_search_result').html(searchWraper);
            console.log(this.filterObj.selDate);
        },
        /**
         * render事件回放面板
         */
        renderDeviceReplay: function (data) {
            var deviceReplay = jsrender.templates(deviceReplayPanelTemp).render(data.JOBLIST[0]);
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
                params = { 'equipType': searchEqType, 'jobType': this.searchJobs, 'time': 1503903137000 },
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
                case 'voyage': dataTp = 'vessel'; break;
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
            var self = this;
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
                choosefun: function (elem, val) {
                    self.filterObj.selDate = val;
                    // elem.val($.nowDate({DD: "+3"}, 'YYYY-MM-DD', val));
                    console.log(elem.val());
                    // console.log(self.filterObj.selDate);
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
            // $("#J_date_input").setVaild([dateStr, true]);
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
                self = this;
            // var changeYear, changeMonth, changeDay;
            // 获取单事件回放作业列表
            this.getSingleDeviceReplay(newDate);
            if ((oldYear + '-' + oldMonth + '-' + oldDay) === (year + '-' + month + '-' + day)) return;
            // $("#J_date_refix").empty();
            //  		year - oldYear >= 0 ? (changeYear = '+' + (year - oldYear)) : (changeYear = year - oldYear);
            //  		month - oldMonth >= 0 ? (changeMonth = '+' + (month - oldMonth)) : (changeMonth = month - oldMonth);
            //  		day - oldDay >= 0 ? (changeDay = '+' + (day - oldDay)) : (changeDay = day - oldDay);

            //  		$('#J_date_input').val($.nowDate({YYYY: changeYear, MM: changeMonth, DD: changeDay}, 'YYYY-MM-DD', this.nowDate));
            // $('#J_date_input').jeDate(this.dateOption);
            this.prevDate = (year + '-' + month + '-' + day);
            this.prevMonth = year + '-' + month;

            if (!this._observer._playerPop.dateData.flagS) return;
            // 时间改变重新加载工作时间的状态
            this.getDeviceWorkDate(year + '-' + month + '-' + day);
            window.setTimeout(function () {
                self._observer._playerPop.getWorkingClassInfo(self.workingClassInfo, self.deliverDate);
            }, 0);
            // return {'YYYY': changeYear, 'MM': changeMonth, 'DD': changeDay};
        },
        postData: function (url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var self = this;
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
                    // self.removeLoading();
                    fnSuccess && fnSuccess.call(self, data);
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
