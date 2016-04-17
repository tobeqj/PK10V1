/**
 * Created by Felix on 2016/4/17.
 */
var pk10 = pk10 || {};
pk10.historyMgr = function(){
    var tableService = awardTableService.newInstance;

    var onSearch = function(){
        settingService.getLastSetting(function (setting) {
            maskUtil.showMask();
            var date = new Date($('#date').val());
            tableService.initTable(setting, date, $('#tbHistoryResult'), maskUtil.hideMask, function(err){
                window.plugin.toast.showShortCenter("查询失败！")
                maskUtil.hideMask();
            });
        }, function(err){
            window.plugin.toast.showShortCenter("获取设置信息失败！");
        });

    };

    var properties = {
        initPage: function(){
            var defaultDate = new Date().addDays(-1);
            $("#date").val(defaultDate.format("yyyy-MM-dd"));
            $('#btnSearch').click(onSearch);
            onSearch();
        }
    };

    return properties;
}();