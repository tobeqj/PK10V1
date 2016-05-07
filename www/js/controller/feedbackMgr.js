/**
 * Created by wWX247609 on 2016/5/6.
 */
var pk10 = pk10 || {};
pk10.feedbackMgr = function(){

    var initPageText = function(){
        $('#feedbackTitle').text(pk10.msgs.feedbackPageTitle);
        $('#suggestLabel').text(pk10.msgs.suggestLabel);
        $('#btnSendSuggest').text(pk10.msgs.btnSendSuggest);
    };

    var onSendBtnClick = function(){
        var suggest = $('#suggest').val();
        cordova.plugins.email.addAlias('gmail', 'com.google.android.gm');
        cordova.plugins.email.open({
            app: "gmail",
            to: config.email,
            subject: "PK10助手反馈",
            body: suggest
        }, function(){
            debugger;
        });
    };

    var properties = {
        initPage: function(){
            initPageText();
            $('#suggest').val('');
            $('#btnSendSuggest').click(onSendBtnClick);
        }
    };

    return  properties;
}();