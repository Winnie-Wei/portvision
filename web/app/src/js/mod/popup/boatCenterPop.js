/**
 * 船舶贝位 集装箱详情弹框
 */
define(function (require) {
    'use strict'
    var jsrender = require('plugin/jsrender/jsrender');
    var BoxDetailPop = require('mod/boxDetailPop/boxDetailPop');

    var centerbayDetailWraperTemplate =
        '<div class="popup popup-left fixed-center md inline bay-pop j-bay-detail">\
            <div class="pop-content ">\
                <div class="pop-header">\
                   <p class="pop-title">{{if yardId}}{{>yardId}}堆场{{/if}}{{>bay}}<span class="j-additional"></span>贝位</p>\
                   <span class="pop-close j-close">关闭</span>\
                </div>\
                <div class="pop-body">\
                </div>\
                <div class="pop-footer">\
                    <select class="pop-select" id="J_change_model" value="{{>viewModel}}">\
                        <option value="standard">标准模式</option>\
                        <option value="ctnno">箱号模式</option>\
                    </select>\
                    <select class="pop-select" id="J_change_time">\
                        <option value="now" >现在</option>\
                        <option value="past" >过去</option>\
                        <option value="future" >将来</option>\
                        <option value="strowage" >配载</option>\
                        <option value="prestrowage" >预配</option>\
                    </select>\
                    <select class="pop-select" id="J_change_pro">\
                        <option value="box">箱主</option>\
                        <option value="size">尺寸</option>\
                        <option value="port">卸货港</option>\
                    </select>\
                    <div class="boatBay-switchs">\
                      <button class="j-dSwitch active">甲板</button>\
                      <button class="j-hSwitch">船舱</button>\
                    </div>\
                </div>\
            </div>\
        </div>';
    var boatBayDetailTemplate =
        '<div class="bay-detail">\
                <table><tbody>\
                    {{for bayBoxs}}\
                    <tr>\
                      	{{if #parent.parent.data.type == "D" }}\
                  		<td class="td-title">{{>#parent.parent.parent.data.dLength * 2 + #parent.parent.parent.data.minDtierId - #parent.getIndex() * 2 - 2 }}层</td>\
                      	{{else }}\
                  		<td class="td-title">{{>#parent.parent.parent.data.dLength * 2 - #parent.getIndex() * 2 + 4}}层</td>\
                      	{{/if}}\
                        {{for #data}}\
                        {{if #data != ""}}\
                        <td class="bay bay-box" data-id="{{>boxId}}" data-info="{{>boxInfo}}" {{if #parent.data.isBack!=true}}style="background: {{>color}}"{{/if}}>\
                            {{if #parent.data.isBack!=true}}\
                                {{if ~root.viewModel === "standard"}}\
                              	<div class="top">\
                                    <span class="text text-left pull-left">{{>STA_DISCHARGE_PORT_CODE}}</span>\
                                    <span class="text pane-span pull-right" {{if planIcon}}style="background-image: url(../../src/js/mod/popup/images/BOX/icon-plan-{{>planIcon}}.png); background-size: 100% 100%;"{{/if}}>{{>planIcon}}</span>\
                                </div>\
                                <div class="middle">\
                                    <span class="text text-left pull-left">{{>CTN_CATEGORY}}</span>\
                                    <span class="text text-right pull-right">{{>STA_INBOUND_CATEGORY}}</span>\
                                </div>\
                                {{else ~root.viewModel === "ctnno"}}\
                                <div class="top">\
                                    <span class="text text-left pull-left">{{>ctnChart}}</span>\
                                    <span class="text pane-span pull-right" {{if planIcon}}style="background-image: url(../../src/js/mod/popup/images/BOX/icon-plan-{{>planIcon}}.png); background-size: 100% 100%;"{{/if}}>{{>planIcon}}</span>\
                                </div>\
                                <div class="middle">\
                                    <span class="text text-left pull-left">{{>ctnNum}}</span>\
                                </div>\
                                {{/if}}\
                                <div class="bottom">\
                                    {{for specialIcon}}\
                                    <span class="text pull-left special-icon {{: #data}} {{if #data.indexOf("special") > -1}}special{{/if}} {{if #data.indexOf("oog") > -1}}oog{{/if}}" {{if #data.indexOf("special") < 0}}style="background-image: url(../../src/js/mod/popup/images/BOX/icon-{{: #data}}.png); background-size: 100% 100%;"{{/if}}></span>\
                                    {{/for}}\
                                    <span class="text text-right pull-right">{{>(OBJ_CTN_WEIGHT / 1000).toFixed(1)}}</span>\
                                </div>\
                                {{if GPS_PLAN_LOCATION != ""}}\
                           		<span class="icon ico-status ing"></span>\
                                {{/if}}\
                            {{else}}\
                               	<div class="back-true">.</div>\
                            {{/if}}\
                        </td>\
                        {{else #data == ""}}\
                        <td class="bay disabled"></td>\
                        {{/if}}\
                        {{/for}}\
                    </tr>\
                    {{/for}}\
                    <tr class="row-number">\
                      <td></td>\
                      {{for idxArr}}\
                      <td>{{:idx}}</td>\
                      {{/for}}\
                    </tr>\
                </tbody></table>\
            </div>';

    var BOATCENTERPOP = function (cfg) {
        if (!(this instanceof BOATCENTERPOP)) {
            return new BOATCENTERPOP().init(cfg);
        }
    }

    BOATCENTERPOP.prototype = $.extend({}, {
        init: function (cfg) {
            this.observer = cfg.observer || null;
            this.elementId = cfg.elementId;
            this.wraper = $(this.elementId);
            this.data = cfg.data || {};
            this.data.viewModel = 'standard';   // 模式：标准模式 (standard), 箱号模式 (ctnno)
            this.boxTense = 'now';
            this.boxLat = '';
            this.colorSet = {
                'boxOwnerColor': {
                    'MOL': '#ffcccc',
                    'MSK': '#ffb8b8',
                    'MSC': '#fe7a7a',
                    'EMC': '#ff5b5b',
                    'HLC': '#bae9ff',
                    'KMD': '#94ddff',
                    'SML': '#73d2ff',
                    'DJS': '#4cc6ff',
                    'SCI': '#ffa8df',
                    'IAL': '#ff86d3',
                    'KLN': '#ff61c6',
                    'IRS': '#ff61c6',
                    'HJS': '#90ff95',
                    'TJM': '#6af271',
                    'SNL': '#2fd336',
                    'WOS': '#2fd336',
                    'NWO': '#ddadff'
                },
                'shipLineColor': {
                    'MSCSES': '#ffcccc',
                    '2M2US3': '#ffb8b8',
                    '2M2BLS': '#fe7a7a',
                    'NLHNMX': '#ff5b5b',
                    'MSCJPN': '#bae9ff',
                    'MSCMID': '#94ddff',
                    'EMCEUP': '#73d2ff',
                    'MSCJP2': '#4cc6ff',
                    '2M2EU3': '#ffccec',
                    'KMDIR6': '#ffa8df',
                    'KMDSD57': '#ff86d3',
                    'PCLSS25': '#ff61c6',
                    'DYSPT42': '#ff61c6',
                    'MARLO1': '#90ff95',
                    'YMLCY1': '#6af271',
                    'NYKLO10': '#2fd336',
                    'MARGL8': '#2fd336',
                    'KMDCA27': '#ddadff'
                },
                'shipVoyageColor': {
                    '707W': '#ffcccc',
                    '707E': '#ffb8b8',
                    'FT707W': '#fe7a7a',
                    'D4243': '#ff5b5b',
                    'HI708A': '#bae9ff',
                    'FK707A': '#94ddff',
                    '0916W': '#73d2ff',
                    'HI707A': '#4cc6ff',
                    '705W': '#ffccec',
                    'OOLNY8': '#ffa8df',
                    'EMCED13': '#ff86d3',
                    'KMDSN7': '#ff61c6',
                    'OOLIT7': '#ff61c6',
                    'CMACM6': '#90ff95',
                    'HMMHI6': '#6af271',
                    'LHE52102': '#2fd336',
                    'HSDFR1': '#2fd336',
                    'MAREE4': '#ddadff'
                }
            };
            this.initPop();
            this.bindEvent();
            return this;
        },
        initPop: function () {
            if (!this._boxDetailPop) {
                this._boxDetailPop = BoxDetailPop({
                    'observer': this._observer,
                    'elementId': this.elementId
                });
            }
        },
        bindEvent: function () {
            var that = this;
            // this.wraper.off();
            this.wraper
                .on('click', '.bay-box', function (ev) {
                    var it = $(ev.target);
                    if (!it.hasClass('bay-box')) { //div
                        it = it.parent();
                        if (!it.hasClass('bay-box')) { //span
                            it = it.parent();
                        }
                    }
                    var boxId = it.attr('data-id');
                    that.getContainerDetail(boxId);
                })
                .on('click', '.j-bay-detail .j-close', function () {
                    that.wraper.html('').hide();
                    that.wraper.off();
                    $('.home>.masker').addClass('hide');
                })
                .on('change', '#J_change_model', function () {  // 模式切换
                    var modelStr = $(this).find('option:selected').val();
                    that.data.viewModel = modelStr;
                    that.renderBoatBay(that.data.type);
                })
                .on('click', '.j-dSwitch', function () {    // 甲板
                    that.boxDatas = that.data.boatBoxData.dCtnGps;
                    that.data.bayBoxs = that.data.boatBoxData.dData;
                    that.data.type = 'D';
                    that.renderBoatBay(that.data.type); //重新render一次
                    $('.j-dSwitch').addClass('active');
                    $('.j-hSwitch').removeClass('active');
                })
                .on('click', '.j-hSwitch', function () {    // 船舱
                    that.boxDatas = that.data.boatBoxData.hCtnGps;
                    that.data.bayBoxs = that.data.boatBoxData.hData;
                    that.data.type = 'H';
                    that.renderBoatBay(that.data.type); //重新render一次
                    $('.j-hSwitch').addClass('active');
                    $('.j-dSwitch').removeClass('active');
                });
        },
        /*
         * 集装箱详情
         */
        getContainerDetail: function (boxId) {
            var that = this;
            if (!!this.boxDatas) { // 从贝位详情跳转
                $.each(that.boxDatas, function (k, v) {
                    if (boxId === v.OBJ_CTN_NO) { // 找到当前箱子
                        // that.renderContainerDetail(v);
                        that._boxDetailPop.renderContainerDetail(v);
                    }
                })
            }
        },
        /**
         * desc: 获取船舶贝位数据
         */
        getBoatBayDetailByParam: function (vesselCode, bayId) {
            var that = this;
            that.data.vesselCode = vesselCode;
            that.data.bay = bayId;
            that.bayDetailType = 'ship';
            $.ajax({
                method: 'get',
                url: '/portvision/block/count/' + vesselCode + '?type=vessel&view=section&bay=' + bayId,
                success: function (data) {
                    if (!data || !data.length) {
                        console.log('数据为空');
                        //                        return false;
                    }
                    that.formateBoatData(data);
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },
        /**
         * desc: 格式化船舶详情数据
         */
        formateBoatData: function (data, checkOption) {
            var that = this;
            this.boxDatas = data.dCtnGps;
            this.boatBayData = data;
            this.data.additionalBay = this.data.bay;
            // var floorTotal = 5; //6层
            // var columnTotal = 6; //6列
            // this.data.floorTotal = floorTotal;
            // 
            var tempBoatBox = {},
                tempDBoxArr = [],
                tempHBoxArr = [];

            var lenD = data.dData.length;
            var lenH = data.hData.length;
            this.data.minDtierId = data.minDtierId;

            $.each(data.dData[0], function () {
                tempDBoxArr.push(Array(lenD));
            });
            $.each(data.dData, function (k, v) {
                $.each(v, function (j, d) {
                    tempDBoxArr[j][k] = d;
                })
            })

            $.each(data.hData[0], function () {
                tempHBoxArr.push(Array(lenH));
            });
            $.each(data.hData, function (k, v) {
                $.each(v, function (j, d) {
                    tempHBoxArr[j][k] = d;
                })
            })

            tempBoatBox['dData'] = tempDBoxArr;
            tempBoatBox['hData'] = tempHBoxArr;
            tempBoatBox['dCtnGps'] = data.dCtnGps;
            tempBoatBox['hCtnGps'] = data.hCtnGps;
            this.data.boatBoxData = tempBoatBox;

            // 格式化编号
            var idxNum = 0,
                idxArr = [],
                idxArrLen = data.dData.length;
            if (idxArrLen % 2 === 1) {
                for (var i = (idxArrLen - 1) / 2; i > 0; i--) {
                    idxNum = i * 2;
                    idxNum < 10 ? idxArr.push({
                        idx: '0' + idxNum
                    }) : idxArr.push({
                        idx: '' + idxNum
                    });
                }
                idxArr.push({
                    idx: '00'
                });
                for (var i = 0; i < (idxArrLen - 1) / 2; i++) {
                    idxNum = i * 2 + 1;
                    idxNum < 10 ? idxArr.push({
                        idx: '0' + idxNum
                    }) : idxArr.push({
                        idx: '' + idxNum
                    });
                }
            } else {
                for (var i = idxArrLen / 2; i > 0; i--) {
                    idxNum = i * 2;
                    idxNum < 10 ? idxArr.push({
                        idx: '0' + idxNum
                    }) : idxArr.push({
                        idx: '' + idxNum
                    });
                }
                for (var i = 0; i < idxArrLen / 2; i++) {
                    idxNum = i * 2 + 1;
                    idxNum < 10 ? idxArr.push({
                        idx: '0' + idxNum
                    }) : idxArr.push({
                        idx: '' + idxNum
                    });
                }
            }
            this.data.idxArr = idxArr;

            // 构建column对照表
            var columnObj = {};
            $.each(idxArr, function (k, v) {
                columnObj[parseInt(v.idx)] = k;
            })
            /*
            var bayBoxs = [];
            for (var k = 0; k < floorTotal; k++) {
                bayBoxs[k] = [];
                for (var j = 0; j < columnTotal; j++) {
                    bayBoxs[k][j] = "";
                }
            }
            //                  console.log('组装前的：' + bayBoxs);
            */
            var dTotalFloor = tempDBoxArr.length - 1;
            $.each(data.dCtnGps, function (k, v) {
                v.isBig = false;
                v.isBack = false;
                if (v.GPS_ACTUAL_SLOT_POSITION) {
                    var bay = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(0, 3)); // 贝位          
                    v.bay = bay;
                    if (that.data.additionalBay === that.data.bay && bay > that.data.bay) {
                        that.data.additionalBay = bay;
                    }
                    if (bay !== parseInt(that.data.bay)) {
                        v.isBig = true;
                    }
                    if (bay < that.data.bay) {
                        v.isBack = true;
                    }
                    var floor = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(5, 2)); //层 （tr）
                    var column = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(3, 2)); //列（td）
                    // if (!(floor && column)) return;
                    floor = dTotalFloor - (floor - data.minDtierId) / 2;
                    column = columnObj[column];
                    var box = {};
                    if (that.colorSet) { }
                    box.color = '#111';
                    //根据当前的分类来做颜色的切换
                    switch (checkOption) {
                        case 'box':
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                        case 'size': // 尺寸
                            if (!!that.colorSet.shipLineColor) {
                                that.colorS = that.colorSet.shipLineColor;
                                box.key = v.OBJ_CTN_SIZE;
                            }
                            break;
                        case 'port': // 卸货港
                            if (!!that.colorSet.shipVoyageColor) {
                                that.colorS = that.colorSet.shipVoyageColor;
                                box.key = v.STA_DISCHARGE_PORT_CODE;
                            }
                            break;
                        default:
                            checkOption = 'box';
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                    }

                    box.planIcon = that.formatePlanIcon(v);
                    box.specialIcon = that.formateContainerIcon(v);
                    box.ctnChart = v.OBJ_CTN_NO.match(/^[a-z|A-Z]+/gi);
                    box.ctnNum = v.OBJ_CTN_NO.match(/\d+$/gi);
                    box.color = that.colorS[box.key] ? that.colorS[box.key] : '#5256eb'; //默认黑色                    
                    box.boxId = v.OBJ_CTN_NO;
                    box.weight = v.OBJ_CTN_WEIGHT;
                    tempDBoxArr[floor][column] = $.extend(box, v);
                }
            })

            var hTotalFloor = tempHBoxArr.length;
            $.each(data.hCtnGps, function (k, v) {
                v.isBig = false;
                v.isBack = false;
                if (v.GPS_ACTUAL_SLOT_POSITION) {
                    var bay = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(0, 3)); // 贝位
                    v.bay = bay;
                    if (that.data.additionalBay === that.data.bay && bay > that.data.bay) {
                        that.data.additionalBay = bay;
                    }
                    if (bay !== parseInt(that.data.bay)) {
                        v.isBig = true;
                    }
                    if (bay < that.data.bay) {
                        v.isBack = true;
                    }
                    var floor = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(5, 2)); //层 （tr）
                    var column = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(3, 2)); //列（td）

                    // if (!(floor && column)) return;
                    floor = hTotalFloor - floor / 2;
                    column = columnObj[column];
                    var box = {};
                    if (that.colorSet) { }
                    box.color = '#111';
                    //根据当前的分类来做颜色的切换
                    switch (checkOption) {
                        case 'box':
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                        case 'vessel': //航线
                            if (!!that.colorSet.shipLineColor) {
                                that.colorS = that.colorSet.shipLineColor;
                                box.key = v.STA_SERVICE_CODE;
                            }
                            break;
                        case 'voyage': //航次
                            if (!!that.colorSet.shipVoyageColor) {
                                that.colorS = that.colorSet.shipVoyageColor;
                                if (!v.STA_OUT_VOYAGE) {
                                    box.key = v.STA_IN_VOYAGE;
                                } else {
                                    box.key = v.STA_OUT_VOYAGE;
                                }
                            }
                            break;
                        default:
                            checkOption = 'box';
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                    }

                    box.planIcon = that.formatePlanIcon(v);
                    box.specialIcon = that.formateContainerIcon(v);
                    box.ctnChart = v.OBJ_CTN_NO.match(/^[a-z|A-Z]+/gi);
                    box.ctnNum = v.OBJ_CTN_NO.match(/\d+$/gi);
                    box.color = that.colorS[box.key] ? that.colorS[box.key] : '#5256eb'; //默认黑色                    
                    box.boxId = v.OBJ_CTN_NO;
                    box.weight = v.OBJ_CTN_WEIGHT;
                    tempHBoxArr[floor][column] = $.extend(box, v);
                }
            })

            this.data.bayBoxs = this.data.boatBoxData.dData;
            this.renderBoatBay('D'); //重新render一次，默认渲染甲板上“D”
            $('#J_change_pro').val(checkOption); //设置选中
        },
        /**
         * desc: 格式化计划图标
         */
        formatePlanIcon: function (plan) {
            var planIcon = ''; // 计划标记icon类型
            // 判断JOB_TYPE区分作业类型
            switch (plan.JOB_JOB_TYPE) {
                case 'LOAD':    // 装船
                case 'DLVR':    // 提箱
                    planIcon = 'unload';
                    break;
                case 'DSCH':    // 卸船
                case 'RECV':    // 进箱
                    planIcon = 'load';
                    break;
                case 'SHFT':
                    planIcon = 'move';
                    break;
                default:
                    planIcon = '';
                    break;
            }
            // 在作业类型基础上通过空重判断提空箱计划、提重箱计划、收空箱计划、收重箱计划
            if (planIcon === 'load') {   // move in
                switch (plan.STA_CTN_STATUS) {
                    case 'E':
                        planIcon = 'loadempty';
                        break;
                    case 'F':
                        planIcon = 'loadweight';
                        break;
                    default:
                        planIcon = 'load';
                        break;
                }
            } else if (planIcon === 'unload') {    // move out
                switch (plan.STA_CTN_STATUS) {
                    case 'E':
                        planIcon = 'unloadempty';
                        break;
                    case 'F':
                        planIcon = 'unloadweight';
                        break;
                    default:
                        planIcon = 'unload';
                        break;
                }
            }
            return planIcon;
        },
        /**
         * desc: 格式化箱图标
         */
        // TODO: 箱图标复合图标逻辑需重组
        formateContainerIcon: function (args) {
            var specialIcon = []; // 特殊箱标记icon类型
            // 1.危险品&空箱 2.冷冻箱标记 3.超限标记
            if (args.STA_HAZARD_TYPE) { // 危险品类型
                if (args.STA_HAZARD_TYPE.indexOf('爆炸') > -1) {
                    specialIcon.push('dg-1');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃气体') > -1 || args.STA_HAZARD_TYPE.indexOf('不易燃气体') > -1 || args.STA_HAZARD_TYPE.indexOf('易燃气体') > -1) {
                    specialIcon.push('dg-2');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃液体') > -1) {
                    specialIcon.push('dg-3');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃固体') > -1 || args.STA_HAZARD_TYPE.indexOf('自燃气体') > -1) {
                    specialIcon.push('dg-4');
                } else if (args.STA_HAZARD_TYPE.indexOf('氧化剂') > -1 || args.STA_HAZARD_TYPE.indexOf('过氧化') > -1) {
                    specialIcon.push('dg-5');
                } else if (args.STA_HAZARD_TYPE.indexOf('毒') > -1 || args.STA_HAZARD_TYPE.indexOf('感染') > -1) {
                    specialIcon.push('dg-6');
                } else if (args.STA_HAZARD_TYPE.indexOf('放射') > -1) {
                    specialIcon.push('dg-7');
                } else if (args.STA_HAZARD_TYPE.indexOf('腐蚀') > -1) {
                    specialIcon.push('dg-8');
                } else if (args.STA_HAZARD_TYPE.indexOf('其他') > -1 || args.STA_HAZARD_TYPE.indexOf('其它') > -1) {
                    specialIcon.push('dg-9');
                }
                // specialIcon = specialIcon === '' ? '!' + args.STA_HAZARD_TYPE : 'compound-rule';
            }  else if (args.STA_CTN_STATUS) { // 空重状态
                args.STA_CTN_STATUS === 'E' && specialIcon.push('empty');
            } else if (args.STA_REEFER_FLAG) { // 温控标记
                args.STA_REEFER_FLAG === 'Y' && specialIcon.push('reefer');
            } else if (args.STA_OD_TYPE) { // 超限类型 当前无数据
                // 初始specialIcon为空直接判断
                // specialIcon = args.STA_OD_TYPE;
            } 
            // else if (args.STA_DAMAGE_FLAG) { // 残损标记
            //     if (specialIcon === '') {
            //         specialIcon = args.STA_DAMAGE_FLAG === 'Y' ? 'damage' : '';
            //     } else {
            //         specialIcon = 'compund-rule';
            //     }
            // }
            return specialIcon;
        },
        /**
         * desc: 生成船舶模板内容
         */
        generateBoatBayDetailInfo: function (type) {
            var info = '';
            this.data.type = type || 'D';
            this.data.bayBoxs = this.data.type === 'D' ? this.data.boatBoxData.dData : this.data.boatBoxData.hData;
            this.data.hLength = this.data.boatBoxData.hData.length;
            this.data.dLength = this.data.boatBoxData.dData.length;
            console.log(this.data);
            info = jsrender.templates(boatBayDetailTemplate).render(this.data);
            //j-additional
            return info;
        },
        /**
         * desc: 渲染船舶贝位详情
         */
        renderBoatBay: function (type) {
            if (!this.data) {
                // this.data = _.defaults(testBayDetailData);
            }
            var wraperLeft = jsrender.templates(centerbayDetailWraperTemplate).render(this.data);
            var wraperRight = this._boxDetailPop.getBoxDetailWrapperTemp(this.data);
            var wraper = wraperLeft + wraperRight;
            var bayDetailinfo = this.generateBoatBayDetailInfo(type);

            this.wraper.html(wraper).show().find('.popup-left').show();
            this.wraper.find('.inline').removeClass('inline');
            this.wraper.find('.popup-left .pop-body').html(bayDetailinfo);
            $('.pop-select').css('width', '30%');
            $('.popup-left').addClass('boat-baypop');
            this.data.boatBoxData.dData.length === 0 && $('.j-dSwitch').addClass('hide');
            this.data.boatBoxData.hData.length === 0 && $('.j-hSwitch').addClass('hide');
            if (this.data.additionalBay !== this.data.bay) {
                this.wraper.find('.j-additional').html('(' + this.data.additionalBay + ')');
            }

            // 设置模式的值
            $('#J_change_model').val(this.data.viewModel);
            // 设置当前甲板船舱按钮
            if (this.data.type === 'D') {
                $('.j-dSwitch').addClass('active');
                $('.j-hSwitch').removeClass('active');
            } else {
                $('.j-hSwitch').addClass('active');
                $('.j-dSwitch').removeClass('active');
            }
        }
    });

    return BOATCENTERPOP;
});