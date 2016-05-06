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
            if(new Date().getTime() >= _exirationDate.getTime() && $('#licensePopup').is(':hidden')){
                window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
                openRegisterWin();
            }
        } else{
            var license = localStorage.license;
            if(!license) return;
            var checkResult = licenseService.checkLicense(license);
            if(checkResult.exirationDate){
                _exirationDate = checkResult.exirationDate;
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
            //alert(pk10.msgs.registerSuccess.format(checkResult.exirationDate.format("yyyy-MM-dd")));
            $('#licensePopup').popup('close');
            setTimeout(function(){
                var msg = pk10.msgs.registerSuccess.format(checkResult.exirationDate.format("yyyy-MM-dd"));
                dialogUtil.alert(pk10.msgs.registerSuccessTitle, msg, _onRegisterSuccess);
            }, 100);
        } else if(checkResult.exirationDate){
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsExpired);
        } else {
            window.plugins.toast.showShortCenter(pk10.msgs.licenseIsInvalid);
        }
    };

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

    var getWin = function(callback){
        if($('#licensePopup').length) {
            callback($('#licensePopup'));
        } else{
            $.get('licensePopup.html', function(html){
                var $popup = $(html);
                $popup.appendTo("div[data-role=page]:first");
                $popup.trigger('create');
                $popup.popup();
                callback($popup);
            });
        }
    };

    var openRegisterWin = function(success){
        _onRegisterSuccess = success;
        getWin(function($popup){
            initWin();
            $popup.popup('open');
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