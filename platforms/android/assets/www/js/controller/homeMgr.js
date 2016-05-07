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

    var initPageText = function(){
        $('#currentAwardDataTitle').text(pk10.msgs.currentAwardDataTitle);
        $('#waittingMsg').text(pk10.msgs.waitingAwardResult);
        $('#nextAwardTimeSpan').text(pk10.msgs.nextAwardTimeSpan);
        $('#thPeriodNumber').text(pk10.msgs.resultTableThPeriodNumber);
        $('#thNumber').text(pk10.msgs.resultTableThNumber);
        $('#thPosition').text(pk10.msgs.resultTableThPosition);
        $('#thResult').text(pk10.msgs.resultTableThResult);
        $('#thDetails').text(pk10.msgs.resultTableThDetails);
        $('#thDanshuang').text(pk10.msgs.resultTableThDanshuang);
        $('#thDaxiao').text(pk10.msgs.resultTableThDaxiao);
        $('#thRight1').text(pk10.msgs.resultTableThRight);
        $('#thRight2').text(pk10.msgs.resultTableThRight);
    };

    var properties = {        
        initPage: function () {
            initPageText();
            initRefreshBtn();
            refreshCurrentAwardInfos();
            refreshTable();
            homeService.strartTimedUpdateData();
        },
        refreshTable: refreshTable
    };

    return properties;
}();