$(function () {
    //步骤一: 像后台发送请求,渲染当前页面
    var currentPage = 1;
    var pageSize = 2;
    function render() {
        $.ajax({
            type:'get',
            url:'/category/querySecondCategoryPaging',
            data: {
                page: currentPage,
                pageSize: pageSize,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                //模板
                $('tbody').html( template('tmp',info));

                //分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    //当前页码
                    currentPage: info.page,
                    //总的页码
                    totalPages: Math.ceil(info.total/ info.size),
                    //点击按钮事件
                    onPageClicked: function (event,originalEvent,type,page) {
                        //当前也显示
                        currentPage = page;
                        render();
                    }
                })
            }

        })
    }
    //渲染当前页
    render();
    //2点击添加分类显示模态框
    $('#add').click(function () {
        $('#addBtnModal').modal('show');
        //3一级分类进行动态填充
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            type: 'get',
            data:{
                page: 1,
                pageSize: 100,
            },
            dataType:'json',
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('tpl',info))
            }

        })
    });
    //3事件委托
    $('.dropdown-menu').on('click','a',function () {
        var txt = $(this).text();
        $('#categoryFirst').text(txt);

        //获取a 的保存的id 复制发给隐藏yuming
        var id = $(this).data('id');
        $('[name = "categoryId"]').val(id);
        //更改状态
        $('#secondForm').data('bootstrapValidator').updateStatus('categoryId' , 'VALID');
    });
    //4点击上传图片插件
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e,data) {
            console.log(data.result.picAddr);
            var pic = data.result.picAddr;
            //将图片赋值给地面的盒子
            $('#imgBox img').attr('src',pic);
            //保存图片的地址
            $('[name= "brandLogo"]').val(pic);
            //更改状态
            $("#secondForm").data("bootstrapValidator").updateStatus('brandLogo', 'VALID');
        }
    });
    //5状态验证
    $('#secondForm').bootstrapValidator({

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
    //6取消submit默认提交的功能
    $('#secondForm').on('success.form.bv',function (e) {
        //阻止默认提交
        e.preventDefault();
        //使用ajax提交
        $.ajax({
            type: 'post',
            url: '/category/addSecondCategory',
            data: $('#secondForm').serialize(),
            dataType: "json",
            success:function (info) {
                console.log(info);
                if (info.success) {
                    //模态框关闭
                    $('#addBtnModal').modal('hide');
                    //重新渲染
                    currentPage =1;
                    render();
                    $('#secondForm').data('bootstrapValidator').resetForm(true);
                    $('#imgBox img').attr('src','./images/default.png');
                    $('#categoryFirst').text("请输入一级分类")

                }
            }
        })
    })
    


})