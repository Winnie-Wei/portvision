/**
 * @moudle prot/mod/Points/index 点
 */
define(function(require) {
    'use strict'

    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    var CircleShape = require('zrender/graphic/shape/Circle');
    // var PolylineShape = require('zrender/graphic/shape/Polyline');

    var Points = function(cfg) {
        if ( !(this instanceof Points) ) {
            return new Points().init(cfg);
        }
    };

    Points.prototype = $.extend(new McBase(), {

        
        init: function(cfg){
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.points =  cfg.points || [
                {'LONGITUDE': 122.03784065, 'LATITUDE': 29.890574775, 'NUM': 351}, 
                {'LONGITUDE': 122.03784065, 'LATITUDE': 29.890566775, 'NUM': 163},
                {'LONGITUDE': 122.04289565, 'LATITUDE': 29.914123775, 'NUM': 114},
                {'LONGITUDE': 122.04007665, 'LATITUDE': 29.889220775, 'NUM': 72}];           
            this.initX = cfg.initX || 0;
            this.initY = cfg.initY || 0;
            this.position = [ this.initX, this.initY ];
            this.deltaX = cfg.deltaX || -35;
            this.deltaY = cfg.deltaY || -84;
            this.radius = cfg.radius || 2;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || '#F9EFE5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#33AF19'; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;                   
            this.isShow = cfg.isShow === true ? true : false ;
            return this;
        },

        /*
         *
         */
        remove: function() {
            // this._remove();
            this._group && this._zr.remove(this._group);
            this.observer._overMap.pointsMap = null;
        },

        /*
         *
         */
        redrawByPosScale: function( args ) {
            this.drawX = this.initX + args.x;
            this.drawY = this.initY + args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;  
            this.draw();
        },

        /*
         *
         */
        draw: function() {          
            this.drawPoints();
        },

        /*
         *  绘制点
         */
        drawPoints: function(){
            var zr = this._zr,               
                scale = this.scaleRatio,
                fillColor = this.fillColor,
                // textColor = this.textColor,
                // strokeColor = this.strokeColor,
                parent = this;
            if( this.points.length === 0 ){
                return false;
            }
            if( this._group ){
                zr.remove(this._group);
            }; 
            this._group = new Group({
                position: [this.drawX * scale, this.drawY * scale ],
                scale: [scale, scale],
                rotation: 0
            }); 
            // var circle = new CircleShape({
            //     // position: [this.points[1].LONGITUDE, this.points[1].LATITUDE],
            //     position: [122.03784065, 29.890574775],
            //     style: {
            //         fill: fillColor,
            //         // fill: 'transparent',
            //         // stroke: strokeColor,
            //         lineWidth: 1,
            //         // opacity: 0.6,
            //         // text:labelTitle, // 绘制数值
            //         // textFill: textColor,
            //         // textPosition: that.textPosition,
            //         // textFont: 6 * scale + 'px Microsoft Yahei',
            //     },
            //     shape: {
            //         cx: 0,
            //         cy: 0,
            //         // r: 20
            //         r: 200

            //     },
            //     zlevel: this.zlevel,
            // });
            // parent._group.add(circle); 

            // var circle = new CircleShape({
            //     // position: [this.points[1].LONGITUDE, this.points[1].LATITUDE],
            //     position: [122.03784065, 29.890566775],
            //     style: {
            //         fill: fillColor,
            //         // fill: 'transparent',
            //         // stroke: strokeColor,
            //         lineWidth: 1,
            //         // opacity: 0.6,
            //         // text:labelTitle, // 绘制数值
            //         // textFill: textColor,
            //         // textPosition: that.textPosition,
            //         // textFont: 6 * scale + 'px Microsoft Yahei',
            //     },
            //     shape: {
            //         cx: 0,
            //         cy: 0,
            //         // r: 20
            //         r: 200

            //     },
            //     zlevel: this.zlevel,
            // });
            // parent._group.add(circle); 
            
            $.each( this.points, function(k, obj){
                if( !obj  ){
                    return false;
                }      
                $.each(obj, function(idx, item){
                    var circle = new CircleShape({
                        position: [item[0], item[1]],
                        style: {
                            fill: fillColor,
                            // fill: 'transparent',
                            // stroke: strokeColor,
                            lineWidth: 1
                            // opacity: 0.6,
                            // text:labelTitle, // 绘制数值
                            // textFill: textColor,
                            // textPosition: that.textPosition,
                            // textFont: 6 * scale + 'px Microsoft Yahei',
                        },
                        shape: {
                            cx: 0,
                            cy: 0,
                            // r: 200
                            r: parent.radius

                        },
                        zlevel: parent.zlevel
                    });
                    parent._group.add(circle); 
                })         
                              
            })            
              
            zr.add(parent._group);
            this.isShow ? this.show() : this.hide();
        }
    });

    return Points;
});