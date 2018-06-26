


$(function () {
    render();
    function render(currentPage, pageSize) {
        $.ajax({
            type:'get',
            url:'/user/queryUser',
            data: {
                page:  currentPage || 1,
                pageSize: pageSize || 5,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                $('tbody').html(template('tmp',info));
                // 分页插件
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    // 总共多少页
                    totalPages: Math.ceil(info.total/info.size),
                    // 当前页数
                    currentPage: info.page,
                    // 配置按钮点击事件
                    onPageClicked(a,b,c,page) {
                        render(page);
                        // currentPage = page;
                    }
                })
            }
        });
    };

    // 点击按钮,显示模态框
    var id;
    var isDelete;
    $('tbody').on('click','.btn', function () {
        $('#btnModal').modal('show');
        id = $(this).parent().data('id');

        isDelete = $(this).hasClass('btn-danger')? 0: 1;

        console.log(isDelete)
    })
    $('#submitBtn').click(function (){
        //发送ajax请求
        $('#btnModal').modal('hide');
        $.ajax({
            type: 'post',
            url: '/user/updateUser',
            data: {
                id: id,
                isDelete: isDelete,
            },
            dataType:'json',
            success: function (info) {
                console.log(info);
                render();
            }
        })
    })

    
})


// 第二种方法

// $(function () {
//     var currentPage = 1;
//     var pageSize = 5;
//     render();
//     function render() {
//         $.ajax({
//             type: 'get',
//             url: '/user/queryUser',
//             data: {
//                 page: currentPage,
//                 pageSize: pageSize,
//             },
//             dataType: 'json',
//             success: function (info) {
//                 // console.log(info);
//                 $('tbody').html(template('tmp',info));
    
    
//                 // 分页拆件
//                 $('#paginator').bootstrapPaginator({
//                     bootstrapMajorVersion: 3,
//                     currentPage: info.page,
//                     totalPages: Math.ceil(info.total - info.size),
//                     onPageClicked: function (a,b,c,page) {
//                         currentPage =page;
//                         render();
//                     }
//                 })
//             }
//         })
//     };


//     // 点击禁用按钮,获取当前id和isDelete的值
//     var id;
//     var isDelete;
//     $('tbody').on('click','.btn',function () {
//         // 模态框显示
//         $('#btnModal').modal('show');
//         //获取当前的id
//         id = $(this).parent().data('id');

//         //获取状态
//         isDelete = $(this).hasClass('btn-danger')? 0: 1;
//         // console.log(id,isDelete)
//     })
// })