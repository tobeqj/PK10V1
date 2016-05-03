/**
 * Created by Felix on 2016/4/17.
 */
var pk10 = pk10 || {};
pk10.historyMgr = function(){
    var tableService = awardTableService.newInstance;

    var onSearch = function(){
        maskUtil.showMask();
        var date = new Date($('#date').val());
        tableService.initTable(date, $('#tbHistoryResult'), maskUtil.hideMask, function(){
            window.plugins.toast.showShortCenter("查询失败！");
            maskUtil.hideMask();
        });
    };

    var initDateBox = function(){
        $('#date').mobiscroll().date({
            theme: "wp-light",
            mode: "scroller",
            display: "modal",
            lang: "zh"
        });
        var defaultDate = new Date().addDays(-1);
        $("#date").val(defaultDate.format("yyyy/MM/dd"));
    };

    var properties = {
        initPage: function(){
            initDateBox();
            $('#btnSearch').click(onSearch);
            onSearch();
        }
    };

    return properties;
}();