/**
 * @module port/wediget/zoomBtn/ 缩放按钮
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ZBtn = function (cfg) {
        if( !(this instanceof ZBtn) ){
            return new ZBtn().init(cfg);
        }
    };
    
    ZBtn.prototype = $.extend( new McBase(), {
    	
        /*
        * 初始化
        * @param {plain object}  {
            wraper: {string || object}    // 外容器节点或节点选择器字符串
           
           },       
        */
        init:function( cfg ){ 
        	if( !cfg.wraper || !cfg.wraper.length ){
        		console.log('无节点');
        		return false;
        	}
        	this.wraper = cfg.wraper || $(cfg.wraper);
        	this.observer = cfg.observer;
        	this.render();
        	this.bindEvent();
        	return this;
        },
        /*
         * 初始化
         * @param {string || object}    // 外容器节点或节点选择器字符串
         */
        render:function( wraper ){
        	this._temp = '<div class="bar-map-zoom">'
			    + '<div class="zoomBox zoomIn" title="放大一级">'
			    + '</div>'
			    + '<div class="zoomBox zoomOut" title="缩小一级">'
			    + '</div>'
			+ '</div>';
        	if( wraper ){
        		this.wraper = wraper || $(wraper);
        	}

        	this.wraper.html(this._temp);

        },
        // 绑定事件
        bindEvent:function(){
        	var parent = this;
        	this.wraper.off().on('click', ".zoomIn", function(ev){    
        		parent.observer && parent.observer.notice('_baseMap', 'zoomIn');
            }).on('click',".zoomOut", function(ev){
            	parent.observer && parent.observer.notice('_baseMap', 'zoomOut');
            });  
        },
    })
    
    return ZBtn;
    
})