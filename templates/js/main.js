$(function () {
  // Replace checkboxes and radio buttons
  // Required: js/plugins/jquery.inputs.js
  if (CONFIG.inputs.length) {
    CONFIG.inputs.inputs();
  }


  // Replace selectors
  // Required: js/plugins/jquery.stylish-select.js
  if (CONFIG.selectors.length) {
    CONFIG.selectors.sSelect();
  }


  // Carousels
  // Required: js/plugins/jquery.jcarousel.js, js/plugins/jquery.jcarousel-swipe.js
  var carouselInit = function (container, options) {
    var $carousel = $('.jcarousel-wrapper', container).jcarousel({
      wrap: options.wrap
    }).jcarouselAutoscroll({
      interval: options.autoscrollInterval,
      target: '+=' + options.scrollableItems,
      autostart: !!options.autoscrollInterval
    });

    $('.jcarousel-prev', container).on('jcarouselcontrol:active', function () {
      $(this).removeClass('jcarousel-controls-inactive');
    }).on('jcarouselcontrol:inactive', function () {
      $(this).addClass('jcarousel-controls-inactive');
    }).jcarouselControl({
      target: '-=' + options.scrollableItems
    });
    $('.jcarousel-next', container).on('jcarouselcontrol:active', function () {
      $(this).removeClass('jcarousel-controls-inactive');
    }).on('jcarouselcontrol:inactive', function () {
      $(this).addClass('jcarousel-controls-inactive');
    }).jcarouselControl({
      target: '+=' + options.scrollableItems
    });

    if (options.pagination && $carousel.jcarousel('items').length > options.scrollableItems) {
      $('.jcarousel-pagination', container).on('jcarouselpagination:active', 'a', function () {
        $(this).addClass('jcarousel-pagination-active');
      }).on('jcarouselpagination:inactive', 'a', function () {
        $(this).removeClass('jcarousel-pagination-active');
      }).jcarouselPagination();
    }

    if (options.touchable) {
      $carousel.jcarouselSwipe();
    }
  };

  $.each(CONFIG.carousels, function (selector, options) {
    if ($(selector).length > 1) {
      $(selector).each(function () {
        carouselInit(this, options);
      });
    } else {
      carouselInit(selector, options);
    }
  });


  // Modal windows
  // Required: js/plugins/jquery.uniloader.js
  var modalInit = function (activator) {
    var options = $(activator).data('modal-options');
    $.overlayLoader(true, {
      node: $('#' + options.node),
      hideSelector: options.hideSelector,
      effectSpeed: options.effectSpeed,
      onStart: options.onStart,
      onShow: options.onShow,
      onHide: options.onHide
    });
  };

  for (var i in CONFIG.modals) {
    $(i).data('modal-options', CONFIG.modals[i]).on('click', function (e) {
      e.preventDefault();
      modalInit(this);
    });
  }


  // Popups
  // Required: js/plugins/jquery.unifloat.js
  var popupHandler = function (activator) {
    var options = $(activator).data('popup-options');
    var target = options.rel || '#' + $(activator).attr('id') + '-content',
        self = activator;
    if (options.manipulation && !$(target).data('unifloat')) {
      $(document.body).append($(target));
      $(target).data('unifloat', true);
    }
    if ($(target).is(':hidden')) {
      $(target).unifloat('show', $.extend(true, {}, options, {
        rel: self
      })).find('input:first').focus();
    } else {
      $(target).hide();
    }
  };

  for (var i in CONFIG.popups) {
    $(i).data('popup-options', CONFIG.popups[i]).on('click', function (e) {
      e.preventDefault();
      popupHandler(this);
    });
  }

  // Close popups (modal windows supported)
  // By clicking on an empty area of the window
  $(document.body).on('click', function (e) {
    var isPopup = false;
    $('.popup-activator, .popup, #overlay, .modal').each(function () {
      if ($(e.target).is(this) || $(e.target).parents().is(this)) {
        isPopup = true;
      }
    });
    if ($(e.target).is('.popup-activator') && $(e.target).parents().is('.popup')) {
      $('.popup').hide();
      popupHandler(e.target);
      return;
    }
    if (isPopup) {
      return;
    } else {
      $('.popup').hide();
    }
  });
  // By close button
  $('.popup-close').not('.modal-close').on('click', function (e) {
    e.preventDefault();
    $(document.body).trigger('click');
  });


  // Tabs
  // Required: js/plugins/jquery.easytabs.js
  $.each(CONFIG.tabs, function (selector, options) {
    $(selector).easytabs(options);
  });


  // Forms errors processing
  var inputs = '.input, select, textarea, .SSContainerDivWrapper',
      defaultValues = ['', 0];

  var $formErrors = $('.form .form-error');
  if ($formErrors.length) {
    setInterval(function () {
      $formErrors.find(inputs).each(function () {
        var $par = $(this).hasClass('SSContainerDivWrapper') ? $(this).parent().parent() : $(this).parent(),
            val = $(this).hasClass('SSContainerDivWrapper') ? $(this).parent().prev().val() : $(this).val(),
            activeState = $(this).hasClass('SSContainerDivWrapper') ? $(this).is(':visible') : $(this).is(':focus');
        if (activeState) {
          $par.data('wasError', true);
          $par.removeClass('form-error');
        } else {
          if ($par.data('wasError')) {
            $par.removeClass('form-error');
            if ($.inArray(val, defaultValues) != -1) {
              $par.addClass('form-error');
            }
          }
        }
      });
    }, 111);
  }




  // Custom scripts

});