/**
 * @module port/mod/popup/index 弹框组件
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库

    var bottomWraperTemplate = '<div class="popup"><div class="masker"></div></div>';
  
    var POPUP = function (cfg) {
        if( !(this instanceof POPUP) ){
            return new POPUP().init(cfg);
        }
    };

    POPUP.prototype = $.extend( new McBase(), {

        /*
         *
         */ 
        init: function(cfg){
            this.data = cfg.data || 0;
            this.elementId = cfg.elementId || 0;
            this.observer = cfg.observer || null;
            this.defaultTowerColors = [
                {'text':'9层','color':'#83f699'},{'text':'','color':'#56dfc1'},{'text':'7层','color':'#83f7ee'},
                {'text':'','color':'#f683e2'},{'text':'5层','color':'#82b3f5'},{'text':'','color':'#f5f583'},
                {'text':'3层','color':'#f4d180'},{'text':'','color':'#caaa2f'},{'text':'1层','color':'#f58382'}
            ];
            this.data.towerColors = this.defaultTowerColors.concat();
            this.wraper = $( this.elementId );
            this.wraper.html('');
            this.bindEvent();
            return this;
        },

        /*
         *
         */ 
        bindEvent: function(){
            var that = this;
            this.wraper.on('click','.bay',function(ev){
                var it = $(ev.target),
                    parent = it.parent();
                var rowNumber = parent.attr('data-id');
                var bayNumber = it.attr('data-id');
                //console.log(rowNumber + ' 行' + bayNumber + '列');
                that.observer.showPop('bayDetail',{'row':rowNumber,'bay': bayNumber});
            });

            this.wraper.on('click','.j-close',function(){
                that.wraper.html('').hide();
                that.wraper.off();
                delete this;
            });
            
        },

        /*
         *
         */ 
        setData: function( data ){
            this.data = $.extend( data );
            this.render();
        },

        /*
         *
         */ 
        render: function(){            
            var boxesinfo = this.generateBoxesInfo();
            var wraper = jsrender.templates( bottomWraperTemplate ).render( this.data );           
            this.wraper.html( wraper ).show().find('.popup').show();   
            this.wraper.find('.boxes-info').html( boxesinfo );
            return this;
        },

        /*
         *
         */ 
        generateBoxesInfo: function(){
            var boxesinfo = '';
            var that = this;
            this.data.boxesRows = [];
            this.data.boxesBayNumber = [];
            // 构建箱子高度
            $.each( this.data.boxes, function(k, boxes){
                var boxesBays = [];
                $.each( boxes, function(j,t){
                    var bgcolor =  that.defaultTowerColors[t-1] ? that.defaultTowerColors[t-1].color : '#fff';
                    boxesBays.push({ 'tower': t, 'bgcolor':bgcolor});                    
                });
                that.data.boxesRows.push({'boxesBays': boxesBays});  
            })
            // 构建贝位数字
            $.each( this.data.boxes[0], function(j, box){                
                that.data.boxesBayNumber.push({'number': 2*j + 1});                
            })
            boxesinfo = jsrender.templates( boxesInfoTemplate ).render( this.data );
            return boxesinfo;
        }
    });

    return POPUP;
});