// 仪表盘图
// var barChart = {
// 	init: function(url, dom, cube, dimension, measure, title){

// 	}
// }
/**
 *  className: GaugeChart
 * 	desc: 仪表盘图
 *  auth: tangb
 */
define(function(require){
	
	var _ = require('underscore');
	var echarts = require('lib/echarts/echarts.common.min');
	var Base = require('./Base');
	function GaugeChart(){}
	GaugeChart.prototype = new Base();
	/**
	 * funcName: init
	 * param: {
		  dom: HTML dOM Document 对象；
		  title: 参考 echarts.option.title,
	      data:value,
	      option: 参考echarts.option
	   }
	 * desc: 初始化饼图
	 */

	GaugeChart.prototype.init = function(opt){
		if(!opt.dom || typeof opt.dom !== "object" || opt.dom.nodeType !==1) throw new Error("请传入正确的dom元素");
	    this._dom_ = opt.dom;
		var chart = echarts.init(this._dom_);
		var option = {
	        title: opt.title || {},
	        series : [
	            {
	                name: '吞吐量指标',
	                type:'gauge',
	                detail:{
	                	formatter:'{value}%',
	                	textStyle:{
	                		fontSize:14
	                	}
	            	},
	                data:[
	                    {value:10, name:''},
	                ],
	                axisLine: {            // 坐标轴线
	                    show: true,        // 默认显示，属性show控制显示与否
	                    lineStyle: {       // 属性lineStyle控制线条样式
	                        color: [[0.2, '#3EB391'],[0.8, '#42C3F3'],[1, '#F76A5C']], 
	                    }
	                }
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
	GaugeChart.prototype.render = function(data){
	    // this._option_.series[0] = _.extend(this._option_.series[0], data);
	    // this.chart.setOption(this._option_);
	    this._option_.series[0].data[0].value = data;
	    this.chart.setOption(this._option_);
	}
	/**
	 *
	 *  设置数据
	 *  data: [{value: 10, name: '转诊'},{}]
	 */

	GaugeChart.prototype.setData = function(data){
		var option = this.chart.getOption();
		option.series[0]['data'] = data;
		this.chart.setOption(option);
	}
	/**
	 * 获取echart图表实例
	 * 
	*/
	GaugeChart.prototype.getChart = function(){
		return this.chart;
	}
	return GaugeChart;
});





