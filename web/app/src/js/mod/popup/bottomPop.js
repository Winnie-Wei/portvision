/**
 * @module port/mod/popup/bottom 视图中央的弹框
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库

    var testBoxes = [
        [0,0,0,0,0,0,0,4,0,0,0,4,0,0,2,0,2,0,0,4,0,0,0,4,0,0,0,1,0,0,0,1,0,0,2,0,0,4,0,0,4,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,4,0,4,0,0,4,0,0,0,4,0,0,0,0,0,4,0,0,0,0,0,0,4,0,0,1,0,0,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,4,0,0,0,4,0,0,2,0,1,0,0,2,0,0,0,4,0,0,0,4,0,0,0,4,0,0,2,0,0,3,0,0,2,0,0,4,0,0,0,1,0,0,0,4,0,0,0,4,0,0,0,0,4,0,0,4,0,0,0,4,0,0,1,0,0,1,0,0,4,0,4,0,3,0,0,4,0,0,0,4,0,0,0,0],
        [0,0,0,0,0,0,0,4,0,0,0,4,0,0,1,0,1,0,0,3,0,0,0,4,0,0,0,4,0,0,0,4,0,0,0,0,0,2,0,0,2,0,0,4,0,0,0,4,0,0,0,0,0,0,0,4,0,0,3,0,0,0,0,1,0,0,0,3,0,0,1,0,0,4,0,0,1,0,1,0,0,0,0,4,0,0,0,4,0,0,0,2],
        [0,0,0,0,0,0,0,1,0,0,0,4,0,0,1,0,3,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,4,0,0,4,0,0,3,0,0,2,0,0,0,4,0,0,0,4,0,0,0,2,0,0,4,0,4,0,0,4,0,0,0,4,0,0,3,0,0,4,0,0,4,0,4,0,4,0,0,3,0,0,0,1,0,0,0,3],
        [0,0,0,0,0,0,0,4,0,0,0,1,0,0,4,0,4,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,2,0,0,4,0,0,3,0,0,2,0,0,0,4,0,0,0,4,0,0,0,3,0,0,4,0,4,0,0,4,0,0,0,4,0,0,2,0,0,4,0,0,0,0,4,0,4,0,0,4,0,0,0,4,0,0,0,3],
        [0,0,0,0,0,0,0,4,0,0,0,4,0,0,2,0,3,0,0,4,0,0,0,1,0,0,0,4,0,0,0,4,0,0,0,0,0,4,0,0,4,0,0,4,0,0,0,4,0,0,0,4,0,0,0,4,0,0,2,0,4,0,0,4,0,0,0,2,0,0,2,0,0,4,0,0,4,0,0,0,4,0,0,4,0,0,0,4,0,0,0,3]
    ];

    var testBoxePositions = [
        ['center','center','center',true,0,0,0,'left','right',0,4,0,1,0,0,4,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,1,0,0,0,3,0,0,1,0,3,0,0,4,0,0,0,2,0,0,0,0,2,0,0,3,0,0,0,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        ['left','right',0,0,0,0,0,4,0,0,2,0,0,0,0,4,0,0,2,0,0,2,0,0,0,0,0,0,1,0,0,4,0,0,0,4,0,0,0,0,4,0,0,4,0,0,0,4,0,0,1,0,1,0,0,2,0,0,4,0,0,4,0,0,0,0,0,1,0,0,1,0,0,4,0,0,0,1,0,0,0,0,0,0,0,2,0,0,0,4,0,0,0,2],
        ['left','right',false,0,0,0,0,3,0,0,1,0,1,0,0,1,0,0,2,0,0,4,0,0,0,1,0,0,1,0,0,4,0,0,0,3,0,0,2,0,2,0,0,4,0,0,0,2,0,0,0,0,4,0,0,4,0,0,4,0,0,3,0,0,1,0,0,1,0,0,4,0,0,4,0,0,0,1,0,0,0,1,0,0,0,4,0,0,0,1,0,0,0,2],
        ['left','right',false,0,0,0,0,2,0,0,2,0,3,0,0,4,0,0,2,0,0,4,0,0,0,2,0,0,3,0,0,2,0,0,0,1,0,0,3,0,3,0,0,4,0,0,0,3,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,4,0,0,0,0,0,1,0,0,4,0,0,0,1,0,0,0,0,0,0,0,4,0,0,0,1,0,0,0,0],
        ['left','right','center','center',0,0,0,2,0,0,2,0,4,0,0,4,0,0,2,0,0,4,0,0,0,0,0,0,4,0,0,4,0,0,0,3,0,0,1,0,4,0,0,2,0,0,0,4,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,4,0,0,0,4,0,0,0,0,0,0,0,4,0,0,0,3,0,0,0,1],
        ['left','right',false,0,0,0,0,3,0,0,4,0,4,0,0,4,0,0,2,0,0,4,0,0,0,2,0,0,4,0,0,4,0,0,0,1,0,0,4,0,4,0,0,3,0,0,0,4,0,0,0,0,0,0,0,4,0,0,4,0,0,0,0,0,4,0,0,1,0,0,1,0,0,4,0,0,0,2,0,0,0,1,0,0,0,4,0,0,0,1,0,0,0,1]
    ];

    var bottomWraperTemplate = 
        '<div class="popup fixed-bottom">' +
            '<div class="pop-content navbar-fixed-bottom">' +
                '<div class="pop-header">' +
                    '<div class="pop-title">{{>yardName}}堆场<span>（{{>teu}}/{{>capability}}）</span></div>' +
                    '<span class="pop-close j-close">关闭</span>' +
                    '<div class="pop-box">' +
                        '<select class="pop-select" id="box-info-tense">' +
                            '<option value="present">现在</option>' + 
                            '<option value="past">过去</option>' +
                            '<option value="future">将来</option>' +
                            '<option value="perfect">综合</option>' +
                            '<option value="continuous">马上</option>' +
                        '</select>' +
                        '<select class="pop-select" id="box-info-type">' +
                            '<option value="tower">层高</option>' +
                            '<option value="box">箱主</option>' +
                            // '<option value="inBound-category">进港类型</option>' +
                            '<option value="route">航线</option>' +
                            '<option value="voyage">航次</option>' +
                        '</select>' +
                    '</div>'+
                '</div>'  +
                '<div class="pop-info">' +
                    '<div class="loading-img"></div>' + 
                    '<div class="boxes-style boxes-info" data-id="{{>yardCode}}">' +
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

    var boxesInfoTemplate = '<table><tbody>' +
            '{{for boxesRows}}' + 
            '<tr data-id="{{:#getIndex()+1}}">' +
                '<td class="row-number">{{:#getIndex()+1}}</td>' +
                '{{for boxesBays}}' + 
                '{{if isLeft }}' +
                  '<td colspan="2" data-id="{{:bayIndex}}" class="bay {{:plan}}" style="background:{{:bgcolor}}" title="{{:tower}}">{{:tower}}</td>' +
                '{{else isRight }}' +

                '{{else}}' + 
                    '<td data-id="{{:bayIndex}}" class="bay {{:plan}}" style="background:{{:bgcolor}}" title="{{:tower}}">{{:tower}}</td>' +
                '{{/if}}' +

                '{{/for}}' +
            '</tr>' +
            '{{/for}}' +
            '<tr class="bay-number">' +
                '<td class="row-number"></td>' +
                '{{for boxesBayNumber}}' + 
                '<td class="bay txt">{{:number}}</td>' +
                '{{/for}}' +                
            '</tr> ' +
            '</tbody></table>' ;

    var boxesInfoSlidePop = '<table class="boxs-pop" style="left: {{>position[0]+20}}px;">\
        {{for data}}\
            <tr><td style="white-space:nowrap;">第{{>#getIndex()+1}}列:haha</td></tr>\
        {{/for}}\
    </table>';
   
    var POPUP = function (cfg) {
        if (!(this instanceof POPUP)) {
            return new POPUP().init(cfg);
        }
    };

    POPUP.prototype = $.extend(new McBase(), {

        /*
         *
         */
        init: function (cfg) {
            this.data = cfg.data || 0;
            this.elementId = cfg.elementId || 0;
            this.bayElementId = cfg.bayElementId || 0;
            //this.yardId = cfg.yardId || 0;
            this.observer = cfg.observer || null;
            this.boxTense = 'present'; // 时态：现在 (present), 过去 (past), 将来 (future）, 综合 (perfect）, 马上 (continuous)
            this.ctnType = 'tower'; // // 展现方式：箱主 (box), 航线 (route), 航次 (voyage)
            this.defaultColorConfigs = [
                '#ffcccc', '#ffb8b8', '#fe7a7a', '#ff5b5b', '#bae9ff', '#94ddff',
                '#73d2ff', '#4cc6ff', '#ffccec', '#ffa8df', '#ff86d3', '#ff61c6',
                '#ff61c6', '#90ff95', '#6af271', '#2fd336', '#2fd336', '#ddadff',
                '#cd87ff', '#bf66ff', '#c7c2ff', '#b0a9ff', '#8b81ff', '#6c5fff'
            ];
            this.defaultTowerColors = {
                '0': {
                    'text': '9层',
                    'color': '#83f699'
                },
                '1': {
                    'text': '',
                    'color': '#56dfc1'
                },
                '2': {
                    'text': '7层',
                    'color': '#83f7ee'
                },
                '3': {
                    'text': '',
                    'color': '#f683e2'
                },
                '4': {
                    'text': '5层',
                    'color': '#82b3f5'
                },
                '5': {
                    'text': '',
                    'color': '#f5f583'
                },
                '6': {
                    'text': '3层',
                    'color': '#f4d180'
                },
                '7': {
                    'text': '',
                    'color': '#caaa2f'
                },
                '8': {
                    'text': '1层',
                    'color': '#f58382'
                }
            };
            this.defaultShippingLineColors = {
                '-/YMLZM18': {
                    'text': '-/YMLZM18',
                    'color': '#f5f583'
                },
                '-/KLNSD14': {
                    'text': '-/KLNSD14',
                    'color': '#f683e2'
                },
                '-/APLJP1': {
                    'text': '-/APLJP1',
                    'color': '#caaa2f'
                },
                '-/CMACH2': {
                    'text': '-/YMLZM18',
                    'color': '#f58382'
                }
            };
            this.defaultBoxLatColors = {
                'OOL': {
                    'text': 'OOL',
                    'color': '#3095E5'
                },
                'YML': {
                    'text': 'YML',
                    'color': '#f5f583'
                },
                'EMC': {
                    'text': 'EMC',
                    'color': '#0EB941'
                },
                'NSL': {
                    'text': 'NSL',
                    'color': '#5BDBB1'
                },
                'APL': {
                    'text': 'APL',
                    'color': '#E29A00'
                },
                'CMA': {
                    'text': 'CMA',
                    'color': '#4A1D78'
                }
            }
            this.data.towerColors = this.defaultTowerColors;
            this.wraper = $(this.elementId);
            this.bayWraper = $(this.bayElementId);
            this.wraper.html('');
            this.bindEvent();
            return this;
        },

        /*
         *
         */
        bindEvent: function () {
            var that = this;
            this.wraper.on('click', '.bay', function (ev) {
                var it = $(ev.target),
                    parent = it.parent();
                var rowNumber = parent.attr('data-id');
                var bayNumber = it.attr('data-id');
                var yardNumber = parent.parent().parent().parent().attr('data-id');
                //console.log(yardNumber + '堆场  ' + rowNumber + '行  ' + bayNumber + '贝');
                that.observer.showPop('bayDetail', {
                    'row': rowNumber,
                    'bay': bayNumber,
                    'yard': yardNumber
                });
            });

            this.wraper.on('click', '.j-close', function (ev) {
                that.bayWraper.html('').hide();
                that.wraper.html('').hide();
                that.wraper.off();
                $('.masker').addClass('hide');
                that.data.towerLatArr = null;
                delete this;
            });
            this.wraper
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
                });
            this.wraper
                .on('mouseout', 'td.bay', function () {
                    that.wraper.find('.boxs-pop').remove();
                });
            this.wraper
                .on('change', '#box-info-tense', function () {
                    var tenseCheckT = $(this).find('option:selected').val();
                    that.boxTense = tenseCheckT;
                })
                .on('change', '#box-info-type', function () {
                    var infoType = $(this).find('option:selected').val();
                    that.ctnType = infoType;
                    that.getBoxShippingInfo();
                    // var checkText = $('#box-info-type').find("option:selected").text();
                    // var option = '';
                    // var urlStr = '';
                    // //console.log( checkText );
                    // switch(checkText) {
                    //     case '层高':
                    //         option = 'tower';
                    //         urlStr = '/portvision/block/yard/vertical/' +  that.data.yardCode;
                    //         that.getBoxShippingInfo( option, urlStr );
                    //         break;
                    //     case '箱主':
                    //         option = 'box';
                    //         urlStr = '/portvision/block/yard/vertical/' + that.data.yardCode + '?tense=present&key=CTN_OPERATOR_CODE';
                    //         that.getBoxShippingInfo( option, urlStr );
                    //         break;
                    //     case '航线':
                    //         option = 'route';
                    //         urlStr = '/portvision/block/yard/vertical/' + that.data.yardCode + '?tense=present&key=ROUTE';
                    //         that.getBoxShippingInfo( option, urlStr );
                    //         break;
                    //     case '航次':
                    //         option = 'voyage';
                    //         urlStr = '/portvision/block/yard/vertical/' + that.data.yardCode + '?tense=present&key=VOYAGE';
                    //         that.getBoxShippingInfo( option, urlStr );
                    //         break;
                    //     default :
                    //         option = 'tower';
                    //         break;
                    // }                    
                });
        },

        /*
         * getBoxShippingInfo: function( tense, option, url )
         */
        getBoxShippingInfo: function () {
            this.showLoading();
            var that = this;
            var tempArr = [];
            var urlStr = '/portvision/block/yard/vertical/' + this.data.yardCode + '?tense=' + this.boxTense;
            switch (this.ctnType) {
                case 'tower':
                    break;
                case 'box':
                    urlStr = urlStr + '&key=CTN_OPERATOR_CODE';
                    break;
                case 'inBound-category':
                    urlStr = urlStr + '&key=INBOUND_CATEGORY';
                    break;
                case 'route':
                    urlStr = urlStr + '&key=ROUTE';
                    break;
                case 'voyage':
                    urlStr = urlStr + '&key=VOYAGE';
                    break;
            }
            $.ajax({
                method: 'get',
                // TODO: url根据tense option拼接
                url: urlStr,
                success: function (data) {
                    that.bayBoxes = data.concat();
                    var len = data.length;
                    $.each(data[0], function () {
                        tempArr.push(Array(len));
                    });
                    $.each(data, function (k, v) {
                        $.each(v, function (j, d) {
                            tempArr[j][k] = d;
                        })
                    })
                    that.ctnType === 'tower' && (that.data.towerLatArr = tempArr.concat());
                    that.ctnType === 'box' && (that.data.boxLatArr = tempArr.concat());
                    // that.ctnType === 'inBound-category' && ();
                    that.ctnType === 'route' && (that.data.routeLatArr = tempArr.concat());
                    that.ctnType === 'voyage' && (that.data.voyageLatArr = tempArr.concat());
                    //console.log( tempArr )
                    that.render(that.ctnType);
                    // 
                    $('#box-info-type').val(that.ctnType);
                    var boxesinfo = that.generateBoxesInfo(that.ctnType);
                    that.wraper.find('.boxes-info').html(boxesinfo);

                    that.hideLoading();
                },
                fail: function (error) {
                    console.log(error);
                }
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
        render: function (tense, option) {
            option ? option : option = 'tower'; // 
            // var boxesinfo = this.generateBoxesInfo();
            var wraper = jsrender.templates(bottomWraperTemplate).render(this.data);
            this.wraper.html(wraper).show().find('.popup').show();
            // 根据层高纬度数组判断是否调用获取层高的接口
            // this.getBoxShippingInfo(tense, option, '/portvision/block/count/' +  this.data.yardCode);
            !this.data.towerLatArr && this.getBoxShippingInfo(option, '/portvision/block/yard/vertical/' + this.data.yardCode);

            // 设置select的选项
            // $('#box-info-type').val(option);
            // var boxesinfo = this.generateBoxesInfo( option );
            // this.wraper.find('.boxes-info').html( boxesinfo );
            return this;
        },

        /*beautifulTable: function(){
            var trs = this.wraper.find('.boxes-info tr');
            var that = this;
            console.log( that.boxesRowInfo );
            $.each( trs ,function( k, tr ){
                var $tr = $(tr);                
                if( $tr.hasClass('bay-number') ){
                    return false;
                }
                var tds = $tr.find('.bay'); 
                $.each( tds, function( j, td ){                 
                    var $td = $(td);
                    
                    if( $td.attr('title') == 0 ){
                        var bayId =  that.boxesRowInfo[j];
                        if( bayId % 2 == 0 ){
                            $td.attr('colspan', 2 );
                        }
                        if( bayId < 10){
                            bayId = '0' + bayId
                        }
                        $td.attr('data-id',  bayId );
                    };
                })
            })
        },*/

        /*
         * 箱主
         */
        formateBoxesRowsByBox: function () {
            // 将boxes的数据转换为boxesRows，包括层高、位置等信息
            var boxesRows = [];
            var that = this;
            $.each(this.data.boxLatArr, function (k, v) {
                var boxes = v;
                var boxesLen = boxes.length;
                boxesRows[k] = [];
                for (var i = 0; i < boxesLen; i = i + 2) {
                    var prev = boxes[i - 1] ? boxes[i - 1].value : null;
                    var current = boxes[i] ? boxes[i].value : null;
                    var next = boxes[i + 1] ? boxes[i + 1].value : null;
                    var rowIndex = i / 2;
                    //console.log( rowIndex, prev, current, next );
                    boxesRows[k][rowIndex] = {};
                    if (current !== null) {
                        boxesRows[k][rowIndex].tower = current;
                        boxesRows[k][rowIndex].position = 'center';
                        boxesRows[k][rowIndex].bayIndex = i + 1;
                    } else {
                        if (prev !== null && next === null) {
                            boxesRows[k][rowIndex].tower = prev;
                            boxesRows[k][rowIndex].position = 'right';
                            boxesRows[k][rowIndex].bayIndex = i;
                        }
                        if (prev === null && next !== null) {
                            boxesRows[k][rowIndex].tower = next;
                            boxesRows[k][rowIndex].position = 'left';
                            boxesRows[k][rowIndex].bayIndex = i + 2;
                        }
                        if (prev === null && next === null) {
                            boxesRows[k][rowIndex].tower = current;
                            boxesRows[k][rowIndex].position = 'center';
                            boxesRows[k][rowIndex].bayIndex = i + 1;
                        }
                    }
                    //console.log( boxesRows[k][ rowIndex ] );
                    if (boxesRows[k][rowIndex].bayIndex < 10) {
                        boxesRows[k][rowIndex].bayIndex = '0' + boxesRows[k][rowIndex].bayIndex;
                    }
                };

            })
            $.each(boxesRows, function (k, rows) {
                $.each(rows, function (j, col) {
                    if (col.tower == null) {
                        col.position = that.boxesRowInfo[j];
                        col.bayIndex = that.boxesRowBayIndex[j] < 10 ? '0' + that.boxesRowBayIndex[j] : that.boxesRowBayIndex[j];
                    }
                })
            })
            this.data.boxesRows = boxesRows;
        },

        /*
         * 航线
         */
        formateBoxesRowsByRouter: function () {
            // 将boxes的数据转换为boxesRows，包括层高、位置等信息
            var boxesRows = [];
            var that = this;
            $.each(this.data.routeLatArr, function (k, v) {
                var boxes = v;
                var boxesLen = boxes.length;
                boxesRows[k] = [];
                for (var i = 0; i < boxesLen; i = i + 2) {
                    var prev = boxes[i - 1] ? boxes[i - 1].value : null;
                    var current = boxes[i] ? boxes[i].value : null;
                    var next = boxes[i + 1] ? boxes[i + 1].value : null;
                    var rowIndex = i / 2;
                    //console.log( rowIndex, prev, current, next );
                    boxesRows[k][rowIndex] = {};
                    if (current !== null) {
                        boxesRows[k][rowIndex].tower = current;
                        boxesRows[k][rowIndex].position = 'center';
                        boxesRows[k][rowIndex].bayIndex = i + 1;
                    } else {
                        if (prev !== null && next === null) {
                            boxesRows[k][rowIndex].tower = prev;
                            boxesRows[k][rowIndex].position = 'right';
                            boxesRows[k][rowIndex].bayIndex = i;
                        }
                        if (prev === null && next !== null) {
                            boxesRows[k][rowIndex].tower = next;
                            boxesRows[k][rowIndex].position = 'left';
                            boxesRows[k][rowIndex].bayIndex = i + 2;
                        }
                        if (prev === null && next === null) {
                            boxesRows[k][rowIndex].tower = current;
                            boxesRows[k][rowIndex].position = 'center';
                            boxesRows[k][rowIndex].bayIndex = i + 1;
                        }
                    }
                    //console.log( boxesRows[k][ rowIndex ] );
                    if (boxesRows[k][rowIndex].bayIndex < 10) {
                        boxesRows[k][rowIndex].bayIndex = '0' + boxesRows[k][rowIndex].bayIndex;
                    }
                };

            })
            $.each(boxesRows, function (k, rows) {
                $.each(rows, function (j, col) {
                    if (col.tower == null) {
                        col.position = that.boxesRowInfo[j];
                        col.bayIndex = that.boxesRowBayIndex[j] < 10 ? '0' + that.boxesRowBayIndex[j] : that.boxesRowBayIndex[j];
                    }
                })
            })
            this.data.boxesRows = boxesRows;
        },

        /*
         * 航次
         */
        formateBoxesRowsByVoyage: function () {
            // 将boxes的数据转换为boxesRows，包括层高、位置等信息
            var boxesRows = [];
            var that = this;
            $.each(this.data.voyageLatArr, function (k, v) {
                var boxes = v;
                var boxesLen = boxes.length;
                boxesRows[k] = [];
                for (var i = 0; i < boxesLen; i = i + 2) {
                    var prev = boxes[i - 1] ? boxes[i - 1].value : null;
                    var current = boxes[i] ? boxes[i].value : null;
                    var next = boxes[i + 1] ? boxes[i + 1].value : null;
                    var rowIndex = i / 2;
                    //console.log( rowIndex, prev, current, next );
                    boxesRows[k][rowIndex] = {};
                    if (current !== null) {
                        boxesRows[k][rowIndex].tower = current;
                        boxesRows[k][rowIndex].position = 'center';
                        boxesRows[k][rowIndex].bayIndex = i + 1;
                    } else {
                        if (prev !== null && next === null) {
                            boxesRows[k][rowIndex].tower = prev;
                            boxesRows[k][rowIndex].position = 'right';
                            boxesRows[k][rowIndex].bayIndex = i;
                        }
                        if (prev === null && next !== null) {
                            boxesRows[k][rowIndex].tower = next;
                            boxesRows[k][rowIndex].position = 'left';
                            boxesRows[k][rowIndex].bayIndex = i + 2;
                        }
                        if (prev === null && next === null) {
                            boxesRows[k][rowIndex].tower = current;
                            boxesRows[k][rowIndex].position = 'center';
                            boxesRows[k][rowIndex].bayIndex = i + 1;
                        }
                    }
                    //console.log( boxesRows[k][ rowIndex ] );
                    if (boxesRows[k][rowIndex].bayIndex < 10) {
                        boxesRows[k][rowIndex].bayIndex = '0' + boxesRows[k][rowIndex].bayIndex;
                    }
                };

            })
            $.each(boxesRows, function (k, rows) {
                $.each(rows, function (j, col) {
                    if (col.tower == null) {
                        col.position = that.boxesRowInfo[j];
                        col.bayIndex = that.boxesRowBayIndex[j] < 10 ? '0' + that.boxesRowBayIndex[j] : that.boxesRowBayIndex[j];
                    }
                })
            })
            this.data.boxesRows = boxesRows;
        },

        /*
         * 层高
         */
        formateBoxesRowsByTower: function () {
            // 将boxes的数据转换为boxesRows，包括层高、位置等信息
            var boxesRows = [];
            var boxesRowInfo = [];
            var boxesRowBayIndex = [];
            var that = this;
            var tempArr = [];
            var tempTitle = [];
            $.each(this.data.towerLatArr, function (k, v) {
                var arr = [];
                var tArr = [];
                $.each(v, function (m, n) {
                    arr.push(n.plan[0]);
                    tArr.push(n.value);
                })
                tempArr.push(arr);
                tempTitle.push(tArr);
            })
            $.each(this.data.towerLatArr, function (k, v) {
                var boxes = v;
                var boxesLen = boxes.length;
                boxesRows[k] = [];
                for (var i = 0; i < boxesLen; i = i + 2) {
                    var prev = boxes[i - 1] ? parseInt(boxes[i - 1].value) : 0;
                    var current = boxes[i] ? parseInt(boxes[i].value) : 0;
                    var next = boxes[i + 1] ? parseInt(boxes[i + 1].value) : 0;
                    var rowIndex = i / 2;
                    //console.log( rowIndex, prev, current, next );
                    boxesRows[k][rowIndex] = {};
                    if (!boxesRowInfo[rowIndex]) {
                        boxesRowInfo[rowIndex] = 'center';
                    }
                    if (!boxesRowBayIndex[rowIndex]) {
                        boxesRowBayIndex[rowIndex] = i + 1;
                    }
                    if (current > 0) {
                        boxesRows[k][rowIndex].tower = current;
                        boxesRows[k][rowIndex].position = 'center';
                        boxesRows[k][rowIndex].bayIndex = i + 1;
                        boxesRows[k][rowIndex].plan = boxes[i].plan[0] ? boxes[i].plan[0].replace(/[ ]/g, '') : '';
                    } else {
                        if (prev > 0 && next === 0) {
                            boxesRows[k][rowIndex].tower = prev;
                            boxesRows[k][rowIndex].position = 'right';
                            boxesRows[k][rowIndex].bayIndex = i;
                            boxesRowInfo[rowIndex] = 'right';
                            boxesRowBayIndex[rowIndex] = i;

                        }
                        if (prev === 0 && next > 0) {
                            boxesRows[k][rowIndex].tower = next;
                            boxesRows[k][rowIndex].position = 'left';
                            boxesRows[k][rowIndex].bayIndex = i + 2;
                            boxesRows[k][rowIndex].plan = boxes[i + 1].plan[0] ? boxes[i + 1].plan[0].replace(/[ ]/g, '') : '';
                            boxesRowInfo[rowIndex] = 'left';
                            boxesRowBayIndex[rowIndex] = i + 2;
                        }
                        if (prev === 0 && next === 0) {
                            boxesRows[k][rowIndex].tower = current;
                            boxesRows[k][rowIndex].position = 'center';
                            boxesRows[k][rowIndex].bayIndex = i + 1;
                            boxesRows[k][rowIndex].plan = boxes[i].plan[0] ? boxes[i].plan[0].replace(/[ ]/g, '') : '';
                        }
                    }
                    //console.log( boxesRows[k][ rowIndex ] );
                    if (boxesRows[k][rowIndex].bayIndex < 10) {
                        boxesRows[k][rowIndex].bayIndex = '0' + boxesRows[k][rowIndex].bayIndex;
                    }

                };
            })
            this.boxesRowInfo = boxesRowInfo;
            this.boxesRowBayIndex = boxesRowBayIndex;
            $.each(boxesRows, function (k, rows) {
                $.each(rows, function (j, col) {
                    if (col.tower == 0) {
                        col.position = that.boxesRowInfo[j];
                        col.bayIndex = that.boxesRowBayIndex[j] < 10 ? '0' + that.boxesRowBayIndex[j] : that.boxesRowBayIndex[j];
                    }
                })
            })
            this.data.boxesRows = boxesRows;
        },

        /*
         *
         */
        generateBoxesInfo: function (option) {
            var boxesinfo = '',
                boxPosition = [],
                that = this;
            this.data.boxesRows = [];
            this.data.boxesBayNumber = [];
            this.data.boxPositions = [];
            // this.data.boxes ? this.data.boxes : testBoxes;

            // 将boxes的数据转换为boxesRows，包括层高、位置等信息\Z
            switch (option) {
                case 'box':
                    this.formateBoxesRowsByBox();
                    break;
                case 'tower':
                    this.formateBoxesRowsByTower();
                    break;
                case 'voyage':
                    this.formateBoxesRowsByVoyage();
                    break;
                case 'route':
                    this.formateBoxesRowsByRouter();
                    break;
            }

            // 构建贝位上的箱子信息(高度，是否大箱，等)
            this.data.boxPositions ? this.data.boxPositions : testBoxePositions;

            var objColorConfigs = {},
                colorCfgKeys = [],
                tempKeys = [];
            $.each(this.data.boxesRows, function (k, boxes) {
                $.each(boxes, function (j, t) {
                    if (!(!t.tower && typeof (t.tower) != 'undefined' && t.tower != 0)) {
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
                objColorConfigs[v] = {
                    'text': v,
                    'color': that.defaultColorConfigs[i]
                }
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
                        parseInt(tower) === 0 ? (bgcolor = '#fff') : (bgcolor = objColorConfigs[tower - 1] ? objColorConfigs[tower].color : '#fff');
                    } else {
                        bgcolor = objColorConfigs[tower] ? objColorConfigs[tower].color : '#fff';
                    }
                    //boxesBays.push({ 'tower': tower, 'bgcolor':bgcolor, 'position':position, 'isLeft': isLeft, 'isRight': isRight });                    
                    tempBay.isLeft = isLeft;
                    tempBay.isRight = isRight;
                    tempBay.bgcolor = bgcolor;
                    tempBay.tower = tower;
                    tempBay.position = position;
                    tempBay.bayIndex = t.bayIndex;
                    tempBay.plan = t.plan;
                    boxesBays.push(tempBay);
                });
                boxes.boxesBays = boxesBays;
            });

            // 构建贝位数字
            $.each(this.data.boxesRows[0], function (j, box) {
                that.data.boxesBayNumber.push({
                    'number': j * 2 + 1
                });
            })
            //console.log(this.data.boxesBayNumber);
            boxesinfo = jsrender.templates(boxesInfoTemplate).render(this.data);
            //console.log(JSON.stringify(this.data.boxesRows));
            return boxesinfo;
        },

        /*
         * 展示加载动画
         */
        showLoading: function () {
            $('.loading-img').addClass('loading-active');
            $('.boxes-style').removeClass('boxes-active');
        },
        hideLoading: function () {
            $('.loading-img').removeClass('loading-active');
            $('.boxes-style').addClass('boxes-active');
        }
    });

    return POPUP;
});