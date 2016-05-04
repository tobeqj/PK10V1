/**
 * Created by Felix on 2016/4/26.
 */
var pk10 = pk10 || {};
pk10.licenseMgr = function(){
    var _onRegisterSuccess;

    var initWinText = function(){
        $('#licenseWinTitle').text(pk10.msgs.licenseWinTitle);
        $('#licenseWinContent').text(pk10.msgs.licenseWinContent.format(device.uuid, config.qq))
        $('#licenseLabel').text(pk10.msgs.licenseInputLabel);
        $('#btnCopyUuid').text(pk10.msgs.btnCopyUuid);
        $('#btnRegister').text(pk10.msgs.btnRegister);
        $('#btnQuit').text(pk10.msgs.btnExit);
    };

    var initWin = function(){
        initWinText();
        $('#btnCopyUuid').click(onCopyUuidBtnClick);
        $('#btnRegister').click(onRegisterBtnClick);
        $('#btnQuit').click(navigator.app.exitApp);
    };

    var onCopyUuidBtnClick = function(){
        clipboard.copy(
            device.uuid,
            function(r){
                window.plugins.toast.showShortCenter(pk10.msgs.copySuccess);
            },
            function(e){
                window.plugins.toast.showShortCenter(pk10.msgs.copyFailed);
            }
        );
    };

    var onRegisterBtnClick = function(){
        var license = $('#license').val();
        localStorage.license = license;
        if(!license){
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsRequired);
            return;
        }
        var checkResult = licenseService.checkLicense(license);
        if(checkResult.isValid){
            alert(pk10.msgs.registerSuccess.format(checkResult.exirationDate.format("yyyy-MM-dd")));
            $('#licensePopup').popup('close');
            if(_onRegisterSuccess) _onRegisterSuccess();
        } else if(checkResult.exirationDate){
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
        } else {
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsInvalid);
        }
    };

    var openRegisterWin = function(success){
        _onRegisterSuccess = success;
        if($('#licensePopup').length){
            $('#licensePopup').popup('open');
            return;
        }
        $.get('licensePopup.html', function(html){
            var $popup = $(html);
            $popup.appendTo("div[data-role=page]:first");
            $popup.trigger('create');
            $('#licensePopup').popup();
            $('#licensePopup').popup('open');
            initWin();
        });
    };

    var properties = {
        /*
        @function 打开注册弹窗
        @params
        @return
         */
        openRegisterWin: openRegisterWin
    };

    return properties;
}();