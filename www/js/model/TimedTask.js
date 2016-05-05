/**
 * Created by wWX247609 on 2016/5/5.
 */
var TimedTask = function(action){
    this.action = action;
    this.id = Guid.NewGuid();
};