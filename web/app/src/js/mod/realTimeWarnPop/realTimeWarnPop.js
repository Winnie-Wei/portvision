/**
 * @module mod/realTimePop 实时告警弹框
 */
define(function(require) {
    'use strict'

    var jsrender = require('plugin/jsrender/jsrender');

    var newWarningTemp = jsrender.templates( 
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

    var REALTIMEPOP = function (cfg) {
        if (!(this instanceof REALTIMEPOP)) {
            return new REALTIMEPOP().init(cfg);
        }
    };

    REALTIMEPOP.prototype = $.extend({}, {
        init: function (cfg) {
            this._zr = cfg.zr;//zr
            this.observer = cfg.observer;//观察者
            this.showScale = cfg.showScale;//缩放倍数
            this.initScale = cfg.initScale;
            this.wraper = $('#J_newWarn');
            return this;
        },

        bindEvent: function () {
            var that = this;
            $('#J_newWarn')
                .on('click', '.showOnMap', function (ev) {//告警跳转到地图并高亮                
                    that.hide();
                    var it = $(ev.target);
                    var warnId = $(this).attr('data-id'),
                        type = $(this).attr('data-eType'),
                        id = $(this).attr('data-eId'),
                        equipmentCode = $(this).attr('data-ecode'),
                        name = $(this).attr('data-eName');
                    that.readWarn(warnId);//读取告警信息
                    that.observer._overMap && that.observer._overMap.setSelectedEquipmentFromAlarm && that.observer._overMap.setSelectedEquipmentFromAlarm({ 'equipmentCode': equipmentCode, 'type': type });
                })
                .on('click', '.j-close', function () { // 关闭
                    that.hide();
                });
        },
        /**
         * desc: 渲染实时告警
         */
        renderNewWarnsByData: function (newWarns) {
            var that = this;
            if (!newWarns.result || !newWarns.result.length) {
                return false;
            }
            var idTemp = newWarns.result[0].ID;
            if (idTemp !== that.oldWarnId) {
                that.oldWarnId = idTemp;
            } else {
                return false;
            }
            this.wraper.html('');
            var htmlValue = newWarningTemp.render(newWarns);
            this.wraper.html(htmlValue).show();
            setTimeout(function () {
                that.wraper.html('').hide();
                that.oldWarnId = '';
            }, 60 * 1000);
            this.bindEvent();
        },

        readWarn: function (id) {
            var that = this;
            if (!!id) {
                $.ajax({
                    method: 'post',
                    url: '/portvision/alarm/' + id,
                    success: function (data) {
                        console.log('读取告警信息，并返回' + data);
                        that.refreshWarnNum();
                    },
                    fail: function (error) {
                        console.log(error);
                    }
                });
            }
        },
        /**
         * desc: 刷新告警计数
         */
        refreshWarnNum: function (id) {
            if (!!id) {
                $.ajax({
                    method: 'post',
                    url: '/portvision/object/alarm?order=OCCURRENCE_TIME&key=READ_FLAG&operator=EQUALS&value=N',
                    success: function (data) {
                        // that.renderWarnNum(newWarns.result);
                    },
                    fail: function (error) {
                        console.log(error);
                    }
                });
            }
        },

        /**
         * desc: 更新告警计数
         */
        renderWarnNum: function (datas) {
            if (datas.length === 0) {
                $('#J_warnNum').html('');
            } else {
                var htmlValue = '<div class="circle"></div>';
                $('#J_warnNum').html(htmlValue);
            }
        },

        hide: function () {
            this.wraper.hide();
        }

    })

    return REALTIMEPOP;
});