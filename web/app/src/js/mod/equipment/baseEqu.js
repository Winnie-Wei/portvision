define(function(require) {
    'use strict';
    var McBase = require('base/mcGdBase');
    

    var EQU = function(cfg) {
        if (!(this instanceof EQU)) {
            return new EQU().init(cfg);
        }
    };
    

    EQU.prototype = $.extend(new McBase(), {
        /*
         *  初始化，根据配置项
         */
        init: function() {	
            return this;
        }
    });
        
    return EQU
})