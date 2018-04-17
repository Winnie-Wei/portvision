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
define(function(require){
	var _ = require('underscore');
	var echarts = require('lib/echarts/echarts.common.min');
	var Base = require('./Base');
	
	function XbarChart(){}
	XbarChart.prototype = new Base();
	/**
	 * funcName: init
	 * param: {
		  dom: HTML dOM Document 对象；
	      data:[],
	      option: 参考echarts.option
	   }
	 * desc: 初始化饼图
	 */

	XbarChart.prototype.init = function(opt){
		if(!opt.dom || typeof opt.dom !== "object" || opt.dom.nodeType !==1) throw new Error("请传入正确的dom元素");
		var self = this;
		var formatNum = opt.data && opt.data.percent && self.formatData(opt.data.percent);
		if( !opt.data ){
			opt.data = {};
		}
	    this._dom_ = opt.dom;
		var chart = echarts.init(this._dom_);
		var option = {
	        title: opt.title || {},
	        grid:{
	        	left:'3%',
	        	right:'5%',
	        	bottom:'2%',
	        	top:'0%',
	        	containLabel:true
	        },
	        xAxis:{
	        	show:false,
	        	type:'value',
	        },
	        yAxis:[{
	        	// data:[65,48,20,45,61,64,84,31,64,87],
	        	data: opt.data.subject || [],
	        	axisLabel: {
		            inside: false,
		            textStyle: {
		                color: '#222'
		            }
		        },
	        	type:'category',
	        	position:'left',
	        	axisTick:{
	        		show:false
	        	},
	        	axisLine:{
	        		show:false
	        	},
	        	axisLabel: {
	        		interval: 0
	        	}
	        },
	        {
	        	// data:[65,48,20,45,61,64,84,31,64,87],
	        	data: formatNum && formatNum.percentData || [],
	        	axisLabel: {
		            inside: false,
		            formatter:'{value}%',
		            textStyle: {
		                color: '#2DB4E6'
		            }
		        },
	        	type:'category',
	        	position:'right',
	        	axisTick:{
	        		show:false
	        	},
	        	axisLine:{
	        		show:false
	        	},
	        	axisLabel: {
	        		interval: 0
	        	}
	        }
	        ],
	        series : [
	        	// { // For shadow
	        	// 	stack:'123',
		        //     type:'bar',
		        //     itemStyle:{
		        //         normal:{color: 'rgba(0,0,0,0.05)'},
		                
		        //     },
		        //     barCategoryGap:'40%',
		        //     barGap:'-100%',
		        //     data:[100,100,100,100,100,100,100,100,100,100],
		        //     animation: false,
		        // },
	            {
	            	stack:'234',
	                type:'bar',
	                itemStyle: {
		                normal: {color:'#2DB4E6'},
		            },
		            animation: false,
	        		barCategoryGap:'40%',
	                data: formatNum && formatNum.barLength || [],
	            }
	        ]
	    };
		!!opt.option && (option = _.extend(option, opt.option));
	    this._option_ = option;
		this.chart = chart;
	    
	    // if(opt.data){
	    //     this.render(opt.data);
	    // }
	    this.chart.setOption(this._option_);
	    this.resize();
	}
	/**
	 * 图形渲染
	 * [{name: '', value: ''}]
	 */
	XbarChart.prototype.render = function(data){
	    // this._option_.series[0] = _.extend(this._option_.series[0], data);
	    // this.chart.setOption(this._option_);
	    this._option_.series[1].data = data;
	    this.chart.setOption(this._option_);
	}
	/**
	 *
	 *  设置数据
	 *  data: [{value: 10, name: '转诊'},{}]
	 */

	XbarChart.prototype.setData = function(data){
		var option = this.chart.getOption();
		option.series[0]['data'] = data;
		this.chart.setOption(option);
	}
	/**
	 * 获取echart图表实例
	 * 
	*/
	XbarChart.prototype.getChart = function(){
		return this.chart;
	}
	/*
	 * 处理数据小数点
	 */
	XbarChart.prototype.formatData = function(arr){		
		var newObj = {
			'barLength': [],
			'percentData': [],
		}
		if( !arr ){
			arr = [];
		}
		$.each(arr, function(idx, item){
			newObj.percentData.push((item*100).toFixed(2));
			item = item < 1 ? item : 1;
			newObj.barLength.push((item*100).toFixed(2));
		})
		return newObj;
	}
	return XbarChart;
});





