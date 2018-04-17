/**
 * module mod/popup/boatBottomPop 船舶箱子详情展示弹框
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库

    var bottomWraperTemplate =  
        '<div class="popup fixed-bottom">' +
            '<div class="pop-content navbar-fixed-bottom">' +
                '<div class="pop-header">' +
                    '<div class="pop-title">船名: {{>deviceData.STA_VESSEL_REFERENCE}}</div>' +
                    '<span class="pop-close j-close">关闭</span>' +
                    '<div class="pop-box"><select class="pop-select">' +
                        '<option value="now" >现在</option>' +
                        '<option value="past" >过去</option>' +
                        '<option value="future" >将来</option>' +
                        '<option value="strowage" >配载</option>' +
                        '<option value="prestrowage" >预配</option>' +
                    '</select>' +
                    '<select class="pop-select" id="box-info-type" value="tower">' +
                        '<option value="tower">层高</option>' +
                        '<option value="box">箱主</option>' +
                        '<option value="size">尺寸</option>' +
                        '<option value="port">卸货港</option>' +
                    '</select></div>'+
                '</div>'  +
                '<div class="pop-info clearfix">' +
                    '<div class="loading-img"></div>' + 
                    '<div class="boxes-style boxes-info" data-id="{{>deviceData.STA_VESSEL_REFERENCE}}">' +
                    '</div>' +
                    '<div class="boxes-style hboxes-info" data-id="{{>deviceData.STA_VESSEL_REFERENCE}}">' +
                    '</div>' +
                    // '<div class="boxes-legend">' +
                    //     '<table><tbody>' +
                    //         '{{for towerColors}}' + 
                    //         '<tr class="tower">' +
                    //             '<td style="background:{{:color}}"></td>' +
                    //             '<td class="txt">{{:text}}</td>' +
                    //         '</tr>' +
                    //         '{{/for}}' +
                    //         '</tbody></table>' +
                    // '</div>' +
                '</div>' + 
            '</div>' +
            '<div class="masker"></div>' + 
        '</div>';

    var boxesInfoTemplate = 
        '<table><tbody>' +
            '{{if isAxis}}' + 
            '<tr class="bay-number">' +
                '<td class="row-number"></td>' +
                '{{for boxesBayNumber}}' + 
                '<td class="bay txt">{{:number}}</td>' +
                '{{/for}}' +                
            '</tr> ' +
            '{{/if}}' + 
            '{{for boxesRows}}' + 
            '<tr data-id="{{:#getIndex()+1}}">' +
                '{{if #parent.parent.data.isAxis}}' +
                '<td class="row-number">{{>#parent.parent.parent.data.boxData.dData.length * 2 + #parent.parent.parent.data.minDtierId - #parent.getIndex() * 2 - 2 }}</td>' +
                '{{else }}' +
                '<td class="row-number">{{>#parent.parent.parent.data.boxData.hData.length * 2 - #parent.getIndex() * 2}}</td>' +
                '{{/if}}' +
                '{{for boxesBays}}' + 
                    '{{if tower == -1}}' +
                    '<td class="bay no-box-place"></td>' +
                    '{{else}}' + 
                    '<td data-id="{{:bayIndex}}" class="bay" style="background:{{:bgcolor}}" title="{{:tower}}">{{:tower}}</td>' +
                    '{{/if}}' +

                '{{/for}}' +
            '</tr>' +
            '{{/for}}' +
        '</tbody></table>';

    var BOATPOP = function (cfg) {
        if (!(this instanceof BOATPOP)) {
            return new BOATPOP().init(cfg);
        }
    };

    BOATPOP.prototype = $.extend(new McBase(), {
        init: function (cfg) {
            this.data = cfg.data || 0;
            this.elementId = cfg.elementId || 0;
            this.bayElementId = cfg.bayElementId || 0;
            //this.yardId = cfg.yardId || 0;
            this.observer = cfg.observer || null;
            this.wraper = $(this.elementId);
            this.bayWraper = $(this.bayElementId);
            this.lastBoatCode = '';
            this.wraper.html('');
            this.bindEvent();
            this.defaultColorConfigs = [
                '#ffcccc', '#ffb8b8', '#fe7a7a', '#ff5b5b', '#bae9ff', '#94ddff',
                '#73d2ff', '#4cc6ff', '#ffccec', '#ffa8df', '#ff86d3', '#ff61c6',
                '#ff61c6', '#90ff95', '#6af271', '#2fd336', '#2fd336', '#ddadff',
                '#cd87ff', '#bf66ff', '#c7c2ff', '#b0a9ff', '#8b81ff', '#6c5fff',
            ];
            this.objColorConfigs = {};
            return this;
        },
        bindEvent: function () {
            var that = this;
            this.wraper
                .on('click', '.j-close', function (ev) {
                    that.bayWraper.html('').hide();
                    that.wraper.html('').hide();
                    that.wraper.off();
                    that.data.boxData = null;
                    that.observer._overMap.hideSelectedEquipment();
                    that.lastBoatCode = that.data.deviceData.STA_VESSEL_REFERENCE;
                    delete this;
                })
                .on('click', '.bay', function (ev) {
                    var it = $(ev.target),
                        parent = it.parent();
                    var rowNumber = parent.attr('data-id');
                    var bayNumber = it.attr('data-id');
                    var vesselCode = parent.parent().parent().parent().attr('data-id');
                    // 贝位接口格式
                    bayNumber = '0' + bayNumber;
                    //console.log(yardNumber + '堆场  ' + rowNumber + '行  ' + bayNumber + '贝');
                    that.observer.showPop('boatBayDetail', { 'row': rowNumber, 'bay': bayNumber, 'vesselCode': vesselCode });
                })
                .on('mouseover', 'td.bay', function (ev) {
                    var it = ev.currentTarget;
                    var dataId = $(this).attr('data-id');
                    $('td.bay').removeClass('check-bay check-bay-start check-bay-end');
                    $('td.bay[data-id="' + dataId + '"]').addClass('check-bay');
                    $('td.bay[data-id="' + dataId + '"]').first().addClass('check-bay-start');
                    $('td.bay[data-id="' + dataId + '"]').last().addClass('check-bay-end');

                    var index = +dataId - 1;
                    var data = (function (source, index) {
                        var dest = [];
                        for (var i = 0; i < source.length; i++) {
                            dest.push(source[i]['boxesBays'][index]);
                        }
                        return dest;
                    }(that.data['boxesRows'], index));
                    var info = {
                        data: data,
                        position: [ev.pageX, ev.pageY]
                    }
                    // 隐藏提示
                    // var infoPop = jsrender.templates( boxesInfoSlidePop ).render( info );
                    // that.wraper.find('.boxs-pop').remove();
                    // that.wraper.find('.boxes-info').append(infoPop);
                })
                .on('change', '#box-info-type', function (ev) {
                    var checkText = $('#box-info-type').find('option:selected').text();
                    var option = '';
                    var urlStr = '';
                    //console.log( checkText );
                    switch (checkText) {
                        case '层高':
                            option = 'tower';
                            urlStr = '/portvision/block/count/' + that.data.deviceData.STA_VESSEL_REFERENCE + '?type=vessel';
                            that.getBoxShippingInfo(option, urlStr);
                            break;
                        case '箱主':
                            option = 'box';
                            urlStr = '/portvision/block/count/' + that.data.deviceData.STA_VESSEL_REFERENCE + '?type=vessel&view=side&key=CTN_OPERATOR_CODE';
                            that.getBoxShippingInfo(option, urlStr);
                            break;
                        case '尺寸':
                            option = 'size';
                            urlStr = '/portvision/block/count/' + that.data.deviceData.STA_VESSEL_REFERENCE + '?type=vessel&view=side&key=CTN_SIZE';
                            that.getBoxShippingInfo(option, urlStr);
                            break;
                        case '卸货港':
                            option = 'port';
                            urlStr = '/portvision/block/count/' + that.data.deviceData.STA_VESSEL_REFERENCE + '?type=vessel&view=side&key=DISCHARGE_PORT_CODE';
                            that.getBoxShippingInfo(option, urlStr);
                            break;
                        default:
                            option = 'box';
                            break;
                    }
                });
        },

        render: function (option) {
            option ? option : option = 'box';
            var wraper = jsrender.templates(bottomWraperTemplate).render(this.data);
            this.wraper.html(wraper).show().find('.popup').show();
            // 根据层高纬度数组判断是否调用获取层高的接口
            if (!this.data.boxData) {
                this.getBoxShippingInfo(option, '/portvision/block/count/' + this.data.deviceData.STA_VESSEL_REFERENCE + '?type=vessel&view=side&key=CTN_OPERATOR_CODE');
            } else {
                // 设置select的选项
                $('#box-info-type').val(option);
                var boxesinfo = this.generateBoxesInfo(option, this.data.boxData.dData, true);
                this.wraper.find('.boxes-info').html(boxesinfo);
                var hBoxesinfo = this.generateBoxesInfo(option, this.data.boxData.hData, false);
                this.wraper.find('.hboxes-info').html(hBoxesinfo);
            }
            return this;
        },

        /**
         * desc: 获取箱子堆放数据
         */
        getBoxShippingInfo: function (option, url) {
            this.showLoading();
            var that = this;
            var tempBoatBox = {};
            var tempDBoxArr = [];
            var tempHBoxArr = [];
            // 准备接收和转换数据
            $.ajax({
                method: 'get',
                url: url,
                success: function (data) {
                    if (that.lastBoatCode === that.data.deviceData.STA_VESSEL_REFERENCE) {
                        return;
                    }
                    that.minDtierId = data.minDtierId;
                    var lenD = data.dData.length;
                    var lenH = data.hData.length;
                    $.each(data.dData[0], function () {
                        tempDBoxArr.push(Array(lenD));
                    });
                    $.each(data.dData, function (k, v) {
                        $.each(v, function (j, d) {
                            tempDBoxArr[j][k] = d;
                        })
                    })

                    $.each(data.hData[0], function () {
                        tempHBoxArr.push(Array(lenH));
                    });
                    $.each(data.hData, function (k, v) {
                        $.each(v, function (j, d) {
                            tempHBoxArr[j][k] = d;
                        })
                    })
                    tempBoatBox['dData'] = tempDBoxArr;
                    tempBoatBox['hData'] = tempHBoxArr;
                    option === 'tower' && (that.data['boxData'] = tempBoatBox);
                    option === 'box' && (that.data['boxData'] = tempBoatBox);
                    option === 'size' && (that.data['boxData'] = tempBoatBox);
                    option === 'port' && (that.data['boxData'] = tempBoatBox);
                    //console.log( tempArr )
                    that.render(option);
                    that.hideLoading();
                },
                fail: function (error) {
                    console.log(error);
                }
            });
        },

        /**
         * desc: 颜色对象生成
         */
        generateColorConfig: function () {
            var objColorConfigs = {},
                colorCfgKeys = [],
                tempKeys = [];
            $.each(this.data.boxesRows, function (k, boxes) {
                $.each(boxes, function (j, t) {
                    if (!(!t.tower && typeof (t.tower) !== 'undefined' && t.tower !== 0)) {
                        colorCfgKeys.push(t.tower);
                    }
                })
            })
            colorCfgKeys = _.uniq(colorCfgKeys);

            var i;
            $.each(colorCfgKeys, function (k, v) {
                i = k;
                if (k >= that.defaultColorConfigs.length) {
                    i = k - that.defaultColorConfigs.length;
                }
                objColorConfigs[v] = { 'text': v, 'color': that.defaultColorConfigs[i] }
            })
            this.objColorConfigs = objColorConfigs;
        },

        /**
         * desc: 生成箱子排列信息
         */
        generateBoxesInfo: function (option, args, isAxis) {
            var boxesinfo = '',
                boxPosition = [],
                that = this;
            this.data.minDtierId = this.minDtierId;
            this.data.boxesRows = {};
            this.data.boxesBayNumber = [];
            this.data.boxPositions = [];
            // this.data.boxes ? this.data.boxes : testBoxes;

            // 将boxes的数据转换为boxesRows，包括层高、位置等信息\Z
            // switch( option ){
            //     case 'tower': this.formateBoxesRowsByVessel( args ); break;
            //     case 'box': this.formateBoxesRowsByVessel( args ); break;
            //     case 'size': this.formateBoxesRowsByVessel( args ); break;
            //     case 'port': this.formateBoxesRowsByVessel( args ); break;
            // }           
            this.formateBoxesRowsByVessel(option, args);

            // 构建贝位上的箱子信息(高度，是否大箱，等)
            this.data.boxPositions ? this.data.boxPositions : testBoxePositions;

            var colorCfgKeys = [];
            $.each(this.data.boxesRows, function (k, boxes) {
                $.each(boxes, function (j, t) {
                    if (!(!t.tower && typeof (t.tower) !== 'undefined' && t.tower !== 0)) {
                        colorCfgKeys.push(t.tower);
                    }
                })
            })
            colorCfgKeys = _.uniq(colorCfgKeys);

            var i;
            $.each(colorCfgKeys, function (k, v) {
                i = k;
                if (k >= that.defaultColorConfigs.length) {
                    i = k - that.defaultColorConfigs.length;
                }
                !that.objColorConfigs[v] && (that.objColorConfigs[v] = { 'text': v, 'color': that.defaultColorConfigs[i] });
                // objColorConfigs[v] = {'text': v, 'color': that.defaultColorConfigs[i]};
            })
            $.each(this.data.boxesRows, function (k, boxes) {
                var boxesBays = [];
                $.each(boxes, function (j, t) {
                    var tower = t.tower;
                    var position = t.position;
                    var bgcolor = '';
                    var isLeft = position === 'left';
                    var isRight = position === 'right';
                    var tempBay = {};
                    // switch(option) {
                    //     case 'tower':
                    //         bgcolor = that.defaultTowerColors[ tower - 1 ] ? that.defaultTowerColors[ tower - 1 ].color : '#fff';
                    //         break;
                    //     case 'box':
                    //         bgcolor = that.defaultBoxLatColors[tower] ? that.defaultBoxLatColors[tower].color : '#fff'
                    //         break;
                    //     case 'route': 
                    //         bgcolor = that.defaultShippingLineColors[tower] ? that.defaultShippingLineColors[tower].color : '#fff';
                    //         break;
                    // }
                    if (option === 'tower') {
                        tower <= 0 ? (bgcolor = '#fff') : (bgcolor = that.objColorConfigs[tower - 1] ? that.objColorConfigs[tower - 1].color : '#fff');
                    } else {
                        String(tower) === '' ? (bgcolor = '#fff') : (bgcolor = that.objColorConfigs[tower] ? that.objColorConfigs[tower].color : '#fff');
                    }
                    if (String(tower) === '-1') {
                        bgcolor = 'transprant';
                    }
                    //boxesBays.push({ 'tower': tower, 'bgcolor':bgcolor, 'position':position, 'isLeft': isLeft, 'isRight': isRight });                    
                    tempBay.isLeft = isLeft;
                    tempBay.isRight = isRight;
                    tempBay.bgcolor = bgcolor;
                    tempBay.tower = option === 'port' ? tower.substr(0, 3) : tower;
                    tempBay.fullName = tower;
                    tempBay.position = position;
                    tempBay.bayIndex = t.bayIndex;
                    boxesBays.push(tempBay);
                });
                boxes.boxesBays = boxesBays;
            });

            // 构建贝位数字
            $.each(this.data.boxesRows[0], function (j) {
                that.data.boxesBayNumber.push({ 'number': j * 2 + 1 });
            })
            //console.log(this.data.boxesBayNumber);
            isAxis ? this.data.isAxis = true : this.data.isAxis = false;
            boxesinfo = jsrender.templates(boxesInfoTemplate).render(this.data);
            return boxesinfo;
        },

        /*
         *
         */
        formateBoxesRowsByVessel: function (option, args) {
            // 将boxes的数据转换为boxesRows，包括层高、位置等信息
            var boxesRows = [];
            $.each(args, function (k, v) {
                var boxes = v;
                var boxesLen = boxes.length;
                boxesRows[k] = [];
                for (var i = 0; i < boxesLen; i++) {
                    // var current = boxes[i] || 0;
                    var current;
                    option === 'tower' ? (current = boxes[i] || 0) : (current = boxes[i] || '');
                    boxesRows[k][i] = {};
                    boxesRows[k][i].position = 'center';
                    boxesRows[k][i].tower = current;
                    boxesRows[k][i].bayIndex = 2 * (i + 1) - 1;

                    if (boxesRows[k][i].bayIndex < 10) {
                        boxesRows[k][i].bayIndex = '0' + boxesRows[k][i].bayIndex;
                    }
                }
                /*
                for( var i = 0; i < boxesLen; i = i + 2 ){
                    var prev = boxes[ i - 1 ] || 0;
                    var current = boxes[ i ] || 0;
                    var next = boxes[ i + 1 ] || 0;
                    var rowIndex = i / 2;
                    //console.log( rowIndex, prev, current, next );
                    boxesRows[k][ rowIndex ] = {};
                    if( !boxesRowInfo[rowIndex ]){
                        boxesRowInfo[rowIndex ] = 'center';
                    }
                    if( !boxesRowBayIndex[rowIndex ]){
                        boxesRowBayIndex[rowIndex ] = i + 1;
                    }
                    if( current > 0 ){
                        boxesRows[k][ rowIndex ].tower = current;
                        boxesRows[k][ rowIndex ].position = 'center';
                        boxesRows[k][ rowIndex ].bayIndex = i + 1;
                    }else{
                        if( prev > 0 && next === 0 ){
                            boxesRows[k][ rowIndex ].tower = prev;
                            boxesRows[k][ rowIndex ].position = 'right';
                            boxesRows[k][ rowIndex ].bayIndex = i;
                            boxesRowInfo[ rowIndex ] = 'right';
                            boxesRowBayIndex[rowIndex ] = i;
                           
                        }
                        if( prev === 0 && next > 0 ){
                            boxesRows[k][ rowIndex ].tower = next;
                            boxesRows[k][ rowIndex ].position = 'left';
                            boxesRows[k][ rowIndex ].bayIndex = i + 2;
                            boxesRowInfo[ rowIndex ] = 'left';
                            boxesRowBayIndex[rowIndex ] = i + 2;
                        }
                        if( prev === 0 && next === 0 ){
                            boxesRows[k][ rowIndex ].tower = current;
                            boxesRows[k][ rowIndex ].position = 'center';
                            boxesRows[k][ rowIndex ].bayIndex = i + 1;                            
                        }
                    }
                    //console.log( boxesRows[k][ rowIndex ] );
                    if( boxesRows[k][ rowIndex ].bayIndex < 10 ){
                        boxesRows[k][ rowIndex ].bayIndex = '0' + boxesRows[k][ rowIndex ].bayIndex;
                    }
                    
                };
                */
            })
            // this.boxesRowInfo = boxesRowInfo;
            // this.boxesRowBayIndex = boxesRowBayIndex;
            // $.each( boxesRows , function(k, rows){
            //     $.each( rows, function(j, col){
            //         if( col.tower == 0 ){
            //             col.position = that.boxesRowInfo[j];
            //             col.bayIndex = that.boxesRowBayIndex[j] < 10 ? '0' + that.boxesRowBayIndex[j] : that.boxesRowBayIndex[j];
            //         }
            //     })
            // })
            this.data.boxesRows = boxesRows;
        },

        /*
         * desc: 展示加载动画
         */
        showLoading: function () {
            $('.loading-img').addClass('loading-active');
            $('.boxes-style').removeClass('boxes-active');
        },
        /*
         * desc: 隐藏加载动画
         */
        hideLoading: function () {
            $('.loading-img').removeClass('loading-active');
            $('.boxes-style').addClass('boxes-active');
        }
    });

    return BOATPOP;
});