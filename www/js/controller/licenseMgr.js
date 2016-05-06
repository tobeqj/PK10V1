/**
 * Created by Felix on 2016/4/26.
 */
var pk10 = pk10 || {};
pk10.licenseMgr = function(){
    var _onRegisterSuccess;
    var _exirationDate;

    // 过期检测
    timedTaskService.addTask(function(){
        if(_exirationDate){
            if(new Date().getTime() >= _exirationDate.getTime() && $('#register-popup').is(':hidden')){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
                openRegisterWin();
            }
        } else {
            var license = localStorage.license;
            if(!license) return;
            var checkResult = licenseService.checkLicense(license);
            if(checkResult.exirationDate){
                _exirationDate = checkResult.exirationDate;
                config.exirationDate = _exirationDate;
            }
        }
    });

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
            registerSuccess();
        } else if(checkResult.exirationDate){
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
        } else {
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsInvalid);
        }
    };

    var registerSuccess = function(){
        $('#register-popup').popup('close');
        setTimeout(function(){
            var msg = pk10.msgs.registerSuccess.format(checkResult.exirationDate.format("yyyy-MM-dd"));
            dialogUtil.alert(pk10.msgs.registerSuccessTitle, msg, _onRegisterSuccess);
        }, 100);
    };

    var initDialogText = function(){
        $('#register-title').text(pk10.msgs.registerTitle);
        $('#register-content').text(pk10.msgs.registerContent.format(device.uuid, config.qq))
        $('#licenseLabel').text(pk10.msgs.licenseInputLabel);
        $('#btnCopyUuid').text(pk10.msgs.btnCopyUuid);
        $('#btnRegister').text(pk10.msgs.btnRegister);
        $('#btnQuit').text(pk10.msgs.btnExit);
    };

    var initDialog = function(){
        initDialogText();
        $('#btnCopyUuid').click(onCopyUuidBtnClick);
        $('#btnRegister').click(onRegisterBtnClick);
        $('#btnQuit').click(navigator.app.exitApp);
    };

    var openRegisterDialog = function(success){
        _onRegisterSuccess = success;
        dialogUtil.getDialog('register-popup', 'register.html', function($popup){
            initDialog();
            $popup.popup('open');
        });
    };

    var properties = {
        /*
        @function 打开注册弹窗
        @params
        @return
         */
        openRegisterDialog: openRegisterDialog
    };

    return properties;
}();