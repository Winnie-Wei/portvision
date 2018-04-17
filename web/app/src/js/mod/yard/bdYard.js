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
	
	
	YARD.prototype = $.extend(new McBase(), {
		/*
		 *  初始化，根据配置项
		 */
		init: function(cfg) {			
			this.map = cfg.map;
			//this.yardData = cfg.yardData;
			this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
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
        	this.Plygon && this.map.remove([this.Plygon]);
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
            var fillColor = this.isShowByThemodynamic ? this.themodynamicColor : this.functionColor;
            var points = [
                    new BMap.Point(this.vertices[0].x, this.vertices[0].y),
                    new BMap.Point(this.vertices[1].x, this.vertices[1].y),
                    new BMap.Point(this.vertices[2].x, this.vertices[2].y),
                    new BMap.Point(this.vertices[3].x, this.vertices[3].y)
                ];
            this.Polygon = new BMap.Polygon(points,{
                            strokeColor: "rgba(255,255,255,0)",
                            fillColor: fillColor,
                        });
            this.map.addOverlay(this.Polygon); 
            // 转成百度坐标
            
            // var convertor = new BMap.Convertor();
            // var that = this;
            // this.Polygon = new BMap.Polygon(points, {});
            // convertor.translate(points, 1, 5, function( data ) {
            //     if(data.status === 0) {
            //         for (var i = 0; i < data.points.length; i++) {
            //             that.Polygon = new BMap.Polygon(data.points,{
            //                 strokeColor: "rgba(255,255,255,0)",
            //                 // fillColor: "#E44C09",
            //                 fillColor: fillColor,
            //                // path: path,
            //                // zIndex: 51,
            //                // map: this.map
            //             });
            //             // this.Polygon.setLabel({
            //             //     content: this.isShowQuota && ( this.scaleLevel >= this.edgeScaleLevel ) ? this.sourceTeu /*textNum + '：' + *//*volumeText*/ : textNum
            //             // })
            //             that.map.addOverlay(that.Polygon); 
            //         }
            //     }
            // });
            this.Marker = new BMap.Marker({
                position: [(this.vertices[0].x + this.vertices[1].x) / 2, (this.vertices[0].y + this.vertices[2].y) / 2],
                content: this.isShowQuota && ( this.scaleLevel >= this.edgeScaleLevel ) ? this.sourceTeu /*textNum + '：' + *//*volumeText*/ : textNum,
                zIndex: 52,
                angle: -this.rotation / Math.PI * 180,
                offset: {x:0, y:-4},
                map: this.map,
            })
        	//this.Polygon.hide();
        
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