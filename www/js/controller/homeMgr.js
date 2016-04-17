var pk10 = pk10 || {};
pk10.homeMgr = function () {
    var CN_NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    var NUM_BALL = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

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
        initPage: function (setting, loaded, error) {
            var $tbody = $('#tbTodayResult tbody');
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
            homeService.getTableData(setting, function (tbData) {
                var $trs = createTableRows(tbData);
                if ($trs.length) {
                    $tbody.append($trs);
                } else {
                    var $tr = $('<tr></tr>');
                    var $td = $('<td colspan="8"></td>');
                    $td.text("还没有开奖记录！");
                    $tr.append($td);
                    $tbody.append($tr);
                }
                homeService.timedGetData(function(record){
                    // 往表格里插入行
                    var $trs = createTableRow(record);
                    $tbody.prepend($trs);
                });
                if (loaded) loaded();
            }, error);
        }
    };

    return properties;
}();