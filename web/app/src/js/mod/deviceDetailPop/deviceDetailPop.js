/**
 * @module mod/DEVICEDETAILPOP 设备详情弹框
 */
define(function (require) {
    'use strict'

    var jsrender = require('plugin/jsrender/jsrender');
    var LineColumnChart = require('mod/chart/LineColumnChart');

    var templateDeviceDetail = jsrender.templates(
        '<div class="panel panel-default mc-panel deviceDetail-popup deviceDetail">' +
        '<div class="device-profile-close"><span class="j-close">关闭</span></div>' +
        '<div class="panel-heading mc-panel-heading">' +
        '<h3 class="panel-title">设备详情</h3>' +
        '<div class="device-profile-close"><span class="j-close">关闭</span></div>' +
        '</div>' +
        '<div class="pop-body">' +
        '<div class="panel-body">'
        + '{{for base}}'
        // + '{{if deviceType == "container"}}'
        // +	'<p>车牌号: <span>{{>OBJ_TRUCK_LICENSE}}</span><p>'
        // +	'<p>编号: <span>{{>OBJ_TRUCK_CODE}}</span><p>'
        // +	'<p>车队代码: <span>{{>OBJ_TRUCK_COMPANY}}</span><p>'
        // +	'<p>集卡型号: <span>{{>OBJ_TRUCK_TYPE}}</span><p>'
        // +	'<p>作业类型: <span>{{>OBJ_TRUCK_WORK_TYPE}}</span><p>'
        // +	'<p>内外集卡: <span>{{>OBJ_TRUCK_NW}}</span><p>'
        // + 	'<p>是否限空箱: <span>{{>OBJ_TRUCK_EMPTYCTN_FLAG}}</span></p>'
        // +	'<p>是否具有危险品资质: <span>{{>OBJ_TRUCK_DANGEROUS_FLAG}}</span><p>'
        // +	'<p>是否是监管车辆: <span>{{>OBJ_TRUCK_MONITOR_FLAG}}</span><p>'
        + '{{if deviceType == "container"}}'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>车牌号</td> <td>{{>OBJ_TRUCK_LICENSE}}</td>'
        + '<td>编号</td> <td>{{>OBJ_TRUCK_CODE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>车队代码</td> <td>{{>OBJ_TRUCK_COMPANY}}</td>'
        + '<td>集卡型号</td> <td>{{>OBJ_TRUCK_TYPE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>作业类型</td> <td>{{>OBJ_TRUCK_WORK_TYPE}}</td>'
        + '<td>内外集卡</td> <td>{{>OBJ_TRUCK_NW}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>是否限空箱</td> <td>{{>OBJ_TRUCK_EMPTYCTN_FLAG}}</td>'
        + '<td>是否具有危险品资质</td> <td>{{>OBJ_TRUCK_DANGEROUS_FLAG}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>是否是监管车辆</td> <td>{{>OBJ_TRUCK_MONITOR_FLAG}}</td>'
        + '<td></td> <td></td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'

        + '{{else deviceType == "bridgecrane"}}'
        // + 	'<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
        // +	'<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
        // + 	'<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
        // +	'<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
        // +	'<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
        // +	'<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
        // +	'<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
        // +	'<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
        // +	'<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
        // +	'<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
        + '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
        + '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
        + '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
        + '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
        + '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '{{else deviceType == "gantrycrane"}}'
        // + 	'<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
        // +	'<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
        // + 	'<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
        // +	'<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
        // +	'<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
        // +	'<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
        // +	'<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
        // +	'<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
        // +	'<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
        // +	'<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
        + '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
        + '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
        + '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
        + '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
        + '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '{{else deviceType == "reachstacker"}}'
        // + 	'<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
        // +	'<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
        // + 	'<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
        // +	'<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
        // +	'<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
        // +	'<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
        // +	'<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
        // +	'<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
        // +	'<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
        // +	'<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
        + '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
        + '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
        + '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
        + '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
        + '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '{{else deviceType == "stacker"}}'
        // + 	'<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
        // +	'<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
        // + 	'<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
        // +	'<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
        // +	'<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
        // +	'<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
        // +	'<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
        // +	'<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
        // +	'<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
        // +	'<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
        + '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
        + '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
        + '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
        + '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
        + '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '{{else deviceType == "ship"}}'
        // +    '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
        // +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
        // +    '<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
        // +    '<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
        // +    '<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
        // +    '<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
        // +    '<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
        // +    '<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
        // +    '<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
        // +    '<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
        + '<table class="table deviceInfo-table">'
        + '<tbody>'
        + '<tr>'
        + '<td>船舶代码</td> <td>{{>OBJ_VESSEL_CODE}}</td>'
        + '<td>船舶中文名</td> <td>{{>OBJ_VESSEL_NAMEC}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>国籍</td> <td>{{>OBJ_VESSEL_OWNER}}</td>'
        + '<td>MMSI</td> <td>{{>OBJ_VESSEL_TYPE}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>船长</td> <td>{{>OBJ_VESSEL_LOA}}</td>'
        + '<td>船宽</td> <td>{{>OBJ_VESSEL_WIDTH}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>航次</td> <td>{{>OBJ_VESSEL_UN_CODE}}</td>'
        + '<td>到港时间</td> <td>{{>STA_ATA}}</td>'
        + '</tr>'
        + '<tr>'
        + '<td>载重</td> <td>{{>OBJ_VESSEL_DWT}} 吨</td>'
        + '<td>总重</td> <td>{{>OBJ_VESSEL_GRT}} 吨</td>'
        + '</tr>'
        + '</tbody>'
        + '</table>'
        + '{{/if}}'
        + '{{/for}}' +
        '</div>' +
        '<div class="device-info-bottom">' +
        '{{if base.deviceType == "ship"}}' +
        '<ul id="myTab" class="nav nav-tabs">' +
        '<li class="active"><a data-toggle="tab">综合分析</a></li>' +
        '<li class="j-breakDown"><a data-toggle="tab">停机信息</a></li>' +
        '</ul>' +
        '{{else}}' +
        '<ul id="myTab" class="nav nav-tabs">' +
        '<li class="active"><a data-toggle="tab">综合分析</a></li>' +
        '<li class="j-breakDown"><a data-toggle="tab">停机信息</a></li>' +
        '<li><a data-toggle="tab">作业信息</a></li>' +
        '</ul>' +
        '{{/if}}' +
        '<div class="device-bottom">' +
        '{{if base.loading}}' +
        '<div class="panel-body panel-loading">' +
        '<div class="loading"></div>' +
        '</div>' +
        '{{else}}' +
        '<div id="myTabContent" class="tab-content">' +
        '<div class="tab-pane statusInfo active" id="J_statusInfo">' +
        '{{if !analysis}}' +
        '<div class="clearfix">' +
        '<p class="text-center">该设备暂无执行作业</p>' +
        '</div>' +
        '{{else base.deviceType == "bridgecrane"}}' +
        '<div class="clearfix">' +
        '<p class="pull-left">正在工作的船舶</p>' +
        '<p class="pull-right">{{>analysis.vessel}}</p>' +
        '</div>' +
        '<div class="clearfix">' +
        '<p class="pull-left">作业开始时间</p>' +
        '<p class="pull-right">{{>analysis.startTime}}</p>' +
        '</div>' +
        '<div class="clearfix">' +
        '<p class="pull-left">作业结束时间</p>' +
        '<p class="pull-right">{{>analysis.endTime}}</p>' +
        '</div>' +
        '<div class="clearfix panel">' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.jobCount}}</h2>' +
        '<p>作业量 (Unit)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>平均效率 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>故障次数</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{else base.deviceType == "gantrycrane"}}' +
        '<div class="clearfix panel">' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.jobCount}}</h2>' +
        '<p>作业量 (Unit)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>平均效率 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>故障次数</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{else base.deviceType == "stacker"}}' +
        '<div class="clearfix panel">' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.jobCount}}</h2>' +
        '<p>作业量 (Unit)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>平均效率 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>故障次数</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{else base.deviceType == "container"}}' +
        '<div class="clearfix panel">' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.jobCount}}</h2>' +
        '<p>作业量 (Unit)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>平均效率 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>故障次数</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>实时速度 (Km/h)</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{else base.deviceType == "ship"}}' +
        '<div class="clearfix">' +
        '<p class="pull-left">作业开始时间</p>' +
        '<p class="pull-right">{{>analysis.startTime}}</p>' +
        '</div>' +
        '<div class="clearfix">' +
        '<p class="pull-left">作业结束时间</p>' +
        '<p class="pull-right">{{>analysis.endTime}}</p>' +
        '</div>' +
        '<div class="clearfix">' +
        '<p class="pull-left">计划作业箱量</p>' +
        '<p class="pull-right">{{>analysis.plan}}</p>' +
        '</div>' +
        '<div class="clearfix panel">' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.unit}}</h2>' +
        '<p>作业量 (Unit)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>作业箱量 (TEU)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.efficiency}}</h2>' +
        '<p>船时效率 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-6">' +
        '<div>' +
        '<h2>{{>analysis.errorCount}}</h2>' +
        '<p>设备停机次数 (MPH)</p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '{{/if}}' +
        '<div class="graphy clearfix">' +
        '<h5 class="pull-left">作业过程情况分布</h5>' +
        '<div id="LineColumn" style="height: 200px; width: 380px;"></div>' +
        '<div class="legend row">' +
        '<div class="col-sm-4">' +
        '<span class="legendColor" style="background-color: #4DA64D"></span>' +
        '<span>正常作业</span>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<span class="legendColor" style="background-color: #FF1818"></span>' +
        '<span>设备故障</span>' +
        '</div>' +
        '<div class="col-sm-4">' +
        '<span class="legendColor" style="background-color: #FFC04D"></span>' +
        '<span>其他原因停机</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="tab-pane breakDown" id="J_breakDown">' +
        '<table class="table table-striped">' +
        '<thead>' +
        '<tr>' +
        '<th>船名航次</th>' +
        '<th>开始时间</th>' +
        '<th>持续时间</th>' +
        '<th>原因</th>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '{{if breakDown && breakDown.length}}' +
        '{{if base.deviceType != "ship"}}' +
        '{{for breakDown}}' +
        '<tr>' +
        '<td>{{>WORK_CONTENTS}}</td>' +
        '<td>{{>REPORT_TIME}}</td>' +
        '<td>{{>EFFECT_MINUTES}}min</td>' +
        '<td>{{>FAIL_DESC}}</td>' +
        '</tr>' +
        '{{/for}}' +
        '{{else}}' +
        '{{for breakDown}}' +
        '<tr>' +
        '<td>{{>~root.base._equipmentCode}}</td>' +
        '<td>{{>START_TIME}}</td>' +
        '<td style="width: 86px;">{{>END_TIME}}</td>' +
        '<td style="width: 30%;">{{>MEMO}}</td>' +
        '</tr>' +
        '{{/for}}' +
        '{{/if}}' +
        '{{else}}' +
        '<tr class="noDataTip"><td colspan=4 class="text-center">' +
        '暂无停机信息' +
        '</td></tr>' +
        '{{/if}}' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div class="tab-pane in lollipop-group jobInfo" id="J_jobInfo" >'
        + '{{for job}}'
        + '<li>'
        + '<time class="cbp_tmtime">{{>startTime}}</time>'
        + '<div class="cbp_tmicon cbp_tmicon-screen"></div>'
        + '<div class="cbp_tmlabel">'
        + '<span>作业指令：<font class="font-blue">{{>jobName}}</font></span>'
        + '<span>持续时间：{{>jobTime}}</span>'
        + '<span>结束时间：{{>endTime}}</span>'
        + '<span>箱子编号：<a class="font-blue click-box-detail" data-id="{{>boxId}}">{{>boxId}}</a></span>'
        + '</div>'
        + '</li>'
        + '{{/for}}' +
        '</div>' +
        '</div>' +
        '{{/if}}' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
    );

    var DEVICEDETAILPOP = function (cfg) {
        if (!(this instanceof DEVICEDETAILPOP)) {
            return new DEVICEDETAILPOP().init(cfg);
        }
    }

    DEVICEDETAILPOP.prototype = $.extend({}, {
        init: function (cfg) {
            this._observer = cfg.observer;
            this.wraper = $('#J_deviceDetail');
            return this;
        },
        bindEvent: function () {
            var that = this;
            // 告警弹框相关时间
            this.wraper.on('click', '.j-close', function () {//关闭
                that.hide();
                that._observer._overMap.hideSelectedEquipment();
                delete this;
            })
                .on('click', '#myTab li', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.device-bottom .tab-pane').eq($(this).index()).addClass('active').siblings().removeClass('active');
                })
                .on('click', '.click-box-detail', function (ev) {
                    var it = $(ev.target);
                    var boxId = it.attr('data-id');
                    that._observer.showPop('boxDetail', { 'boxId': boxId });
                    // that.hide();
                    // delete this;
                });

            $(document).on('click', '.j-breakDown', function () {
                if ($(document).height() < 800) {
                    if ($('.device-info-bottom tbody').height() > 240) {
                        $('.device-info-bottom table').addClass('over');
                        $('.device-info-bottom tbody').css('height', 240 + 'px');
                    }
                } else {
                    if ($('.device-info-bottom tbody').height() > 520) {
                        $('.device-info-bottom table').addClass('over');
                        $('.device-info-bottom tbody').css('height', 520 + 'px');
                    }
                }

            })
        },
        /**
         * desc: 渲染设备详情弹框
         */
        renderDeviceDetail: function (args) {
            var that = this;
            that._equipmentCode = args._equipmentCode;
            that.base = $.extend({ deviceType: args.deviceType, url: args.iconStatus, jobStatus: args.jobStatus, _equipmentCode: args._equipmentCode }, args.deviceData);
            that.showDeviceInfo({ 'base': $.extend(that.base, { 'loading': true }) });
            var type = args.deviceType;
            //集卡和其他设备分别处理
            $.ajax({
                type: 'get',
                url: '/portvision/object/job',
                data: {
                    'currentPage': '1',
                    'pageSize': '20',
                    'order': 'job_end_time',
                    'key': type === 'container' ? 'truck_code' : 'FROM_EQUIPMENT_CODE',
                    'operator': 'EQUALS',
                    'logic': 'or',
                    'condition': 'TO_EQUIPMENT_CODE',
                    'value': args._equipmentCode
                },
                dataType: 'json'
            }).then(function (data) {
                that.job = data.result;
                return ($.ajax({
                    type: 'get',
                    url: '/portvision/object/' + (type === 'ship' ? ('event/dutycompany@performance/EQUALS@EQUALS/' + args._equipmentCode + '@vessel') : ('hitch/eqp_id@report_time/EQUALS@LIKE/' + args._equipmentCode) + '@' + new Date().getFullYear() + '-' + ('01')),
                    // '/portvision/object/' + (type == 'ship' ? ('event/dutycompany@performance@event_day/EQUALS@EQUALS@LIKE/'+ args._equipmentCode + '@vessel') : ('hitch/eqp_id@report_time/EQUALS@LIKE/' + args._equipmentCode)) + '@' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
                    data: '',
                    dataType: 'json'
                }))
            }).then(function (data) {
                that.breakDown = data;
                switch (args.deviceType) {
                    case 'bridgecrane':
                        type = 'bridgeCrane';
                        break;
                    case 'gantrycrane':
                        type = 'gantryCrane';
                        break;
                    case 'stacker':
                        type = 'emptyContainerHandlers';
                        break;
                    case 'container':
                        type = 'truck';
                        break;
                    case 'ship':
                        type = 'vessel';
                        break;
                    case 'reachstacker':
                        type = 'reachStacker';
                        break;
                    default:
                        type = args.deviceType;
                        break;
                }
                return ($.ajax({
                    type: 'get',
                    url: '/portvision/data/analyse/' + type + '/' + args._equipmentCode,
                    data: '',
                    dataType: 'json'
                }))
            }).done(function (data) {
                var analysis = data;
                analysis.efficiency && (analysis.efficiency = data.efficiency.toFixed(2));
                var xArr = [],
                    yArr = [],
                    interval = 5;   // data.job中X的间隔是5
                $.each(data.job, function (idx, item) {
                    xArr.push(item.X);
                    yArr.push(item.Y);
                })
                var returnData = that.getBreakDownData([{ 'arr': data.fault_eqp, 'flag': 'eqp' }, { 'arr': data.fault_oth, 'flag': 'oth' }], interval, xArr, yArr);
                if (!$('#J_deviceDetail').is(':hidden') && that._equipmentCode === args._equipmentCode) {
                    that.renderDeviceInfo({ 'base': $.extend(that.base, { 'loading': false }), 'breakDown': that.breakDown, 'job': that.job, 'analysis': analysis });
                    if (analysis) {
                        var lineColumnChart = new LineColumnChart();
                        lineColumnChart.init({
                            dom: document.getElementById('LineColumn'),
                            data: {
                                xData: returnData.xArr,
                                yData: returnData.yArr,
                                // fault: [{'sdx': 50, 'edx': 100, 'flag': 'eqp'}, {'sdx': 200, 'edx': 300, 'flag': 'oth'}],
                                fault: returnData.fault
                            }
                        });
                    }
                }
            })
            that.bindEvent();
        },


        /*
         *  根据数据渲染设备详情内容
         */
        renderDeviceInfo: function (data) {
            var that = this;
            var deviceType = data.base.deviceType;
            //数据处理
            var job = [];
            if (deviceType === 'container') {//集卡
                $.each(data.job, function (k, v) {
                    // var oneJob = v;
                    var jobTemp = {};
                    jobTemp.jobName = v.FROM_LOCATION + v.FROM_POSITION_QUALIFIER + v.FROM_SLOT_POSITION + ' >> ' + v.TO_LOCATION + v.TO_POSITION_QUALIFIER + v.TO_SLOT_POSITION;
                    jobTemp.startTime = v.JOB_START_TIME;
                    jobTemp.endTime = v.JOB_END_TIME;
                    jobTemp.jobTime = that.getTimeDiff(jobTemp.startTime, jobTemp.endTime);
                    jobTemp.boxId = v.CTN_NO;
                    job.push(jobTemp);
                })
            } else {//桥吊

                $.each(data.job, function (k, v) {
                    // var oneJob = v;
                    var jobTemp = {};
                    jobTemp.jobName = v.FROM_LOCATION + v.FROM_POSITION_QUALIFIER + v.FROM_SLOT_POSITION + ' >> ' + v.TO_LOCATION + v.TO_POSITION_QUALIFIER + v.TO_SLOT_POSITION;
                    jobTemp.endTime = v.JOB_END_TIME;
                    jobTemp.startTime = v.JOB_START_TIME;
                    jobTemp.jobTime = that.getTimeDiff(jobTemp.startTime, jobTemp.endTime);
                    jobTemp.boxId = v.CTN_NO;
                    job.push(jobTemp);
                })
            }
            that.wraper = $('#J_deviceDetail');
            that.wraper.html('');
            var device = { 'base': data.base, 'job': job, 'breakDown': data.breakDown, 'analysis': data.analysis };
            var htmlValue = templateDeviceDetail.render(device);
            that.wraper.html(htmlValue);
            that.wraper.show().find('.panel-loading').hide();
            $('#J_deviceDetail .device-bottom').css('padding-top', $('#J_deviceDetail .deviceInfo-table ').height() + 100);
            that.bindEvent();
        },
        /**
         * desc: 显示设备详情浮层，响应优先
         */
        showDeviceInfo: function (data) {
            var that = this;
            // var deviceType = data.base.deviceType;
            that.wraper = $('#J_deviceDetail');
            that.wraper.html('');
            // var device = {'base':data};
            var device = data;
            var htmlValue = templateDeviceDetail.render(device);
            that.wraper.html(htmlValue);
            that.wraper.show();
            $('#J_deviceDetail .device-bottom').css('padding-top', $('#J_deviceDetail .deviceInfo-table ').height() + 100);
            that.bindEvent();
        },
        /**
         * desc: 获取综合分析故障区间数据
         */
        getBreakDownData: function (arr, interval, xArr, yArr) {
            var data = {};
            var fault = [];
            $.each(arr, function (jdx, jtem) {
                $.each(jtem.arr, function (idx, item) {
                    if (!item.x1 || !item.x2) return false;
                    var sdx = $.inArray(item.x1, xArr);
                    var edx = $.inArray(item.x2, xArr);
                    var idx1 = parseInt(item.x1 / interval);
                    var idx2 = parseInt(item.x2 / interval);
                    if (sdx === -1) {
                        xArr.splice(idx1, 0, item.x1);
                        yArr.splice(idx1, 0, item.y1);
                    }
                    if (edx === -1) {
                        xArr.splice(idx2, 0, item.x2);
                        yArr.splice(idx2, 0, item.y2);
                    }
                    if (sdx === -1 && edx !== -1) {
                        fault.push({ 'sdx': idx1, 'edx': edx + 1, 'flag': jtem.flag });  //sdx<edx,插入一个值后位置+1
                    }
                    if (edx === -1 && sdx !== -1) {
                        fault.push({ 'sdx': sdx, 'edx': idx2, 'flag': jtem.flag });
                    }
                    if (sdx === -1 && edx === -1) {
                        fault.push({ 'sdx': idx1, 'edx': idx2, 'flag': jtem.flag });
                    }
                    if (sdx !== -1 && edx !== -1) {
                        fault.push({ 'sdx': sdx, 'edx': edx, 'flag': jtem.flag });
                    }
                })
            })
            data.xArr = xArr;
            data.yArr = yArr;
            data.fault = fault;
            return data;
        },
        /*
         *
         */
        getTimeDiff: function (startTime, endTime) {
            var timeDiff = 0;
            if (!!startTime) {
                startTime = new Date(startTime).getTime();
            }
            if (!!endTime) {
                endTime = new Date(endTime).getTime();
            }
            timeDiff = endTime - startTime;
            timeDiff = timeDiff / 1000 / 60;
            return Math.round(timeDiff);
        },
        /**
         * desc: 隐藏弹框
         */
        hide: function () {
            this.wraper.hide();
        },
        postData: function (url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var that = this;
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

    return DEVICEDETAILPOP;
});