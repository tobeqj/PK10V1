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
            initCurrentAwardInfos();
        });
    }

    var initCurrentAwardInfos = function(){
        awardDataService.getCurrentAwardResult(function(data){
            var awardNumbers = data.current.awardNumbers;
            var $balls = $('#currentAwardNumbers').children();
            $(awardNumbers).each(function(i, num){
                 $balls[i].className = "no" + num;
            });
        });
    }

    var properties = {        
        initPage: function () {
            initCurrentAwardInfos();
            initRefreshBtn();
            refreshTable();
        },
        refreshTable: refreshTable
    };

    return properties;
}();