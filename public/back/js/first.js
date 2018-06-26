

$(function () {
    //渲染当前页面,构造分页插件
    var currentPage = 1;
    var pageSize = 2;
    function render() {
        $.ajax({
            type: 'get',
            url: '/category/queryTopCategoryPaging',
            data:{
                page: currentPage,
                pageSize:  pageSize,
            },
            dataType: 'json',
            success: function (info) {
                // console.log(info);
                $('tbody').html(template('tmp',info));
                //分页设置
                $('#paginator').bootstrapPaginator({
                    //版本信息
                    bootstrapMajorVersion: 3,
                    //当前页码
                    currentPage: info.page,
                    //总共页码
                    totalPages: Math.ceil(info.total/info.size),
                    onPageClicked: function (a,b,c,page) {
                        //更新当前页重新渲染
                        currentPage = page,
                        render();
                    }

                })
            }
        })

    }
    render();


    // 2点击添加按钮添加模态框
    $('.btnCate').click(function () {
        $('#addModal').modal('show');
    })
    //0点击确定按钮取消submit默认的发送模式
    //3. 通过表单校验插件, 实现表单校验

    $('#addForm').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message:"一级分类名称不能为空"
                    }
                }
            }
        }
    })
    //4注册表单校验成功事件, 阻止默认成功的提交, 通过 ajax 进行提交
    $('#addForm').on('success.form.bv',function (e) {
        e.preventDefault();

        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data: $('#addForm').serialize(),
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    //模态框隐藏
                    $('#addModal').modal('hide');

                    //渲染第一页
                    currentPage = 1;

                    render();

                    //重置表单
                    $('#addForm').data ('bootstrapValidator').resetForm(true);
                }
            }
        })
    })

})