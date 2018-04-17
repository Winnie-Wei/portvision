/**
 * @module port/gdYard
 */
define(function(require) {
	'use strict';
	var McBase = require('base/mcGdBase');
	

	var YARD = function(cfg) {
		if (!(this instanceof YARD)) {
			return new YARD().init(cfg);
		}
	};
	
	/*
     *  坐标线性转换
     */
    function change(lng, lat){
    	return { "lng" : lng + 0.0044,
    			 "lat" : lat - 0.0019
    			 };
    }

	YARD.prototype = $.extend(new McBase(), {
		/*
		 *  初始化，根据配置项
		 */
		init: function(cfg) {			
			this.amap = cfg.map;
			//this.yardData = cfg.yardData;
			this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.cursor = cfg.cursor || '';
            this.vertices = cfg.vertices || [{x:0,y:0},{x:1,y:1},{x:1, y: 0},{x:1,y:1}];
            var relateX = this.vertices[1].x - this.vertices[0].x ;
            var relateY =  this.vertices[1].y - this.vertices[0].y ;
            this.rotation = Math.atan2( relateY , relateX )  ; // 弧度
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.identity = cfg.identity; // 每个堆场的唯一标识
            this.number = cfg.number; // 堆场的地址信息
            this.yardId = cfg.yardId;
            this.yardName = cfg.yardName;
            this.yardCode = cfg.yardCode;
            this.imagePoint = {
                x: 96,
                y: 8,
            };
            this.jobLine = cfg.jobLine || [];
            this.startPoint = {x: (this.vertices[0].x + this.vertices[2].x)/2, y: (this.vertices[0].y + this.vertices[2].y)/2}
            this.endPoints = {
                'LOAD': {x: 662, y: 210},
                'DSCH': {x: 870, y: 280},
                'DLVR': {x: 496, y: 491},
                'RECV': {x: 514, y: 488}
            };
            this.teu = cfg.teu || 0; // 堆存量
            this.sourceTeu = cfg.sourceTeu && ( cfg.sourceTeu <= 0 ?  0 : cfg.sourceTeu.toFixed(1) ); // 堆存量            
            /*if( Math.abs( this.sourceTeu - this.teu ) >= 0.1 ){
            	this.showChangeAnimation( this.teu - this.sourceTeu );
            } */           
            this.capability = cfg.capability || 0;  // 堆存能力
            this.volumeText = this.teu + '/' + this.capability;
            this.storageRatio = parseInt( this.teu / this.capability * 10 );
            this.isShowQuota = cfg.isShowQuota === true ? true : false ;
            this.isShowByThemodynamic = cfg.isShowByThemodynamic === true ? true : false ;
            this.isShowJobLine = cfg.isShowJobLine === true ? true : false;
            this.functiontype = cfg.functiontype || 'DEFALUT';
            //this.themodynamicColors = ['#eda0f0','#dd96ea','#8765cd','#c880dd','#b176d7','#9f6ed2','#8765cd','#835ec8','#6a52c3','#5045be'];
            this.themodynamicColors = ['#ffcccc','#ffb8b8','#ffa2a2','#ff9090','#ff7777','#f46666','#e55656','#d94a4a','#ce3d3d','#c33333'];
            //this.themodynamicColors = ['#e9e081','#e9d981','#e9cf81','#e9c581','#e9bc81','#e9b481','#e1aa74','#ef955f','#ea864a','#e77936'];
            this.themodynamicColors = ['#e5e5e5','#d9d9d9','#cccccc','#bfbfbf','#b3b3b3','#a6a6a6','#999999','#8c8c8c','#808080','#737373'];
            this.functionColors = {
                DANGEROUS: '#ffb8b8',
                SPECIAL: '#ddadff',
                ES: '#90ff95',
                RTG: '#94ddff',
                DEFALUT: '#ccc',
            };
            this.textColors = {
                //DANGEROUS: '#d1415c',
                DANGEROUS: '#697986',
                SPECIAL: '#697986',
                ES: '#697986',
                //RTG: '#fff',
                RTG: '#697986',
                DEFALUT: '#697986',
            };
            this.lineColors = {
                LOAD: '#6587FF',// 装船
                DLVR: '#38D016',// 提箱
                DSCH: '#F58F00',// 卸船
                RECV: '#F36067',// 进箱
            }
            this.themodynamicColor = this.themodynamicColors[this.storageRatio];
            this.functionColor = this.functionColors[this.functiontype];
            this.totalBayNum = cfg.totalBayNum || 85;
            this.jobBoxBayNum = cfg.jobBoxBayNum || 31;
            this.nextBoxBayNum = cfg.nextBoxBayNum || 31;
			this.draw();
			return this;
		},
		/*
         * 更新
         */
        update:function(cfg){
            this.bubble = cfg.bubble || this.bubble;
        	this.jobLine = cfg.jobLine || this.jobLine;
        	this.teu = cfg.teu || this.teu; // 堆存量
            this.sourceTeu = cfg.sourceTe && ( cfg.sourceTeu <= 0 ?  0 : cfg.sourceTeu.toFixed(1) ) || this.sourceTeu; // 堆存量
            
            /*if( Math.abs( this.sourceTeu - this.teu ) >= 0.1 ){
            	this.showChangeAnimation( this.teu - this.sourceTeu );
            }*/
            
            this.capability = cfg.capability || this.capability;  // 堆存能力
            this.volumeText = this.teu + '/' + this.capability;
            this.storageRatio = parseInt( this.teu / this.capability * 10 );
            this.isShowQuota = cfg.isShowQuota === true ? true : this.isShowQuota ;
            this.isShowByThemodynamic = cfg.isShowByThemodynamic === true ? true : this.isShowByThemodynamic ;
            this.isShowJobLine = cfg.isShowJobLine === true ? true : this.isShowJobLine;
            this.totalBayNum = cfg.totalBayNum || this.totalBayNum;
            this.jobBoxBayNum = cfg.jobBoxBayNum || this.jobBoxBayNum;
            this.nextBoxBayNum = cfg.nextBoxBayNum || this.nextBoxBayNum;
        },     
		/*
         *  删除
         */
        remove:function(){        	
        	this.Plygon && this.amap.remove([this.Plygon]);
        },
       
        /*
         *  响应缩放
         */
        onZoomEnd:function( scaleLevel ){   
            this.scaleLevel = scaleLevel;
            this.draw();
            
            //console.log( this.marker)
        },
		/*
        *  绘制到地图
        */
        draw: function(){
        	var path = [],
                textNum = this.yardName + '',
                volumeText = this.volumeText,
                vertices = this.vertices,
                scale = this.scaleRatio,
                rotation = this.rotation ,
                self = this;   	
        	for(var i = 0;i < this.vertices.length; i++){        		
        		path.push([this.vertices[i].x, this.vertices[i].y]);
        	}
            if(this.Polygon || this.Marker){
                this.amap.remove([this.Polygon, this.Marker]);
            }
            var fillColor = this.isShowByThemodynamic ? this.themodynamicColor : this.functionColor;
        	this.Polygon = new AMap.Polygon({
        		strokeColor: "rgba(255,255,255,0)",
                // fillColor: "#E44C09",
                fillColor: fillColor,
                path: path,
                zIndex: 51,
                bubble: this.bubble,
                map: this.amap,
                cursor: this.cursor,
            })
            .on('dblclick', function(ev){
                self.observer.showPop('blockDetail', self);
                ev.cancelBubble = true;
            });
            // this.Polygon.setLabel({
            //     content: this.isShowQuota && ( this.scaleLevel >= this.edgeScaleLevel ) ? this.sourceTeu /*textNum + '：' + *//*volumeText*/ : textNum
            // })
            this.Marker = new AMap.Marker({
                position: [(this.vertices[0].x + this.vertices[1].x) / 2, (this.vertices[0].y + this.vertices[2].y) / 2],
                content: this.isShowQuota && ( this.scaleLevel >= this.edgeScaleLevel ) ? this.sourceTeu /*textNum + '：' + *//*volumeText*/ : textNum,
                zIndex: 53,
                angle: -this.rotation / Math.PI * 180,
                bubble: this.bubble,
                offset: {x:0, y:-8},
                cursor: this.cursor,
                map: this.amap,
            })
            // if(this.functiontype === 'SPECIAL' && this.yardName == '8X'){
            //     // console.log(vertices);
            //     this.Image = new AMap.ImageLayer({
            //         bounds: new AMap.Bounds(new AMap.LngLat(vertices[0].x, vertices[0].y), new AMap.LngLat(vertices[1].x, vertices[1].y)),
            //         url: '../../src/js/mod/yard/images/electricPile.png',
            //         map: this.amap,
            //         zIndex: 1000,
            //         opacity: 1,
            //         zooms: [-3, 22],
                    
            //     })
            // }

            var p0 = this.amap.lnglatTocontainer([vertices[0].x, vertices[0].y]);
            var p1 = this.amap.lnglatTocontainer([vertices[1].x, vertices[1].y]);
            var p2 = this.amap.lnglatTocontainer([vertices[2].x, vertices[2].y]);
            
            var width = (p1.getX() - p0.getX()) / Math.cos(this.rotation);
            var height = (p2.getY() - p1.getY()) / Math.cos(this.rotation);
            if(this.functiontype === 'SPECIAL'){
                if(this.Image){
                    this.amap.remove([this.Image]);
                }
                this.Image = new AMap.Marker({
                    icon: new AMap.Icon({
                        size: new AMap.Size(width, height),
                        image: '../../src/js/mod/yard/images/electricPile.png',
                        // imageSize: new AMap.Size(479/4, 53/4),
                        imageSize: new AMap.Size(width, height),
                        imageOffset: new AMap.Pixel(0, 0),
                    }), 
                    position: [this.vertices[0].x, this.vertices[0].y],
                    zIndex: 52,
                    angle: -this.rotation / Math.PI * 210,
                    bubble: this.bubble,
                    map: this.amap,
                    cursor: this.cursor,
                    offset: new AMap.Pixel(3, 0)
                }).on('dblclick', function(){
                    self.observer.showPop('blockDetail', self);
                    ev.cancelBubble = true;
                })
            }
        	// this.Polygon.hide();
        
        },
        /*
         *  显示
        */        
        show: function(){    	
        	this.Polygon.show();
        },
        /*
         *  隐藏
        */
        hide: function(){
        	this.Polygon.hide();
        },
	});
	
	return YARD;
})