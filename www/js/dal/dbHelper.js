var dbHelper = function () {
    var database;

    var getDb = function(success, fail) {
        if (database) {
            if (success) success(database);
            return;
        }

        try {
            database = window.openDatabase("PK10Database", "1.0", "PK10 Database", 1024 * 1024);
            if (success) success(database);
        } catch(ex) {
            if (fail) fail(ex);
        }
    };

    document.addEventListener("deviceready", getDb);

    var properties = {
        /*
        @function 执行一条SQL语句
        @param 
        @return
        */
        executeSql: function (sql, params, success, error) {
            getDb(function(db) {
                var onError = function () {
                    var err;
                    $(arguments).each(function (i, argument) {
                        if (argument.constructor.name === "SQLError") {
                            err = argument;
                        }
                    });

                    var logMsg = "执行该SQL语句时出错：" + sql + "\n";
                    logMsg += "Error Code：" + err.code + "\n";
                    logMsg += "Error Msg：" + err.message;
                    logger.log(new Log(logMsg, LogType.error));

                    if (error) error(err);
                };
                var onSuccess = function () {
                    var result;
                    $(arguments).each(function (i, argument) {
                        if (argument.constructor.name === "SQLResultSet") {
                            result = argument;
                        }
                    });
                    if (success) success(result);
                };
                db.transaction(function (tx) {
                    tx.executeSql(sql, params, onSuccess, onError);
                });
            }, error);
        },
        /*
        @function 执行多条SQL语句
        @param 
        @return
        */
        executeSqls: function (sqls, success, error) {
            getDb(function(db) {
                db.transaction(function (tx) {
                    $(sqls).each(function (i, sql) {
                        tx.executeSql(sql);
                    });
                }, error, success);
            }, error);
        },
        /*
        @function 判断表是否存在
        @param 
        @return
        */
        existsTable: function (table, success, error) {
            var sql = "SELECT COUNT(*) FROM sqlite_master where type='table' and name='{0}'".format(table);
            var onSuccess = function (result) {
                var exist = false;
                if (result.rows.length) {
                    var count = result.rows.item(0)["COUNT(*)"];
                    exist = count > 0;
                }
                if (success) success(exist);
            };
            this.executeSql(sql, [], onSuccess, error);
        },
        /*
        @function 创建表（如果表不存在）
        @param 
        @return
        */
        createTable: function (tableName, fields, success, error) {
            var sql = 'CREATE TABLE IF NOT EXISTS {0} (id integer primary key AutoIncrement,{1})'.format(tableName, fields.join(','));
            var onSuccess = function (result) {
                var logMsg = "创建表" + tableName;
                logger.log(new Log(logMsg, LogType.operation));
                if (success) success(result);
            };
            this.executeSql(sql, [], onSuccess, error);
        },
        /*
        @function 删除表（如果表存在）
        @param 
        @return
        */
        dropTable: function (tableName, success, error) {
            var sql = 'DROP TABLE IF EXISTS ' + tableName;
            var onSuccess = function (result) {
                var logMsg = "删除表" + tableName;
                logger.log(new Log(logMsg, LogType.operation));
                if (success) success(result);
            };
            this.executeSql(sql, [], onSuccess, error);
        },
        /*
        @function 插入记录
        @param 
        @return
        */
        insert: function (tableName, dicValues, success, error) {
            var keys = dicValues.getKeys();
            var values = dicValues.getValues();
            var sql = "INSERT INTO {0} ({1}) VALUES ('{2}')".format(tableName, keys.join(","), values.join("','"));
            this.executeSql(sql, [], success, error);
        },
        /*
        @function 查询记录
        @param 
        @return
        */
        query: function (tableName, params, success, error) {
            var sql = "SELECT * FROM " + tableName;
            if (params && params.where) {
                sql += " WHERE " + params.where;
            }
            if (params && params.order) {
                if (params.desc) {
                    sql += " ORDER BY " + params.order + " DESC";
                } else {
                    sql += " ORDER BY " + params.order;
                }
            }
            if (params && params.top) {
                sql += " LIMIT " + params.top;
            }
            this.executeSql(sql, [], success, error);
        },
        /*
        @function 删除记录
        @param 
        @return
        */
        remove: function (tableName, where, success, error) {
            var sql = 'DELETE FROM ' + tableName;
            if (where) sql += ' WHERE ' + where;
            this.executeSql(sql, [], success, error);
        },
        /*
        @function 更新记录
        @param 
        @return
        */
        update: function (tableName, dicValues, where, success, error) {
            if (!dicValues.datastore.length) return;
            var sql = 'UPDATE ' + tableName + " SET ";
            var keys = dicValues.getKeys();
            var setSqls = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = dicValues.find(key);
                setSqls.push("{0}='{1}'".format(key, value));
            }
            sql += setSqls.join(',');
            if (where) sql += ' WHERE ' + where;
            this.executeSql(sql, [], success, error);
        },
    };

    return properties;
}();