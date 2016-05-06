/**
 * Created by wWX247609 on 2016/5/5.
 */
var dialogUtil = function(){

    var getAlertDialog = function(callback, afterClose){
        if($('#alert-popup').length){
            callback($('#alert-popup'));
        } else{
            $.get('alertPopup.html', function(html){
                var $dialog = $(html);
                $dialog.appendTo("div[data-role=page]:first");
                $dialog.trigger('create');
                $dialog.popup({ afterclose: afterClose });
                callback($dialog);
            });
        }
    };

    var alert = function(title, content, afterClose){
        getAlertDialog(function($dialog){
            $('#alert-title').text(title);
            $('#alert-content').text(content);
            $dialog.popup('open');
        }, afterClose);
    };

    var properties = {
        alert: alert
    };

    return properties;
}();