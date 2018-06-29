$(function () {
    $.ajax({
        type: 'get',
        url: '',
        dataType: 'json',
        success: function (info) {
            console.log(info)
        }
    })
})