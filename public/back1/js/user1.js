//模板引擎渲染页面
$(function(){
	var currentPage=1;//当前页
	var pageSize=5;//每页多少条数据
	//开始进入页面进行渲染
	render();
	//页面渲染函数
	function render(){
		//发送ajax请求后台数据，利用模板引擎渲染页面
		$.ajax({
			type:'get',
			url:"/user/queryUser",
			data:{
				page:currentPage,
				pageSize:pageSize
			},
			success:function(info){
				console.log(info);
				//成功获取到数据，进行渲染
				var htmlStr=template('tpl',info);
				$('tbody').html(htmlStr);
				//渲染分页插件，需要放到ajax请求成功时进行渲染分页插件
				$("#paginator").bootstrapPaginator({
				  bootstrapMajorVersion:3,//指定bootstrap的版本，如果是3，必须指定
				  currentPage:currentPage,//指定当前页
				  totalPages:Math.ceil(info.total/pageSize),//指定总页数
				  onPageClicked:function (a,b,c, page) {
					//page指的是点击的页码,修改了当前页
					currentPage = page;
					//重新渲染
					render();
				  }
				});
			}
		})
	}
	//2.点击按钮显示禁用的模态框
	$('.lt-content tbody').on('click','.btn',function(){
		$('.userModal').modal('show');
		//获取点击的按钮的id，存储在点击按钮的父元素中
		currentId=$(this).parent().data('id');
		//根据当前按钮的class类判断出于什么状态，给后台传递什么值,btn-danger，此时为1的状态正常，需要传递0，变为禁用庄涛
		isDelete=$(this).hasClass('btn-danger')?'0':'1';
	})
	//3.点击确认按钮，发送ajax请求，改变当前的状态
	$('.userBtn').click(function(){
		console.log(currentId);
		console.log(isDelete);
		$.ajax({
			url:"/user/updateUser",
			data:{
				id:currentId,
				isDelete:isDelete
			},
			type:"post",
			success:function(info){
				//此时已经修改成功，隐藏模态框
				$('.userModal').modal('hide');
				//重新渲染页面
				render();
			}
		})
		})
})