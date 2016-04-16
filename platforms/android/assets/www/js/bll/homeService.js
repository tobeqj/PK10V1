var homeService = function() {

    var _nextAwardTime;
    var _currentPeriodNumber;
    var _wrongTimeCounter;

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

    // 将开奖数据转化成表格记录数据
    var convetToTableRecord = function (awardData) {
        var record = {};
        record.awardResult = awardData;
        record.rows = [];
        $(_settings).each(function (j, setting) {
            var num = setting.num;
            var awardNumbers = awardData.awardNumbers;
            var resultDanshuang = awardDataService.isDan(awardNumbers, num) ? "单" : "双";
            var resultDaxiao = awardDataService.isXiao(awardNumbers, num) ? "小" : "大";
            var right = !setting.danshuang || setting.danshuang === resultDanshuang;
            right &= !setting.daxiao || setting.daxiao === resultDaxiao;
            var remainedTimes;
            if (right) {
                _wrongTimeCounter.clear(num);
                remainedTimes = 0;
            } else {
                _wrongTimeCounter.addOneTime(num);
                var wrongTimes = _wrongTimeCounter.getWrongTimes(num);
                remainedTimes = _cycle - wrongTimes;
                if (remainedTimes === 0) {
                    _wrongTimeCounter.clear(num);
                }
            }
            var row = {
                num: num,
                resultDanshuang: resultDanshuang,
                resultDaxiao: resultDaxiao,
                settingDanshuang: setting.danshuang,
                settingDaxiao: setting.daxiao,
                right: right,
                remainedTimes: remainedTimes
            };
            record.rows.push(row);
        });
        return record;
    };

    var getTableData = function (success, error) {
        _wrongTimeCounter = getWrongTimeCounter();
        // 获取今天的开奖历史
        awardDataService.getTodayAwardResults(function (datas) {
            var records = [];
            if (datas.length > 0) {
                _currentPeriodNumber = datas[0].periodNumber;
            }
            // 数据是按倒序排列的，为了计算剩余次数，先反转顺序
            datas.reverse();
            // 遍历结果集构造表格数据
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

    var properties = {        
        
    };

    return properties;
}();