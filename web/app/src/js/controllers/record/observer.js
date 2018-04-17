/**
 * @module port/controllers/record/recordObserver 回放控制器
 */
define(function(require) {
    'use strict';

    /**
     * 功能点梳理
     * 1. 接收用户选择的 日期(date) 和 播放速度 (speed)
     * 2. 接收用户选择的 具体设备及操作 和 可选的时间
     * 3. 请求相应的数据
     * 4. 处理数据
     * 5. 添加相应设备 和 动作到地图上
     * 6. 后续操作
     */

    var BaseObserver = require('base/mcObserver');
    var BaseMap = require('layer/baseMap');
    var OverMap = require('layer/overMap');
    var PopLayer = require('layer/mapPop');
    var Attachment = require('layer/monitorPop/attachment');
    var RecordPop = require('controllers/record/recordPop');
    //var RecordBarPop = require('mod/recordBarPop/recordBarPop');
    //var RecordPlayerPop = require('mod/recordPlayerPop/recordPlayerPop');



    var MCOBSERVER = function(cfg) {
        if (!(this instanceof MCOBSERVER)) {
            return new MCOBSERVER().init(cfg);
        }
    };

    MCOBSERVER.prototype = $.extend(new BaseObserver(), {
        _currentDate: new Date,
        _period: '', // 工班， 早中晚
        _howManyTimes: 0, // 标记位，由于初始化的时候暂停，让后面播放操作暂停时候据此判断立即暂停
        _playSpeed: 1,
        _requestInterval: 3,
        _isPause: true,
        _$timeFlag: '', // 定时器控制器
        _isVideo: false,
        _videoObj: '', // 存放video对象
        _$timeChangeCallback: [],
        _$periodChangeCallback: [],
        searchCode: '',
        searchEqType: '',
        searchJobType: ['LOAD', 'DSCH', 'RECV', 'DLVR'],
        filterObj: {
            'LOAD': 1,
            'DSCH': 1,
            'RECV': 1,
            'DLVR': 1,
            'container': 1,
            'gantrycrane': 1,
            'emptyContainer': 1,
            'reachstacker': 1,
            'bridgecrane': 1
        },


        /*
         * 初始化
         */
        init: function(cfg) {
            this._zr = cfg.zr;
            this._playSpeed = 1;
            this.origionWidth = 940;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.showScale = (this.viewWidth / this.origionWidth);
            this.scaleLevel = 1;
            this.count = 0;
            this.mainDom = cfg.mainDom || 'main';
            if (!this._recordPop) {
                this._recordPop = RecordPop({
                    'zr': this._zr,
                    'observer': this,
                    'initScale': this.showScale,
                    'showScale': this.showScale
                })
            }
            if (!this._baseMap) {
                this._baseMap = BaseMap({
                    /*'zr':this._zr,
                    'observer': this,
                    'viewWidth': this.viewWidth,
                    'viewHeight': this.viewHeight,
                    'initScale': this.showScale,
                    'mainDom': this.mainDom,
                    'origionWidth':this.origionWidth,*/

                    'zr': this._zr,
                    'observer': this,
                    'viewWidth': this.viewWidth,
                    'viewHeight': this.viewHeight,
                    'initScale': this.showScale,
                    'showScale': this.showScale,
                    'scaleLevel': this.scaleLevel,
                    'maxScaleLevel': cfg.maxScaleLevel,
                    'minScaleLevel': cfg.minScaleLevel,
                    'ratioStep': this.ratioStep,
                    'mainDom': this.mainDom,
                    'origionWidth': this.origionWidth,
                    'initX': cfg.initX || -35,
                    'initY': cfg.initY || -84,
                    'is25d': cfg.is25d

                });
                this._baseMap.draw();
            };

            if (!this._overMap) {
                this._overMap = OverMap({
                    'zr': this._zr,
                    'observer': this,
                    'showScale': this.showScale,
                    'initX': -35,
                    'initY': -84
                });
            };

            if (!this._popLayer) {
                this._popLayer = PopLayer({
                    'zr': this._zr,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            if (!this._attachment) {
                this._attachment = Attachment({
                    'zr': this._zr,
                    'observer': this,
                    'scale': this.showScale
                });
            };
            this.bindEvent();
            return this;
        },
        /**
         * desc: 显示监控场区
         */
        showMonitorMap: function() {
            this.startPlayback();
            // this._reloadData_();
            this._attachment.showFunctiontypeLegend();
            //this._overMap.showYardByFunctiontype();
        },


        /**
         * desc: 设置当前回放动画的播放速度
         * @param speed: {Number}
         */
        setSpeed: function(speed) {
            this._playSpeed = speed;
        },

        /**
         * desc: 设置时间
         * @param date: 时刻  {Date}
         */
        setDate: function(date) {

            date = _.isDate(date) ? date : new Date(date);
            var lastDate = this._currentDate;
            var flag = (lastDate.getHours < 8 && date.getHours === 8) || (lastDate.getHours < 16 && date.getHours === 16) || (lastDate.getHours > 0 && date.getHours === 0)
            var delta = Math.abs((date - lastDate) / (1000 * 3600));
            // var delta = Math.abs((date - lastDate) / (1000 * 60));    // 暂时设为超过8分钟就切
            if (delta >= 8 || flag) {
                this._excutePeriod(true, date);
            }
            this._currentDate = date;
            this.timeControlDate = date;
            //console.log( this._currentDate );
        },
        /**
         * desc: 设置时间
         * @param period： 时间段 早,中, 晚 {String|array} static value : MORNING, NOON, NIGHT 
         */
        setPeriod: function(period) {
            var times = { MORNING: 8, NOON: 16, NIGHT: 0 };
            this._period = period;
            this._currentDate.setHours(times[period], 0, 0, 0);
        },
        /**
         * desc: 获取时间
         * @return date : {Date}
         */
        getDate: function() {
            return this._currentDate;
        },

        /**
         * desc: 获取运行状态
         * @return status: {Boolean} true： 运行, false : 停止
         */
        getRunningStatus: function() {
            return !this._isPause;
        },

        /**
         * desc: 时间改变要执行的操作：
         * @param cb: {Function} 回调函数
         * @param ctx: {Object} 上下文对象
         */
        setTimeChangeCallback: function(cb, ctx) {
            var ev = { cb: cb, ctx: ctx };
            this._$timeChangeCallback.push(ev);
        },
        /**
         * desc: 设置工班改变要执行的函数
         * @param cb: {Function} 回调函数
         * @param ctx: {Object} 上下文对象
         */
        setPeriodChangeCallback: function(cb, ctx) {
            var ev = { cb: cb, ctx: ctx };
            this._$periodChangeCallback.push(ev);
        },
        /**
         * desc: 执行改变工班后的回调队列
         * @param bool: {Boolean} 工班是否改变
         * @param date: {Date} 当前时间
         */
        _excutePeriod: function(bool, date) {
            if (this._$periodChangeCallback) {
                _.each(this._$periodChangeCallback, function(v) {
                    v.cb.call(v.ctx || this, bool, date);
                })
            }
        },
        /**
         *  desc: padding字符串 
         */
        strPadding: function(str, n, rep) {
            if (str === '') return;
            if (!n) return str;
            str = str.toString();
            str = str.replace(/^\s+|\s+$/g, '');
            var len = str.length;
            if (len >= n) return str;
            if (typeof(rep) === 'undefined') {
                rep = '0';
            }
            rep = rep.toString();
            for (var i = 0, l = n - len; i < l; i++) {
                str = rep + str;
            }
            return str;
        },
        /**
         * desc: 格式化日期
         * @param date ： {Date}
         * @return dateStr: {String}
         */

        dateToString: function(date) {
            date = _.isDate(date) ? date : new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hour = date.getHours(),
                minute = date.getMinutes(),
                second = date.getSeconds();
            return year + '-' + this.strPadding(month, 2) + '-' + this.strPadding(day, 2) + ' ' + this.strPadding(hour, 2) + ':' + this.strPadding(minute, 2) + ':' + this.strPadding(second, 2);
        },

        /**
         * desc 时间转化为毫秒值
         * @param date : {Date}
         * @retrun long : {Number}
         */

        dateToMilliseconds: function(date) {
            date = _.isDate(date) ? date : new Date(date);
            return date.valueOf();
        },

        /**
         * desc: 启动回放
         * @param isRestart : {Boolean} 针对视频播放
         */

        startPlayback: function(isRestart) {
            this._isPause = false;
            this._howManyTimes += 1;
            if (this._isVideo && this._videoObj) {
                // 处理播放video的代码
                if (isRestart) {
                    this._videoObj.restart();
                    return;
                }
                this._videoObj.start();
            } else {
                if (this.searchEqType === 'V')
                    this._reloadDataByVoyage_();
                else
                    this._reloadData_();
            }
            this._playInterval_();
            //console.log('start playback');
        },

        /**
         * desc 暂停回放
         */
        pausePlayback: function() {
            //console.log('pause')
            var that = this;
            this._isPause = true;
            if (this._isVideo && this._videoObj) {
                this._videoObj.pause();
                return;
            }
            window.clearTimeout(that._$timeFlag);
        },

        // 回放停止设备的移动动画
        stopDeviceAnimator: function() {
            this._overMap.stopDeviceAnimator();
        },

        // 回放启动设备的移动动画
        startDeviceAnimator: function() {
            this._overMap.startDeviceAnimator();
        },

        /**
         * desc: 重启 
         */
        restartPlayback: function() {
            this.pausePlayback();
            this.startPlayback();
        },
        /**
         * desc：处理video播放 
         */
        handlerVideo: function() {

        },

        /**
         * desc 操作请求和数据 
         */
        addRecordData: function(type, fn, args) {
            var that = this;
            that._$cacheType[type] = function() {
                fn(args, that);
            };

        },

        _$cacheType: {},
        /**
         * desc: 定时重载
         */
        _playInterval_: function() {
            var that = this;
            if (this._isPause) {
                return false;
            }
            that._$timeFlag = setTimeout(function() {
                that._timeControl_();
                that.setDate(that.getDate().valueOf() + that._playSpeed * that._requestInterval * 1000);
                if (that._isVideo) {
                    return;
                }
                if (that.searchEqType === 'V') {
                    that._reloadDataByVoyage_();
                } else {
                    that._reloadData_();
                }
                that._playInterval_();
                //console.log(that.dateToString(that.getDate()));
            }, that._requestInterval * 1000);
        },
        /**
         * 时间控制
         */
        _timeControl_: function() {
            var that = this;
            if (this._isPause) return;
            // var lgDate = date.valueOf() + this._playSpeed * this._requestInterval * 1000;
            var lgDate = this.timeControlDate.valueOf() + 1000;
            this.timeControlDate = lgDate;
            if (this._$timeChangeCallback) {
                var dateStr = this.dateToString(lgDate);
                //console.log( this._$timeChangeCallback );
                _.each(this._$timeChangeCallback, function(v) {
                    v.cb.call(v.ctx || this, dateStr);
                })
            }
            this.count += 1;
            if (this.count >= this._playSpeed * this._requestInterval) {
                this.count = 0;
                window.clearTimeout(this.timeout);
                return true;
            }
            this.timeout = setTimeout(function() {
                that._timeControl_();
            }, 1 / this._playSpeed * 1000);
        },
        /**
         *  desc: 重载数据 
         */
        _reloadData_: function() {
            //console.log( this._currentDate );
            var that = this;
            for (var i in that._$cacheType) {
                that._$cacheType[i]();
            }
            //console.log(that._$cacheType  );
            this.getYards();
            this.getContainers();
            this.getGantrycranes();
            this.getBridgecranes();
            this.getReachstackers();
            this.getStackers();
            this.getShips();
            this.getBerths();

        },
        /**
         * desc: 船名航次数据重载
         */
        _reloadDataByVoyage_: function() {
            var that = this;
            for (var i in that._$cacheType) {
                that._$cacheType[i]();
            }
            //console.log(that._$cacheType  );
            this.getContainersByVoyage();
            this.getGantrycranesByVoyage();
            this.getBridgecranesByVoyage();
            this.getReachstackersByVoyage();
            this.getStackersByVoyage();
        },
        /**
         *  desc: 构建播放弹框组件 
         */
        createPop: function() {
            console.log('create pop');
        },
        /**
         *  desc: 实例化视频播放组件 
         */
        createVideo: function(cfg) {
            if (!cfg || !cfg.canvasDom) {
                console.error('缺少配置项');
                return;
            }
            this._videoObj = Video(cfg);
            this._isVideo = true;
            this.setTimeChangeCallback(this._videoObj.switchTime, this._videoObj);
            this.setPeriodChangeCallback(this._videoObj.switchVideo, this._videoObj);
        },
        /**
         * desc: 播放单设备视频
         */
        playTheSingleVideo: function() {
            console.log('playTheSingleVideo');
            if (this._isVideo && this._videoObj) {
                console.log(this._videoObj);
                this._videoObj && this._videoObj.playTheSingleVideo();
                return;
            }
        },
        resetSearchInfo: function(obj) {
            this.searchCode = obj.searchCode;
            this.searchEqType = obj.searchEqType || this.searchEqType;
            this.searchJobType = obj.searchJobType.length === 0 ? '' : obj.searchJobType;
        },
        /**
         * desc: 播放单设备
         */
        playTheSingleEquipment: function(obj) {
            this.resetSearchInfo(obj);
            !this._isPause && this._reloadData_();
        },

        playTheVoyageEquipment: function(obj) {
            this.resetSearchInfo(obj);
            !this._isPause && this._reloadDataByVoyage_();
        },

        /**
         * desc: 根据筛选条件播放
         */
        playWithFiter: function(args) {
            this.filterObj = $.extend(this.filterObj, args);
            !this.filterObj['container'] && (this.searchEqType === 'V' ? this.getContainersByVoyage() : this.getContainers());
            !this.filterObj['gantrycrane'] && (this.searchEqType === 'V' ? this.getGantrycranesByVoyage() : this.getGantrycranes());
            !this.filterObj['emptyContainer'] && (this.searchEqType === 'V' ? this.getStackersByVoyage() : this.getStackers());
            !this.filterObj['reachstacker'] && (this.searchEqType === 'V' ? this.getReachstackersByVoyage() : this.getReachstackers());
            !this.filterObj['bridgecrane'] && (this.searchEqType === 'V' ? this.getBridgecranesByVoyage() : this.getBridgecranes());
        },

        /**
         * desc: 获取video对象
         */
        getVideo: function() {
            return this._videoObj;
        },
        /**
         * desc: 获取场区对象
         */
        getLabels: function() {
            console.log(this._currentDate);
        },
        /**
         * desc: 获取堆场对象
         */
        getYards: function() {
            //console.info('get yards');
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetYardsing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/blockSnap/other/insert_time/EQUALS/' + timeParam,
                data: '',
                success: function(data) {
                    that._isgetYardsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var yards = [];
                    $.each(data, function(k, v) {
                        if (v.GPS_GRAPH === 'Polygon' && v.GPS_COORDINATES instanceof Array) {
                            yards.push(v);
                        }
                    });

                    that.addObject('yard', yards);
                },
                error: function(e) {
                    that._isgetYardsing = false;
                    console.log(e);
                }
            };
            this._isgetYardsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取集卡对象
         */
        getContainers: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetContainersing) {
                return false;
            }
            if (this.filterObj.container === 0) {
                that.addObject('container', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                //url: 'src/js/mod/containerLorry/lorryData.json',
                // url: '/portvision/object/truck', //联调接口
                //url: '/portvision/mainObject/truck', //联调接口
                // url: '/portvision/mainObject/truckSnap/other/insert_time/EQUALS/' + timeParam,
                // data: {'position': 'truckTrack','field': 'TRUCK_CODE','dictate': 'TRUCK', 'currentPage':629,'pageSize':1000,},// 废弃接口
                url: '/portvision/equip/truckSnap',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'T',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000

                    // startTime: 1505751525000,
                    // endTime: 1505762043000,
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetContainersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('container', []);
                        return false;
                    }
                    var containers = data;
                    // 获取集卡的附属信息：效率等
                    /*$.each(data, function( k, v ) {
                       var container = _.findWhere(containers, {'OBJ_TRUCK_CODE': v.TRUCK_CODE}); 
                       if( !container ) return true;
                       container = _.extend( container , v );                  
                    });*/
                    that.addObject('container', containers);
                },
                error: function(e) {
                    that._isgetContainersing = false;
                    console.log(e);
                }
            };
            this._isgetContainersing = true;
            $.ajax(ajaxConfig);
        },
        getContainersByVoyage: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetContainersing) {
                return false;
            }
            if (this.filterObj.container === 0) {
                that.addObject('container', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                //url: 'src/js/mod/containerLorry/lorryData.json',
                // url: '/portvision/object/truck', //联调接口
                //url: '/portvision/mainObject/truck', //联调接口
                // url: '/portvision/mainObject/truckSnap/other/insert_time/EQUALS/' + timeParam,
                // data: {'position': 'truckTrack','field': 'TRUCK_CODE','dictate': 'TRUCK', 'currentPage':629,'pageSize':1000,},// 废弃接口
                url: '/portvision/vesselno/truckSnap',
                data: {
                    code: that.searchCode,
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetContainersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('container', []);
                        return false;
                    }
                    var containers = data;
                    // 获取集卡的附属信息：效率等
                    /*$.each(data, function( k, v ) {
                       var container = _.findWhere(containers, {'OBJ_TRUCK_CODE': v.TRUCK_CODE}); 
                       if( !container ) return true;
                       container = _.extend( container , v );                  
                    });*/
                    that.addObject('container', containers);
                },
                error: function(e) {
                    that._isgetContainersing = false;
                    console.log(e);
                }
            };
            this._isgetContainersing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取泊区对象
         */
        /*getBerths:function(){
            console.log( this._currentDate );
        },*/
        /**
         * desc: 获取船只对象
         */
        getShips: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetShipsing) {
                return false;
            }
            if (this.filterObj.gantrycrane === 0) {
                that.addObject('ships', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // todo: 换成回放的接口
                url: '/portvision/mainObject/vessel',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'V',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    that._isgetShipsing = false;
                    _.isString(data) && (data = JSON.parse(data));
                    if (!data || data.length === 0) {
                        that.addObject('ship', []);
                        return false;
                    }
                    var ships = data;
                    that.addObject('ship', data.result);
                },
                error: function(e) {
                    that._isgetShipsing = false;
                    console.log(e);
                }
            };
            this._isgetShipsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取龙门吊对象
         */
        getGantrycranes: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetGantrycranesing) {
                return false;
            }
            if (this.filterObj.gantrycrane === 0) {
                that.addObject('gantrycrane', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/gantryCraneSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/equip/gantryCraneSnap',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'RT',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetGantrycranesing = false;
                    if (!data || data.length === 0) {
                        that.addObject('gantrycrane', []);
                        return false;
                    }
                    var gantrycranes = data;
                    that.addObject('gantrycrane', gantrycranes);
                },
                error: function(e) {
                    that._isgetGantrycranesing = false;
                    console.log(e);
                }
            };
            this._isgetGantrycranesing = true;
            $.ajax(ajaxConfig);
        },
        getGantrycranesByVoyage: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetGantrycranesing) {
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/gantryCraneSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/vesselno/gantryCraneSnap',
                data: {
                    code: that.searchCode,
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetGantrycranesing = false;
                    if (!data || data.length === 0) {
                        that.addObject('gantrycrane', []);
                        return false;
                    }
                    var gantrycranes = data;
                    that.addObject('gantrycrane', gantrycranes);
                },
                error: function(e) {
                    that._isgetGantrycranesing = false;
                    console.log(e);
                }
            };
            this._isgetGantrycranesing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取桥吊对象
         */
        getBridgecranes: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetBridgecranesing) {
                return false;
            }
            if (this.filterObj.bridgecrane === 0) {
                that.addObject('bridgecrane', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/bridgeCraneSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/equip/bridgeCraneSnap',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'CR',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetBridgecranesing = false;
                    if (!data || data.length === 0) {
                        that.addObject('bridgecrane', []);
                        return false;
                    }
                    var bridgecranes = data;
                    that.addObject('bridgecrane', bridgecranes);
                },
                error: function(e) {
                    that._isgetGantrycranesing = false;
                    console.log(e);
                }
            };
            this._isgetGantrycranesing = true;
            $.ajax(ajaxConfig);
        },
        getBridgecranesByVoyage: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetBridgecranesing) {
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/bridgeCraneSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/vesselno/bridgeCraneSnap',
                data: {
                    code: that.searchCode,
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetBridgecranesing = false;
                    if (!data || data.length === 0) {
                        that.addObject('bridgecrane', []);
                        return false;
                    }
                    var bridgecranes = data;
                    that.addObject('bridgecrane', bridgecranes);
                },
                error: function(e) {
                    that._isgetGantrycranesing = false;
                    console.log(e);
                }
            };
            this._isgetGantrycranesing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取堆高机对象
         */
        getStackers: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetStackersing) {
                return false;
            }
            if (this.filterObj.emptyContainer === 0) {
                that.addObject('stacker', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/emptyContainerHandlersSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/vesselno/emptyContainerHandlersSnap',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'P',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetStackersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('stacker', []);
                        return false;
                    }
                    var stackers = data;
                    that.addObject('stacker', stackers);
                },
                error: function(e) {
                    that._isgetStackersing = false;
                    console.log(e);
                }
            };
            this._isgetStackersing = true;
            $.ajax(ajaxConfig);
        },
        getStackersByVoyage: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetStackersing) {
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/emptyContainerHandlersSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/vesselno/emptyContainerHandlersSnap',
                data: {
                    code: that.searchCode,
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetStackersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('stacker', []);
                        return false;
                    }
                    var stackers = data;
                    that.addObject('stacker', stackers);
                },
                error: function(e) {
                    that._isgetStackersing = false;
                    console.log(e);
                }
            };
            this._isgetStackersing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取正面吊对象
         */
        getReachstackers: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetReachstackersing) {
                return false;
            }
            if (this.filterObj.reachstacker === 0) {
                that.addObject('reachstacker', []);
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/reachStackerSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/equip/reachStackerSnap',
                data: {
                    code: that.searchCode,
                    equipType: that.searchEqType,
                    // equipType: 'F',
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetReachstackersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('reachstacker', []);
                        return false;
                    }
                    var reachstackers = data;
                    that.addObject('reachstacker', reachstackers);
                },
                error: function(e) {
                    that._isgetReachstackersing = false;
                    console.log(e);
                }
            };
            this._isgetReachstackersing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取正面吊对象
         */
        getReachstackersByVoyage: function() {
            var that = this;
            var timeParam = this._currentDate.valueOf();
            if (this._isgetReachstackersing) {
                return false;
            }
            var ajaxConfig = {
                traditional: true,
                method: 'get',
                // url: '/portvision/mainObject/reachStackerSnap/other/insert_time/EQUALS/' + timeParam,  // 废弃接口
                url: '/portvision/vesselno/reachStackerSnap',
                data: {
                    code: that.searchCode,
                    jobType: that.searchJobType,
                    startTime: timeParam,
                    endTime: timeParam + this._playSpeed * this._requestInterval * 1000
                },
                success: function(data) {
                    _.isString(data) && (data = JSON.parse(data));
                    that._isgetReachstackersing = false;
                    if (!data || data.length === 0) {
                        that.addObject('reachstacker', []);
                        return false;
                    }
                    var reachstackers = data;
                    that.addObject('reachstacker', reachstackers);
                },
                error: function(e) {
                    that._isgetReachstackersing = false;
                    console.log(e);
                }
            };
            this._isgetReachstackersing = true;
            $.ajax(ajaxConfig);
        }
    });
    return MCOBSERVER;
});