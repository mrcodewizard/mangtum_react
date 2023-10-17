/**
* Template : Mangtum
* Author: Biswabandhu
* License: Wayindia
*/
wow = new WOW(
  {
    animateClass: 'animated',
    offset: 100,
    callback: function (box) {
      // console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
    }
  }
);
wow.init();
var swiper = new Swiper(".mangtumSLider", {
  autoplay: {
    delay: 2000
  },
  speed: 1000,
  loop: true,
  navigation: {
    nextEl: ".swiper-home-next",
    prevEl: ".swiper-home-prev",
  },
});
var swiper = new Swiper(".popularProduct", {
  slidesPerView: 5,
  spaceBetween: 10,
  loop: true,
  loopFillGroupWithBlank: true,
  roundLengths: true,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 0,
    },
    "@1.50": {
      slidesPerView: 5,
      spaceBetween: 0,
    },
  },
});
var swiper = new Swiper(".swipe-slide", {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});
var swiper2 = new Swiper(".swipe-main", {
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});
$('.video').parent().click(function () {
  if ($(this).children(".video").get(0).paused) {
    $(this).children(".video").get(0).play(); $(this).children(".playpause").fadeOut();
  } else {
    $(this).children(".video").get(0).pause();
    $(this).children(".playpause").fadeIn();
  }
});


