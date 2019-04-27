//echarts图表插件index页面使用
$(function(){
	//左侧柱状图
	// 基于准备好的dom，初始化echarts实例
        var echarts_1 = echarts.init(document.querySelector('.echarts_1'));

        // 指定图表的配置项和数据
        var option1 = {
			//大标题
            title: {
                text: 'ECharts 入门示例'
            },
			//提示框
            tooltip: {},
			//图例
            legend: {
                data:['人数']
            },
            xAxis: {
                data: ["1月","2月","3月","4月","5月","6月"]
            },
            yAxis: {},
			//数据
            series: [{
                name: '人数',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        echarts_1.setOption(option1);
	//右侧饼状图
		// 基于准备好的dom，初始化echarts实例
		    var echarts_2 = echarts.init(document.querySelector('.echarts_2'));
		
		    // 指定图表的配置项和数据
		    var option2 = {
				title : {
					text: '热门品牌销售',
					subtext: '2017年6月',
					//标题方向
					x:'center'
				},
				tooltip : {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: 'vertical',
					left: 'left',
					data: ['阿迪','耐克','李宁','骆驼','新百伦']
				},
				series : [
					{
						name: '访问来源',
						type: 'pie',
						radius : '55%',
						center: ['50%', '60%'],
						data:[
							{value:335, name:'阿迪'},
							{value:310, name:'耐克'},
							{value:234, name:'李宁'},
							{value:135, name:'骆驼'},
							{value:1548, name:'新百伦'}
						],
						//阴影
						itemStyle: {
							emphasis: {
								shadowBlur: 20,
								shadowOffsetX: 10,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
				]
			};
		
		    // 使用刚指定的配置项和数据显示图表。
		    echarts_2.setOption(option2);
})