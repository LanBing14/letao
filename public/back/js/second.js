


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

    //步骤二: 点击添加按钮显示模态框add

    $('#add').click(function () {
        $('#addBtnModal').modal('show');

        //步骤三: 对一级分类进行动态填充向服务器发送强求

        $.ajax({
            type:'get',
            url:'/category/queryTopCategoryPaging',
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
            $('.dropdown-menu').html(template('tpl',info));
            }
        })
    });

  //步骤四: 对一级分类点击可以将文本放在
  $('.dropdown-menu').on('click','a',function () {
    var txt = $(this).text();
    $('#categoryFirst').text(txt);
    //获取当前的id
    var id = $(this).data('id');
    //将id放在隐藏地域中
    $('[name="categoryId"]').val(id);
    //用户选择了一级分类后, 需要将 name="categoryId" input 框的校验状态置成 VALID
    // 参数1: 字段名, 参数2: 设置成什么状态, 参数3: 回调(配置提示信息)
    $('#secondForm').data("bootstrapValidator").updateStatus("categoryId", "VALID");

  });
  //步骤五,配置文件上传后的回调函数
  $("#fileupload").fileupload({
      dataType: 'json',
      //图片上传后的对象,通过e.result.picAddr可以获取图片地址
      done: function (e,data) {
        console.log(data.result.picAddr);
        var picUrl = data.result.picAddr;

        //将图片地址给img
        $('#imgBox img').attr('src',picUrl);

        //将图片的地址保存在brandLogo的隐藏雨中
        $('[name="brandLogo"]').val(picUrl);
        // 手动将表单校验状态重置成 VALID
      $('#secondForm').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
      }
  })
  //步骤六,对表单进行验证

  $('#secondForm').bootstrapValidator({
        excluded: [],
      //配置图标
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',//校验成功
          invalid: 'glyphicon glyphicon-remove',//校验失败
          validating: 'glyphicon glyphicon-refresh',//校验中
      },
      //配置字段
      fields: {
        // categoryId用户选择一级分类的id
        //用户输入微积分累的名称brandName
            categoryId:{
              validators: {
                  notEmpty: {
                      message: "请选择一级分类",
                  }
              }

          },
          brandName: {
              validators: {
                  notEmpty: {
                      message: "请输入二级分类"
                  }
              }
          },
          brandLogo: {
              validators:{
                  notEmpty: {
                      message:"请上传图片"
                  }
              }
          }
      }
  });

  //步骤七验证成功后取消submit默认事件请求ajax

  $('#secondForm').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
        type:'post',
        url:'/category/addSecondCategory',
        data: $('#secondForm').serialize(),
        dataType: 'json',
        success: function (info) {
            console.log(info);
            //重置一级分类
            if (info.success) {
                $('#addBtnModal').modal('hide');
                currentPage = 1;
                render();

                // 重置表单状态
                $('#secondForm').data('bootstrapValidator').resetForm(true);
                $('#imgBox img').attr('src',"./images/default.png");
                $('#categoryFirst').text("请选择一级分类");
            }
            
        }

    })
  })
})