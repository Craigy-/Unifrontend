$(function () {

  GLOBAL.actualResizer = 'throttledresize' in jQuery.event.special ? 'throttledresize' : 'resize';

  // Responsive
  function responsiveFixes() {
    var ww = $(window)[0].innerWidth || $(window).width(),
        wh = $(window)[0].innerHeight || $(window).height();

    GLOBAL.windowSize = [ww, wh];

    // Set --vh custom property to correct window height calculation for mobile browsers
    var vh = wh * .01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Prevent fixes if changed only window height
    GLOBAL.onlyWindowHeightChanged = false;
    if ($(document.body).data('originalWW') && $(document.body).data('originalWW') == ww) {
      GLOBAL.onlyWindowHeightChanged = true;
      return;
    }
    $(document.body).data('originalWW', ww);

    // Responsive menu
    // Optional: /js/plugins/jquery.event.move.js, /js/plugins/jquery.event.swipe.js
    $('.mobile-menu-link').on('click.ht', function (e) {
      e.preventDefault();
      $(document.body).toggleClass('nav-opened');
    });
    $('nav').on('swipeleft.ht swiperight.ht', function () {
      $('.mobile-menu-link').trigger('click');
    }).on('movestart.ht', function (e) {
      if ((e.distX > e.distY && e.distX < -e.distY) || (e.distX < e.distY && e.distX > -e.distY)) {
        e.preventDefault();
      }
    });
    $('#mobile-menu-overlay').on('click.ht', function () {
      $(document.body).removeClass('nav-opened');
    });

    // Responsive manipulations
    if (ww < 768) {
    }
  }
  responsiveFixes();
  $(window).on('load ' + GLOBAL.actualResizer, responsiveFixes);


});