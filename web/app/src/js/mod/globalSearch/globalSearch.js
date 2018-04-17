/**
 * @moudle mod/globalSearch/globalSearch 全局搜索
 */
define(function(require) {
    'use strict'
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');
    var CenterPopup = require('mod/popup/centerPop');
    // var jobCenterPopup = require('mod/popup/jobCenterPop');
    var BoxDetailPop = require('mod/boxDetailPop/boxDetailPop');
    var BoxAnimatePop = require('mod/boxAnimatePop/boxAnimatePop');
    var BoxMarker = require('mod/boxMarker/boxMarker');

    var globalSearchTemp =
        '<div class="global-search-bar">' +
        '<div class="search-bar">' +
        '<div class="btn-group">' +
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">机械设备 <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a href="javascript:void(0)">机械设备</a></li>' +
        '<li><a href="javascript:void(0)">集装箱</a></li>' +
        '</ul>' +
        '</div>' +
        // '<div class="mc-input-group">' + 
        '<div class="input-group">' +
        '<input type="text" id="global-search" class="form-control" onKeypress="if ((event.keyCode > 32 && event.keyCode < 48) || (event.keyCode > 57 && event.keyCode < 65) || (event.keyCode > 90 && event.keyCode < 97)) event.returnValue = false;" placeholder="请输入设备编号">' +
        '<span class="clear">删除</span>' +
        '</div>' +
        // '<span class="clear ">删除</span>' + 
        // '</div>' + 
        '</div>' +
        '<div class="extraCondition">' +
        '<label>' +
        '<h5>查看轨迹</h5>' +
        '<input type="checkbox">' +
        '</label>' +
        '</div>' +
        '</div>' +
        '<div id="J_global_searchList" class="j-global-searchList"></div>';
    var searchPanelTemp =
        '<div class="panel panel-default mc-panel search-result-popup">' +
        '<div class="panel-heading mc-panel-heading">' +
        '<h3 class="panel-title">搜索结果</h3>' +
        '</div>' +
        '<div class="panel-body class="hide">' +
        '<div class="result-list">' +
        '<table>' +
        '<tbody>' +
        '{{if searchList.length}}' +
        '{{for searchList}}' +
        '{{if ~root.searchType == "eq"}}' +
        '<tr searchType="{{:#data.TYPE}}">' +
        '<td>{{:#data.CODE}}</td>' +
        '</tr>' +
        '{{else}}' +
        '<tr {{if #data.notInPort == true}}class="disabled"{{/if}}>' +
        '<td>{{:#data.OBJ_CTN_NO}} {{if #data.notInPort == true}}<span style="float: right;">不在场</span>{{/if}}</td>' +
        '</tr>' +
        '{{/if}}' +
        '{{/for}}' +
        '{{else searchList.length==0}}' +
        '<tr class="disabled"><td>无搜索结果</td></tr>' +
        '{{else searchList.init}}' +
        '' +
        '{{/if}}' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        // '<div class="device-info-bottom">' + 
        //     '<div class="loading" style="display: none;"></div>' + 
        //     '<input class="datainp wicon" id="J_date_input" type="text" placeholder="YYYY-MM-DD" value=""  readonly>' + 
        //     '<div id="J_date_refix"></div>' + 
        // '</div>' + 
        '</div>' +
        '</div>';

    var closeTrailTemp =
        '<div class="closeTrail j-closeTrail">' +
        '关闭<br>' +
        '轨迹' +
        '</div>';
    var GLOBALSEARCH = function(cfg) {
        if (!(this instanceof GLOBALSEARCH)) {
            return new GLOBALSEARCH().init(cfg);
        }
    };

    GLOBALSEARCH.prototype = $.extend(new McBase, {
        init: function(cfg) {
            this.wraper = $('#J_global_search');
            if (!this.wraper || !this.wraper.length) {
                return false;
            }
            this._zr = cfg.zr;
            this._observer = cfg.observer;
            this.initPop();
            this.bindEvent();
            return this;
        },
        initPop: function() {
            if (!this._boxDeatilPop) {
                this._boxDeatilPop = BoxDetailPop({
                    'observer': this._observer,
                    'elementId': '#J_centerPop'
                })
            }
            if (!this._boxAnimatePop) {
                this._boxAnimatePop = BoxAnimatePop({
                    'observer': this._observer,
                    'elementId': '#J_centerPop'
                })
            }
        },
        bindEvent: function() {
            var that = this;
            $('#J_global_search')
                .on('click', '.dropdown-menu li', function(ev) {
                    var $toggle = $('.btn-group button.dropdown-toggle'),
                        $input = $('.input-group input'),
                        $obj = $('.extraCondition h5');
                    if ($toggle.text() === $(this).text()) return;
                    $input.val('');
                    $('.extraCondition input').prop('checked', false);
                    that.renderSearchResult({
                        init: true
                    });
                    $toggle.html($(this).text() + ' <span class="caret"></span>');
                    $input.attr('placeholder', $(this).text().indexOf('集装箱') > -1 ? '请输入集装箱号码' : '请输入设备代码');
                    if ($(this).index() === 0) {
                        $obj.html('查看轨迹');
                    } else {
                        $obj.html('查看作业状态');
                    }
                })
                .on('click', '.input-group .clear', function() {
                    $('#global-search').val('')
                    $('#J_global_searchList .panel-body').addClass('hide');
                })
                .on('focus', '#global-search', function() {
                    // that._observer.hidePop();
                    $('.input-group .clear').addClass('active');
                })
                .on('blur', '#global-search', function() {
                    $('.input-group .clear').removeClass('active');
                })
                .on('keyup', '#global-search', function() {
                    var val = $('#global-search').val();
                    that.searchVal = val;
                    if (val === '') {
                        $('#J_global_searchList .panel-body').addClass('hide');
                        return;
                    }
                    var text = $('#global-search').attr('placeholder');
                    if (text.indexOf('集装箱') > -1) {
                        if (val.length >= 2) {
                            that.searchType = 'ctn';
                            that.showSearchResultPop();
                            var url = '/lycos/' + val + '?type=ctn',
                                method = 'GET',
                                params = {
                                    searchVal: val,
                                },
                                fnSuccess = that.renderSearchResult;
                            that.postData(url, method, params, fnSuccess);
                        } else {
                            $('#J_global_searchList .panel-body').addClass('hide');
                        }
                    } else if (text.indexOf('设备') > -1) {
                        if (val.length >= 2) {
                            that.searchType = 'eq';
                            that.showSearchResultPop();
                            var url = '/lycos/' + val + '?type=equip',
                                method = 'GET',
                                params = {
                                    searchVal: val,
                                },
                                fnSuccess = that.renderSearchResult;
                            that.postData(url, method, params, fnSuccess);
                        } else {
                            $('#J_global_searchList .panel-body').addClass('hide');
                        }
                    }
                })
                .on('click', '.result-list tr:not(".disabled")', function(ev) {
                    // 获取当前点击的设备
                    var currSearch = $(ev.currentTarget),
                        currVal = $(ev.target).text(),
                        currsearchTp, dataTp;
                    // 高亮选中设备
                    if (that.searchType === 'eq') {
                        currsearchTp = currSearch.attr('searchType');
                        switch (currsearchTp) {
                            case 'truck':
                                dataTp = 'containers';
                                break;
                            case 'bridgeCrane':
                                dataTp = 'bridgecranes';
                                break;
                            case 'gantryCrane':
                                dataTp = 'gantrycranes';
                                break;
                            case 'emptyContainerHandlers':
                                dataTp = 'stackers';
                                break;
                            case 'reachStacker':
                                dataTp = 'reachstackers';
                                break;
                        }
                        $.each(that._observer._overMap[dataTp], function(k, v) {
                            if (v._equipmentCode === currVal) {
                                //that._observer.showProfilePop(v);
                                //that._observer._baseMap.setMapCenter( {x: v.initX, y:v.initY} );
                                // todo:获取选中设备的轨迹图
                                that._observer.showProfilePop(v);
                                that._observer._baseMap.setMapCenter && that._observer._baseMap.setMapCenter({
                                    x: v.initX,
                                    y: v.initY
                                });
                                that._observer._baseMap.setGdMapCenter && that._observer._baseMap.setGdMapCenter({
                                    x: v.drawX * that._observer._overMap.showScale,
                                    y: v.drawY * that._observer._overMap.showScale
                                })
                                $('.extraCondition input').prop('checked') && that._observer.renderTrail(v);
                            }
                        })
                    } else {
                        // var url = '/mainObject/ctn/obj/ctn_no/EQUALS/' + currVal,
                        //     method = 'GET',
                        //     params = {},
                        //     fnSuccess = that.renderBoxDetail;
                        // that.postData(url, method, params, fnSuccess);
                        that._observer.hidePop();
                        // 开启获取搜索箱子的请求
                        that._observer._isgetSearchBox = false;
                        that._observer.searchBoxNum = currVal;
                    }
                    // that.renderSearchResult([]);
                    // 隐藏搜索结果框
                    // that.hide();
                    // that._observer.hidePop();
                })

            $('#J_closeTrail')
                .on('click', '.j-closeTrail', function() {
                    that._observer.hideContainerTrailMap();
                    $(this).addClass('hide');
                })
        },
        render: function() {
            $('#J_global_search').html(jsrender.templates(globalSearchTemp).render());
            this.renderSearchResult({
                searchList: {
                    init: true
                }
            });
        },
        /**
         * 显示确定设备的轨迹
         */
        // renderTrail: function( obj ) {
        //     var parent = this;

        //     var url = '/data/truckGps/track?codes=' + obj._equipmentCode,
        //         method = 'GET',
        //         params = {},
        //         fnSuccess = function(data){
        //             console.log( data );
        //             var points = [];
        //             $.each( data, function(k, v){
        //                 if( !v.LINE ){
        //                     return false;
        //                 }
        //                 var pathLine = [];
        //                 $.each(v.LINE, function(l,p){
        //                     var point = [parent._observer.convertFromLng(p.LONGITUDE),parent._observer.convertFromLat(p.LATITUDE) + 100];
        //                     pathLine.push( point );
        //                 })

        //                 points.push( pathLine );
        //             })
        //             parent._observer.showContainerTrailMap( points );
        //             $('#J_closeTrail').html(jsrender.templates( closeTrailTemp ).render());
        //             // parent._observer.showProfilePop(obj);
        //             parent._observer._baseMap.setMapCenter( {x: obj.initX, y:obj.initY} );
        //         };
        //     this.postData( url, method, params, fnSuccess );

        // },
        /**
         * render搜索结果弹框
         */
        renderSearchResult: function(data) {
            if (data.length) {
                if(data[0].SEARCHVALUE !== this.searchVal)    // 通过判断确保渲染的是最后一次发的搜索请求的结果
                    return true;
                $.each(data, function(k, v) {
                    if (v.GPS_ID && v.STA_ID) {
                        v.notInPort = false;
                    } else {
                        v.notInPort = true;
                    }
                });
            }
            var renderData = {
                'searchList': data,
                'searchType': this.searchType
            }
            var searchWraper = jsrender.templates(searchPanelTemp).render(renderData);
            $('#J_global_searchList').html(searchWraper);
        },
        /**
         * 渲染箱子详情
         */
        renderBoxDetail: function(data) {
            if (!data[0]) return;

            var pop = CenterPopup({
                'elementId': '#J_centerPop',
                'type': 'center',
                'observer': this._observer
            });
            var boxMarker = BoxMarker({
                zr: this._zr,
                observer: this._observer,
                boxData: data[0],
                scaleRatio: this._observer.showScale
                    // x: ,
                    // y: ,
            });
            var $input = $('.extraCondition input');
            data[0].CTN_NO = data[0].CTN_NO || data[0].OBJ_CTN_NO;
            if ($input.prop('checked')) {
                // 箱子详情弹框
                // this._boxDeatilPop.renderBoxDetailPop( data[0] );
                // this._boxDeatilPop.setPosition('inline');

                this._boxAnimatePop.renderBoxAnimationPop(data[0]);
                // this._boxAnimatePop.setPosition('inline');        
            } else {
                boxMarker.draw();
                // this._observer.showProfilePop(data[0]);
                // this._boxDeatilPop.renderBoxDetailPop( data[0] );
            }

            // this._observer._popLayer.showPop('boxDetail', data);
        },
        /**
         * desc: 展示搜索结果列表
         */
        showSearchResultPop: function() {
            $('#J_global_searchList .panel-body').removeClass('hide');
        },
        /**
         * desc: 显示全局搜索组件
         */
        show: function() {
            this.wraper.show();
        },
        hide: function() {
            // 隐藏搜索结果框
            // $('#J_global_searchList').removeClass('curr-active');
            this.wraper.hide();
        },
        postData: function(url, method, params, fnSuccess, fnError) {
            var defer = $.Deferred();
            var that = this;
            url = '/portvision' + url;
            $.ajax({
                url: url,
                method: method,
                data: params,
                dataType: 'json',
                success: function(data) {
                    if (data && typeof(data) !== 'object') {
                        data = JSON.parse(data);
                    }
                    // that.removeLoading();
                    fnSuccess && fnSuccess.call(that, data);
                },
                error: function(data, status) {
                    fnError && fnError(status);
                }
            });
            return defer.promise;
        }
    });

    return GLOBALSEARCH;
});