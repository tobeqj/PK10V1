var settingService = function() {

    var convertToSettingBatch = function(row) {
        var settingBatch = new SettingBatch(Number(row.cycle), row.modifyTime);
        settingBatch.id = row.id;
        return settingBatch;
    };

    var convertToSetting = function(row) {
        var setting = new Setting(Number(row.num), row.danshuang, row.daxiao, Number(row.batchId));
        return setting;
    };

    var properties = {
        /*
        @function: 获取最后一次的设置数据
        @param
        @return
        */
        getLastSetting: function (success, error) {
            var result = {};
            settingDal.getLastSettingBatch(function (result1) {
                if (result1.rows.length) {
                    var settingBatch = convertToSettingBatch(result1.rows.item(0));
                    result.cycle = settingBatch.cycle;
                    var batchId = settingBatch.id;
                    settingDal.getSettingsByBatchId(batchId, function (result2) {
                        if (result2.rows.length) {
                            var settings = [];
                            for (var i = 0; i < result2.rows.length; i++) {
                                var setting = convertToSetting(result2.rows.item(i));
                                settings.push(setting);
                            }
                            result.settings = settings;
                            if (success) success(result);
                        } else {
                            if (success) success(null);
                        }
                    }, error);
                } else {
                    if (success) success(null);
                }
            }, error);
        },
        /*
        @function: 保存设置数据
        @param
        @return
        */
        saveSetting: function (cycle, settings, success, error) {
            var settingBatch = new SettingBatch(cycle, new Date);
            settingDal.insertSettingBatch(settingBatch,
                function(result) {
                    var batchId = result.insertId;
                    if (typeof (batchId) === "number") {
                        $(settings).each(function() {
                            this.batchId = batchId;
                        });
                        var onSuccess = function() {
                            var logMsg = "更新设置：\n";
                            logMsg += "期数：" + cycle + "\n";
                            $(settings).each(function(n, set) {
                                var danshuang = set.danshuang || "";
                                var daxiao = set.daxiao || "";
                                logMsg += set.num + "：" + danshuang + " " + daxiao + "\n";
                            });
                            logger.log(new Log(logMsg, LogType.operation));

                            if (success) success();
                        };
                        var onError = function() {
                            settingDal.deleteSettingBatch(batchId);
                            if (error) error();
                        };
                        settingDal.insertSettings(settings, onSuccess, onError);
                    } else {
                        if (error) error();
                    }
                },
                function(err) {
                    if (error) error();
                }
            );
        }
    };

    return properties;
}();