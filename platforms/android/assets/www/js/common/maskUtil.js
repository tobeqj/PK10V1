/**
 * Created by Felix on 2016/4/17.
 */
var maskUtil = function(){
    //显示遮罩层
    function showMask(msg) {
        $("#mask").css("height", $(document).height());
        $("#mask").css("width", $(document).width());
        $("#mask").show();
        $.mobile.loading("show", {
            text: msg,
            textVisible: false,
            theme: $.mobile.loader.prototype.options.theme,
            textonly: false,
            html: ""
        });
    }

    //隐藏遮罩层
    function hideMask() {
        $("#mask").hide();
        $.mobile.loading("hide");
    }

    var properties = {
        showMask: showMask,
        hideMask: hideMask
    }

    return properties;
}();
