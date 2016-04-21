var homeService = function() {
    var _nextAwardTime = new Date;
    var _currentPeriodNumber = 0;
    var _isTableInited = false;
    var _tableService = awardTableService.newInstance;
    var _timer;

    var insertNewAwardResultToTable = function(awardResult) {
        var $tr = _tableService.createTableRow(awardResult);
        $('#tbTodayResult tbody').prepend($tr);
    }

    var updateCurrentAwardInfo = function(data){
        var awardNumbers = data.current.awardNumbers;
        var $balls = $('#currentAwardNumbers').children();
        $(awardNumbers).each(function(i, num){
                $balls[i].className = "no" + num;
        });
        $('#periodNumber').text(data.current.periodNumber);
    }

    var updateNextTimeInfo = function(){
        var timeSpan = Date.getTimeSpan(new Date(), _nextAwardTime);
        var hours = timeSpan.days ? timeSpan.days * 24 + timeSpan.hours : timeSpan.hours;
        var strHours = hours.toString();
        var strMinutes = timeSpan.minutes.toString();
        var strSeconds = timeSpan.seconds.toString();
        if(strHours.length == 1) strHours = "0" + strHours;
        if(strMinutes.length == 1) strMinutes = "0" + strMinutes;
        if(strSeconds.length == 1) strSeconds = "0" + strSeconds;
        $('#hours').text(strHours);
        $('#minutes').text(strMinutes);
        $('#seconds').text(strSeconds);
    }

    var onAwardDataUpdate = function(data){
        insertNewAwardResultToTable(data.current);
        updateCurrentAwardInfo(data);
    }

    var startTimedTask = function () {
        clearTimedTask();
        _timer = setInterval(function () {
            if(!_isTableInited) return;
            var currentTime = new Date();
            if (currentTime.getTime() >= _nextAwardTime.getTime()) {
                $('#currentAwardNumbers').hide();
                $('#waittingMsg').show();
                awardDataService.getCurrentAwardResult(function (data) {
                    if (data.current.periodNumber > _currentPeriodNumber
                        && data.current.awardTime.getTime() >= _nextAwardTime.getTime()) {
                        _currentPeriodNumber = data.current.periodNumber;
                        _nextAwardTime = data.next.awardTime;
                        $('#currentAwardNumbers').show();
                        $('#waittingMsg').hide();
                        onAwardDataUpdate(data);
                    }
                });
            } else{
                updateNextTimeInfo();
            }
        }, 1000);
    };

    var clearTimedTask = function(){
        if (_timer) clearInterval(_timer);
    }
    
    var properties = {
        initTable: function(success, error){
            _isTableInited = false;
            _tableService.initTable(new Date, $('#tbTodayResult'), function(currentAwardResult){
                _currentPeriodNumber = currentAwardResult.periodNumber;
                //获取最新一期的开奖数据
                awardDataService.getCurrentAwardResult(function (data) {
                    _nextAwardTime = data.next.awardTime;
                    if (data.current.periodNumber > _currentPeriodNumber) {
                        _currentPeriodNumber = data.current.periodNumber;
                        var today = new Date().format("yyyy-MM-dd");
                        if (data.current.awardTime.format("yyyy-MM-dd") === today) {
                            insertNewAwardResultToTable(data.current);
                        }
                    }
                    _isTableInited = true;
                    if (success) success();;
                }, function (err) {
                    window.plugins.toast.showLongCenter("获取本期开奖数据失败！");
                    if(error) error(err);
                });
            }, error);
        },
        initCurrentAwardInfo: function(){
            awardDataService.getCurrentAwardResult(function (data) {
                updateCurrentAwardInfo(data);
            });
        },
        strartTimedUpdateData: startTimedTask
    };

    return properties;
}();