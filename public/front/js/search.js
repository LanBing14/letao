$(function () {
    function way() {
        //想获取地址栏的地址
        var search = location.search;
        search = decodeURI(search);
        search = search.slice(1);
        var arr = search.split('&');
        var obj = {};
        arr.forEach(function (v,i) {
            var key = v.split('=')[0];
            var value = v.split('=')[1];
            obj[key] = value
        })
        return obj;
    }





    //获取历史记录数组
    function getHistory() {
        //从获取数据,将数据转成数组
        var jsonStr = localStorage.getItem('name') || '[]';
        // 装成数组
        var arr = JSON.parse(jsonStr);
        return arr
    }
    //读取历史记录,进行页面渲染
    function render() {
        var arr = getHistory();
        $('.history').html(template('tpl',{arr: arr}));
    }

    render();
    //清空历史记录,页面重新渲染
    $('.history').on('click','.icon-trashDel', function () {
        //从loca中删除整个name
        mui.confirm('你确定要删除全部历史记录吗','温馨提示',['取消','确定'], function (e){
            console.log(e)
            if (e.index === 1) {
                localStorage.removeItem('name');
                render();
            }
        } )

    });


    //删除一条记录的功能,添加点击事件
    //将数组的下标存储在数组中,将来用于删除
    //获取下标,根据下表删除数组中的对应项
    //将数组存储到本地历史记录中

    $('.history').on('click','#dele',function () {
       var that = this;
       mui.confirm("你确定要删除这项数据?","温馨提示",['取消','确定'], function (e) {
           if (e.index===1) {
                //获取当前的下标
                var index =  $(this).data('index');
                //获取数组
                var arr = getHistory();
                //将数组中对应的下标删除掉
                arr.splice(index,1);
                //将数组转成json字符串
                var str = JSON.stringify(arr);
                //  存储本地历史记录中
                localStorage.setItem('name',str);
                //重新渲染
                render();
            }
       })


       

    });

    // 功能4: 添加搜索记录功能
    // (1) 给搜索按钮添加点击事件
    // (2) 获取搜索关键字
    // (3) 获取数组
    // (4) 添加到数组最前面
    // (5) 存储到本地历史记录中
    // (6) 重新渲染
    // 需求:
    // 1. 不能有重复的项, 如果有, 将旧的删除
    // 2. 如果数组长度最多 10个
    $('.btnClick').click(function () {
        var text = $('.txt').val();
        if ( text === "") {
            mui.toast('请输入内容');
            return;
        }
        //获取数组
        var arr = getHistory();
        // 不能有重复的项, 如果有, 将旧的删除
        var index =arr.indexOf(text);
        if (index > -1) {//说明存在
            //将有的删除
            arr.splice(index,1);
        }
        //将内容添加到数组的最前面
        arr.unshift(text);
        //将数组转换成字符串
       var str =  JSON.stringify(arr);
        //将字符串存入本地存储中
        localStorage.setItem('name',str);
        render();
        //清除内容
        $('.txt').val('');
        //进行页面跳转
        location.href = "searchList.html?key=" + text;

    })

})