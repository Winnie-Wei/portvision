/**
 * @module mod/DEVICEPROFILEPOP 设备概况
 */
define(function(require) {
    'use strict';
    var jsrender = require('plugin/jsrender/jsrender');

    var templateDeviceProfile = jsrender.templates(
        '<div class="device-profile popup radius4">'
            + '<div class="device-profile-ico" style="background:url(../../src/css/mod/device/images/{{>deviceType}}/{{>url}}.png) center center no-repeat #ffffff;"></div>'
            + '{{if deviceType == "container"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +    '<p>车牌号: <span>{{>OBJ_TRUCK_LICENSE}}</span><p>'
                +    '<p>编号: <span>{{>STA_TRUCK_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>workStatusStyleMap[STA_WORK_STATUS]}}">{{>workStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前载重：<span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-trail"><span data-id="{{>id}}" class="j-trail">轨迹</span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "bridgecrane"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>workStatusStyleMap[STA_WORK_STATUS]}}">{{>workStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "gantrycrane"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>workStatusStyleMap[STA_WORK_STATUS]}}">{{>workStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "reachstacker"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>workStatusStyleMap[STA_WORK_STATUS]}}">{{>workStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "stacker"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +     '<p>设备名称: <span>{{>OBJ_EQUIPMENT_CNAME}}</span><p>'
                +    '<p>编号: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                +     '<p>状态: <span class="status-{{>workStatusStyleMap[STA_WORK_STATUS]}}">{{>workStatusMap[STA_WORK_STATUS]}}</span></p>'
                +    '<p>当前吊载: <span>{{>STA_LOAD_WEIGHT}}</span><p>'
                +   '<p>平均作业效率（MPH）：<span>{{>avgWorkEffi}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "ship"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>船舶代码: <span>{{>STA_VESSEL_REFERENCE}}</span><p>'
                +   '<p>船舶中文名: <span>{{>OBJ_VESSEL_NAMEC}}</span><p>'
                +   '<p>航次: <span>{{>OBJ_VESSEL_UN_CODE}}</span><p>'
                +   '<p>状态: <span class="status-{{>workStatusStyleMap[STA_CURRENT_STATUS]}}">{{>boatCurrentStatus}}</span></p>'
                +   '<p>船时效率（MPH）：<span>{{>STA_SINGLE_CRANE_EFFICIENCY}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-view"><span data-id="{{>id}}" class="j-boatView">视图</span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "camera"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>设备编号: <span>{{>OBJ_CAMERA_CODE}}</span><p>'
                +   '<p>可视范围: <span>{{>OBJ_CAMERA_VIEW_RANGE}}</span><p>'
                +   '<p>监控区域: <span>{{>GPS_MONITOR_AREA}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "hydrant"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>设备编号: <span>{{>FZWID}}</span><p>'
                // +   '<p>可视范围: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                // +   '<p>监控区域: <span>{{>OBJ_EQUIPMENT_CODE}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "smokeSensor"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>设备编号: <span>{{>OBJ_DETECTOR_CODE}}</span><p>'
                +   '<p>检测范围: <span>{{>OBJ_DETECTOR_RANGE}}</span><p>'
                +   '<p>报警限值: <span>{{>OBJ_DETECTOR_ALARM_VALUE}}</span><p>'
                +   '<p>状态: <span>{{>STA_IS_ALARM}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "temperatureSensor"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>设备编号: <span>{{>OBJ_DETECTOR_CODE}}</span><p>'
                +   '<p>检测范围: <span>{{>OBJ_DETECTOR_RANGE}}</span><p>'
                +   '<p>报警限值: <span>{{>OBJ_DETECTOR_ALARM_VALUE}}</span><p>'
                +   '<p>状态: <span>{{>STA_IS_ALARM}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                // + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "boxMarker"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>设备编号: <span>{{>deviceType}}</span><p>'
                +   '<p>检测范围: <span>...</span><p>'
                +   '<p>报警限值: <span>...</span><p>'
                +   '<p>报警限值: <span>...</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "berthFlag"}}'
                + '<div class="device-profile-info status-{{>workStatus}}">'
                +   '<p>泊位编号: <span>{{>REGION_NAME}}</span><p>'
                +   '<p>泊位类型: <span>{{>REGION_TYPE}}</span><p>'
                +   '<p>停靠吨位: <span>{{>REMARK}}</span><p>'
                +   '<p>状态: <span>{{>REGION_STATUS}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'
                + '<div class="device-profile-more"><span data-id="{{>id}}" class="j-more">详情</span></div>'
            + '{{else deviceType == "gate"}}'
                + '<div class="device-profile-info status-{{>workStatus}} {{>deviceType}}">'
                +   '<p>闸口编号: <span>{{>gateText}}</span><p>'
                +   '<p>闸口类型: <span>{{>gateType}}</span><p>'
                +   '<p>作业状态: <span>{{>workStatusText}}</span><p>'
                +   '<p>闸口作业量: <span>{{>workData}}</span><p>'
                + '</div>'
                + '<div class="device-profile-close"><span class="j-close"></span></div>'                
            + '{{/if}}'
        + '</div>'
    );
    
    var DEVICEPROFILEPOP = function (cfg) {
        if (!(this instanceof DEVICEPROFILEPOP)) {
            return new DEVICEPROFILEPOP().init(cfg);
        }
    };

    DEVICEPROFILEPOP.prototype = $.extend({}, {
        init: function (cfg) {
            this.observer = cfg.observer;
            this.wraper = $('#J_newWarn');
            this.bindEvent();
            return this;
        },
        bindEvent: function () {
            var that = this;
            // 设备信息详情按钮
            $('#J_deviceProfile')
                .on('click', '.j-more', function (ev) {
                    that.hide();
                    // var it = $(ev.target);
                    // var rowNumber = it.attr('data-id');
                    that.observer.showPop('deviceDetail', that.device);

                    // delete this;
                })
                .on('click', '.j-trail', function () {
                    var dataTp;
                    // var deviceType = that.device && that.device._type;
                    switch (that.device.deviceType) {
                        case 'container': dataTp = 'containers'; break;
                        case 'bridgeCrane': dataTp = 'bridgecranes'; break;
                        case 'gantryCrane': dataTp = 'gantrycranes'; break;
                        case 'emptyContainerHandlers': dataTp = 'stackers'; break;
                        case 'reachStacker': dataTp = 'reachstackers'; break;
                    }
                    $.each(that.observer._overMap[dataTp], function (k, v) {
                        if (v._equipmentCode === that.device._equipmentCode) {
                            //that._observer.showProfilePop(v);
                            //that._observer._baseMap.setMapCenter( {x: v.initX, y:v.initY} );
                            // todo:获取选中设备的轨迹图
                            if ($('.device-profile-trail span').text() === '加载中') {
                                return false;
                            }
                            that.observer.showProfilePop(v);
                            $('.device-profile-trail span').text('加载中');
                            // that.observer._baseMap.setMapCenter( {x: v.initX, y:v.initY} );
                            that.observer.renderTrail(v);
                            that.observer._baseMap.setMapCenter && that.observer._baseMap.setMapCenter({
                                x: v.initX,
                                y: v.initY
                            });
                            that.observer._baseMap.setGdMapCenter && that.observer._baseMap.setGdMapCenter({
                                x: v.drawX * that.observer._overMap.showScale,
                                y: v.drawY * that.observer._overMap.showScale
                            })
                        }
                    })
                })
                .on('click', '.j-boatView', function () {
                    //console.log('船舶箱子详情');
                    // that.observer.showPop('boatDetail', that.device);
                    // 打开新页面
                    window.location.href = '../../views/boat/boatInfo.html#' + encodeURI(that.device._equipmentCode);
                    location.assign();
                });
        },
        /**
         * desc: 渲染设备概况弹框
         */
        renderDeviceProfile: function (args) {
            this.wraper = $('#J_deviceProfile');
            this.device = $.extend({}, args);
            //判断状态（工作中、维修、故障）
            //工作状态：NOINS:无指令空闲, YESINS:有指令空闲, WORK：工作中， FAULT:故障, REPAIR:维修
            var workStatusMap = {
                    'NOINS': '无指令空闲',
                    'YESINS': '有指令空闲',
                    'WORK': '工作中',
                    'FAULT': '故障',
                    'REPAIR': '维修',
                    'on':'开启',
                    'off':'关闭'
                },
                workStatusStyleMap = {
                    'NOINS': 'free',
                    'YESINS': 'hasJob',
                    'WORK': 'active',
                    'FAULT': 'error',
                    'REPAIR': 'repair'
                };
            switch (args.workStatus) {
                case 'WORK':
                case 1: args.iconStatus = 'active'; break;
                case 'NOINS':
                case 2: args.iconStatus = 'free'; break;
                case 'YESINS':
                case 3: args.iconStatus = 'hasJob'; break;
                case 'FAULT':
                case 4: args.iconStatus = 'error'; break;
                case 'REPAIR':
                case 5: args.iconStatus = 'repair'; break;
            }
            if (args.deviceType === 'ship') {
                switch (args.deviceData.STA_CURRENT_STATUS) {
                    case 'V_ATA': args.deviceData.boatCurrentStatus = '抵锚'; break;
                    case 'V_BERTH': args.deviceData.boatCurrentStatus = '靠泊'; break;
                    case 'V_WALT_WORK': args.deviceData.boatCurrentStatus = '等开工'; break;
                    case 'V_WORK': args.deviceData.boatCurrentStatus = '开工'; break;
                    case 'V_STOP': args.deviceData.boatCurrentStatus = '停工'; break;
                    case 'V_WAIT_ATD': args.deviceData.boatCurrentStatus = '等离泊'; break;
                    case 'V_ATD': args.deviceData.boatCurrentStatus = '离泊'; break;
                }
            }

            var dataTemp = {};
            if (args.deviceType === 'boxMarker') {
                dataTemp = $.extend({ deviceType: args.deviceType, url: 'icon-info-box' }, args.deviceData);
            } else {
                dataTemp = $.extend({ deviceType: args.deviceType, url: args.iconStatus, workStatus: args.workStatus, workStatusMap: workStatusMap, workStatusStyleMap: workStatusStyleMap, avgWorkEffi: args.avgWorkEffi }, args.deviceData);
            }
            if (args.deviceType === 'gate') {
                dataTemp = $.extend({}, args);
                dataTemp.workStatusText = workStatusMap[dataTemp.workStatus];
                dataTemp.url = dataTemp.workStatus;
            }
    
            var htmlValue = templateDeviceProfile.render(dataTemp);
            this.deviceType = args.deviceType;
            this.wraper.html(htmlValue);
            this.wraper.show();
            switch (args.mapType) {
                case 'gd': this.gd_setInfoPopPositionByDevice(args); break;
                case 'bd': this.setInfoPopPositionByDevice(args); break;
                default: this.setInfoPopPositionByDevice(args); break;
            }
            // this.bindEvent();
            //console.log( this.initLeft, this.initTop );
        },
        /**
         * desc: 显示设备简介弹框
         */
        showProfilePopByData: function (obj) {
            var deviceTp = '';
            switch (obj._type) {
                case 'container': deviceTp = 'truckSta'; break;
                case 'bridgecrane': deviceTp = 'bridgeCraneSta'; break;
                case 'gantrycrane': deviceTp = 'gantryCraneSta'; break;
                case 'stacker': deviceTp = 'emptySta'; break;
                case 'reachstacker': deviceTp = 'reachStackerSta'; break;
                case 'ship': deviceTp = 'shipSta'; break;
            }
            obj.avgWorkEffi = obj.efficiency;
            this.renderDeviceProfile(obj);
        },
        /**
         * desc: 隐藏弹框
         */
        hide: function () {
            this.wraper.hide();
            this.observer._isrenderTrail = false; // 终止渲染轨迹
        },
        /**
         * desc: 设置弹框展示的位置
         */
        setInfoPopPositionByDevice: function (device) {
            if (!device) {
                return false;
            };
            //console.log( device );
            this.device = device;
            this.mapId = this.device._equipmentCode;
            this.eqpType = this.device.deviceType;
            this.showScale = this.device.scaleRatio || this.device.showScale;
            this.posLeft = device.deviceType === 'ship' ? device.devicePopX : device.drawX;
            this.posTop = device.deviceType === 'ship' ? device.devicePopY : device.drawY;
            this.setPopPosition();
        },

        /**
         *
         */
        gd_setInfoPopPositionByDevice: function (device) {
            if (!device) {
                return false;
            };
            //console.log( device );
            this.device = device;
            this.mapId = this.device._equipmentCode;
            this.eqpType = this.device.deviceType;
            this.showScale = this.device.scaleRatio || this.device.showScale;
            this.posLeft = device.drawX;
            this.posTop = device.drawY;
            this.gd_setPopPosition();
        },
        /**
         * desc: 
         */
        setPopPosition: function () {
            var showScale = this.showScale || 1;
            this.posLeft = this.posLeft || this.initLeft;
            this.posTop = this.posTop || this.initTop;
            var posLeft = parseInt(this.posLeft * showScale - 150);
            var posTop = parseInt(this.posTop * showScale - 120);
            if (this.deviceType && this.deviceType === 'bridgecrane') {
                posTop -= 80 * this.showScale;
            } else {
                posTop -= 10 * this.showScale;
            }
            posLeft = posLeft < 0 ? 0 : posLeft;
            posTop = posTop < 0 ? 0 : posTop;
            this.wraper.find('.popup').show().css({ left: posLeft, top: posTop });
        },
        /**
         *
         */
        gd_setPopPosition: function () {
            var showScale = this.showScale || 1;
            this.posLeft = this.posLeft || this.initLeft;
            this.posTop = this.posTop || this.initTop;
            var posLeft = (this.deviceType === 'ship') ? parseInt(this.posLeft - 20) : parseInt(this.posLeft - 150);
            var posTop = parseInt(this.posTop - 120);
            if (this.deviceType && this.deviceType === 'bridgecrane') {
                posTop -= 80 * showScale;
            } else {
                posTop -= 10 * showScale;
            }
            this.wraper.find('.popup').show().css({ left: posLeft, top: posTop });
        },
        /*
         * 设置移动到指定位置
         */
        moveToPosition: function (arg, flag) {
            if (flag && arg) {
                this.posLeft = arg.x;
                this.posTop = arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
                return false;
            }
            //console.log( arg );
            if (this.device) {
                //this.mapId = this.device._mapId;
                //this.eqpType = this.device.deviceType;
                //var pos = this.getEqpPostionByTypeId();
                this.posLeft = this.device.drawX;
                this.posTop = this.device.drawY;
                this.setPopPosition();
                return false;
            }
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();

            }
        },

        /**
         * desc: 设置地图中心点
         */
        setMapCenter: function (arg) {
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
            }
        },

        /**
         * desc: 移动到地图中心点
         */
        moveToMapCenter: function (arg) {
            if (arg) {
                this.posLeft = this.initLeft + arg.x;
                this.posTop = this.initTop + arg.y;
                this.showScale = arg.scale;
                this.setPopPosition();
            }
        },

        /**
         * desc: 响应地图级别放大缩小
         */
        mapZoomChange: function (args) {
            this.showScale = args;
            if (!this.device) {
                return false;
            } else {
                //this.mapId = this.device._mapId;
                //this.eqpType = this.device.deviceType;
                //var pos = this.getEqpPostionByTypeId();
                this.posLeft = this.device.drawX;
                this.posTop = this.device.drawY;
                this.setPopPosition();
            }
        },
        /*
         * 需要观察一下
         */
        setInfoPopPosition: function (arg) {
            if (arg) {
                this.posLeft = arg.x;
                this.posTop = arg.y;
                this.showScale = arg.scale || arg.showScale || arg.observer.showScale;
                this.setPopPosition();
                return false;
            };
            if (!this.device) {
                return false;
            };
            //this.mapId = this.device._mapId;
            //this.eqpType = this.device.deviceType;
            //console.log('设备概况开始拖动'+this.deviceObj.eqpType+this.deviceObj.mapId);
            //var pos = this.getEqpPostionByTypeId();
            this.posLeft = this.device.drawX;
            this.posTop = this.device.drawY;
            this.setPopPosition();
        }

    });

    return DEVICEPROFILEPOP;
});
