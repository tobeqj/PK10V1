var awardDataService = function() {
    var url1 = "http://www.cp686.cc/pk10/getPk10AwardTimes.do?ajaxhandler=GetPk10AwardTimes";
    var url2 = "http://www.cp686.cc/pk10/kaijiang.do?date=";
    var dan = [1, 3, 5, 7, 9];
    var shuang = [2, 4, 6, 8, 10];
    var da = [6, 7, 8, 9, 10];
    var xiao = [1, 2, 3, 4, 5];

    // 获取指定日期的所有开奖记录
    var getAwardDataByDate = function(date, success, error) {
        var url = url2 + date.format('yyyy-MM-dd');
        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data && data.success) {
                    var results = [];
                    var convertToAwardResult = function (row) {
                        var periodNumber = Number(row.termNum);
                        var awardTime = new Date(row.lotteryTime);
                        var awardNumbers = [];
                        for (var i = 1; i <= 10; i++) {
                            var num = Number(row["n" + i]);
                            awardNumbers.push(num);
                        }
                        return new AwardResult(periodNumber, awardTime, awardNumbers);
                    };
                    if(data.rows){
                        $(data.rows).each(function(i, row) {
                            var result = convertToAwardResult(row);
                            results.push(result);
                        });
                    }
                    if (success) success(results);
                } else {
                    var msg = "调用接口{0}获取数据失败！\n".format(url);
                    msg += "返回数据：" + JSON.stringify(data);
                    logger.log(new Log(msg, LogType.error));
                    if(error) error(data);
                }
            },
            error: function(err) {
                var msg = "调用接口{0}时发生错误！\n".format(url);
                msg += "错误信息：" + JSON.stringify(err);
                logger.log(new Log(msg, LogType.error));
                if (error) error(err);
            }
        });
    };
    
    // 获取本期的开奖记录
    var getCurrentAwardData = function(success, error) {
        $.ajax({
            url: url1,
            type: 'get',
            dataType: 'json',
            success: function(data) {
                if (data && data.current) {
                    if (success) success(data);
                } else {
                    var msg = "调用接口{0}获取数据失败！\n".format(url1);
                    msg += "返回数据：" + JSON.stringify(data);
                    logger.log(new Log(msg, LogType.error));
                    error(data);
                }
            },
            error: function(err) {
                var msg = "调用接口{0}时发生错误！\n".format(url1);
                msg += "错误信息：" + JSON.stringify(err);
                logger.log(new Log(msg, LogType.error));
                if (error) error(err);
            }
        });
    };
    
    // 获取指定位置的数字
    var getNumByPosition = function(awardNumbers, position) {
        return awardNumbers[position - 1];
    };
    
    var properties = {
        /*
        @function 获取指定日期的开奖数据
        @param
        @return
         */
        getAwardResultsByDate: function(date, success, error){
            getAwardDataByDate(date, success, error);
        },
        /*
        @function 获取指定日期最后一期开奖数据
        @param
        @return
         */
        getLastAwardResultByDate:function(date, success, error){
            getAwardDataByDate(date, function (results) {
                var lastAwardResult = null;
                if(results.length){
                    lastAwardResult = results.pop();
                }
                if (success) success(lastAwardResult);
            }, error);
        },
        /*
        @function 获取最新一期开奖数据
        @param
        @return
        */
        getCurrentAwardResult: function(success, error) {
            getCurrentAwardData(function(data) {
                var result = {};
                result.current = new AwardResult();
                result.current.awardTime = new Date(data.current.awardTime);
                result.current.periodNumber = Number(data.current.periodNumber);
                result.current.awardNumbers = [];
                var strNums = data.current.awardNumbers.split(',');
                for (var i = 0; i < strNums.length; i++) {
                    var num = Number(strNums[i]);
                    result.current.awardNumbers.push(num);
                }
                result.next = new AwardResult();
                result.next.awardTime = new Date(data.next.awardTime);
                result.next.periodNumber = Number(data.next.periodNumber);
                if (success) success(result);
            }, error);
        },
        /*
        @function 获取指定号码的位置
        @param
        @return
        */
        getNumPosition: function(awardNumbers, num) {
            var index = awardNumbers.indexOf(num, function (a, b) { return a === b; });
            var position = index + 1;
            return position;
        },
        /*
        @function 判断是否是单
        @param
        @return
        */
        isDan: function (awardNumbers, position) {
            var num = getNumByPosition(awardNumbers, position);
            return dan.indexOf(num) >= 0;
        },
        /*
        @function 判断是否是双
        @param
        @return
        */
        isShuang: function (awardNumbers, position) {
            var num = getNumByPosition(awardNumbers, position);
            return shuang.indexOf(num) >= 0;
        },
        /*
        @function 判断是否是小
        @param
        @return
        */
        isXiao: function (awardNumbers, position) {
            var num = getNumByPosition(awardNumbers, position);
            return xiao.indexOf(num) >= 0;
        },
        /*
        @function 判断是否是小
        @param
        @return
        */
        isDa: function (awardNumbers, position) {
            var num = getNumByPosition(awardNumbers, position);
            return da.indexOf(num) >= 0;
        },
    };

    return properties;
}();