// 饼图
// var barChart = {
// 	init: function(url, dom, cube, dimension, measure, title){

// 	}
// }
/**
 *  className: PieChart
 * 	desc: 饼图
 *  auth: tangb
 */
define(function(require){
    var _ = require('underscore');
    var echarts = require('lib/echarts/echarts.common.min');
    var Base = require('./Base');
    function PieChart(){}
    PieChart.prototype = new Base();
    /**
     * funcName: init
     * param: {
          dom: HTML dOM Document 对象；
          title: 参考 echarts.option.title,
          data: [{
            name: '', value: '',
            name: '', value: ''
          }],
          option: 参考echarts.option
       }
     * desc: 初始化饼图
     */

    PieChart.prototype.init = function(opt){
        if(!opt.dom || typeof opt.dom !== 'object' || opt.dom.nodeType !==1) throw new Error('请传入正确的dom元素');
        this._dom_ = opt.dom;
        var chart = echarts.init(this._dom_);
        var option = {
            color: ['#EC9B00', '#F66B5C', '#43C2F2', '#3FB391','#BE64CC'],
            title: opt.title || {},
            calculable : true,
            itemStyle:{
                normal:{
                    borderColor: '#fff',
                    borderWidth: 2,
                    shadowColor: '#CDCCCA',
                    shadowBlur: 4,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            },
            legend: {
                orient:'horizontal',
                bottom:'0%',
                itemHeight:15,
                align:'auto',
                data: ['进口','出口','国际中转','国内中转','倒箱'],
                icon:'circle'
            },
            series : [
                {
                    name: 'example',
                    type:'pie',
                    radius : [0,'55%'],
                    center : opt.option.center || ['50%', '45%'],
                    label: {
                        normal: {
                            show: true,
                            formatter: '{d}%',
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 500
                            }
                        },
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 10,
                            length2: 10
                        }
                    },
                    data:[
                        {value:10, name:'转诊'},
                        {value:5, name:'预约'},
                        {value:15, name:'挂号'}
                    ]
                }
            ]
        };
        !!opt.option && (option = _.extend(option, opt.option));
        this._option_ = option;
        this.chart = chart;
        
        if(opt.data){
            this.render(opt.data);
        }

        this.resize();
    }
    /**
     * 图形渲染
     * [{name: '', value: ''}]
     */
    PieChart.prototype.render = function(data){
        // this._option_.series[0] = _.extend(this._option_.series[0], data);
        // this.chart.setOption(this._option_);
        this._option_.series[0].data = data;
        this.chart.setOption(this._option_);
    }
    /**
     *
     *  设置数据
     *  data: [{value: 10, name: '转诊'},{}]
     */

    PieChart.prototype.setData = function(data){
        var option = this.chart.getOption();
        option.series[0]['data'] = data;
        this.chart.setOption(option);
    }
    /**
     * 获取echart图表实例
     * 
    */
    PieChart.prototype.getChart = function(){
        return this.chart;
    }
    return PieChart;
});
