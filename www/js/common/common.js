// 将表单数据转化成Json实体
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] != undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value;
        }
    });
    return o;
};

//源于C#中的string.Format()
//两种调用方式
//var template1 = "我是{0}，今年{1}了";
//var template2 = "我是{name}，今年{age}了";
//var result1 = template1.format("loogn", 22);
//var result2 = template2.format({ name: "loogn", age: 22 });
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof(args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18   
Date.prototype.format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1,                 //月份   
        "d+": this.getDate(),                    //日   
        "h+": this.getHours(),                   //小时   
        "m+": this.getMinutes(),                 //分   
        "s+": this.getSeconds(),                 //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

Date.prototype.addDays = function(days){
    return new Date(this.getTime() + 24*60*60*1000*days);
}

Date.getTimeSpan = function(date1, date2){
    var diff =date2.getTime()-date1.getTime(); //时间差的毫秒数
    //计算出相差天数
    var days=Math.floor(diff/(24*3600*1000));
    //计算出小时数
    var leave1=diff%(24*3600*1000); //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000); //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3=leave2%(60*1000); //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);

    return new TimeSpan(days, hours, minutes, seconds);
}


// 获取元素在数组中的索引
Array.prototype.indexOf = function (item, comparator) {
    comparator = comparator || function(a, b) { return a === b; };
    for (var i = 0; i < this.length; i++) {
        if (comparator(this[i], item)) return i;
    }
    return -1;
};

// 删除数组中指定的元素
Array.prototype.remove = function (item, comparator) {
    var index = this.indexOf(item, comparator);
    if (index > -1) {
        this.splice(index, 1);
    }
};