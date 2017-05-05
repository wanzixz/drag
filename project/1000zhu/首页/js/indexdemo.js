var pageIndex = 0,
    preloadCount = 0;
var loopPlayback = false,
    stopSwitch = true;
var videoSwiper, casesSwiper, appStoreSwiper, aboutSwiper;
$(function() {
    // var m = document.location.href.toLowerCase().match(/#p(\d+)$/);
    // if (m != null) pageIndex = m[1] - 1;
    //if (!authentication()) return;
    preload()
});

function preload() {
    $("body>section, .video .swiper-container, .video .swiper-slide").height($(window).height());
    var selector = $("section.video .swiper-container .swiper-slide:lt(2)");
    if (pageIndex > 0 && pageIndex < $("body>section").size()) selector = $("body>section").eq(pageIndex);
    preloadCount = selector.size();
    selector.each(function(i, item) {
        var imgUrl = $(item).css("background-image");
        var m = imgUrl.match(/url\("?([^"]+)"?\)/);
        loadImage(m[1], imgLoaded)
    })
}

function loadImage(url, callback) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
        preloadCount--;
        callback.call(img);
        return
    }
    img.onload = function() {
        preloadCount--;
        callback.call(img)
    }
}

function imgLoaded() {
    if (preloadCount == 0) pageLoad()
}

function pageLoad() {
    $("body").bind("mousewheel", function(e, delta) {
        if (stopSwitch) return;
        stopSwitch = true;
        delta > 0 ? pageIndex-- : pageIndex++;
        pageSwitching()
    }).bind("touchmove", function(e) {
        e.preventDefault()
    });
    $("body").swipe({
        swipeUp: function() {
            if (stopSwitch) return;
            stopSwitch = true;
            pageIndex++;
            pageSwitching()
        },
        swipeDown: function() {
            if (stopSwitch) return;
            stopSwitch = true;
            pageIndex--;
            pageSwitching()
        }
    });
    $("header").append('<div class="bg"></div>');
    $("header .logo").append('<img src="images/logo_mini.png" class="img-responsive mini" />');
    $("header nav.menu").append('<i class="line"></i>');
    $("header .menu li a").bind("mouseenter", function() {
        var line = $("header .menu .line");
        if (line.css("display") == "none") line.show();
        line.stop().animate({
            width: $(this).width() + 10,
            left: parseInt($(this).position().left) - 5 + "px"
        }, 300)
    });
    $("header .menu").bind("mouseleave", function() {
        $("header .menu li.active a").trigger("mouseenter")
    }).trigger("mouseleave");
    $("header .menu").bind(whichTransitionEvent(), function() {
        $(this).trigger("mouseleave")
    });
    $("header .menu li").bind("click touchstart", function() {
        pageIndex = $(this).index();
        pageSwitching()
    });
    $("header .menu-icon span.glyphicon-th-large").bind("click touchstart", function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
            $("header .menu").removeClass("active")
        } else {
            $(this).addClass("active");
            $("header .menu").addClass("active")
        }
    });
    for (var i = 0; i < $(".video .swiper-slide").size(); i++) $(".video .guide").append('<a></a>');
    $(".video .guide a").eq(0).addClass("active");
    videoSwiper = new Swiper(".video .swiper-container", {
        loop: true,
        autoplay: 5000,
        grabCursor: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        onSlideChangeStart: function() {
            //resetVideoSwiperAnimation()
        },
        onSlideChangeEnd: function() {
            $(".video .guide a").removeClass("active").eq(videoSwiper.activeLoopIndex).addClass("active");
            videoSwiperAnimation()
        },
        onTouchEnd: function() {
            videoSwiper.startAutoplay()
        }
    });
    $('.swiper-button-prev').bind('click touchstart', function() {
        videoSwiper.swipePrev();
        videoSwiper.startAutoplay();
    });
    $('.swiper-button-next').bind('click touchstart', function() {
        videoSwiper.swipeNext()
        videoSwiper.startAutoplay();
    });
    videoSwiper.stopAutoplay();
    $(".video .guide a").bind("mouseover click touchstart", function(e) {
        e.preventDefault();
        videoSwiper.stopAutoplay();
        videoSwiper.swipeTo($(this).index())
    }).mouseout(function(e) {
        videoSwiper.startAutoplay()
    });
    $(".video .movedown").bind("click touchstart", function() {
        if (stopSwitch) return;
        stopSwitch = true;
        pageIndex = 1;
        pageSwitching()
    });
    $(".business ul.items li").prepend('<u class="cl-bg"></u><u class="cl"></u><u class="cr"></u>');
    $(".cases .swiper-container").after('<a class="prev" href="javascript:;"></a><div class="swiper-container mini">' +
        $(".cases .swiper-container").html() + '</div><a class="next" href="javascript:;"></a>').after(
        '<div class="swiper-container xs">' + $(".cases .swiper-container").html() + '</div>');
    $(".cases .xs .swiper-slide img").addClass("img-responsive");
    $(".cases .swiper-slide ").prepend('<div class="shade"></div>');


    casesSwiper = new Swiper(".cases .swiper-container.mini", {
        loop: true,
        autoplay: 5000,
        grabCursor: true,
        onTouchEnd: function() {
            casesSwiper.startAutoplay()

        }
    });
    var casesSwiper2 = new Swiper(".cases .swiper-container", {
        loop: true,
        slidesPerView: 3,
        grabCursor: true,
        //Enable 3D Flow
        tdFlow: {
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1,
            shadows: false
        },
        onTouchEnd: function() {
            casesSwiper2.startAutoplay()
            $(".cases .swiper-slide").removeClass("on");
            $(".cases .swiper-slide-active").next(".swiper-slide-visible").addClass("on");
        }
    });
    casesSwiper.stopAutoplay();
    $(".cases a.prev").bind("click touchstart", function(e) {
        e.preventDefault();
        casesSwiper.swipePrev();
        casesSwiper.startAutoplay()
    });
    $(".cases a.next").bind("click touchstart", function(e) {
        e.preventDefault();
        casesSwiper.swipeNext();
        casesSwiper.startAutoplay()
    });


    function minSlide($dom,slideName) {

        $($dom + " .swiper-container").after('<a class="prev" href="javascript:;"></a><div class="swiper-container mini">' +
            $($dom + " .swiper-container").html() + '</div><a class="next" href="javascript:;"></a>');
        $($dom + " .swiper-container .swiper-wrapper ul").each(function(i, item) {
            var ulWidth = 0;
            $(item).find("li").each(function(i, item) {
                var liMarginLeft = $(this).css("margin-left").replace("px", "");
                ulWidth += $(this).outerWidth() + liMarginLeft * 2
            });
            if ($.support.leadingWhitespace) $(item).width(ulWidth);
            else $(item).width(ulWidth + 8)
        });
        slideName = new Swiper($dom + " .swiper-container.mini", {
            loop: true,
            //autoplay: 5000,
            grabCursor: true,
            onTouchEnd: function() {
                slideName.startAutoplay()
            }
        });
        //slideName.stopAutoplay();
        $($dom + " a.prev").bind("click touchstart", function(e) {
            e.preventDefault();
            slideName.swipePrev();
            slideName.startAutoplay()
        });
        $($dom + " a.next").bind("click touchstart", function(e) {
            e.preventDefault();
            slideName.swipeNext();
            slideName.startAutoplay()
        });
    }
    minSlide(".app-store",appStoreSwiper);
    minSlide(".aboutus",aboutSwiper);
    $(".marketing").append('<div class="shade"></div>');
    $(".marketing .swiper-slide").prepend('<u class="cl"></u><u class="cr"></u>');
    $(".app-store .swiper-slide").prepend('<u class="cl"></u><u class="cr"></u>');




    $(".contact .box").append('<div class="below"><i></i></div>');
    $(".contact .box .wechat img").addClass("img-responsive");
    $(window).bind("resize", function(e) {
        initLayout();
        var lock = false;
        var selector = "body>section.active";
        if (pageIndex == 0) selector = ".video .swiper-slide.active .box";
        $(selector).bind(whichTransitionEvent(), function() {
            initLayout();
            if (lock) return;
            else lock = true;
            pageSwitching();
            $("header .menu").trigger("mouseleave");
            $(".dock").css("top", ($(window).height() - $(".dock").height()) / 2 + 35)
        })
    });
    dockEvent();
    var tEvent = whichTransitionEvent();
    if (tEvent == undefined) {
        initLayout();
        var fun = '$("div.welcome").animate({opacity:"0", zIndex:"-1"}, 500, "swing", function(){ pageSwitching(); })';
        setTimeout(fun, 600);
        pageSwitching()
    } else {
        $("div.welcome").animate({
            opacity: "0",
            zIndex: "-1"
        }, 500, "swing", function() {
            initLayout();
            pageSwitching()
        })
    }

}

function initLayout() {
    $("body>section, .video .swiper-container, .video .swiper-slide").height($(window).height());
    var hhNormal = $("header").height();
    var hhFixed = 70;
    if (hhNormal == 42) hhFixed = 60;
    else if (hhNormal == 0) hhFixed = 0;
    var refTop = hhNormal;
    $(".video .swiper-slide").each(function(i, item) {
        if ($(item).hasClass("nth5")) {
            var box = $(".video .box");
            var boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
            if ($(window).height() < 800) {
                $(item).find(".box").css("top", boxTop - box.height() / 2);
            } else {
                $(item).find(".box").css("top", boxTop - box.height());
            }

        }
    });
    var items = $(".business ul.items li");
    if ($(window).width() > 1000) {
        var itemMarginLeft = items.css("margin-left").replace("px", "");
        var width = items.outerWidth() * items.size() + itemMarginLeft * 2 * items.size() + 4 * (items.size() - 1) + 2;
        $(".business ul.items").width(width)
    } else {
        var itemWidth = items.outerWidth() + 25;
        var lineSize = parseInt($(window).width() / itemWidth);
        $(".business ul.items").width(itemWidth * lineSize + 2)
    }
    var box = $(".business .box");
    var boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    box.css("top", boxTop);
    box = $(".cases .box");
    boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    box.css("top", boxTop);

    items = $(".marketing ul.items li");
    if ($(window).width() > 1000) {
        var itemMarginLeft = items.css("margin-left").replace("px", "");
        var width = items.outerWidth() * items.size() + itemMarginLeft * 2 * items.size() + 4 * (items.size() - 1) + 2;
        $(".marketing ul.items").width(width)
    }
    box = $(".marketing .box");
    boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    box.css("top", boxTop);
    $(".marketing .shade").height($(window).height());

    items = $(".app-store .items .swiper-slide");
    if ($(window).width() > 1000) {
        var itemMarginLeft = items.css("margin-left").replace("px", "");
        var width = items.outerWidth() * items.size() + itemMarginLeft * 2 * items.size() + 4 * (items.size() - 1) + 2;
        $(".app-store .items").width(width)
    }
    box = $(".app-store .box");
    boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    
    if($(window).height() <= 375){
        boxTop = parseInt(($(window).height() - box.height() + hhFixed + 30) );
        console.log(boxTop)
        box.css("top", boxTop);
    }else{
        box.css("top", boxTop);
    }
   
    $(".app-store .shade").height($(window).height());

    items = $(".aboutus .items .swiper-slide");
    if ($(window).width() > 1000) {
        var itemMarginLeft = items.css("margin-left").replace("px", "");
        var width = items.outerWidth() * items.size() + itemMarginLeft * 2 * items.size() + 4 * (items.size() - 1) + 2;
        $(".aboutus .items").width(width)
    }
    box = $(".aboutus .box");
    boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    box.css("top", boxTop);

    box = $(".contact .box");
    boxTop = parseInt(($(window).height() - box.height() + hhFixed) / 2);
    box.css("top", boxTop)
}

function videoSwiperAnimation() {
    var e = $(".video .swiper-container .nth" + (videoSwiper.activeLoopIndex + 1).toString()).addClass("active");
    if (videoSwiper.activeLoopIndex == 1) {
        if (e.find(".box").width() == $(window).width()) e.find(".box").css("left", 0);
        else {
            var offsetLeft = $(window).width() / 2 - e.find(".box").width() - 30;
            e.find(".box").css("left", offsetLeft)
        }
    }
}



function sectionAnimation() {

    var e = $("body>section").eq(pageIndex).addClass("active");
    if (pageIndex == 2) {
        var prevBtn = $(".cases a.prev");
        var nextBtn = $(".cases a.next");
        if (prevBtn.css("display") == "block") {
            var btnTop = $(".cases .mini").position().top + 140;
            prevBtn.css("top", btnTop);
            nextBtn.css("top", btnTop)
        }
        casesSwiper.startAutoplay()
    } else if (pageIndex == 4) {
        prevBtn = $(".app-store a.prev");
        nextBtn = $(".app-store a.next");
        if (prevBtn.css("display") == "block") {
            var btnTop = $(".app-store .mini").position().top + 140;
            prevBtn.css("top", btnTop);
            nextBtn.css("top", btnTop)
        }
        //appStoreSwiper.startAutoplay()
    }else if (pageIndex == 5) {
        prevBtn = $(".aboutus a.prev");
        nextBtn = $(".aboutus a.next");
        if (prevBtn.css("display") == "block") {
            var btnTop = $(".aboutus .mini").position().top + 140;
            prevBtn.css("top", btnTop);
            nextBtn.css("top", btnTop)
        }
        //aboutSwiper.startAutoplay()
    }

}

function resetSectionAnimation() {
    if (!loopPlayback) return;
    $("body>section").removeClass("active")
}

function pageSwitching() {
    if (pageIndex < 0) {
        pageIndex = 0;
        stopSwitch = false;
        return
    }
    if (pageIndex >= $("body>section").size()) {
        pageIndex = $("body>section").size() - 1;
        stopSwitch = false;
        return
    }
    var lock = false;
    $("html,body").stop().animate({
        scrollTop: $("body>section").eq(pageIndex).offset().top
    }, 300, "swing", function() {
        if (lock) return;
        else lock = true;
        //resetVideoSwiperAnimation();
        resetSectionAnimation();
        sectionAnimation();
        stopSwitch = false
    });
    if (pageIndex > 0) $("header").addClass("fixed");
    else $("header").removeClass("fixed");
    $("header .menu li").removeClass("active").eq(pageIndex).addClass("active");
    $("header .menu").trigger("mouseleave")
}

function dockEvent() {
    $(".dock").height($(".dock ul.icons li").length * 50 + $(".dock a.switch").height() + 20).css("top", ($(window).height() -
        $(".dock").height()) / 2 + 35);
    $(".dock ul.icons li i").bind("mouseover click touchstart", function() {
        $(".dock ul.icons li").removeClass("active");
        $(this).parent().addClass("active")
    });
    $(".dock ul.icons li").bind("mouseleave", function() {
        $(".dock ul.icons li").removeClass("active")
    });
    $(".dock ul.icons li.up i").bind("click touchstart", function() {
        pageIndex--;
        pageSwitching()
    });
    $(".dock ul.icons li.down i").bind("click touchstart", function() {
        pageIndex++;
        pageSwitching()
    });
    $(".dock ul.icons li.tel .callback input").bind("focus", function() {
        $(this).addClass("focus")
    }).bind("blur", function() {
        if ($(this).val().length == 0) $(this).removeClass("focus")
    });
    $(".dock ul.icons li.tel .callback button").bind("click", function() {
        var tel = $(".dock ul.icons li.tel .callback input").val();
        if (tel.length == 0) {
            alert("请输入您的电话号码");
            return
        }
        if (!/^\d{7,}$/.test(tel)) {
            alert("请输入正确的电话号码");
            return
        }
        lxb.call(tel)
    });
    $(".dock a.switch").bind("click", function() {
        if ($(this).hasClass("off")) {
            $(".dock").removeClass("close");
            $(this).removeClass("off")
        } else {
            $(".dock ul.icons li").removeClass("active");
            $(".dock").addClass("close");
            $(this).addClass("off")
        }
    })
}

function authentication() {
    var suffix = "com",
        count = 1,
        dot = ".";
    var d = (count + 999).toString() + "zhu" + dot + suffix;
    if (window.location.host.indexOf(d) < 0 && window.location.host.indexOf("qianzhu.cn") < 0) {
        $("body").remove();
        return false
    }
    return true
}

function whichTransitionEvent() {
    var t;
    var el = document.createElement("qianzhu");
    var transitions = {
        "WebkitTransition": "webkitTransitionEnd",
        "MozTransition": "transitionend",
        "MSTransition": "msTransitionEnd",
        "OTransition": "oTransitionEnd",
        "transition": "transitionend"
    };
    for (t in transitions) {
        if (el.style[t] !== undefined) return transitions[t]
    }
}