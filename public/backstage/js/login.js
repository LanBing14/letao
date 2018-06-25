// 功能一进行表单配件验证
$(function () {
    // 表单校验插件
    $('#form').bootstrapValidator({
        feedbackIcons:{
            valid:'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: "用户名不能为空",
    
                    },
                    stringLength: {
                        min: 4,
                        max: 6,
                        message: '用户名必须在2-6之间'
                    },
                    callback: {
                        message:'用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空',
    
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码必须在6-12位'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    });

    //注册表单验证成功实践

    $('#form').on('success.form.bv',function (e) {
        //阻止默认提交

        e.preventDefault();
        //发送ajax请求

        $.ajax({
            type:'post',
            url: '/employee/employeeLogin',
            data: $('#form').serialize(),
            dataType:'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    location.href = "index.html";
                }
                if (info.error === 1000) {
                    console.log("用户名不存在");
                    $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback")
                };
                if (info.error ===1001) {
                    console.log("密码错误");
                    $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback')
                }
            }
        })

    })

    // 点击重置按钮

    $('.resetBtn').click(function () {
        $('#form').data('bootstrapValidator').resetForm();
    })
})


