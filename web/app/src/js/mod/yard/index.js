/**
 * @module port/mod/yard 堆场
 */
define(function (require) {
    'use strict';
    var McBase = require('base/mcBase');
    var Group = require('zrender/container/Group');
    var ImageShape = require('zrender/graphic/Image');
    var Text = require('zrender/graphic/Text');
    var PolygonShape = require('zrender/graphic/shape/Polygon');
    var LineShape = require('zrender/graphic/shape/Line');
    var BezierCurveShape = require('zrender/graphic/shape/BezierCurve');
    var CircleShape = require('zrender/graphic/shape/Circle');
    var imageUrl = '../../src/js/mod/yard/images/electricPile.png';
    var JobMarkBox = require('mod/jobMarkBox/jobMarkBox');
    var BoxMarker = require('mod/boxMarker/boxMarker');
    var ProgressBar = require('mod/progressBar/progressBar');
    var GradientColor = require('gradientColor');


    var YARD = function (cfg) {
        if (!(this instanceof YARD)) {
            return new YARD().init(cfg);
        }
    };

    YARD.prototype = $.extend(new McBase(), {

        /*
         *  初始化
         */
        init: function (cfg) {
            this._zr = cfg.zr;
            this.observer = cfg.observer;
            this.zlevel = cfg.zlevel;
            this.vertices = cfg.vertices || [
                {
                    x: 0,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }, {
                    x: 1,
                    y: 0
                }, {
                    x: 1,
                    y: 1
                }],
            this.initX = cfg.initX || this.vertices[0].x;
            this.initY = cfg.initY || this.vertices[0].y;
            this.deltaX = cfg.deltaX || 0;
            this.deltaY = cfg.deltaY || 0;
            this.drawX = this.initX + this.deltaX;
            this.drawY = this.initY + this.deltaY;
            // this.drawX = this.initX;
            // this.drawY = this.initY;

            var relateX = this.vertices[1].x - this.vertices[0].x;
            var relateY = this.vertices[1].y - this.vertices[0].y;
            this.rotation = Math.atan2(relateY, relateX); // 弧度

            this.scaleRatio = cfg.scaleRatio || 1;
            this.scaleLevel = cfg.scaleLevel || 1;

            this.identity = cfg.identity; // 每个堆场的唯一标识
            this.number = cfg.number; // 堆场的地址信息
            this.yardId = cfg.yardId;
            this.yardName = cfg.yardName;
            /*if( this.yardName == '0I'){
                console.log(this.drawX, this.drawY);
                console.log(this.drawX * this.scaleRatio, this.drawY * this.scaleRatio );
            }*/
            this.yardCode = cfg.yardCode;
            this.imagePoint = {
                x: 96,
                y: 8
            };

            this.jobLine = cfg.jobLine || [];
            this.startPoint = {
                x: (this.vertices[0].x + this.vertices[2].x) / 2,
                y: (this.vertices[0].y + this.vertices[2].y) / 2
            }

            this.endPoints = {
                'LOAD': {
                    'berth1': {
                        'x': 361,
                        'y': 107
                    },
                    'berth2': {
                        'x': 457,
                        'y': 139
                    },
                    'berth3': {
                        'x': 567,
                        'y': 181
                    },
                    'berth4': {
                        'x': 674,
                        'y': 217
                    },
                    'berth5': {
                        'x': 761,
                        'y': 248
                    },
                    'berth6': {
                        'x': 886,
                        'y': 289
                    }
                },
                'DSCH': {
                    'berth1': {
                        'x': 381,
                        'y': 116
                    },
                    'berth2': {
                        'x': 477,
                        'y': 148
                    },
                    'berth3': {
                        'x': 587,
                        'y': 189
                    },
                    'berth4': {
                        'x': 694,
                        'y': 226
                    },
                    'berth5': {
                        'x': 781,
                        'y': 257
                    },
                    'berth6': {
                        'x': 906,
                        'y': 299
                    }
                },
                'DLVR': {
                    'x': 252,
                    'y': 463
                },
                'RECV': {
                    'x': 514,
                    'y': 488
                }

            };
            this.teu = parseFloat(cfg.teu) || 0; // 堆存量
            this.sourceTeu = cfg.sourceTeu ? parseFloat(cfg.sourceTeu) : 0; // 堆存量

            //this.showChangeAnimation( this.sourceTeu - this.teu );
            this.deltaTxt = this.teu - this.sourceTeu;


            /*if( this.yardName == '1D'){
                console.log( this.teu );
            }*/

            this.capability = cfg.capability || 0; // 堆存能力

            this.volumeText = this.teu + '/' + this.capability;
            this.storageRatio = parseInt(this.teu / this.capability * 10);
            this.isShowQuota = cfg.isShowQuota === true ? true : false;
            this.isShowByThemodynamic = cfg.isShowByThemodynamic === true ? true : false;
            this.isShowJobLine = cfg.isShowJobLine === true ? true : false;
            this.functiontype = cfg.functiontype || 'DEFALUT';
            //this.themodynamicColors = ['#ffcccc','#ffb8b8','#ffa2a2','#ff9090','#ff7777','#f46666','#e55656','#d94a4a','#ce3d3d','#c33333'];
            this.themodynamicColors = ['#e5e5e5', '#d9d9d9', '#cccccc', '#bfbfbf', '#b3b3b3', '#a6a6a6', '#999999', '#8c8c8c', '#808080', '#737373'];
            this.functionColors = {
                DANGEROUS: '#ffb8b8',
                SPECIAL: '#ddadff',
                ES: '#90ff95',
                RTG: '#94ddff',
                DEFALUT: '#ccc'
            };
            this.textColors = {
                //DANGEROUS: '#d1415c',
                DANGEROUS: '#697986',
                SPECIAL: '#697986',
                ES: '#697986',
                //RTG: '#fff',
                RTG: '#697986',
                DEFALUT: '#697986'
            };
            this.lineColors = {
                LOAD: '#6587FF', // 装船
                DLVR: '#38D016', // 提箱
                DSCH: '#F58F00', // 卸船
                RECV: '#F36067'  // 进箱
            }
            this.themodynamicColor = this.storageRatio < 10 ? this.themodynamicColors[this.storageRatio] : this.themodynamicColors[9];
            this.functionColor = this.functionColors[this.functiontype];
            this.functionBayColors = new GradientColor().getColors('#fff', this.functionColor, 10);
            //this.functionBayColors = this.themodynamicColors;
            this.jobContainer = cfg.jobContainer;
            this.nextContainer = cfg.nextContainer;
            this.totalBayNum = cfg.totalBayNum || 85;
            this.jobBoxBayNum = cfg.jobBoxBayNum;
            this.nextBoxBayNum = cfg.nextBoxBayNum;
            this.yardWidth = Math.sqrt((this.vertices[0].x - this.vertices[1].x) * (this.vertices[0].x - this.vertices[1].x) + (this.vertices[0].y - this.vertices[1].y) * (this.vertices[0].y - this.vertices[1].y));
            this.yardHeight = Math.sqrt((this.vertices[0].x - this.vertices[3].x) * (this.vertices[0].x - this.vertices[3].x) + (this.vertices[0].y - this.vertices[3].y) * (this.vertices[0].y - this.vertices[3].y));


            this.stepBayX = relateX * 2 / this.totalBayNum; // 按贝位划分后，每个贝位x跨度的值
            this.stepBayY = relateY * 2 / this.totalBayNum; // 按贝位划分后，每个贝位y跨度的值
            this.bayCapability = this.capability / this.totalBayNum * 2;
            this.bays = cfg.bays;

            return this;
        },
        /*
         * 更新
         */
        update: function (cfg) {
            this.isShowChangeAnimating = false;
            this.jobLine = cfg.jobLine || this.jobLine;
            this.teu = cfg.teu || this.teu; // 堆存量
            this.sourceTeu = cfg.sourceTeu && (cfg.sourceTeu <= 0 ? 0 : cfg.sourceTeu.toFixed(1)) || this.sourceTeu; // 堆存量
            this.deltaTxt = this.teu - this.sourceTeu;
            this.capability = cfg.capability || this.capability; // 堆存能力
            this.volumeText = this.teu + '/' + this.capability;
            this.storageRatio = parseInt(this.teu / this.capability * 10);
            this.isShowQuota = cfg.isShowQuota === undefined ? this.isShowQuota : cfg.isShowQuota;
            this.isShowByThemodynamic = cfg.isShowByThemodynamic === undefined ? this.isShowByThemodynamic : cfg.isShowByThemodynamic;
            this.isShowJobLine = cfg.isShowJobLine === undefined ? this.isShowJobLine : cfg.isShowJobLine;
            this.totalBayNum = cfg.totalBayNum || this.totalBayNum;
            this.jobBoxBayNum = cfg.jobBoxBayNum || this.jobBoxBayNum;
            this.nextBoxBayNum = cfg.nextBoxBayNum || this.nextBoxBayNum;
            this.bays = cfg.bays || this.bays;
            /*if( this.yardName == '1D'){
                console.log( this.teu );
            }*/
            this.remove();
            this.draw();
        },

        /*
         * 删除
         */
        remove: function () {
            this._remove();
        },

        /*
         * 显示动画
         */
        /*showChangeAnimation: function( delta ){
            this.deltaTxt = delta.toFixed(1);
            this.isShowChangeAnimating = true;
        },*/
        /*
         * @ 根据堆场类型显示线图
         *
         */
        showByFunctiontype: function (args) {
            this.isShowByThemodynamic = false;
            this.draw();

        },
        /*
         * @ 以热力图方式显示
         *
         */
        showByThemodynamic: function () {
            this.isShowByThemodynamic = true;
            this.themodynamicColor = this.themodynamicColors[this.storageRatio];
            this.draw();
        },
        /*
         * @ 以贝位热力图方式显示
         *
         */
        showByBayThemodynamic: function () {
            this.isShowByBayThemodynamic = true;
            var that = this;
            var group = this._group;
            var bays = _.sortBy(this.bays, function (cfg) {
                return parseInt(cfg.BAY)
            });

            $.each(bays, function (k, b) {
                that.renderBayThemodynamic(b);
            })

        },
        /*
         * @ 根据参数重绘
         * @ param object
         * @ {
         *    x: 横向位移数据,
         *    y: 纵向位移数据,
         *    scale: 缩放比例,
         *    scaleLevel: 显示级别
         *   }
         */
        redrawByPosScale: function (args) {
            //console.log( args );
            this.drawX = this.initX + args.x;
            this.drawY = this.initY + args.y;
            // this.deltaX = args.x;
            // this.deltaY = args.y;
            this.scaleRatio = args.scale;
            this.scaleLevel = args.scaleLevel;
            this.draw();
        },
        /*
         * @ 响应切换显示关键指标
         * @ param: bool
         * @ 是否显示（true：显示, false: 隐藏）
         */
        switchQuota: function (isShowQuota) {
            this.isShowQuota = isShowQuota;
            this.draw();
        },


        /*
         *
         */
        draw: function () {
            var zr = this._zr,
                group = this._group,
                textNum = this.yardName + '',
                volumeText = this.volumeText,
                vertices = this.vertices,
                scale = this.scaleRatio,
                rotation = this.rotation,
                that = this;
            if (group) {
                zr.remove(this._group);
            };
            group = this._group = new Group({
                position: [this.drawX * scale, this.drawY * scale],
                // position: [(this.drawX + this.deltaX /scale) * scale , this.drawY * scale + this.deltaY],
                scale: [scale, scale],
                rotation: 0
            });
            var points = [
                [0, 0]
            ];
            for (var i = 1; i < vertices.length; i++) {
                points.push([(vertices[i].x - vertices[0].x), (vertices[i].y - vertices[0].y)]);
            }
            var fillColor = this.isShowByThemodynamic ? this.themodynamicColor : this.functionColor;
            var textColor = this.textColors[this.functiontype];

            this.rectPolygon = new PolygonShape({
                style: {
                    fill: fillColor,
                    //stroke: fillColor,
                    stroke: textColor,
                    lineWidth: 1,
                    //text: this.isShowQuota && ( this.scaleLevel >= this.edgeScaleLevel ) ? this.sourceTeu /*textNum + '：' + *//*volumeText*/ : textNum ,
                    text: this.isShowQuota ? this.teu + ' ( ' + textNum + ' )' : textNum,
                    textBaseline: 'top',
                    textOffset: [0, -60 * this.rotation * scale],
                    textRotation: this.rotation,
                    textFill: textColor,
                    //textFill:'#fff',
                    textFont: 6 * scale + 'px Microsoft Yahei'
                },
                shape: {
                    //points: [[0, 0], [108, 37], [102, 56], [-6, 18]],
                    points: points
                },
                zlevel: this.zlevel
            })
            /*.on('dblclick', function(ev){
                            that.observer.showPop('blockDetail', that);
                            ev.cancelBubble = true;
                        })*/
            ;
            this.drawJobLine();

            if (this.deltaTxt) {
                this.changeTxt = this.renderChangeAnimate(); //增加数值变化动画
            } else {
                delete this.changeTxt;
            }



            //console.log( this.changeTxt );
            group.add(this.rectPolygon);
            if (this.functiontype === 'SPECIAL') {
                this.pileImage = this.renderPileImage();
                group.add(this.pileImage);
            }
            if (this.jobBoxBayNum || this.nextBoxBayNum) {
                this.boxGroup = this.renderBoxGroup();
                group.add(this.boxGroup);
            }
            //( this.scaleLevel >= this.edgeScaleLevel ) && this.isShowChangeAnimating && group.add( this.changeTxt );
            this.changeTxt && group.add(this.changeTxt);
            /*if( this.scaleLevel >= this.edgeScaleLevel ){
                this.showByBayThemodynamic();
            } */
            group.on('dblclick', function (ev) {
                that.observer.showPop('blockDetail', that);
                ev.cancelBubble = true;
            })
            // group.add(this.renderBoxMarker());
            zr.add(group);
        },
        /**
         * desc: 绘制箱子位置
         */
        /**
         GPS_ACTUAL_LOCATION: 'NPASQ'
         GPS_ACTUAL_POSITION_BLOCK: '0C'
         GPS_ACTUAL_POSITION_QUALIFER: 'Y'
         GPS_ACTUAL_SLOT_POSITION: '3002.3'
         GPS_CTN_NO: 'MSKU1234755'
         GPS_ID: '2254'
         GPS_INSERT_TIME: '2017-09-18 23:50:00.0'
         GPS_LATITUDE: ''
         GPS_LONGITUDE: ''
         GPS_PLAN_LOCATION: ''
         GPS_PLAN_POSITION_BLOCK: ''
         GPS_PLAN_POSITION_QUALIFER: ''
         GPS_PLAN_SLOT_POSITION: ''
         OBJ_ACTIVE_FLAG: ''
         OBJ_CTN_CATEGORY: ''
         OBJ_CTN_HEIGHT: '289'
         OBJ_CTN_NO: 'MSKU1234755'
         OBJ_CTN_OPERATOR_CODE: 'MSK'
         OBJ_CTN_SIZE: '45'
         OBJ_CTN_TYPE: 'GP'
         OBJ_CTN_WEIGHT: '4000'
         OBJ_ID: '32747'
         OBJ_INSERT_TIME: ''
         OBJ_REMARKS: ''
         OBJ_TARE_WEIGHT: '0'
         OBJ_TRADE_NW: 'W'
         STA_CARGO_CODE: ''
         STA_CTN_CATEGORY: ''
         STA_CTN_IS_FUTURE: '0'
         STA_CTN_NO: 'MSKU1234755'
         STA_CTN_STATUS: 'F'
         STA_CURRENT_STATUS: 'Y'
         STA_DAMAGE_FLAG: 'N'
         STA_DESTINATION_PORT_CODE: ''
         STA_DISCHARGE_PORT_CODE: ''
         STA_HAZARD_FLAG: 'N'
         STA_HAZARD_TYPE: ''
         STA_ID: '2254'
         STA_INBOUND_CARRIER: ''
         STA_INBOUND_CATEGORY: ''
         STA_INQUAY_TIME: ''
         STA_INSERT_TIME: '2017-09-18 23:50:00.0'
         STA_INYARD_TIME: ''
         STA_IN_VOYAGE: ''
         STA_JOB_TYPE: 'DLVR'
         STA_LOAD_PORT_CODE: ''
         STA_OD_FLAG: 'N'
         STA_OD_TYPE: ''
         STA_OUTBOUND_CARRIER: ''
         STA_OUTBOUND_CATEGORY: ''
         STA_OUTQUAY_TIME: ''
         STA_OUTYARD_TIME: ''
         STA_OUT_VOYAGE: ''
         STA_REEFER_FLAG: 'N'
         STA_SEAL_NO: ''
         STA_SERVICE_CODE: ''
         STA_TRANSFER_PORT_CODE: ''
         STA_VESSEL_CODE: ''
         STA_VESSEL_REFERENCE: ''
         */
        // renderBoxMarker: function (box) {
        //     var boxMarker = null,
        //         boxMarkerGroup = new Group({
        //             position: [0, 0],
        //             rotation: -this.rotation,
        //             style: {
        //                 width: this.yardWidth,
        //                 height: this.yardHeight,
        //             }
        //         });
        //     boxMarker = new BoxMarker({
        //         zlevel: this.zlevel,
        //         rotation: this.rotation,
        //         // width: this.yardWidth,
        //         // height: this.yardHeight,
        //         position: [50, 5]
        //     });
        //     boxMarkerGroup.add(boxMarker);
        //     return boxMarkerGroup;
        // },
        // 绘制数值变化动画
        renderChangeAnimate: function () {
            var scale = this.scaleRatio;
            var rotation = this.rotation;
            var startTime = 1000;

            /*if( this.deltaTxt ) {
                this.rectPolygon.animate('style', false)
                .when(0, {
                    text:  parseFloat(this.sourceTeu).toFixed(1),
                     })
                .when(2000 + startTime, {
                    text: parseFloat(this.teu).toFixed(1) ,
                }).start();
            } */
            var changeTxt = new Text({
                scale: [1 / scale, 1 / scale],
                position: [(this.vertices[1].x - this.vertices[0].x - 5), (this.vertices[1].y - this.vertices[0].y)],
                style: {
                    text: this.deltaTxt > 0 ? '+' + this.deltaTxt : this.deltaTxt,
                    stroke: this.deltaTxt > 0 ? 'green' : 'red',
                    textAlign: 'center',
                    x: 0,
                    y: 0,
                    textFont: 12 + 'px Microsoft Yahei'
                },
                zlevel: this.zlevel + 5
            });
            var outPos = [(this.vertices[1].x - this.vertices[0].x) / 2, (this.vertices[1].y - this.vertices[0].y) / 2 - 10];
            var inPos = [(this.vertices[1].x - this.vertices[0].x) / 2, (this.vertices[1].y - this.vertices[0].y) / 2 + 0];

            changeTxt.animate('', false)
                .when(0, {
                    position: [-99999, -99999]
                })
                .when(startTime - 1, {
                    position: [-99999, -99999]
                })
                .when(startTime, {
                    position: this.deltaTxt > 0 ? outPos : inPos
                })
                .when(3000 + startTime, {
                    position: this.deltaTxt > 0 ? inPos : outPos
                }).start();
            changeTxt.animate('style', false)
                .when(0, {
                    //position:  [(vertices[1].x - vertices[0].x - 5),(vertices[1].y - vertices[0].y)],
                    opacity: 0
                })
                .when(1500 + startTime, {
                    //position:  [(vertices[1].x - vertices[0].x - 5),(vertices[1].y - vertices[0].y)],
                    opacity: 1
                })
                .when(2000 + startTime, {
                    //position:  [(vertices[1].x - vertices[0].x - 5),(vertices[1].y - vertices[0].y - 10)],
                    opacity: 0
                }).start();

            return changeTxt;
        },
        // 绘制数值变化动画
        renderPileImage: function () {
            var pileImage = new ImageShape({
                rotation: -this.rotation,
                style: {
                    image: imageUrl,
                    width: this.imagePoint.x,
                    height: this.imagePoint.y
                },
                zlevel: this.zlevel + 4
            })
            /*.on('dblclick', function(ev){
                            that.observer.showPop('blockDetail', that);
                            ev.cancelBubble = true;
                        })*/
            ;
            return pileImage;
        },
        // 绘制箱子
        renderBoxGroup: function () {
            var boxGroup = new Group({
                position: [0, 0],
                rotation: -this.rotation,
                style: {
                    width: this.yardWidth,
                    height: this.yardHeight
                }
            });
            if (this.jobContainer.OBJ_CTN_NO) {
                var boxPosi = [this.jobBoxBayNum / this.totalBayNum * this.yardWidth, this.yardHeight * 0.5];
                // 堆场正在作业的箱子
                var jobBox = new JobMarkBox({
                    zlevel: this.zlevel,
                    // rotation: -this.rotation,
                    // scale: this.scaleRatio,
                    width: 6,
                    height: 3,
                    // position: [95, this.yardHeight * 0.5],
                    position: boxPosi,
                    boxType: this.formateContainerIcon(this.jobContainer),
                    // boxType: ['empty', 'reefer', 'oog-all'],
                    emptyWeightStatus: this.jobContainer.STA_CTN_STATUS === 'E' ? 'empty' : 'weight',
                    inOutStatus: 'in',
                    boxNumText: this.jobBoxBayNum === this.nextBoxBayNum ? '2' : ''
                })
                boxGroup.add(jobBox);
            }


            if (this.nextContainer.OBJ_CTN_NO) {
                var nextBox = this.renderNextBox();
                nextBox && boxGroup.add(nextBox);
            }


            return boxGroup;
        },
        // 绘制下一个箱子
        renderNextBox: function () {
            var nextPosi = [this.nextBoxBayNum / this.totalBayNum * this.yardWidth, this.yardHeight * 0.5];
            var theNextBox = new JobMarkBox({
                zlevel: this.zlevel,
                width: 6,
                height: 3,
                position: nextPosi,
                boxType: this.formateContainerIcon(this.jobContainer),
                emptyWeightStatus: this.jobContainer.STA_CTN_STATUS === 'E' ? 'empty' : 'weight',
                inOutStatus: 'in'
            })
            //console.log( nextBox , this.yardName);
            return theNextBox;
        },

        /**
         * desc: 格式化箱图标
         */
        // TODO: 箱图标复合图标逻辑需重组
        formateContainerIcon: function (args) {
            var specialIcon = []; // 特殊箱标记icon类型
            // 1.危险品&空箱 2.冷冻箱标记 3.超限标记
            if (args.STA_HAZARD_TYPE) { // 危险品类型
                if (args.STA_HAZARD_TYPE.indexOf('爆炸') > -1) {
                    specialIcon.push('dg-1');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃气体') > -1 || args.STA_HAZARD_TYPE.indexOf('不易燃气体') > -1 || args.STA_HAZARD_TYPE.indexOf('易燃气体') > -1) {
                    specialIcon.push('dg-2');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃液体') > -1) {
                    specialIcon.push('dg-3');
                } else if (args.STA_HAZARD_TYPE.indexOf('易燃固体') > -1 || args.STA_HAZARD_TYPE.indexOf('自燃气体') > -1) {
                    specialIcon.push('dg-4');
                } else if (args.STA_HAZARD_TYPE.indexOf('氧化剂') > -1 || args.STA_HAZARD_TYPE.indexOf('过氧化') > -1) {
                    specialIcon.push('dg-5');
                } else if (args.STA_HAZARD_TYPE.indexOf('毒') > -1 || args.STA_HAZARD_TYPE.indexOf('感染') > -1) {
                    specialIcon.push('dg-6');
                } else if (args.STA_HAZARD_TYPE.indexOf('放射') > -1) {
                    specialIcon.push('dg-7');
                } else if (args.STA_HAZARD_TYPE.indexOf('腐蚀') > -1) {
                    specialIcon.push('dg-8');
                } else if (args.STA_HAZARD_TYPE.indexOf('其他') > -1 || args.STA_HAZARD_TYPE.indexOf('其它') > -1) {
                    specialIcon.push('dg-9');
                }
                // specialIcon = specialIcon === '' ? '!' + args.STA_HAZARD_TYPE : 'compound-rule';
            }  else if (args.STA_CTN_STATUS) { // 空重状态
                args.STA_CTN_STATUS === 'E' && specialIcon.push('empty');
            } else if (args.STA_REEFER_FLAG) { // 温控标记
                args.STA_REEFER_FLAG === 'Y' && specialIcon.push('reefer');
            } else if (args.STA_OD_TYPE) { // 超限类型 当前无数据
                // 初始specialIcon为空直接判断
                // specialIcon = args.STA_OD_TYPE;
            } 
            // else if (args.STA_DAMAGE_FLAG) { // 残损标记
            //     if (specialIcon === '') {
            //         specialIcon = args.STA_DAMAGE_FLAG === 'Y' ? 'damage' : '';
            //     } else {
            //         specialIcon = 'compund-rule';
            //     }
            // }
            return specialIcon;
        },

        // 绘制贝位热力图信息
        renderBayThemodynamic: function (cfg) {
            if (!cfg.TEU) {
                return false;
            }
            var bay = parseInt(cfg.BAY);
            var bayNum = bay % 2 ? (bay + 1) / 2 : bay / 2;
            bayNum -= 1;
            var nextBayNum = bay % 2 ? bayNum + 1 : bayNum + 2;
            var teuPercent = parseInt(cfg.TEU * 100 / this.capability);
            var group = this._group;
            var vertices = this.vertices;

            //console.info( bayNum, teuPercent, cfg.TEU );

            //this.stepBayX = this.yardWidth / this.totalBayNum;  // 按贝位划分后，每个贝位x跨度的值
            //this.stepBayY = this.yardHeight / this.totalBayNum; // 按贝位划分后，每个贝位y跨度的值
            var points = [
                [bayNum * this.stepBayX, bayNum * this.stepBayY],
                [nextBayNum * this.stepBayX, nextBayNum * this.stepBayY],
                [(vertices[3].x - vertices[0].x + nextBayNum * this.stepBayX), (vertices[3].y - vertices[0].y + nextBayNum * this.stepBayY)],
                [(vertices[3].x - vertices[0].x + bayNum * this.stepBayX), (vertices[3].y - vertices[0].y + bayNum * this.stepBayY)]
            ];
            var fillColor = this.isShowByThemodynamic ? this.themodynamicColors[teuPercent] : this.functionBayColors[teuPercent];

            var rectPolygon = new PolygonShape({
                style: {
                    fill: fillColor,
                    stroke: fillColor,
                    lineWidth: 1
                },
                shape: {
                    points: points
                },
                zlevel: this.zlevel + 1
            })

            group.add(rectPolygon);

        },

        // 线图作业量
        drawJobLine: function () {
            var that = this;
            var group = this._group;
            var startPoint = {
                    x: 0,
                    y: 0
                },
                endPoint = {
                    x: 0,
                    y: 0
                },
                lineColor;
            var selecJobArr = [];
            this.startPoint = {
                x: (this.vertices[2].x - this.vertices[0].x) / 2,
                y: (this.vertices[2].y - this.vertices[0].y) / 2
            };

            if (!this.jobLine || this.jobLine.length === 0) {
                return false;
            }
            if (this.curveGroup) {
                this.curveGroup.remove();
            }
            this.curveGroup = new Group();
            $.each(this.jobLine, function (k, v) {
                startPoint.x = that.startPoint.x;
                startPoint.y = that.startPoint.y;
                lineColor = that.lineColors[v.type];
                //console.log(v);
                // if(v.type == 'LOAD' || v.type == 'DSCH')    endPoint = {x: that.endPoints[('berth'+v.BERTH).trim()].x - that.vertices[0].x, y:that.endPoints[('berth'+v.BERTH).trim()].y - that.vertices[0].y };
                // else endPoint = {x: that.endPoints[v.type].x - that.vertices[0].x, y: that.endPoints[v.type].y - that.vertices[0].y };
                if (v.type === 'LOAD') {
                    endPoint = {
                        x: that.endPoints['LOAD'][('berth' + v.BERTH).trim()].x - that.vertices[0].x,
                        y: that.endPoints['LOAD'][('berth' + v.BERTH).trim()].y - that.vertices[0].y
                    }
                    that.addBezierCurveShapes(startPoint, endPoint, 1, lineColor);
                } else if (v.type === 'DSCH') {
                    endPoint = {
                        x: that.endPoints['DSCH'][('berth' + v.BERTH).trim()].x - that.vertices[0].x,
                        y: that.endPoints['DSCH'][('berth' + v.BERTH).trim()].y - that.vertices[0].y
                    }
                    that.addBezierCurveShapes(endPoint, startPoint, 1, lineColor);
                } else if (v.type === 'DLVR') {
                    endPoint = {
                        x: that.endPoints[v.type].x - that.vertices[0].x,
                        y: that.endPoints[v.type].y - that.vertices[0].y
                    };
                    that.addBezierCurveShapes(startPoint, endPoint, 1, lineColor);
                } else {
                    endPoint = {
                        x: that.endPoints[v.type].x - that.vertices[0].x,
                        y: that.endPoints[v.type].y - that.vertices[0].y
                    };
                    that.addBezierCurveShapes(endPoint, startPoint, 1, lineColor);
                }
            });

        },
        addBezierCurveShapes: function (startP, endP, num, lineColor, lineWidth) {
            var zr = this._zr,
                group = this._group;
            if (startP.x === endP.x && startP.y === endP.y) return; // 同一个点不处理
            lineWidth = lineWidth || 1;
            lineColor = lineColor || '#000';

            var startCircle = new CircleShape({
                // position: [startP.x, startP.y],
                // position: [0,0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: 2
                },
                style: {
                    fill: lineColor,
                    stroke: lineColor,
                    // opacity: 0.6,
                    lineWidth: 1
                },
                zlevel: this.zlevel + 5
            })
            this.curveGroup.add(startCircle);

            // var rotation = Math.atan2((endP.y - startP.y),(endP.x - startP.y));
            // var triangle = new PolygonShape({
            //     // rotation: -Math.PI,
            //     style: {
            //         fill: lineColor,
            //         stroke: lineColor,
            //         lineWidth: 1,
            //     },
            //     shape: {
            //         //points: [[0, 0], [108, 37], [102, 56], [-6, 18]],
            //         // points: [[startP.x, startP.y-3], [startP.x+10, startP.y], [startP.x, startP.y+3]]
            //         points: [[startP.x, startP.y], [startP.x+10, startP.y+3], [startP.x, startP.y+6]]
            //     },
            //     zlevel: this.zlevel + 5,
            // })
            // this.curveGroup.add(triangle);

            startCircle.animate('', true)
                .when(0, {
                    position: [startP.x, startP.y]
                })
                .when(3000, {
                    position: [endP.x, endP.y]
                })
                .start();

            var endCircle = new CircleShape({
                position: [endP.x, endP.y],
                // position: [0,0],
                // scale: [1, 1],
                shape: {
                    cx: 0,
                    cy: 0,
                    r: 2
                },
                style: {
                    fill: lineColor,
                    stroke: lineColor,
                    // opacity: 0.05,
                    lineWidth: 2
                },
                zlevel: this.zlevel + 1
            })
            // this.curveGroup.add(endCircle)

            var offsetX = Math.abs((startP.x - endP.x) / 2),
                offsetY = Math.abs((startP.y - endP.y) / 2),
                centerX = startP.x - endP.x > 0 ? endP.x + offsetX : startP.x + offsetX,
                centerY = startP.y - endP.y > 0 ? endP.y + offsetY : startP.y + offsetY,
                twoPointLineSlope = (startP.y - endP.y) / (startP.x - endP.x),
                slope = -1 / twoPointLineSlope,
                b = centerY - (slope * centerX),
                maxAngle = Math.PI / 6,
                toCenterDis = Math.sqrt(offsetX * offsetX + offsetY * offsetY) / 2,
                // 30º线和垂线到两点间线的距离
                verticalMaxoffset = Math.tan(maxAngle) * toCenterDis,
                verticaloffX = ~~(Math.cos(Math.atan(slope)) * verticalMaxoffset),
                verticaloffY = ~~(Math.sin(Math.atan(slope)) * verticalMaxoffset),
                avgDistance = twoPointLineSlope === 0 ? verticaloffY * 2 / num : verticaloffX * 2 / num,
                anchor = {};
            if (num > 20) {
                //console.log(num);
                num = 20;
            }

            for (var i = 0; i < num; i++) {
                if (num % 2 === 0) {
                    // y = kx + b
                    if (i >= num / 2) {
                        anchor.x = twoPointLineSlope === 0 ? centerX : centerX - ((i - ~~(num / 2) + 1) * avgDistance);
                        anchor.y = twoPointLineSlope === 0 ? centerY - ((i - ~~(num / 2) + 1) * avgDistance) : slope * anchor.x + b;
                    } else {
                        anchor.x = twoPointLineSlope === 0 ? centerX : centerX + ((i + 1) * avgDistance);
                        anchor.y = twoPointLineSlope === 0 ? centerY + ((i + 1) * avgDistance) : slope * anchor.x + b;
                    }
                } else {
                    if (i >= num / 2) {
                        anchor.x = twoPointLineSlope === 0 ? centerX : centerX - ((i - ~~(num / 2)) * avgDistance);
                        anchor.y = twoPointLineSlope === 0 ? centerY - ((i - ~~(num / 2)) * avgDistance) : slope * anchor.x + b;
                    } else {
                        anchor.x = twoPointLineSlope === 0 ? centerX : centerX + (i * avgDistance);
                        anchor.y = twoPointLineSlope === 0 ? centerY + (i * avgDistance) : slope * anchor.x + b;
                    }
                }
                var curve = new BezierCurveShape({
                    position: [0, 0],
                    scale: [1, 1],
                    shape: {
                        x1: startP.x,
                        y1: startP.y,
                        x2: endP.x,
                        y2: endP.y,
                        cpx1: anchor.x,
                        cpy1: anchor.y,
                        cpx2: anchor.x,
                        cpy2: anchor.y
                    },
                    style: {
                        // text: 3,
                        lineWidth: 1,
                        stroke: lineColor + ''
                    },
                    zlevel: this.zlevel + 5,
                    draggable: false
                });
                this.curveGroup.add(curve);
            }

            group.add(this.curveGroup);
            this.isShowJobLine ? this.curveGroup.show() : this.curveGroup.hide();
        },
        hideJobLine: function () {
            this.isShowJobLine = false;
            this.curveGroup && this.curveGroup.hide();
        },
        showJobLine: function () {

            this.isShowJobLine = true;
            this.curveGroup && this.curveGroup.show();
        }

    });

    return YARD;
});