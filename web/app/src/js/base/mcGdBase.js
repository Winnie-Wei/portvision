/**
 * @module port/mcGdBase
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
        setMapId: function( mapId ){
            this._mapId = mapId;
        },

        /*
         *
         */
        setMapType: function( type ){
            this._type = type;
        },

        setEquipmentCode: function( code ){
            this._equipmentCode = code;
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
        }        
    }
    
    return MCBASE;
})