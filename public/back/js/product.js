$(function(){
	var currentPage=1;
	var pageSize=5;
	var picArr = []; // 专门用来保存图片对象
	render();
	function render(){
		$.ajax({
			url:"/product/queryProductDetailList",
			type:"get",
			data:{
				page:currentPage,
				pageSize:pageSize
			},
			dataType:"json",
			success:function(info){
				console.log(info)
				var htmlStr=template("productTpl",info);
				$(".lt_content tbody").html(htmlStr);
				//分页插件初始化
				$("#paginator").bootstrapPaginator({
					bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
					currentPage:info.page,//当前页
					totalPages:Math.ceil(info.total/info.size),//总页数
					size:"small",//设置控件的大小，mini, small, normal,large
					onPageClicked:function(a,b,c,page){
						//为按钮绑定点击事件 page:当前点击的按钮值
						currentPage=page;
						render();
					},
					size:"normal",//分页大小
					//分页按键的文字
					itemTexts:function(type, page, current){
						// first 首页 last 尾页, prev 上一页, next 下一页, page 普通页码
						// page 是当前按钮指向第几页
						// current 是指当前是第几页 (相对于整个分页来说的)
						switch( type ) {
						  case "first":
							return "首页";
						  case "last":
							return "尾页";
						  case "prev":
							return "上一页";
						  case "next":
							return "下一页";
						  case "page":
							return page;
						}
					},
					// 配置提示框
					tooltipTitles: function( type, page, current) {
						switch( type ) {
							case "first":
							return "首页";
						case "last":
							return "尾页";
						case "prev":
							return "上一页";
						case "next":
							return "下一页";
						case "page":
							return "前往第" + page + "页";
						}
					},
					// 使用 bootstrap 样式的提示框组件
					useBootstrapTooltip: true
				});
			}
		})
	}
	//2.点击按钮，显示模态框
	$('#addBtn').click(function(){
		$("#addModal").modal('show');
		//请求二级分类数据
		$.ajax({
			url: "/category/querySecondCategoryPaging",
			type: "get",
			data: {
			page: 1,
			pageSize: 100
			},
			success:function(info){
				console.log(info);
				var htmlStr = template( "dropdownTpl", info );
				$('.dropdown-menu').html( htmlStr );
			}
		})
	});
	//3.注册a点击事件
	$('.dropdown-menu').on("click","a",function(){
		//二级菜单文本变更为点击的文本
		var txt=$(this).text();
		console.log(txt);
		//获取存储的自定义id值
		var id=$(this).data('id');
		$('.dropdownText').text( txt );
		//隐藏域id
		$('[name="brandId"]').val(id);
	})
	//4.上传图片的插件
	$("#fileupload").fileupload({
		dataType:"json",
		//上传图片完成，响应的数据,data.result存储着文件对象
		done:function(e,data){
			//图片地址对象
			var picObj=data.result;
			//图片地址
			var picAddr=picObj.picAddr;
			// 新得到的图片对象, 应该推到数组的最前面    push pop shift unshift
			picArr.unshift( picObj );
			// 新的图片, 应该添加到 imgBox 最前面去
			$('.imgBox').prepend('<img src="'+ picAddr +'" width="100">');

			// 如果上传的图片个数大于 3个, 需要将最旧的那个(最后面的哪项), 要删除
			if( picArr.length > 3 ) {
			// 删除数组的最后一项
			picArr.pop();
			// 除了删除数组的最后一项, 还需要将页面中渲染的最后一张图片删除掉
			// 通过 last-of-type 找到imgBox盒子中最后一个 img 类型的标签, 让他自杀
			$(".imgBox img:last-of-type").remove();
			}
			// 如果处理后, 图片数组的长度为 3, 说明已经选择了三张图片, 可以进行提交
			  // 需要将表单 picStatus 的校验状态, 置成 VALID
			  if ( picArr.length === 3 ) {
				$('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID")
			  }
		}
	})
	//5.表单校验
	$('#form').bootstrapValidator({
		//默认排除项目重置
		excluded:[],
		//配置图标
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		//配置校验字段
		fields:{
			//二级分类id，归属品牌
			brandId:{
				validators:{
					notEmpty:{
						message:"请选择二级分类"
					}
				}
			},
			// 商品名称
			proName: {
				validators: {
					notEmpty: {
						message: "请输入商品名称"
					}
				}
			},
			// 商品描述
			proDesc: {
				validators: {
					notEmpty: {
						message: "请输入商品描述"
					}
				}
			},
			// 商品库存
		  // 要求: 必须是非零开头的数字, 非零开头, 也就是只能以 1-9 开头
		  // 数字: \d
		  // + 表示一个或多个
		  // * 表示零个或多个
		  // ? 表示零个或1个
		  // {n} 表示出现 n 次
		  num: {
			validators: {
			  notEmpty: {
				message: "请输入商品库存"
			  },
			  //正则校验
			  regexp: {
				regexp: /^[1-9]\d*$/,
				message: '商品库存格式, 必须是非零开头的数字'
			  }
			}
		  },
		  // 尺码校验, 规则必须是 32-40, 两个数字-两个数字
		  size: {
			validators: {
			  notEmpty: {
				message: "请输入商品尺码"
			  },
			  //正则校验
			  regexp: {
				regexp: /^\d{2}-\d{2}$/,
				message: '尺码格式, 必须是 32-40'
			  }
			}
		  },
		  // 商品价格
		  price: {
			validators: {
			  notEmpty: {
				message: "请输入商品价格"
			  }
			}
		  },
		  // 商品原价
		  oldPrice: {
			validators: {
			  notEmpty: {
				message: "请输入商品原价"
			  }
			}
		  },
		  // 标记图片是否上传满三张
		  picStatus: {
			validators: {
			  notEmpty: {
				message: "请上传3张图片"
			  }
			}
		  }
		}
			
	})
	//6.注册校验成功实践
	$('#form').on('success.form.bv',function(e){
		//阻止默认的提交
		e.preventDefault();
		//表单提交的数据
		var params=$("form").serialize();
		console.log(picArr);
		params += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
		params += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
		params += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
		console.log(params);
		//ajax提交数据
		$.ajax({
			url:"/product/addProduct",
			type:"post",
			data:params,
			success:function(info){
				console.log(info);
				if(info.success){
					$('#addModal').modal("hide");
					// 重置校验状态和文本内容
					  $('#form').data("bootstrapValidator").resetForm(true);
					  // 重新渲染第一页
					  currentPage = 1;
					  render();
					   // 手动重置, 下拉菜单
					  $('.dropdownText').text("请选择二级分类")
					  
					  // 删除结构中的所有图片
					  $('.imgBox img').remove();
					  // 重置数组 picArr
					  picArr = [];
				}
			}
		})
	})
})