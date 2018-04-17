/**
 * @module port/base/mcObserver 主控制器
 */
define(function () {
    'use strict';
    /*var BaseMap = require('layer/baseMap');
    var OverMap = require('layer/overMap');
    var PopLayer = require('layer/mapPop');
    var Attachment = require('layer/monitorPop/attachment');*/
    //var updateX = -35;
    //var updateY = -100;
    var updateX = 0;
    var updateY = 0;

    var MCOBSERVER = function (cfg) {
        if (!(this instanceof MCOBSERVER)) {
            return new MCOBSERVER().init(cfg);
        }
    };

    MCOBSERVER.prototype = $.extend({
        _isgetLabelsing: false,
        _isgetJobPoints: false,
        _isgetYardsing: false,
        _isgetContainersing: false,
        _isgetBerthsing: false,
        _isgetShipsing: false,
        _isgetCamerasing: false,
        _isgetHydrant: false,
        _isgetSensoring: false,
        _isgetGantrycranesing: false,
        _isgetBridgecranesing: false,
        _isgetStackersing: false,
        _isgetReachstackersing: false,
        _isgetNewWarnsing: false,
        _isgetCurrentWarnsing: false,
        _isgetHistoryWarnsing: false,
        _isgetRoadConditioning: false,
        _isgetTrailing: false,
        _isgetGPSLine: false,
        _isgetJobPointsing: false,
        _isgetBerthFlaging: false,
        _isgetTracking: false,
        _isgetRoadsing: false,
        _isgetHydranting: false,
        _isgetTodayThroughtDataing: false,
        _isgetThroughpuDataing: false,
        _isgetDepositDataing: false,
        _isgetVesselJobDataing: false,
        _isgetGateJobDataing: false,
        _isgetContainerJobList: true,
        _isgetSearchBox: true,
        _isgetGatesing: false,

        /*
         * 初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.origionWidth = 940;
            this.viewHeight = cfg.viewHeight || 944;
            this.viewWidth = cfg.viewWidth || 1920;
            this.showScale = (this.viewWidth / this.origionWidth);
            this.scaleLevel = 1;
            this.mainDom = cfg.mainDom || 'main';
            this.searchBoxNum = ''; // 搜索的箱子编号

            return this;
        },
        /*
         * 绑定事件
         */
        bindEvent: function () {
            var that = this;
            if (!this._zr) return false;
            this._zr.off();
            this._zr.on('mousewheel', function (e) {
                //console.log('mousewheel begin', new Date().valueOf() );

                var delta = e.wheelDelta;
                // var offsetX = e.offsetX;
                // var offsetY = e.offsetY;
                //console.log( offsetX, offsetY );
                //that._baseMap && that._baseMap.drawWithCenterPoint( offsetX, offsetY );
                if (delta > 0) {
                    // 向上滚    console.log('wheelup');    	    
                    that.notice('_baseMap', 'zoomIn');
                } else if (delta < 0) {
                    // 向下滚 console.log('wheeldown');    	    	
                    that.notice('_baseMap', 'zoomOut');
                }

                //console.log('mousewheel end', new Date().valueOf() );
            });
            this._zr.on('mousedown', function (ev) {
                var downX = ev.offsetX;
                var downY = ev.offsetY;
                this.off('mousemove').on('mousemove', function (e) {
                    var moveX = e.offsetX - downX;
                    var moveY = e.offsetY - downY;
                    that._baseMap && that._baseMap.mapMove(moveX, moveY);
                    e.cancelBubble = true;
                })
                this.off('mouseup').on('mouseup', function (e) {
                    var moveX = e.offsetX - downX;
                    var moveY = e.offsetY - downY;
                    if (moveX === 0 && moveY === 0) {
                        that.notice('_popLayer', 'hidePop');
                        that.notice('_overMap', 'hideSelectedEquipment');
                        that.notice('_overMap', 'hideBoxMarker');
                    } else {
                        //console.log( moveX, moveY );
                        that._baseMap && that._baseMap.mapDragEnd(moveX, moveY);
                    }
                    this.off('mousemove');
                    e.cancelBubble = true;
                })
                ev.cancelBubble = true;
            });
        },
        /*
         * 发布通知接口
         */
        notice: function (context, callBack, args) {
            if (!context || !callBack || !this[context]) {
                return false;
            }
            var thisContext = this[context];
            thisContext && thisContext[callBack] && thisContext[callBack].call(thisContext, args);
        },
        /*
         * 发布信息接口
         */
        fire: function (type, args, context, callBack) {
            //定义消息            
            if (context && callBack) {
                this.notice(context, callBack, args);
                return false;
            }
            if (type === 'mapDragEnd') {
                this._overMap.mapDragEnd(args);
                // this.
            }
            if (type === 'mapDragEndByMapCenter') {
                this._overMap.mapDragEndByMapCenter(args);
                //console.log( args );
            }
            if (type === 'mapZoomChange') {
                this._overMap.scaleLevel = this.scaleLevel;
                this._overMap.mapZoomChange(args);
                this._popLayer.mapZoomChange(args);
            }
            if (type === 'setMapCenter') {
                this._baseMap.setMapCenter(args);
            }
        },





        /**
         * desc: 显示卡车轨迹
         */
        showContainerTrailMap: function (data) {
            this._overMap.showContainerTrailMap(data);
        },
        /**
         * desc: 隐藏卡车轨迹
         */
        hideContainerTrailMap: function (data) {
            this._overMap.hideContainerTrailMap(data);
        },
        /**
         * desc: 显示卡车轨迹
         */
        showGPSLineMap: function (data) {
            this._overMap.showGPSLineMap(data);
        },
        /**
         * desc: 隐藏卡车轨迹
         */
        hideGPSLineMap: function (data) {
            this._overMap.hideGPSLineMap(data);
        },
        /**
         * desc: 获取bi弹框数据信息
         */
        getBiGraphData: function () {
            this.getTodayThroughtData();
            this.getIntroData();
        },
        /**
         * desc: 请求当天吞吐量数据
         */
        getTodayThroughtData: function () {
            if (this._isgetTodayThroughtDataing) {
                return false;
            }
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/throughput',
                data: { 'time': 'DAY' },
                success: function (data) {
                    that._isgetTodayThroughtDataing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that._popLayer && that._popLayer._biGraphyPop && that._popLayer._biGraphyPop.setTodayThroughtData(data);
                },
                error: function (e) {
                    that._isgetTodayThroughtDataing = false;
                    console.log(e);
                }
            };
            that._isgetTodayThroughtDataing = true;
            $.ajax(ajaxConfig);

        },
        /**
         * desc: 请求装箱量等数据
         */
        getIntroData: function (timeOptionStr) {
            if (timeOptionStr) {
                this.timeOptionStr = timeOptionStr;
            }
            if (!this.timeOptionStr) {
                return false;
            }
            this.getThroughtputData(this.timeOptionStr);
            this.getDepositData(this.timeOptionStr);
            this.getVesselJobData(this.timeOptionStr);
            this.getGateJobData(this.timeOptionStr);
        },
        /**
         * desc: 请求集装箱吞吐量数据
         */
        getThroughtputData: function (timeOptionStr) {
            if (this._isgetThroughpuDataing) {
                return false;
            }
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/throughput',
                data: { 'time': timeOptionStr },
                success: function (data) {
                    that._isgetThroughpuDataing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that._popLayer && that._popLayer._biGraphyPop && that._popLayer._biGraphyPop.setThroughtputData(data);
                },
                error: function (e) {
                    that._isgetThroughpuDataing = false;
                    console.log(e);
                }
            };
            that._isgetThroughpuDataing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 请求集装箱存箱量数据
         */
        getDepositData: function (timeOptionStr) {
            if (this._isgetDepositDataing) {
                return false;
            }
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/storageCtn',
                data: { 'time': timeOptionStr },
                success: function (data) {
                    that._isgetDepositDataing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that._popLayer && that._popLayer._biGraphyPop && that._popLayer._biGraphyPop.setDepositData(data);
                },
                error: function (e) {
                    that._isgetDepositDataing = false;
                    console.log(e);
                }
            };
            that._isgetDepositDataing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 请求岸边作业量数据
         */
        getVesselJobData: function (timeOptionStr) {
            if (this._isgetVesselJobDataing) {
                return false;
            }
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/vesselJob',
                data: { 'time': timeOptionStr },
                success: function (data) {
                    that._isgetVesselJobDataing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that._popLayer && that._popLayer._biGraphyPop && that._popLayer._biGraphyPop.setVesselJobData(data);
                },
                error: function (e) {
                    that._isgetVesselJobDataing = false;
                    console.log(e);
                }
            };
            that._isgetVesselJobDataing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 请求闸口作业量数据
         */
        getGateJobData: function (timeOptionStr) {
            if (this._isgetGateJobDataing) {
                return false;
            }
            var that = this;
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/gateJob',
                data: { 'time': timeOptionStr },
                success: function (data) {
                    that._isgetGateJobDataing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that._popLayer && that._popLayer._biGraphyPop && that._popLayer._biGraphyPop.setGateJobData(data);
                    // that._popLayer._biGraphyPop.showGetIntroDataLoading();
                },
                error: function (e) {
                    that._isgetGateJobDataing = false;
                    console.log(e);
                }
            };
            that._isgetGateJobDataing = true;
            $.ajax(ajaxConfig);
        },

        /**
         * desc: 获取配置信息
         */
        getSettings: function () {
            // 暂无配置信息，预留接口
            // console.log('get settings');
            var that = this;
            // 获取图例信息
            var ajaxConfig = {
                method: 'get',
                url: 'src/js/mod/infoPop/mapLegend.json',
                data: '',
                success: function (data) {
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('mapLegend', data);
                },
                error: function (e) {
                    console.log(e);
                }
            };
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取场区标签信息
         */
        getGates: function () {
            if (this._isgetGatesing) {
                return false;
            }
            var that = this;
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/gate/gate.json',
                data: '',
                success: function (data) {
                    that._isgetGatesing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('gate', data);
                },
                error: function (e) {
                    that._isgetGatesing = false;
                    console.log(e);
                }
            };
            this._isgetGatesing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取场区标签信息
         */
        getLabels: function () {
            if (this._isgetLabelsing) {
                return false;
            }
            var that = this;
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/titleLabel/label.json',
                data: '',
                success: function (data) {
                    that._isgetLabelsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('label', data);
                },
                error: function (e) {
                    that._isgetLabelsing = false;
                    console.log(e);
                }
            };
            this._isgetLabelsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取作业点信息
         */
        getJobPoints: function () {
            var that = this;
            if (this._isgetJobPointsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/titleCircle/jobPoints.json',
                data: '',
                success: function (data) {
                    that._isgetJobPointsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('jobPoints', data);
                },
                error: function (e) {
                    that._isgetJobPointsing = false;
                    console.log(e);
                }
            };
            this._isgetJobPointsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取船舶信息
         */
        getShips: function () {
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
                success: function (data) {
                    that._isgetShipsing = false;
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('ship', data.result);
                    // that.addObject('ship', data ); 
                },
                error: function (e) {
                    that._isgetShipsing = false;
                    console.log(e);
                }
            };
            this._isgetShipsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取轨道信息
         */
        getTracks: function () {
            var that = this;
            if (this._isgetTracking) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/track/track.json',
                data: '',
                success: function (data) {
                    that._isgetTracking = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('track', data);
                },
                error: function (e) {
                    that._isgetTracking = false;
                    console.log(e);
                }
            };
            this._isgetTracking = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取道路线信息
         */
        getRoads: function () {
            var that = this;
            if (this._isgetRoadsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/trail/roadPoints.json',
                data: '',
                success: function (data) {
                    that._isgetRoadsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('roads', data);
                },
                error: function (e) {
                    that._isgetRoadsing = false;
                    console.log(e);
                }
            };
            this._isgetRoadsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取泊位信息
         */
        getBerths: function () {
            var that = this;
            if (this._isgetBerthsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '../../src/js/mod/boat/berth.json',
                data: '',
                success: function (data) {
                    that._isgetBerthsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('berth', data);
                },
                error: function (e) {
                    that._isgetBerthsing = false;
                    console.log(e);
                }
            };
            this._isgetBerthsing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取泊位标记信息
         */
        getBerthFlags: function () {
            var that = this;
            if (this._isgetBerthFlaging) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/berthFlag/berthFlag.json',        
                url: '/portvision/main/object/port ',
                data: '',
                success: function (data) {
                    that._isgetBerthFlaging = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('berthFlag', data);
                },
                error: function (e) {
                    that._isgetBerthFlaging = false;
                    console.log(e);
                }
            };
            this._isgetBerthFlaging = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取摄像头信息
         */
        getCameras: function () {
            var that = this;
            if (this._isgetCamerasing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/camera/camera.json',
                // url: '/portvision/object/attachment/FZWLX/EQUALS/camera',       
                url: '/portvision/mainObject/camert ',
                data: '',
                success: function (data) {
                    data = JSON.parse(data);
                    that._isgetCamerasing = false;
                    data = data.result;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('camera', data);
                },
                error: function (e) {
                    that._isgetCamerasing = false;
                    console.log(e);
                }
            };
            this._isgetCamerasing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取消防栓信息
         */
        getHydrant: function () {
            var that = this;
            if (this._isgetHydranting) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/hydrant/hydrant.json',   
                url: '/portvision/object/attachment/FZWLX/EQUALS/hydrant',
                data: '',
                success: function (data) {
                    that._isgetHydranting = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('hydrant', data);
                },
                error: function (e) {
                    that._isgetHydranting = false;
                    console.log(e);
                }
            };
            this._isgetHydranting = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取传感器信息
         */
        getSensor: function () {
            var that = this;
            if (this._isgetSensoring) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                // url: '../../src/js/mod/sensor/sensor.json',
                // url: '/portvision/object/attachment/FZWLX/EQUALS/sensor',
                url: '/portvision/mainObject/detector',
                data: '',
                success: function (data) {
                    data = JSON.parse(data);
                    that._isgetSensoring = false;
                    data = data.result;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    that.addObject('sensor', data);
                },
                error: function (e) {
                    that._isgetSensoring = false;
                    console.log(e);
                }
            };
            this._isgetSensoring = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取堆场对象
         */
        getYards: function () {
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
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetYardsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var yards = [],
                        jobLines = [],
                        bays = [];

                    $.each(data.result, function (k, v) {
                        if (v.GPS_GRAPH === 'Polygon' && v.GPS_COORDINATES instanceof Array) {
                            yards.push(v);
                        }
                    });
                    // 获取堆场的附属信息：堆存量、堆存能力等
                    $.each(data.extra, function (k, v) {
                        var yard = _.findWhere(yards, { 'OBJ_YARD_CODE': v.YARD_CODE });
                        if (!yard) return false;
                        yard = _.extend(yard, v);
                    });
                    // 获取堆场的各个贝位信息
                    bays = _.groupBy(data.bay, function (item) {
                        return item.YARD_CODE;
                    })
                    $.each(bays, function (idx, item) {
                        var yard = _.findWhere(yards, { 'OBJ_YARD_CODE': idx });
                        if (!yard) return false;
                        yard = _.extend(yard, { 'bays': item });
                    })

                    // 整理集装箱各类作业情况
                    $.each(data.attach.LOAD, function (k, v) {
                        v.type = 'LOAD';
                        jobLines.push(v);
                        // 按照泊位统计作业量
                        // v.BERTH
                    })
                    $.each(data.attach.DLVR, function (k, v) {
                        v.type = 'DLVR';
                        jobLines.push(v);
                    })
                    $.each(data.attach.DSCH, function (k, v) {
                        v.type = 'DSCH';
                        jobLines.push(v);
                    })
                    $.each(data.attach.RECV, function (k, v) {
                        v.type = 'RECV';
                        jobLines.push(v);
                    })
                    // 获取集装箱各类型作业量（线图）
                    $.each(yards, function (k, v) {
                        v.jobLine = [];
                        $.each(jobLines, function (m, n) {
                            if (v.OBJ_YARD_CODE === n.BLOCK) {
                                v.jobLine.push(n);
                            }
                        })
                        v.currentCtns = [];
                        v.nextCtns = [];
                        $.each(data.detail, function (o, p) {
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

                },
                error: function (e) {
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
        getContainers: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetContainersing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/truck', //联调接口
                data: '',
                success: function (data) {

                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    //console.log( data );
                    that._isgetContainersing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var containers = data.result;
                    // 获取集卡的附属信息：效率等
                    $.each(data.attach, function (k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.TRUCK_CODE });
                        if (!container) return true;
                        container = _.extend(container, v);
                    });
                    $.each(data.alarm, function (k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.EQUIPMENT_CODE });
                        if (!container) return true;
                        container.alarm = v;
                    });
                    $.each(data.extra, function (k, v) {
                        var container = _.findWhere(containers, { 'OBJ_TRUCK_CODE': v.TRUCK_CODE });
                        if (!container) return true;
                        container = _.extend(container, v);
                    });
                    that.addObject('container', containers);

                },
                error: function (e) {
                    that._isgetContainersing = false;
                    console.log(e);
                }
            };
            this._isgetContainersing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取龙门吊对象
         */
        getGantrycranes: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetGantrycranesing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/gantryCrane',
                data: '',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetGantrycranesing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var gantrycranes = data.result;
                    // 获取桥吊的附属信息：效率等
                    $.each(data.attach, function (k, v) {
                        var gantrycrane = _.findWhere(gantrycranes, { 'OBJ_EQUIPMENT_CODE': v.EQUIPMENT_CODE });
                        if (!gantrycrane) return true;
                        gantrycrane = _.extend(gantrycrane, v);
                    });
                    that.addObject('gantrycrane', gantrycranes);
                },
                error: function (e) {
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
        getBridgecranes: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetBridgecranesing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/bridgeCrane', // 联调接口
                // url: '../../src/js/mod/bridgecrane/data.json',	
                data: '',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetBridgecranesing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var bridgecranes = data.result;
                    // 获取桥吊的附属信息：效率等
                    $.each(data.attach, function (k, v) {
                        var bridgecrane = _.findWhere(bridgecranes, { 'OBJ_EQUIPMENT_CODE': v.EQUIPMENT_CODE });
                        if (!bridgecrane) return true;
                        bridgecrane = _.extend(bridgecrane, v);
                    });
                    that.addObject('bridgecrane', bridgecranes);
                },
                error: function (e) {
                    that._isgetBridgecranesing = false;
                    console.log(e);
                }
            };
            this._isgetBridgecranesing = true;
            $.ajax(ajaxConfig);
        },
        /**
         * desc: 获取堆高机对象
         */
        getStackers: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetStackersing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/emptyContainerHandlers', //联调接口 			
                data: '',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetStackersing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var stackers = data.result;
                    // 获取设备的附属信息：效率等
                    $.each(data.attach, function (k, v) {
                        var stacker = _.findWhere(stackers, { 'OBJ_EQUIPMENT_CODE': v.EQUIPMENT_CODE });
                        if (!stacker) return true;
                        stacker = _.extend(stacker, v);
                    });
                    that.addObject('stacker', stackers);
                },
                error: function (e) {
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
        getReachstackers: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetReachstackersing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/mainObject/reachStacker',
                data: '',
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetReachstackersing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var reachstackers = data.result;
                    // 获取设备的附属信息：效率等
                    $.each(data.attach, function (k, v) {
                        var reachstacker = _.findWhere(reachstackers, { 'OBJ_EQUIPMENT_CODE': v.EQUIPMENT_CODE });
                        if (!reachstacker) return true;
                        reachstacker = _.extend(reachstacker, v);
                    });
                    //console.log( reachstackers );
                    that.addObject('reachstacker', reachstackers);
                },
                error: function (e) {
                    that._isgetReachstackersing = false;
                    console.log(e);
                }
            };
            this._isgetReachstackersing = true;
            $.ajax(ajaxConfig);
        },

        /*
         * 获取当前告警信息
         */
        getCurrentWarns: function () {
            var that = this;
            //var timeParam = this._currentDate.valueOf();
            if (this._isgetCurrentWarnsing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/object/alarm',
                data: { 'order': 'OCCURRENCE_TIME', 'key': 'READ_FLAG', 'operator': 'EQUALS', 'value': 'N' },
                success: function (data) {
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetCurrentWarnsing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var currentWarns = data.result;
                    that.updateCurrentWarns(currentWarns);
                },
                error: function (e) {
                    that._isgetCurrentWarnsing = false;
                    console.log(e);
                }
            };
            this._isgetCurrentWarnsing = true;
            $.ajax(ajaxConfig);
        },
        getContainerJobList: function () {
            if (this._isgetContainerJobList) {
                return false;
            }
            // return false; // TODO: Warning
            var noJobArr = [], newJobArr = [];
            var url = '/portvision' + '/data/jobPlan',
                method = 'get',
                params = {},
                that = this;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function (data) {
                    // TODO: 检查新增 和 没有计划的箱子获取的是否正确
                    // 找出新增的箱子 删除不在的箱子
                    var newCJobArr = data.ctnList;
                    var oldCJobArr = that.jobPlanContainer ? that.jobPlanContainer : data.ctnList;
                    var isWork = '', inOldArr;
                    $.each(newCJobArr, function (k, v) {
                        inOldArr = false;
                        $.each(oldCJobArr, function (m, n) {
                            if (v['CTN_NO'] === n['CTN_NO']) {
                                inOldArr = true;
                            }
                        })
                        if (!inOldArr) {
                            newJobArr.push(v);
                            oldCJobArr.push(v);
                        }
                    })
                    // 去除newDevices中没有的设备得到当前在场设备
                    $.each(oldCJobArr, function (k, v) {
                        isWork = false;
                        $.each(newCJobArr, function (m, n) {
                            if (v['CTN_NO'] === n['CTN_NO']) {
                                isWork = true;
                                // tempArr.push(v);
                            }
                        })
                        !isWork && noJobArr.push(v);
                    });
                    that._popLayer._containerJobList.render(data);
                    that._popLayer._containerJobList.renderNewBoxAndRmCompleteBox(newJobArr, noJobArr);
                },
                error: function (data, status) {
                    console.log(status);
                }
            });
        },
        /**
         * 获取当前搜索箱子的实时信息
         * @param  {object} args 请求所需参数
         */
        getSearchBox: function () {
            var that = this;
            if (this._isgetSearchBox) {
                return false;
            }
            var ajaxConfig = {
                url: '/portvision/mainObject/ctn/obj/ctn_no/EQUALS/' + this.searchBoxNum,
                method: 'GET',
                success: function (data) {
                    console.log('data');
                    if (data && typeof (data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    that._isgetReachstackersing = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var boxMarkers = data;
                    $.each(boxMarkers, function (k, v) {
                        v.markerCode = 'BM' + v.OBJ_ID;
                    })
                    that.addObject('boxMarker', boxMarkers);
                }
            };
            $.ajax(ajaxConfig);
        },
        /**
         * 显示确定设备的轨迹
         */
        renderTrail: function (obj) {
            var that = this;
            this._isrenderTrail = true;
            if (this._isgetTrailing) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/data/truckGps/track?codes=' + obj._equipmentCode,
                data: '',
                success: function (data) {
                    console.log(data);
                    that._isgetTrailing = false;
                    if (!data || data.length === 0 || !that._isrenderTrail) { // 在deviceProfilePop中控制隐藏弹框时控制_isrenderTrail
                        return false;
                    }
                    var points = [], point = [], pathLine = [];
                    var temp = _.groupBy(data[0].LINE, function (item) {
                        return item.ROAD_NUM;
                    })
                    $.each(temp, function (i, item) {
                        pathLine = [];
                        $.each(item, function (j, jtem) {
                            point = [that.convertFromLng(jtem.LONGITUDE) + updateX, that.convertFromLat(jtem.LATITUDE) + updateY];
                            pathLine.push(point);
                        })
                        points.push(pathLine);
                    })
                    that.showContainerTrailMap(points);
                    $('#J_closeTrail').html('<div class="closeTrail j-closeTrail">' +
                        '关闭<br>' +
                        '轨迹' +
                        '</div>');
                    $('.device-profile-trail span').text('轨迹');
                    // parent._observer.showProfilePop(obj);
                    // that._baseMap.setMapCenter( {x: obj.initX, y:obj.initY} );
                },
                error: function (e) {
                    that._isgetTrailing = false;
                    $('.device-profile-trail span').text('轨迹');
                    console.log(e);
                }
            };
            this._isgetTrailing = true;
            $.ajax(ajaxConfig);

        },
        /**
         * 显示确定设备的轨迹
         */
        renderGPSLine: function () {
            var that = this;
            if (this._isgetGPSLine) {
                return false;
            }
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/point/gps',
                // url: '/portvision/point/line?x=122.03562857622973&y=29.88984859812649&m=122.03869978030995&n=29.888906931665133',
                // url: '../../src/js/mod/trail/gpsLine.json',
                data: '',
                success: function (data) {
                    console.log(data);
                    that._isgetGPSLine = false;
                    if (!data || data.length === 0) {
                        return false;
                    }
                    var points = [];
                    // $.each(data, function(idx, item){
                    //     var pathLine = [];
                    //     $.each( item, function(k, v){
                    //         var point = [that.convertFromLng(v.lng) + updateX,that.convertFromLat(v.lat) + updateY];
                    //         pathLine.push( point );    
                    //     })
                    //     points.push( pathLine );

                    // })
                    // that.showGPSLineMap( points );
                    $.each(data, function (k, v) {
                        // var pathLine = [];
                        var point = [that.convertFromLng(v.lng) + updateX, that.convertFromLat(v.lat) + updateY];
                        // pathLine.push( point );    
                        points.push(point);

                    })
                    var arr = [];
                    arr.push(points);
                    that.showGPSLineMap(arr);
                    // that._baseMap.setMapCenter( {x: obj.initX, y:obj.initY} );
                },
                error: function (e) {
                    that._isgetGPSLine = false;
                    console.log(e);
                }
            };
            this._isgetGPSLine = true;
            $.ajax(ajaxConfig);

        },
        /*
         * 在地图附着物层添加对象
         */
        addObject: function (type, datas) {
            if (this._isPause && this._howManyTimes > 1) {
                return false;
            }
            var that = this;
            $.each(datas, function (k, v) {
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
            this._overMap && this._overMap.addObject(type, datas);
            // this._popLayer.addObject(type, datas); // 通过overMap来同步数据            
        },

        /*
         * 经度换算x方法
         */
        convertFromLng: function (longitude) {
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
        convertToLng: function (x) {
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
        convertFromLat: function (latitude) {
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
        convertToLat: function (y) {
            var k = -41130.38612,
                a = 1229644.731;
            if (!y && y !== 0) {
                return 0;
            }
            y = parseFloat(y);
            return ((y - a) / k).toFixed(6);
        },
        /*
         * desc: 获取告警信息
         */
        getNewWarns: function () {
            var that = this;
            if (that._isgetNewWarnsing) {
                return false;
            }
            // 获取图例信息           
            var ajaxConfig = {
                method: 'get',
                url: '/portvision/object/alarm',
                data: { 'currentPage': '1', 'pageSize': '1', 'order': 'OCCURRENCE_TIME', 'key': 'READ_FLAG', 'operator': 'EQUALS', 'value': 'N' },
                success: function (data) {
                    data = JSON.parse(data);
                    that._isgetNewWarnsing = false;
                    if (!data || data.length === 0) {
                        that.updateNewWarns([]);
                        return false;
                    }

                    that.updateNewWarns(data);
                },
                error: function (e) {
                    that._isgetNewWarnsing = false;
                    console.log(e);
                }
            };
            this._isgetNewWarnsing = true;
            $.ajax(ajaxConfig);
        },
        /*
         *  更新实时告警信息
         */
        updateNewWarns: function (newWarns) {
            this._popLayer.showPop('newWarn', newWarns);
            // 暂时通过告警消息标红设备，后期需要改为设备工作字段
            this._popLayer.updateEquipmentWarns(newWarns);
        },

        /*
         *  更新告警列表
         */
        updateCurrentWarns: function (CurrentWarns) {
            this._popLayer.showPop('currentWarns', CurrentWarns);
        },

        /*
         * 更新告警消息数
         */
        updateWarnNum: function (CurrentWarns) {
            this._popLayer.showPop('warnNum', CurrentWarns);
        },

        /*
         *  隐藏浮层
         */
        hidePop: function () {
            this._popLayer.hidePop();
            this._overMap.hideSelectedEquipment && this._overMap.hideSelectedEquipment();
        },

        /*
         *  显示浮层
         */
        showPop: function (type, args) {
            this._popLayer.showPop(type, args);
        },

        /*
         *  显示信息摘要框
         */
        showProfilePop: function (obj) {
            this._popLayer.showProfilePop(obj);
            this._overMap.setSelectedEquipmentByDevice(obj);
        },

        /*
         * 
         */
        getIndexOfListAndInfo: function (args) {
            return this._overMap.getIndexOfListAndInfo(args);
        },

        /*
         * 隐藏选中的对象
         */
        hideDevice: function (args) {
            this._overMap.hideDevice(args);
        },

        /*
         *
         */
        showDevice: function (args) {
            this._overMap.showDevice(args);
        },

        /*
         *
         */
        hideHighLight: function (args) {
            this._overMap.hideHighLight(args);
        },

        /*
         *
         */
        showHighLight: function (args) {
            this._overMap.showHighLight(args);
        },




        /*
         *  通过类型ID获取设备对象
         */
        getEqpObjectByTypeId: function (type, id) {
            if (!this._overMap || !this._overMap.getEqpObjectByTypeId) {
                return false;
            }
            return this._overMap.getEqpObjectByTypeId(type, id);
        },

        /*
         *
         */
        getEqpPostionByTypeId: function (type, id) {
            return this._overMap.getEqpPostionByTypeId(type, id);
        },

        /*
         *
         */
        updateObjectChecked: function (type, datas) {
            return this._overMap.updateObjectChecked(type, datas);
        },

        /*
         *
         */
        setSelectedEquipmentFromAlarm: function (arg) {
            this._overMap.hideSelectedEquipment();
            this._overMap.setSelectedEquipmentFromAlarm(arg);
        },

        /*
         *
         */
        setSelectedEquipment: function (type, id) {
            this._overMap.hideSelectedEquipment();
            this._overMap.setSelectedEquipment(type, id);
        },

        /*
         *
         */
        setInfoPopPosition: function (args) {
            this._popLayer.setInfoPopPosition(args);
        },

        /*
         *
         */
        setInfoPopPositionByDevice: function (device) {
            this._popLayer.setInfoPopPositionByDevice(device);
            this._overMap.setSelectedEquipmentByDevice(device);
        },

        /*
         *
         */
        moveToPosition: function (args, flag) {
            this._popLayer.moveToPosition(args, flag);
        }
    });
    return MCOBSERVER;
});

