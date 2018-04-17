/**
 * @module mod/boxDetailPop 箱子详情弹框
 */
define(function(require) {
    'use strict'

    var jsrender = require('plugin/jsrender/jsrender');

    var centerContainerDetailWraperTemplate =
        '<div class="popup popup-right fixed-center md bay-pop inline j-box-detail">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                    + '<p class="pop-title text-left">集装箱详情</p>'
                    + '<span class="pop-close j-close">关闭</span>'
                + '</div>'
                + '<div class="pop-body">'
                + '</div>'
            + '</div>'
        + '</div>';
    var containerDetailTemplate =
        '<div class="equ-detail">'
            + '<div class="info-top clearfix">'
                + '<div class="inline-left ">'
                    + '<img src="" alt="" />'
                + '</div>'
                + '<div class="inline-right">'
                    + '<p>箱号：{{:OBJ_CTN_NO}}</p>'
                    + '<p>尺寸：{{:OBJ_CTN_SIZE}}</p>'
                    + '<p>箱高：{{:OBJ_CTN_HEIGHT}}</p>'
                    + '<p>皮重：{{:OBJ_TARE_WEIGHT}}</p>'
                    + '<p>箱主：{{:OBJ_CTN_OPERATOR_CODE}}</p>'
                + '</div>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    + '<li>箱型：{{:OBJ_CTN_TYPE}}</li>'
                    + '<li>箱型尺寸：{{:OBJ_CTN_SIZE}}{{:OBJ_CTN_TYPE}}</li>'
                    + '<li>超限类型：{{:STA_OD_TYPE}}</li>'
                    + '<li>危险品类型：{{:STA_HAZARD_TYPE}}</li>'
                    + '<li>空重状态:'
                        + '{{if STA_CTN_STATUS == "F"}}重'
                        + '{{else STA_CTN_STATUS == "E"}}空'
                        + '{{else STA_CTN_STATUS == "L"}}重'
                        + '{{/if}}'
                    + '</li>'
                    + '<li>箱状态：'
                        + '{{if STA_CTN_STATUS == "F"}}整箱'
                        + '{{else STA_CTN_STATUS == "E"}}空箱'
                        + '{{else STA_CTN_STATUS == "L"}}拼箱'
                        + '{{/if}}'
                    + '</li>'
                    + '<li>进港类型：'
                        + '{{if STA_CTN_CATEGORY == "I"}}进口'
                        + '{{else STA_CTN_CATEGORY == "E"}}出口'
                        + '{{else STA_CTN_CATEGORY == "T"}}中转'
                        + '{{else STA_CTN_CATEGORY == "Z"}}国际中转'
                        + '{{else STA_CTN_CATEGORY == "R"}}翻舱'
                        + '{{else STA_CTN_CATEGORY == "M"}}存储箱'
                        + '{{else STA_CTN_CATEGORY == "S"}}过境箱'
                        + '{{else STA_CTN_CATEGORY == "N"}}未知'
                        + '{{/if}}'
                    + '</li>'
                    + '<li>铅封号：{{:STA_SEAL_NO}}</li>'
                + '</ul>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                /*+ ' {{if STA_CTN_CATEGORY == "I"}}'
                    + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
                    + '<li>航次：{{:GPS_IN_VOYAGE}}</li>'
                    + '<li>航次代码：暂无</li>'
                + ' {{else STA_CTN_CATEGORY == "E"}}'
                    + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
                    + '<li>航次：{{:GPS_OUT_VOYAGE}}</li>'
                    + '<li>航次代码：暂无</li>'
                + ' {{else STA_CTN_CATEGORY == "T" || STA_CTN_CATEGORY == "Z"}}'
                    + ' {{if GPS_PLAN_POSITION_QUALIFER == "V"}}'
                        + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
                        + '<li>航次：{{:GPS_OUT_VOYAGE}}</li>'
                        + '<li>航次代码：暂无</li>'
                    + '{{else}}'
                        + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
                        + '<li>航次：{{:GPS_IN_VOYAGE}}</li>'
                        + '<li>航次代码：暂无</li>'
                    + ' {{/if}}'
                + ' {{/if}}'*/
                + ' {{if !STA_OUT_VOYAGE}}'
                + '<li>船名：{{:STA_VESSEL_CODE}}</li>'
                + '<li>航次：{{:STA_IN_VOYAGE}}</li>'
                + '<li>航次代码：{{:STA_OUTBOUND_CARRIER}}</li>'
                + ' {{else}}'
                + '<li>船名：{{:STA_VESSEL_CODE}}</li>'
                + '<li>航次：{{:STA_OUT_VOYAGE}}</li>'
                + '<li>航次代码：{{:STA_OUTBOUND_CARRIER}}</li>'
                +' {{/if}}'
                + '</ul>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    + '<li>装货港：{{:STA_LOAD_PORT_CODE}}</li>'
                    + '<li>卸货港：{{:STA_DISCHARGE_PORT_CODE}}</li>'
                    + '<li>中转港：{{:STA_TRANSFER_PORT_CODE}}</li>'
                    + '<li>目的港：{{:STA_DESTINATION_PORT_CODE}}</li>'
                + '</ul>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    + '<li>场箱区分类：{{:GPS_ACTUAL_POSITION_BLOCK}}</li>'
                    + '<li>场箱位：{{:GPS_ACTUAL_SLOT_POSITION}}</li>'
                + '</ul>'
            + '</div>'
        + '</div>';
    var testContainerDetailData = {
        'type': 'container',
        'topInfo': [
            { name: '箱号', text: 'EMS23434412' }, { name: '尺寸', text: '21m * 3m * 3m' },
            { name: '箱重', text: '5T' }, { name: '进出口', text: '出口' }, { name: '是否重箱', text: '是' }
        ],
        'middleInfo': [
            { name: '箱号', text: 'EMS23434412' }, { name: '尺寸', text: '21m * 3m * 3m' },
            { name: '箱重', text: '5T' }, { name: '进出口', text: '出口' }, { name: '是否重箱', text: '是' }
        ],
        'bottomInfo': [
            { name: '箱号', text: 'EMS23434412' }, { name: '尺寸', text: '21m * 3m * 3m' },
            { name: '箱重', text: '5T' }, { name: '进出口', text: '出口' }, { name: '是否重箱', text: '是' }
        ]
    };

    var BOXDETAILPOP = function (cfg) {
        if (!(this instanceof BOXDETAILPOP)) {
            return new BOXDETAILPOP().init(cfg);
        }
    }

    BOXDETAILPOP.prototype = $.extend({}, {
        init: function (cfg) {
            this.observer = cfg.observer;
            this.elementId = cfg.elementId;
            this.wraper = $(this.elementId);
            this.bindEvent();
            return this;
        },
        bindEvent: function () {
            var that = this;
            this.wraper
                .on('click', '.j-box-detail .j-close', function () {
                    that.hide();
                });
        },
        renderBoxDetailPop: function (data) {
            if (_.isArray(data) && !data.length) return;
            var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(this.data);
            this.wraper.html(wraperRight).show().find('.popup-right').show();
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').removeClass('inline').show();
        },
        /*
         *  desc: 渲染箱子详情面板
         */
        renderContainerDetail: function (data) {
            if (!data || (_.isArray(data) && !data.length)) {
                data = _.defaults(testContainerDetailData);
                console.log(data, '为空')
            }
            //var wraperRight = jsrender.templates( centerContainerDetailWraperTemplate ).render( data );
            //this.wraper.html( wraperRight ).show().find('.popup-right').show();
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo).show();
            this.wraper.find('.popup').addClass('inline').show();
            // $('.masker').removeClass('hide');

        },
        /**
         * desc: 对外提供pop外框模板
         */
        getBoxDetailWrapperTemp: function (data) {
            var wrapper = jsrender.templates(centerContainerDetailWraperTemplate).render(data);
            return wrapper;
        },
        /**
         * desc: 生成箱子body内容
         */
        generateContainerDetailInfo: function (ajaxdata) {
            var info = '';
            if (!ajaxdata) {
                ajaxdata = _.defaults(testContainerDetailData);
            }
            // ajaxdata 返回为一个数组，取第一个
            var data = _.isArray(ajaxdata) ? ajaxdata[0] : ajaxdata;
            info = jsrender.templates(containerDetailTemplate).render(data);
            var positionInfo = data.GPS_ACTUAL_SLOT_POSITION;
            var block = data.GPS_ACTUAL_POSITION_BLOCK ? data.GPS_ACTUAL_POSITION_BLOCK + '堆场' : '';
            // var text = '集装箱详情(' + data.GPS_ACTUAL_POSITION_BLOCK + '堆场' +
            //     positionInfo.slice(0, 2) + '' +
            //     positionInfo.charAt(positionInfo.length - 1) + '层' +
            //     positionInfo.slice(3, 4) + '列)';

            if (positionInfo) {
                $('#J_centerPop .popup-right .pop-title').html('集装箱详情(' + block + positionInfo + ')');
            }
            return info;
        },
        /**
         * 设置弹框位置
         */
        setPosition: function (position) {
            position === 'block' ? this.wraper.find('.popup').removeClass('inline').show() : this.wraper.find('.popup').addClass('inline').show();
        },
        /**
         * 隐藏弹框
         */
        hide: function () {
            this.wraper.find('.popup').removeClass('inline');
            this.wraper.find('.popup-right').hide();
        }
    });

    return BOXDETAILPOP;
});