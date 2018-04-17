/**
 * @module port/mod/popup/center 视图中央的弹框  
 * 已经进行拆分
 */
define(function(require) {
    'use strict';    
    var McBase = require('base/mcBase');
    var jsrender = require('plugin/jsrender/jsrender');//jsrender模板库
    var boxDetailPop = require('mod/boxDetailPop/boxDetailPop');

    var boxColor = ['#8387f5','#f6f684','#83f5dc','#f683e2','#a0727d'];
    
    var testBayDetailData = {
        'number':'26',        
    };    

    var testContainerDetailData = {
        'type':'container',
        'topInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
        'middleInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
        'bottomInfo':[
            {name:'箱号',text:'EMS23434412'},{name:'尺寸',text:'21m * 3m * 3m'},
            {name:'箱重',text:'5T'},{name:'进出口',text:'出口'},{name:'是否重箱',text:'是'}
        ],
    };

    var centerPopTemp = '<div class="left">' +

                            '</div>' +
                            '<div class="right">' +

                        '</div>';

    var centerbayDetailWraperTemplate = '<div class="popup popup-left fixed-center md inline bay-pop j-bay-detail">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                   + '<p class="pop-title">{{if yardId}}{{>yardId}}堆场{{/if}}{{>bay}}<span class="j-additional"></span>贝位</p>'
                   + '<span class="pop-close j-close">关闭</span>'
                + '</div>'
                + '<div class="pop-body">'           
                + '</div>'
                + '<div class="pop-footer">'
                    + '<select class="pop-select" id="J_change_time"><option>现在</option><option>将来</option><option>综合</option></select>'
                    + '{{if isBoat}}'
                    + '<select class="pop-select" id="J_change_pro">'
                        + '<option value="box">箱主</option>'
                        + '<option value="size">尺寸</option>'
                        + '<option value="port">卸货港</option>'
                    + '</select>'
                    + '<div class="boatBay-switchs">'
                      + '<span class="j-dSwitch active">甲板</span>'
                      + '<span class="j-hSwitch">船舱</span>'
                    + '</div>'
                    + '{{else}}'
                    + '<select class="pop-select" id="J_change_pro">'
                        + '<option value="box">箱主</option>'
                        + '<option value="route">航线</option>'
                        + '<option value="voyage">航次</option>'
                    + '</select>'
                    + '{{/if}}'
                + '</div>'
            + '</div>'
        + '</div>';  

    var centerboxAnimateTemplate = '<div class="popup popup-left fixed-center md inline bay-pop">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                   + '<p class="pop-title">集装箱编号{{>CTN_NO}}</p>'
                   + '<span class="pop-close j-close">关闭</span>'
                + '</div>'
                + '<div class="pop-body">' 
                    // + '<img src="../../src/js/mod/popup/images/road.png" alt="" />'  
                + '{{if CURRENT_STATUS == "ONROAD"}}'
                     + '<div class="{{>CURRENT_STATUS}} jobAnimate">'
                         + '<div class="base"></div>'
                         + '<div class="tree"></div>'
                         + '<div class="car"></div>'
                     + '</div>'
                     + '<div class="jobInfo">'
                         + '<ul>'
                             + '<li>'
                                 + '<span class="pull-left">道路：</span>'
                                 + '<span class="pull-right"></span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集卡编号：</span>'
                                 + '<span class="pull-right">{{>TRUCK_CODE}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集装箱编号：</span>'
                                 + '<span class="pull-right">{{>CTN_NO}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集装箱箱主：</span>'
                                 + '<span class="pull-right">{{>CTN_OPERATOR_CODE}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">作业类型：</span>'
                                 + '<span class="pull-right">'
                                    + '{{if JOB_TYPE == "LOAD"}}'
                                         + '装船'
                                    + '{{else JOB_TYPE == "DSCH"}}'
                                         + '卸船'
                                    + '{{else JOB_TYPE == "RECV"}}'
                                         + '进箱'
                                    + '{{else JOB_TYPE == "DLVR"}}'
                                         + '提箱'
                                    + '{{/if}}'
                                 + '</span>'
                             + '</li>'
                         + '</ul>'
                     + '</div>'
                 + '{{else CURRENT_STATUS == "INYARD" || CURRENT_STATUS == "OUTYARD"}}'  
                      + '<div class="{{>CURRENT_STATUS}} jobAnimate">'
                          + '<div class="base"></div>'
                          + '<div class="gantrycrane"></div>'
                          + '<div class="grabUp"></div>'
                          + '<div class="grabDown"></div>'
                          + '<div class="guardrail"></div>'
                          + '<div class="car"></div>'
                      + '</div>'
                      + '<div class="jobInfo">'
                          + '<ul>'
                              + '<li>'
                                  + '<span class="pull-left">堆场编号：</span>'
                                  + '<span class="pull-right">{{>ACTUAL_POSITION_BLOCK}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">龙门吊编号：</span>'
                                  + '<span class="pull-right">{{>EQUIPMENT_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集卡编号：</span>'
                                  + '<span class="pull-right">{{>TRUCK_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集装箱编号：</span>'
                                  + '<span class="pull-right">{{>CTN_NO}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集装箱箱主：</span>'
                                  + '<span class="pull-right">{{>CTN_OPERATOR_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">作业类型：</span>'
                                  + '<span class="pull-right">'
                                     + '{{if JOB_TYPE == "LOAD"}}'
                                          + '装船'
                                     + '{{else JOB_TYPE == "DSCH"}}'
                                          + '卸船'
                                     + '{{else JOB_TYPE == "RECV"}}'
                                          + '进箱'
                                     + '{{else JOB_TYPE == "DLVR"}}'
                                          + '提箱'
                                     + '{{/if}}'
                                  + '</span>'
                              + '</li>'
                          + '</ul>'
                      + '</div>'
                + '{{else CURRENT_STATUS == "OUTSHIP" || CURRENT_STATUS == "INSHIP"}}'  
                    + '<div class="{{>CURRENT_STATUS}} jobAnimate">'
                        + '<div class="base"></div>'
                        + '<div class="gantrycrane"></div>'
                        + '<div class="gantryString"></div>'
                        + '<div class="gantryDown"></div>'
                        + '<div class="gantryDown"></div>'
                        + '<div class="gantryUp"></div>'
                        + '<div class="gantryShadow"></div>'
                        + '<div class="grabUp"></div>'
                        + '<div class="grabDownY"></div>'
                        + '<div class="grabDownN"></div>'
                        + '<div class="tree"></div>'
                        + '<div class="car"></div>'
                    + '</div>'
                    + '<div class="jobInfo">'
                        + '<ul>'
                            + '<li>'
                                + '<span class="pull-left">泊位编号：</span>'
                                + '<span class="pull-right">{{>ACTUAL_LOCATION}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">桥吊编号：</span>'
                                + '<span class="pull-right">{{>EQUIPMENT_CODE}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">船名航次：</span>'
                                + '<span class="pull-right">{{>VESSEL_REFERENCE}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">集卡编号：</span>'
                                + '<span class="pull-right">{{>TRUCK_CODE}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">集装箱编号：</span>'
                                + '<span class="pull-right">{{>CTN_NO}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">集装箱箱主：</span>'
                                + '<span class="pull-right">{{>CTN_OPERATOR_CODE}}</span>'
                            + '</li>'
                            + '<li>'
                                + '<span class="pull-left">作业类型：</span>'
                                + '<span class="pull-right">'
                                   + '{{if JOB_TYPE == "LOAD"}}'
                                        + '装船'
                                   + '{{else JOB_TYPE == "DSCH"}}'
                                        + '卸船'
                                   + '{{else JOB_TYPE == "RECV"}}'
                                        + '进箱'
                                   + '{{else JOB_TYPE == "DLVR"}}'
                                        + '提箱'
                                   + '{{/if}}'
                                + '</span>'
                            + '</li>'
                        + '</ul>'
                    + '</div>'
                + '{{else CURRENT_STATUS == "OUTGATE" || CURRENT_STATUS == "INGATE"}}'  
                     + '<div class="{{>CURRENT_STATUS}} jobAnimate">'
                         + '<div class="base"></div>'
                         + '<div class="car"></div>'
                     + '</div>'
                     + '<div class="jobInfo">'
                         + '<ul>'
                             + '<li>'
                                 + '<span class="pull-left">闸口编号：</span>'
                                 + '<span class="pull-right">'
                                    + '{{if JOB_TYPE == "LOAD"}}' 
                                        + '闸口1'
                                    + '{{else}}'
                                        + '闸口2'
                                    + '{{/if}}'
                                 + '</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">目标堆场：</span>'
                                 + '<span class="pull-right">{{>ACTUAL_POSITION_BLOCK}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集卡编号：</span>'
                                 + '<span class="pull-right">{{>TRUCK_CODE}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集装箱编号：</span>'
                                 + '<span class="pull-right">{{>CTN_NO}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">集装箱箱主：</span>'
                                 + '<span class="pull-right">{{>CTN_OPERATOR_CODE}}</span>'
                             + '</li>'
                             + '<li>'
                                 + '<span class="pull-left">作业类型：</span>'
                                 + '<span class="pull-right">'
                                    + '{{if JOB_TYPE == "LOAD"}}'
                                         + '装船'
                                    + '{{else JOB_TYPE == "DSCH"}}'
                                         + '卸船'
                                    + '{{else JOB_TYPE == "RECV"}}'
                                         + '进箱'
                                    + '{{else JOB_TYPE == "DLVR"}}'
                                         + '提箱'
                                    + '{{/if}}'
                                 + '</span>'
                             + '</li>'
                         + '</ul>'
                     + '</div>'
                + '{{else}}'
                    + '<div class="OUTYARD jobAnimate">'
                          + '<div class="base"></div>'
                          + '<div class="gantrycrane"></div>'
                          + '<div class="grabUp"></div>'
                          + '<div class="grabDown"></div>'
                          + '<div class="guardrail"></div>'
                          + '<div class="car"></div>'
                      + '</div>'
                      + '<div class="jobInfo">'
                          + '<ul>'
                              + '<li>'
                                  + '<span class="pull-left">堆场编号：</span>'
                                  + '<span class="pull-right">{{>ACTUAL_POSITION_BLOCK}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">龙门吊编号：</span>'
                                  + '<span class="pull-right">{{>EQUIPMENT_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集卡编号：</span>'
                                  + '<span class="pull-right">{{>TRUCK_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集装箱编号：</span>'
                                  + '<span class="pull-right">{{>CTN_NO}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">集装箱箱主：</span>'
                                  + '<span class="pull-right">{{>CTN_OPERATOR_CODE}}</span>'
                              + '</li>'
                              + '<li>'
                                  + '<span class="pull-left">作业类型：</span>'
                                  + '<span class="pull-right">'
                                     + '{{if JOB_TYPE == "LOAD"}}'
                                          + '装船'
                                     + '{{else JOB_TYPE == "DSCH"}}'
                                          + '卸船'
                                     + '{{else JOB_TYPE == "RECV"}}'
                                          + '进箱'
                                     + '{{else JOB_TYPE == "DLVR"}}'
                                          + '提箱'
                                     + '{{/if}}'
                                  + '</span>'
                              + '</li>'
                          + '</ul>'
                      + '</div>'
                + '{{/if}}'
                + '</div>'
            + '</div>'
        + '</div>';  

    var centerContainerDetailWraperTemplate = '<div class="popup popup-right fixed-center md bay-pop inline">'
            + '<div class="pop-content ">'
                + '<div class="pop-header">'
                   + '<p class="pop-title text-left">集装箱详情</p>'
                   + '<span class="pop-close j-close-container">关闭</span>'
                + '</div>'
                + '<div class="pop-body">' 
                + '</div>'
                // + '<div class="pop-footer">'
                // + '</div>'
            + '</div>'
        + '</div>';  

    var containerDetailTemplate = '<div class="equ-detail">'
            + '<div class="info-top clearfix">'
                + '<div class="inline-left ">'
                    + '<img src="" alt="" />'
                + '</div>'
                + '<div class="inline-right">'
                    + '<p>箱号：{{:OBJ_CTN_NO}}</p>'
                    + '<p>尺寸：{{:OBJ_CTN_SIZE}}</p>'
                    + '<p>箱高：{{:OBJ_CTN_HEIGHT}}</p>'
                    + '<p>皮重：{{:OBJ_TARE_WEIGHT}}</p>'
                    + '<p>箱主：{{:OBJ_CTN_OPERATOR_CODE}}</p>'
                + '</div>'
            + '</div>'
            + '<div class="info-list clearfix">'
                + '<ul>'
                    + '<li>箱型：{{:OBJ_CTN_TYPE}}</li>'
                    + '<li>箱型尺寸：{{:OBJ_CTN_SIZE}}{{:OBJ_CTN_TYPE}}</li>'
                	+ '<li>超限类型：{{:STA_OD_TYPE}}</li>'
                	+ '<li>危险品类型：{{:STA_HAZARD_TYPE}}</li>'
                	+ '<li>空重状态:'
	                	+ '{{if STA_CTN_STATUS == "F"}}重'
	            		+ '{{else STA_CTN_STATUS == "E"}}空'
	            		+ '{{else STA_CTN_STATUS == "L"}}重'
	                	+ '{{/if}}'
                	+ '</li>'
                	+ '<li>箱状态：'
                		+ '{{if STA_CTN_STATUS == "F"}}整箱'
                		+ '{{else STA_CTN_STATUS == "E"}}空箱'
                		+ '{{else STA_CTN_STATUS == "L"}}拼箱'
	                	+ '{{/if}}'
                	+ '</li>'
                    + '<li>进港类型：'
                    	+ '{{if STA_CTN_CATEGORY == "I"}}进口'
                    	+ '{{else STA_CTN_CATEGORY == "E"}}出口'
                    	+ '{{else STA_CTN_CATEGORY == "T"}}中转'
                    	+ '{{else STA_CTN_CATEGORY == "Z"}}国际中转'
                    	+ '{{else STA_CTN_CATEGORY == "R"}}翻舱'
                    	+ '{{else STA_CTN_CATEGORY == "M"}}存储箱'
                    	+ '{{else STA_CTN_CATEGORY == "S"}}过境箱'
                    	+ '{{else STA_CTN_CATEGORY == "N"}}未知'
                    	+ '{{/if}}'
                    + '</li>'
                    + '<li>铅封号：{{:STA_SEAL_NO}}</li>'
                + '</ul>'
            + '</div>'            
            + '<div class="info-list clearfix">'
                + '<ul>'
                /*+ ' {{if STA_CTN_CATEGORY == "I"}}'
	                + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
	                + '<li>航次：{{:GPS_IN_VOYAGE}}</li>'
	                + '<li>航次代码：暂无</li>'
	            + ' {{else STA_CTN_CATEGORY == "E"}}'
	                + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
	                + '<li>航次：{{:GPS_OUT_VOYAGE}}</li>'
	                + '<li>航次代码：暂无</li>'
                + ' {{else STA_CTN_CATEGORY == "T" || STA_CTN_CATEGORY == "Z"}}'
                	+ ' {{if GPS_PLAN_POSITION_QUALIFER == "V"}}'
		                + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
		                + '<li>航次：{{:GPS_OUT_VOYAGE}}</li>'
		                + '<li>航次代码：暂无</li>'
	                + '{{else}}'
		                + '<li>船名：{{:GPS_VESSEL_CODE}}</li>'
		                + '<li>航次：{{:GPS_IN_VOYAGE}}</li>'
		                + '<li>航次代码：暂无</li>'
	                + ' {{/if}}'
	            + ' {{/if}}'*/
                + ' {{if !STA_OUT_VOYAGE}}'
                + '<li>船名：{{:STA_VESSEL_CODE}}</li>'
                + '<li>航次：{{:STA_IN_VOYAGE}}</li>'
                + '<li>航次代码：{{:STA_OUTBOUND_CARRIER}}</li>'
                + ' {{else}}'
                + '<li>船名：{{:STA_VESSEL_CODE}}</li>'
                + '<li>航次：{{:STA_OUT_VOYAGE}}</li>'
                + '<li>航次代码：{{:STA_OUTBOUND_CARRIER}}</li>'
                +' {{/if}}'
                + '</ul>'
            + '</div>'
            + '<div class="info-list clearfix">'
	            + '<ul>'
		            + '<li>装货港：{{:STA_LOAD_PORT_CODE}}</li>'
		            + '<li>卸货港：{{:STA_DISCHARGE_PORT_CODE}}</li>'
		            + '<li>中转港：{{:STA_TRANSFER_PORT_CODE}}</li>'
		            + '<li>目的港：{{:STA_DESTINATION_PORT_CODE}}</li>'
	            + '</ul>'
	        + '</div>'
	        + '<div class="info-list clearfix">'
	            + '<ul>'
		            + '<li>场箱区分类：{{:GPS_ACTUAL_POSITION_BLOCK}}</li>'
		            + '<li>场箱位：{{:GPS_ACTUAL_SLOT_POSITION}}</li>'
	            + '</ul>'
	        + '</div>'
        + '</div>';

   
    var CENTERPOPUP = function (cfg) {
        if (!(this instanceof CENTERPOPUP)) {
            return new CENTERPOPUP().init(cfg);
        }
    };

    CENTERPOPUP.prototype = $.extend(new McBase(), {

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
            this.colorSet = cfg.colorSet || null; //得到颜色配置信息
            this.colorSet = {
                'boxOwnerColor': {
                    'MOL': '#ffcccc',
                    'MSK': '#ffb8b8',
                    'MSC': '#fe7a7a',
                    'EMC': '#ff5b5b',
                    'HLC': '#bae9ff',
                    'KMD': '#94ddff',
                    'SML': '#73d2ff',
                    'DJS': '#4cc6ff',
                    'EMC': '#ffccec',
                    'SCI': '#ffa8df',
                    'IAL': '#ff86d3',
                    'KLN': '#ff61c6',
                    'IRS': '#ff61c6',
                    'HJS': '#90ff95',
                    'TJM': '#6af271',
                    'SNL': '#2fd336',
                    'WOS': '#2fd336',
                    'NWO': '#ddadff'
                },
                'shipLineColor': {
                    'MSCSES': '#ffcccc',
                    '2M2US3': '#ffb8b8',
                    '2M2BLS': '#fe7a7a',
                    'NLHNMX': '#ff5b5b',
                    'MSCJPN': '#bae9ff',
                    'MSCMID': '#94ddff',
                    'EMCEUP': '#73d2ff',
                    'MSCJP2': '#4cc6ff',
                    '2M2EU3': '#ffccec',
                    'KMDIR6': '#ffa8df',
                    'KMDSD57': '#ff86d3',
                    'PCLSS25': '#ff61c6',
                    'DYSPT42': '#ff61c6',
                    'MARLO1': '#90ff95',
                    'YMLCY1': '#6af271',
                    'NYKLO10': '#2fd336',
                    'MARGL8': '#2fd336',
                    'KMDCA27': '#ddadff'
                },
                'shipVoyageColor': {
                    '707W': '#ffcccc',
                    '707E': '#ffb8b8',
                    'FT707W': '#fe7a7a',
                    'D4243': '#ff5b5b',
                    'HI708A': '#bae9ff',
                    'FK707A': '#94ddff',
                    '0916W': '#73d2ff',
                    'HI707A': '#4cc6ff',
                    '705W': '#ffccec',
                    'OOLNY8': '#ffa8df',
                    'EMCED13': '#ff86d3',
                    'KMDSN7': '#ff61c6',
                    'OOLIT7': '#ff61c6',
                    'CMACM6': '#90ff95',
                    'HMMHI6': '#6af271',
                    'LHE52102': '#2fd336',
                    'HSDFR1': '#2fd336',
                    'MAREE4': '#ddadff'
                }
            };
            //this.getBayDetail();
            //this.render();
            this.initPop();
            return this;
        },

        initPop: function() {
          if ( !this._boxDetailPop ) {
            this._boxDetailPop = boxDetailPop({
              'observer': this._observer,
              'elementId': '#J_centerPop',
            });
          }
        },
        /*
         *
         */
        getBayDetail: function () {
            var that = this;
            var key = '11@08'; //value 以@作为分隔符,表示堆场代码11的第8列
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
         * 集装箱详情
         */
        getContainerDetail: function (boxId) {
            var that = this;
            //          console.log('boxID:' + boxId);
            var oneBox = {};
            if (!!that.boxDatas) { // 从贝位详情跳转
                $.each(that.boxDatas, function (k, v) {
                    if (boxId == v.OBJ_CTN_NO) { // 找到当前箱子
                        // that.renderContainerDetail(v);
                        that._boxDetailPop.renderContainerDetail( v );
                    }
                })
            } else { // 搜索箱子
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
                            that.data.isBoat ? that.renderBoatBay : that.render();
                            // that.renderBoxDetail(box);                                        
                            that._boxDetailPop.renderContainerDetail( v );
                        }
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
            // this.wraper.off();
            // this.wraper.on('click', '.bay-box', function( ev ) {
            //     var it = $(ev.target);
            //     if (!it.hasClass("bay-box")) { //div
            //         it = it.parent();
            //         if (!it.hasClass("bay-box")) { //span
            //             it = it.parent();
            //         }
            //     }
            //     //                var boxData = it.attr('data-info');
            //     //                boxData = JSON.parse(boxData);//                
            //     //                that.renderContainerDetail(boxData);
            //     var boxId = it.attr('data-id');
            //     that.getContainerDetail(boxId);
            // })
            // .on('click', '.j-bay-detail .j-close', function( ev ) {
            //   that.wraper.html('').hide();
            //   that.wraper.off();
            //   $('.home>.masker').addClass('hide');
            // });


            // this.wraper.on('click', '.j-close', function( ev ) {
            //     that.wraper.html('').hide();
            //     that.wraper.off();
            //     $('.home>.masker').addClass('hide');
            //     delete this;
            // })
            // .on('click', '.j-close-container', function( ev ) {
            //   console.log('关闭自己');
            //   that.wraper.find('.popup').removeClass('inline');
            //   that.wraper.find('.popup-right').hide();
            // });

            this.wraper.on('click', '.j-hidden', function( ev ) {
                that.wraper.find('.popup-right').hide().find('.pop-body').html('');
                that.wraper.find('.inline').removeClass('inline');
            });

            this.wraper.on('change', '#J_change_pro', function( ev ) {
                var it = $(ev.target);
                var option = it.val();
                if (that.bayDetailType == 'ship') {
                    that.formateBoatData(that.boatBayData, option);
                } else {
                    that.formateData(that.boxDatas, option);
                }
            });

            // 甲板船舱数据切换
            this.wraper.on('click', '.j-dSwitch', function( ev ) {
                that.boxDatas = that.data.boatBoxData.dCtnGps;
                that.data.bayBoxs = that.data.boatBoxData.dData;
                that.renderBoatBay('D'); //重新render一次
                $('.j-dSwitch').addClass('active');
                $('.j-hSwitch').removeClass('active');
            });
            this.wraper.on('click', '.j-hSwitch', function( ev ) {
                that.boxDatas = that.data.boatBoxData.hCtnGps;
                that.data.bayBoxs = that.data.boatBoxData.hData;
                that.renderBoatBay('H'); //重新render一次
                $('.j-hSwitch').addClass('active');
                $('.j-dSwitch').removeClass('active');
            })

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
        generateContainerDetailInfo: function (ajaxdata) {
            var info = '';
            var that = this;
            if (!data) {
                data = _.defaults(testContainerDetailData);
            }
            // ajaxdata 返回为一个数组，取第一个
            var data = _.isArray(ajaxdata) ? ajaxdata[0] : ajaxdata;
            info = jsrender.templates(containerDetailTemplate).render(data);
            var positionInfo = data.GPS_ACTUAL_SLOT_POSITION;
            var block = data.GPS_ACTUAL_POSITION_BLOCK ? data.GPS_ACTUAL_POSITION_BLOCK + '堆场' : '';
            var text = '集装箱详情(' + data.GPS_ACTUAL_POSITION_BLOCK + '堆场' +
                positionInfo.slice(0, 2) + '' +
                positionInfo.charAt(positionInfo.length - 1) + '层' +
                positionInfo.slice(3, 4) + '列)';

            if (positionInfo) {
                $('#J_centerPop .popup-right .pop-title').html('集装箱详情(' + block + positionInfo + ')');
            }
            return info;
        },

        /**
         * desc: 搜索箱子详情面板
         */
        // renderSearchContainerDetail: function (data) {
        //     if (_.isArray(data) && !data.length) return;
        //     var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(this.data);
        //     this.wraper.html(wraperRight).show().find('.popup-right').show();
        //     var containerDetailinfo = this.generateContainerDetailInfo(data);
        //     this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
        //     this.wraper.find('.popup').removeClass('inline').show();
        //     // $('.masker').removeClass('hide');
        // },

        /*
         *  desc: 渲染箱子详情面板
         */
        renderContainerDetail: function (data) {
            if (!data || (_.isArray(data) && !data.length)) {
                data = _.defaults(testContainerDetailData);
                console.log(data, '为空')
            }
            //var wraperRight = jsrender.templates( centerContainerDetailWraperTemplate ).render( data );        
            //this.wraper.html( wraperRight ).show().find('.popup-right').show();             
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo).show();
            this.wraper.find('.popup').addClass('inline').show();
            // $('.masker').removeClass('hide');

        },

        /*
         *  desc: 仅渲染箱子详情面板
         */
        renderOnlyContainerDetail: function (data) {
            if (!data || (_.isArray(data) && !data.length)) {
                data = _.defaults(testContainerDetailData);
                console.log(data, '为空')
            }
            var wraperRight = jsrender.templates(centerContainerDetailWraperTemplate).render(data);
            this.wraper.html(wraperRight).show().find('.popup-right').show();
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.pop-body').html(containerDetailinfo);
            this.wraper.find('.popup-right').show();
            if (_.isArray(data)) {
                this.wraper.find('.popup-right').removeClass('inline');
            }
            // $('.masker').removeClass('hide');

        },



        /*
         *
         */
        renderBoxDetail: function (data) {
            if (!data) return;
            var containerDetailinfo = this.generateContainerDetailInfo(data);
            this.wraper.find('.popup-right .pop-body').html(containerDetailinfo);
            this.wraper.find('.popup').addClass('inline alone').show();
            this.wraper.find('.popup-left').hide();
            // $('.masker').removeClass('hide');
        },
        /*
         *  绘制联合动画
         */
        renderBoxAnimation: function (data) {
            //console.log(data);   
            var wraperLeft = jsrender.templates(centerboxAnimateTemplate).render(data);
            if (!this.wraper.find('.popup-left').length) {
                this.wraper.append(wraperLeft);
            } else {
                this.wraper.find('.popup-left').html(wraperLeft).show();
            }
            this.wraper.find('.popup').addClass('inline').show();
            // $('.masker').removeClass('hide');
            // this.move($('.jobAnimate'));
            return this;
        },

        /*
         *  绘制动画
         */
        renderOnlyBoxAnimation: function (data) {
            console.log(data);
            if (!this.data) {
                this.data = _.defaults(testBayDetailData);
            }
            // var wraperLeft = jsrender.templates( centerbayDetailWraperTemplate ).render( this.data ); 

            var wraperLeft = jsrender.templates(centerboxAnimateTemplate).render(data);
            // var wraperLeft = jsrender.templates( centerboxAnimateTemplate ).render( {CTN_NO: '213243', CURRENT_STATUS: 'INSHIP'} ); 

            // var wraperRight = jsrender.templates( centerContainerDetailWraperTemplate ).render( this.data );  
            // var wraper = wraperLeft + wraperRight;
            var wraper = wraperLeft;
            this.wraper.html(wraper).show();
            // var containerDetailinfo = this.generateContainerDetailInfo( data );   
            // this.wraper.find('.popup-right .pop-body').html( containerDetailinfo );
            this.wraper.find('.popup').removeClass('inline').show();
            // $('.masker').removeClass('hide');
            return this;
        },

        renderCenterPop: function () {
            var temp = jsrender.templates(centerPopTemp).render();
            $('#J_centerPop').html(temp).show();
            return this;
        },


    });

    return CENTERPOPUP;
});
