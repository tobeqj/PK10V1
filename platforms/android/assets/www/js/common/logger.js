var logger = function () {
    var optLogFilePath = "/log/opt.log";
    var errorLogFilePath = "/log/error.log";
    var debugLogFilePath = "/log/debug.log";

    var getLogFilePath = function(logType) {
        switch (logType) {
            case LogType.operation:
                return optLogFilePath;
            case LogType.error:
                return errorLogFilePath;
            case LogType.debug:
                return debugLogFilePath;
            default:
                return null;
        }
    };

    var properties = {        
        log: function (log) {
            fileHelper.createDirectory("log", function() {
                // 写入文件
                var content = new Date().toLocaleString() + '\n';
                content += log.msg + '\n\n';
                fileHelper.writeTextToFile(getLogFilePath(log.type), content,
                    function () {
                        debugger;
                    },
                    function () {
                        debugger;
                    }
                );
            });
        }
    };

    return properties;
}()