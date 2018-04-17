/**
 * module mod/directionAnimate/directionAnimate 作业方向动画
 */
define(function(require) {
    'use strict'    

    var ImageShape = require('zrender/graphic/Image');
    var DIRECTIONANIMATE = function( cfg ) {
        this.zlevel = cfg.zlevel;
        this.rotation = cfg.rotation || 0;
        this.scale = cfg.scale || 1;
        this.imageUrl = cfg.imageUrl;
        this.x = cfg.x || 0;
        this.y = cfg.y || 0;
        this.width = cfg.width;
        this.height = cfg.height;
        this.sWidth = cfg.sWidth;
        this.sHeight = cfg.sHeight;
        this.sx = cfg.sx || 0;
        this.sy = cfg.sy || 0;
        this.during = cfg.during || 500;
        this.csy = cfg.csy || 6;
        var that = this;
        
        var loadingUploadImg = new ImageShape({
            rotation: that.rotation,
            style: {
                type: 'trans',
                image: that.imageUrl,
                x: that.x,
                y: that.y,
                width: that.width,
                height: that.height,
                sWidth: that.sWidth,
                sHeight: that.sHeight,
                sx: that.sx,
                sy: that.sy
            },
            zlevel: that.zlevel + 1
        });
        loadingUploadImg.animate('style', true)
            .when(that.during, {
                sy: that.csy
            })
            .start();
        return loadingUploadImg;
    }

    

    return DIRECTIONANIMATE;
});