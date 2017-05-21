var pageIndex = 0,
    preloadCount = 0;
var videoSwiper;
$(function() {
    preload()
});

function preload() {
    //$("body>section, .video .swiper-container, .video .swiper-slide").height($(window).height());
    var selector = $("section.video .swiper-container .swiper-slide:lt(2)");
    if (pageIndex > 0 && pageIndex < $("body>section").size()) selector = $("body>section").eq(pageIndex);
    preloadCount = selector.size();
    selector.each(function(i, item) {
        var imgUrl = $(item).css("background-image");
        var m = imgUrl.match(/url\("?([^"]+)"?\)/);
        console.log(i)
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
    $(".video .nth1, .video .nth2").append('<div class="shade"></div><div class="line"><u></u></div>');
    videoSwiper = new Swiper(".video .swiper-container", {
        loop: true,
        //autoplay: 5000,
        grabCursor: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
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
    initLayout();
    // yemian donghua
    wowAnimate();
    domMouse('#js-cont-two li','active');
    domMouse('#js-cont-three li','active');
    domMouse('#js-cont-four li','bl');
    domMouse('#js-qywz-two li','active');
}

function initLayout() {
    var refTop = $(".video .guide").offset().top;
    console.log(refTop);
     $(".video .swiper-slide").each(function(i, item) {
        if ($(item).hasClass("nth1")) {
            var boxMt = parseInt((refTop - $(item).find(".box").height()) / 2 - 30);
            $(item).find(".box").css("margin-top", boxMt);
        }else if ($(item).hasClass("nth2")) {
            var boxMt = parseInt(($(".video .guide").offset().top - $(item).find(".left").height()) / 2 -30);
            var boxWidth = $(item).find(".left").width() + $(item).find(".right").width();
            $(item).find(".box").css("margin-top", boxMt).css("width", boxWidth);
            $(item).find(".shade").css("top", boxMt - 711)
        } else if ($(item).hasClass("nth3")) {
            var boxMt = parseInt((refTop - $(item).find(".box").height()) / 2 -30);
            $(item).find(".box").css("top", boxMt);
        }
    });
}
function domMouse(dom,style){
  $(dom).mouseover(function(){
        $(this).addClass(style)
    })
    $(dom).mouseout(function(){
        $(this).removeClass(style)
    });  
}


function wowAnimate(){
    var wow = new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 100,
        mobile: true,
        live: true
    });
    wow.init();
}

function videoSwiperAnimation() {
    var e = $(".video .swiper-container .nth" + (videoSwiper.activeLoopIndex + 1).toString()).addClass("active");
    if (videoSwiper.activeLoopIndex == 2) {
        if (e.find(".box").width() == $(window).width()) e.find(".box").css("left", 0);
        else {
            var offsetLeft = $(window).width() / 2 - e.find(".box").width() - 30;
            e.find(".box").css("left", offsetLeft)
        }
    }
}

function whichTransitionEvent() {
    var t;
    var el = document.createElement("dom");
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