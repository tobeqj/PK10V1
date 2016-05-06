/**
 * Created by wWX247609 on 2016/5/5.
 */
var dialogUtil = function(){

    var alert = function(title, content, afterClose){
        getDialog('alert-popup', 'alertPopup.html', function($dialog){
            $('#alert-title').text(title);
            $('#alert-content').text(content);
            $dialog.popup('open');
        }, afterClose);
    };

    var getDialog = function(dialogId, source, callback, afterClose){
        var $popup = $('#' + dialogId);
        if($popup.length) {
            callback($popup);
        } else{
            $.get(source, function(html){
                $popup = $(html);
                $popup.appendTo("div[data-role=page]:first");
                $popup.trigger('create');
                $popup.popup({ afterclose: afterClose });
                callback($popup);
            });
        }
    };

    var properties = {
        alert: alert,
        getDialog: getDialog
    };

    return properties;
}();