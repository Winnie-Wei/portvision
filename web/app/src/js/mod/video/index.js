/**
 * @module port/video/index 视频播放组件
 */
define(function (require) {
    'use strict';
    var VIDEO = function (cfg) {
        if (!(this instanceof VIDEO)) {
            return new VIDEO().init(cfg);
        }
    };



    VIDEO.prototype = {
        version: '0.0.1',
        /*
        *  初始化，设置画布元素
        */
        init: function (cfg) {
            this.canvasDom = cfg.canvasDom;
            this.viewHeight = cfg.viewHeight;
            this.viewWidth = cfg.viewWidth;
            this.videoDomList = ['video1', 'video2', 'video3'];
            this.videoSourceList = ['record1', 'record2', 'record3'];
            this.currentIndex = 0;
            //this.videoDom = this.videoDomList[this.currentIndex];
            this.videoSource = this.videoSourceList[this.currentIndex];
            this.timer && window.clearInterval(this.timer);
            //console.log( this.videoDom );
            this.initVideoMap();
            return this;
        },

        /*
         *  地图底图初始化,主控制器初始化,画布初始化
         */
        initVideoMap: function () {
            //var videoDom1 = '<video id="video1" controls  width=" '+ this.viewWidth +'" height="'+ this.viewHeight +'" style="width:100%;' + this.viewHeight + ';display:none;" autoplay ><source src="src/vedio/record.mp4" type="video/mp4"></video>';
            //var videoDom2 = '<video id="video2" controls  width=" '+ this.viewWidth +'" height="'+ this.viewHeight +'" style="width:100%;' + this.viewHeight + ';display:none;" autoplay ><source src="src/vedio/test.mp4" type="video/mp4"></video>';
            //var videoDom3 = '<video id="video3" controls  width=" '+ this.viewWidth +'" height="'+ this.viewHeight +'" style="width:100%;' + this.viewHeight + ';display:none;" autoplay ><source src="src/vedio/diseny.mp4" type="video/mp4"></video>';
            var videoDom1 = '<video id="video1" controls  width=" ' + this.viewWidth + '" height="' + this.viewHeight + '" style="width:100%;' + this.viewHeight + ';display:none;" ><source src="src/vedio/' + this.videoSource + '.mp4" type="video/mp4"></video>';
            var videoCanvas = '<div id="videoCanvas" class="bg-blue canvas-div" style="width:100%;height:' + this.viewHeight + 'px;"><canvas id="myCanvas"  width="' + this.viewWidth + '"  height="' + this.viewHeight + '" style="width:100%;height:100%;"></canvas></div>'
            //this.canvasDom.html('').append( videoDom1 + videoDom2 + videoDom3 + videoCanvas );
            this.canvasDom.html('').append(videoDom1 + videoCanvas);
            this.convertVideoToCanvas();

            /* window.setTimeout( function(){

                  that.pause();
             }, 1500)

             window.setTimeout( function(){

                  that.start();
             }, 3000)

             window.setTimeout( function(){

                  that.pause();
             }, 5500)

             window.setTimeout( function(){

                  that.restart();
             }, 7500)*/
        },
        /*
         *  将视频绘制到画布上
         */
        convertVideoToCanvas: function () {

            this.video = null;
            this.video = document.getElementById('video1');
            this.canvas = document.getElementById('myCanvas');
            this.ctx = this.canvas.getContext('2d');
            var that = this;
            this.timer && window.clearInterval(this.timer);
            this.video.addEventListener('play', function () {
                //timer = window.setInterval(function() {ctx.drawImage(v,0,0,1366,627,0,0,1366,627)},20);
                this.timer = window.setInterval(function () { that.ctx.drawImage(that.video, 0, 0, that.viewWidth, that.viewHeight) }, 20);
            }, false);
            this.video.addEventListener('pause', function () {
                window.clearInterval(that.timer);
            }, false);
            this.video.addEventListener('ended', function () {
                clearInterval(that.timer);
            }, false);

        },

        /*
         *  视频开始播放
         */
        start: function () {
            this.video && this.video.play();
        },
        /*
         *  视频暂停
         */
        pause: function () {
            this.video && this.video.pause();

        },
        /*
         *  视频从头开始播放
         */
        restart: function () {
            //this.video.load();
            this.videoSource = this.videoSourceList[this.currentIndex];
            this.video.innerHTML = '';
            this.video.innerHTML = '<source src="src/vedio/' + this.videoSource + '.mp4" type="video/mp4">';
            this.video.load();
            this.video.play();

        },
        /**
         * desc： 改变播放的video
         * @param flag: {Boolean} 工班是否改变， 超过8小时视为改变
         * @param date: {date} 改变后的时间
         */
        switchVideo: function (flag, date) {
            //console.log('工班改变了, 换下一个视频吧。');
            this.currentIndex = (this.currentIndex + 1) % 3;
            //this.videoDom = this.videoDomList[this.currentIndex];
            //console.log( this.currentIndex );
            //this.convertVideoToCanvas();
            this.videoSource = this.videoSourceList[this.currentIndex];
            this.video.innerHTML = '';
            this.video.innerHTML = '<source src="src/vedio/' + this.videoSource + '.mp4" type="video/mp4">';
            this.video.load();
            this.video.play();
        },
        /**
         * desc: 改变视频播放的时间
         * @param time: 当前时间 {Date}
         */
        switchTime: function () {
            //console.log('当前的播放时间为:' + time);
        },
        /*switchToAVideo:function(){
            //console.log('工班改变了, 换下一个视频吧。');
            this.currentIndex = ( this.currentIndex + 1 ) % 3;
            this.videoSource = this.videoSourceList[this.currentIndex];
            this.video.innerHTML = '';
            this.video.innerHTML = '<source src="src/vedio/' + this.videoSource + '.mp4" type="video/mp4">';
            this.video.load();
            this.video.play();
        },*/
        /*switchToTheVideo:function( time ){
            //console.log('工班改变了, 换下一个视频吧。');
            switch( time ){
                case 'morning': this.currentIndex = 0; break;
                case 'noon': this.currentIndex = 1; break;
                case 'night': this.currentIndex = 2; break;
                default: this.currentIndex = 0;
            }
            this.videoSource = this.videoSourceList[this.currentIndex];
            this.video.innerHTML = '';
            this.video.innerHTML = '<source src="src/vedio/' + this.videoSource + '.mp4" type="video/mp4">';
            this.video.load();
            this.video.play();
        },*/
        /**
         * desc： 播放单个设备的video
         *
         */
        playTheSingleVideo: function () {
            this.pause();
            this.video.innerHTML = '';
            this.video.innerHTML = '<source src="src/vedio/record.mp4" type="video/mp4">';
            this.video.load();
            this.video.play();
        }
    };
    return VIDEO;
});