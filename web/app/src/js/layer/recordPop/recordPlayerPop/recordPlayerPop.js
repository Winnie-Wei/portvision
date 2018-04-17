
/**
 * @moudule portvision/mod/RECORDPLAYERPOPPOP 回放播放器
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');

    var playerTemp =
        '<div class="j-wrapper">' +
            '<div class="j-oc">' +
            '</div>' +
            '<div>' +
                '<div class="j-player">' +
                    '<div class ="j-date">' +
                        '<div>' +
                            // '<div class="btn-group lr" role="group" aria-label="...">' +
                            //     '<button type="button" class="active btn btn-default">{{>showYear}}年</button>' +
                            //     '<button type="button" class="btn btn-default">{{>showMonth}}月</button>' +
                            //     '<button type="button" class="btn btn-default">{{>showDay}}日</button>' +
                            // '</div>' +
                        '</div>' +
                        '<div>' +
                            '<ul class="lr">' +
                                // '<li class="previous active"><</li>' +
                                // '<li>{{>showYear-1}}</li>' +
                                // '<li class="active current">{{>showYear}}</li>' +
                                // '<li>{{>showYear+1}}</li>' +
                                // '<li class="next active">></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                    '<div class="j-progressBar">' +
                        // '<div>' +
                        //     '<p>上一工班</p>' +
                        //     '<p class="active"><<</p>' +
                        //     '<p class="time">0:00:00</p>' +
                        // '</div>' +
                        // '<div>' +
                        //     '<p>下一工班</p>' +
                        //     '<p class="active">>></p>' +
                        //     '<p class="time">8:00:00</p>' +
                        // '</div>' +
                        // '<div class="bar">' +
                        //     '<div>' +
                        //         '<p>1</p>' +
                        //         '<p class="time">2:00:00</p>' +
                        //     '</div>' +
                        //     '<div>' +
                        //         '<p>2</p>' +
                        //         '<p class="time">4:00:00</p>' +
                        //     '</div>' +
                        //     '<div>' +
                        //         '<p>3</p>' +
                        //         '<p class="time">6:00:00</p>' +
                        //     '</div>' +
                        //     '<span>进度条中心圆形按钮</span>' +
                        //     '<tooltip>13:24:46</tooltip>' +
                        // '</div>' +
                    '</div>' +
                    // '<div class="hour">' +
                    //     '<p class="time">4:00:00</p>' +
                    //     '<p class="time">4:00:00</p>' +
                    //     '<p class="time">4:00:00</p>' +
                    //     '<p class="time">4:00:00</p>' +
                    //     '<p class="time">4:00:00</p>' +
                    // '</div>' +
                    '<div class="j-btn">' +
                        // '<div class="l">' +
                        //     '<div>播放速率</div>' +
                        //     '<div class="btn-group" role="group" aria-label="...">' +
                        //         '<button type="button" class="btn btn-default btn-sm">1倍</button>' +
                        //         '<button type="button" class="btn btn-default btn-sm active">4倍</button>' +
                        //         '<button type="button" class="btn btn-default btn-sm">8倍</button>' +
                        //         '<button type="button" class="btn btn-default btn-sm">16倍</button>' +
                        //     '</div>' +
                        // '</div>' +
                        '<div class="r">' +
                            '<button type="button" class="btn btn-default btn-sm zt">暂停</button>' +
                            '<button type="button" class="btn btn-default btn-sm active qd">启动</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var upDateTemp =
        '<div class="btn-group lr" role="group" aria-label="...">' +
            '<button type="button" class="btn btn-default">{{>showYear}}年</button>' +
            '<button type="button" class="btn btn-default">{{>showMonth}}月</button>' +
            '<button type="button" class="btn btn-default">{{>showDay}}日</button>' +
        '</div>' +
        '<span class="j-refresh hide">343244</span>';

    var downDateTemp =
        '<li class="previous active"><</li>' +
        '{{for dateArr}}' +
            '{{if #data==#parent.parent.data.upCurnum}}' +
                '<li class="active">{{:#data}}</li>' +
            '{{else (#parent.parent.data.flag=="year") && (#parent.parent.data.initDate.showYear<#data)}}' +
                '<li class="disabled">{{:#data}}</li>' +
            '{{else (#parent.parent.data.flag=="month") && (#parent.parent.data.initDate.showYear==#parent.parent.data.newDate.showYear && #parent.parent.data.initDate.showMonth<#data)}}' +
                '<li class="disabled">{{:#data}}</li>' +
            '{{else (#parent.parent.data.flag=="day") && ((#parent.parent.data.initDate.showYear==#parent.parent.data.newDate.showYear && #parent.parent.data.initDate.showMonth<#parent.parent.data.newDate.showMonth) || (#parent.parent.data.initDate.showYear==#parent.parent.data.newDate.showYear && #parent.parent.data.initDate.showMonth==#parent.parent.data.newDate.showMonth && #parent.parent.data.initDate.showDay<#data) )}}' +
                '<li class="disabled">{{:#data}}</li>' +
            '{{else}}' +
                '<li>{{:#data}}</li>' +
            '{{/if}}' +
        '{{/for}}' +
        '<li class="next active">></li>';

    var workingClassTemp =
        '<div class="preWorkingClass workingClass">' +
            '<p>上一工班</p>' +
            '<p class="active"><<</p>' +
            '<p class="time">{{>stime}}</p>' +
        '</div>' +
        '<div class="nexWorkingClass workingClass">' +
            '<p>下一工班</p>' +
            '<p class="active">>></p>' +
            '<p class="time">{{>etime}}</p>' +
        '</div>' +
        '<div class="bar">' +
            '{{for mtime}}' +
                '<div>' +
                    '<p>1</p>' +
                    '<p class="time">{{:#data}}</p>' +
                '</div>' +
            '{{/for}}' +
            '<span>进度条中心圆形按钮</span>' +
            '<tooltip>13:24:46</tooltip>' +
            '<p class="already">已播放历史</p>' +
            // '<p>未播放历史</p>' +
            '<p class="future">未来</p>' +
        '</div>';

    var noWorkingClassTipTemp =
        '<div class="j-workingTip hide">' +
            '<div>' +
                '<h3 class="pull-left">提示</h3>' +
                '<span class="j-close pull-right">X</span>' +
                '<p>该工班暂无作业，请切换至下一工班</p>' +
            '</div>' +
        '</div>';

    var RECORDPLAYERPOP = function (cfg) {
        if (!(this instanceof RECORDPLAYERPOP)) {
            return new RECORDPLAYERPOP().init(cfg);
        }
    }

    RECORDPLAYERPOP.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this.observer = cfg.observer || null;
            var date = new Date();
            this.dateData = cfg.dateData || {
                'showDate': date,
                'showYear': date.getFullYear(),
                'showMonth': date.getMonth() + 1,
                'showDay': date.getDate(),
                'showHours': date.getHours(),
                'showMinutes': date.getMinutes(),
                'showSeconds': date.getSeconds(),
                'showHMS': date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                'dateArr': [date.getFullYear() - 1, date.getFullYear(), date.getFullYear() + 1],
                'upCurnum': date.getFullYear(),
                'flag': 'year',     // 初始化时判断downDateTemp模板
                'initDate': { 'showYear': date.getFullYear() },
                'date': date,
                'stime': '0:00:00',
                'etime': '8:00:00',
                'mtime': ['2:00:00', '4:00:00', '6:00:00'],
                'flagC': false,  // 判断是否展开选择时间
                'flagS': false // 判断是否进入搜索
            };
            this.workingClassInfo = {
                data: [],
                ym: ''
            };
            this.dateDataCopy = $.extend(true, {}, this.dateData);
            this.ymdData = {        // 判断未来时间不能点击用到
                'date': date,
                'showYear': date.getFullYear(),
                'showMonth': date.getMonth() + 1,
                'showDay': date.getDate(),
                'ymd': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            }
            this.observer.startPlayback && this.observer.startPlayback();
            this.observer.setTimeChangeCallback && this.observer.setTimeChangeCallback(this.setTimeChange, this);
            this.setFuture();
            this.bindEvent();
            return this;
        },
        bindEvent: function () {
            var self = this;
            $('#player')
                // j-oc
                .on('click', '.j-oc', function () {
                    $('.j-player').toggleClass('hide');
                    $('.j-wrapper>div:nth-child(2)').toggleClass('hidebottom');
                    $('.j-oc').toggleClass('fz');
                })
                // j-date
                .on('click', '.j-date .btn-group button', function () {
                    self.dateData.flagC = true;
                    $('.j-refresh').removeClass('hide');
                    $(this).addClass('active')
                        .siblings().removeClass('active');
                    self.setDateud($(this));
                })
                .on('click', '.j-date li.previous', function () {
                    self.setDatelr($(this), 'l');
                })
                .on('click', '.j-date li.next', function () {
                    self.setDatelr($(this), 'r');
                })
                .on('click', '.j-date li:not(.previous,.next,.active)', function () {
                    // self.dateData = $.extend(true, {}, self.dateDataCopy);
                    var upCurtext = $('.j-date .btn.active').text();
                    switch (upCurtext.charAt(upCurtext.length - 1)) {
                        case '年':
                            self.dateData.showYear = parseInt($(this).text());
                            var curMondays = self.judgeDate(self.dateData.showYear, 2);
                            self.dateData.showDay = ((self.dateData.showMonth == 2) && (self.dateData.showDay > curMondays)) ? curMondays : self.dateData.showDay;
                            var newYmd = self.dateData.showYear + '-' + self.dateData.showMonth + '-' + self.dateData.showDay;
                            if (self.compareDate(newYmd, self.ymdData.ymd)) {
                                self.dateData.showYear = self.ymdData.showYear;
                                self.dateData.showMonth = self.ymdData.showMonth;
                                self.dateData.showDay = self.ymdData.showDay;
                            }
                            self.renderUpDate();
                            $('.j-date .btn:first-child').addClass('active');
                            break;
                        case '月':
                            self.dateData.showMonth = parseInt($(this).text());
                            var curMondays = self.judgeDate(self.dateData.showYear, self.dateData.showMonth);
                            (self.dateData.showDay > curMondays) && (self.dateData.showDay = curMondays);
                            var newYmd = self.dateData.showYear + '-' + self.dateData.showMonth + '-' + self.dateData.showDay;
                            if (self.compareDate(newYmd, self.ymdData.ymd)) {
                                self.dateData.showYear = self.ymdData.showYear;
                                self.dateData.showMonth = self.ymdData.showMonth;
                                self.dateData.showDay = self.ymdData.showDay;
                            }
                            self.renderUpDate();
                            $('.j-date .btn:nth-child(2)').addClass('active');
                            break;
                        case '日':
                            self.dateData.showDay = parseInt($(this).text());
                            self.renderUpDate();
                            $('.j-date .btn:last-child').addClass('active');
                            break;
                    }
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.j-refresh').removeClass('hide')
                    self.initWorkingClassTime();
                    self.renderWorkingClass(self.dateData);
                    // self.useSetDate(self.dateData.stime);
                    self.setFuture();
                    self.judgeWorkingClass();
                })
                .on('click', '.j-refresh', function () {
                    self.dateData.flagC = false;
                    self.useSetDate(self.dateData.stime);
                    $(this).addClass('hide');
                    $('.j-date ul').html('');
                    $('.j-date .btn-group.lr .btn').removeClass('active');
                })

                // tootip
                .on('mouseover', '.bar', function (ev) {
                    var mousePos = self.mousePosition(ev);
                    var hms = self.getTime(mousePos, $(this));
                    $(this).find('tooltip').css('left', mousePos.x - 20 + 'px').text(hms).show();
                })
                .on('mouseout', '.bar', function () {
                    $(this).find('tooltip').fadeOut();
                })
                .on('mousemove', '.bar', function (ev) {
                    var mousePos = self.mousePosition(ev);
                    var hms = self.getTime(mousePos, $(this));
                    $(this).find('tooltip').css('left', mousePos.x - 20 + 'px').text(hms).show();
                })

                // 进度条中心圆点
                .on('click', '.bar', function (ev) {
                    var mousePos = self.mousePosition(ev);
                    $(this).find('span').css('left', mousePos.x - $(this).offset().left - 6 + 'px');
                    $(this).find('p.already').css('width', mousePos.x - $(this).offset().left - 6 + 'px');
                    var hms = self.getTime($('.bar>span').offset().left + 6, $('.bar'));
                    self.useSetDate(hms);
                })
                .on('click', '.bar>span, p.future', function (ev) {
                    ev.stopPropagation();
                })

                // 按钮
                .on('click', '.j-btn>.l .btn', function () {    // 播放速率
                    $(this).addClass('active')
                        .siblings().removeClass('active');
                })
                .on('click', '.j-btn>.r .btn', function () {    // 暂停和启动
                    $(this).addClass('active')
                        .siblings().removeClass('active');
                })
                .on('click', '.j-btn>.r .zt', function () {     // 暂停回放
                    self.observer.stopDeviceAnimator();
                    self.observer.pausePlayback();
                })
                .on('click', '.j-btn>.r .qd', function () {     // 启动回放
                    var hms = self.getTime($('.bar>span').offset().left + 6, $('.bar'));
                    self.useSetDate(hms);
                    self.observer.startPlayback();
                })

                // 切换工班
                .on('click', '.j-progressBar p.active', function () {
                    if (!$('.j-refresh').hasClass('hide')) return;       // 在选择日期时候不能切换工班
                    self.transWorkingClass($(this));

                })

            // 关闭工班提示
            $('#workingTip')
                .on('click', '.j-workingTip', function () {
                    $('.j-workingTip').addClass('hide');
                })


        },
        // 根据进来的时间设置进度条上未来
        setFuture: function () {
            var hms = this.dateData.showHMS;
            var ymd = this.dateData.showYear + '-' + this.dateData.showMonth + '-' + this.dateData.showDay;
            if (!(ymd == this.ymdData.ymd)) return;
            if (parseInt(this.dateData.stime.split(':')[0]) < this.dateData.showHours < parseInt(this.dateData.etime.split(':')[0])) {
                var width = (1 - (this.transTime(hms, 1) - this.transTime(this.dateData.stime, 1)) / (8 * 60 * 60)) * $('.bar').width();
                $('.bar p.future').css('width', width);
            }
        },
        useSetDate: function (hms) {
            var date = this.dateData.showYear + '-' + this.dateData.showMonth + '-' + this.dateData.showDay + ' ' + hms;
            this.observer.setDate(date);
        },
        getWorkingClassInfo: function (data, newDate) {
            if (data == undefined) return;
            newDate = _.isDate(newDate) ? newDate : new Date(newDate);
            var year = newDate.getFullYear(),
                month = newDate.getMonth() + 1;
            this.workingClassInfo = {
                data: data,
                ym: year + '-' + month
            };
            this.judgeWorkingClass();
        },
        // setDate: function(newDate){
        //     newDate = _.isDate(newDate) ? newDate : new Date(newDate);
        //     this.renderUpDate(newDate);
        //     this.judgeActive($('.j-date ul li'), $('.j-date ul li:nth-child(2)'));
        // },
        setTimeChange: function (newDate) {
            if (this.dateData.flagC) return;
            newDate = _.isDate(newDate) ? newDate : new Date(newDate);
            var oldyear = this.dateData.showYear;
            var oldmonth = this.dateData.showMonth;
            var oldday = this.dateData.showDay;
            var year = newDate.getFullYear(),
                month = newDate.getMonth() + 1,
                day = newDate.getDate(),
                hms = newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
            this.getPosition(hms);
            if (!this.dateData.flagS) return;
            if (oldyear === year && oldmonth === month && oldday === day) {      // 定时器，相同则return
                return;
            }
            this.dateData.showYear = year;
            this.dateData.showMonth = month;
            this.dateData.showDay = day;
            this.dateData.date = newDate;
            this.renderUpDate(this.dateData);
            $('.j-date ul').html('');
            // this.judgeActive($('.j-date ul li'), $('.j-date ul li:nth-child(2)'));
            this.initWorkingClassTime();
            this.renderWorkingClass(this.dateData);
            this.setFuture();
        },
        initWorkingClassTime: function () {
            this.dateData.stime = '0:00:00';
            this.dateData.etime = '8:00:00';
            this.dateData.mtime = ['2:00:00', '4:00:00', '6:00:00'];
        },
        judgeWorkingClass: function () {
            var self = this;
            if (!((self.dateData.showYear + '-' + self.dateData.showMonth) == self.workingClassInfo.ym)) {
                return;
            }
            $('.j-workingTip').addClass('hide');
            var flag = false;
            $.each(self.workingClassInfo.data, function (idx, item) {
                if (self.dateData.showDay === item.DD) {
                    if (self.dateData.stime === '0:00:00' && item.HH === 'M') {
                        flag = true;
                    }
                    if (self.dateData.stime === '8:00:00' && item.HH === 'A') {
                        flag = true;
                    }
                    if (self.dateData.stime === '16:00:00' && item.HH === 'N') {
                        flag = true;
                    }
                }

            })
            if (!flag) {
                $('.j-workingTip').removeClass('hide');
            } else {
                $('.j-workingTip').addClass('hide');
            }


        },
        // 切换工班时刻调整
        transWorkingClassPart: function (flag) {
            this.transHour(flag);
            this.renderWorkingClass(this.dateData);
            this.useSetDate(this.dateData.stime);
        },
        transWorkingClass: function (obj) {
            var self = this;
            var title = obj.siblings(':first-child').text();
            var hour = parseInt(self.dateData.stime.split(':')[0]);
            var curMondays = self.judgeDate(this.dateData.showYear, this.dateData.showMonth);
            var $list = $('.j-date ul li');
            var $child = $('.j-date ul li:nth-child(2)');
            var newYmd = self.dateData.showYear + '-' + self.dateData.showMonth + '-' + self.dateData.showDay;
            var initYmd = self.ymdData.ymd;

            if (title == '下一工班' && self.compareDate(newYmd, initYmd)) {
                if (hour > 8) return;
                if (hour <= 8 && (new Date()).getHours() + 1 <= parseInt(self.dateData.etime.split(':')[0])) {
                    return;
                }
            }
            if (title == '下一工班' && hour <= 8) {
                self.transWorkingClassPart('n');
                self.setFuture();
                // return;
            }
            if (title == '下一工班' && hour > 8) {
                self.dateData.showDay += 1;
                if (self.dateData.showDay > curMondays) {
                    self.dateData.showDay = 1;
                    self.dateData.showMonth += 1;
                    if (self.dateData.showMonth > 12) {
                        self.dateData.showMonth = 1;
                        self.dateData.showYear += 1;
                    }
                }
                self.renderUpDate();
                // self.judgeActive($list, $child);
                self.setFuture();
                self.transWorkingClassPart('above');
            }

            if (title == '上一工班' && hour >= 8) {
                self.transWorkingClassPart('p');
                // return;
            }
            if (title == '上一工班' && hour < 8) {
                self.dateData.showDay -= 1;
                if (self.dateData.showDay < 1) {
                    self.dateData.showDay = self.judgeDate(self.dateData.showYear, self.dateData.showMonth - 1);
                    self.dateData.showMonth -= 1;
                    if (self.dateData.showMonth < 1) {
                        self.dateData.showMonth = 12;
                        self.dateData.showYear -= 1;
                    }
                }
                self.renderUpDate();
                // self.judgeActive($list, $child);
                self.transWorkingClassPart('below');
            }
            self.judgeWorkingClass();

        },
        compareDate: function (d1, d2) {
            d1 = !(d1 instanceof Date) ? (new Date(d1.replace(/-/g, '\/'))) : d1;
            d2 = !(d2 instanceof Date) ? (new Date(d2.replace(/-/g, '\/'))) : d2;
            return d1 >= d2;
        },
        judgeActive: function ($list, $child) {
            if ($list.length == 5 && $child.text().length === 4) {     // 根据下方ul,li判断active
                $('.j-date .btn:first-child').addClass('active').trigger('click');
            }
            else if ($list.length == 8) {
                $('.j-date .btn:nth-child(2)').addClass('active').trigger('click');
            } else {
                $('.j-date .btn:last-child').addClass('active').trigger('click');
            }
        },
        transHour: function (flag) {
            var self = this;
            self.dateData.stime = self.getHour(self.dateData.stime, flag);
            self.dateData.etime = self.getHour(self.dateData.etime, flag);
            $.each(self.dateData.mtime, function (idx, obj) {
                self.dateData.mtime[idx] = self.getHour(obj, flag);
            })
        },
        getHour: function (time, flag) {
            switch (flag) {
                case 'n':
                    return parseInt(time.split(':')[0]) + 8 + ':00:00';
                case 'above':
                    return parseInt(time.split(':')[0]) - 16 + ':00:00';
                case 'p':
                    return parseInt(time.split(':')[0]) - 8 + ':00:00';
                case 'below':
                    return parseInt(time.split(':')[0]) + 16 + ':00:00';
            }
        },
        //进度条：获取鼠标坐标
        mousePosition: function (ev) {
            ev = ev || window.event;
            if (ev.pageX || ev.pageY) {
                return { x: ev.pageX, y: ev.pageY };
            }
            return {
                x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                y: ev.clientY + document.body.scrollTop - document.body.clientTop
            };
        },
        // 进度条：时分秒转换秒
        transTime: function (date, flag) {
            if (flag == 1) {
                var arr = date.split(':');
                return parseInt(arr[0] * 3600) + parseInt(arr[1] * 60) + parseInt(arr[2]);
            }
            else {
                var hours = parseInt(date / (60 * 60));
                var tminutes = parseInt((date % (60 * 60)) / 60)
                var minutes = tminutes < 10 ? ('0' + tminutes) : tminutes;
                var tseconds = parseInt((date % (60 * 60)) % 60);
                var seconds = tseconds < 10 ? ('0' + tseconds) : tseconds;
                return hours + ":" + minutes + ":" + seconds;
            }
        },
        // 进度条：获取时间
        getTime: function (mousePos, obj) {
            var proportion = ((mousePos.x ? mousePos.x : mousePos) - obj.offset().left) / obj.width();    // 长度比例
            // console.log(proportion)
            var stime = this.dateData.stime;
            stime = this.transTime(stime, 1);
            var etime = this.dateData.etime;
            etime = this.transTime(etime, 1);
            var time = this.transTime(stime + (etime - stime) * proportion, 2);
            return time;
        },
        getPosition: function (time) {
            var seconds = this.transTime(time, 1) - this.transTime(this.dateData.stime, 1);
            var proportion = seconds / (8 * 60 * 60);
            // console.log(time);
            if ($('.bar p.already').width() + $('.bar p.future').width() >= $('.bar').width()) {      // 这里是不是要暂停？
                this.observer.pausePlayback();
                return;
            }
            if (proportion >= 1) {
                $('.j-progressBar p.active').eq(1).trigger('click');
                return;
            }
            var length = $('.j-player .bar').width() * proportion - 6;
            $('.j-progressBar .bar span').css('left', length + 'px');
            $('.j-progressBar .bar p.already').css('width', length + 'px');
        },
        // 年月日：判断闰年和单双月，返回天数
        isLeep: function (year) {
            return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
        },
        judgeDate: function (year, month) {
            var num = 31;
            switch (parseInt(month)) {
                case 2:
                    num = this.isLeep(year) ? 29 : 28; break;
                case 4:
                case 6:
                case 9:
                case 11:
                    num = 30; break;
            }
            return num;

        },
        // 年月日：上下切换
        setDateud: function (obj) {
            var upCurtext = obj.text();
            var upCurnum = parseInt(obj.text());
            if (upCurtext.indexOf('年') > -1) {
                this.renderDownDate({ dateArr: [upCurnum - 1, upCurnum, upCurnum + 1], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'year' });
            }
            else if (upCurtext.indexOf('月') > -1) {
                this.renderDownDate({ dateArr: this.downDateGroup(this.dateData.showMonth, 6), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'month' });
            }
            else {
                this.renderDownDate({ dateArr: this.downDateGroup(this.dateData.showDay, 7), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'day' });
                (this.dateData.showDay > 28) && $('.j-date ul li.next').trigger('click');
            }
        },
        // 年月日：左右切换
        setDatelr: function (obj, flag) {
            var upCurtext = obj.parents('.j-date').find('.btn.active').text();
            var upCurnum = parseInt(upCurtext);
            var downNextnum = parseInt($('.j-date ul li:nth-last-child(2)').text());
            if (flag == 'l') {
                if (upCurtext.indexOf('年') > -1) {
                    this.renderDownDate({ dateArr: [downNextnum - 5, downNextnum - 4, downNextnum - 3], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'year' });
                }
                else if (upCurtext.indexOf('月') > -1) {
                    (downNextnum > 6) && (this.renderDownDate({ dateArr: this.downDateGroup(downNextnum - 6, 6), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'month' }));
                } else {
                    (downNextnum - 7 >= 1) && (this.renderDownDate({ dateArr: this.downDateGroup(downNextnum - 7, 7), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'day' }));

                }

            } else {
                if (upCurtext.indexOf('年') > -1) {
                    this.renderDownDate({ dateArr: [downNextnum + 1, downNextnum + 2, downNextnum + 3], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'year' });
                }
                else if (upCurtext.indexOf('月') > -1) {
                    (downNextnum < 7) && (this.renderDownDate({ dateArr: this.downDateGroup(downNextnum + 6, 6), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'month' }));
                } else {
                    var curMondays = this.judgeDate(this.dateData.showYear, this.dateData.showMonth);
                    (downNextnum + 7 <= curMondays) && (this.renderDownDate({ dateArr: this.downDateGroup(downNextnum + 7, 7), upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'day' }));
                    if (downNextnum + 7 > curMondays) {
                        switch (curMondays) {
                            case 29:
                                this.renderDownDate({ dateArr: [29], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'year' });
                                break;
                            case 30:
                                this.renderDownDate({ dateArr: [29, 30], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'month' });
                                break
                            case 31:
                                this.renderDownDate({ dateArr: [29, 30, 31], upCurnum: upCurnum, initDate: this.ymdData, newDate: this.dateData, flag: 'day' });
                                break;
                        }
                    }

                }
            }
        },
        // 返回下方的一组日期数字组
        downDateGroup: function (showDate, num) {

            var dateArr = [];
            var groupNum = Math.ceil(showDate / num) - 1;
            for (var i = 0; i < num; i++) {
                dateArr.push(i + 1 + groupNum * num);
            }
            return dateArr;

        },
        /*
        *  将模板数据插入到页面节点
        */
        renderUpDate: function (data) {
            var data = data || this.dateData;
            var fupDateTemp = jsrender.templates(upDateTemp).render(data);
            $('.j-date div:first-child').html(fupDateTemp);
        },
        renderDownDate: function (data) {
            // var data = data ? $.extend({}, data, this.ymdData) : this.dateData;
            var data = data ? data : this.dateData;
            var fdownDateTemp = jsrender.templates(downDateTemp).render(data);
            $('.j-date ul').html(fdownDateTemp);
        },
        renderWorkingClass: function (data) {
            var data = data || this.dateData;
            var fworkingClassTemp = jsrender.templates(workingClassTemp).render(data);
            $('.j-progressBar').html(fworkingClassTemp);
        },
        render: function () {
            // this.observer.hidePop();
            $('#player').html(playerTemp);
            $('#workingTip').html(noWorkingClassTipTemp);
            this.renderUpDate();
            // $('.j-refresh').addClass('hide');
            // $('.j-date .btn:first-child').addClass('active');
            // this.renderDownDate();
            this.renderWorkingClass();
        }
    });
    return RECORDPLAYERPOP;
});




