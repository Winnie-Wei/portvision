// 暂无调用
/**
 * @module port/mod/popup/center 视图中央的详情弹框 箱子、设备详情等 
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库
    var testDetailData = {
        'type':'container',
        'topInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
        'middleInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
        'bottomInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
    };

    var centerWraperTemplate = '<div class="popup fixed-center md">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                   + '<p class="pop-title text-left">{{>type}}详情</p>'
                   + '<span class="pop-close j-close">关闭</span>'
                + '</div>'
                + '<div class="pop-body">'            

                + '</div>'
                + '<div class="pop-footer">'
                + '</div>'
            + '</div>'
        + '</div>'; 

    var popContentTemplate = '<div class="equ-detail">'
            + '<div class="info-top clearfix">'
                + '<div class="inline-left ">'
                    + '<img src="../../src/css/mod/popup/images/icon-box.png" alt="" />'
                + '</div>'
                + '<div class="inline-right">'
                    + '{{for topInfo}}'
                    + '<p>{{:name}}：{{:text}}</p>'
                    + '{{/for}}'
                + '</div>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    // <li>是否重箱：是</li>
                    + '{{for middleInfo}}'
                    + '<li>{{:name}}：{{:text}}</li>'
                    + '{{/for}}'                    
                + '</ul>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    //<li>是否重箱：是</li>
                    + '{{for bottomInfo}}'
                    + '<li>{{:name}}：{{:text}}</li>'
                    + '{{/for}}'
                + '</ul>'
            + '</div>'
        + '</div>';     

   
    var CENTERDETAILPOPUP = function (cfg) {
        if( !(this instanceof CENTERDETAILPOPUP) ){
            return new CENTERDETAILPOPUP().init(cfg);
        }
    };

    CENTERDETAILPOPUP.prototype = $.extend( new McBase(), {

        /*
         *
         */ 
        init: function(cfg){
            this.data = cfg.data || null;
            this.elementId = cfg.elementId || 0;
            this.observer = cfg.observer || null;
            this.wraper = $( this.elementId );
            this.wraper.html('');
            // TODO: 请求数据之后渲染
            this.bindEvent();
            
            //this.render();
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
            
            this.wraper.on('click','.j-close',function(ev){
                console.log('close');
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
        generateEqupInfo: function(){
            var info = '';
            var that = this;            
            info = jsrender.templates( popContentTemplate ).render( this.data );
            return info;
        },

        /*
         *
         */ 
        render: function(){     
            if( !this.data ){
                this.data = _.defaults( testDetailData );
            }   
            var equpinfo = this.generateEqupInfo();
            var wraper = jsrender.templates( centerWraperTemplate ).render( this.data );  
            this.wraper.html( wraper ).show().find('.popup').show();  
            this.wraper.find('.pop-body').html( equpinfo );
            return this;
        },
        
    });

    return CENTERDETAILPOPUP;
});