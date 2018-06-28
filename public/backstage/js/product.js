
$(function () {
    var currentPage = 1;
    var pageSize = 5;
    function render() {
        $.ajax({
            type:'get',
            url: '/product/queryProductDetailList',
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
                    },
                    itemTexts: function (type, page, current) {
                        switch (type) {
                            case "first":
                                return "首页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                            case "last":
                                return "末页";
                            case "page":
                                return page;
                        }
                    }
                })
            }
        })
    };
    render();


    $('#categoryBtn').click(function () {
        $('#Modal').modal('show');
        $.ajax({
            type:'get',
            url: '/category/querySecondCategoryPaging',
            data:{
                page: 1,
                pageSize: 100,
            },
            dataType: 'json',
            success: function (info) {
                $('.dropdown-menu').html(template('tpl',info))
            }
        })

    });

    $('.dropdown-menu').on('click','a',function () {
        var id = $(this).data('id');
        var txt = $(this).text();
        $('#secondBtn').text(txt);
        $('[name="brandld"]').val(id);
        $('#form').data('bootstrapValidator').updateStatus('brandld','VALID')
    });

    //上传图片
    var picArr = [];
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e,data) {
            console.log(data.result);
            //获取图片的地址
            var picurl = data.result.picAddr
            //创建img标签
            $('#imgBox').prepend("<img src="+ picurl +" width='80' height='80' >");
            // 将图片的地址存到数组中
            picArr.unshift(data.result);
            if (picArr.length > 3) {
                picArr.pop();//删除最后一张
                //将图片标签也要删除
                $('#imgBox img:last-of-type').remove(); 
            }

            if (picArr.length === 3) {
                $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
            }

        }
    });
    
    //设置校验
    $('#form').bootstrapValidator({
        excluded: [],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            brandld: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类',
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称',
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价',
                    },
                    regexp: {
                        regexp: /^[0-9]*$/,
                        message: '商品价格必须由数字组成'
                    }

                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价',
                    },
                    regexp: {
                        regexp: /^[0-9]*$/,
                        message: '商品价格必须由数字组成'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入尺寸',
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品尺寸必须由数字xx-xx组成'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类',
                    },
                    regexp: {
                        regexp: /^[0-9]*$/,
                        message: '商品数量必须由数字组成'
                    }
                }
            },
            picStatus: {
                validators: {
                    notEmpty: {
                        message: '请选择三张图片',
                    },
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述信息',
                    },
                }
            }

        }
    })

    //取消默认发送
    $('#form').on('success.form.bv',function (e) {
        e.preventDefault();
        var Form = $('#form').serialize();
        //拼接数据
        Form += "&picName1="+picArr[0].picName+"$picAddr1="+picArr[0].picAddr;
        Form += "&picName1="+picArr[1].picName+"$picAddr1="+picArr[1].picAddr;
        Form += "&picName1="+picArr[2].picName+"$picAddr1="+picArr[2].picAddr;


        $.ajax({
            type:'post',
            url:'/product/addProduct',
            data: Form,
            dataType: 'json',
            success: function (info) {
                $('#Modal').modal('hide');
                console.log(info);
                currentPage = 1;
                render();
                $('#form').data('bootstrapValidator').resetForm(true);
                $('.dropdown-menu').text('请选择二级分类');
                // 手动重置图片, 找到所有图片, 让所有图片自杀
                $('#imgBox img').remove();
            }
        })
    })

})