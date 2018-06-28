

$(function () {
    var currentPage = 1;
    var pageSize = 2;
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
                    useBootstrapTooltip: true,
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "first": 
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "前往上一页";
                            case "next":
                                return "前往下一页";
                            case "page":
                                return "第"+page+"页"
                        }
                    },
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first": return "首页";
                            case "prev": return "上一页";
                            case "next": return "下一页";
                            case "last": return "尾页";
                            case "page": return page;
                        }
                    },//改写分页按钮字样
                    onPageClicked: function (event, originalEvent, type,page) {
                        currentPage = page;
                        render();
                    }
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
        $('#form').data('bootstrapValidator').updateStatus('brandId','VALID')
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
        //将图片的地址放到数组的最前面
        picArr.unshift(data.result);

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
                        },
                        regexp: {
                            regexp: /^[1-9]\d*$/,
                            message: '商品库存必须是非零开头的数字'
                        }
                    } 
                },
                size: {
                    validators:{
                        notEmpty: {
                            message: "请输入商品尺寸",
                        },
                        regexp: {
                            regexp: /^\d{2}-\d{2}$/,
                            message: '商品尺码必须是xx-xx的数字格式'
                        }
                    } 
                },
                oldPrice: {
                    validators:{
                        notEmpty: {
                            message:  "请输入商品原价",
                        },
                        
                    } 
                },
                price: {
                    validators:{
                        notEmpty: {
                            message: "请输入商品现价",
                        },
                        
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
        var formParam = $('#form').serialize();
        formParam +="&picName1="+picArr[0].picName+"&picAddr1="+ picArr[0].picAddr;
        formParam +="&picName1="+picArr[1].picName+"&picAddr1="+ picArr[1].picAddr;
        formParam +="&picName1="+picArr[2].picName+"&picAddr1="+ picArr[2].picAddr;
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: '/product/addProduct',
            data: formParam,
            dataType: 'json',
            success: function (info) {
                $('#myProductModal').modal('hide');
                console.log(info);
                currentPage = 1;
                render();

                //重置表单
                $('#form').data('bootstrapValidator').resetForm(true);
            }
        })
    })
        
})
