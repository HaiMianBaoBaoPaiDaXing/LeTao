$(function(){
	//定义全局变量
	var currentPage=1;//当前页
	var pageSize=5;//每页多少条数据
	var currentId;//当前选中的按钮的id
	//ajax请求用户列表数据，通过模板引擎渲染页面
	//进入页面调用分页渲染函数
	render();
	//1.分页渲染函数
	function render(){
		$.ajax({
			type:"get",
			url:"/user/queryUser",
			data:{
				page:currentPage,
				pageSize:pageSize
			},
			dataType:"json",
			success:function(info){
				console.log(info);
				var htmlStr=template('tpl',info);
				$('.lt_content tbody').html(htmlStr);
				//分页初始化
				$('#paginator').bootstrapPaginator({
					// 配置模板引擎版本
					bootstrapMajorVersion:3,
					//当前页
					currentPage:info.page,
					//总页数
					totalPages:Math.ceil(info.total/info.size) ,
					//设置控件的大小，mini, small, normal,large
					size:"small",
					//为按钮绑定点击事件 page:当前点击的按钮值
					onPageClicked:function(a,b,c,page){
						console.log(page);
						//怕个获取点击的页码
						// 更新当前页
						currentPage=page;
						//重新渲染
						render();
					}
				})
			}
		})
	}
	//2.点击启用禁用按钮显示模态框，利用事件委托绑定事件
		$('tbody').on("click",".btn",function(){
			$('#userModal').modal("show");
			//获取当前用户的id
			currentId=$(this).parent().data("id");
			//根据当前按钮的类名决定给后台传的值
			isDelete=$(this).hasClass("btn-danger")?0:1;
			
		})
	//3.点击确认按钮，发送ajax修改对应用用户的状态
	$('#submitBtn').click(function(){
		console.log(currentId);
		console.log(isDelete);
		$.ajax({
			type:"post",
			url:"/user/updateUser",
			data:{
				id:currentId,
				isDelete:isDelete
			},
			dataType:"json",
			success:function(info){
				if(info.success){
					//关闭模态框
					$('#userModal').modal('hide');
					//重新渲染页面
					render();
				}
			}
		})
	})
})