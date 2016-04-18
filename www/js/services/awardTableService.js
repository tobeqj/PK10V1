/**
 * Created by Felix on 2016/4/17.
 */
var awardTableService = function(){
    var createInstance = function(){
        var _wrongTimeCounter1;
        var _wrongTimeCounter2;
        var _cycle;
        var _settings;
        var _date;
        var _prevAwardNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var CN_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        var NUM_BALL = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

        // 创建错误次数计数器
        var createWrongTimeCounter = function () {
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

        // 获取表格数据
        var getTableData = function (success, error) {
            _wrongTimeCounter1 = createWrongTimeCounter();
            _wrongTimeCounter2 = createWrongTimeCounter();
            // 获取指定日期的开奖历史
            var getAwardResultsByDate = function(){
                awardDataService.getAwardResultsByDate(_date, function (datas) {
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
                    // 按倒序排列结果
                    records.reverse();
                    if (success) success(records);
                }, function (err) {
                    debugger;
                    window.plugins.toast.showLongCenter("获取开奖数据失败，请检查网络是否开启。");
                    if (error) error(err);
                });
            };
            // 获取前一日最后一期的数据
            var prevDate = _date.addDays(-1);
            awardDataService.getLastAwardResultByDate(prevDate, function(result){
                if(result && result.awardNumbers){
                    _prevAwardNums = result.awardNumbers;
                }
                getAwardResultsByDate();
            }, function(){
                getAwardResultsByDate();
            });

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

        var createTableRows = function(records) {
            var $trs = [];
            $(records).each(function(i, record) {
                $trs = $trs.concat(createTableRow(record));
            });
            return $trs;
        };

        var createTableRow = function (record) {
            var $trs = [];
            $(record.rows).each(function (i, row) {
                var $tr = $('<tr></tr>');
                if (i == 0) {
                    var $td1 = $('<td></td>');
                    $td1.attr('rowspan', record.rows.length);
                    $td1.text(record.awardResult.periodNumber);
                    $tr.append($td1);
                }
                var $td2 = $('<td></td>');
                var $td3 = $('<td></td>');
                var $td4 = $('<td></td>');
                var $td5 = $('<td></td>');
                var $td6 = $('<td></td>');
                var $td7 = $('<td></td>');
                $td2.text(row.num);
                $td3.text("第{0}位".format(CN_NUMS[row.position - 1]));
                $td4.text(row.resultDanshuang);
                if (row.rightDanshuang != undefined) {
                    $td5.text(row.rightDanshuang ?
                        "中" : "错，还剩{0}次".format(row.remainedTimesDanshuang));
                }
                $td6.text(row.resultDaxiao);
                if (row.rightDaxiao != undefined) {
                    $td7.text(row.rightDaxiao ?
                        "中" : "错，还剩{0}次".format(row.remainedTimesDaxiao));
                }
                $tr.append($td2);
                $tr.append($td3);
                $tr.append($td4);
                $tr.append($td5);
                $tr.append($td6);
                $tr.append($td7);
                if (i == 0) {
                    var balls = [];
                    for (var j = 0; j < record.awardResult.awardNumbers.length; j++) {
                        var num = record.awardResult.awardNumbers[j];
                        var ball = NUM_BALL[num - 1];
                        balls.push(ball);
                    }
                    var $td8 = $('<td></td>');
                    $td8.attr('rowspan', record.rows.length);
                    var $btn = $('<a></a>');
                    $btn.attr('href', '#detailsPopup');
                    $btn.attr('data-rel', 'popup');
                    $btn.attr('data-transition', 'pop');
                    $btn.addClass('ui-btn');
                    $btn.addClass('ui-icon-comment');
                    $btn.addClass('ui-btn-icon-notext');
                    $btn.addClass('ui-corner-all');
                    $btn.click(function () {
                        var $p = $('<p></p>');
                        $p.text(balls.join(''));
                        $('#detailsPopup').empty();
                        $('#detailsPopup').append($p);
                    });
                    $td8.append($btn);
                    $tr.append($td8);
                }
                $trs.push($tr);
            });
            return $trs;
        };

        var properties = {
            /*
             @function 获取表格数据
             @param
             @return
             */
            initTable: function(setting, date, $table, success, error) {
                _cycle = setting.cycle;
                _settings = setting.settings;
                _date = date;
                $tbody = $table.find('tbody');
                $tbody.empty();
                if (!setting || !setting.settings) {
                    var $tr = $('<tr></tr>');
                    var $td = $('<td colspan="8"></td>');
                    $td.text("请先到设置页面填写设置信息！");
                    $tr.append($td);
                    $tbody.append($tr);
                    if (loaded) loaded();
                    return;
                }
                getTableData(function(tbData){
                    var $trs = createTableRows(tbData);
                    if ($trs.length) {
                        $tbody.append($trs);
                    } else {
                        var $tr = $('<tr></tr>');
                        var $td = $('<td colspan="8"></td>');
                        $td.text("没有开奖记录！");
                        $tr.append($td);
                        $tbody.append($tr);
                    }
                    var lastAwardResult;
                    if(tbData.length){
                        lastAwardResult = tbData[0].awardResult;
                    }
                    if(success) success(lastAwardResult);
                }, error);
            },
            /*
             @function 创建表格行
             @param
             @return
             */
            createTableRow: function(awardResult){
                // 将近期开奖数据添加到结果集中
                var record = convetToTableRecord(awardResult);
                var $tr = createTableRow(record);
                return $tr;
            }
        };

        return properties;
    };

    return {
        get newInstance(){
            return createInstance();
        }
    }
}();