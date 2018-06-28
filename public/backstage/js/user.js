

$(function () {
    //发送ajax请求像后台请求数据
    var currentPage = 1;
    var pageSize = 5;
    var id;
    var isDelete;
    function render() {
        $.ajax({
            type:'get',
            url: '/user/queryUser',
            data:{
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                $('tbody').html(template('tmp',info));

                //设置分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total/info.size),
                    onPageClicked: function (a,b,c,page) {
                        currentPage = page;
                        render();
                    }
                })
            }
        })
    };
    render();

    //事件委托
    $('tbody').on('click','.btn',function () {
        $('#myModal').modal('show');
        id = $(this).parent().data('id');
        isDelete = $(this).hasClass('btn-danger')?0:1;
    });
    $('#useBtn').click(function () {
        $('#myModal').modal('hide');
        //向服务器发送请求,请求中携带id
        $.ajax({
            type:'post',
            url: '/user/updateUser',
            data:{
                id: id,
                isDelete: isDelete,
            },
            dataType: 'json',
            success: function (info) {
                if (info.success) {
                    render();
                }
            }
        })
    })
})