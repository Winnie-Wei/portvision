/**
 * @moudle portvision/../mod/CONTAINERJOBLIST
 */
define(function(require) {
    'use strict'

    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');
    var BoxDetailPop = require('mod/boxDetailPop/boxDetailPop');
    var BoxAnimatePop = require('mod/boxAnimatePop/boxAnimatePop');

    var containerJobTmp =
        '<div class="list-box">' + 
            '<div class="container-num-box clearfix">' + 
                '<div class="plan-box">' + 
                    '<span>计划作业量</span>' + 
                    '<span class="plan-jobNum">{{:dailyPlan}}</span>' + 
                '</div>' + 
                '<div class="complete-box">' + 
                    '<span>完成箱量</span>' + 
                    '<span class="complete-jobNum">{{:dailyComplete}}</span>' + 
                '</div>' + 
            '</div>' + 
            '<div class="in-the-box">' + 
                '<span>作业中箱量</span>' + 
                '<span class="in-the-jobNum">{{:currentCTN}}</span>' + 
            '</div>' + 
            '<div class="mc-bigraphy-panel mc-contJobList-panel">' + 
                '<table class="table-containerJob">' + 
                    '<colgroup>' + 
                        '<col name="mc-table-column-1" width="120">' + 
                        '<col name="mc-table-column-2" width="120">' + 
                        '<col name="mc-table-column-3" width="70">' + 
                        '<col name="mc-table-column-4" width="50">' + 
                        '<col name="mc-gutter" width="15">' + 
                    '</colgroup>' + 
                    '<thead>' + 
                        '<tr>' + 
                            '<th class="mc-table-column-1"><span>船名航次</span></th>' + 
                            '<th class="mc-table-column-2"><span>集装箱编号</span></th>' + 
                            '<th class="mc-table-column-3"><span>作业类型</span></th>' + 
                            '<th class="mc-table-column-4"><span>操作</span></th>' + 
                            // '<th class="gutter" style="width: 15px;"></th>' + 
                        '</tr>' + 
                    '</thead>' +
                '</table>' + 
                '<div class="containerJobList-tbody" id="marquee">' + 
                    '<ul class="clearfix">' + 
                        '{{for ctnList}}' + 
                        '<li>' + 
                            '<table class="table-containerJob">' + 
                                '<colgroup>' + 
                                    '<col name="mc-table-column-1" width="120">' + 
                                    '<col name="mc-table-column-2" width="120">' + 
                                    '<col name="mc-table-column-3" width="70">' + 
                                    '<col name="mc-table-column-4" width="50">' + 
                                    // '<col name="mc-gutter" width="15">' + 
                                '</colgroup>' + 
                                '<tbody class="j-deviceSel" id="J_jobBoxList">' + 
                                    
                                    '<tr id="ctn_no_{{:CTN_NO}}">' + 
                                        '{{if JOB_TYPE == "LOAD"}}' + 
                                            '<td class="mc-table-column-1">{{:VESSEL_REFERENCE}}</td>' + 
                                        '{{else JOB_TYPE == "DSCH"}}' + 
                                            '<td class="mc-table-column-1">{{:VESSEL_REFERENCE}}</td>' + 
                                        '{{else}}' + 
                                            '<td class="mc-table-column-1"> -- </td>' + 
                                        '{{/if}}' + 
                                        '<td class="mc-table-column-2 j-ctn-num ctn-num">{{:CTN_NO}}</td>' + 
                                        '{{if JOB_TYPE == "LOAD"}}' + 
                                            '<td class="mc-table-column-3">装船</td>' + 
                                        '{{else JOB_TYPE == "DSCH"}}' + 
                                            '<td class="mc-table-column-3">卸船</td>' + 
                                        '{{else JOB_TYPE == "RECV"}}' + 
                                            '<td class="mc-table-column-3">进箱</td>' + 
                                        '{{else JOB_TYPE == "DLVR"}}' + 
                                            '<td class="mc-table-column-3">提箱</td>' + 
                                        '{{else JOB_TYPE == "SHFT"}}' + 
                                            '<td class="mc-table-column-3">移箱</td>' + 
                                        '{{else JOB_TYPE == "YARD"}}' + 
                                            '<td class="mc-table-column-3">堆场</td>' + 
                                        '{{else}}' +
                                            '<td class="mc-table-column-3"></td>' +
                                        '{{/if}}' + 
                                        // '<td class="mc-table-column-3">{{:JOB_STATUS}}</td>' + 
                                        '<td class="mc-table-column-4 j-location-box location-box"></td>' + 
                                    '</tr>' + 
                                    
                                '</tbody>' + 
                            '</table>' + 
                        '</li>' + 
                        '{{/for}}' +
                    '</ul>' + 
                '</div>' + 
            '</div>' + 
        '</div>';
    var oneLineBoxTemp = 
    	'<tr id="ctn_no_{{:CTN_NO}}">' + 
    	    '{{if JOB_TYPE == "LOAD"}}' + 
    	        '<td class="mc-table-column-1">{{:VESSEL_REFERENCE}}</td>' + 
    	    '{{else JOB_TYPE == "DSCH"}}' + 
    	        '<td class="mc-table-column-1">{{:VESSEL_REFERENCE}}</td>' + 
    	    '{{else}}' + 
    	        '<td class="mc-table-column-1"> -- </td>' + 
    	    '{{/if}}' + 
    	    '<td class="mc-table-column-2 j-ctn-num ctn-num">{{:CTN_NO}}</td>' + 
    	    '{{if JOB_TYPE == "LOAD"}}' + 
    	        '<td class="mc-table-column-3">装船</td>' + 
    	    '{{else JOB_TYPE == "DSCH"}}' + 
    	        '<td class="mc-table-column-3">卸船</td>' + 
    	    '{{else JOB_TYPE == "RECV"}}' + 
    	        '<td class="mc-table-column-3">进箱</td>' + 
    	    '{{else JOB_TYPE == "DLVR"}}' + 
    	        '<td class="mc-table-column-3">提箱</td>' + 
    	    '{{else JOB_TYPE == "SHFT"}}' + 
    	        '<td class="mc-table-column-3">移箱</td>' + 
    	    '{{else JOB_TYPE == "YARD"}}' + 
    	        '<td class="mc-table-column-3">堆场</td>' + 
    	    '{{else}}' +
    	        '<td class="mc-table-column-3"></td>' +
    	    '{{/if}}' + 
    	    // '<td class="mc-table-column-3">{{:JOB_STATUS}}</td>' + 
    	    '<td class="mc-table-column-4 j-location-box location-box"></td>' + 
    	'</tr>';

    var CONTAINERJOBLIST = function (cfg) {
        if (!(this instanceof CONTAINERJOBLIST)) {
            return new CONTAINERJOBLIST().init(cfg);
        }
    }

    CONTAINERJOBLIST.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this._observer = cfg.observer;
            this.wraper = $('#J_containerJobList');
            this.isLoop = true;
            this.selectBoxCode = '';
            this.listData = cfg.data || {
                dailyPlan: 0, // 计划量
                dailyComplete: 0, // 完成作业量
                currentCTN: 0, // 正在作业量
                ctnList: [{
                    'PLAN_NAME': 'YARD',
                    'CTN_NO': 'EGHU1070577',
                    'FROM_LOCATION': 'NPASQ',
                    'TO_LOCATION': 'NPASQ'
                }, {
                    'PLAN_NAME': 'LOAD',
                    'CTN_NO': 'MSWU1000892',
                    'FROM_LOCATION': 'NPASQ',
                    'TO_LOCATION': 'MSKLE7'
                }, {
                    'PLAN_NAME': 'YARD',
                    'CTN_NO': 'EISU3918833',
                    'FROM_LOCATION': 'NPASQ',
                    'TO_LOCATION': 'NPASQ'
                }]
            };
            this.wraper.hide();
            this.initPop();
            this.getJobListData();
            this.bindEvent();
            return this;
        },
        initPop: function () {
            if (!this._boxDeatilPop) {
                this._boxDeatilPop = BoxDetailPop({
                    'observer': this._observer,
                    'elementId': '#J_centerPop'
                })
            }
            if (!this._boxAnimatePop) {
                this._boxAnimatePop = BoxAnimatePop({
                    'observer': this._observer,
                    'elementId': '#J_centerPop'
                })
            }
        },
        listLoop: function () {
            var height = $('#marquee').height();
            $('.containerJobList-tbody tr').css('height', height / 7 + 'px');
            $('#marquee').length && $('#marquee').kxbdSuperMarquee({
                distance: height / 7,
                time: 1,
                loop: 0,
                isEqual: true,
                direction: 'up',
                isMarquee: true
            });
        },
        /**
         * desc: 事件绑定
         */
        bindEvent: function () {
            var that = this
            this.wraper.off()
                .on('click', '.j-ctn-num', function (ev) {
                    var idx = $('.table-containerJob tbody > tr').index($(ev.currentTarget).parent());
                    that.renderBoxDetail(idx, 'detail');
                })
                .on('click', '.j-location-box', function (ev) {
                    var idx = $('.table-containerJob tbody > tr').index($(ev.currentTarget).parent());
                    that.renderBoxDetail(idx, 'animation');
                });
        },
        render: function (data) {
            this.listData = data || this.listData;
            this.wraper.html(jsrender.templates(containerJobTmp).render(this.listData));
            this.isLoop && this.listLoop();
        },
        /**
         * desc: 渲染集装箱详情
         */
        renderBoxDetail: function (idx, type) {
            var that = this;
            idx = idx >= this.listData.ctnList.length ? idx % this.listData.ctnList.length : idx;
            var boxObj = this.listData.ctnList[idx];
            if (!boxObj) {
                return false;
            }
            // var pop = CenterPopup({
            //     'elementId': '#J_centerPop',
            //     'type': 'center',
            //     'observer': this._observer
            // });
            if (type === 'detail') {
                $.ajax({
                    url: '/portvision' + '/mainObject/ctn/obj/ctn_no/EQUALS/' + boxObj.CTN_NO,
                    method: 'GET',
                    data: {},
                    dataType: 'json',
                    success: function (data) {
                        if (data && typeof (data) !== 'object') {
                            data = JSON.parse(data);
                        }
                        if (!data || !data.length) {
                            console.log(boxObj.CTN_NO + '数据缺失');
                        } else {
                            that._boxDeatilPop.renderBoxDetailPop(data);
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            } else {
                $.ajax({
                    url: '/portvision/data/ctnDetail?ctn=' + boxObj.CTN_NO + '&type=' + boxObj.CURRENT_STATUS,
                    method: 'GET',
                    data: '',
                    dataType: 'json',
                    success: function (data) {
                        if (data && typeof (data) !== 'object') {
                            data = JSON.parse(data);
                        }
                        if (!data) {
                            console.log(boxObj.CTN_NO + '数据缺失');
                        } else {
                            // var planNameArr = ['RECV', 'DLVR', 'DSCH', 'LOAD',];
                            // var index = Math.floor(Math.random()*(planNameArr.length));
                            // boxObj.PLAN_NAME = planNameArr[index];
                            // pop.renderOnlyBoxAnimation( boxObj );
                            // pop.renderOnlyBoxAnimation( $.extend(boxObj, data) );
                            that._boxAnimatePop.renderBoxAnimationPop(data);
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    }
                })
            }
        },
        /**
         * desc: 渲染新增作业箱子，去除已完成的作业箱子
         */
        renderNewBoxAndRmCompleteBox: function (newBoxs, oldNoJobBoxs) {
            var newJobBoxList = '';
            $.each(newBoxs, function (k, v) {
                newJobBoxList = newJobBoxList + jsrender.templates(oneLineBoxTemp).render(v);
            })
            newJobBoxList && $('#J_jobBoxList').append(newJobBoxList);

            if (!oldNoJobBoxs.length) return;
            var ctnNo = '';
            $.each(oldNoJobBoxs, function (k, v) {
                ctnNo = '#ctn_no_' + v.CTN_NO;
                $(ctnNo).parent().parent().parent().remove();
            })
        },
        /**
         * desc: 获取集装箱作业列表
         */
        getJobListData: function () {
            var url = '/portvision' + '/data/jobPlan',
                method = 'get',
                params = {},
                that = this;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function (data) {
                    that.render(data);
                    that._observer.jobPlanContainer = data.ctnList;
                },
                error: function (data, status) {
                    console.log(status);
                }
            });
        },
        /**
         * desc: 显示list面板
         */
        show: function () {
            this.getJobListData();
            this.wraper.show();
        },
        /**
         * desc: 隐藏list面板
         */
        hide: function () {
            this.wraper.hide();
        },
        /**
         * desc: 请求方法
         */
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
                    fnSuccess && fnSuccess.call(that, data);
                },
                error: function (data) {
                    fnError && fnError(data);
                }
            });
            return defer.promise;
        }
    })
    return CONTAINERJOBLIST;
});