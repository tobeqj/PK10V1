/**
 * Created by wWX247609 on 2016/5/5.
 */
var timedTaskService = function(){
    var _tasks = {};

    var addTask = function(action){
        var task = new TimedTask(action);
        _tasks[task.id] = task;
        return task.id;
    };

    var removeTask = function(taskid){
        delete _tasks[taskid];
    };

    setInterval(function(){
        for(var taskid in _tasks){
            var task = _tasks[taskid];
            if(typeof task.action == "function"){
                task.action();
            }
        }
    }, 1000);

    var properties = {
        addTask: addTask,
        removeTask: removeTask
    };

    return properties;
}();