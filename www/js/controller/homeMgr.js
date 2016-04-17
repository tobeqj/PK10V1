var pk10 = pk10 || {};
pk10.homeMgr = function () {

    $('#btnRefresh').click(function () {
        pk10.homeMgr.initPage();
    });

    var properties = {        
        initPage: function () {
            settingService.getLastSetting(function (result) {
                maskUtil.showMask();
                var setting = result;
                homeService.initTable(setting, maskUtil.hideMask, function(err){
                    window.plugin.toast.showShortCenter("初始化表格数据失败！");
                    maskUtil.hideMask();
                });
            }, function(err){
                window.plugin.toast.showShortCenter("获取设置信息失败！");
            });
        }
    };

    return properties;
}();