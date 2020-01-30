$(function () {

  // Responsive
  GLOBAL.actualResizer = 'throttledresize' in jQuery.event.special ? 'throttledresize' : 'resize';
  function responsiveFixes() {
    var ww = $(window)[0].innerWidth || $(window).width(),
        wh = $(window)[0].innerHeight || $(window).height();

    GLOBAL.windowSize = [ww, wh];

    // Prevent fixes if changed only window height
    if ($(document.body).data('originalWW') && $(document.body).data('originalWW') == ww) {
      return;
    }
    $(document.body).data('originalWW', ww);

    // Responsive menu
    // Optional: /js/plugins/jquery.event.move.js, /js/plugins/jquery.event.swipe.js
    $('.mobile-menu-link').off('click.ht');
    $('nav').off('.ht');
    if (ww < 768) {
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
    }
  }
  responsiveFixes();
  $(window).on(GLOBAL.actualResizer, responsiveFixes);

});