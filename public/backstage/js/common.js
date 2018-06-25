//功能一向服务器发送请求是进度条添加

$(document).ajaxStart(function () {
    //开启进度条
    NProgress.start();
});
$(document).ajaxStop(function () {
    setTimeout(function (){
        //关闭进度条
        NProgress.done();
    },500)
});

$(function () {
    // 切换分类
    $('.category').click(function () {
        $('.child').stop().slideToggle();
    });


    //点击icon-menu 切换类名

    $('.icon-menu').click(function () {
        $('.main_top').toggleClass("move");
        $('.left_slide').toggleClass("move");
        $('.right_main').toggleClass("move");
    })
})