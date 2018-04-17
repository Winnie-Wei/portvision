require(['./GaugeChart', './BarChart', './XbarChart', './PieChart', './mc_table'], function (GaugeChart, BarChart, XbarChart, PieChart, mTable) {
	var gaugeChart = new GaugeChart();
	gaugeChart.init({
		dom: document.getElementById('barEchart'),
		title: {
			text:'本月吞吐量',
			show:true,	
			textStyle: {
				color:'#465055',
				fontWeight:'normal',
				fontSize:17,
			},
		},
   	  	data:30
	});
	var barChart = new BarChart();
	barChart.init({
		dom: document.getElementById('gaugeEchart'),
		title: {
			text:'机械效率',
			show:true,
			textStyle: {
				color:'#465055',
				fontWeight:'normal',
				fontSize:14
			}

		},
   	  	data: {
   	  		name:'123',
   	  		xAxis: ['1#', '2#', '3#', '4#', '5#', '6#', '7#', '8#', '9#', '10#'],
   	  		data:[1, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.2, 0.15]
   	  	},
   	  	isXTextRotate: false,
	});
	var pieChart = new PieChart();
	pieChart.init({
		dom: document.getElementById('pieEchart'),
		title: {
			text:'本月吞吐量组成',
			show:true,	
			textStyle: {
				color:'#465055',
				fontWeight:'normal',
				fontSize:17,
			},
		},
   	  	data:[
   	  		{name:'国内中转',value:32},
   	  		{name:'侧箱',value:5},
   	  		{name:'进口',value:20},
   	  		{name:'出口',value:25},
   	  		{name:'国际中转',value:18},
   	  	],
	});
	var xbarChart = new XbarChart();
	xbarChart.init({
		dom: document.getElementById('xbarEchart'),
		data:[65,48,20,45,61,64,84,31,64,87]
	});
	//console.log(base);
	
	
	var myTableOne = new mTable();
    var myOption = {
        'data': {
            'title': ['作业类型', '标准箱作业量', '自然箱作业量', '外拖车次', '外拖平均在场时间'],
            isFirstColHead: true, // 第一列是否作为头部(有颜色填充)
            'content': [ 
                ['进箱', '42', '21444', '19', '45333'], 
                ['提箱', '42', '21', '19', '45'],
            ]
        }
    }
    myTableOne.init({
        'dom': '#J_tableOne',
        'option': myOption
    })


    var myTableTwo = new mTable();
    myTableTwo.init({
        'dom': '#J_tableTwo',
    })
    myTableTwo.setData(myOption.data);
    myTableTwo.render();
})