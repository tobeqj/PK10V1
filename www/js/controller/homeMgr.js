var pk10 = pk10 || {};
pk10.homeMgr = function () {

    var refreshTable = function(){
        settingService.getLastSetting(function (result) {
            maskUtil.showMask("加载中...");
            var setting = result;
            homeService.initTable(setting, maskUtil.hideMask, maskUtil.hideMask);
        }, function(err){
            window.plugin.toast.showShortCenter("获取设置信息失败！");
        });
    }

    var initRefreshBtn = function(){
        $('#btnRefresh').click(function () {
            refreshTable();
        });
    }

    var properties = {        
        initPage: function () {
            initRefreshBtn();
            refreshTable();
        },
        refreshTable: refreshTable
    };

    return properties;
}();