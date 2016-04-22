var pk10 = pk10 || {};
pk10.homeMgr = function () {

    var refreshTable = function(){
        maskUtil.showMask("加载中...");
        homeService.initTable(maskUtil.hideMask, maskUtil.hideMask);
    };

    var refreshCurrentAwardInfos = function(){
        homeService.initCurrentAwardInfo()
    };

    var initRefreshBtn = function(){
        $('#btnRefresh').click(function () {
            refreshTable();
            refreshCurrentAwardInfos();
        });
    };

    var properties = {        
        initPage: function () {
            initRefreshBtn();
            refreshCurrentAwardInfos();
            refreshTable();
            homeService.strartTimedUpdateData();
        },
        refreshTable: refreshTable
    };

    return properties;
}();