var settingDal = function () {
    var tableName1 = "Setting";
    var tableName2 = "SettingBatch";
    var isTable1Ready = false;
    var isTable2Ready = false;
    
    document.addEventListener("deviceready", function () {
        var createTable1 = function() {
            dbHelper.createTable(tableName1, ["num", "danshuang", "daxiao", "batchId"], function() {
                isTable1Ready = true;
            });
        };
        var createTable2 = function() {
            dbHelper.createTable(tableName2, ["cycle", "modifyTime"], function() {
                isTable2Ready = true;
            });
        };
        dbHelper.existsTable(tableName1, function(exist) {
            if (!exist) {
                createTable1();
            } else {
                isTable1Ready = true;
            }
        }, function(err) {
            createTable1();
        });
        dbHelper.existsTable(tableName2, function(exist) {
            if (!exist) {
                createTable2();
            } else {
                isTable2Ready = true;
            }
        }, function(err) {
            createTable2();
        });
    });

    var executeAction = function(table, action) {
        var isReady = false;
        switch (table) {
        case tableName1:
            isReady = isTable1Ready;
            break;
        case tableName2:
            isReady = isTable2Ready;
            break;
        }
        if (isReady) {
            action();
        } else {
            setTimeout(function() {
                executeAction(table, action);
            }, 500);
        }
    };

    var properties = {
        /*
        @function 插入Setting记录
        @param 
        @return
        */
        insertSettings: function (settings, success, error) {
            var action = function() {
                var successCount = 0;
                var results = [];
                var onSuccess = function(result) {
                    results.push(result);
                    if (++successCount == settings.length) {
                        success(results);
                    }
                };
                for (var i = 0 ; i < settings.length; i++) {
                    var setting = settings[i];
                    var dicValues = new Dictionary();
                    for (var key in setting) {
                        dicValues.add(key, setting[key]);
                    }
                    dbHelper.insert(tableName1, dicValues, onSuccess, error);
                }
            };
            executeAction(tableName1, action);
        },
        /*
        @function 插入SettingBatch记录
        @param
        @return
        */
        insertSettingBatch: function (settingBatch, success, error) {
            var action = function() {
                var dicValues = new Dictionary();
                for (var key in settingBatch) {
                    dicValues.add(key, settingBatch[key]);
                }
                dbHelper.insert(tableName2, dicValues, success, error);
            };
            executeAction(tableName2, action);
        },
        /*
        @function 根据id删除SettingBatch记录
        @param
        @return
        */
        deleteSettingBatch: function (id, success, error) {
            var action = function() {
                var where = "id=" + id;
                dbHelper.remove(tableName2, where, success, error);
            };
            executeAction(tableName2, action);
        },
        /*
        @function 根据批次id获取Setting记录
        @param
        @return
        */
        getSettingsByBatchId: function (batchId, success, error) {
            var action = function() {
                var where = "batchId='" + batchId + "'";
                dbHelper.query(tableName1, { where: where }, success, error);
            };
            executeAction(tableName1, action);
        },
        /*
        @function 获取指定日期的所有SettingBatch记录
        @param
        @return
        */
        getSettingBatchByDate: function (date, success, error) {
            var action = function() {
                var year = date.getYear();
                var month = date.getMonth();
                var day = date.getDate();
                var from = year + "-" + month + "-" + day;
                var to = year + "-" + month + "-" + (++day);
                var where = "modifyTime BETWEEN '{0}' AND '{1}'".format(from, to);
                dbHelper.query(tableName2, { where: where }, success, error);
            };
            executeAction(tableName2, action);
        },
        /*
        @function 获取最后一次插入的SettingBatch记录
        @param
        @return
        */
        getLastSettingBatch: function (success, error) {
            var action = function() {
                dbHelper.query(tableName2, {
                    where: "",
                    top: 1,
                    order: "modifytime",
                    desc: true
                }, success, error);
            };
            executeAction(tableName2, action);
        }
    };

    return properties;
}();