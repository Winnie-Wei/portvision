'use strict'
/**
 * @ngdoc function
 * @name myappApp.controller:ruleCtrl
 * @description
 */
require(['plugin/jsrender/jsrender', 'widget/pagination/pagination'], function (jsrender, Pagination) {
    var warnRuleListTemp =
        '<table class="table table-striped">' +
            // '<thead>' +
            //     '<tr>' +
            //         '<th>规则编号</th>' +
            //         '<th>规则名称</th>' +
            //         '<th>规则类型</th>' +
            //         '<th>告警级别</th>' +
            //         '<th>规则描述</th>' +
            //         '<th>告警对象</th>' +
            //         '<th>创建时间</th>' +
            //         '<th>操作</th>' +
            //     '</tr>' +
            // '</thead>' +
            '<colgroup>' +
                '<col name="rule-list-col-1" width="8.7%">' +
                '<col name="rule-list-col-2" width="13.6%">' +
                '<col name="rule-list-col-3" width="7.6%">' +
                '<col name="rule-list-col-4" width="7.6%">' +
                '<col name="rule-list-col-5" width="22.7%">' +
                '<col name="rule-list-col-6" width="13.3%">' +
                '<col name="rule-list-col-7" width="16.9%">' +
                '<col name="rule-list-col-8" width="9.4%">' +
                '<col name="mc-gutter" width="15">' +
            '</colgroup>' +
            '<tbody>' +
                '{{if result.length}}' +
                    '{{for result}}' +
                        '<tr id="{{>ID}}">' +
                            '<td rule-list-col-1>{{>ID}}</td>' +
                            '<td rule-list-col-2>{{>RULE_NAME}}</td>' +
                            '<td rule-list-col-3>{{>RULE_TYPE}}</td>' +
                            '<td rule-list-col-4>{{>alarmLevel}}</td>' +
                            '<td rule-list-col-5>' +
                                '<div class="option-value desc-list">' +
                                '{{for descStrArr}}' +
                                    '<span>{{:#data}}</span><br/>' +
                                '{{/for}}' +
                                '</div>' +
                            '</td>' +
                            '<td rule-list-col-6>{{>alarmObject}}</td>' +
                            '<td rule-list-col-7>{{>UPDATE_TIME}}</td>' +
                            '<td rule-list-col-8>' +
                                '<button type="button" class="rule-option-btn preview-btn j-preview-modal" data-toggle="modal" data-target="#previewModal"></button>' +
                                '<button type="button" class="rule-option-btn edit-btn j-edit-modal" data-toggle="modal" data-target=".rule-modal"></b-modalutton>' +
                                '<button type="button" class="rule-option-btn delete-btn j-delete-modal"  data-toggle="modal" data-target="#deleteModal"></button>' +
                            '</td>' +
                        '</tr>' +
                    '{{/for}}' +
                '{{else}}' +
                    '<tr>' +
                        '<th colspan=8>' +
                            '<div class="text-center result-null">此条件结果为空</div>' +
                        '</th>' +
                    '</tr>' +
                '{{/if}}' +
            '</tbody>' +
        '</table>';
    var previewRuleTemp =
        '<div class="new-rule-title">告警规则</div>' +
        '<div class="new-rule-name new-rule-option clearfix">' +
            '<span class="pull-left option-title">规则名称：</span>' +
            '<span class="option-value">{{>RULE_NAME}}</span>' +
        '</div>' +
        '<div class="rule-type new-rule-option clearfix">' +
            '<span class="pull-left option-title">规则类型：</span>' +
            '<span class="option-value">{{>RULE_TYPE}}</span>' +
        '</div>' +
        '<div class="warn-level new-rule-option clearfix">' +
            '<span class="pull-left option-title">告警级别：</span>' +
            '<span class="option-value">{{>alarmLevel}}</span>' +
        '</div>' +
        '<div class="rule-desc new-rule-option clearfix">' +
            '<span class="pull-left option-title">规则描述：</span>' +
            // '<div class="option-value">{{>RULE_DESC}}</div>' +
            '<div class="option-value desc-list">' +
            '{{for descStrArr}}' +
                '<span>{{:#data}}</span><br/>' +
            '{{/for}}' +
            '</div>' +
        '</div>' +
        '<div class="warn-type new-rule-option clearfix">' +
            '<span class="pull-left option-title">告警类型：</span>' +
            '<span class="option-value">{{>alarmType}}</span>' +
        '</div>' +
        '<div class="warn-obj new-rule-option clearfix">' +
            '<span class="pull-left option-title">告警对象：</span>' +
            '<span class="option-value">{{>alarmObject}}</span>' +
        '</div>' +
        '<div class="notifi-type new-rule-option clearfix">' +
            '<span class="pull-left option-title">通知形式：</span>' +
            '<span class="option-value">{{>noticeType}}</span>' +
        '</div>';
    var newRuleModalTemp =
        '<div class="row">' +
            '<div class="newrule-setting">' +
                '<div class="new-rule-title">设置告警规则</div>' +
                '<div class="new-rule-name new-rule-option">' +
                    '<span class="pull-left option-title">规则名称：</span>' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control" onKeypress="if ((event.keyCode > 32 && event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 65) || (event.keyCode > 90 && event.keyCode < 97)) event.returnValue = false;" placeholder="请输入" aria-describedby="basic-addon1">' +
                        '<div class="error-tip">' +
                            '<span class="left-triangle"></span>' +
                            '<span class="error-msg">无效输入</span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="rule-type new-rule-option">' +
                    '<span class="pull-left option-title">规则类型：</span>' +
                    '<div class="type-option">' +
                        '<label class="radio-inline ">' +
                            '<input type="radio" class="j-ruleTypeValue" name="inlineRadioOptions" id="" value="" checked> 阈值' +
                        '</label>' +
                        '<label class="radio-inline ">' +
                            '<input type="radio" class="j-ruleTypeEvent" name="inlineRadioOptions" id="" value=""> 事件' +
                        '</label>' +
                    '</div>' +
                '</div>' +
                '<div class="rule-type-box">' +
                    '<div class="warn-level new-rule-option">' +
                        '<span class="pull-left option-title">告警级别：</span>' +
                        '<div class="input-group">' +
                            '<input type="text" class="form-control" data-id="1" value="{{>ALARM_LEVEL}}" disabled>' +
                            '<div class="input-group-btn">' +
                                '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                                '<ul class="dropdown-menu dropdown-menu-right">' +
                                    '<li data-id="4"><a href="#">严重</a></li>' +
                                    '<li data-id="3"><a href="#">主要</a></li>' +
                                    '<li data-id="2"><a href="#">提示</a></li>' +
                                    '<li data-id="1"><a href="#">一般</a></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="rule-desc new-rule-option">' +
                        '<span class="pull-left option-title">规则描述：</span>' +
                        '<div class="rule-desc-box">' +
                            '<table class="table table-bordered">' +
                                '<thead>' +
                                    '<tr>' +
                                        '<th>条件关系</th>' +
                                        '<th>告警项目</th>' +
                                        '<th>值</th>' +
                                        '<th>操作</th>' +
                                    '</tr>' +
                                '</thead>' +
                                '<tbody class="rule-desc-list">' +

                                '</tbody>' +
                            '</table>' +
                            '<button class="add-desc-btn">新增</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="new-rule-title">关联告警资源</div>' +
                '<div class="warn-type new-rule-option">' +
                    '<span class="pull-left option-title">告警类型：</span>' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control" value="{{>ALARM_TYPE}}" disabled>' +
                        '<div class="input-group-btn">' +
                            '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                                '<li data-id="GZ"><a href="#">设备故障</a></li>' +
                                '<li data-id="HJ"><a href="#">环境告警</a></li>' +
                                '<li data-id="ZYWG"><a href="#">作业违规</a></li>' +
                                '<li data-id="WX"><a href="#">危险货物监控</a></li>' +
                                '<li data-id="YW"><a href="#">意外事故</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="warn-obj new-rule-option">' +
                    '<span class="pull-left option-title">告警对象：</span>' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control" value="{{>ALARM_OBJECT}}" disabled>' +
                        '<div class="input-group-btn">' +
                            '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                                '<li data-id="TRUCK"><a href="#">集卡</a></li>' +
                                '<li data-id="GANTRYCRANE"><a href="#">龙门吊</a></li>' +
                                '<li data-id="BRIDGECRANE"><a href="#">桥吊</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="new-rule-title">设置通知方式</div>' +
                '<div class="notifi-type new-rule-option">' +
                    '<span class="pull-left option-title">通知形式：</span>' +
                    '<div class="input-group">' +
                        '<input type="text" class="form-control" value="{{>NOTICE}}" disabled>' +
                        '<div class="input-group-btn">' +
                            '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                            '<ul class="dropdown-menu dropdown-menu-right">' +
                                '<li data-id="TEXT"><a href="#">文字告警形式</a></li>' +
                                '<li data-id="TEXT_VOL"><a href="#">文字告警形式+告警提示音</a></li>' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    var newRuleTypeValueTemp =
        '<div class="warn-level new-rule-option">' +
            '<span class="pull-left option-title">告警级别：</span>' +
            '<div class="input-group">' +
                '<input type="text" class="form-control" value="{{>ALARM_LEVEL}}" disabled>' +
                '<div class="input-group-btn">' +
                    '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu dropdown-menu-right">' +
                        '<li data-id="4"><a href="#">严重</a></li>' +
                        '<li data-id="3"><a href="#">主要</a></li>' +
                        '<li data-id="2"><a href="#">提示</a></li>' +
                        '<li data-id="1"><a href="#">一般</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="rule-desc new-rule-option">' +
            '<span class="pull-left option-title">规则描述：</span>' +
            '<div class="rule-desc-box">' +
                '<table class="table table-bordered">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>条件关系</th>' +
                            '<th>告警项目</th>' +
                            '<th>值</th>' +
                            '<th>操作</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody class="rule-desc-list">' +

                    '</tbody>' +
                '</table>' +
                '<button class="add-desc-btn">新增</button>' +
            '</div>' +
        '</div>';
    var newRuleTypeEventTemp =
        // '<div class="event-type new-rule-option">' +
        //     '<span class="pull-left option-title">事件类型：</span>' +
        //     '<div class="input-group">' +
        //         '<input type="text" class="form-control">' +
        //         '<div class="input-group-btn">' +
        //             '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
        //             '<ul class="dropdown-menu dropdown-menu-right">' +
        //                 '<li><a href="#">Action1</a></li>' +
        //                 '<li><a href="#">Action2</a></li>' +
        //                 '<li><a href="#">Action3</a></li>' +
        //             '</ul>' +
        //         '</div>' +
        //     '</div>' +
        // '</div>' +
        '<div class="warn-level new-rule-option">' +
            '<span class="pull-left option-title">告警级别：</span>' +
            '<div class="input-group">' +
                '<input type="text" class="form-control" value="{{>ALARM_LEVEL}}" disabled>' +
                '<div class="input-group-btn">' +
                    '<button type="button" class="btn dropdown-toggle rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                    '<ul class="dropdown-menu dropdown-menu-right">' +
                        '<li data-id="4"><a href="#">严重</a></li>' +
                        '<li data-id="3"><a href="#">主要</a></li>' +
                        '<li data-id="2"><a href="#">提示</a></li>' +
                        '<li data-id="1"><a href="#">一般</a></li>' +
                    '</ul>' +
                '</div>' +
            '</div>' +
        '</div>' +
        '<div class="rule-desc new-rule-option">' +
            '<span class="pull-left option-title">规则描述：</span>' +
            '<div class="rule-desc-box">' +
                '<table class="table table-bordered">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>条件关系</th>' +
                            '<th>告警项目</th>' +
                            '<th>值</th>' +
                            '<th>操作</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody class="rule-desc-list">' +

                    '</tbody>' +
                '</table>' +
                '<button class="add-desc-btn">新增</button>' +
            '</div>' +
        '</div>';
    var ruleDescOneLineTemp =
        '<tr>' +
            '<td>' +
                '<div class="input-group">' +
                    '<input type="text" class="form-control desc-sm-input" value="{{>CONDITION}}" disabled>' +
                    '<div class="input-group-btn">' +
                        '<button type="button" class="btn dropdown-toggle sm-rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                        '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#">与条件</a></li>' +
                            '<li><a href="#">或条件</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '<div class="input-group pull-left desc-option-group">' +
                    '<input type="text" class="form-control desc-sm-input" value="{{>KEY}}" disabled>' +
                    '<div class="input-group-btn">' +
                        '<button type="button" class="btn dropdown-toggle sm-rule-dropd-btn btn-tree" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                        '<div class="dropdown-menu dropdown-menu-right">' +
                                '<input type="text" class="form-control j-searchTree" placeholder="请输入关键字">' +
                            '<div class="desc-item-name"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="input-group pull-left unit-group">' +
                    '<input type="text" class="form-control desc-sm-input" value="{{>COMPARE}}" disabled>' +
                    '<div class="input-group-btn">' +
                        '<button type="button" class="btn dropdown-toggle sm-rule-dropd-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span></button>' +
                        '<ul class="dropdown-menu dropdown-menu-right">' +
                            '<li><a href="#">>=</a></li>' +
                            '<li><a href="#">></a></li>' +
                            '<li><a href="#">==</a></li>' +
                            '<li><a href="#"><=</a></li>' +
                            '<li><a href="#"><</a></li>' +
                            '<li><a href="#">!=</a></li>' +
                            '<li><a href="#">包含</a></li>' +
                            '<li><a href="#">不包含</a></li>' +
                        '</ul>' +
                    '</div>' +
                '</div>' +
            '</td>' +
            '<td>' +
                '{{if isValue}}' +
                '<div class="input-group pull-left  desc-option-group">' +
                    '<input type="text" class="form-control desc-sm-input desc-item-value" value="{{>VALUE}}">' +
                    '<div class="error-tip">' +
                        '<span class="left-triangle"></span>' +
                        '<span class="error-msg">无效输入</span>' +
                    '</div>' +
                '</div>' +
                '<div class="input-group pull-left unit-group value-unit">' +
                    '<input type="text" class="form-control desc-sm-input" disabled value="{{>VALUE_UNIT}}">' +
                '</div>' +
                '{{else}}' +
                '<div class="input-group pull-left  desc-option-group" style="width: 100% !important;">' +
                    '<input type="text" class="form-control desc-sm-input desc-item-value" value="{{>VALUE}}">' +
                '</div>' +
                '{{/if}}' +
            '</td>' +
            '<td>' +
                '<button type="button" class="btn delete-desc-btn j-delete-desc">删除</button>' +
            '</td>' +
        '</tr>';
    var WARNRULE = function () { };
    WARNRULE.prototype = $.extend({}, {
        init: function () {
            this.currPageRuleData = [];
            this.previewRule = {};
            this.modalType = '' || 'new';
            this.page = {
                curPage: 1,
                pageSize: 10
            };
            this.searchInfo = {
                key: '',
                val: ''
            }
            this.descValueOneRowData = {
                CONDITION: '与条件',
                KEY: '速度',
                COMPARE: '>=',
                VALUE: '80',
                VALUE_UNIT: 'km/h'
            };
            this.defaultInputVal = {
                RULE_TYPE: '阈值',
                ALARM_LEVEL: '严重',
                ALARM_LEVEL_VALUE: '4',
                CONDITION: '与条件',
                COMPARE: '>=',
                ALARM_TYPE: '设备故障',
                ALARM_TYPE_VALUE: 'GZ',
                ALARM_OBJECT: '集卡',
                ALARM_OBJECT_VALUE: 'TRUCK',
                NOTICE: '文字告警形式',
                NOTICE_VALUE: 'TEXT',
                isValue: true
            };
            this.currRuleData = {
                ID: '',
                RULE_TYPE: this.defaultInputVal.RULE_TYPE,
                ALARM_LEVEL: this.defaultInputVal.ALARM_LEVEL_VALUE,
                RULE_NAME: '', // 必填
                ALARM_OBJECT: this.defaultInputVal.ALARM_OBJECT_VALUE,
                RULE_DESC: '', // 必填
                UPDATE_TIME: '',
                ALARM_TYPE: this.defaultInputVal.ALARM_TYPE_VALUE,
                NOTICE: this.defaultInputVal.NOTICE_VALUE
            };
            this.bindEvent();
            this.initPage();
            this.jqnumberOnly()
        },
        /**
         * desc: 事件绑定
         */
        bindEvent: function () {
            var that = this;
            var ruleList = document.getElementById('J_ruleList');
            if (ruleList.scrollHeight > ruleList.clientHeight || ruleList.offsetHeight > ruleList.clientHeight) {
                $('.rule-list-title').find('tr').append('<th class="mc-gutter"></th>');
            }
            var switchFlag = true;
            $(window).resize(function () {
                var ruleList = document.getElementById('J_ruleList');
                if (switchFlag === true && ruleList.scrollHeight > ruleList.clientHeight || ruleList.offsetHeight > ruleList.clientHeight) {
                    $('.rule-list-title').find('tr').append('<th class="mc-gutter"></th>');
                    switchFlag = false;
                } else if (ruleList.scrollHeight <= ruleList.clientHeight) {
                    if ($('.rule-list-title').find('tr th:last-child').hasClass('mc-gutter')) {
                        $('.rule-list-title').find('tr th:last-child').remove();
                        switchFlag = true;
                    }
                }
            })
            $(document)
                .on('click', '.j-newRule', function () {
                    that.formateData();
                    that.modalType = 'new';
                    $('.rule-modal .modal-title').text('新增告警规则');
                    that.currRuleData.RULE_TYPE = '阈值';
                    that.defaultInputVal.RULE_TYPE = '阈值';
                    that.defaultInputVal.KEY = that.descInitValueStr;
                    that.defaultInputVal.VALUE_UNIT = that.descItemUintObj[that.defaultInputVal.KEY].UNIT;
                    that.renderNewModal();
                })
                .on('click', '.j-search', function () {
                    var ruleName = $('.rule-search input').val();
                    if (!ruleName) return false;
                    that.searchInfo.val = ruleName;
                    that.page.curPage = 1;
                    that.getSearchListWithName(ruleName);
                })
                .on('input', '.j-searchInput', function () {
                    if ($(this).val() === '') {
                        that.searchInfo.val = '';
                        that.page.curPage = 1;
                        that.getWarnRuleList();
                    }
                })
                .on('input', '.j-searchTree', function () {
                    var val = $(this).val();
                    var $tree = $(this).siblings('.desc-item-name');
                    if (!val) {
                        $tree.jqxTree('collapseAll');
                        return;
                    }
                    var items = $tree.jqxTree('getItems');
                    $.each(items, function (idx, item) {
                        (item['label'].indexOf(val) > -1 && !item['hasItems']) && ($tree.jqxTree('expandItem', items[idx]));
                    })
                })
                .on('click', '.dropdown-menu', function (ev) {
                    // $(this).siblings('.btn').dropdown();
                    ev.stopPropagation();
                })
                .on('click', '.btn-tree', function () {
                    $(this).siblings().find('.j-searchTree').val('');
                    $(this).siblings().find('.desc-item-name').jqxTree('collapseAll');
                })
                .on('click', '.j-preview-modal', function () {
                    var ruleID = $(this).parent().parent().attr('id');
                    $.each(that.currPageRuleData, function (k, v) {
                        v.ID === ruleID && (that.previewRule = v);
                    })
                    that.renderPrewData();
                })
                .on('click', '.j-edit-modal', function () {
                    var ruleID = $(this).parent().parent().attr('id');
                    $.each(that.currPageRuleData, function (k, v) {
                        v.ID === ruleID && (that.currRuleData = v);
                    })
                    that.modalType = 'edit';
                    $('.rule-modal .modal-title').text('修改告警规则');
                    that.renderEditModal();
                })
                .on('input', '.new-rule-name input', function () {
                    that.hideErrorTip('.new-rule-name');
                })
                .on('blur', '.new-rule-name input', function () {
                    console.log($(this).val().length);
                    if ($(this).val().length > 10) {
                        that.showErrorTip('.new-rule-name', '最多输入10个字');
                    }
                })
                .on('click', '.j-delete-modal', function () {
                    var ruleID = $(this).parent().parent().attr('id');
                    that.ruleID = ruleID;
                })
                .on('click', '.j-delete', function () {
                    console.log('delete');
                    that.deleteWarnRule(that.ruleID);
                })
                .on('click', '.j-ruleTypeValue', function (ev) {
                    ev.stopPropagation();
                    if (that.modalType === 'new') {
                        if ($(this).children('input').is(':checked')) return false;
                        $(this).children('input').prop('checked', true)
                        console.log($(this).children().is(':checked'), ev);
                        that.currRuleData.RULE_TYPE = '阈值';
                        that.defaultInputVal.RULE_TYPE = '阈值';
                        var wrapper = jsrender.templates(newRuleTypeValueTemp).render(that.defaultInputVal);
                        $('.rule-type-box').html(wrapper);
                        that.defaultInputVal.isValue = true;
                        that.defaultInputVal.KEY = that.descInitValueStr;
                        that.defaultInputVal.VALUE_UNIT = that.descItemUintObj[that.defaultInputVal.KEY].UNIT;
                        that.renderDescConditionRow(that.defaultInputVal);
                    }
                })
                .on('click', '.j-ruleTypeEvent', function (ev) {
                    ev.stopPropagation();
                    if (that.modalType === 'new') {
                        if ($(this).children('input').is(':checked')) return false;
                        $(this).children('input').prop('checked', true)
                        console.log($(this).children().is(':checked'), ev);
                        that.currRuleData.RULE_TYPE = '事件';
                        that.defaultInputVal.RULE_TYPE = '事件';
                        var wrapper = jsrender.templates(newRuleTypeEventTemp).render(that.defaultInputVal);
                        $('.rule-type-box').html(wrapper);
                        that.defaultInputVal.isValue = false;
                        that.defaultInputVal.KEY = that.descInitEventStr;
                        that.defaultInputVal.VALUE_UNIT = that.descItemUintObj[that.defaultInputVal.KEY].UNIT;
                        that.renderDescConditionRow(that.defaultInputVal);
                    }
                })
                // .on('change', '.desc-option-group input', function( ev ) {
                //     console.log($(this).val());
                // })
                .on('click', '.add-desc-btn', function () {
                    that.renderDescConditionRow(that.defaultInputVal);
                    $(this).parent().find('tbody tr:first-child .delete-desc-btn').prop('disabled', false);
                })
                .on('click', '.j-delete-desc', function () {
                    if ($('.rule-desc-box table').find('tr').length > 2) {
                        $(this).parent().parent().remove();
                    }
                    if ($('.rule-desc-box table').find('tr').length === 2) {
                        $('.rule-desc-list').find('tr:first-child .delete-desc-btn').prop('disabled', true);
                    }
                })
                .on('click', '.j-addRuleBtn', function () {
                    $(this).prop('disabled', true);
                    if (that.modalType === 'new') {
                        var ruleName = $('.new-rule-name input').val();
                        if (!ruleName.length) {
                            // 提示名称未填写
                            that.showErrorTip('.new-rule-name', '规则名称不能为空');
                            $(this).prop('disabled', false);
                            return;
                        }
                        if (ruleName.length > 10) {
                            that.showErrorTip('.new-rule-name', '最多输入10个字');
                            $(this).prop('disabled', false);
                            return;
                        }
                        var url = '/object/alarmConfig/RULE_NAME/EQUALS/' + ruleName,
                            method = 'get',
                            params = {},
                            fnSuccess = function (data) {
                                if (data.length === 0) {
                                    if (that.assembleRuleDesc().result) {
                                        that.currRuleData.RULE_NAME = ruleName;
                                        that.currRuleData.RULE_DESC = that.assembleRuleDesc().data;
                                        that.addNewRuleToList(that.currRuleData);
                                    } else {
                                        that.descItemValueSelector = that.assembleRuleDesc().data;
                                        $.each(that.descItemValueSelector, function (idx, item) {
                                            that.showErrorTip(that.assembleRuleDesc().data[idx], '字段不能为空');
                                        })
                                        $('.j-addRuleBtn').prop('disabled', false);
                                    }
                                } else {
                                    $('.j-addRuleBtn').prop('disabled', false);
                                    that.showErrorTip('.new-rule-name', '规则名称重复');
                                }
                            },
                            fnError = function (error) {
                                console.log(error);
                                $('.j-addRuleBtn').prop('disabled', false);
                            };
                        that.postData(url, method, params, fnSuccess);

                    } else {
                        if (that.assembleRuleDesc().result) {
                            that.currRuleData.RULE_DESC = that.assembleRuleDesc().data;
                            that.updateRuleData(that.currRuleData);
                            $('.j-addRuleBtn').prop('disabled', false);
                        } else {
                            // console.log(that.assembleRuleDesc().data);
                            that.descItemValueSelector = that.assembleRuleDesc().data;
                            $.each(that.descItemValueSelector, function (idx, item) {
                                that.showErrorTip(that.assembleRuleDesc().data[idx], '字段不能为空');
                            })
                            $('.j-addRuleBtn').prop('disabled', false);
                        }
                    }
                })
                // 列表选项
                .on('click', '.rule-modal .input-group ul:last-child li', function (ev) {
                    // console.log($('.rule-modal .input-group ul:last-child'));
                    var currSelect = $(this).text();
                    // var currDataId = $(this).attr('data-id');
                    // console.log($(this).parents('.'));
                    // if ( $(this).parents('.warn-level').hasClass('.warn-level') ) {
                    // $(this).parent().parent().parent().children('input').val(currSelect);
                    console.log();
                    if ($(this).parents('.desc-item-name').length) return;
                    $(this).parents('.input-group-btn').removeClass('open')
                        .parents('.input-group').children('.input-group>input').val(currSelect);
                    ev.stopPropagation();
                    // }
                })
                .on('itemClick', '.desc-item-name', function (ev) {
                    var args = ev.args;
                    var item = $(this).jqxTree('getItem', args.element);
                    if (!item.hasItems) {
                        $(this).parents('.desc-option-group').children('.desc-sm-input').val(item.label);
                        $(this).parents('.input-group-btn').removeClass('open');
                        $(this).parents('tr').find('.value-unit input').val(that.descItemUintObj[item.label].UNIT);
                    }
                })
                .on('click', '.warn-level li', function () {
                    that.currRuleData.ALARM_LEVEL = $(this).attr('data-id');
                })
                .on('click', '.warn-type li', function () {
                    that.currRuleData.ALARM_TYPE = $(this).attr('data-id');
                })
                .on('click', '.warn-obj li', function () {
                    that.currRuleData.ALARM_OBJECT = $(this).attr('data-id');
                })
                .on('click', '.notifi-type li', function () {
                    that.currRuleData.NOTICE = $(this).attr('data-id');
                })
                .on('input', '.rule-desc-list tr td:nth-child(3) input', function () {
                    that.hideErrorTip($(this).parent());
                    // that.descItemValueSelector = '';
                });
        },
        jqnumberOnly: function () {
            jQuery.fn.numberOnly = function () {
                return this.each(function () {
                    $(this).keydown(function (e) {
                        // 允行: backspace, delete, tab, escape, enter 和 .
                        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                            // 允许: Ctrl+A, Command+A
                            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                            // 允行: home, end, left, right, down, up
                            (e.keyCode >= 35 && e.keyCode <= 40)) {
                            //直接通过
                            return;
                        }
                        // 只允许数字
                        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                            e.preventDefault();
                        }
                    });
                });
            };
        },
        initInputOptionValue: function () {
            console.log($('rule-modal .input-group li:first-child').val());
        },
        /**
         * desc: 获取页面数据
         */
        getData: function () {
            this.getWarnRuleList();
            this.getAlarmTree();
        },
        /**
         * desc: 获取规则tree
         */
        getAlarmTree: function () {
            var url = '/alarm/alarmConfig/data',
                method = 'get',
                params = {},
                fnSuccess = this.converDescDataStruct;
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * desc: 初始化分页
         */
        initPage: function () {
            var url = '/object/alarmConfig',
                method = 'get',
                params = {
                    'order': 'UPDATE_TIME',
                    'sort': 'desc',
                    'currentPage': this.page.curPage,
                    'pageSize': this.page.pageSize
                },
                fnSuccess = function (data) {
                    this.setPageData(data);
                    this.pagination = Pagination({
                        page: this.page,
                        wraper: $('.page'),
                        that: this,
                        callback: this.getWarnRuleList
                    })
                    this.getData();
                };
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * desc: 获取告警规则列表
         */
        getWarnRuleList: function () {
            var that = this;
            var url = '/object/alarmConfig',
                method = 'get',
                params = {
                    'order': 'UPDATE_TIME',
                    'sort': 'desc',
                    'currentPage': that.page.curPage,
                    'pageSize': that.page.pageSize,
                    'key': that.searchInfo.val ? 'RULE_NAME' : '',
                    'operator': that.searchInfo.val ? 'LIKE' : '',
                    'value': that.searchInfo.val
                },
                fnSuccess = that.renderWarnRuleList;
            that.postData(url, method, params, fnSuccess);
        },
        /**
         * desc: 获取搜索列表
         */
        getSearchListWithName: function (ruleName) {
            var that = this;
            var url = '/object/alarmConfig',
                method = 'get',
                params = {
                    'order': 'UPDATE_TIME',
                    'sort': 'desc',
                    'currentPage': this.page.curPage,
                    'pageSize': this.page.pageSize,
                    'key': 'RULE_NAME',
                    'operator': 'LIKE',
                    'value': ruleName
                },
                fnSuccess = function (data) {
                    that.renderWarnRuleList(data);
                };
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * desc: 渲染告警规则列表
         */
        renderWarnRuleList: function (args) {
            var that = this,
                data = args;
            console.log(data);
            $.each(data.result, function (k, v) {
                switch (v.ALARM_LEVEL) {
                    case '1': v.alarmLevel = '一般'; break;
                    case '2': v.alarmLevel = '提示'; break;
                    case '3': v.alarmLevel = '主要'; break;
                    case '4': v.alarmLevel = '严重'; break;
                    default: v.alarmLevel = '严重'; break;
                }
                switch (v.ALARM_OBJECT) {
                    case 'TRUCK': v.alarmObject = '集卡'; break;
                    case 'GANTRYCRANE': v.alarmObject = '龙门吊'; break;
                    case 'BRIDGECRANE': v.alarmObject = '桥吊'; break;
                    case 'REACHSTACKER': v.alarmObject = '正面吊'; break;
                    case 'ECHL': v.alarmObject = '堆高机'; break;
                    case 'VESSEL': v.alarmObject = '船舶'; break;
                    case 'YARD': v.alarmObject = '堆场'; break;
                    case 'PORT': v.alarmObject = '全港'; break;
                    case 'GATE': v.alarmObject = '闸口'; break;
                }
                switch (v.ALARM_TYPE) {
                    case 'WX': v.alarmType = '危险货物监控'; break;
                    case 'YW': v.alarmType = '意外事故'; break;
                    case 'HJ': v.alarmType = '环境告警'; break;
                    case 'ZYCW': v.alarmType = '作业操作错误'; break;
                    case 'ZYYD': v.alarmType = '作业拥堵'; break;
                    case 'ZYWG': v.alarmType = '作业违规'; break;
                    case 'GZ': v.alarmType = '设备故障'; break;
                }
                switch (v.NOTICE) {
                    case 'TEXT': v.noticeType = '文字告警形式'; break;
                    case 'TEXT_VOL': v.noticeType = '文字告警形式+告警提示音'; break;
                }
                v.descStrArr = that.descStrConver(v.RULE_DESC).descStrArr;
            })
            var wrapper = jsrender.templates(warnRuleListTemp).render(data);
            $('#J_ruleList').html(wrapper);
            this.currPageRuleData = data.result;
            this.setPageData(data);
            this.pagination.refreshPagedata(this.page);
            this.pagination.renderPagination();
        },
        /**
         * desc: 设置分页信息
         */
        setPageData: function (data) {
            this.page = {
                curPage: data.pageNum,
                totalPage: data.pages,
                pageSize: data.pageSize
            }
        },
        /**
         * desc: 渲染新增告警modal
         */
        renderNewModal: function () {
            var wrapper = jsrender.templates(newRuleModalTemp).render(this.defaultInputVal);
            $('.rule-modal .modal-body').html(wrapper);
            this.renderDescConditionRow(this.defaultInputVal);
            $('.j-addRuleBtn').prop('disabled', false);
            $('.rule-desc-list>tr:first-child>td:first-child input').val('');
            $('.rule-desc-list tr:first-child .delete-desc-btn').prop('disabled', true);
        },
        /**
         * desc: 渲染编辑Modal
         */
        renderEditModal: function () {
            this.currRuleData;
            this.renderNewModal();
            // 根据类型更改modal内容
            if (this.currRuleData.RULE_TYPE === '阈值') {
                var wrapper = jsrender.templates(newRuleTypeEventTemp).render(this.defaultInputVal);
                $('.rule-type-box').html(wrapper);
            }
            // 规则名称
            $('.new-rule-name input').val(this.currRuleData.RULE_NAME).prop('disabled', true);
            // 规则类型
            this.currRuleData.RULE_TYPE === '阈值' ? $('.j-ruleTypeValue input').prop('checked', true) : $('.j-ruleTypeEvent input').prop('checked', true)
            $('.rule-type input').prop('disabled', true);
            // $('.j-ruleTypeEvent input').prop('disabled', true);
            // 告警级别
            var levelStr = '';
            switch (this.currRuleData.ALARM_LEVEL) {
                case '1': levelStr = '一般'; break;
                case '2': levelStr = '提示'; break;
                case '3': levelStr = '主要'; break;
                case '4': levelStr = '严重'; break;
            }
            $('.warn-level input').val(this.currRuleData.alarmLevel);
            // 告警类型
            var warnTypeStr = '';
            switch (this.currRuleData.ALARM_TYPE) {
                case 'GZ': warnTypeStr = '设备故障'; break;
                case 'HJ': warnTypeStr = '环境告警'; break;
                case 'ZYWG': warnTypeStr = '作业违规'; break;
                case 'WX': warnTypeStr = '危险货物监控'; break;
                case 'YW': warnTypeStr = '意外事故'; break;
            }
            $('.warn-type input').val(this.currRuleData.alarmType);
            // 告警对象
            var warnObjStr = '';
            switch (this.currRuleData.ALARM_OBJECT) {
                case 'TRUCK': warnTypeStr = '集卡'; break;
                case 'GANTRYCRANE': warnTypeStr = '龙门吊'; break;
                case 'BRIDGECRANE': warnTypeStr = '桥吊'; break;
            }
            $('.warn-obj input').val(this.currRuleData.alarmObject);
            // 通知形式
            var notifiStr = '';
            switch (this.currRuleData.NOTICE) {
                case 'TEXT': notifiStr = '文字告警形式'; break;
                case 'TEXT_VOL': notifiStr = '文字告警形式+告警提示音'; break;
            }
            $('.notifi-type input').val(this.currRuleData.noticeType);
            // 规则描述项
            var ruleDescObj = this.descStrConver(this.currRuleData.RULE_DESC);
            $('.rule-desc-list').html('');
            for (var i = 0; i < ruleDescObj.count; i++) {
                // if (  ) {}
                ruleDescObj.data[i].COMPARE === 'like' && (ruleDescObj.data[i].COMPARE = '包含');
                ruleDescObj.data[i].COMPARE === 'notlike' && (ruleDescObj.data[i].COMPARE = '不包含');
                this.renderDescConditionRow(ruleDescObj.data[i]);
            }
        },
        /**
         * desc: 解析规则描述字符串
         * @return {object} 包含每条描述对象的数组
         */
        descStrConver: function (str) {
            var newStr = 'no ' + str.replace(/or/g, '|或条件')
                .replace(/and/g, '|与条件')
                .replace(/[(]/g, '')
                .replace(/[)]/g, '')
                .replace(/'%(.+?)%'/g, '$1')
                .replace(/'/g, '')
                .replace(/not like/g, 'notlike');
            var descArr = newStr.split('|');
            var tempArr = [];
            $.each(descArr, function (k, v) {
                tempArr.push(
                    v.replace(/notlike/, '不包含')
                        .replace(/no/g, '')
                        .replace(/like/g, '包含')
                        .replace(/或条件/g, '或')
                        .replace(/与条件/g, '与')
                );
            })
            var descAllArr = [];
            var strArr = []
            for (var i = 0; i < descArr.length; i++) {
                strArr = descArr[i].trim().split(' ');
                if (this.currRuleData.RULE_TYPE === '阈值') {
                    this.descValueOneRowData = {
                        CONDITION: strArr[0],
                        KEY: strArr[1],
                        COMPARE: strArr[2],
                        VALUE: strArr[3],
                        VALUE_UNIT: strArr[4]
                    }
                    this.descValueOneRowData.isValue = true;
                    descAllArr.push(this.descValueOneRowData);
                } else {
                    this.descValueOneRowData = {
                        CONDITION: strArr[0],
                        KEY: strArr[1],
                        COMPARE: strArr[2],
                        VALUE: strArr[3]
                        // VALUE_UNIT: strArr[4],
                    }
                    this.descValueOneRowData.isValue = false;
                    descAllArr.push(this.descValueOneRowData);
                }
            }
            return {
                count: descArr.length,
                data: descAllArr,
                descStrArr: tempArr
            };
        },
        /**
         * desc: 渲染规则描述条件row
         */
        renderDescConditionRow: function (data) {
            var wrapper = jsrender.templates(ruleDescOneLineTemp).render(data);
            $('.rule-desc-list').append(wrapper);
            this.renderAlarmTree();
            var unitStr = data.VALUE_UNIT ? data.VALUE_UNIT.toUpperCase() : '';
            if (unitStr === 'TEU' || unitStr === 'UNITS' || unitStr === 'MPH' || unitStr === 'HR（小时）'
                || unitStr === 'MIN（分钟）' || unitStr === '%' || unitStr === 'M（米）' || unitStr === 'M/S') {
                // onKeyUp="value=value.replace(/[^\d]/g,'') "onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g,''))
                // $('.rule-desc-list tr:last-child .desc-item-value').attr('onKeyUp', 'value=value.replace(/[^\d]/g,"")').attr('onbeforepaste', 'clipboardData.setData("text",clipboardData.getData("text").replace(/[^\d]/g,""))').attr('ime-mode', 'Disabled');
                $('.rule-desc-list tr:last-child .desc-item-value').numberOnly();
            }
        },
        /**
         * desc: 渲染当前预览的规则
         */
        renderPrewData: function () {
            this.previewRule.descStrArr = this.descStrConver(this.previewRule.RULE_DESC).descStrArr;
            var wrapper = jsrender.templates(previewRuleTemp).render(this.previewRule);
            $('#J_previewContent').html(wrapper);
        },
        /**
         * desc: 渲染告警树形结构
         */
        renderAlarmTree: function () {
            var source = {
                datatype: 'json',
                datafields: [
                    { name: 'id' },
                    { name: 'parentid' },
                    { name: 'text' },
                    { name: 'value' }
                ],
                id: 'id',
                localdata: this.currRuleData.RULE_TYPE === '阈值' ? this.descValueArr : this.descEventArr
            }
            var dataAdapter = new $.jqx.dataAdapter(source);
            dataAdapter.dataBind();
            var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);
            $('.desc-item-name').jqxTree({ source: records, width: '300px' });
        },
        /**
         * desc: 组织规则描述树形图数据
         */
        converDescDataStruct: function (data) {
            this.descTreeConvBeforeData = data;
            var that = this;
            var descItemUintObj = {};
            $.each(data, function (i, item) {
                var arr = [];
                $.each(item.TYPE2, function (j, jtem) {
                    arr.push({
                        id: '0' + j,
                        parentid: -1,
                        text: jtem.VAL,
                        val: jtem.VAL
                    })
                    jtem.id = '0' + j;
                    $.each(jtem.TYPE3, function (k, ktem) {
                        arr.push({
                            id: '00' + j + k,
                            parentid: jtem.id,
                            text: ktem.VAL,
                            val: ktem.VAL
                        })
                        ktem.id = '00' + j + k;
                        $.each(ktem.TYPE4, function (l, ltem) {
                            arr.push({
                                id: '000' + j + k + l,
                                parentid: ktem.id,
                                text: ltem.VAL,
                                val: ltem.UNIT
                            })
                            descItemUintObj[ltem.VAL] = {
                                UNIT: ltem.UNIT,
                                PARENT: jtem.VAL
                            };
                            if (j === 0 && k === 0 && l === 0) {
                                item.TYPE1 === '阈值' ? that.descInitValueStr = ltem.VAL : that.descInitEventStr = ltem.VAL;
                            }
                        })
                    })
                })
                item.TYPE1 === '阈值' ? that.descValueArr = arr : that.descEventArr = arr;
            })
            that.descItemUintObj = descItemUintObj;
        },
        /**
         * desc: 新增规则
         */
        addNewRuleToList: function (data) {
            var that = this;
            var url = '/alarm/alarmConfig/data',
                method = 'post',
                params = JSON.stringify(data),
                fnSuccess = function () {
                    $('.rule-modal').modal('hide');
                    that.getWarnRuleList();
                };
            this.postData(url, method, params, fnSuccess);
        },
        /**
         * desc: 修改规则
         */
        updateRuleData: function (data) {
            var that = this;
            var url = '/alarm/alarmConfig/data?update',
                method = 'post',
                params = JSON.stringify(data),
                fnSuccess = function () {
                    $('.rule-modal').modal('hide');
                    that.getWarnRuleList();
                },
                fnError = function (error) {
                    console.log(error);
                    $('.j-addRuleBtn').prop('disabled', false);
                };
            this.postData(url, method, params, fnSuccess, fnError);
        },
        /**
         * desc: 新增或修改规则时，拼装RULE_DESC
         */
        assembleRuleDesc: function () {
            // 遍历td中的input 拼接RULE_DESC
            var descStrArr = [],
                compareStr = '',
                compareIdx,
                data = {
                    data: [],
                    result: true
                };
            $('.rule-desc-list tr').each(function (i) {
                var tempStr = '';
                $(this).children('td').each(function (j) {
                    $(this).children('.input-group').each(function (k) {
                        var $temp = $(this).find('.desc-item-value');
                        if ($temp.length && !$temp.val()) {
                            var str = '.rule-desc-list tr:nth-child(' + (i + 1) + ') .input-group';
                            (data.data[data.data.length - 1] !== str) && (data.data.push(str));
                            data.result = false;
                        }
                        if (i === 0 && j === 0) { tempStr = '('; return; }
                        if (j === 0 && k === 0) {
                            tempStr = tempStr + '(';
                            $(this).find('input').val() === '与条件' ? descStrArr.push('and') : descStrArr.push('or');;
                        }
                        if (j > 0) {
                            compareStr = $(this).find('input').val().trim();
                            if ($(this).find('input').val() === '包含') {
                                compareStr = 'like';
                                compareIdx = j;
                            }
                            if ($(this).find('input').val() === '不包含') {
                                compareStr = 'not like';
                                compareIdx = j;
                            }
                            if (compareIdx + 1 === j && tempStr.indexOf('like') && k === 0) {
                                compareStr = '"%' + compareStr + '%"';
                            }
                            if (j === 2 && k === 0) {
                                compareStr = compareStr.replace(/ /g, '');
                            }
                            tempStr = tempStr + compareStr + ' ';
                        }
                    })
                });
                tempStr = tempStr.trim() + ')';
                descStrArr.push(tempStr);
            });
            var groupCount = (descStrArr.length - 1) / 2;
            var descStr = descStrArr[0];
            for (var i = 0; i < groupCount; i++) {
                descStr = '(' + descStr + ' ' + descStrArr[2 * i + 1] + ' ' + descStrArr[2 * i + 2] + ')';
            }
            if (!data.result) {
                return data;
            } else {
                return {
                    data: descStr,
                    result: true
                };
            }
        },
        /**
         * desc: 删除告警规则
         */
        deleteWarnRule: function (ruleID) {
            var that = this;
            var url = '/alarm/alarmConfig/data?delete',
                method = 'post',
                params = JSON.stringify({
                    'ID': ruleID
                }),
                fnSuccess = function () {
                    $('#deleteModal').modal('hide');
                    that.getWarnRuleList();
                },
                fnError = function () {
                    $('#deleteModal').modal('hide')
                };
            this.postData(url, method, params, fnSuccess, fnError);
        },
        /**
         * desc: 隐藏Modal
         */
        hide: function () {
            $('.rule-modal').modal('hide');
            this.formateData();
        },
        /**
         * desc: 显示错误提示
         */
        showErrorTip: function (selector, errorMsg) {
            $(selector).find(' .error-tip').css('display', 'block');
            $(selector).find(' .error-msg').text(errorMsg);
        },
        /**
         * desc: 隐藏错误提示
         */
        hideErrorTip: function (selector) {
            $(selector).find('.error-tip').css('display', 'none');
        },
        /**
         * desc: 格式化数据
         */
        formateData: function () {
            // this.currRuleData = {
            //     ID: '',
            //     RULE_TYPE: '阈值',
            //     ALARM_LEVEL: '1',
            //     RULE_NAME: '',
            //     ALARM_OBJECT: '',
            //     RULE_DESC: '',
            //     UPDATE_TIME: '',
            //     ALARM_TYPE: '',
            //     NOTICE: ''
            // };
            this.currRuleData = {
                ID: '',
                RULE_TYPE: this.defaultInputVal.RULE_TYPE,
                ALARM_LEVEL: this.defaultInputVal.ALARM_LEVEL_VALUE,
                RULE_NAME: '', // 必填
                ALARM_OBJECT: this.defaultInputVal.ALARM_OBJECT_VALUE,
                RULE_DESC: '', // 必填
                UPDATE_TIME: '',
                ALARM_TYPE: this.defaultInputVal.ALARM_TYPE_VALUE,
                NOTICE: this.defaultInputVal.NOTICE_VALUE
            };
        },
        /**
         * desc: 请求函数
         * @param  {string} url
         * @param  {string} method
         * @param  {obj} params        请求参数
         * @param  {func} fnSuccess 成功回调函数
         * @param  {func} fnError   失败回调函数
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
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    // that._observer._popLayer._biGraphyCenterPop.removeLoading();
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
    // var initPagen = function() {
    //     $('.page').html(pagenationTemplate);
    // };
    new WARNRULE().init();
});
