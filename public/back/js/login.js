//此页面利用bootstrap-validator插件实现表单校验
$(function(){
	$('#login-from').bootstrapValidator({
		//配置校验图标
		feedbackIcons:{
			valid:'glyphicon glyphicon-ok',
			invalid:'glyphicon glyphicon-remove',
			validating:'glyphicon glyphicon-refresh'
		},
		// 指定校验的字段
		fields:{
			//用户名,对应表单的name属性
			username:{
				validators:{
					//校验不能为空
					notEmpty:{
						message:"用户名不能为空"
					},
					//长度校验
					stringLength:{
						min:2,
						max:6,
						message:'用户名长度在3到6位之间'
					},
					callback:{
						message:"用户名不存在"
					}
				}
			},
			password:{
				validators:{
					notEmpty:{
						message:'密码不能为空'
					},
					stringLength:{
						min:6,
						max:30,
						message:'密码长度必须在6-30位之间'
					},
					callback:{
						message:"密码错误"
					}
				}
			}
		}
	})
	//表单校验成功后，需要阻止默认的提交操作，改用ajax进行提交
	$('#login-from').on("success.form.bv",function(e){
		e.preventDefault();
		//改用ajax提交
		$.ajax({
			type:"post",
			url: "/employee/employeeLogin",
			data:$("#login-from").serialize(),
			dataType:"json",
			success:function(info){
				console.log(info);
				if(info.success){
					//登陆成功返回首页
					location.href="index.html";
				}
				 if ( info.error === 1000 ) {
					//插件中更新状态的方法
					$('#login-from').data("bootstrapValidator").updateStatus("username","INVALID","callback");
					
				}
				 if ( info.error === 1001 ) {
					$('#login-from').data("bootstrapValidator").updateStatus("password","INVALID","callback");
				}
			}
		})
	});
	//重置功能
	$('#lt-reset').click(function(){
		//创建插件示例对象，调用都西昂的方法进行重置校验状态，true内容及状态都重置，默认false
		$('#login-from').data("bootstrapValidator").resetForm();
	});
});	
	