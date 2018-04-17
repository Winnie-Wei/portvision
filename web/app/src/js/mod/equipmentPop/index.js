/**
 * @module port/mod/BIPOP 设备统计弹框
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库

    var equipmentSwitchTemp = '<div class="bar-biAnaly radius5 img-biAnaly">设备统计</div>';

    var pagenationTemplate = 
        '<nav aria-label="Page navigation">' +
            '<ul class="pagination">'+
                '<li class="previous">' +
                    '<a href="javascript:void(0);" aria-label="Previous">' +
                        '<span aria-hidden="true">&laquo;</span>' +
                    '</a>' +
                '</li>' +
                '<li><a href="javascript:void(0);">1</a></li>' +
                //' <li><a href="javascript:void(0);">2</a></li>' +
                '<li><a href="javascript:void(0);">...</a></li>' +
                '<li><a href="javascript:void(0);">"curPage-1"</a></li>' +
                '<li class="curPage"><a href="javascript:void(0);">"curPage"</a></li>' +
                '<li><a href="javascript:void(0);">"curPage+1"</a></li>' +
                '<li><a href="javascript:void(0);">...</a></li>' +
                //'<li><a href="javascript:void(0);">"totalPage-1"</a></li>' +
                '<li><a href="javascript:void(0);">"totalPage"</a></li>' +
                '<li class="next">' +
                    '<a href="javascript:void(0);" aria-label="Next">' +
                        '<span aria-hidden="true">&raquo;</span>' +
                    '</a>' +
                '</li>' +
            '</ul>' +
        '</nav>';

    var diviceTitleTemplate =
        '<h4 class="panel-title">' +
            '{{if diviceType == "RTG"}}' +
            '<span><title>RTG</title> 已登录：<font>{{:count}}</font> 用电：<font>{{:useElec}}</font> 用油：<font>{{:useOil}}</font></span>' +
            '{{else diviceType == "TRUCK"}}' +
            '<span><title>TRUCK</title> 已登录：<font>{{:count}}</font></span>' +
            '{{else diviceType == "ES"}}' +
            '<span><title>ES</title> 已登录：<font>{{:count}}</font></span>' +
            '{{else diviceType == "QC"}}' +
            '<span><title>QC</title> 已登录：<font>{{:count}}</font></span>' +
            '{{else diviceType == "RS"}}' +
            '<span><title>RS</title> 已登录：<font>{{:count}}</font></span>' +
            '{{else diviceType == "VS"}}' +
            '<span><title>VESSLE</title> 到港：<font>{{:count}}</font></span>' +
            '{{/if}}' +
        '</h4>';

    var BIPopInfoTemplate = 
        '<div class="panel-group mc-panel-group" id="accordion" role="tablist" aria-multiselectable="true">' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingOne">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></a>' + 
                '</div>' + 
                '<div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">' + 
                    '<div class="panel-body">' + 
                    '</div>' + 
                '</div>' + 
            '</div>' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingTwo">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo"></a>' + 
                '</div>' + 
                '<div id="collapseTwo" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingTwo">' + 
                    '<div class="panel-body">' + 
                    '</div>' + 
                '</div>' + 
            '</div>' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingThree">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree"></a>'+ 
                '</div>' + 
                '<div id="collapseThree" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree">' + 
                '    <div class="panel-body">' + 
                '    </div>' + 
                '</div>' + 
            '</div>' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingFour">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour"></a>' + 
                '</div>' + 
                '<div id="collapseFour" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour">' + 
                    '<div class="panel-body">' + 
                    '</div>' + 
                    // pagenationTemplate +
                '</div>' + 
            '</div>' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingFive">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive"></a>' + 
                '</div>' + 
                '<div id="collapseFive" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFive">' + 
                    '<div class="panel-body">' + 
                    '</div>' + 
                '</div>' + 
            '</div>' + 
            '<div class="panel panel-default">' + 
                '<div class="panel-heading mc-panel-heading j-mc-heading" role="tab" id="headingSix">' + 
                    '<h4 class="panel-title">' + 
                    '</h4>' + 
                    '<a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix"></a>' + 
                '</div>' + 
                '<div id="collapseSix" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSix">' + 
                    '<div class="panel-body">' + 
                    '</div>' + 
                '</div>' + 
            '</div>' + 
        '</div>';

    // 龙门吊模板内容
    var RTGTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="59">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="130">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="gantrycrane">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box">' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-3">司机</th>' + 
                    '<th class="mc-table-column-4">作业指令</th>' + 
                    '<th class="gutter" style="width: 15px;"></th>' + 
                '</tr>' + 
            '</thead>' +
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="70">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="130">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for RTG}}' + 
                    '<tr class="{{:OBJ_EQUIPMENT_CODE}}" data-id="{{:OBJ_EQUIPMENT_CODE}}" deviceType="{{:type}}" data-type="gantrycrane">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' + 
                                '<label><input type="checkbox"  {{if isShow}} checked="1" {{/if}}>{{:OBJ_EQUIPMENT_CODE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:jobStatusMap[STA_WORK_STATUS]}}</td>' + 
                        '<td class="mc-table-column-3">{{:driver}}</td>' + 
                        '<td class="mc-table-column-4">{{:directive}}</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
            '</div>';

    // 集卡模板内容
    var TRUCKTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="59">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="70">' + 
                '<col name="mc-table-column-5" width="60">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="container">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box" >' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-3">司机</th>' + 
                    '<th class="mc-table-column-4">车牌号</th>' + 
                    '<th class="mc-table-column-5">监管</th>' + 
                    '<th class="mc-gutter"></th>' + 
                '</tr>' + 
            '</thead>' + 
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="70">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="70">' + 
                    '<col name="mc-table-column-5" width="60">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for TRUCK}}' + 
                    '<tr class="{{:OBJ_TRUCK_CODE}}" data-id="{{:OBJ_TRUCK_CODE}}" data-type="container">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' +
                                '<label><input type="checkbox" {{if isShow}} checked="1" {{/if}}>{{:OBJ_TRUCK_CODE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:jobStatusMap[STA_WORK_STATUS]}}</td>' +  
                        '<td class="mc-table-column-3">{{:driver}}</td>' + 
                        '<td class="mc-table-column-4">{{:OBJ_TRUCK_LICENSE}}</td>' + 
                        '<td class="mc-table-column-5">{{:isRagulatory}}</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
        '</div>';
        // '<li class="prev"><a role="button" aria-label="Previous"><span aria-hidden="true">«</span></a></li><li class="item" ng-show="pager.curPage>2"><a role="button">1</a></li><li class="item" ng-show="pager.curPage>3"><a role="button">2</a></li><li ng-show="pager.curPage>4"><span>...</span></li><li class="item" ng-show="pager.curPage>1"><a role="button">{{pager.curPage-1}}</a></li><li class="active"><a role="button">{{pager.curPage}}</a></li><li class="item" ng-show="pager.totalPage>pager.curPage"><a role="button">{{pager.curPage+1}}</a></li><li ng-show="pager.totalPage-pager.curPage>3"><span>...</span></li><li class="item" ng-show="pager.totalPage-pager.curPage>2"><span>{{pager.totalPage-1}}</span></li><li class="item" ng-show="pager.totalPage-pager.curPage>1"><a role="button">{{pager.totalPage}}</a></li><li class="next"><a role="button" aria-label="Next"><span aria-hidden="true">»</span></a></li>'
    // 堆高机吊模板内容
    var ESTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="59">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="130">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="stacker">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box">' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-3">司机</th>' + 
                    '<th class="mc-table-column-4">作业指令</th>' + 
                    '<th class="gutter" style="width: 15px;"></th>' + 
                '</tr>' + 
            '</thead>' +
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="70">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="130">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for ES}}' + 
                    '<tr class="{{:OBJ_EQUIPMENT_CODE}}" data-id="{{:OBJ_EQUIPMENT_CODE}}" deviceType="{{:type}}" data-type="stacker">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' + 
                                '<label><input type="checkbox"  {{if isShow}} checked="1" {{/if}}>{{:OBJ_EQUIPMENT_CODE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:jobStatusMap[STA_WORK_STATUS]}}</td>' + 
                        '<td class="mc-table-column-3">{{:driver}}</td>' + 
                        '<td class="mc-table-column-4">{{:directive}}</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
            '</div>';
    // 桥吊模板内容
    var QCTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="59">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="130">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="bridgecrane">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box">' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-3">司机</th>' + 
                    '<th class="mc-table-column-4">作业指令</th>' + 
                    '<th class="gutter" style="width: 15px;"></th>' + 
                '</tr>' + 
            '</thead>' +
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="70">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="130">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for QC}}' + 
                    '<tr class="{{:OBJ_EQUIPMENT_CODE}}" data-id="{{:OBJ_EQUIPMENT_CODE}}" deviceType="{{:type}}" data-type="bridgecrane">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' + 
                                '<label><input type="checkbox"  {{if isShow}} checked="1" {{/if}}>{{:OBJ_EQUIPMENT_CODE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:jobStatusMap[STA_WORK_STATUS]}}</td>' + 
                        '<td class="mc-table-column-3">{{:driver}}</td>' + 
                        '<td class="mc-table-column-4">{{:directive}}</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
            '</div>';
    // 正面吊模板内容
    var RSTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="59">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="130">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="reachstacker">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box">' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-3">司机</th>' + 
                    '<th class="mc-table-column-4">作业指令</th>' + 
                    '<th class="gutter" style="width: 15px;"></th>' + 
                '</tr>' + 
            '</thead>' +
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="70">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="130">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for RS}}' + 
                    '<tr class="{{:OBJ_EQUIPMENT_CODE}}" data-id="{{:OBJ_EQUIPMENT_CODE}}" deviceType="{{:type}}" data-type="reachstacker">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' + 
                                '<label><input type="checkbox" {{if isShow}} checked="1" {{/if}}>{{:OBJ_EQUIPMENT_CODE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:jobStatusMap[STA_WORK_STATUS]}}</td>' + 
                        '<td class="mc-table-column-3">{{:driver}}</td>' + 
                        '<td class="mc-table-column-4">{{:directive}}</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
            '</div>';

    // 船舶模板内容
    var VSTemplate = 
        '<table class="table-biAnaly">' + 
            '<colgroup>' + 
                '<col name="mc-table-column-1" width="75">' + 
                '<col name="mc-table-column-2" width="70">' + 
                '<col name="mc-table-column-3" width="50">' + 
                '<col name="mc-table-column-4" width="50">' + 
                '<col name="mc-table-column-5" width="130">' + 
                '<col name="mc-gutter" width="15">' + 
            '</colgroup>' + 
            '<thead>' + 
                '<tr deviceType="ship">' + 
                    '<th class="mc-table-column-1">' +
                        '<div class="check-all-box">' + 
                            '<label><input type="checkbox"  {{if isAllCheck}} checked="1" {{/if}}>编号</label>' + 
                        '</div>' + 
                    '</th>' + 
                    '<th class="mc-table-column-2">中文名</th>' + 
                    '<th class="mc-table-column-3">航次</th>' + 
                    '<th class="mc-table-column-4"><span class="j-sort-status">状态<span class="caret {{if sortType == "asc"}}up-caret{{/if}}"></span></span></th>' + 
                    '<th class="mc-table-column-5">状态时间</th>' + 
                    '<th class="gutter" style="width: 15px;"></th>' + 
                '</tr>' + 
            '</thead>' +
        '</table>' + 
        '<div class="device-tbody">' + 
            '<table class="table-biAnaly">' + 
                '<colgroup>' + 
                    '<col name="mc-table-column-1" width="59">' + 
                    '<col name="mc-table-column-2" width="80">' + 
                    '<col name="mc-table-column-3" width="50">' + 
                    '<col name="mc-table-column-4" width="50">' + 
                    '<col name="mc-table-column-5" width="130">' + 
                    '<col name="mc-gutter" width="15">' + 
                '</colgroup>' + 
                '<tbody class="j-deviceSel">' + 
                    '{{for VS}}' + 
                    '<tr class="{{:OBJ_EQUIPMENT_CODE}}" ship-status="{{:STA_CURRENT_STATUS}}" data-id="{{:STA_VESSEL_REFERENCE}}" deviceType="{{:_type}}" data-type="ship">' + 
                        '<td class="mc-table-column-1">' + 
                            '<div class="checkbox">' + 
                                '<label><input type="checkbox" {{if isShow}} checked="1" {{/if}}>{{:STA_VESSEL_REFERENCE}}</label>' + 
                            '</div>' + 
                        '</td>' + 
                        '<td class="mc-table-column-2 status-{{:jobStatusStyleMap[STA_WORK_STATUS]}}">{{:OBJ_VESSEL_NAMEC}}</td>' + 
                        '<td class="mc-table-column-3">{{:STA_OUTBOUND_VOYAGE}}</td>' +
                        '<td class="mc-table-column-4">' +
                            '{{if STA_CURRENT_STATUS == "V_ATA"}}抵锚' + 
                            '{{else STA_CURRENT_STATUS == "V_BERTH"}}靠泊' +
                            '{{else STA_CURRENT_STATUS == "V_WALT_WORK"}}等开工' +
                            '{{else STA_CURRENT_STATUS == "V_WORK"}}作业中' +
                            '{{else STA_CURRENT_STATUS == "V_STOP"}}停工' +
                            '{{else STA_CURRENT_STATUS == "V_WAIT_ATD"}}等离泊' +
                            '{{else STA_CURRENT_STATUS == "V_ATD"}}离泊' +
                            '{{/if}}' +
                        '</td>' + 
                        // 计划进港 >> 到港 >> 靠泊 >> 离港
                        '<td class="mc-table-column-5">' +
                            '{{if STA_ETA_DAILY && !STA_ATA && !STA_ATANCHOR && !STA_ATD}}{{:STA_ETA_DAILY}}' +
                            '{{else STA_ETA_DAILY && STA_ATA && !STA_ATANCHOR && !STA_ATD}}{{:STA_ATA}}' + 
                            '{{else STA_ETA_DAILY && STA_ATA && STA_ATANCHOR && !STA_ATD}}{{:STA_ATANCHOR}}' + 
                            '{{else STA_ETA_DAILY && STA_ATA && STA_ATANCHOR && STA_ATD}}{{:STA_ATD}}' + 
                            '{{/if}}' + 
                        '</td>' + 
                    '</tr>' + 
                    '{{/for}}' +
                '</tbody>' + 
            '</table>' + 
            '</div>';
    var shipStatusTipTemp = 
        '<div class="j-workingTip">' +
            '<div>' +
                '<h3 class="pull-left">提示</h3>' +
                '<span class="j-close pull-right">X</span>' +
                '<p>{{:shipStatus}}</p>' +
            '</div>' +
        '</div>';

    var BIPOP = function (cfg) {
        if (!(this instanceof BIPOP)) {
            return new BIPOP().init(cfg);
        }
    };

    BIPOP.prototype = $.extend(new McBase(), {

        /*
         *  初始化
         */
        init: function (cfg) {
            this.data = cfg.data || {};
            //this._zr = cfg.zr;
            this.elementId = cfg.elementId || 0;
            this.observer = cfg.observer || null;
            this.wraper = $(this.elementId);
            this.containersChecked = {}; // 集卡是否选中
            this.gantrycranesChecked = {}; // 龙门吊是否选中
            this.bridgecranesChecked = {}; // 桥吊是否选中
            this.stackersChecked = {}; // 堆高机是否选中
            this.bridgecranesChecked = {}; // 桥吊是否选中
            this.reachstackersChecked = {}; // 正面吊是否选中 
            this.shipsChecked = {}; // 船舶是否选中 
            this.gantrycranes = []; // 龙门吊数据备份用作状态排序
            this.containers = [];   // 集卡数据备份用作状态排序
            this.reachstackers = [];    // 堆高机数据备份用作状态排序
            this.bridgecranes = []; // 桥吊数据备份用作状态排序
            this.stackers = []; // 正面吊数据备份用作状态排序
            this.ships = [];    // 船舶数据备份用作状态排序
            this.isInit = true; // 初始化数据
            this.clickTimer = null;
            this.dataHead = {}; // 标题数据
            this.currDate = '';
            this.baseSortWeight = {
                // number: 1,
                status: 10
            };
            this.statusWeight = {
                device: { // 排序：故障>工作中>有指令空闲>无指令空闲>维护
                    'FAULT': 9,
                    'WORK': 8,
                    'YESINS': 7,
                    'NOINS': 6,
                    'REPAIR': 5
                },
                ship: { // 排序：停工>作业中>等开工>靠泊>抵锚>等离泊>离泊
                    'V_STOP': 9,
                    'V_WORK': 8,
                    'V_WALT_WORK': 7,
                    'V_BERTH': 6,
                    'V_ATA': 5,
                    'V_WAIT_ATD': 4,
                    'V_ATD': 3
                }
            };
            this.ascOrDes = {
                gantrycrane: 'asc',
                container: 'asc',
                reachstacker: 'asc',
                bridgecrane: 'asc',
                stacker: 'asc',
                ship: 'asc'
            };
            this.bindEvent();
            return this;
        },
        /*
         *  显示设备统计信息框
         */
        show: function () {
            $('.bar-biAnaly').addClass('active');
            $('.mc-panel-group').addClass('active-panel');
        },
        /*
         *  隐藏设备统计信息框
         */
        hide: function () {
            // $('#J_device_statistical').html('').hide();
            $('.bar-biAnaly').removeClass('active');
            $('.mc-panel-group').removeClass('active-panel');
        },
        /*
         *  绑定事件
         */
        bindEvent: function () {
            var that = this;
            // 设备统计按钮
            // $(document)
            // .on('click', '.j-biAnaly', function( ev ) {  
            //  var panelGroup = $('.mc-panel-group');                      
            //  if( panelGroup.hasClass('active-panel') ){
            //      that.isInit = false;
            //  }
            // });
            $('.j-mc-heading').on('click', '.panel-title', function (ev) {
                console.log(ev);
            })

            $('#J_device_statistical').off()
                .on('click', 'tbody>tr', function (ev) {
                    var it = $(ev.currentTarget);
                    var checkbox = it.find('input');
                    var isChecked = checkbox.is(':checked');
                    var type = it.attr('data-type');
                    var id = it.attr('data-id');
                    if (that.clickTimer) {
                        return false;
                    }
                    that.clickTimer = window.setTimeout(function () {
                        window.clearTimeout(that.clickTimer);
                        that.clickTimer = null;
                        checkbox.trigger('click');
                    }, 300);
                })
                .on('click', '.checkbox', function (ev) {
                    var it = $(ev.currentTarget);
                    var checkbox = $(ev.currentTarget).find('input');
                    var parentTr = it.parent().parent();
                    var isChecked = checkbox.is(':checked');
                    var type = parentTr.attr('data-type');
                    var id = parentTr.attr('data-id');
                    that.clickCheckbox(isChecked, type, id);
                    // 更新全选按钮状态
                    var checkedList = {};
                    switch (type) {
                        case 'container':
                            checkedList = that.containersChecked;
                            break;
                        case 'gantrycrane':
                            checkedList = that.gantrycranesChecked;
                            break;
                        case 'bridgecrane':
                            checkedList = that.bridgecranesChecked;
                            break;
                        case 'stacker':
                            checkedList = that.stackersChecked;
                            break;
                        case 'reachstacker':
                            checkedList = that.reachstackersChecked;
                            break;
                        case 'ship':
                            checkedList = that.shipsChecked;
                            break;
                    }
                    var isAllCheck = true;
                    $.each(checkedList, function (k, v) {
                        if (v === false) {
                            isAllCheck = false;
                        }
                    })
                    if (isAllCheck) {
                        $(this).parents('.panel').find('thead th:first-child input').prop('checked', true);
                    } else {
                        $(this).parents('.panel').find('thead th:first-child input').prop('checked', false);
                    }
                    ev.stopPropagation();
                })
                .on('dblclick', 'td', function (ev) {
                    if (that.clickTimer) {
                        window.clearTimeout(that.clickTimer);
                        that.clickTimer = null;
                    }
                    var it = $(ev.currentTarget);
                    var parentTr = it.parent();
                    var checkbox = parentTr.find('input');
                    var isChecked = checkbox.is(':checked');
                    var type = parentTr.attr('data-type');
                    var equipmentCode = parentTr.attr('data-id');
                    var isChecked = checkbox.is(':checked');
                    var shipStatus = '';
                    type === 'ship' && (shipStatus = parentTr.attr('ship-status'));
                    //console.log( isChecked, type, id );
                    ev.stopPropagation();
                    if (!isChecked) {
                        return false;
                    }
                    if (type === 'ship' && shipStatus === 'V_ATA' || shipStatus === 'V_ATD') {
                        var data = {};
                        switch (shipStatus) {
                            case 'V_ATA':
                                data['shipStatus'] = '船舶即将抵锚';
                                break;
                            case 'V_ATD':
                                data['shipStatus'] = '船舶已经离泊';
                                break;
                            // case 'V_ATA': 
                        }
                        var wraper = jsrender.templates(shipStatusTipTemp).render(data);
                        $('#J_shipStatusPop').html(wraper);
                        $()
                    } else {
                        that.observer.setSelectedEquipment(type, equipmentCode);
                    }
                })
                .off('click', '.check-all-box')
                .on('click', '.check-all-box', function (ev) {
                    ev.stopPropagation();
                    if (ev.target.tagName === 'INPUT') {
                        var type = $(this).parent().parent().attr('deviceType');
                        var checkStatus = $(this).find('input').is(':checked');
                        $(this).parents('.panel').find('.table-biAnaly tr').each(function (index, element) {
                            if (checkStatus === true) {
                                $(element).find('td:first-child input').prop('checked', true);
                            } else {
                                $(element).find('td:first-child input').prop('checked', false);
                            }
                        });
                        that.updateAllCheckStatus(type, checkStatus);
                    }
                })
                .on('click', '.j-sort-status', function (ev) { // 根据状态排序
                    var type = $(this).parent().parent().attr('deviceType');
                    var sortType = that.ascOrDes[type] = that.ascOrDes[type] === 'asc' ? 'des' : 'asc';
                    switch (type) {
                        case 'gantrycrane':
                            that.renderGantrycranes(that.ascSortData(that.gantrycranes, 'sortWeight', sortType));
                            break;
                        case 'container':
                            that.renderContainers(that.ascSortData(that.containers, 'sortWeight', sortType));
                            break;
                        case 'reachstacker':
                            that.renderReachstacker(that.ascSortData(that.reachstackers, 'sortWeight', sortType));
                            break;
                        case 'bridgecrane':
                            that.renderBridgecranes(that.ascSortData(that.bridgecranes, 'sortWeight', sortType));
                            break;
                        case 'stacker':
                            that.renderStackers(that.ascSortData(that.stackers, 'sortWeight', sortType));
                            break;
                        case 'ship':
                            that.renderShips(that.ascSortData(that.ships, 'sortWeight', sortType));
                            break;
                        default:
                            break;
                    }
                    console.log(that.gantrycranes);
                    console.log(ev);
                });

            $('#J_shipStatusPop')
                .on('click', '.j-close', function (ev) {
                    $('.j-workingTip').addClass('hide');
                })

            // 分页
            $('#J_device_statistical').on('click', function (ev) {
                var target = $(ev.target);
                var obj = $(this).find('nav');
                if (target.parents('ul.pagination').length) {
                    if (target.text() !== '...' && !target.parents('.previous').length && !target.parents('.next').length) {
                        that.page.curPage = parseInt(ev.target.innerText);
                        that.pagenation_com(obj, that.page.curPage, that.page.totalPage);
                    } else if (target.parents('.previous').length) {
                        if (that.page.curPage > 1) {
                            that.page.curPage -= 1;
                            that.pagenation_com(obj, that.page.curPage, that.page.totalPage);
                        } else {
                            target.addClass('disabled');
                        }
                    } else if (target.parents('.next').length) {
                        if (that.page.curPage < that.page.totalPage) {
                            that.page.curPage += 1;
                            that.pagenation_com(obj, that.page.curPage, that.page.totalPage);
                        } else {
                            target.addClass('disabled');
                        }
                    }

                }

            })
        },
        // sliceArrayByStatus: function (data) {
        //     // var 
        // },
        /**
         * desc: 更新全选状态
         */
        updateAllCheckStatus: function (type, checkStatus) {
            // 更新checkList状态
            var checkedList = {};
            switch (type) {
                case 'container':
                    checkedList = this.containersChecked;
                    break;
                case 'gantrycrane':
                    checkedList = this.gantrycranesChecked;
                    break;
                case 'bridgecrane':
                    checkedList = this.bridgecranesChecked;
                    break;
                case 'stacker':
                    checkedList = this.stackersChecked;
                    break;
                case 'reachstacker':
                    checkedList = this.reachstackersChecked;
                    break;
                case 'ship':
                    checkedList = this.shipsChecked;
                    break;
            }
            checkedList = this.clickAllCheckbox(checkStatus, type, checkedList);
            this.observer.updateObjectChecked(type, checkedList);
        },
        clickAllCheckbox: function (isChecked, type, list) {
            var that = this;
            // var checkedList = {};
            var targetObject = undefined;
            $.each(list, function (idx, item) {
                targetObject = that.observer.getEqpObjectByTypeId(type, idx);
                targetObject && targetObject.setShowProp && targetObject.setShowProp(isChecked);
                list[idx] = isChecked;
            })
            return list;
        },
        /*
         *  响应点击，设置设备是否可见
         */
        clickCheckbox: function (isChecked, type, id) {
            var that = this;
            var checkedList = {};
            var targetObject = undefined;
            targetObject = that.observer.getEqpObjectByTypeId(type, id);
            targetObject && targetObject.setShowProp && targetObject.setShowProp(isChecked);

            switch (type) {
                case 'container':
                    that.containersChecked[id] = isChecked;
                    checkedList = that.containersChecked;
                    break;
                case 'gantrycrane':
                    that.gantrycranesChecked[id] = isChecked;
                    checkedList = that.gantrycranesChecked;
                    break;
                case 'bridgecrane':
                    that.bridgecranesChecked[id] = isChecked;
                    checkedList = that.bridgecranesChecked;
                    break;
                case 'stacker':
                    that.stackersChecked[id] = isChecked;
                    checkedList = that.stackersChecked;
                    break;
                case 'reachstacker':
                    that.reachstackersChecked[id] = isChecked;
                    checkedList = that.reachstackersChecked;
                    break;
                case 'ship':
                    that.shipsChecked[id] = isChecked;
                    checkedList = that.shipsChecked;
                    break;
            }
            //console.log( checkedList );
            that.observer.updateObjectChecked(type, checkedList);
        },
        /*
         *  更新设备信息，与overMap中数据同步
         */
        updateEquipments: function (type, datas) {
            //console.log( type, datas );
            var that = this;
            $.each(datas, function (k, d) {
                d.jobStatusMap = {
                    'NOINS': '无指令空闲',
                    'YESINS': '有指令空闲',
                    'WORK': '工作中',
                    'FAULT': '故障',
                    'REPAIR': '维修'
                };
                d.jobStatusStyleMap = {
                    'NOINS': 'free',
                    'YESINS': 'hasJob',
                    'WORK': 'active',
                    'FAULT': 'error',
                    'REPAIR': 'repair'
                };
                d._equipmentId = d.OBJ_EQUIPMENT_CODE || d.OBJ_TRUCK_CODE || d.GPS_VESSEL_REFERENCE;
                d.sortWeight = type === 'ship' ? that.countSortWeight(d, 'ship') : that.countSortWeight(d, 'device');
            });
            switch (type) {
                case 'gantrycrane':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.gantrycranesChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.gantrycranesChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.gantrycranesChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.gantrycranes = datas;
                    // this.renderGantrycranes(this.ascSortData(datas, '_equipmentId'));
                    this.renderGantrycranes(this.ascSortData(datas, 'sortWeight', this.ascOrDes.gantrycrane));
                    break;
                case 'container':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.containersChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.containersChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.containersChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.containers = datas;
                    // this.renderContainers(this.ascSortData(datas, '_equipmentId'));
                    this.renderContainers(this.ascSortData(datas, 'sortWeight', this.ascOrDes.container));
                    break;
                case 'reachstacker':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.reachstackersChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.reachstackersChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.reachstackersChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.reachstackers = datas;
                    // this.renderReachstacker(this.ascSortData(datas, '_equipmentId'));
                    this.renderReachstacker(this.ascSortData(datas, 'sortWeight', this.ascOrDes.reachstacker));
                    break;
                case 'bridgecrane':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.bridgecranesChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.bridgecranesChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.bridgecranesChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.bridgecranes = datas;
                    // this.renderBridgecranes(this.ascSortData(datas, '_equipmentId'));
                    this.renderBridgecranes(this.ascSortData(datas, 'sortWeight', this.ascOrDes.bridgecrane));
                    break;
                case 'stacker':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.stackersChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.stackersChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.stackersChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.stackers = datas;
                    // this.renderStackers(this.ascSortData(datas, '_equipmentId'));
                    this.renderStackers(this.ascSortData(datas, 'sortWeight', this.ascOrDes.stacker));
                    break;
                case 'ship':
                    $.each(datas, function (k, d) {
                        if (!that.isInit && !that.shipsChecked[d._equipmentId]) {
                            d.isShow = false;
                            that.shipsChecked[d._equipmentId] = false;
                        } else {
                            //d.isShow = true;
                            that.shipsChecked[d._equipmentId] = d.isShow;
                        }
                    });
                    this.ships = datas;
                    // this.renderShips(this.ascSortData(datas, '_equipmentId'));
                    this.renderShips(this.ascSortData(datas, 'sortWeight', this.ascOrDes.ship));
                    break;
                default:
                    break;
            }
        },
        /**
         * desc: 判断全选按钮状态
         */
        allCheckBtnStatus: function (data) {
            var isAllCheck = true;
            $.each(data, function (k, v) {
                if (v.isShow === false) {
                    isAllCheck = false;
                }
            })
            return isAllCheck;
        },
        /*
         *  渲染龙门吊设备panel
         */
        renderGantrycranes: function (datas) {
            this.data.RTG = datas; // 龙门吊
            this.dataHead.diviceType = 'RTG';
            this.dataHead.count = datas.length;
            this.dataHead.useOil = 0;
            this.dataHead.useElec = datas.length;
            this.data.sortType = this.ascOrDes.gantrycrane;
            this.data.isAllCheck = this.allCheckBtnStatus(datas);
            var RTGWraper = jsrender.templates(RTGTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseOne .panel-body').html(RTGWraper);
            $('#headingOne h4').html(RTGHead);
        },
        /*
         *  渲染集卡设备panel
         */
        renderContainers: function (datas) {
            this.data.TRUCK = datas; // 集卡
            this.dataHead.diviceType = 'TRUCK';
            this.dataHead.count = datas.length;
            this.data.sortType = this.ascOrDes.container;
            this.data.isAllCheck = this.allCheckBtnStatus(datas);
            var TRUCKWraper = jsrender.templates(TRUCKTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseTwo .panel-body').html(TRUCKWraper);
            $('#headingTwo h4').html(RTGHead);
        },
        /*
         *  渲染堆高机设备panel
         */
        renderStackers: function (datas) {
            this.data.ES = datas;
            this.dataHead.diviceType = 'ES';
            this.dataHead.count = datas.length;
            this.data.sortType = this.ascOrDes.stacker;
            this.data.isAllCheck = this.allCheckBtnStatus(datas);
            var ESWraper = jsrender.templates(ESTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseThree .panel-body').html(ESWraper);
            $('#headingThree h4').html(RTGHead);
        },
        pagenation: function (page, obj, data) {
            var that = this;
            var list = obj.find('.pagination li');
            var curPage = page.curPage;
            var temp = $.extend([], data);
            this.page.totalPage = Math.ceil(data.length / page.pageSize);
            this.pagenation_com(obj, curPage, this.page.totalPage);

            /*// 分页
            $('#J_device_statistical .pagination li').not(':first, :last, :nth-child(3), :nth-last-child(3)')
                .on('click', function(ev){
                    var obj = $(this).parents('nav');
                    var curPage = parseInt($(this).text());
                    that.pagenation_com(obj, curPage, that.page.totalPage);
                })*/
        },
        pagenation_com: function (obj, curPage, totalPage) {
            var list = obj.find('.pagination li');
            list.not(':first, :last, .curPage').hide();
            obj.find('.pagination li.curPage')
                .addClass('active').find('a').html(curPage);
            if (totalPage - curPage > 1) {
                list.eq(-2).show()
                    .find('a').html(totalPage);
            }
            if (totalPage - curPage > 2) {
                list.eq(-3).show()

            }
            if (totalPage > curPage) {
                list.eq(-4).show()
                    .find('a').html(curPage + 1);
            }
            if (curPage > 1) {
                list.eq(3).show()
                    .find('a').html(curPage - 1);
            }
            if (curPage > 3) {
                list.eq(2).show();
            }
            if (curPage > 2) {
                list.eq(1).show();
            }
        },
        /*
         *  渲染桥吊设备panel
         */
        renderBridgecranes: function (datas) {
            this.data.QC = datas; // 桥吊
            this.dataHead.diviceType = 'QC';
            this.dataHead.count = datas.length;
            this.page = {
                pageSize: 1,
                curPage: 3,
            }
            // 调用分页
            var data = this.pagenation(this.page, $('#collapseFour'), this.data.QC);
            this.data.sortType = this.ascOrDes.bridgecrane;
            this.data.isAllCheck = this.allCheckBtnStatus(this.data.QC);
            var QCWraper = jsrender.templates(QCTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseFour .panel-body').html(QCWraper);
            $('#headingFour h4').html(RTGHead);
        },
        /*
         *  渲染正面吊设备panel
         */
        renderReachstacker: function (datas) {
            this.data.RS = datas;
            this.dataHead.diviceType = 'RS';
            this.dataHead.count = datas.length;
            this.data.sortType = this.ascOrDes.reachstacker;
            this.data.isAllCheck = this.allCheckBtnStatus(datas);
            var RSWraper = jsrender.templates(RSTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseFive .panel-body').html(RSWraper);
            $('#headingFive h4').html(RTGHead);
        },
        /*
         *  渲染船舶设备panel
         */
        renderShips: function (datas) {
            var currDate = new Date();
            var vesselStatus = '';
            $.each(datas, function (k, v) {
                // if (true) {}
            });
            this.data.VS = datas;
            this.dataHead.diviceType = 'VS';
            this.dataHead.count = datas.length;
            this.data.sortType = this.ascOrDes.ship;
            this.data.isAllCheck = this.allCheckBtnStatus(datas);
            var VSWraper = jsrender.templates(VSTemplate).render(this.data);
            var RTGHead = jsrender.templates(diviceTitleTemplate).render(this.dataHead);
            $('#collapseSix .panel-body').html(VSWraper);
            $('#headingSix h4').html(RTGHead);
        },
        /*
         *  将模板数据插入到页面节点
         */
        render: function () {
            // this.observer.hidePop();
            // 渲染设备统计按钮
            $('#biAnalyBar').html(equipmentSwitchTemp);
            $('#J_device_statistical').html(BIPopInfoTemplate);
        },
        /*
         *
         */
        showWarningItem: function (mapId) {
            var selecter = '.' + mapId;
            $('.mc-panel-group').find(selecter).addClass('device-error');
        },
        /**
         * desc: 计算设备排序权重
         * @return {number} 权重值
         */
        countSortWeight: function (data, type) {
            // 当前只计算状态值权重
            var weight = 0;
            if (type === 'ship') {
                weight = weight + this.baseSortWeight.status * this.statusWeight['ship'][data['STA_CURRENT_STATUS']]
            } else {
                weight = weight + this.baseSortWeight.status * this.statusWeight['device'][data['STA_WORK_STATUS']]
            }
            // for (k in )
            return weight;
        },
        ascSortData: function (data, property, direc) {
            if (!data || !data.length || !(data instanceof Array)) return [];
            return data.sort(this.sortData(data, property, direc));
        },
        // desSortData: function (data, property) {
        //     if (!data || !data.length || !(data instanceof Array)) return [];
        //     return data.sort(this.sortData(data, property, 'des'));
        // },
        ascSortDataByStatus: function (data, property) {
            if (!data || !data.length || !(data instanceof Array)) return [];
            return this.sortByStatus(data, property, 'asc');
        },
        /**
         * desc: 根据状态排序
         * @param  {array} data      dai
         * @param  {[type]} property [description]
         * @param  {[type]} type     [description]
         * @return {[type]}          [description]
         */
        sortByStatus: function (data, property, type) {
            var that = this;
            var data = data.sort(this.sortData(data, property, type));
            var result = [],
                tempArr = [],
                statusTag = 0;
            $.each(data, function (k, v) {
                if (v.statusLevel !== statusTag) {
                    statusTag = v.statusLevel;
                    result = result.concat(tempArr.sort(that.sortData(tempArr, '_equipmentId', 'asc')));
                    tempArr = [];
                }
                tempArr.push(v);
                if (k === data.length - 1) {
                    result = result.concat(tempArr.sort(that.sortData(tempArr, '_equipmentId', 'asc')));
                    tempArr = [];
                }
            })
            return result;
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
        }
    });

    return BIPOP;
});