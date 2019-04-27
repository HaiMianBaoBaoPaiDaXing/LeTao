$(function(){
	var currentPage=1;//当前页
	var pageSize=5;//每页条数
	//进入页面调用页面渲染的函数
	render();
	function render(){
		//发送ajax请求以一级分类页面，渲染数据
		$.ajax({
			type:"get",
			url:"/category/queryTopCategoryPaging",
			data:{
				page:currentPage,
				pageSize:pageSize
			},
			dataType:"json",
			success:function(info){
				console.log(info);
				//模板引擎渲染页面
				var htmlStr=template('tpl',info);
				$('.lt-content tbody').html(htmlStr);
				//分页插件初始化
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
	//点击添加分类，弹出添加模态框
	$('.addButton').click(function(){
		$('.oneModal').modal('show');
		
	})
	
//3.表单校验功能	//使用表单校验插件
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
	//4.表单校验成功，阻止默认的提交，改用ajax发送数据，进行修改
	$("#form").on('success.form.bv', function (e) {
		e.preventDefault();
		//使用ajax提交逻辑
		$.ajax({
			url:"/category/addTopCategory",
			data:$('#form').serialize(),
			type:"post",
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
	});
	//点击叉号关闭模态框
	$('.close').click(function(){
		$('.oneModal').modal('hide')
	})
})