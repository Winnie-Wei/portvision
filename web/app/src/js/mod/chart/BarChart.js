// 竖立柱状图
// var barChart = {
// 	init: function(url, dom, cube, dimension, measure, title){

// 	}
// }
/**
 *  className: BarChart
 * 	desc: 竖立的柱状图
 *  auth: tangb
 */
define(function (require) {
    var _ = require('underscore');
    var echarts = require('lib/echarts/echarts.common.min');
    var Base = require('./Base');


    function BarChart() { }
    BarChart.prototype = new Base();
    /**
     * funcName: init
     * param: {
          dom: HTML dOM Document 对象；
          title: {text:'', textStyle: {color:'', fontSize:'',..}, top: '', left: ''}
             data: [
                 {name:'',value:numb},
             ],
             isXTextRotate: true,
             option: 
       }
     * desc: 初始化柱状图
     */

    BarChart.prototype.init = function (opt) {
        if (!opt.dom || typeof opt.dom !== 'object' || opt.dom.nodeType !== 1) throw new Error('请传入正确的dom元素');
        this._dom_ = opt.dom;
        var chart = echarts.init(this._dom_);
        var that = this;
        var option = {
            title: opt.title,
            grid: opt.grid,
            dataZoom: [{
                show: false,
                type: 'slider',
                start: 0,
                end: 100,
                height: 16,
                bottom: 0
            }],
            xAxis: {

                data: (function () {
                    var i = 13;
                    var res = [];
                    while (--i) {
                        res.unshift(i + '月');
                    }
                    return res;
                }()),
                axisLabel: {
                    //inside: true,
                    interval: false, // 默认x轴标签不隐藏显示
                    show: true,
                    textStyle: {
                        color: 'gray'
                    },
                    // rotate: opt.isXTextRotate ? 45 : 0,
                    rotate: -30
                },
                splitLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#AFAFAF',
                        width: 1,
                        type: 'solid'
                    }
                }
                // z: 10
            },
            yAxis: {
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#AFAFAF',
                        width: 1,
                        type: 'solid'
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#999'
                    }
                },
                nameLocation: 'end',
                nameTextStyle: {
                    color: '000',
                    fontSize: '13',
                    fontWeight: 500
                }
            },
            series: [{
                name: 'example',
                type: 'bar',
                barWidth: '40%',
                animation: false,
                label: {
                    normal: {
                        show: false,
                        position: 'top',
                        formatter: function (obj) { return that.thousandBitSeparator(obj.data); }, //that.thousandBitSeparator,
                        textStyle: {
                            color: '#43C2F2',
                            fontSize: '14'
                        }
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [
                                { offset: 0, color: '#43C2F2' },
                                { offset: 0.5, color: '#56CFF6' },
                                { offset: 1, color: '#81DFFB' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [
                                { offset: 0, color: '#43C2F2' },
                                { offset: 0.7, color: '#56CFF6' },
                                { offset: 1, color: '#83bff6' }
                            ]
                        )
                    }
                },
                data: (function () {
                    var i = 13;
                    var res = [];
                    while (--i) {
                        res.push(~~(Math.random() * 120));
                    }
                    return res;
                }())
            }]
        };
        !!opt.option && (option = _.extend(option, opt.option));
        //chart.setOption(option);
        this._option_ = option;
        this.chart = chart;
        if (opt.data) {
            this.render(opt.data);
        }

        this.resize();
    }

    /**
     *
     *  渲染
         data:[
             {name:'1A',value:'0.2'},
         ]
            
     *
     */
    BarChart.prototype.render = function (data) {
        var name_arr = [];
        var value_arr = [];
        this.dataZoom(data.xAxis.length);
        for (var i = 0; i < data.xAxis.length; i++) {
            name_arr.push(data.xAxis[i]);
        }
        for (var i = 0; i < data.data.length; i++) {
            value_arr.push(data.data[i]);
        }
        this._option_.xAxis.data = name_arr;
        this._option_.series[0]['data'] = value_arr;
        this.chart.setOption(this._option_);
    }
    BarChart.prototype.dataZoom = function (length) {
        if (length > 10) {
            var end = (9 / length) * 100;
            this._option_.dataZoom = [{
                show: true,
                type: 'slider',
                start: 0,
                end: end,
                height: 16,
                bottom: 0
            }];
            this._option_.grid = { left: 40, right: 40, top: 20, bottom: 50 };
        }
    }
    /**
     *
     *  设置数据
     *  data: [12,21,...]
     */

    BarChart.prototype.setData = function (data) {
        var option = this.chart.getOption();
        option.series[0]['data'] = data;
        this.chart.setOption(option);
    }
    /**
     *
     * 设置 x轴数据
     * {
         name: 'x轴名称',
         data: ['1月', '2月', ...]
         }
     */

    BarChart.prototype.setXAxis = function (opt) {
        var option = this.chart.getOption();
        option.xAxis[0] = _.extend(option.xAxis[0], opt);
        this.chart.setOption(option);
    }
    /**
     * 设置y轴的信息 
     {
        name: '确诊病种排序',
        data: [],
     }
     *
     */

    BarChart.prototype.setYAxis = function (opt) {
        var option = this.chart.getOption();
        option.yAxis[0] = _.extend(option.yAxis[0], opt);
        this.chart.setOption(option);
    }

    return BarChart;
});