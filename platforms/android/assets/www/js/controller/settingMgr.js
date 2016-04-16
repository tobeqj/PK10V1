var pk10 = pk10 || {};
pk10.settingMgr = function() {
    var formData = {}; //表单数据

    var initRadio = function() {
        // 绑定各单选按钮的点击事件
        $('input:radio').click(function () {
            // 重复点击同一个选项去除勾选
            if (formData[this.name] == this.value) {
                this.checked = false;
            }
            formData = $('#formSetting').serializeObject();
            $('#cycle').blur();
        });
    };

    var initCompleteBtn = function() {
        // 绑定完成按钮事件
        $('#btnComplete').click(function () {
            var cycle = $('#cycle').val();
            if (!cycle) {
                window.plugins.toast.showShortCenter("请输入期数！");
                return;
            }

            var hasProp = false;
            for (var prop in formData) {
                hasProp = true;
                break;
            }
            if (!hasProp) {
                window.plugins.toast.showShortCenter("请设置单双！");
                return;
            }

            var settings = getSettings();
            settingService.saveSetting(cycle, settings,
                function () {
                    window.plugins.toast.showShortCenter("设置成功！");
                    setEditable(false);
                },
                function () {
                    window.plugins.toast.showShortCenter("设置失败！");
                }
            );
        });
    };

    var initClearBtn = function() {
        $('#btnClear').click(clearSetting);
    };

    var initResetBtn = function() {
        $('#btnReset').click(function() {
            clearSetting();
            setEditable(true);
        });
    };

    var getSettings = function() {
        var settings = [];
        for (var i = 1; i <= 10; i++) {
            if (formData["danshuang" + i] || formData["daxiao" + i]) {
                var setting = new Setting(i, formData["danshuang" + i], formData["daxiao" + i]);
                settings.push(setting);
            }
        }
        return settings;
    };

    var clearSetting = function () {
        $('#cycle').val('');
        $('input:radio').attr('checked', false).checkboxradio("refresh");
    };

    var setEditable = function(editable) {
        if (editable) {
            $('#btnClear').show();
            $('#btnComplete').show();
            $('#btnReset').hide();
            $('#cycle').attr('disabled', false);
            $('input:radio').attr('disabled', false).checkboxradio("refresh");
        } else {
            $('#btnClear').hide();
            $('#btnComplete').hide();
            $('#btnReset').show();
            $('#cycle').attr('disabled', true);
            $('input:radio').attr('disabled', true).checkboxradio("refresh");
        }
    };

    var initData = function(data) {
        if (data && data.settings) {
            setEditable(false);
            var cycle = data.cycle;
            var settings = data.settings;
            $('#cycle').val(cycle);
            $(settings).each(function(i, setting) {
                if (setting.danshuang) {
                    $('input:radio[name="danshuang' + setting.num + '"][value="' + setting.danshuang + '"]')
                        .attr('checked', true).checkboxradio("refresh");
                }
                if (setting.daxiao) {
                    $('input:radio[name="daxiao' + setting.num + '"][value="' + setting.daxiao + '"]')
                        .attr('checked', true).checkboxradio("refresh");
                }
            });
        } else {
            setEditable(true);
        }
    };

    var properties = {
        initPage: function (setting) {
            initData(setting);
            initRadio();
            initCompleteBtn();
            initClearBtn();
            initResetBtn();
        },
        getLastSetting: function(success, error) {
            getLastSetting(success, error);
        }
    };

    return properties;
}();



