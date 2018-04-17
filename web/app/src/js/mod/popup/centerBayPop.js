/**
 * @module port/mod/popup/center 视图中央的详情弹框，箱子详情、设备详情(暂不做更新)
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库

    var bottomWraperTemplate = '<div class="popup fixed-center md">' +
        '<div class="pop-content ">' +
            '<div class="pop-header">' +
                '<p class="pop-title">{{>number}}堆场<span>（{{>total}}）</span></p>' +
                '<span class="pop-close j-close">关闭</span>' +
            '</div>'  +
            '<div class="pop-body">' +
                '<div class="boxes-info">' +
                '</div>' +
                '<div class="boxes-legend">' +
                    '<table><tbody>' +
                        '{{for towerColors}}' + 
                        '<tr class="tower">' +
                            '<td style="background:{{:color}}"></td>' +
                            '<td class="txt">{{:text}}</td>' +
                        '</tr>' +
                        '{{/for}}' +
                        '</tbody></table>' +
                '</div>' +
            '</div>' +
            '<div class="pop-footer">' +
                '<select><option>现在</option></select>' +
                '<select><option>箱主</option></select>' +
            '</div>'  + 
        '</div>' +
    '</div>';

    var boxesInfoTemplate = '<table><tbody>' +
            '{{for boxesRows}}' + 
            '<tr data-id="{{:#getIndex()+1}}">' +
                '<td class="row-number">{{:#getIndex()+1}}</td>' +
                '{{for boxesBays}}' + 
                '<td data-id="{{:#getIndex()+1}}" class="bay" style="background:{{:bgcolor}}" title="{{:tower}}"></td>' +
                '{{/for}}' +
            '</tr>' +
            '{{/for}}' +
            '<tr class="bay-number">' +
                '<td class="row-number"></td>' +
                '{{for boxesBayNumber}}' + 
                '<td class="bay txt">{{:number}}</td>' +
                '{{/for}}' +                
            '</tr> ' +
            '</tbody></table>' ;

   
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
            // TODO: 请求数据之后渲染

            this.wraper.html('');
            this.bindEvent();
            return this;
        },

        /*
         *
         */ 
        ajaxData: function(){
            //返回成功之后回调callBack
        },

        /*
         *
         */ 
        callBack: function(){

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

            this.wraper.on('click','.j-close',function(ev){
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
        },
    });

    return POPUP;
});