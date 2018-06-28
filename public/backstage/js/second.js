

$(function () {
    //发送ajax请求像后台请求数据
    var currentPage = 1;
    var pageSize = 5;
    var $id;
    function render() {
        $.ajax({
            type:'get',
            url: '/category/querySecondCategoryPaging',
            data:{
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                 $('tbody').html(template('tmp',info));

                // //设置分页
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

    //文件上传
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e,data) {
            var pic = data.result.picAddr;
            console.log(pic);
            $('#imgBox').show();
            $('#imgBox img').attr('src',pic);
            $('[name="brandLogo"]').val(pic);
            $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')

            
        }
    });

    $('.btnCate').click(function () {
        $('#Modal').modal('show');
        $.ajax({
            type:'get',
            url: '/category/queryTopCategoryPaging',
            data:{
                page: 1,
                pageSize: 100,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl',info))
            }
        })
    });

    //点击动态生成的a
    $('.dropdown-menu').on('click','a',function () {
        var txt = $(this).text();
        $('#firstCategory').text(txt);
        $id = $(this).data('id');
        $('[name="categoryId"]').val($id);
        $('form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')

    });
    //表单校验

    $('#form').bootstrapValidator({

        excluded: [],
        feedbackIcons: {
            valid: "glyphicon glyphicon-ok",//验证成功
            invalid: "glyphicon glyphicon-remove",
            validating: "glyphicon glyphicon-refresh",

        },
        fields: {
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请输入一级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "图片不能为空"
                    }
                }
            }
        }
    });

    //阻止默认提交事件
    $('#form').on('success.form.bv',function (e) {
        e.preventDefault();
        //向服务器发送请求
        $.ajax({
            type:'post',
            url: '/category/addSecondCategory',
            data:$('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                currentPage = 1;
                render();
                $('#Modal').modal('hide');
                $('#form').data('bootstrapValidator').resetForm(true);
                $('.dropdown-menu').text("请选择一级分类");
                $('#imgBox img').attr('src','./images/default.png');

            }
        })
    })
})