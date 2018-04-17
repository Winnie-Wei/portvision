/**
 * @module port/mod/baseMap 地图底图
 */
define(function(require) {
    'use strict';
    var McBase = require('base/mcBase');
    var ZoomBtn = require('widget/zoomBtn/index');
    var ImageShape = require('zrender/graphic/Image');
    var Group = require('zrender/container/Group');
    var updateX = 35;
    var updateY = 90;
    //var updateX = 0;
    //var updateY = 0;

    var BASEMAP = function (cfg) {
    	if( !(this instanceof BASEMAP) ){
            return new BASEMAP().init(cfg);
        }
    };

    BASEMAP.prototype = $.extend( new McBase(), {

        /*
         *  
         */
        init: function(cfg){
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.viewWidth = cfg.viewWidth;
            this.viewHeight = cfg.viewHeight;
            this.mainDom = cfg.mainDom || 'main';
            //updateX = cfg.updateX || updateX;
            //updateY = cfg.updateY || updateY;
            this.initX = cfg.x || 0;
            this.initY = cfg.y || 0;
            this.drawX = this.initX;
            this.drawY = this.initY || 0;
            this.lastX = this.initX;
            this.lastY = this.initY || 0; 
            this.is25d = cfg.is25d ;
            
            this.origionWidth = cfg.origionWidth;
            this.initZoomRatio = cfg.zoomRatio || 1;
            this.showZoomRatio = this.initZoomRatio;
            this.maxZoomRatio = cfg.maxScaleLevel || 3;  // 总共3级，分别对应1，4，8
            this.minZoomRatio = cfg.minScaleLevel || 1;
            this.ratioStep = cfg.ratioStep || Math.sqrt(3); // 根号8
            this.initScale = cfg.initScale;            
            this.scaleLevel = cfg.scaleLevel || 1;
            this.showZoomRatio = this.scaleLevel;
            this.showScale = cfg.showScale;
            this.deltaX = 0;
            this.deltaY = 0;
            this.bindEvent();
            this.centerPoint = this.getCenterPoint();    
            ZoomBtn({
            	'observer' : this.observer,
            	'wraper': $('#J_mapZoomBar')
            });
            return this;
        },

        /*
         *
         */
        remove: function(){
            this._remove();
        }, 

        /*
         *
         */       
        draw: function(){
        	if(!this._zr) return false;
            var zr = this._zr,
                group = this._group,                
                observer = this.observer,
                scale = this.showScale,
                imageSrc  = this.is25d ? '../../src/images/perspective1.png' : '../../src/images/base_map.png', //迁移到portversion工程用这个
                imageSrc10  = '../../src/images/map_ningbo_10x.png'; //迁移到portversion工程用这个
            //console.log( this.is25d , imageSrc);
            var imagePath = imageSrc ; 
            /*var x = this.viewWidth / 1366;
            var y = this.viewHeight / 768;*/
            //var imageWidth = 1366 * x ; // 图片尺寸 1366 * 768
            //var imageHeight = 768 / 1366 * this.viewWidth;

            /*imagePath = scale < 4 ? imageSrc : imageSrc10; 
            imageWidth = scale < 4 ? 1366 * x : 13671 * x;
            imageHeight = scale < 4 ? 768 : 6810;*/  
            if( group ){
                group.removeAll();
                zr.remove(this._group);
            }; 

            group = this._group = new Group({
                position: [this.drawX * scale, this.drawY * scale],
                rotation: this.rotation ,
                scale: [ scale, scale ]
            }); 
            var imageMap = new ImageShape({
                position: [0, 0],                
                draggable: false, 
                style: {
                    x: 0,
                    y: 0,
                    image: imageSrc,
                    sx : 0,
                    sy : 0,                             
                    sWidth : 1920,
                    sHeight : 944,
                    width :  this.origionWidth , // 原始屏幕尺寸宽度 940
                    height : 944 *  this.origionWidth  / 1920
                }
            });
            
            group.add(imageMap);
            
            zr.add(group);             
            return this;
        },

        /*
         *
         */
        bindEvent: function(){
            // var that = this;               
            
            // 监听滚轮事件
        	/*$('#J_monitorMain').off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function(e) {      
        		 //console.log( e );
    		     var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
		            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));   // firefox	
		    	    if (delta > 0) {
		    	        // 向上滚    console.log("wheelup");
		    	        that.zoomIn();
		    	    } else if (delta < 0) {
		    	        // 向下滚 console.log("wheeldown");
		    	        that.zoomOut();
		    	    }
    		});*/
            

            /*var canvasContainer = document.getElementById(this.mainDom);
            canvasContainer.onmousedown = function(obj){                
                var pos = that.windowToCanvas(canvasContainer,obj.clientX,obj.clientY);
                canvasContainer.onmousemove = function(obj){                    
                    canvasContainer.style.cursor="move";
                    var pos1 = that.windowToCanvas( canvasContainer, obj.clientX, obj.clientY );
                    var x = pos1.x - pos.x;
                    var y = pos1.y - pos.y;
                    pos = pos1;
                    that.drawX += x;
                    that.drawY += y;
                    that.draw();
                    that.deltaX = that.drawX - that.initX;
                    that.deltaY = that.drawY - that.initY;
                    that.observer.fire('mapDragEnd', {x: that.deltaX, y: that.deltaY } );                    
                   
                }
                canvasContainer.onmouseup = function(ev){//放开鼠标按键时清空绑定事件
                   ;
                    canvasContainer.onmousemove=null;
                    canvasContainer.onmouseup=null;
                    canvasContainer.style.cursor="default";
                    that.deltaX = that.drawX - that.initX ;
                    that.deltaY = that.drawY - that.initY ;
                    that.draw();
                    that.observer.fire('mapDragEnd',{x: that.deltaX, y: that.deltaY });
                    
                    that.centerPoint = that.getCenterPoint();
                }
            }; */

          

        },
        
        //转换x、y顶点,getBoundingClientRect
        windowToCanvas: function (canvas,x,y){
            var bbox = canvas.getBoundingClientRect();
            var x = x - bbox.left - (bbox.width - canvas.clientWidth) / 2;
            var y = y - bbox.top - (bbox.height - canvas.clientHeight) / 2;
            return {'x':x,'y':y};
        },
        
        mapMove : function( x , y){
        	var that = this;
        	that.drawX = that.lastX + x;
            that.drawY = that.lastY + y;
            that.draw();
            that.deltaX = that.drawX - that.initX;
            that.deltaY = that.drawY - that.initY;
            that.observer.fire('mapDragEnd', {x: that.deltaX, y: that.deltaY } ); 
        },
        
        mapDragEnd : function( x , y){
        	var that = this;
        	that.drawX = that.lastX + x;
            that.drawY = that.lastY + y;
        	that.lastX = that.drawX;
            that.lastY = that.drawY;            
            that.draw();            
            that.deltaX = that.drawX - that.initX;
            that.deltaY = that.drawY - that.initY;
            that.observer.fire('mapDragEnd', {x: that.deltaX, y: that.deltaY } ); 
            that.getCenterPoint();
        },
        
        /*
         *  放大一级
         */
        zoomIn: function(){       
        	if(  this.showZoomRatio === this.maxZoomRatio ){
        		return false;
        	}
        	this.showZoomRatio = this.showZoomRatio < this.maxZoomRatio ? this.showZoomRatio + 1 : this.maxZoomRatio;
        	this.zoomChange();          
        },
        
        /*
         *  缩小一级
         */
        zoomOut: function(){
        	if(  this.showZoomRatio === this.minZoomRatio ){
        		return false;
        	}
        	this.showZoomRatio = this.showZoomRatio > this.minZoomRatio ? this.showZoomRatio - 1 : this.minZoomRatio;
        	this.zoomChange();
        	
        },
        /*
         *  改变放大级别
         */
        toggleBiGraphyPop: function(){  
        	if(this.showZoomRatio === this.minZoomRatio ){
        		this.observer && this.observer.showBiGraphyPop && this.observer.showBiGraphyPop(); 
        	}else{
        		this.observer && this.observer.hideBiGraphyPop && this.observer.hideBiGraphyPop(); 
        	}
        	       
        },

        /*
         *  改变放大级别
         */
        zoomChange: function( scale_level ){   
        	//var startTime =  new Date().valueOf();
        	this.showZoomRatio = Number(scale_level) || this.showZoomRatio;
        	this.toggleBiGraphyPop();
        	this.scaleLevel = this.showZoomRatio;
            this.showScale = this.initScale * Math.pow( this.ratioStep , ( this.showZoomRatio - 1 ) );
            //console.log( this.showScale );
            this.draw();
            this.observer.scaleLevel = this.scaleLevel;
            this.observer.fire('mapZoomChange', this.showScale);
            this.drawWithCenterPoint(this.centerPoint.x , this.centerPoint.y );    
            //console.log('zoom change end', new Date().valueOf() );
            /*var endTime =  new Date().valueOf();
            console.log('zoom change during', endTime - startTime );*/
        },
        
        setMapCenter: function( args ){
        	this.drawWithCenterPoint( args.x, args.y );
        },        
        /*
         * 根据中心点位置移动地图
         */
        drawWithCenterPoint: function(cx,cy){           
            var that = this;
            var width = this._zr.dom.clientWidth;
            var height = this._zr.dom.clientHeight;            
            that.drawX =  width / 2 / this.showScale - cx + updateX;
            that.drawY = height / 2 / this.showScale - cy + updateY;
            that.deltaX = that.drawX - that.initX ;
            that.deltaY = that.drawY - that.initY ;
            that.draw();      
            //console.log( cx, cy, that.deltaX, that.deltaY );
            that.observer.fire('mapDragEndByMapCenter',{x: that.deltaX, y: that.deltaY });           
            that.centerPoint = that.getCenterPoint();            
        },
        

        /*
         * 获取地图中心点位置,实际位置
         */
        getCenterPoint: function(){
        	if(!this._zr) return {};
            var point = {};            
            var width = this._zr.dom.clientWidth;
            var height = this._zr.dom.clientHeight;
            point.x = - this.drawX + width / 2 / this.showScale + updateX;
            point.y = - this.drawY + height / 2 / this.showScale + updateY;
            if( !this.centerPoint ){
            	this.centerPoint = {}
            }
            this.centerPoint.x = point.x; 
            this.centerPoint.y = point.y;
            return point;
        },
        
        /*
         *  开通鼠标取点功能
         */
        showGetPoint: function( ) {
            //console.log( 'show GetPointing' ); 
            $('#J_consolePanel').length && $('#J_consolePanel').show();
        }, 
         
        /*
         *  开通鼠标取点功能
 	    */
 	    hideGetPoint: function( ) {
 	    	//console.log( 'hide GetPointing' );  
 	    	$('#J_consolePanel').length && $('#J_consolePanel').html('').hide();
 	    }
    });
    return BASEMAP;
});