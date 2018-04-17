/**
 * @module port/mcBase
 */
define(function() {
    'use strict';
    var MCBASE = function () {
        this.version = '0.0.1';
        // this.maxShowScale = 2; 
        this.edgeScaleLevel = 2; // 显示边缘级别
        this.scaleLevel = 1;
        this.maxScaleLevel = 3; // 最大显示层级
    };
    MCBASE.prototype = {

        /*
         *
         */
        _getZrender : function( ){
            return this._zr;
        },

        /*
         *
         */
        _getGroup : function(){
            return this._group;
        },

        /*
         *
         */
        _remove: function(){
            if( !this._group ){
                return false;
            }
            this._group.removeAll();
            delete this._group;
        },
        /*
         * 隐藏
         */
        hide: function() {
            if( !this._group ){
                return false;
            }
            // $.each(this._group.hide())
            this.isShow = false;
            this._group.hide();
        },

        /*
         * 显示
         */
        show: function() {
            if( !this._group ){
                return false;
            }
            this.isShow = true;
            this._group.show(); 
            //this.moveTo( this.targetX, this.targetY, 1000);
        },

        /*
         *
         */
        setMapId: function( mapId ){
            this._mapId = mapId;
        },

        /*
         *
         */
        setMapType: function( type ){
            this._type = type;
        },

        /*
         *
         */
        setEquipmentCode:function( code ){
            this._equipmentCode = code;
        },
        /*
         * 移动平滑动画
         */
        moveTo: function( targetX, targetY, duration, isNotFiltering ){
            var that = this;
            // 输入校验
            if( !this._group ){
                return false;
            }
            var _duration = duration || 3000,
                _targetX = targetX /*+ this.offset.x*/ || 0,
                _targetY = targetY /*+ this.offset.y*/ || 0;
           
            var _sourceX = this.sourceX || this.initX;
            var _sourceY = this.sourceY || this.initY;
            
            // if(  Math.abs( _sourceX - _targetX) > 30 || Math.abs( _sourceY - _targetY) > 30  ){
            // 	//console.log(  _sourceX, _targetX,  _sourceY, _targetY );
            // 	return false;
            // }  
            this._group.animate('', false)
                .when(0, {
                    position: [_sourceX * this.scaleRatio, _sourceY * this.scaleRatio]
                })
                .when(_duration, {
                    position: [_targetX * this.scaleRatio, _targetY * this.scaleRatio]
                })
                .done(function(){
                    if(!that.observer._playSpeed && that.targetXY.length === 1)  return;
                    that.sourceX = targetX;
                    that.sourceY = targetY;
                    that.count += 1;
                    that.moveToFast(duration, isNotFiltering);
                })
                // .start('BounceOut');
                .start();
        },
        /*
         * 移动到目标点
         */
        moveToTarget:function( during, isNotFiltering ){
            var time = during || 3000;
            // var targetX, targetY;
            this.stopAnimation();
            this.count = 0;
            if(!this.observer._playSpeed || this.targetXY.length === 1) {
                this.targetX = this.targetX || this.initX;
                this.targetY = this.targetY || this.initY;
                this.moveTo( this.targetX, this.targetY, time , isNotFiltering);
            } else {
                /*for(var i = 0; i < this.targetXY.length; i++){
                    targetX = this.targetXY[i].x + this.deltaX;
                    targetY = this.targetXY[i].y + this.deltaY;
                    var rotation = Math.atan2(targetX - this.sourceX, targetY - this.sourceY) - 1.5;
                    if (targetY == this.sourceX && targetY == this.sourceY) {
                        rotation = this.rotation;
                    }
                    if (rotation == -1.5) {
                        rotation = -1.05 * Math.PI;
                    }
                    this.rotation = rotation;
                    this.draw();
                    this.moveTo( targetX, targetY, time, isNotFiltering);
                    this.sourceX = targetX;
                    this.sourceY = targetY;
                }*/
                this.moveToFast(time, isNotFiltering);
            }
        },
        moveToFast: function(time, isNotFiltering){
            var i = this.count;
            if(i >= this.targetXY.length)   return;
            var targetX = this.targetXY[i].x + this.deltaX;
            var targetY = this.targetXY[i].y + this.deltaY;
            if(this._type === 'container') {
                var rotation = Math.atan2(targetX - this.sourceX, targetY - this.sourceY) - 1.5;
                if (targetY === this.sourceX && targetY === this.sourceY) {
                    rotation = this.rotation;
                }
                if (rotation === -1.5) {
                    rotation = -1.05 * Math.PI;
                }
                this.rotation = rotation;
            }
            this.drawX = this.sourceX;
            this.drawY = this.sourceY;
            this.draw();
            this.moveTo( targetX, targetY, time, isNotFiltering);
        },
        /*
         * 停止动画
         */
        stopAnimation:function(){
            // this._group.animate('', false).stop();
            this._group.stopAnimation(true);
        },

        startAnimation: function(){
            this._group.animate('', false).start();
        },
        /*
         *  清除选中
         */
        setSelectedProp: function(isSelected) {
            //console.log( isSelected );
            this.isSelected = isSelected;
            if (isSelected) {
                this.showHighLight && this.showHighLight();
            } else {
                this.hideHighLight && this.hideHighLight();
            }
            return this;
        },
        /*
         * @ 显示设备作业状态
         * 
         */
        showDeviceJobType: function() {
            this.isShowDeviceJobType = true;
            // this.themodynamicColor = this.themodynamicColors[this.storageRatio];
            // this.draw();
        },
        /*
         * @ 隐藏设备作业状态
         * 
         */
        hideDeviceJobType: function() {
            this.isShowDeviceJobType = false;
            // this.themodynamicColor = this.themodynamicColors[this.storageRatio];
            // this.draw();
        }
    };
    return MCBASE;
});