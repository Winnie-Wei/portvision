
/**
 *  className: LineColumnChart
 *  desc: 折线柱状图
 *  auth: tangb
 */
define(function(require){
    var _ = require('underscore');
    var echarts = require('lib/echarts/echarts.common.min');
    var Base = require('./Base');
    
    
    function LineColumnChart(){}
    LineColumnChart.prototype = new Base();

    LineColumnChart.prototype.init = function(opt){
        if(!opt.dom || typeof opt.dom !== "object" || opt.dom.nodeType !==1) throw new Error("请传入正确的dom元素");
        this._dom_ = opt.dom;
        var chart = echarts.init(this._dom_);
        var that = this;
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                top: '10',
                left: '12%'
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: opt.data.xData,
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} '
                },
                axisPointer: {
                    snap: true
                }
            },
            visualMap: {
                show: false,
                dimension: 0,
            },
            series: [
                {
                    name:'作业量',
                    type:'line',
                    smooth: true,
                    areaStyle: {normal: {}},
                    data: opt.data.yData,
                   
                }
            ]
        };

        !!opt.option && (option = _.extend(option, opt.option));
        //chart.setOption(option);
        this._option_ = option; 
        this.chart = chart;
        this.getPieces(opt.data.fault);
        this.chart.setOption(this._option_);

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
    LineColumnChart.prototype.render = function(data){
        var name_arr = [];
        var value_arr = [];
        this.dataZoom(data.xAxis.length);
        for(var i=0;i<data.xAxis.length;i++){
            name_arr.push(data.xAxis[i]);
        }
        for(var i=0;i<data.data.length;i++){
            value_arr.push(data.data[i]);
        }
        this._option_.xAxis.data = name_arr;
        this._option_.series[0]['data'] = value_arr;
        this.chart.setOption(this._option_);
    }
    LineColumnChart.prototype.dataZoom = function(length){
        if(length>10){
            var end = (9 / length) * 100;
            this._option_.dataZoom = [
                {
                    show: true,
                    type: 'slider',
                    start: 0,
                    end: end,
                    height: 16,
                    bottom: 0,
                }
            ];
            this._option_.grid = {left: 30, right: 30, top: 20, bottom: 50};
        }
    }
    LineColumnChart.prototype.getPieces = function(arr){
        var temp = [];
        var self = this;
        if(!arr.length){
            self._option_.visualMap.pieces = [
                {
                    gte: 0,
                    lte: 0,
                    color: 'green',
                },
                {
                    gt: 0,
                    color: 'green',
                }
            ];
            return;
        }
        arr.sort(function(a, b){
            return a.sdx - b.sdx;
        })
        temp.push({
            lt: arr[0].sdx,
            color: 'green',
        })
        $.each(arr, function(idx, item){
            temp.push({
                gte: item.sdx,
                lte: item.edx,
                color: item.flag == 'oth' ? 'orange' : 'red',
            })
            if(idx + 1 < arr.length){
                temp.push({
                    gt: item.edx,
                    lt: arr[idx+1].sdx,
                    color: 'green',
                })
            }
            
        })
        temp.push({
            gt: arr[arr.length-1].edx,
            color: 'green',
        })
        self._option_.visualMap.pieces = temp;
        // this._option_.visualMap.pieces = [
        //     {
        //         lt: 20,
        //         color: 'green'
        //     }, {
        //         gte: 20,
        //         lte: 24,
        //         color: 'red'
        //     }, {
        //         gt: 24,
        //         lt: 57,
        //         color: 'green'
        //     }, {
        //         gte: 57,
        //         lte: 62,
        //         color: 'orange'
        //     }, {
        //         gt: 62,
        //         lte: 80, 
        //         color: 'green'
        //     }, {
        //         gte: 80,
        //         lte: 100,
        //         color: 'red'
        //     }, {
        //         gt: 100,
        //         color: 'green'
        //     }
        // ]
    }
    /**
     *
     *  设置数据
     *  data: [12,21,...]
     */

    LineColumnChart.prototype.setData = function(data){
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

    LineColumnChart.prototype.setXAxis = function(opt){
        var option = this.chart.getOption();
        option.xAxis[0] = _.extend(option.xAxis[0], opt);
        chart.setOption(option);
    }
    /**
     * 设置y轴的信息 
     {
        name: '确诊病种排序',
        data: [],
     }
     *
     */

    LineColumnChart.prototype.setYAxis = function(opt){
        var option = this.chart.getOption();
        option.yAxis[0] = _.extend(option.yAxis[0], opt);
        chart.setOption(option);
    }

    return LineColumnChart;
});





