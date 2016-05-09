/**
 * Created by Felix on 2016/4/26.
 */
var pk10 = pk10 || {};
pk10.licenseMgr = function(){
    var _exirationDate;

    var getExirationDate = function(){
        if(_exirationDate) return _exirationDate;
        var license = localStorage.license;
        if(!license) return;
        var checkResult = licenseService.checkLicense(license);
        if(checkResult.exirationDate){
            updateExirationDate(checkResult.exirationDate);
        }
        return _exirationDate;
    };

    var updateExirationDate = function(exirationDate){
        _exirationDate = exirationDate;
        config.exirationDate = exirationDate;
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

    var registerDialog = function(){
        var _onRegisterSuccess;
        var _isOpenning = false;

        var registerSuccess = function(exirationDate){
            var license = $('#license').val();
            localStorage.license = license;
            $('#register-popup').popup('close');
            updateExirationDate(exirationDate);
            setTimeout(function(){
                var msg = pk10.msgs.registerSuccess.format(exirationDate.format("yyyy-MM-dd"));
                dialogUtil.alert(pk10.msgs.registerSuccessTitle, msg, _onRegisterSuccess);
            }, 100);
        };

        var onRegisterBtnClick = function(){
            var license = $('#license').val();
            if(!license){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsRequired);
                return;
            }
            var checkResult = licenseService.checkLicense(license);
            if(checkResult.isValid){
                registerSuccess(checkResult.exirationDate);
            } else if(checkResult.exirationDate){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
            } else {
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsInvalid);
            }
        };

        var initDialogText = function(){
            $('#register-title').text(pk10.msgs.registerTitle);
            $('#register-content').text(pk10.msgs.registerContent.format(device.uuid, config.qq));
            $('#licenseLabel').text(pk10.msgs.licenseInputLabel);
            $('#btnCopyUuid').text(pk10.msgs.btnCopyUuid);
            $('#btnRegister').text(pk10.msgs.btnRegister);
            $('#btnQuit').text(pk10.msgs.btnExit);
        };

        var initDialog = function(){
            initDialogText();
            $('#license').val('');
            $('#btnCopyUuid').click(onCopyUuidBtnClick);
            $('#btnRegister').click(onRegisterBtnClick);
            $('#btnQuit').click(navigator.app.exitApp);
        };

        var openDialog = function(success){
            _onRegisterSuccess = success;
            dialogUtil.getDialog('register-popup', 'register.html', function($popup){
                initDialog();
                $popup.popup('open');
                _isOpenning = true;
            }, function(){
                _isOpenning = false;
            });
        };

        return {
            openDialog: openDialog,
            get isOpenning(){
                return _isOpenning;
            }
        };
    }();

    var renewedDialog = function(){
        var _onRegisterSuccess;
        var _isOpenning;
        var _showExitBtn;

        var registerSuccess = function(exirationDate){
            var license = $('#renewed-license').val();
            localStorage.license = license;
            $('#renewed-popup').popup('close');
            updateExirationDate(exirationDate);
            setTimeout(function(){
                var msg = pk10.msgs.registerSuccess.format(exirationDate.format("yyyy-MM-dd"));
                dialogUtil.alert(pk10.msgs.registerSuccessTitle, msg, _onRegisterSuccess);
            }, 100);
        };

        var onRegisterBtnClick = function(){
            var license = $('#renewed-license').val();
            if(!license){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsRequired);
                return;
            }
            var checkResult = licenseService.checkLicense(license);
            if(checkResult.isValid){
                registerSuccess(checkResult.exirationDate);
            } else if(checkResult.exirationDate){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
            } else {
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsInvalid);
            }
        };

        var initDialogText = function(){
            var exirationDate = getExirationDate();
            $('#renewed-title').text(pk10.msgs.renewedDialogTitle);
            $('#renewed-content').text(pk10.msgs.renewedDialogContent.format(exirationDate.format('yyyy-MM-dd'), device.uuid, config.qq));
            $('#renewed-licenseLabel').text(pk10.msgs.licenseInputLabel);
            $('#renewed-btnCopyUuid').text(pk10.msgs.btnCopyUuid);
            $('#renewed-btnRegister').text(pk10.msgs.btnRegister);
        };

        var initDialog = function(){
            initDialogText();
            $('#renewed-license').val('');
            $('#renewed-btnCopyUuid').click(onCopyUuidBtnClick);
            $('#renewed-btnRegister').click(onRegisterBtnClick);
            $('#renewed-btnQuit').click(navigator.app.exitApp);
            if(_showExitBtn){
                $('#renewed-btnQuit').show();
            } else{
                $('#renewed-btnQuit').hide();
            }
        };

        var openDialog = function(showExitBtn, success){
            if(showExitBtn && typeof showExitBtn == 'boolean'){
                _showExitBtn = showExitBtn;
            } else {
                _showExitBtn = false;
            }
            _onRegisterSuccess = success;
            dialogUtil.getDialog('renewed-popup', 'renewed.html', function($popup){
                initDialog();
                $popup.popup('open');
                _isOpenning = true;
            }, function(){
                _isOpenning = false;
            });
        };

        return {
            openDialog: openDialog,
            get isOpenning(){
                return _isOpenning;
            }
        };
    }();

    // 过期检测
    timedTaskService.addTask(function(){
        var exirationDate = getExirationDate();
        if(exirationDate){
            if(!registerDialog.isOpenning && !renewedDialog.isOpenning && new Date().getTime() >= _exirationDate.getTime()){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
                renewedDialog.openDialog(true);
            }
        }
    });

    var properties = {
        /*
        @function 打开注册弹窗
        @params
        @return
         */
        openRegisterDialog: registerDialog.openDialog,
        openRenewedDialog: renewedDialog.openDialog
    };

    return properties;
}();