/**
 * Created by Felix on 2016/4/17.
 */
var maskUtil = function(){
    //显示遮罩层
    function showMask() {
        $("#mask").css("height", $(document).height());
        $("#mask").css("width", $(document).width());
        $("#mask").show();
    }

    //隐藏遮罩层
    function hideMask() {
        $("#mask").hide();
    }

    var properties = {
        showMask: showMask,
        hideMask: hideMask
    }

    return properties;
}();