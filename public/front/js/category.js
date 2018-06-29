
$(function () {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        dataType: 'json',
        success: function (info) {
            console.log(info);
            $('.category_left ul').html(template('tmp',info))
            //渲染第一页
             renderSecond(info.rows[0].id);
        }
    });

    //封装根据一级id渲染二级页面的方法
    function renderSecond(id) {
        $.ajax({
            type: 'get',
            url:'/category/querySecondCategory',
            data: {
                id: id
            },
            dataType:'json',
            success: function (info) {
                console.log(info);
                $('.category_right ul').html(template('rightTmp',info))
            }
        })
    }


    $('.category_left').on('click','a',function () {
       var id = $(this).data('id');
       renderSecond(id);
       //删除其他的类名
       
       $(this).toggleClass('current').parent().siblings().find('a').removeClass('current');

    })

})