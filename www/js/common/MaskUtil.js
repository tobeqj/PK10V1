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

    function showLoader(msg) {
        $.mobile.loadingMessage = msg || "正在加载数据，请稍候……";
        $.mobile.showPageLoadingMsg() ;
    }

    function hideLoader() {
        $.mobile.hidePageLoadingMsg();
    }

    var properties = {
        showMask: showMask,
        hideMask: hideMask,
        showLoader: showLoader,
        hideLoader: hideLoader
    }

    return properties;
}();
