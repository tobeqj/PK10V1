var homeService = function() {
    var _nextAwardTime;
    var _currentPeriodNumber;
    var _wrongTimeCounter1;
    var _wrongTimeCounter2;
    var _cycle;
    var _settings;
    var _prevAwardNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var _timer;
    var _timedAction;

    var getWrongTimeCounter = function () {
        var dicNumWrongTime = new Dictionary();

        var existsNum = function (num) {
            var nums = dicNumWrongTime.getKeys();
            var comparator = function (a, b) { return Number(a) === Number(b); };
            return nums.indexOf(num, comparator) >= 0;
        };

        var funcs = {
            getWrongTimes: function (num) {
                if (existsNum(num)) {
                    return dicNumWrongTime.find(num);
                } else {
                    dicNumWrongTime.add(num, 0);
                    return 0;
                }
            },

            addOneTime: function (num) {
                var times = this.getWrongTimes(num);
                dicNumWrongTime.datastore[num] = ++times;
            },

            clear: function (num) {
                dicNumWrongTime.datastore[num] = 0;
            }
        };

        return funcs;
    };
    
    var getTableData = function (success, error) {
        _wrongTimeCounter1 = getWrongTimeCounter();
        _wrongTimeCounter2 = getWrongTimeCounter();
        // 获取今天的开奖历史
        awardDataService.getTodayAwardResults(function (datas) {
            var records = [];
            if (datas.length > 0) {
                _currentPeriodNumber = datas[0].periodNumber;
            }
            // 数据是按倒序排列的，为了计算剩余次数，先反转顺序
            datas.reverse();
            // 遍历结果集构造表格数据;
            $(datas).each(function (i, data) {
                var record = convetToTableRecord(data);
                records.push(record);
            });
            //获取最新一期的开奖数据
            awardDataService.getCurrentAwardResult(function (data) {
                _nextAwardTime = data.next.awardTime;
                if (!_currentPeriodNumber || data.current.periodNumber > _currentPeriodNumber) {
                    _currentPeriodNumber = data.current.periodNumber;
                    var today = new Date().format("yyyy-MM-dd");
                    if (data.current.awardTime.format("yyyy-MM-dd") === today) {
                        // 将近期开奖数据添加到结果集中
                        var record = convetToTableRecord(data.current);
                        records.push(record);
                    }
                }
                // 按倒序排列结果
                records.reverse();
                if (success) success(records);;
            }, function (err) {
                window.plugins.toast.showLongCenter("获取本期开奖数据失败！");
                // 按倒序排列结果
                records.reverse();
                if (success) success(records);
            });
        }, function (err) {
            window.plugins.toast.showLongCenter("获取开奖数据失败，请检查网络是否开启。");
            if (error) error(err);
        });
    };
    
    var timedTask = function () {
        awardDataService.getCurrentAwardResult(function (data) {
            if (data.current.periodNumber > _currentPeriodNumber
                && data.current.awardTime.getTime() >= _nextAwardTime.getTime()) {
                _currentPeriodNumber = data.current.periodNumber;
                _nextAwardTime = data.next.awardTime;
                // 将近期开奖数据添加到结果集中
                var record = convetToTableRecord(data.current);
                if (_timedAction) _timedAction(record);
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

    // 将开奖数据转化成表格记录数据
    var convetToTableRecord = function (currentAwardData) {
        var record = {};
        record.awardResult = currentAwardData;
        record.rows = [];
        var currentAwardNumbers = currentAwardData.awardNumbers;
        $(_settings).each(function (j, setting) {
            var num = setting.num;
            var prevPosition = awardDataService.getNumPosition(_prevAwardNums, num);
            var currentPosition = awardDataService.getNumPosition(currentAwardNumbers, num);
            var resultDanshuang = awardDataService.isDan(currentAwardNumbers, prevPosition) ? "单" : "双";
            var resultDaxiao = awardDataService.isXiao(currentAwardNumbers, prevPosition) ? "小" : "大";

            var rightDanshuang;
            var remainedTimesDanShuang;
            if (setting.danshuang) {
                rightDanshuang = setting.danshuang === resultDanshuang;
                if (rightDanshuang) {
                    _wrongTimeCounter1.clear(num);
                    remainedTimesDanShuang = 0;
                } else {
                    _wrongTimeCounter1.addOneTime(num);
                    var wrongTimes1 = _wrongTimeCounter1.getWrongTimes(num);
                    remainedTimesDanShuang = _cycle - wrongTimes1;
                    if (remainedTimesDanShuang === 0) {
                        _wrongTimeCounter1.clear(num);
                    }
                }
            }

            var rightDaxiao;
            var remainedTimesDaxiao;
            if (setting.daxiao) {
                rightDaxiao = setting.daxiao === resultDaxiao;
                if (rightDaxiao) {
                    _wrongTimeCounter2.clear(num);
                    remainedTimesDaxiao = 0;
                } else {
                    _wrongTimeCounter2.addOneTime(num);
                    var wrongTimes2 = _wrongTimeCounter2.getWrongTimes(num);
                    remainedTimesDaxiao = _cycle - wrongTimes2;
                    if (remainedTimesDaxiao === 0) {
                        _wrongTimeCounter2.clear(num);
                    }
                }
            }

            var row = {
                num: num,
                position: currentPosition,
                resultDanshuang: resultDanshuang,
                resultDaxiao: resultDaxiao,
                settingDanshuang: setting.danshuang,
                settingDaxiao: setting.daxiao,
                rightDanshuang: rightDanshuang,
                rightDaxiao: rightDaxiao,
                remainedTimesDanshuang: remainedTimesDanShuang,
                remainedTimesDaxiao: remainedTimesDaxiao
            };
            record.rows.push(row);
        });
        _prevAwardNums = currentAwardNumbers;
        return record;
    };
    
    var properties = {
        /*
        @function 获取表格数据
        @param
        @return
        */
        getTableData: function(setting, success, error) {
            _cycle = setting.cycle;
            _settings = setting.settings;
            return getTableData(success, error);
        },
        /*
        @function 开启定时获取最新数据任务
        @param
        @return
        */
        startTimedTask: function(timedAction) {
            _timedAction = timedAction;
            startTimedTask();
        }
    };

    return properties;
}();