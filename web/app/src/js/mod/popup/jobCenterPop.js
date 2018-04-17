/**
 * @module port/mod/popup/center 视图中央的弹框
 */
define(function(require) {
    'use strict';    
    // var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库
    var CenterPop = require('mod/popup/centerPop');
    
    var jobCenterPopTemplate =  
        '<div class="popup popup-left fixed-center md inline bay-pop">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                    + '<p class="pop-title">集装箱编号</p>'
                    + '<span class="pop-close j-close">关闭</span>'
                + '</div>'
                + '<div class="pop-body">'           
                + '</div>'
            + '</div>'
        + '</div>';  


   
    var JOBCENTERPOPUP = function (cfg) {
        if (!(this instanceof JOBCENTERPOPUP)) {
            return new JOBCENTERPOPUP().init(cfg);
        }
    };

    JOBCENTERPOPUP.prototype = $.extend(new CenterPop(), {

        /*
         *
         */
        init: function (cfg) {
            this.data = cfg.data || {};
            this.elementId = cfg.elementId || 0;
            this.observer = cfg.observer || null;
            this.wraper = $(this.elementId);
            this.wraper.html('');
            this.bindEvent();
            this.colorSet = cfg.colorSet || null;//得到颜色配置信息
            this.colorSet = {
                'boxOwnerColor': {
                    'MOL': '#ffcccc', 'MSK': '#ffb8b8', 'MSC': '#fe7a7a'
                    , 'EMC': '#ff5b5b', 'HLC': '#bae9ff', 'KMD': '#94ddff'
                    , 'SML': '#73d2ff', 'DJS': '#4cc6ff', 'SCI': '#ffa8df'
                    , 'IAL': '#ff86d3', 'KLN': '#ff61c6', 'IRS': '#ff61c6'
                    , 'HJS': '#90ff95', 'TJM': '#6af271', 'SNL': '#2fd336'
                    , 'WOS': '#2fd336', 'NWO': '#ddadff'
                },
                'shipLineColor': {
                    'MSCSES': '#ffcccc', '2M2US3': '#ffb8b8', '2M2BLS': '#fe7a7a'
                    , 'NLHNMX': '#ff5b5b', 'MSCJPN': '#bae9ff', 'MSCMID': '#94ddff'
                    , 'EMCEUP': '#73d2ff', 'MSCJP2': '#4cc6ff', '2M2EU3': '#ffccec'
                    , 'KMDIR6': '#ffa8df', 'KMDSD57': '#ff86d3', 'PCLSS25': '#ff61c6'
                    , 'DYSPT42': '#ff61c6', 'MARLO1': '#90ff95', 'YMLCY1': '#6af271'
                    , 'NYKLO10': '#2fd336', 'MARGL8': '#2fd336', 'KMDCA27': '#ddadff'
                },
                'shipVoyageColor': {
                    '707W': '#ffcccc', '707E': '#ffb8b8', 'FT707W': '#fe7a7a'
                    , 'D4243': '#ff5b5b', 'HI708A': '#bae9ff', 'FK707A': '#94ddff'
                    , '0916W': '#73d2ff', 'HI707A': '#4cc6ff', '705W': '#ffccec'
                    , 'OOLNY8': '#ffa8df', 'EMCED13': '#ff86d3', 'KMDSN7': '#ff61c6'
                    , 'OOLIT7': '#ff61c6', 'CMACM6': '#90ff95', 'HMMHI6': '#6af271'
                    , 'LHE52102': '#2fd336', 'HSDFR1': '#2fd336', 'MAREE4': '#ddadff'
                }
            };
            //this.getBayDetail();
            //this.render();
            return this;
        },

        /*
         *
         */
        getBayDetailByParam: function (yardId, bayId) {
            var that = this;
            var key = yardId + '@' + bayId; //value：11@08 以@作为分隔符,表示堆场代码11的第8列;
            that.data.yardId = yardId;
            that.data.bay = bayId;
            console.log(key);
            $.ajax({
                method: 'get',
                //url:'/portvision/object/ctnPosition/actual_position_block@actual_slot_position/EQUALS@LIKE/' + key, 
                url: '/portvision/mainObject/ctn/gps/actual_position_block@actual_slot_position/EQUALS@LIKE/' + key,
                success: function (data) {
                    if (!data || !data.length) {
                        console.log('数据为空');
                        //                        return false;
                    }
                    that.formateData(data);
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },

        /*
         *
         */
        getBayDetail: function () {
            var that = this;
            var key = '11@08';//value 以@作为分隔符,表示堆场代码11的第8列
            $.ajax({
                method: 'get',
                //url:'/portvision/object/ctnPosition/actual_position_block@actual_slot_position/EQUALS@LIKE/' + key,
                url: '/portvision/mainObject/ctn/actual_position_block@actual_slot_position/EQUALS@LIKE/' + key,
                success: function (data) {
                    if (!data || !data.length) {
                        console.log('数据为空');
                        return false;
                    }
                    that.formateData(data);
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },

        /*
         *
         */
        formateData: function (data, checkOption) {
            var that = this;
            that.boxDatas = data;//临时存储作为详情使用
            //处理数据
            //console.log(JSON.stringify(data));
            //位置：ACTUAL_SLOT_POSITION
            //编号：CTN_NO
            //处理数据
            var floorTotal = 5;//6层
            var columnTotal = 6;//6列
            that.data.floorTotal = floorTotal;

            //先申明一个二维数组。
            var bayBoxs = [];
            for (var k = 0; k < floorTotal; k++) {
                bayBoxs[k] = [];
                for (var j = 0; j < columnTotal; j++) {
                    bayBoxs[k][j] = '';
                }
            }
            //                  console.log('组装前的：' + bayBoxs);

            $.each(data, function (k, v) {
                if (v.GPS_ACTUAL_SLOT_POSITION) {
                    var floor = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(5, 1));//层 （tr）
                    var column = parseInt(v.GPS_ACTUAL_SLOT_POSITION.substr(3, 2));//列（td）
                    if (!(floor && column)) return;
                    floor = floorTotal - floor;
                    column = column - 1;
                    //                    var bColor = boxColor[Math.floor(Math.random()*boxColor.length)];
                    var box = {};
                    if (that.colorSet) { }
                    box.color = '#111';
                    //根据当前的分类来做颜色的切换
                    switch (checkOption) {
                        case 'box':
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                        case 'route'://航线
                            if (!!that.colorSet.shipLineColor) {
                                that.colorS = that.colorSet.shipLineColor;
                                /*if(v.STA_CTN_CATEGORY == "I"){
                                    box.key = v.GPS_SERVICE_CODE;             
                                }else if(v.STA_CTN_CATEGORY == "E"){
                                    box.key = v.GPS_SERVICE_CODE;             
                                }else if(v.STA_CTN_CATEGORY == "T" || v.STA_CTN_CATEGORY == "Z"){//中转
                                    if(v.GPS_PLAN_POSITION_QUALIFER == "V"){
                                        box.key = v.GPS_SERVICE_CODE;   
                                    }else{
                                        box.key = v.GPS_SERVICE_CODE;   
                                    }      
                                }*/
                                box.key = v.STA_SERVICE_CODE;
                            }
                            break;
                        case 'voyage'://航次
                            if (!!that.colorSet.shipVoyageColor) {
                                that.colorS = that.colorSet.shipVoyageColor;
                                /*if(v.STA_CTN_CATEGORY == "I"){
                                    box.key = v.GPS_IN_VOYAGE;            
                                }else if(v.STA_CTN_CATEGORY == "E"){
                                    box.key = v.GPS_OUT_VOYAGE;           
                                }else if(v.STA_CTN_CATEGORY == "T" || v.STA_CTN_CATEGORY == "Z"){//中转
                                    if(v.GPS_PLAN_POSITION_QUALIFER == "V"){
                                        box.key = v.GPS_OUT_VOYAGE; 
                                    }else{
                                        box.key = v.GPS_IN_VOYAGE;  
                                    }      
                                }*/
                                if (!v.STA_OUT_VOYAGE) {
                                    box.key = v.STA_IN_VOYAGE;
                                } else {
                                    box.key = v.STA_OUT_VOYAGE;
                                }
                            }
                            break;
                        default:
                            checkOption = 'box';
                            if (!!that.colorSet.boxOwnerColor) {
                                that.colorS = that.colorSet.boxOwnerColor;
                                box.key = v.OBJ_CTN_OPERATOR_CODE;
                            }
                            break;
                    }

                    box.color = that.colorS[box.key] ? that.colorS[box.key] : '#5256eb';//默认黑色                    
                    box.boxId = v.OBJ_CTN_NO;
                    box.weight = v.OBJ_CTN_WEIGHT;
                    //                          box.boxInfo = JSON.stringify(v);   
                    //                          bayBoxs[floor][column] = box; 
                    bayBoxs[floor][column] = $.extend(box, v);

                }
            })
            //                    console.log('修改后的：' + bayBoxs);
            that.data.bayBoxs = bayBoxs;
            that.render();//重新render一次
            $('#J_change_pro').val(checkOption);//设置选中
        },

        /*
         * 集装箱详情
         */
        getContainerDetail: function (boxId) {
            var that = this;
            //          console.log('boxID:' + boxId);
            if (!!that.boxDatas) {   // 从贝位详情跳转时
                $.each(that.boxDatas, function (k, v) {
                    if (boxId === v.OBJ_CTN_NO) {  // 找到当前箱子
                        that.renderContainerDetail(v);
                    }
                })
            } else { // 通过箱子编号获得
                $.ajax({
                    method: 'get',
                    // url:'/portvision/object/ctn/ctn_code/EQUALS/' + boxId, 
                    url: '/portvision/mainObject/ctn/obj/ctn_no/EQUALS/' + boxId,
                    success: function (data) {
                        var box = {};
                        if (!data || !data.length) {
                            console.log('数据为空');
                        } else {
                            var v = data[0];
                            box.OBJ_CTN_NO = v.OBJ_CTN_CODE;
                            box.OBJ_CTN_SIZE = v.OBJ_CTN_SIZE;
                            box.OBJ_CTN_TYPE = v.OBJ_CTN_TYPE;
                            box.OBJ_CTN_WEIGHT = v.OBJ_CTN_that_WEIGHT;
                            box.OBJ_CTN_OPERATOR_CODE = v.OBJ_CTN_OWNER;
                        }
                        that.render();
                        // that.renderBoxDetail(box);                                        
                        that.renderBoxDetail(v);
                    },
                    fail: function (error) {
                        console.log(error);
                    }
                });
            }
        },

        /*
         *
         */
        bindEvent: function () {
            var that = this;
            this.wraper.off();
            this.wraper.on('click', '.bay-box', function (ev) {
                var it = $(ev.target);
                if (!it.hasClass('bay-box')) {//div
                    it = it.parent();
                    if (!it.hasClass('bay-box')) {//span
                        it = it.parent();
                    }
                }
                // var boxData = it.attr('data-info');
                // boxData = JSON.parse(boxData);//                
                // that.renderContainerDetail(boxData);
                var boxId = it.attr('data-id');
                that.getContainerDetail(boxId);
            });

            this.wraper.on('click', '.j-close', function () {
                that.wraper.html('').hide();
                that.wraper.off();
                delete this;
            });

            this.wraper.on('click', '.j-hidden', function () {
                that.wraper.find('.popup-right').hide().find('.pop-body').html('');
                that.wraper.find('.inline').removeClass('inline');
                console.log('j-hidden');
            });

            this.wraper.on('change', '#J_change_pro', function (ev) {
                var it = $(ev.target);
                var option = it.val();
                that.formateData(that.boxDatas, option);
            });

        },

        /*
         *
         */
        setData: function (data) {
            this.data = $.extend(data);
            this.render();
        },

        /*
         *
         */
        generateBayDetailInfo: function () {
            var info = '';
            info = jsrender.templates(bayDetailTemplate).render(this.data);
            return info;
        },

        /*
         *
         */
        generateContainerDetailInfo: function (data) {
            var info = '';
            if (!data) {
                data = _.defaults(testContainerDetailData);
            }
            info = jsrender.templates(containerDetailTemplate).render(data);
            var positionInfo = data.GPS_ACTUAL_SLOT_POSITION;
            $('#J_centerPop .popup:nth-child(2) .pop-title').html(
                '集装箱详情(' + data.GPS_ACTUAL_POSITION_BLOCK + '堆场' +
                positionInfo.slice(0, 2) + '贝位' +
                positionInfo.charAt(positionInfo.length - 1) + '层' +
                positionInfo.slice(3, 4) + '列)');
            return info;
        },

        /**
         * 
         */
        renderSearchContainerDetail: function (data) {
            var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(this.data);
            this.wraper.html(wraperRight).show().find('.popup-right').show();
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').removeClass('inline').show();
        },

        /*
         *
         */
        renderContainerDetail: function (data) {
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').addClass('inline').show();
        },

        /*
         *
         */
        renderBoxDetail: function (data) {
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').addClass('inline alone').show();
            this.wraper.find('.popup-left').hide();
        },

        /*
         *
         */
        render: function () {
            if (!this.data) {
                this.data = _.defaults(testBayDetailData);
            }
            var wraperLeft = jsrender.templates(centerbayDetailWraperTemplate).render(this.data);
            var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(this.data);
            var wraper = wraperLeft + wraperRight;
            var bayDetailinfo = this.generateBayDetailInfo();
            //console.log( bayDetailinfo );           
            this.wraper.html(wraper).show().find('.popup-left').show();
            this.wraper.find('.inline').removeClass('inline');
            this.wraper.find('.popup-left .pop-body').html(bayDetailinfo);
            return this;
        },

        /*
         *
         */
        renderBox: function (data) {
            if (!this.data) {
                this.data = _.defaults(testBayDetailData);
            }
            // var wraperLeft = jsrender.templates( centerbayDetailWraperTemplate ).render( this.data ); 
            var wraperLeft = jsrender.templates(jobCenterPopTemplate).render(this.data);
            var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(this.data);
            var wraper = wraperLeft + wraperRight;
            this.wraper.html(wraper).show();
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').addClass('inline').show();

            return this;
        },

        /*
         *
         */
        renderJob: function () {
            if (!this.data) {
                this.data = _.defaults(testBayDetailData);
            }
            var wraperLeft = jsrender.templates(jobCenterPopTemplate).render(this.data);
            var wraper = wraperLeft;
            this.wraper.children('.left').html(wraper).show();
            // var containerDetailinfo = this.generateContainerDetailInfo( data );   
            // this.wraper.find('.popup-right .pop-body').html( containerDetailinfo );
            this.wraper.find('.popup').addClass('inline').show();

            return this;
        }

    });

    return JOBCENTERPOPUP;
});