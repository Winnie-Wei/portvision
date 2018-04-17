/**
 * @module port/wediget/legend/ 图例
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender'); // jsrender模板库
    var MapLegend = function (cfg) {
        if( !(this instanceof MapLegend) ){
            return new MapLegend().init(cfg);
        }
    };
    
    MapLegend.prototype = $.extend( new McBase(), {
    	
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
        	this.colors = cfg.colors || ['#ffcccc','#ffb8b8','#ffa2a2','#ff9090','#ff7777','#f46666','#e55656','#d94a4a','#ce3d3d','#c33333'];
        	//this.colors = ['#e9e081','#e9d981','#e9cf81','#e9c581','#e9bc81','#e9b481','#e1aa74','#ef955f','#ea864a','#e77936'];
        	this.colors = ['#e5e5e5','#d9d9d9','#cccccc','#bfbfbf','#b3b3b3','#a6a6a6','#999999','#8c8c8c','#808080','#737373'];
        	this.types = cfg.types || [
        		{"name":"危险品箱区","color":"#ffb8b8"},
        		{"name":"特种箱区","color":"#ddadff"},
        		{"name":"ES箱区","color":"#90ff95"},
        		{"name":"RTG箱区","color":"#94ddff"},
        		{"name":"工作中","color":"#26BA30"},
        		{"name":"故障","color":"#E44C09"},
        		{"name":"有指令空闲","color":"#F502FE"},
        		{"name":"无指令空闲","color":"#2890C0"},
        		{"name":"日常维护","color":"#EA993A"},            		
        		{"name":"装箱","color":"#6587FF"},
        		{"name":"卸箱","color":"#6A52C3"},
        		{"name":"进箱","color":"#F36067"},
        		{"name":"提箱","color":"#C8B9AF"},
        		{"name":"场内转移","color":"#dd96ea"},    
        		{"name":"查验","color":"#90a961"},   //＃0ee6de＃ff8e74＃8a00ff        		
        	]
        	this.render();  
            this.bindEvent();
        	return this;
        },
        bindEvent: function(){
            var self = this;
            this.legendBtn.on('click', function(){
                self.isLegendShow ? self.showLegendBtn() : self.showFunctiontypeLegend();

            })
        },
        /*
         * 初始化
         * @param {string || object}    // 外容器节点或节点选择器字符串
         */
        render:function( wraper ){
        	this._tempThermodynamic = 	'<div class="j-thermodynamicLegend">' + 
				// '<h5 class="title">堆存量热力图图例</h5>' +
				'<ul class="legend clearfix">' +
					'{{for bgColors}}' +
						'<li style="background-color: {{>#data}}">' +
                            '{{if #index == 0}}' +
                                '<span class="start">0</span>' +
                            '{{else #index == ~root.bgColors.length-1}}' +
                                '<span class="end">100</span>' +
                            '{{/if}}' +
                        '</li>' +
					'{{/for}}' +
				'</ul>' +
			'</div>';  
            this._showLegendBtnTemp =   '<div class="showLegendBtn j-showLegendBtn">' +
                                            "图例<br />说明" +
                                        '</div>';
        	this._tempFunctionType = 	'<div class="j-functionTypeLegend">'
        		+ '{{for types}}'
        		+ '<div class="in-line legend-wraper">'
        			+ "<span style='background-color:{{>color}}' class='legendColor'></span>"
                	+ "<span class='legendTitle'>{{>name}}</span></span>"                    
                + '</div>'
                + '{{/for}}'
            + "</div>";   
        	
			var tempThermodynamic = jsrender.templates(this._tempThermodynamic).render({bgColors: this.colors});
            var tempFunctionType = jsrender.templates(this._tempFunctionType).render({'types':this.types});
			var tempShowLegendBtn = jsrender.templates(this._showLegendBtnTemp).render();
			
			var template = tempThermodynamic + tempFunctionType + tempShowLegendBtn;
        	if( wraper ){
        		this.wraper = wraper || $(wraper);
        	}
        	this.wraper.html(template);
        	this.thermodynamicLegend = this.wraper.find('.j-thermodynamicLegend');
        	this.functionTypeLegend = this.wraper.find('.j-functionTypeLegend');
            this.legendBtn = this.wraper.find('.j-showLegendBtn');
        	
	    	var dataLength = this.types.length;
	        var classTemp = 'j-functionTypeLegend map-legend';
	        if( dataLength % 3 == 0 || dataLength > 6){
	           classTemp += ' col-there';
	        }else{
	           classTemp += ' col-two';
	        }
	        this.functionTypeLegend.attr('class',classTemp);
        },
        show:function(){
        	this.wraper && this.wraper.show();
        },
        hide:function(){
        	this.wraper && this.wraper.hide();
        },
        showThermodynamicLegend:function(){
        	this.functionTypeLegend.hide();
        	this.thermodynamicLegend.show();
            this.legendBtn.hide();
        },
        showFunctiontypeLegend:function(){
        	this.thermodynamicLegend.hide();
        	this.functionTypeLegend.show();
            this.isLegendShow = true;
        },
        showLegendBtn: function(){
            this.thermodynamicLegend.hide();
            this.functionTypeLegend.hide();
            this.legendBtn.show();
            this.isLegendShow = false;
        }

    })
    
    return MapLegend;
    
})