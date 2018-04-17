/**
 * @moudle port/mod/recordPopLayer 回放弹框层
 */
define(function(require) {
	'use strict'
	var McBase = require('base/mcBase');
	var RecordBarPop = require('mod/recordBarPop/recordBarPop');
    var RecordPlayerPop = require('mod/recordPlayerPop/recordPlayerPop');

    var RECORDPOPLAYER = function(cfg) {
    	if ( !(this instanceof RECORDPOPLAYER) ) {
    		return new RECORDPOPLAYER().init(cfg);
    	}
    }
    RECORDPOPLAYER.prototype = $.extend(new McBase, {
    	init: function( cfg ) {
    		this._zr = cfg.zr;
    		this._observer = cfg.observer;
    		this.initScale = cfg.initScale || 1;
    		this.showScale = cfg.initScale;
    		this._currentPop = undefined;
    		this.initPops();
    		return this;  
    	},
    	initPops: function() {
    		// 回放筛选弹框
            if ( !this._filterPop ) {
                this._filterPop = RecordBarPop({
                    'zr':this._zr,
                    'observer': this._observer,
                    'showScale': this.showScale,
                    'initScale': this.initScale,
                });
                this._filterPop.render();
            };
            // 回放播放器弹框
            if ( !this._playerPop ) {
                this._playerPop = RecordPlayerPop({
                    'zr':this._zr,
                    'observer': this._observer,
                    'showScale': this.showScale,
                    'initScale': this.initScale,
                });
                this._playerPop.render();
            };
    	}
    });

    return RECORDPOPLAYER;
});