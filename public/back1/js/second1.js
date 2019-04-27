$(function(){
	var currentPage=1;
	var pageSize=5;
	render();
	function render(){
		$.ajax({
			url:"/category/querySecondCategoryPaging",
			type:"get",
			data:{
				page:currentPage,
				pageSize:pageSize
			},
			dataType:"json",
			success:function(info){
				console.log(info);
				//页面渲染
				var htmlStr=template('tpl',info);
				$('.lt-content tbody').html(htmlStr);
				//分页插件
				$('#paginator').bootstrapPaginator({
					//插件参数
					bootstrapMajorVersion:3,//指定bootstrap的版本，如果是3，必须指定
					currentPage:currentPage,
					totalPages:Math.ceil(info.total/info.size),
					//点击页码事件，点击时修改当前页为点击页
					onPageClicked:function (a,b,c, page) {
					//page指的是点击的页码,修改了当前页
					currentPage = page;
					//重新渲染
					render();
				  }
				})
			}
		})
	}
	//2.点击添加按钮，弹出模态框
	$('.addButton').click(function(){
		$('.secondModal').modal('show');
		//获取下拉菜单的一级分类数据，模板引擎渲染
		$.ajax({
			url:"/category/queryTopCategoryPaging",
			type:"get",
			data:{
				page:1,
				pageSize:100
			},
			dataType:"json",
			success:function(info){
				console.log(info);
				var htmlStr=template("dropdownTpl",info);
				$('.dropdown-menu').html(htmlStr);
			}
		})
	})
	//3.上传图片的接口
	//初始化文件上传
	$("#uploadFile").fileupload({
		dataType:"json",
			//文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
			//第二个参数就有上传的结果 data.result
			done:function (e, data) {
				//console.log("图片上传完成拉");
				//console.log(data);
				console.log(data.result.picAddr);
				$(".modal-body img").attr("src", data.result.picAddr);
			}
	});
	//3.给下拉列表的a添加点击事件，事件委托
	$('.dropdown-menu').on('click',"a",function(){
		var txt=$(this).text();
		$('#dropdownText').text(txt);
	})
})
