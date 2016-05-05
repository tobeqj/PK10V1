/**
 * Created by wWX247609 on 2016/5/5.
 */
var dialogUtil = function(){

    var getAlertDialog = function(callback){
        if($('#alert-dialog').length){
            callback($('#alert-dialog'));
        } else{
            $.get('alertDialog.html', function(html){
                var $dialog = $(html);
                $dialog.appendTo("div[data-role=page]:first");
                $dialog.trigger('create');
                $dialog.dialog();
                callback($dialog);
            });
        }
    };

    var alert = function(title, content){
        getAlertDialog(function($dialog){
            $('#alert-title').text(title);
            $('#alert-content').text(content);
            $dialog.dialog('open');
        });
    };

    var properties = {
        alert: alert
    };

    return properties;
}();