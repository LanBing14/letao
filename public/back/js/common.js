if (location.href.indexOf("login.html") === -1) {
    // 如果索引为 -1, 说明在地址栏参数中没有 login.html 需要登陆拦截
    $.ajax({
        type:'get',
        url: '/employee/checkRootLogin',
        dataTye: 'json',
        success: function (info) {
            // console.log(info);
            if (info.success) {
                // location.href = "index.html";
                console.log("当前用户已经登录");
            } 
            if(info.error === 400) {
                location.href = "login.html";
            }
        }
    })
}



$(document).ajaxStart(function () {
    NProgress.start();
});
$(document).ajaxStop(function () {
   setTimeout(function () {
    NProgress.done();
   },500)
});


$(function () {
    // 点击按钮切换类名move
    $('.icon_menu').click(function () {
        $('.left_slide').toggleClass("move");
        $('.right_main .main_top').toggleClass("move");
        $('.right_main').toggleClass("move");
    });


    // 点击分类管理,切换类名

    $('.left_slide .category').click (function () {
        $('.left_slide .child').stop().slideToggle();
    });

    // 点击退出按钮,显示退出模态框
    $('.main_top  .icon_loginOut').click(function () {

        $('#myModal').modal("show");
    })

    // 点击退出按钮,想服务期发送请求要退出

    $('.closeBtn').click(function () {
        $.ajax({
            type:'get',
            url: '/employee/employeeLogout',
            dataTye: 'json',
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    location.href = "login.html";
                }
            }
        })
    })
//判断是否登陆过,如果登陆过才可以进入页面


    

})