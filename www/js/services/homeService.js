var homeService = function() {
    var _nextAwardTime;
    var _currentPeriodNumber;
    var _timer;
    var tableService = awardTableService.newInstance;

    var insertNewAwardResultToTable = function(awardResult){
        var $tr = tableService.createTableRow(awardResult);
        $('#tbTodayResult tbody').prepend($tr);
    }

    var timedTask = function () {
        awardDataService.getCurrentAwardResult(function (data) {
            if (data.current.periodNumber > _currentPeriodNumber
                && data.current.awardTime.getTime() >= _nextAwardTime.getTime()) {
                _currentPeriodNumber = data.current.periodNumber;
                _nextAwardTime = data.next.awardTime;
                insertNewAwardResultToTable(data.current);
            }
        });
    };

    var startTimedTask = function () {
        if (_timer) clearInterval(_timer);
        _timer = setInterval(function () {
            var currentTime = new Date();
            if (currentTime.getTime() >= _nextAwardTime.getTime()) {
                timedTask();
            }
        }, 1000);
    };
    
    var properties = {
        initTable: function(setting, success, error){
            tableService.initTable(setting, new Date, $('#tbTodayResult'), function(lastAwardResult){
                if(lastAwardResult){
                    _currentPeriodNumber = lastAwardResult.periodNumber;
                }
                //获取最新一期的开奖数据
                awardDataService.getCurrentAwardResult(function (data) {
                    _nextAwardTime = data.next.awardTime;
                    if (!_currentPeriodNumber || data.current.periodNumber > _currentPeriodNumber) {
                        _currentPeriodNumber = data.current.periodNumber;
                        var today = new Date().format("yyyy-MM-dd");
                        if (data.current.awardTime.format("yyyy-MM-dd") === today) {
                            insertNewAwardResultToTable(data.current);
                        }
                    }
                    startTimedTask();
                    if (success) success();;
                }, function (err) {
                    window.plugins.toast.showLongCenter("获取本期开奖数据失败！");
                });
            }, error);
        }
    };

    return properties;
}();