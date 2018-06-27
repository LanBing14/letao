

$(function () {
    var currentPage = 1;
    var pageSize = 5;
    function render() {
        $.ajax({
            type:'get',
            url: '/product/queryProductDetailList',
            data: {
                page: currentPage,
                pageSize:pageSize,
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);

                //模板
                $('tbody').html(template('tmp',info));

                //分页插件

                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total/info.size),
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first": return "首页";
                            case "prev": return "上一页";
                            case "next": return "下一页";
                            case "last": return "末页";
                            case "page": return page;
                        }
                    },//改写分页按钮字样
                })
            }
        })
    }
    render();

    //点击添加按钮,模态框显示,向服务器发送请求
    $('#btnAdd').click(function () {
        $('#myProductModal').modal('show');
        $.ajax({
            type: 'get',
            url:'/category/querySecondCategoryPaging',
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType:'json',
            success: function (info) {
                // console.log(info);
                //准备模板
                $('.dropdown-menu').html(template('tpl',info))
            }
        })
    });

    //事件委托
    $('.dropdown-menu').on('click','a',function () {
        var text = $(this).text();
        $('#categorySecond').text(text);

        $id = $(this).data('id');

        $('[name="brandId"]').val($id);
    })
    var picArr = [];
   $('#fileupload').fileupload({
       dataType: "json",
       done: function (e,data) {
        console.log(data);
        $('#imgBox').show();
        // console.log(data.result.picAddr);

        //获取的片的地址
        var picUrl = data.result.picAddr;
        //将图片的地址放到数组zhong
        picArr.unshift(picUrl);

        //新的图片添加到盒子的最前面
        $('#imgBox').prepend('<img src="'+ picUrl +'"width="100" height="100">');
        //上传头像大于三个就要将最后旧的一个删除
        if(picArr.length > 3) {
            picArr.pop();
            //将最后一个创建的标签也要删除
            $('#imgBox img:last-of-type').remove()
        }
       if (picArr.length === 3) {
           $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
       } 
       }
   })
   //校验表格
    $('#form').bootstrapValidator({
            excluded: [],
            //配置图标
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
        },
            fields: {
                brandId: {
                    validators:{
                        notEmpty: {
                            message: "请选择二级分类"
                        }
                    }    
                },
                proName: {
                    validators:{
                        notEmpty: {
                            message: "请选择商品名称",
                        }
                    } 
                },
                proDesc: {
                    validators:{
                        notEmpty: {
                            message: "请描述商品信息",
                        }
                    } 
                },
                num: {
                    validators:{
                        notEmpty: {
                            message: "请输入商品数量",
                        }
                    } 
                },
                size: {
                    validators:{
                        notEmpty: {
                            message: "请输入商品尺寸",
                        }
                    } 
                },
                oldPrice: {
                    validators:{
                        notEmpty: {
                            message:  "请输入商品原价",
                        }
                    } 
                },
                price: {
                    validators:{
                        notEmpty: {
                            message: "请输入商品现价",
                        }
                    } 
                },
                picStatus: {
                    validators:{
                        notEmpty: {
                            message: "请选择三张商品的图片",
                        }
                    } 
                }
        }
    })

    //表单校验成功阻止默认事件
    $('#form').on('success.form.bv', function (e) {
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                currentPage = 1;
                render();
            }
        })
    })
        
})
