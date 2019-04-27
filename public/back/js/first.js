//查询一级分类数据
$(function(){
	var currentPage=1;
	var pageSize=5;
//发送ajax请求，请求数据，动态渲染页面数据，分页插件功能实现
	render();
	function render(){
		$.ajax({
			type:"get",
			url:"/category/queryTopCategoryPaging",
			data:{
				page:currentPage,//当前页
				pageSize:pageSize//总页数
			},
			dataType:"json",
			success:function(info){
				console.log(info);
				//实例化页面渲染插件
				var htmlStr=template('firstTpl',info);
				$('tbody').html(htmlStr);
				//分页插件初始化
				$('#paginator').bootstrapPaginator({
					//版本
					bootstrapMajorVersion:3,
					currentPage:info.page,//当前页
	  				totalPages:Math.ceil(info.total/info.size) ,//总页数
	  				//为分页按钮绑定点击事件，点击分页跳转到响应的页面,page表示当前页
	  				onPageClicked:function(a,b,c,page){
	  					//重新配置当前页
	  					currentPage=page;
	  					render();
	  				}
				})
			}
		})
	}
//2.点击添加按钮，弹出模态框，添加数据
	$('#addBtn').on('click',function(){
		$('#addModal').modal('show');
	});
//3.表单校验功能	
	$('#form').bootstrapValidator({
		//配置校验图标
		feedbackIcons:{
			valid:'glyphicon glyphicon-ok',
			invalid:'glyphicon glyphicon-remove',
			validating:'glyphicon glyphicon-refresh'
		},
		//字段列表
		fields:{
			categoryName:{
				//校验非空
				validators:{
					notEmpty:{
						message:"请输入一级分类名"
					}
				}
			}
		}
	})
//4.表单校验成功事件，阻止默认提交，通过ajax提交数据
	$('#form').on("success.form.bv",function(e){
		//阻止默认的提交
		e.preventDefault();
		$.ajax({
			url:"/category/addTopCategory",
			type:"post",
			data:$('#form').serialize(),
			dataType:"json",
			success:function(info){
				console.log(info);
				//成功提交数据
				if (info.success) {
					// 当前页等于1
					currentPage=1;
					//关闭模态框
					$('#addModal').modal('hide');
					//重新渲染页面
					render();
					//清除表格状态
					$('#form').data("bootstrapValidator").resetForm(true);
				}
			}
		})
	})
})