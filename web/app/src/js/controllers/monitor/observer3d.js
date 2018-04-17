/**
 * @module port/controllers/monitor/monitorObserver 监控控制器
 */
define(function(require) {
    'use strict';

    var BaseObserver = require('base/mcObserver');
    var ThreeMap = require('layer/threeMap');
    var PopLayer = require('layer/mapPop3d');
    //var OverMap = require('layer/overMap');

    //var updateX = -35;
    //var updateY = -100;
    var updateX = 0;
    var updateY = 0;



    var MONITOROBSERVER = function(cfg) {
        if (!(this instanceof MONITOROBSERVER)) {
            return new MONITOROBSERVER().init(cfg);
        }
    };

    MONITOROBSERVER.prototype = $.extend(new BaseObserver(), {
        /*
         * 初始化
         */
        init: function(cfg) {
            this._isgetTrucksing = false;
            this.origionWidth = 940;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.scaleLevel = cfg.scaleLevel || 1;
            this.initScale = (this.viewWidth / this.origionWidth);
            this.mainDom = cfg.mainDom || 'main';
            this.scaleLevel = cfg.scaleLevel || 1;
            this.showZoomRatio = this.scaleLevel;
            this.ratioStep = Math.sqrt(3); // 根号8
            this.showScale = this.initScale * Math.pow(this.ratioStep, (this.showZoomRatio - 1));
            if (!this._baseMap) {
                this._threeMap = ThreeMap({
                    'observer': this,
                    'viewWidth': this.viewWidth,
                    'viewHeight': this.viewHeight,
                    'initScale': this.showScale,
                    'mainDom': this.mainDom
                });

            };

            if (!this._popLayer) {
                this._popLayer = PopLayer({
                    'zr': this._zr,
                    'observer': this,
                    'scale': this.showScale,
                    'scaleLevel': this.scaleLevel
                });
            };

            this.bindEvent();
            return this;
        },
        /**
         * desc: 显示监控场区
         */
        showMonitorMap: function() {
            this.startMonitor();
        },
        /**
         * desc: 暂停监控
         */
        stopMonitor: function() {
            var that = this;
            that.warnIntervelObj && window.clearInterval(that.warnIntervelObj);
            that.moveableIntervelObj && window.clearInterval(that.moveableIntervelObj);
            that.stableIntervelObj && window.clearInterval(that.stableIntervelObj);
            that.immediateIntervelObj && window.clearInterval(that.immediateIntervelObj);
            that.reloadIntervelObj && window.clearInterval(that.reloadIntervelObj);
        },
        /**
         * desc: 开启监控
         */
        startMonitor: function() {
            var stableIntervel = 30 * 60; // 单位为秒
            var moveableIntervel = 10 * 60; // 单位为秒
            //var moveBridgeIntervel = 10; // 10秒刷新桥吊
            var immediateIntervel = 3; // 单位为秒
            var warnIntervel = 30; // 单位为秒
            var that = this;
            that.getYards(); // 获取堆场信息
            //that.getLabels();   // 获取标签场区信息
            //that.getGates();   // 获取闸口信息
            //that.getJobPoints(); // 获取作业点信息
            //that.getBerths();  // 获取泊位区信息
            //that.getBerthFlags();  // 获取泊位标记信息
            that.getShips(); // 获取船舶信息
            //that.getCameras();  // 获取摄像头信息
            //that.getHydrant();  // 获取消防栓信息
            //that.getSensor();  // 获取传感器信息
            //that.getTracks();  // 获取轨道信息
            //that.getRoads(); // 获取道路线信息
            //that.getReachstackers();  // 获取正面吊信息
            that.getBridgecranes(); // 获取桥吊信息
            that.getGantrycranes(); // 获取龙门吊信息
            //that.getStackers();  // 获取堆高机信息
            that.getTrucks(); // 获取集卡信息
            //that.getContainers(); // 获取集装箱信息
            //that.getNewWarns(); // 获取最新告警信息
            //that.getSearchBox(); // 获取搜索的箱子信息
            //that.getContainerJobList(); // 获取集装箱作业列表

            that.warnIntervelObj && window.clearInterval(that.warnIntervelObj);
            that.moveableIntervelObj && window.clearInterval(that.moveableIntervelObj);
            that.stableIntervelObj && window.clearInterval(that.stableIntervelObj);
            that.immediateIntervelObj && window.clearInterval(that.immediateIntervelObj);
            that.reloadIntervelObj && window.clearInterval(that.reloadIntervelObj);

            // 静态物体 ，stableIntervel（30分钟）加载一次
            that.stableIntervelObj = window.setInterval(function() {
                //that.getLabels();   // 获取标签场区信息
                //that.getGates();   // 获取闸口信息
                //that.getBerths();  // 获取泊位区信息
                //that.getTracks();  // 获取轨道信息
                //that.getRoads(); // 获取道路线信息
                //that.getBerthFlags();  // 获取泊位标记信息
                //that.getJobPoints(); // 获取作业点信息
                //that.getCameras();  // 获取摄像头信息
                //that.getHydrant();  // 获取消防栓信息
                //that.getSensor();   // 获取传感器信息
            }, stableIntervel * 1000);


            // 活动设备物体，moveableIntervel（1分钟）加载一次
            that.moveableIntervelObj = window.setInterval(function() {
                //that.getShips();  // 获取船舶信息
            }, moveableIntervel * 1000);



            // 实时监控信息，immediateIntervel（3秒钟）加载一次
            that.immediateIntervelObj = window.setInterval(function() {
                that.getTrucks(); // 获取集卡信息
                that.getBiGraphData();
                that.getShips(); // 获取船舶信息
                //that.getContainers();  // 获取集装箱信息
                //that.getSearchBox(); // 获取搜索的箱子信息
                //that.getContainerJobList(); // 获取集装箱作业列表
                window.setTimeout(function() {
                    //that.getReachstackers();  // 获取正面吊信息
                    that.getBridgecranes(); // 获取桥吊信息
                    window.setTimeout(function() {
                        that.getGantrycranes(); // 获取龙门吊信息
                        //that.getStackers();  // 获取堆高机信息
                    }, 1000);
                }, 500);

            }, immediateIntervel * 1000);

            // 实时告警信息，warnIntervel（30秒钟）加载一次
            that.warnIntervelObj = window.setInterval(function() {
                //that.getNewWarns(); // 实时告警信息
                //that.getBiGraphData();  // 获取bi弹框信息
                that.getYards(); // 获取堆场信息
            }, warnIntervel * 1000);

            that.reloadIntervelObj = window.setInterval(function() {
                console.log('update page');
                window.location.reload();
            }, 2 * 60 * 60 * 1000); // 2小时后刷页面
            //console.log( 'start monitor' );
            /*window.setTimeout(function(){
                that._overMap && that._overMap.startRenderObjects();
            }, 1000);*/

        },
        /**
         * desc: 获取堆场对象
         */
        getYards: function() {
            //console.info('get yards');
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetYardsing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/block',
                // url: '../../src/js/mod/yard/block1.json',
                data: '',
                success: function(data) {
                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetYardsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var yards = [],
                        jobLines = [],
                        containers = [],
                        bays = [];

                    $.each(data.result, function(k, v) {
                        if (v.GPS_GRAPH === 'Polygon' && v.GPS_COORDINATES instanceof Array) {
                            yards.push(v);
                        }
                    });
                    // 获取堆场的附属信息：堆存量、堆存能力等
                    $.each(data.extra, function(k, v) {
                        var yard = _.findWhere(yards, { 'OBJ_YARD_CODE': v.YARD_CODE });
                        if (!yard) return false;
                        yard = _.extend(yard, v);
                    });
                    // 获取堆场的各个贝位信息
                    bays = _.groupBy(data.bay, function(item) {
                        return item.YARD_CODE;
                    })
                    $.each(bays, function(idx, item) {
                        var yard = _.findWhere(yards, { 'OBJ_YARD_CODE': idx });
                        if (!yard) return false;
                        yard = _.extend(yard, { 'bays': item });
                    })

                    // 获取堆场的贝位箱子堆放信息

                    $.each(data.yardblock, function(idx, item) {
                        item = that.rowsClosTransform(item);
                        var yard = _.findWhere(yards, { 'OBJ_YARD_CODE': idx });
                        if (!yard) return false;
                        yard = _.extend(yard, { 'yardblock': item });
                    })

                    // 整理集装箱各类作业情况
                    $.each(data.attach.LOAD, function(k, v) {
                        v.type = 'LOAD';
                        jobLines.push(v);
                        // 按照泊位统计作业量
                        // v.BERTH
                    })
                    $.each(data.attach.DLVR, function(k, v) {
                        v.type = 'DLVR';
                        jobLines.push(v);
                    })
                    $.each(data.attach.DSCH, function(k, v) {
                        v.type = 'DSCH';
                        jobLines.push(v);
                    })
                    $.each(data.attach.RECV, function(k, v) {
                        v.type = 'RECV';
                        jobLines.push(v);
                    });
                    // 获取集装箱各类型作业量（线图）
                    $.each(yards, function(k, v) {
                        v.jobLine = [];
                        $.each(jobLines, function(m, n) {
                            if (v.OBJ_YARD_CODE === n.BLOCK) {
                                v.jobLine.push(n);
                            }
                        })
                        v.currentCtns = [];
                        v.nextCtns = [];
                        $.each(data.detail, function(o, p) {
                            var pos = p.GPS_ACTUAL_SLOT_POSITION;
                            if (v.OBJ_YARD_CODE === p.GPS_ACTUAL_POSITION_BLOCK && p.CTN_ORDER === 'NEXT') {
                                v.nextCtns.push(p);
                            }
                            if (v.OBJ_YARD_CODE === p.GPS_ACTUAL_POSITION_BLOCK && p.CTN_ORDER === 'CURRENT') {
                                v.currentCtns.push(p);
                            }
                            if (!pos) return false;
                            if (pos.indexOf('.') > 0) {
                                p.bay = pos.substr(0, 2);
                            } else {
                                p.bay = pos.substr(0, 3);
                            }
                        })
                    })

                    that.addObject('yard', yards);
                    // that.addObject('yard', yards.slice(0, 40));
                    // that.addObject('yard', yards.slice(0, 3));

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
         * desc: 获取船舶信息
         */
        getShips: function() {
            var that = this;
            if (this._isgetShipsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/boat/boat.json',          
                url: '/portvision/mainObject/vessel',
                data: '',
                success: function(data) {
                    that._isgetShipsing = false;
                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('ship', [data.result[0]]);
                    // that.addObject('ship', data ); 
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
         * desc: 获取集卡对象
         */
        getTrucks: function() {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetTrucksing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/truck', //联调接口
                data: '',
                success: function(data) {
                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    //console.log( data );
                    that._isgetTrucksing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var containers = data.result;
                    // 获取集卡的附属信息：效率等
                    $.each(data.attach, function(k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.TRUCK_CODE });
                        if (!container) return true;
                        container = _.extend(container, v);
                    });
                    $.each(data.alarm, function(k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.EQUIPMENT_CODE });
                        if (!container) return true;
                        container.alarm = v;
                    });
                    $.each(data.extra, function(k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.TRUCK_CODE });
                        if (!container) return true;
                        container = _.extend(container, v);
                    });
                    that.addObject('truck', containers);

                },
                error: function(e) {
                    that._isgetTrucksing = false;
                    console.log(e);
                }
            };
            this._isgetTrucksing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取集装箱对象
         */
        getContainers: function() {
            var that = this;
            // return false;
            if (this._isgetContainersing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/?', //联调接口
                data: '',
                success: function(data) {

                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    //console.log( data );
                    that._isgetContainersing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var containers = data.result;

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
        /*
         * 在3d地图附着物层添加对象
         */
        addObject: function(type, datas) {
            //console.log( this.overMap );
            var that = this;
            $.each(datas, function(k, v) {
                //v._type = type;
                //v._mapId = k;
                if (v.GPS_LATITUDE && v.GPS_LONGITUDE) {
                    v.x = that.convertFromLng(v.GPS_LONGITUDE) + updateX;
                    v.y = that.convertFromLat(v.GPS_LATITUDE) + updateY;
                } else {
                    v.x = v.x + updateX;
                    v.y = v.y + updateY;
                }
                // 非移动物体对象转换
                if (v.LONGITUDE && v.LATITUDE) {
                    v.x = that.convertFromLng(v.LONGITUDE) + updateX;
                    v.y = that.convertFromLat(v.LATITUDE) + updateY;
                }
            })
            this._threeMap && this._threeMap.addObject(type, datas);

        },

        /*
         * 经度换算x方法
         */
        convertFromLng: function(longitude) {
            var k = 36958.06681,
                a = -4509695.69;
            if (!longitude && longitude !== 0) {
                return 0;
            }
            longitude = parseFloat(longitude);
            return parseFloat((longitude * k + a).toFixed(2));
        },

        /*
         * x换算经度方法
         */
        convertToLng: function(x) {
            var k = 36958.06681,
                a = -4509695.69;
            if (!x && x !== 0) {
                return 0;
            }
            x = parseFloat(x);
            return ((x - a) / k).toFixed(5);
        },

        /*
         * 纬度换算y方法
         */
        convertFromLat: function(latitude) {
            var k = -41130.38612,
                a = 1229644.731;
            if (!latitude && latitude !== 0) {
                return 0;
            }
            latitude = parseFloat(latitude);
            return parseFloat((latitude * k + a).toFixed(2));
        },

        /*
         * y换算纬度方法
         */
        convertToLat: function(y) {
            var k = -41130.38612,
                a = 1229644.731;
            if (!y && y !== 0) {
                return 0;
            }
            y = parseFloat(y);
            return ((y - a) / k).toFixed(6);
        },

        /*
         * 数据行列变换，85行*6 变为 6行*85
         */
        rowsClosTransform: function(data) {
            var temp, arr = [];
            for (var i = 0; i < data[0].length; i++) {
                temp = [];
                for (var j = 0; j < data.length; j++) {
                    temp.push(data[j][i]);
                }
                arr.push(temp);
            }
            return arr;
        }

    });
    return MONITOROBSERVER;
});