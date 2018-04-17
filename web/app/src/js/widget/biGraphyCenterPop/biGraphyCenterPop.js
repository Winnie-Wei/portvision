/**
 * @moudle widget/biGraphyCenterPop/biGraphyCenterPop bi图表中心弹框
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');

    var biGraphyModalTemplate = '<div class="masker"></div>' +
                                '<div class="j-biGraphyModal">' + 
                                    '<div class="panel panel-default">' +
                                        '<div class="panel-heading">' +
                                            '<h3 class="panel-title">标题</h3>' +
                                            '<span class="j-close">关闭</span>' +
                                        '</div>' +
                                        '<div class="panel-body">' +
                                            'content' +
                                        '</div>' +
                                    '</div>' +
                                '</div>';

    var BIGRAPHYCENTERPOP = function( cfg ) {
        if ( !(this instanceof BIGRAPHYCENTERPOP) ) {
            return new BIGRAPHYCENTERPOP().init(cfg);
        }
    };

    BIGRAPHYCENTERPOP.prototype = $.extend(new McBase, {
        init: function( cfg ) {
            this.wraper = cfg.dom;
            if( !this.wraper || !this.wraper.length ){
                return false;
            }
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.timeOption = '0';
            this.timeOptionStr = 'DAY';     
            this.data = {
                yard: {},
                shore: {},
                gate: {},
                throughput: {},
            };
            this.bindEvent();  
            this.render();
            return this;
        },
        bindEvent: function() {
            var self = this;
            this.wraper.off()
            .on('click', '.j-close', function(){
                $('.indicator-item').removeClass('active');
                self.hide();
            })
        },
        /**
         * 显示
         */
        show: function(){
            this.wraper.show();
            this.clearBIGraphyModal();
        },
        /**
         * 隐藏
         */
        hide: function(){
            this.wraper.hide();
        },
        clearBIGraphyModal: function() {
            this.wraper.find('.panel-title').html('标题');
            this.wraper.find('.panel-body').html('').addClass('loading');
        },
        showLoading: function() {
            this.wraper.find('.panel-body').addClass('loading');
        },
        removeLoading: function() {
            this.wraper.find('.panel-body').removeClass('loading');
        },
        /**
         * 渲染
         */
        render: function() {
            var temp = jsrender.templates( biGraphyModalTemplate ).render();
            this.wraper.html( temp );
            this.hide();
            // this.wraper.addClass('hide');
        },
    });

    return BIGRAPHYCENTERPOP;
})
