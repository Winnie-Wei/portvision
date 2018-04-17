/**
 * @module port/layer/attachment/ 附属物层
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');

    var MapLegend = require('widget/mapLegend/index'); // 图例

    var Attachment = function (cfg) {
        if (!(this instanceof Attachment)) {
            return new Attachment().init(cfg);
        }
    };

    Attachment.prototype = $.extend(new McBase(), {

        /*
        * 初始化
        * @param {plain object}  {
            wraper: {string || object}    // 外容器节点或节点选择器字符串
           
           },       
        */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            if (!this._mapLegend) {
                this._mapLegend = MapLegend({
                    'observer': this.observer,
                    'wraper': $('#J_mapLegend')
                });
            };
            return this;
        },
        // 显示热力图图例
        showThermodynamicLegend: function () {
            this._mapLegend && this._mapLegend.showThermodynamicLegend();
        },
        // 显示堆场类型图例
        showFunctiontypeLegend: function () {
            this._mapLegend && this._mapLegend.showLegendBtn();
        },
        show: function () {
            //this.wraper && this.wraper.show();
        },
        hide: function () {
            //this.wraper && this.wraper.hide();
        }

    })

    return Attachment;

})