'use strict'
require(['plugin/jsrender/jsrender', 'widget/pagination/pagination'], function(jsrender, Pagination){
    var theadData = [{VAL: '状态', FLAG: 'default', FILTER: true}, {VAL: '告警编号', FLAG: 'default'}, {VAL: '告警级别', FILTER: true, HIDE: false}, {VAL: '告警类型', FILTER: true, HIDE: false}, {VAL: '告警内容', FLAG: 'default'}, {VAL: '发生时间', FLAG: 'default'}];

    var theadTemplates =    '<tr>' +
                                '{{if result.length}}' +
                                    '{{for result}}' +
                                        '<th>' +
                                            '<span class="theadText">{{>VAL}}</span><span class="sort default"></span>' +
                                            '{{if FILTER}}' +
                                                '<div class="filter contentFilter"></div>' +
                                            '{{/if}}' +
                                        '</th>' +
                                    '{{/for}}' +
                                '{{/if}}' +
                            '</tr>';

    var filterDropDownTemplates =   '<ul class="hide dropDown">' +
                                        '{{for result}}' +
                                            '<li>' +
                                                '<input type="checkbox" {{if CODE}}data-code={{>CODE}}{{/if}} {{if NUM}}data-num={{>NUM}}{{/if}} checked {{if FLAG == "default"}}disabled{{/if}}/><span>{{>VAL}}</span>' +
                                            '</li>' +
                                        '{{/for}}' +
                                    '</ul>';


    var tbodyTemplates =    '{{if result.length}}' +
                                '{{for result}}' +
                                    '<tr>' +
                                        '<td data-flag={{>READ_FLAG}} data-id={{>ID}}>' +
                                            '{{if READ_FLAG == "N"}}' +
                                                '<span class="readFlag inline-block" style="background-color: #F26868;"></span>' +
                                            '{{else}}' +
                                                '<span class="readFlag inline-block" style="background-color: #55D173;"></span>' +
                                            '{{/if}}' +
                                        '</td>' +
                                        '<td>{{>ID}}</td>' +
                                        '<td>{{>ALARM_LEVEL}}</td>' +
                                        '<td>{{>ALARM_TYPE}}</td>' +
                                        '<td class="col-sm-3">{{>CONTENT}}</td>' +
                                        '<td>{{>OCCURRENCE_TIME}}</td>' +
                                    '</tr>' +
                                '{{/for}}' +
                            '{{else}}' +
                                '<tr>' +
                                    '<td colspan=6>' +
                                        '<div class="text-center">此条件结果为空</div>' +
                                    '</td>' +
                                '</tr>' +
                            '{{/if}}';

    var obj = function () { }
    obj.prototype = {
        init: function (cfg) {
            this.hiddenTheadIdx = [];
            this.symbol = cfg.symbol;
            this.wraper = cfg.dom;
            this.page = cfg.page;
            this.data = cfg.data;
            this.oneday = 24 * 60 * 60 * 1000;
            this.sortInfo = { order: 'Read_Flag,ALARM_LEVEL,OCCURRENCE_TIME,', sort: 'asc,asc,desc' };
            this.filterInfo = { column: '', val: '', operator: 'IN' };
            this.timeInfo = { beginTime: '', endTime: '' };
            this.searchInfo = { column: 'CONTENT', val: '', operator: 'LIKE' };
            this.theadCount = 6;
            $('#jqxDate').jqxDateTimeInput({ theme: 'energyblue', width: 214, height: 32, selectionMode: 'range', formatString: 'yyyy-MM-dd', max: new Date(), min: '2000-01-01', culture: 'ch-CH', dayNameFormat: 'shortest', showCalendarButton: true, showFooter: true, value: null, placeHolder: '请选择日期范围' });
            this.bindEvent();
            this.render();
            this.pagination = Pagination({
                page: this.page,
                wraper: $('.page'),
                that: this,
                callback: this.getWarnList
            })

            // this.pagination = Pagination({
            //     wraper: $('.page'),
            //     info: {
            //         sortInfo: this.sortInfo,
            //         filterInfo: this.filterInfo,
            //         timeInfo: this.timeInfo,
            //         searchInfo: this.searchInfo,
            //         page: this.page,
            //     },
            //     callback: this.getWarnListByPage,
            // });
        },
        bindEvent: function () {
            var self = this;
            this.wraper.off()
                .on('click', function () {
                    $('.theadFilter').removeClass('btn-clicked');
                    $('.filter .dropDown').addClass('hide');
                })
                // 排序
                .on('click', '.sort', function () {
                    switch ($(this).siblings('.theadText').text()) {
                        case '状态': self.sortInfo.order = 'Read_Flag'; break;
                        case '告警编号': self.sortInfo.order = 'ID'; break;
                        case '告警级别': self.sortInfo.order = 'ALARM_LEVEL'; break;
                        case '告警类型': self.sortInfo.order = 'ALARM_TYPE'; break;
                        case '告警内容': self.sortInfo.order = 'CONTENT'; break;
                        case '发生时间': self.sortInfo.order = 'OCCURRENCE_TIME'; break;
                    }
                    if ($(this).hasClass('asc')) {
                        self.sortInfo.sort = 'desc';
                        $('.sort').removeClass('desc asc');
                        $(this).addClass('desc');
                    }
                    else {
                        self.sortInfo.sort = 'asc';
                        $('.sort').removeClass('desc asc');
                        $(this).addClass('asc');
                    }
                    self.getWarnList();
                })
                .on('click', '.filter', function (ev) {
                    $(this).hasClass('theadFilter') && $(this).addClass('btn-clicked');
                    ev.stopPropagation();
                    $('.filter .dropDown').addClass('hide');
                    $(this).find('.dropDown').removeClass('hide');
                })
                // 表头筛选
                .on('change', '.theadFilter input', function () {
                    var index = $(this).parent().index();
                    if (!$(this).prop('checked')) {
                        self.data.theadData[index].HIDE = true;
                        self.toggleThead(index, self.data.theadData[index].HIDE);
                        self.theadCount -= 1;
                        if (self.theadCount === 5) { self.wraper.find('.table').addClass('filterTheadOne'); }
                        if (self.theadCount === 4) { self.wraper.find('.table').removeClass('filterTheadOne').addClass('filterTheadTwo'); }
                    } else {
                        self.theadCount += 1;
                        self.data.theadData[index].HIDE = false;
                        self.toggleThead(index, self.data.theadData[index].HIDE);
                        if (self.theadCount === 5) { self.wraper.find('.table').addClass('filterTheadOne').removeClass('filterTheadTwo'); }
                        if (self.theadCount === 6) { self.wraper.find('.table').removeClass('filterTheadOne'); }
                    }
                })
                // 过滤筛选
                .on('change', '.contentFilter input', function () {
                    $(this).parents('.contentFilter').addClass('active');
                    var $th = $(this).parents('th').siblings();
                    $th.find('.contentFilter input').prop('checked', true);
                    $th.find('.contentFilter').removeClass('active');
                    var fg = false;
                    $(this).parent().siblings().find('input').each(function (idx, item) {
                        $(item).prop('checked') && (fg = true);
                    })
                    if (!fg) {
                        $(this).prop('checked', true);
                        return;
                    }
                    switch ($(this).parents('th').find('.theadText').text()) {
                        case '状态': self.filterInfo.column = 'Read_Flag'; break;
                        case '告警编号': self.filterInfo.column = 'ID'; break;
                        case '告警级别': self.filterInfo.column = 'ALARM_LEVEL'; break;
                        case '告警类型': self.filterInfo.column = 'ALARM_TYPE'; break;
                        case '告警内容': self.filterInfo.column = 'CONTENT'; break;
                        case '发生时间': self.filterInfo.column = 'OCCURRENCE_TIME'; break;
                    }
                    self.filterInfo.val = '';
                    $(this).parents('.dropDown').find('input').each(function (idx, item) {
                        if (self.filterInfo.column === 'ALARM_LEVEL') {
                            $(item).prop('checked') && (self.filterInfo.val += $(item).attr('data-num') + ',');
                        }
                        if (self.filterInfo.column === 'ALARM_TYPE' || self.filterInfo.column === 'Read_Flag') {
                            $(item).prop('checked') && (self.filterInfo.val += $(item).attr('data-code') + ',');
                        }
                        else {
                            $(item).prop('checked') && (self.filterInfo.val += $(item).siblings().text() + ',');
                        }
                    })
                    self.initCurPage();
                    self.getWarnList();
                })
                // 时间筛选
                .on('click', '.j-today', function () {
                    self.clickBtnTimeBefore($(this));
                    self.timeInfo.beginTime = self.timeInfo.endTime = $(this).hasClass('active') ? self.dateToString(new Date()) : '';
                    self.initCurPage();
                    self.getWarnList();
                })
                .on('click', '.j-yesterday', function () {
                    self.clickBtnTimeBefore($(this));
                    self.timeInfo.beginTime = self.timeInfo.endTime = $(this).hasClass('active') ? self.dateToString(new Date().getTime() - self.oneday) : '';
                    self.initCurPage();
                    self.getWarnList();
                })
                .on('click', '.j-sevenDays', function () {
                    self.clickBtnTimeBefore($(this));
                    self.timeInfo.beginTime = $(this).hasClass('active') ? self.dateToString(new Date().getTime() - self.oneday * 6) : '';
                    self.timeInfo.endTime = $(this).hasClass('active') ? self.dateToString(new Date()) : '';
                    self.initCurPage();
                    self.getWarnList();
                })
                // 搜索筛选
                .on('click', '.j-search', function () {
                    self.searchInfo.val = $('.searchInput input').val();
                    if (self.searchInfo.val) {
                        $(this).addClass('btn-clicked');
                        self.initCurPage();
                        self.getWarnList();
                    }
                })
                .on('input', '.searchInput input', function () {
                    if ($(this).val() === '') {
                        $('.j-search').removeClass('btn-clicked');
                        self.searchInfo.val = '';
                        self.page.curPage = 1;
                        self.getWarnList();
                    }
                })
                // 导出
                .on('click', '.j-export', function () {
                    self.page.curPage = '';
                    self.page.pageSize = '';
                    var time = '';
                    if (self.timeInfo.beginTime === self.timeInfo.endTime) {
                        self.timeInfo.beginTime && (time = '(' + self.timeInfo.beginTime + ')');
                    } else {
                        time = '(' + self.timeInfo.beginTime + ' - ' + self.timeInfo.endTime + ')';
                    }
                    var url = '/portvision/alarm/export?' + self.getUrl(self) + '&fileName=告警列表' + time;
                    $(this).attr('href', url);
                })
                // 未读转变为已读
                .on('click', '.warnListTbody tr', function () {
                    var $tr = $(this).children().eq(0);
                    if ($tr.attr('data-flag') === 'N') {
                        self.refreshWarn($tr.attr('data-id'));
                    }
                })
            // 日历组件
            $('#jqxDate').on('open', function () {
                $('.jqx-action-button').addClass('active');
                var $a = $('.jqx-reset').find('a');
                $a.eq(0).text('今天');
                $a.eq(1).text('清除');
            })
                .on('close', function () {
                    var range = $(this).jqxDateTimeInput('getRange');
                    if (!(range.from && range.to)) {
                        $('.jqx-action-button').removeClass('active');
                    }

                })
                .on('change', function () {
                    var range = $(this).jqxDateTimeInput('getRange');
                    if (!(range.from && range.to)) {
                        $(this).trigger('textchanged');
                        return;
                    }
                    self.timeInfo.beginTime = self.dateToString(range.from);
                    self.timeInfo.endTime = self.dateToString(range.to);
                    $('.btn-group-time .btn').removeClass('active');
                    $('.jqx-action-button').addClass('active');
                    self.initCurPage();
                    self.getWarnList();
                })
                .on('textchanged', function () {
                    var range = $(this).jqxDateTimeInput('getRange');
                    if (!(range.from && range.to)) {
                        $('.jqx-action-button').removeClass('active');
                        self.timeInfo.beginTime = '';
                        self.timeInfo.endTime = '';
                        self.initCurPage();
                        self.getWarnList();
                    }
                })

            $(window).off().resize(function () {
                self.setTbodyHeight();
            })
        },
        refreshWarn: function (id) {
            var self = this;
            if (!!id) {
                $.ajax({
                    method: 'post',
                    url: '/portvision/alarm/' + id,
                    success: function (data) {
                        console.log('读取告警信息，并返回' + data);
                        self.refreshWarnNum();
                    },
                    fail: function (error) {
                        console.log(error);
                    }
                });
            }
        },
        refreshWarnNum: function () {
            var self = this;
            $.ajax({
                method: 'get',
                url: '/portvision/alarm/count?column=READ_FLAG&operator=EQUALS&value=N',
                success: function (data) {
                    data = JSON.parse(data);
                    self.data.countData.COUNT = data.COUNT;
                    self.wraper.find('.num').text(self.data.countData.COUNT);
                    self.getWarnList();
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },
        initCurPage: function () {
            this.page.curPage = 1;
        },
        clickBtnTimeBefore: function (obj) {
            $('#jqxDate').jqxDateTimeInput('destroy');
            $('#jqxDateWraper').html('<div id="jqxDate"></div>');
            $('#jqxDate').jqxDateTimeInput({ theme: 'energyblue', width: 214, height: 32, selectionMode: 'range', formatString: 'yyyy-MM-dd', max: new Date(), min: '2000-01-01', culture: 'ch-CH', dayNameFormat: 'shortest', showCalendarButton: true, showFooter: true, value: null, placeHolder: '请选择日期范围' });
            this.bindEvent();
            this.page.curPage = 1;
            if (obj.hasClass('active')) {
                obj.removeClass('active');
                return;
            }
            obj.addClass('active').siblings().removeClass('active');
            $('.jqx-action-button').removeClass('active');
        },
        getWarnList: function (that) {
            var self = that || this;
            var ajaxConfig = {
                method: 'get',
                // url: '/portvision/object/alarm?' + 'order=' + self.sortInfo.order + '&sort=' + self.sortInfo.sort + '&currentPage=' + self.page.curPage + '&pageSize=' + self.page.pageSize + '&key=' + self.filterInfo.column + '&operator=IN&value=' + self.filterInfo.val,          
                url: '/portvision/alarm/search?' + self.getUrl(self),
                data: '',
                success: function (data) {
                    var data = JSON.parse(data);
                    self.renderTbody(data);
                    self.page.totalPage = data.pages;
                    self.pagination.refreshPagedata(self.page);
                    self.pagination.renderPagination();
                    $.each(self.data.theadData, function (idx, item) {
                        !item.FLAG && item.HIDE && self.toggleThead(idx, item.HIDE);
                    })

                },
                error: function (e) {
                    console.log(e);
                }
            };
            $.ajax(ajaxConfig);
        },
        getUrl: function (self) {
            var order = 'order=' + self.sortInfo.order + '&sort=' + self.sortInfo.sort;
            var page = '&currentPage=' + self.page.curPage + '&pageSize=' + self.page.pageSize;
            var time = '&beginTime=' + self.timeInfo.beginTime + '&endTime=' + self.timeInfo.endTime;
            var operator;
            if (self.filterInfo.val && self.searchInfo.val) {
                operator = '&column=' + self.filterInfo.column + self.symbol + self.searchInfo.column + '&operator=' + self.filterInfo.operator + self.symbol + self.searchInfo.operator + '&value=' + self.filterInfo.val + self.symbol + self.searchInfo.val;
            }
            else if (self.filterInfo.val && !self.searchInfo.val) {
                operator = '&column=' + self.filterInfo.column + '&operator=' + self.filterInfo.operator + '&value=' + self.filterInfo.val;
            }
            else {
                operator = '&column=' + self.searchInfo.column + '&operator=' + self.searchInfo.operator + '&value=' + self.searchInfo.val;
            }
            return order + page + time + operator;
        },
        // getWarnListByPage: function(info){
        //     var self = info;
        //     var order = 'order=' + self.sortInfo.order + '&sort=' + self.sortInfo.sort;
        //     var page = '&currentPage=' + self.page.curPage + '&pageSize=' + self.page.pageSize;
        //     var time = '&beginTime=' + self.timeInfo.beginTime + '&endTime=' + self.timeInfo.endTime;
        //     var operator;
        //     if(self.filterInfo.val && self.searchInfo.val){
        //         operator = '&column=' + self.filterInfo.column + self.symbol + self.searchInfo.column + '&operator=' + self.filterInfo.operator + self.symbol + self.searchInfo.operator + '&value=' + self.filterInfo.val + self.symbol + self.searchInfo.val; 
        //     }
        //     else if(self.filterInfo.val && !self.searchInfo.val){
        //         operator = '&column=' + self.filterInfo.column + '&operator=' + self.filterInfo.operator + '&value=' + self.filterInfo.val;  
        //     }
        //     else{
        //         operator = '&column=' + self.searchInfo.column + '&operator=' + self.searchInfo.operator + '&value=' + self.searchInfo.val; 
        //     }

        //    // if(!self.filterInfo.val){
        //    //      operator = '&column=' + self.searchInfo.column + '&operator=LIKE&value=' + self.searchInfo.val; 
        //    // }
        //     var ajaxConfig = {
        //             method: 'get',              
        //             // url: '/portvision/object/alarm?' + 'order=' + self.sortInfo.order + '&sort=' + self.sortInfo.sort + '&currentPage=' + self.page.curPage + '&pageSize=' + self.page.pageSize + '&key=' + self.filterInfo.column + '&operator=IN&value=' + self.filterInfo.val,          
        //             url: '/portvision/alarm/search?' + order + page + time + operator,
        //             data: '',
        //             success: function( data ){
        //                 var data = JSON.parse(data);
        //                 self.renderTbody(data);
        //                 this.page.totalPage = data.pages;
        //                 this.renderPagenation();
        //                 $.each(self.data.theadData, function(idx, item){
        //                     !item.FLAG && item.HIDE && self.toggleThead(idx, item.HIDE);
        //                 })

        //             },
        //             error:function( e ){
        //                 console.log(e); 
        //             }
        //         };  
        //     $.ajax( ajaxConfig );
        // },
        /**
         *  desc: padding字符串 
         */
        strPadding: function (str, n, rep) {
            if (str === '') return;
            if (!n) return str;
            str = str.toString();
            str = str.replace(/^\s+|\s+$/g, '');
            var len = str.length;
            if (len >= n) return str;
            if (typeof (rep) === 'undefined') {
                rep = '0';
            }
            rep = rep.toString();
            for (var i = 0, l = n - len; i < l; i++) {
                str = rep + str;
            }
            return str;
        },
        /**
         * desc: 格式化日期
         * @param date ： {Date}
         * @return dateStr: {String}
        */
        dateToString: function (date) {
            date = _.isDate(date) ? date : new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();
            // return year + '-' + this.strPadding(month,2) + '-' + this.strPadding(day,2) + ' ' + this.strPadding(hour, 2) + ':' + this.strPadding(minute, 2) + ':' + this.strPadding(second, 2);
            return year + '-' + this.strPadding(month, 2) + '-' + this.strPadding(day, 2);
        },
        render: function () {
            var self = this;
            this.wraper.find('.num').text(this.data.countData.COUNT);
            this.renderThead();
            this.renderTbody();
            $.each(this.wraper.find('.filter'), function (idx, item) {
                var data;
                switch ($(item).parent().text()) {
                    case '状态': data = self.mapREAD_FLAG(self.data.theadFilterData.READ_FLAG, 'VAL'); break;
                    case '告警级别': data = self.mapALARM_LEVEL(self.data.theadFilterData.ALARM_LEVEL, 'VAL'); break;
                    case '告警类型': data = self.mapALARM_TYPE(self.data.theadFilterData.ALARM_TYPE, 'VAL'); break;
                    default: data = self.data.theadData; break;
                }
                var temp = jsrender.templates(filterDropDownTemplates).render({ result: data });
                $(item).html(temp);
            })
        },
        toggleThead: function (index, hide) {
            hide ? $('.warnListThead th').eq(index).hide() : $('.warnListThead th').eq(index).show();
            $('.warnListTbody tr').each(function (idx, item) {
                hide ? $(item).find('td').eq(index).hide() : $(item).find('td').eq(index).show();
            })
        },
        renderFilterDropDown: function (data, obj) {
            var temp = jsrender.templates(filterDropDownTemplates).render({ result: data });
            obj.html(temp);
        },
        renderThead: function (data) {
            var data = data || this.data.theadData;
            var temp = jsrender.templates(theadTemplates).render({ result: data });
            this.wraper.find('.warnListThead').html(temp);
        },
        renderTbody: function (data) {
            var data = data || this.data.warnData;
            data = this.mapALARM_LEVEL(data.result, 'ALARM_LEVEL');
            data = this.mapALARM_TYPE(data, 'ALARM_TYPE');
            var temp = jsrender.templates(tbodyTemplates).render({ result: data });
            var $tbody = this.wraper.find('.warnListTbody');
            $tbody.html(temp);
            this.setTbodyHeight();
        },
        setTbodyHeight: function () {
            var $tbody = this.wraper.find('.warnListTbody');
            $tbody.height('auto');
            if ($tbody.height() >= ($(window).height() - 310)) {
                $tbody.parent('table').addClass('over');
                $tbody.css('height', ($('body').height() - 310) + 'px');
            } else {
                $tbody.parent('table').removeClass('over');
            }
        },
        mapALARM_LEVEL: function (data, attr) {
            $.each(data, function (idx, item) {
                switch (item[attr]) {
                    case '1': item.NUM = item[attr]; item[attr] = '一般'; break;
                    case '2': item.NUM = item[attr]; item[attr] = '提示'; break;
                    case '3': item.NUM = item[attr]; item[attr] = '主要'; break;
                    case '4': item.NUM = item[attr]; item[attr] = '严重'; break;
                }
            })
            return data;
        },
        mapALARM_TYPE: function (data, attr) {
            $.each(data, function (idx, item) {
                switch (item[attr]) {
                    case 'WX': item.CODE = item[attr]; item[attr] = '危险货物监控'; break;
                    case 'YW': item.CODE = item[attr]; item[attr] = '意外事故'; break;
                    case 'HJ': item.CODE = item[attr]; item[attr] = '环境告警'; break;
                    case 'ZYCW': item.CODE = item[attr]; item[attr] = '作业操作错误'; break;
                    case 'ZYYD': item.CODE = item[attr]; item[attr] = '作业拥堵'; break;
                    case 'ZYWG': item.CODE = item[attr]; item[attr] = '作业违规'; break;
                    case 'GZ': item.CODE = item[attr]; item[attr] = '故障'; break;
                }
            })
            return data;
        },
        mapREAD_FLAG: function (data, attr) {
            $.each(data, function (idx, item) {
                switch (item[attr]) {
                    case 'N': item.CODE = item[attr]; item[attr] = '未读'; break;
                    case 'Y': item.CODE = item[attr]; item[attr] = '已读'; break;
                }
            })
            return data;
        }

    }
    var symbol = '@';
    var ajaxConfig = {
        method: 'get',
        url: '/portvision/alarm/search?order=Read_Flag,ALARM_LEVEL,OCCURRENCE_TIME&sort=asc,asc,desc&currentPage=1&pageSize=10',
        data: '',
        success: function (data) {
            var warnData = JSON.parse(data);
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/alarm/value?column=ALARM_LEVEL' + symbol + 'READ_FLAG' + symbol + 'ALARM_TYPE',
                data: '',
                success: function (data) {
                    var theadFilterData = JSON.parse(data);
                    var ajaxConfig = {
                        method: 'get',
                        url: '/portvision/alarm/count?column=READ_FLAG&operator=EQUALS&value=N',
                        data: '',
                        success: function (data) {
                            var countData = JSON.parse(data);
                            var temp = new obj();
                            temp.init({
                                dom: $('body'),
                                data: {
                                    warnData: warnData,
                                    theadFilterData: theadFilterData,
                                    theadData: theadData,
                                    countData: countData
                                },
                                symbol: symbol,
                                page: {
                                    pageSize: 10,
                                    curPage: 1,
                                    totalPage: warnData.pages
                                }
                            });
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    };
                    $.ajax(ajaxConfig);
                },
                error: function (e) {
                    console.log(e);
                }
            };
            $.ajax(ajaxConfig);
            // var temp = new obj();
            // temp.init({
            //     dom: $('body'),
            //     data: warnData,
            //     page: {
            //         pageSize: 10,
            //         curPage: 1,
            //         // totalPage: data.pages,
            //         totalPage: 11,
            //     },
            //     theadData: theadData,
            // });
        },
        error: function (e) {
            console.log(e);
        }
    };
    $.ajax(ajaxConfig);
})
