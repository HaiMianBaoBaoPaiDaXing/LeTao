//滚动条插件实现
$(function(){
	$(document).ajaxStart(function(){
		NProgress.start();
	});
	$(document).ajaxStop(function(){
		NProgress.done();
	})
});
$(function(){
	//1.分类管理功能切换
		$('.nav .category').click(function(){
			//切换child的显示和隐藏
			$('.nav .child').stop().slideToggle();
		});


	//2.左侧侧边栏功能切换
	$('.icon_menu').click(function(){
		$('.lt_aside').toggleClass('hidemenu');
		$('.lt_main').toggleClass('hidemenu');
		$('.lt_topbar').toggleClass('hidemenu');
	})
	//3.点击退出按钮，弹出模态框
	$('.icon_logout').click(function(){
		$('#logoutModal').modal('show');
	})
	//4.点击模态框退出按钮，实现退出功能，跳转至登录页
	$('#logoutBtn').click(function(){
		// 访问退出接口, 进行退出
		 $.ajax({
		   url: "/employee/employeeLogout",
		   type: "GET",
		   dataType: "json",
		   success: function( info ) {
				console.log(info)
			 if ( info.success ) {
			   location.href = "login.html"
			 }
		   }
		 })
	})
	if ( location.href.indexOf("login.html") === -1 ) {
  $.ajax({
    url: "/employee/checkRootLogin",
    type: "get",
    success: function( info ) {
      console.log( info )
      if ( info.success ) {
        console.log( "登陆了" );
        // 啥也不用干
      }

      if ( info.error === 400 ) {
        // 进行拦截, 拦截到登录页
        location.href = "login.html";
      }
    }
  })
}

})
