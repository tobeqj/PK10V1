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
            window.plugins.toast.showShortCenter(pk10.msgs.searchFailed);
            maskUtil.hideMask();
        });
    };

    var initPageText = function(){
        $('#searchDateLabel').text(pk10.msgs.searchDateLabel);
        $('#hisThPeriodNumber').text(pk10.msgs.resultTableThPeriodNumber);
        $('#hisThNumber').text(pk10.msgs.resultTableThNumber);
        $('#hisThPosition').text(pk10.msgs.resultTableThPosition);
        $('#hisThResult').text(pk10.msgs.resultTableThResult);
        $('#hisThDetails').text(pk10.msgs.resultTableThDetails);
        $('#hisThDanshuang').text(pk10.msgs.resultTableThDanshuang);
        $('#hisThDaxiao').text(pk10.msgs.resultTableThDaxiao);
        $('#hisThRight1').text(pk10.msgs.resultTableThRight);
        $('#hisThRight2').text(pk10.msgs.resultTableThRight);
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
            initPageText();
            initDateBox();
            $('#btnSearch').click(onSearch);
            onSearch();
        }
    };

    return properties;
}();