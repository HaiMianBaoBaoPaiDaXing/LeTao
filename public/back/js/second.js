//二级分类接口
$(function(){
	var currentPage=1;
	var pageSize=5;
	//1.发送ajax请求后台数据，渲染页面
	render();
	function render(){
		$.ajax({
			url:"/category/querySecondCategoryPaging",
			type:"get",
			dataType:"json",
			data:{
				page:currentPage,//页数
				pageSize:pageSize,//每页条数
				},
			success:function(info){
				console.log(info);
				var htmlStr=template("secondTpl",info);
				$('tbody').html(htmlStr);
				//2.分页插件初始化
				$('#paginator').bootstrapPaginator({
					bootstrapMajorVersion:3,
					currentPage:info.page,//当前页
					//总页数
					totalPages:Math.ceil(info.total/info.size),
					//分页按钮绑定点击事件
					onPageClicked:function(a,b,c,page){
						currentPage=page;
						render();
					}
				})
			}
		})
	}
	//2.点击添加分类按钮，弹出模态框
	$('#addBtn').click(function(){
		$('#addModal').modal('show');
		//点击按钮后，发送ajax请求获取一级分类数据，利用模板渲染下拉菜单数据
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
	//3.给下拉列表的a添加点击事件，事件委托
	$('.dropdown-menu').on('click',"a",function(){
		var txt=$(this).text();
		console.log(txt);
		$('.dropdownText').text(txt);
		//获取a标签存储的分类id
		var id=$(this).data("id");
		$('[name="categoryId"]').val(id);
		//更新校验状态
		$('#form').data("bootstrapValidator").updateStatus('categoryId',"VALID");
	})
	//4.配置上传图片插件接口
	$('#uploadFile').fileupload({
		//返回数据类型
		dataType:"json",
		//成功后返回的东西
		done:function(e,data){
			var imgUrl=data.result.picAddr;
			$('.imgBox img').attr("src",imgUrl);
			//地址设置给隐藏域
			$('[name="brandLogo"]').val(imgUrl);
			//更新校验状态
			$('#form').data("bootstrapValidator").updateStatus('brandLogo',"VALID");

		}
	})
	// 5. 配置表单校验
  $('#form').bootstrapValidator({
	// 将默认的排除项, 重置掉 (默认会对 :hidden, :disabled等进行排除)
    excluded: [],
	// 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验的字段
    fields: {
      // 品牌名称
      brandName: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      // 一级分类的id
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },
      // 图片的地址
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });
  //6.阻止默认提交，改用ajax提交
  $('#form').on('success.form.bv',function(e){
  	e.preventDefault();
  	//ajax提交数据
  	$.ajax({
  		data:$('#form').serialize(),
  		url:"/category/addSecondCategory",
  		dataType:"json",
  		type:"post",
  		success:function(info){
  			if (info.success) {
  				//成功提交，关闭模态框
  			$("#addModal").modal('hide');
  			//重新渲染页面
  			render();
  			//重置表单内容和状态
  			$('#form').data('bootstrapValidator').resetForm(true);
  			//下拉框和图片预览不是表单元素，需要单独重置
  			$('.dropdownText').text("请选择一级分类");
  			$('.imgBox img').attr("src","images/none.png");
  			}
  		}
  	})
  })
})