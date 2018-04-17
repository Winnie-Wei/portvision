/**
 * @moudle prot/mod/track/track 轨道
 */
define(function(require) {
    'use strict'

    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    // var Text = require('zrender/graphic/Text');
    // var CircleShape = require('zrender/graphic/shape/Circle');
    var PolylineShape = require('zrender/graphic/shape/Polyline');

    var TRACK = function(cfg) {
        if ( !(this instanceof TRACK) ) {
            return new TRACK().init(cfg);
        }
    };

    TRACK.prototype = $.extend(new McBase(), {

        
        init: function(cfg){
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || false;
            this.points = cfg.points ||  [[[300,400],[300,430],[350,460],[380,490]],[[400,410],[410,503],[435,506],[450,540]]];           
            this.initX = cfg.initX || 0;
            this.initY = cfg.initY || 0;
            this.position = [ this.initX, this.initY ];
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || '#f9efe5'; // 底色
            this.textColor = cfg.textColor || '#6f8793'; // 文字颜色
            this.strokeColor = cfg.strokeColor || '#ccc'; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;                   
            this.isShow = cfg.isShow === true ? true : false ;
            return this;
        },

        update: function(cfg){
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.bubble = cfg.bubble || this.bubble;
            this.points = cfg.points ||  this.points;           
            this.initX = cfg.initX || this.initX;
            this.initY = cfg.initY || this.initY;
            this.position = [ this.initX, this.initY ];
            this.deltaX = cfg.deltaX || this.deltaX;
            this.deltaY = cfg.deltaY || this.deltaY;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            this.fillColor = cfg.fillColor || this.fillColor; // 底色
            this.textColor = cfg.textColor || this.textColor; // 文字颜色
            this.strokeColor = cfg.strokeColor || this.strokeColor; // 边框颜色
            this.scaleRatio = cfg.scaleRatio || this.scaleRatio;
            this.scaleLevel = cfg.scaleLevel || this.scaleLevel;                   
            this.isShow = cfg.isShow === undefined ? this.isShow : cfg.isShow ;
        },

        /*
         *
         */
        remove: function() {
            // this._remove();
            this._zr.remove(this._group);
            this.observer._overMap.TRACKMap = null;
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
            this.drawTrack();
        },

        /*
         *  绘制轨道
         */
        drawTrack: function(){
            var zr = this._zr,               
                scale = this.scaleRatio,
                // fillColor = this.fillColor,
                // textColor = this.textColor,
                strokeColor = this.strokeColor,
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

            var points = [];
            $.each(this.points, function(l, n){
                var arr = [];
                arr.push(n.x);
                arr.push(n.y);
                points.push(arr);
            })
            

            var polyline = new PolylineShape({
                style: {
                    smooth: 'bezier',
                    stroke: strokeColor,
                    lineWidth: 2
                },
                shape: {
                    points: points
                },
                zlevel: parent.zlevel
            });
            parent._group.add(polyline);                
        
              
            zr.add(parent._group);
            this.isShow ? this.show() : this.hide();
        }
    });

    return TRACK;
});