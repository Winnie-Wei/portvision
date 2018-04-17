/**
 * @module port/mod/INFOPOP 图例
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    // var overMap = require('mod/overMap');
    var jsrender = require('plugin/jsrender/jsrender'); // jsrender模板库
    var LineColumnChart = require('mod/chart/LineColumnChart');
    // console.log('infopop init');
    // 模板内容
    var templateDefault = jsrender.templates( 
        '<div class="pop-warn radius5">'
            + '<div class="info-warn">'
                + '<p>弹出框</p>'
            + '</div>'
        + '</div>'
    );
    var templateNewWarn = jsrender.templates( 
        '<div class="pop-warn radius5">'
            + '<div class="ico-warn radius5"></div>'
            + '<div class="device-profile-close"><span class="j-close">X</span></div>'
            + '<div class="info-warn">'
                + '<p>告警消息</p>'
                + '{{for result}}'
                    + '<span class="showOnMap" data-id="{{>ID}}" data-eId="{{>id}}" data-eType="{{>EQUIPMENT_TYPE}}" data-ecode="{{>EQUIPMENT_CODE}}" data-eName="{{>EQUIPMENT_NAME}}">{{>OCCURRENCE_TIME}}：【{{>EQUIPMENT_CODE}}】 {{>CONTENT}}</span></span>'
                + '{{/for}}'
            + '</div>'
        + '</div>' 
    );
    /*var templateMapLeged = jsrender.templates( 
        '<div>'
            + '<li style='background-color:{{>color}}'></li>'
            + '<span>{{>name}}</span></span>'
        + '</div>' 
    );*/
    var templateWarnList = jsrender.templates(
        '<div class="panel panel-default mc-panel deviceDetail-popup warnList">' +
        '<div class="panel-heading mc-panel-heading">' +
            '<h3 class="panel-title">告警清单（{{>result.length}}条）</h3>' +  
            '<div>' + 
                '<p class="transTime">历史</p>' +
                // '<p>分析</p>' +
                // '<span class="j-close">关闭</span>' +
            '</div>' +
        '</div>' +
        '<div class="pop-body">' +
            '<div class="panel-body">' +
            '<div class="warnCount"></div>' 
            + '<table class="table table-striped warn-list-table">'
                + '<thead>'
                    + '<tr>'
                    + '<th>告警时间</th>'
                    + '<th>告警类型</th>'
                    + '<th>告警对象</th>'
                    + '<th>告警内容</th>'
                    + '</tr>'
                + '</thead>'
                + '<tbody>' 
                        + '{{if result.length}}' 
                            + '{{for result}}'
                            + '<tr data-id="{{>ID}}" data-eId="{{>id}}" data-eType="{{>EQUIPMENT_TYPE}}" data-ecode="{{>EQUIPMENT_CODE}}" data-eName="{{>EQUIPMENT_NAME}}">'
                                + '<td><p>{{>warnDay}}</p><p>{{>warnTime}}</p></td>'
                                + '<td>' +
                                    '{{if ALARM_TYPE == "WX"}}危险货物监控' +
                                    '{{else ALARM_TYPE == "YW"}}意外事故' +
                                    '{{else ALARM_TYPE == "HJ"}}环境告警' +
                                    '{{else ALARM_TYPE == "ZYCW"}}作业错误' +
                                    '{{else ALARM_TYPE == "ZYYD"}}作业拥堵' +
                                    '{{else ALARM_TYPE == "ZYWG"}}作业违规' +
                                    '{{else ALARM_TYPE == "GZ"}}故障' +
                                    '{{/if}}' +
                                    '</td>'
                                + '<td>{{>EQUIPMENT_CODE}}</td>'
                                + '<td>{{>CONTENT}}</td>'
                            + '</tr>'
                            + '{{/for}}' 
                        + '{{else !result.length && !result.loading}}'
                                + '<tr><td colspan=4>'
                                    + '<div class="noData text-center">'
                                        + '<p>暂无待处理的告警信息</p>' 
                                        // + '<p><a href="#">告警分析</a></p>'
                                    + '</div>'
                                + '</td></tr>'
                        + '{{else result.loading}}'
                                + '<tr><td colspan=4>'
                                    + '<div class="noData text-center">'
                                        + '<p class="loading"></p>' 
                                        // + '<p><a href="#">告警分析</a></p>'
                                    + '</div>'
                                + '</td></tr>'    
                        + '{{/if}}' 
                    + '</tbody>'
                + '</table>'
                + '</div>'
            + '</div>'
        + '</div>'
    );
    var historyWarnCountTemp = jsrender.templates(
        // '<ul class="historyWarnCount">' + 
        //     '<li>本月累计</li>' +
        //     '<li>20条</li>' +
        //     '<li>本年累计</li>' +
        //     '<li>100条</li>' +
        // '</ul>'
    );
    var templateDeviceProfile = jsrender.templates(
        '<div class="device-profile popup radius4">'
            + '<div class="device-profile-ico" style="background:url(../../src/css/mod/device/images/{{>deviceType}}/{{>url}}.png) center center no-repeat #ffffff;"></div>'
            + '{{if deviceType == "container"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +    '<p>车牌号: <span>{{>OBJ_TRUCK_LICENSE}}</span><p>'
                +    '<p>编号: <span>{{>STA_TRUCK_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_WORK_STATUS]}}">{{>jobStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前载重：<span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-trail"><span data-id="{{>id}}" class="j-trail">轨迹</span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "bridgecrane"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_WORK_STATUS]}}">{{>jobStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "gantrycrane"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_WORK_STATUS]}}">{{>jobStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "reachstacker"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_WORK_STATUS]}}">{{>jobStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "stacker"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_WORK_STATUS]}}">{{>jobStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "ship"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +   '<p>船舶代码: <span>{{>OBJ_VESSEL_CODE}}</span><p>'
                +   '<p>船舶中文名: <span>{{>OBJ_VESSEL_NAMEC}}</span><p>'
                +   '<p>航次: <span>{{>OBJ_VESSEL_UN_CODE}}</span><p>'
                +   '<p>状态: <span class="status-{{>jobStatusStyleMap[STA_CURRENT_STATUS]}}">{{>boatCurrentStatus}}</span></p>'
                +   '<p>船时效率（MPH）：<span>{{>STA_SINGLE_CRANE_EFFICIENCY}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-view"><span data-id="{{>id}}" class="j-boatView">视图</span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "camera"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +   '<p>设备编号: <span>{{>FZWID}}</span><p>'
                +   '<p>可视范围: <span>{{>VIEW_RANGE}}</span><p>'
                +   '<p>监控区域: <span>{{>MONITOR_AREA}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "hydrant"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +   '<p>设备编号: <span>{{>FZWID}}</span><p>'
                // +   '<p>可视范围: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                // +   '<p>监控区域: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "sensor"}}'
                + '<div class="device-profile-info status-{{>jobStatus}}">'
                +   '<p>设备编号: <span>{{>FZWID}}</span><p>'
                +   '<p>可视范围: <span>{{>VIEW_RANGE}}</span><p>'
                +   '<p>监控区域: <span>{{>MONITOR_AREA}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{/if}}'
        + '</div>'
    );

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
                        // +    '<p>车牌号: <span>{{>OBJ_TRUCK_LICENSE}}</span><p>'
                        // +    '<p>编号: <span>{{>OBJ_TRUCK_CODE}}</span><p>'
                        // +    '<p>车队代码: <span>{{>OBJ_TRUCK_COMPANY}}</span><p>'
                        // +    '<p>集卡型号: <span>{{>OBJ_TRUCK_TYPE}}</span><p>'
                        // +    '<p>作业类型: <span>{{>OBJ_TRUCK_WORK_TYPE}}</span><p>'
                        // +    '<p>内外集卡: <span>{{>OBJ_TRUCK_NW}}</span><p>'
                        // +     '<p>是否限空箱: <span>{{>OBJ_TRUCK_EMPTYCTN_FLAG}}</span></p>'
                        // +    '<p>是否具有危险品资质: <span>{{>OBJ_TRUCK_DANGEROUS_FLAG}}</span><p>'
                        // +    '<p>是否是监管车辆: <span>{{>OBJ_TRUCK_MONITOR_FLAG}}</span><p>'
                        + '{{if deviceType == "container"}}'
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>车牌号</td> <td>{{>OBJ_TRUCK_LICENSE}}</td>'
                                    +   '<td>编号</td> <td>{{>OBJ_TRUCK_CODE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>车队代码</td> <td>{{>OBJ_TRUCK_COMPANY}}</td>'
                                    +   '<td>集卡型号</td> <td>{{>OBJ_TRUCK_TYPE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>作业类型</td> <td>{{>OBJ_TRUCK_WORK_TYPE}}</td>'
                                    +   '<td>内外集卡</td> <td>{{>OBJ_TRUCK_NW}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>是否限空箱</td> <td>{{>OBJ_TRUCK_EMPTYCTN_FLAG}}</td>'
                                    +   '<td>是否具有危险品资质</td> <td>{{>OBJ_TRUCK_DANGEROUS_FLAG}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>是否是监管车辆</td> <td>{{>OBJ_TRUCK_MONITOR_FLAG}}</td>'
                                    +   '<td></td> <td></td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'

                        + '{{else deviceType == "bridgecrane"}}'
                        // +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                        // +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                        // +     '<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
                        // +    '<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
                        // +    '<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
                        // +    '<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
                        // +    '<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
                        // +    '<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
                        // +    '<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
                        // +    '<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
                                    +   '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
                                    +   '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
                                    +   '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
                                    +   '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
                                    +   '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'
                        + '{{else deviceType == "gantrycrane"}}'
                        // +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                        // +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                        // +     '<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
                        // +    '<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
                        // +    '<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
                        // +    '<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
                        // +    '<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
                        // +    '<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
                        // +    '<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
                        // +    '<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
                                    +   '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
                                    +   '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
                                    +   '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
                                    +   '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
                                    +   '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'
                        + '{{else deviceType == "reachstacker"}}'
                        // +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                        // +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                        // +     '<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
                        // +    '<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
                        // +    '<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
                        // +    '<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
                        // +    '<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
                        // +    '<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
                        // +    '<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
                        // +    '<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
                                    +   '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
                                    +   '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
                                    +   '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
                                    +   '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
                                    +   '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'
                        + '{{else deviceType == "stacker"}}'
                        // +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                        // +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                        // +     '<p>设备公司: <span>{{>OBJ_EQUIPMENT_COMPANY}}</span></p>'
                        // +    '<p>设备型号: <span>{{>OBJ_EQUIPMENT_MODLE}}</span><p>'
                        // +    '<p>额定吊载: <span>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</span><p>'
                        // +    '<p>额定寿命: <span>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</span><p>'
                        // +    '<p>生产日期: <span>{{>OBJ_EQUIPMENT_CREATE_TIME}}</span><p>'
                        // +    '<p>购买日期: <span>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</span><p>'
                        // +    '<p>登记日期: <span>{{>OBJ_EQUIPMENT_INSERT_TIME}}</span><p>'
                        // +    '<p>供能方式: <span>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</span><p>'
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>设备名称</td> <td>{{>OBJ_EQUIPMENT_CNAME}}</td>'
                                    +   '<td>编号</td> <td>{{>OBJ_EQUIPMENT_CODE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>设备公司</td> <td>{{>OBJ_EQUIPMENT_COMPANY}}</td>'
                                    +   '<td>设备型号</td> <td>{{>OBJ_EQUIPMENT_MODLE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>额定吊载</td> <td>{{>OBJ_EQUIPMENT_LOAD_CAPABILITY}}</td>'
                                    +   '<td>额定寿命</td> <td>{{>OBJ_EQUIPMENT_DESIGN_LEFITIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>生产日期</td> <td>{{>OBJ_EQUIPMENT_CREATE_TIME}}</td>'
                                    +   '<td>购买日期</td> <td>{{>OBJ_EQUIPMENT_PURCHASE_TIME}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>登记日期</td> <td>{{>OBJ_EQUIPMENT_INSERT_TIME}}</td>'
                                    +   '<td>供能方式</td> <td>{{>OBJ_EQUIPMENT_ENERGY_TYPE}}</td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'
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
                        +   '<table class="table deviceInfo-table">'
                            +   '<tbody>'
                                +   '<tr>'
                                    +   '<td>船舶代码</td> <td>{{>OBJ_VESSEL_CODE}}</td>'
                                    +   '<td>船舶中文名</td> <td>{{>OBJ_VESSEL_NAMEC}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>国籍</td> <td>{{>OBJ_VESSEL_OWNER}}</td>'
                                    +   '<td>MMSI</td> <td>{{>OBJ_VESSEL_TYPE}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>船长</td> <td>{{>OBJ_VESSEL_LOA}}</td>'
                                    +   '<td>船宽</td> <td>{{>OBJ_VESSEL_WIDTH}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>航次</td> <td>{{>OBJ_VESSEL_UN_CODE}}</td>'
                                    +   '<td>到港时间</td> <td>{{>STA_ATA}}</td>'
                                +   '</tr>'
                                +   '<tr>'
                                    +   '<td>载重</td> <td>{{>OBJ_VESSEL_DWT}} 吨</td>'
                                    +   '<td>总重</td> <td>{{>OBJ_VESSEL_GRT}} 吨</td>'
                                +   '</tr>'
                            +   '</tbody>'
                        +   '</table>'
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
                            '<div class="panel-body panel-loading">'    +
                                '<div class="loading"></div>'   +
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

    // 数据分析选中弹框
    // var tempCountJobs = 
    //定义
    var INFOPOP = function (cfg) {
        if (!(this instanceof INFOPOP)) {
            return new INFOPOP().init(cfg);
        }
    };

    INFOPOP.prototype = $.extend(new McBase(), {

        /*
         *
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer || null;
            this.initScale = cfg.initScale || 1;
            this.showScale = this.initScale;

            this.data = cfg.data || '';//初始化无值
            this.eqpType = cfg.type || '';//初始化无值
            this.mapId = cfg.mapId || '';//初始化无值 
            this.pos = cfg.mapId || { x: 0, y: 0 };//初始化无值

            this.wraper = $('#');
            // this.wraper = $('#J_jobsOption');
            this.templatesType = cfg.templatesType || 'default';
            this.toolFixStatus = false;
            this.deviceType = '';

            // if(this.elementId =="J_deviceDetail"){
            //     this.wraper.find('#J_deviceBaseDetail').html('');//基础详情
            //     this.wraper.find('#J_jobInfo').html('');//工作状态
            // }else{ 
            //     this.wraper.html('');
            // }
            return this;
        },

        /*setData: function ( args ){
            this.data =  args ;
            if( this.data ){
                this.templatesType = this.data.templatesType;
                this.data.data = this.data.data;
            }
            console.log( this );
            this.render();
        },*/

        /*
         *
         */
        addObject: function (type, datas) {
            this.data = datas;
            this.eqpType = datas.deviceType;
            this.mapId = datas._mapId;
            this.pos = { x: datas.drawX * datas.scaleRatio, y: datas.drawY * datas.scaleRatio };

            switch (type) {
                case 'newWarn': this.renderNewWarn(datas); break;
                case 'warnHistory': this.renderWarnHistory(datas); break;
                case 'warnNum': this.renderWarnNum(datas); break;
                case 'deviceProfile': this.renderDeviceProfile(datas); break;
                case 'deviceDetail': this.renderDeviceDetail(datas); break;
                /* case 'mapLegend' : this.renderMapLegend( datas ); break; */
                default: break;
            }
            //this.bindEvent();            
        },

        /*
         * 显示设备简介弹框
         */
        showProfilePopByData: function (obj) {
            var deviceTp = '';
            switch (obj._type) {
                case 'container': deviceTp = 'truckSta'; break;
                case 'bridgecrane': deviceTp = 'bridgeCraneSta'; break;
                case 'gantrycrane': deviceTp = 'gantryCraneSta'; break;
                case 'stacker': deviceTp = 'emptySta'; break;
                case 'reachstacker': deviceTp = 'reachStackerSta'; break;
                case 'ship': deviceTp = 'shipSta'; break;
            }
            obj.avgWorkEffi = obj.efficiency;
            this.renderDeviceProfile(obj);
            /*var url = '/portvision/data/' + deviceTp + '/' + obj._equipmentCode,
                method = 'get',
                params = '',
                fnSuccess = function( data ) {
                    console.log(data);
                    obj.avgWorkEffi = data.EFF;
                    this.renderDeviceProfile( obj );
                };
            this.postData( url, method, params, fnSuccess );*/
        },

        /*
         * 根据参数渲染数据分析浮层
         */
        // renderDataAnalyseByData: function(data){
        //     this.wraper = $('#J_dataAnalyse');
        //     var template = templateDataAnalyse.render();
        //     this.wraper.html(template).show();
        //     this.bindEvent();
        // },

        /* 
         * 根据参数渲染最新告警浮层
         */
        renderNewWarnsByData: function (newWarns) {
            var self = this;
            if (!newWarns.result || !newWarns.result.length) {
                return false;
            }
            var idTemp = newWarns.result[0].ID;
            if (idTemp !== self.oldWarnId) {
                self.oldWarnId = idTemp;
            } else {
                return false;
            }
            this.wraper = $('#J_newWarn');
            this.wraper.html('');
            var htmlValue = templateNewWarn.render(newWarns);
            $('#J_newWarn').html(htmlValue).show();
            setTimeout(function () {
                self.wraper.html('').hide();
                self.oldWarnId = '';
            }, 60 * 1000);
            this.bindEvent();

        },

        /*
         *
         */
        renderWarnNum: function (datas) {
            if (datas.length === 0) {
                $('#J_warnNum').html('');
            } else {
                var htmlValue = '<div class="circle"></div>';
                $('#J_warnNum').html(htmlValue);
            }
        },

        /*
         * 根据参数渲染当前告警浮层
         */
        renderCurrentWarnsByData: function (datas) {
            if (datas.length) {
                $.each(datas, function (k, v) {
                    var tempDate = v.OCCURRENCE_TIME;
                    v.warnDay = v.OCCURRENCE_TIME.substr(0, 10);
                    v.warnTime = v.OCCURRENCE_TIME.substr(11, 8);
                });
            }
            //this.data = warns;
            this.wraper = $('#J_warnList');
            this.wraper.removeClass('historyWarn');
            this.wraper.html('');
            // datas.result = [];      // 测试没有数据时的提醒
            var htmlValue = templateWarnList.render({ result: datas });
            this.wraper.html(htmlValue);
            ($('#J_warnList tbody').height() > 350) && ($('#J_warnList table').addClass('over'));
            this.bindEvent();
        },

        /*
         * 根据参数渲染历史告警浮层
         */
        renderHistoryWarnsByData: function (datas) {
            $.each(datas.result, function (k, v) {
                var tempDate = v.OCCURRENCE_TIME;
                v.warnDay = v.OCCURRENCE_TIME.substr(0, 10);
                v.warnTime = v.OCCURRENCE_TIME.substr(11, 8);
            });
            //this.data = warns;
            this.wraper = $('#J_warnList');
            this.wraper.addClass('historyWarn');
            this.wraper.html('');
            this.wraper.show();
            // datas.result = [];      // 测试没有数据时的提醒
            var htmlValue = templateWarnList.render(datas);
            var warnCountHtml = historyWarnCountTemp.render(datas);
            this.wraper.html(htmlValue);
            this.wraper.find('.transTime').hide();
            $('#J_warnList .warnCount').html(warnCountHtml);
            ($('#J_warnList tbody').height() > 350) && ($('#J_warnList table').addClass('over'));
            this.bindEvent();
        },

        // /*
        //  *
        //  */       
        // renderDeviceProfile: function( args ){
        //     var posLeft = args.drawX * args.scaleRatio /** this.showScale*/ - 150 ;
        //     var posTop = args.drawY  *args.scaleRatio /** this.showScale*/ - 120 ;
        //     this.initLeft = args.initX;
        //     this.initTop = args.initY;
        //     this.posLeft = posLeft;
        //     this.posTop  = posTop;
        //     this.showScale = args.scaleRatio;
        //     this.wraper = $('#J_deviceProfile');   
        //     this.device = $.extend( {}, args ); 
        //     //判断状态（工作中、维修、故障）
        //     //工作状态：NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
        //     var jobStatusMap = {
        //         'NOINS':'无指令空闲', 
        //         'YESINS':'有指令空闲', 
        //         'WORK':'工作中', 
        //         'FAULT':'故障', 
        //         'REPAIR':'维修'
        //     },
        //     jobStatusStyleMap = {
        //         'NOINS':'free', 
        //         'YESINS':'hasJob', 
        //         'WORK':'active', 
        //         'FAULT':'error', 
        //         'REPAIR':'repair'   
        //     };
        //     switch(args.jobStatus){
        //         case 'WORK':
        //         case 1: args.iconStatus= 'active';break;
        //         case 'NOINS' :
        //         case 2: args.iconStatus= 'free';break;
        //         case 'YESINS':
        //         case 3: args.iconStatus= 'hasJob';break;
        //         case 'FAULT' :
        //         case 4: args.iconStatus= 'error';break;
        //         case 'REPAIR':
        //         case 5: args.iconStatus= 'repair';break;
        //     }

        //     var dataTemp = $.extend({deviceType:args.deviceType, url: args.iconStatus, jobStatus:args.jobStatus, jobStatusMap:jobStatusMap, jobStatusStyleMap:jobStatusStyleMap, avgWorkEffi: args.avgWorkEffi}, args.deviceData);                        
        //     var htmlValue = templateDeviceProfile.render( dataTemp ); 
        //     this.deviceType = args.deviceType;
        //     this.wraper.html( htmlValue );
        //     this.wraper.show();     
        //     if( this.deviceType && this.deviceType == 'bridgecrane' ){
        //         posTop -= 80 * this.showScale;
        //     }else{
        //         posTop -= 10 * this.showScale;
        //     }
        //     this.wraper.find('.popup').show().css( {left: posLeft, top: posTop}); 
        //     this.bindEvent();
        //     //console.log( this.initLeft, this.initTop );
        // },


        /*
         *
         */
        renderDeviceProfile: function (args) {
            this.wraper = $('#J_deviceProfile');
            this.device = $.extend({}, args);
            //判断状态（工作中、维修、故障）
            //工作状态：NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            var jobStatusMap = {
                    'NOINS': '无指令空闲',
                    'YESINS': '有指令空闲',
                    'WORK': '工作中',
                    'FAULT': '故障',
                    'REPAIR': '维修'
                },
                jobStatusStyleMap = {
                    'NOINS': 'free',
                    'YESINS': 'hasJob',
                    'WORK': 'active',
                    'FAULT': 'error',
                    'REPAIR': 'repair'
                };
            switch (args.jobStatus) {
                case 'WORK':
                case 1: args.iconStatus = 'active'; break;
                case 'NOINS':
                case 2: args.iconStatus = 'free'; break;
                case 'YESINS':
                case 3: args.iconStatus = 'hasJob'; break;
                case 'FAULT':
                case 4: args.iconStatus = 'error'; break;
                case 'REPAIR':
                case 5: args.iconStatus = 'repair'; break;
            }
            if (args.deviceType === 'ship') {
                switch (args.deviceData.STA_CURRENT_STATUS) {
                    case 'V_ATA': args.deviceData.boatCurrentStatus = '抵锚'; break;
                    case 'V_BERTH': args.deviceData.boatCurrentStatus = '靠泊'; break;
                    case 'V_WALT_WORK': args.deviceData.boatCurrentStatus = '等开工'; break;
                    case 'V_WORK': args.deviceData.boatCurrentStatus = '开工'; break;
                    case 'V_STOP': args.deviceData.boatCurrentStatus = '停工'; break;
                    case 'V_WAIT_ATD': args.deviceData.boatCurrentStatus = '等离泊'; break;
                    case 'V_ATD': args.deviceData.boatCurrentStatus = '离泊'; break;
                }
            }

            var dataTemp = $.extend({ deviceType: args.deviceType, url: args.iconStatus, jobStatus: args.jobStatus, jobStatusMap: jobStatusMap, jobStatusStyleMap: jobStatusStyleMap, avgWorkEffi: args.avgWorkEffi }, args.deviceData);
            var htmlValue = templateDeviceProfile.render(dataTemp);
            this.deviceType = args.deviceType;
            this.wraper.html(htmlValue);
            this.wraper.show();
            switch (args.mapType) {
                case 'gd': this.gd_setInfoPopPositionByDevice(args); break;
                case 'bd': this.setInfoPopPositionByDevice(args); break;
                default: this.setInfoPopPositionByDevice(args); break;
            }
            this.bindEvent();
            //console.log( this.initLeft, this.initTop );
        },


        /*
         *
         */
        renderDeviceDetail: function (args) {
            var self = this;
            self._equipmentCode = args._equipmentCode;
            self.base = $.extend({ deviceType: args.deviceType, url: args.iconStatus, jobStatus: args.jobStatus, _equipmentCode: args._equipmentCode }, args.deviceData);
            self.showDeviceInfo({ 'base': $.extend(self.base, { 'loading': true }) });
            //集卡和其他设备分别处理
            var type = args.deviceType,    // 设备概况
                code = '',
                url = '/portvision/object/job',
                method = 'get',
                params = {
                    'currentPage': '1',
                    'pageSize': '20',
                    'order': 'job_end_time',
                    'key': type === 'container' ? 'truck_code' : 'FROM_EQUIPMENT_CODE',
                    'operator': 'EQUALS',
                    'logic': 'or',
                    'condition': 'TO_EQUIPMENT_CODE',
                    'value': args._equipmentCode
                },
                fnSuccess = function (data) {
                    if (!data.result || !data.result.length) {
                        console.log('没有指令');
                    }
                    self.job = data.result;
                    // self.renderDeviceInfo({'base':self.base,'job':self.job},code);
                    var type = args.deviceType,
                        code = '',
                        url = '/portvision/object/' + (type === 'ship' ? ('event/dutycompany@performance/EQUALS@EQUALS/' + args._equipmentCode + '@vessel') : ('hitch/eqp_id@report_time/EQUALS@LIKE/' + args._equipmentCode) + '@' + new Date().getFullYear() + '-' + ('01')),
                        // url = '/portvision/object/' + (type == 'ship' ? ('event/dutycompany@performance@event_day/EQUALS@EQUALS@LIKE/'+ args._equipmentCode + '@vessel') : ('hitch/eqp_id@report_time/EQUALS@LIKE/' + args._equipmentCode)) + '@' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
                        method = 'get',
                        fnSuccess = function (data) {
                            if (!data || !data.length) {
                                console.log('没有指令');
                            }
                            var breakDown = data;
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
                                default:
                                    type = args.deviceType;
                                    break;
                            }
                            // if(type == 'ship'){
                            //     self.renderDeviceInfo({'base':self.base,'breakDown':breakDown, 'job':self.job, 'analysis': ''},code);
                            //     return;
                            // }
                            var code = '',
                                url = '/portvision/data/analyse/' + type + '/' + args._equipmentCode,
                                method = 'get',
                                fnSuccess = function (data) {
                                    if (!data || data.length === 0) {
                                        console.log('没有指令');
                                    }
                                    var analysis = data;
                                    analysis.efficiency && (analysis.efficiency = data.efficiency.toFixed(2));
                                    var xArr = [],
                                        yArr = [],
                                        interval = 5;   // data.job中X的间隔是5
                                    $.each(data.job, function (idx, item) {
                                        xArr.push(item.X);
                                        yArr.push(item.Y);
                                    })
                                    var returnData = self.getBreakDownData([{ 'arr': data.fault_eqp, 'flag': 'eqp' }, { 'arr': data.fault_oth, 'flag': 'oth' }], interval, xArr, yArr);
                                    if (!$('#J_deviceDetail').is(':hidden') && self._equipmentCode === args._equipmentCode) {
                                        self.renderDeviceInfo({ 'base': $.extend(self.base, { 'loading': false }), 'breakDown': breakDown, 'job': self.job, 'analysis': analysis }, code);
                                        if (analysis) {
                                            var lineColumnChart = new LineColumnChart();
                                            lineColumnChart.init({
                                                dom: document.getElementById('LineColumn'),
                                                data: {
                                                    xData: returnData.xArr,
                                                    yData: returnData.yArr,
                                                    // fault: [{'sdx': 50, 'edx': 100, 'flag': 'eqp'}, {'sdx': 200, 'edx': 300, 'flag': 'oth'}],
                                                    fault: returnData.fault,
                                                }
                                            });
                                        }
                                    }
                                }
                            this.postData(url, method, params, fnSuccess);
                        };
                    this.postData(url, method, params, fnSuccess);
                };
            this.postData(url, method, params, fnSuccess);
            self.bindEvent();



            // $.ajax({
            //     method: 'get',
            //     url: urlTemp, 
            //     params: {}, 
            //     success: function( data ){ 
            //         if( !data.result || !data.result.length ){
            //             console.log( '没有指令');
            //         }
            //         self.job = data.result;                        
            //         self.renderDeviceInfo({'base':self.base,'job':self.job},code);
            //         $('#J_deviceDetail .device-bottom').css('max-height', $(window).height()*0.4);
            //     },
            //     fail: function( error ){
            //         console.log(error);
            //     }
            // });

            // 以上代码先注释，先不显示作业信息、状态信息等
            // self.renderDeviceInfo({'base':self.base});
            //    $('#J_deviceDetail .device-bottom').css('max-height', $(window).height()*0.4);
        },

        /*
         * 获取综合分析故障区间数据
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
         *  显示设备详情浮层，响应优先
         */
        showDeviceInfo: function (data) {
            var self = this;
            var deviceType = data.base.deviceType;
            self.wraper = $('#J_deviceDetail');
            self.wraper.html('');
            // var device = {'base':data};
            var device = data;
            var htmlValue = templateDeviceDetail.render(device);
            self.wraper.html(htmlValue);
            self.wraper.show();
            $('#J_deviceDetail .device-bottom').css('padding-top', $('#J_deviceDetail .deviceInfo-table ').height() + 100);
            self.bindEvent();
        },

        /*
         *  根据数据渲染设备详情内容
         */
        renderDeviceInfo: function (data, deviceId) {
            var self = this;
            var deviceType = data.base.deviceType;
            //数据处理
            var job = [];
            // var job = [];
            // job = [{
            //         'startTime':'2017.03.23',
            //         'jobName': '166304.4>>266304.3',
            //         'jobTime':'2 小时',
            //         'endTime':'12:34:56',
            //         'boxId':'DFSU7163868',
            //     },{
            //         'startTime':'2017.03.24',
            //         'jobName': '332304.4>>266304.3',
            //         'jobTime':'10分钟',
            //         'endTime':'12:00:05',
            //         'boxId':'TCNU6328013',
            //     },{
            //         'startTime':'2017.03.23',
            //         'jobName': '166304.4>>266304.3',
            //         'jobTime':'2 小时',
            //         'endTime':'12:34:56',
            //         'boxId':'DFSU7163868',
            //     },{
            //         'startTime':'2017.03.24',
            //         'jobName': '332304.4>>266304.3',
            //         'jobTime':'10分钟',
            //         'endTime':'12:00:05',
            //         'boxId':'TCNU6328013',
            //     }];

            // var breakDown = [
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            //     ['GJZ1214', '8:00:00', '15min', '故障'],
            // ]


            if (deviceType === 'container') {//集卡                
                $.each(data.job, function (k, v) {
                    var oneJob = v;
                    var jobTemp = {};
                    jobTemp.jobName = v.FROM_LOCATION + v.FROM_POSITION_QUALIFIER + v.FROM_SLOT_POSITION + ' >> ' + v.TO_LOCATION + v.TO_POSITION_QUALIFIER + v.TO_SLOT_POSITION;
                    jobTemp.startTime = v.JOB_START_TIME;
                    jobTemp.endTime = v.JOB_END_TIME;
                    jobTemp.jobTime = self.getTimeDiff(jobTemp.startTime, jobTemp.endTime);
                    jobTemp.boxId = v.CTN_NO;
                    job.push(jobTemp);
                })
            } else {//桥吊

                $.each(data.job, function (k, v) {
                    var oneJob = v;
                    var jobTemp = {};
                    jobTemp.jobName = v.FROM_LOCATION + v.FROM_POSITION_QUALIFIER + v.FROM_SLOT_POSITION + ' >> ' + v.TO_LOCATION + v.TO_POSITION_QUALIFIER + v.TO_SLOT_POSITION;
                    jobTemp.endTime = v.JOB_END_TIME;
                    jobTemp.startTime = v.JOB_START_TIME;
                    jobTemp.jobTime = self.getTimeDiff(jobTemp.startTime, jobTemp.endTime);
                    jobTemp.boxId = v.CTN_NO;
                    job.push(jobTemp);
                })
            }
            self.wraper = $('#J_deviceDetail');
            self.wraper.html('');
            var device = { 'base': data.base, 'job': job, 'breakDown': data.breakDown, 'analysis': data.analysis };
            var htmlValue = templateDeviceDetail.render(device);
            self.wraper.html(htmlValue);
            self.wraper.show().find('.panel-loading').hide();
            $('#J_deviceDetail .device-bottom').css('padding-top', $('#J_deviceDetail .deviceInfo-table ').height() + 100);
            self.bindEvent();
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

        /*
         *
         */
        /*renderMapLegend: function(args){
            if( !args ){
                args = this.data;
            }else{
                this.data = args;
            }
            this.wraper = $('#J_mapLegend');
            var dataLength = this.data.length;
            var classTemp = 'map-legend';
            if(dataLength%3 == 0 || dataLength > 6){
              classTemp += ' col-there';
            }else{
              classTemp += ' col-two';
            }
            this.wraper.attr('class',classTemp);
            var htmlValue = templateMapLeged.render( this.data ); 
            this.wraper.html( htmlValue );
            // this.wraper.find('.popup').show().css( {left: posLeft, top: posTop}); 
            self.bindEvent();
        },  */

        /*
         *
         */
        hide: function () {
            // 移除工具条中添加的类 active
            if ($('.tool-container a').hasClass('active')) $('.tool-container a').removeClass('active');
            this.wraper.html('').hide();
        },
        bindEvent: function () {
            var self = this;
            this.wraper.off();

            // 切换历史告警列表
            $('#J_warnList:not(".historyWarn")')
                .on('click', 'p.transTime', function () {
                    $('#J_warnList').addClass('historyWarn').find('.pop-body').html('<div class="mgt120"><div class="loading"></div></div>').show();
                    var url = '/portvision/object/alarm',
                        method = 'GET',
                        params = {
                            order: 'OCCURRENCE_TIME',
                            key: 'READ_FLAG',
                            operator: 'EQUALS',
                            value: 'Y',
                        },
                        fnSuccess = self.renderHistoryWarnsByData;
                    self.postData(url, method, params, fnSuccess);
                })
            // 设备信息详情按钮
            $('#J_deviceProfile')
                .on('click', '.j-more', function (ev) {
                    self.hide();
                    var it = $(ev.target);
                    var rowNumber = it.attr('data-id');
                    self.observer.showPop('deviceDetail', self.device);

                    // delete this;
                })
                .on('click', '.j-trail', function () {
                    var dataTp;
                    var deviceType = self.device && self.device._type;
                    switch (self.device.deviceType) {
                        case 'container': dataTp = 'containers'; break;
                        case 'bridgeCrane': dataTp = 'bridgecranes'; break;
                        case 'gantryCrane': dataTp = 'gantrycranes'; break;
                        case 'emptyContainerHandlers': dataTp = 'stackers'; break;
                        case 'reachStacker': dataTp = 'reachstackers'; break;
                    }
                    $.each(self.observer._overMap[dataTp], function (k, v) {
                        if (v._equipmentCode === self.device._equipmentCode) {
                            //self._observer.showProfilePop(v);
                            //self._observer._baseMap.setMapCenter( {x: v.initX, y:v.initY} );
                            // todo:获取选中设备的轨迹图
                            self.observer.showProfilePop(v);
                            // self.observer._baseMap.setMapCenter( {x: v.initX, y:v.initY} );
                            self.observer.renderTrail(v);
                        }
                    })
                })
                .on('click', '.j-boatView', function () {
                    //console.log('船舶箱子详情');
                    self.observer.showPop('boatDetail', self.device);
                });

            // 告警弹框相关时间
            $('#J_deviceDetail')
                .on('click', '.j-close', function () {//关闭
                    self.hide();
                    delete this;
                })
                .on('click', '#myTab li', function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $('.device-bottom .tab-pane').eq($(this).index()).addClass('active').siblings().removeClass('active');
                })
                .on('click', '.click-box-detail', function (ev) {
                    var it = $(ev.target);
                    var boxId = it.attr('data-id');
                    self.observer.showPop('boxDetail', { 'boxId': boxId });
                    // self.hide();  
                    // delete this;
                });

            $('#J_newWarn')
                .on('click', '.showOnMap', function (ev) {//告警跳转到地图并高亮                
                    self.hide();
                    var it = $(ev.target);
                    var warnId = it.attr('data-id'),
                        type = it.attr('data-eType'),
                        id = it.attr('data-eId'),
                        equipmentCode = it.attr('data-ecode'),
                        name = it.attr('data-eName');
                    self.readWarn(warnId);//读取告警信息
                    self.observer._overMap && self.observer._overMap.setSelectedEquipmentFromAlarm && self.observer._overMap.setSelectedEquipmentFromAlarm({ 'equipmentCode': equipmentCode, 'type': type });

                })
                .on('click', '.j-close', function () { // 关闭
                    self.hide();
                    // delete this;                              
                });

            $('#J_warnList:not(".historyWarn")')
                .on('click', '.warn-list-table tr', function (ev) {
                    self.hide();
                    var it = $(ev.currentTarget);
                    var warnId = it.attr('data-id'),
                        type = it.attr('data-eType'),
                        id = it.attr('data-eId'),
                        equipmentCode = it.attr('data-ecode'),
                        name = it.attr('data-eName');
                    self.readWarn(warnId);//读取告警信息
                    self.observer._overMap && self.observer._overMap.setSelectedEquipmentFromAlarm && self.observer._overMap.setSelectedEquipmentFromAlarm({ 'equipmentCode': equipmentCode, 'type': type });
                })

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
            // this.wraper
        },

        /*
         *
         */
        readWarn: function (id) {
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

        /*
         *
         */
        refreshWarnNum: function (id) {
            var self = this;
            if (!!id) {
                $.ajax({
                    method: 'post',
                    url: '/portvision/object/alarm?order=OCCURRENCE_TIME&key=READ_FLAG&operator=EQUALS&value=N',
                    success: function (data) {
                        self.renderWarnNum(newWarns.result);
                    },
                    fail: function (error) {
                        console.log(error);
                    }
                });
            }
        },

        /*
         *
         */
        render: function () {
            //            console.log( this.templatesType );
            //            var htmlValue = '';
            //            if (this.templatesType == 'default'){//缺省
            //                htmlValue = templateDefault.render( this.data ); 
            //            }else if (this.templatesType == 'newWarn') {//新的警告
            //                htmlValue = templateNewWarn.render( this.data ); 
            //            }else if (this.templatesType == 'mapLegend') {//地图图例
            //                this.renderMapLegend(); 
            //
            //            }else if (this.templatesType == 'historyWarn') {//警告历史
            //
            //                htmlValue = templateWarnList.render( this.data ); 
            //
            //            }else if (this.templatesType == 'warnNum') {//历史警告信息计数
            //
            //               
            //
            //            }else if(this.templatesType == 'deviceProfile'){//设备概况 
            //                console.log( this.pos );
            //                var posLeft = this.initLeft =  this.pos.x /** this.showScale*/ - 150;
            //                var posTop = this.initTop = this.pos.y /** this.showScale*/ - 120;
            //                htmlValue = templateDeviceProfile.render( this.data ); 
            //                this.wraper.html( htmlValue );
            //                this.wraper.show();  
            //                this.posLeft = posLeft;
            //                this.posTop = posTop;
            //                this.wraper.find('.popup').show().css( {left: posLeft, top: posTop}); 
            //                return this;
            //            }else if(this.templatesType == 'deviceJobs'){//设备详情-作业信息 
            //
            //                htmlValue = templateDeviceJobs.render( this.data ); 
            //
            //            }else if(this.templatesType == 'deviceBaseDetail'){//设备基本详情
            //
            //                htmlValue = templateDeviceBaseInfo.render( this.data );
            //
            //            }else if(this.templatesType == 'deviceDetail'){//设备详情
            //                this.wraper.html( '' );
            //                this.wraper.html( templateDeviceDetail );
            //                this.wraper.find(".deviceDetail-popup").show().show();   
            //                var deviceBaseDetail = this.getDeviceBaseDetail();//base基础信息
            //                this.wraper.find('#J_deviceBaseDetail').html( deviceBaseDetail );
            //                var deviceJobs = this.getDeviceJobs();//jobs工作状态
            //                this.wraper.find('#J_jobInfo').html( deviceJobs );
            //                this.wraper.show();  
            //                return this;
            //            }
            //            this.wraper.html( htmlValue );
            //            this.wraper.show();  
            //            this.wraper.find('.popup').show();   
            //            return this;
        },

        /*
         *
         */
        getDeviceBaseDetail: function (datas) {
            // console.log( this.data.baseInfo ); 
            var tempBaseInfo = jsrender.templates(templateDeviceBaseInfo).render(datas);
            return tempBaseInfo;
        },

        /*
         *
         */
        getDeviceJobs: function () {
            var tempJobs = jsrender.templates(templateDeviceJobs).render(this.data.deviceJobs);
            return tempJobs;
        },

        /*
         *
         */
        setPopPosition: function () {
            var showScale = this.showScale || 1;
            this.posLeft = this.posLeft || this.initLeft;
            this.posTop = this.posTop || this.initTop;
            var posLeft = parseInt(this.posLeft * showScale - 150);
            var posTop = parseInt(this.posTop * showScale - 120);
            if (this.deviceType && this.deviceType === 'bridgecrane') {
                posTop -= 80 * this.showScale;
            } else {
                posTop -= 10 * this.showScale;
            }
            posLeft = posLeft < 0 ? 0 : posLeft;
            posTop = posTop < 0 ? 0 : posTop;
            this.wraper.find('.popup').show().css({ left: posLeft, top: posTop });
        },

        /*
         *
         */
        gd_setPopPosition: function () {
            var showScale = this.showScale || 1;
            this.posLeft = this.posLeft || this.initLeft;
            this.posTop = this.posTop || this.initTop;
            var posLeft = (this.deviceType === 'ship') ? parseInt(this.posLeft - 20) : parseInt(this.posLeft - 150);
            var posTop = parseInt(this.posTop - 120);
            if (this.deviceType && this.deviceType === 'bridgecrane') {
                posTop -= 80 * this.showScale;
            } else {
                posTop -= 10 * this.showScale;
            }
            this.wraper.find('.popup').show().css({ left: posLeft, top: posTop });
        },
        /*
         *
         */
        /*getEqpPostionByTypeId: function(){
            return this.observer.getEqpPostionByTypeId( this.eqpType, this.mapId );
        },*/

        /*
         *
         */
        setInfoPopPosition: function (arg) {
            if (arg) {
                this.posLeft = arg.x;
                this.posTop = arg.y;
                this.showScale = arg.scale || arg.showScale || arg.observer.showScale;
                this.setPopPosition();
                return false;
            };
            if (!this.device) {
                return false;
            };
            //this.mapId = this.device._mapId;
            //this.eqpType = this.device.deviceType;
            //console.log("设备概况开始拖动"+this.deviceObj.eqpType+this.deviceObj.mapId);
            //var pos = this.getEqpPostionByTypeId();
            this.posLeft = this.device.drawX;
            this.posTop = this.device.drawY;
            this.setPopPosition();
        },

        /*
         *
         */
        setInfoPopPositionByDevice: function (device) {
            if (!device) {
                return false;
            };
            //console.log( device );
            this.device = device;
            this.mapId = this.device._equipmentCode;
            this.eqpType = this.device.deviceType;
            this.showScale = this.device.scaleRatio || this.device.showScale;
            this.posLeft = device.drawX;
            this.posTop = device.drawY;
            this.setPopPosition();
        },

        /*
         *
         */
        gd_setInfoPopPositionByDevice: function (device) {
            if (!device) {
                return false;
            };
            //console.log( device );
            this.device = device;
            this.mapId = this.device._equipmentCode;
            this.eqpType = this.device.deviceType;
            this.showScale = this.device.scaleRatio || this.device.showScale;
            this.posLeft = device.drawX;
            this.posTop = device.drawY;
            this.gd_setPopPosition();
        },

        /*
         * 设置移动到指定位置
         */
        moveToPosition: function (arg, flag) {
            if (flag && arg) {
                this.posLeft = arg.x;
                this.posTop = arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
                return false;
            }
            //console.log( arg );
            if (this.device) {
                //this.mapId = this.device._mapId;
                //this.eqpType = this.device.deviceType;
                //var pos = this.getEqpPostionByTypeId();
                this.posLeft = this.device.drawX;
                this.posTop = this.device.drawY;
                this.setPopPosition();
                return false;
            }
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();

            }
        },

        /*
         * 设置地图中心点
         */
        setMapCenter: function (arg) {
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
            }
        },

        /*
         * 移动到地图中心点
         */
        moveToMapCenter: function (arg) {
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
            }
        },

        /*
         * 响应地图级别放大缩小
         */
        mapZoomChange: function (args) {
            this.showScale = args;
            if (!this.device) {
                return false;
            } else {
                //this.mapId = this.device._mapId;
                //this.eqpType = this.device.deviceType;
                //var pos = this.getEqpPostionByTypeId();
                this.posLeft = this.device.drawX;
                this.posTop = this.device.drawY;
                this.setPopPosition();
            }
        },
        postData: function (url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var self = this;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    fnSuccess && fnSuccess.call(self, data);
                },
                error: function (data, status) {
                    fnError && fnError(status);
                }
            });
            return defer.promise;
        }
    });

    return INFOPOP;
});
