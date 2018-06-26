

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
                console.log(info);

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

    //
    $('#btnAdd').click(function () {
        $('#myProductModal').modal('show')
    });




    $("#fileupload").fileupload({
        dataType: 'json',
        //图片上传后的对象,通过e.result.picAddr可以获取图片地址
        done: function (e,data) {
          console.log(data.result.picAddr);
          var picUrl = data.result.picAddr;
  
          //将图片地址给img
          //$('#imgBox img').attr('src',picUrl);
  
          //将图片的地址保存在brandLogo的隐藏雨中
          //$('[name="brandLogo"]').val(picUrl);
          // 手动将表单校验状态重置成 VALID
        //$('#secondForm').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
        }
    })
})