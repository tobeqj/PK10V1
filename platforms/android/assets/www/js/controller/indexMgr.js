/**
 * Created by Felix on 2016/4/18.
 */
var pk10 = pk10 || {};
pk10.indexMgr = function(){
    var _currentPage;
    var _mySwiper;

    var initPage = function(){
        initSwiper();
        initNavbar();
        initContentSize();
        showDefaultPage();

        $('#btnTest').click(function(){
           openLicenseWin();
        });
    };

    var openLicenseWin = function(){
        var uuid = device.uuid;
        if($('#licensePopup').length){
            $('#licensePopup').popup('open');
            return;
        }

        $.get('licensePopup.html', function(html){
            /*var $popup = $(html);
             $popup.appendTo('body');
             $popup.trigger("create");*/
            var $popup = $(html);
            $popup.appendTo("div[data-role=page]:first");
            $popup.trigger('create');
            $('#licensePopup').popup();
            $('#uuid').text(uuid);
            $('#btnCopyUuid').click(function(){
                clipboard.copy(
                    uuid,
                    function(r){
                        window.plugins.toast.showShortCenter("复制成功！");
                    },
                    function(e){
                        window.plugins.toast.showShortCenter("复制失败！");
                    }
                );
            });
            $('#btnLicenseOk').click(function(){
                var license = $('#license').val();
                localStorage.license = license;
                if(!license){
                    window.plugins.showShortCenter("请输入授权码！");
                    return;
                }
                if(licenseHelper.checkLicense(uuid, license)){
                    initPage();
                    $('#licensePopup').popup('close')
                } else {
                    window.plugins.showShortCenter("授权码不正确！");
                }
            });
            $('#btnQuit').click(function(){
                navigator.app.exitApp();
            });
            $('#licensePopup').popup('open');
        });
    }

    var onDeviceReady = function() {
        var uuid = device.uuid;
        var license = localStorage.license;
        if(license && licenseHelper.checkLicense(uuid, license)){
            initPage();
        } else{
            openLicenseWin();
        }
    };

    var onBackBtnDown = function() {
        window.plugins.toast.showShortBottom("再点击一次退出！");
        document.removeEventListener('backbutton', onBackBtnDown, false);
        document.addEventListener('backbutton', navigator.app.exitApp, false);
        // 3秒后重新注册
        var intervalID = window.setTimeout(function() {
            window.clearTimeout(intervalID);
            document.removeEventListener('backbutton', navigator.app.exitApp, false);
            document.addEventListener('backbutton', onBackBtnDown, false);
        }, 3000);
    }

    var initContentSize = function () {
        var widowHeight = $(window).height();
        var headerHeight = $('div[data-role="header"]').height();
        var footerHeight = $('div[data-role="footer"]').height();
        var contentHeight = widowHeight - headerHeight - footerHeight;
        $('.swiper-slide').height(contentHeight);
    };

    var initSwiper = function() {
        // 注册左右滑动控件
        _mySwiper = new Swiper('.swiper-container', {
            // initialSlide: 1, //默认打开显示第二页
            pagination: '.swiper-pagination', //显示页码
            onSlidePrevStart: function (swiper) {
                var prevPage = getPrevPage();
                if (prevPage) {
                    onShowPage(prevPage);
                }
            },
            onSlideNextStart: function (swiper) {
                var nextPage = getNextPage();
                if (nextPage) {
                    onShowPage(nextPage);
                }
            }
        });
    };

    var initNavbar = function() {
        // 注册菜单点击事件
        $('#navbar').find('li a').click(function () {
            var $page;
            switch (this.id) {
                case 'btnHistory':
                    $page = $('#historyPage');
                    break;
                case 'btnSetting':
                    $page = $('#settingPage');
                    break;
                case 'btnHome':
                default:
                    $page = $('#homePage');
                    break;
            }
            showPage($page);
        });
    };

    var getPrevPage = function() {
        switch (_currentPage.attr('id')) {
            case 'homePage':
                return $('#historyPage');
            case 'settingPage':
                return $('#homePage');
            default:
                return null;
        }
    };

    var getNextPage = function() {
        switch (_currentPage.attr('id')) {
            case 'homePage':
                return $('#settingPage');
            case 'historyPage':
                return $('#homePage');
            default:
                return null;
        }
    };

    var showPage = function ($page) {
        onShowPage($page);
        var pageIndex = $page.parent('.swiper-slide').index();
        _mySwiper.slideTo(pageIndex, 100, false);
    };

    var onShowPage = function($page){
        _currentPage = $page;
        var src = '';
        var pageId = $page.attr('id');
        switch (pageId) {
            case "homePage":
                src = 'home.html';
                $('#titleHome').show();
                $('#titleHistory').hide();
                $('#titleSetting').hide();
                $('#btnHome').addClass('ui-btn-active');
                $('#btnHistory').removeClass('ui-btn-active');
                $('#btnSetting').removeClass('ui-btn-active');
                break;
            case "settingPage":
                src = 'setting.html';
                $('#titleHome').hide();
                $('#titleHistory').hide();
                $('#titleSetting').show();
                $('#btnSetting').addClass('ui-btn-active');
                $('#btnHistory').removeClass('ui-btn-active');
                $('#btnHome').removeClass('ui-btn-active');
                break;
            case "historyPage":
                src = 'history.html';
                $('#titleHome').hide();
                $('#titleHistory').show();
                $('#titleSetting').hide();
                $('#btnHistory').addClass('ui-btn-active');
                $('#btnHome').removeClass('ui-btn-active');
                $('#btnSetting').removeClass('ui-btn-active');
                break;
        }
        // 如果页面未加载过，初始化页面
        if ($page.html().length == 0) {
            $page.load(src, null, function () {
                $page.trigger("create"); // 重新渲染jquery mobile样式
                switch(pageId) {
                    case "homePage":
                        pk10.homeMgr.initPage();
                        break;
                    case "settingPage":
                        pk10.settingMgr.initPage();
                        break;
                    case "historyPage":
                        pk10.historyMgr.initPage();
                        break;
                }
            });
        }
    }

    var showDefaultPage = function() {
        // 如果还没有设置信息，开启程序时默认打开设置页面，否则，默认打开首页
        settingService.getLastSetting(function(result) {
            var defaultPage;
            if (result) {
                defaultPage = $('#homePage');
            } else {
                defaultPage = $('#settingPage');
            }
            showPage(defaultPage);
        }, function() {
            var defaultPage = $('#homePage');
            showPage(defaultPage);
        });
    };

    var properties = {
        initPage: function(){
            document.addEventListener("deviceready", onDeviceReady);
            document.addEventListener("backbutton", onBackBtnDown);
        },
        showPage: showPage
    }

    return properties;
}();
