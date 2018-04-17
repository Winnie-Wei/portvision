/**
 * module mod/progressBar/progressBar 进度条
 */
define(function (require) {
    'use strict'
    var Group = require('zrender/container/Group');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var RectShape = require('zrender/graphic/shape/Rect');
    var PROGRESSBAR = function (cfg) {
        /* 进度条 start */
        
        this.zlevel = cfg.zlevel;
        this.efficiency = parseFloat(cfg.efficiency) < 0 ? 0 : parseFloat(cfg.efficiency);
        this.target = cfg.target;
        this.rotation = cfg.rotation || 0;
        this.scale = cfg.scale || 1;
        this.width = cfg.width || 18;
        this.height = cfg.height || 4;
        this.position = cfg.position || [-this.width / 2, -this.height * 3];
        
        var progressGroup = new Group({
            position: this.position,
            scale: [this.scale, this.scale],
            width: this.width,
            height: this.height,
            rotation: this.rotation
        })

        var totalProgress = new RectShape({
            style: {
                fill: '#2d91ee',
                stroke: '#2d91ee',
                lineWidth: 0.6,
                opacity: 0.3
            },
            shape: {
                width: this.width,
                height: this.height,
                r: this.height / 2
            },
            zlevel: this.zlevel + 1
        });
        var currentwidth = this.efficiency / this.target * this.width * 0.8;
        (this.efficiency > this.target) && (currentwidth = this.width);
        var currentProgress = new RectShape({
            style: {
                fill: '#2d91ee'
            },
            shape: {
                width: currentwidth,
                height: this.height,
                r: this.height / 2
            },
            zlevel: this.zlevel + 1
        });
        var targetProgress = new CircleShape({
            position: [this.width * 0.8, this.height / 2],
            shape: {
                cx: 0,
                cy: 0,
                r: this.height / 2 - 1
            },
            style: {
                fill: '#FFF'
            },
            zlevel: this.zlevel + 1
        });
        progressGroup.add(totalProgress);
        progressGroup.add(currentProgress);
        progressGroup.add(targetProgress);
        return progressGroup;
    }
    
    return PROGRESSBAR;
});