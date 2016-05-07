var Log = function(msg, type) {
    this.msg = msg;
    this.type = type;
};

var LogType = {
    error: "error",
    operation: "operation",
    debug: "debug"
}