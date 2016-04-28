/**
 * Created by Felix on 2016/4/18.
 */
var pk10 = pk10 || {};
pk10.indexMgr = function(){
    var _currentPage;
    var _mySwiper;

    var onDeviceReady = function() {
        var license = localStorage.license;
        if(license && licenseService.checkLicense(license).isValid){
            initPage();
        } else{
            pk10.licenseMgr.openRegisterWin(function(){
                initPage();
            });
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

    var initPage = function(){
        initSwiper();
        initNavbar();
        initContentSize();
        showDefaultPage();

        /*$('#btnTest').click(function(){
            pk10.licenseMgr.openRegisterWin(function(){
                initPage();
            });
        });*/
    };

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
