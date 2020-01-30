$(function () {

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

  // Prepare and save options for initialize plugin
  function makeOptions(node, selector, type) {
    var opts = {},
        options = GLOBAL.config[type][selector],
        dataTitle = type.substring(0, type.length - 1) + '-options';

    if ($(node).data(dataTitle)) {
      opts = $.extend(true, {}, options, $.parseJSON($(node).data(dataTitle).replace(/'/g, '"')));
    } else {
      opts = options;
    }

    $(node).data(dataTitle, opts);
    return opts;
  }


  // Replace checkboxes and radio buttons
  // Required: /js/src/plugins/jquery.inputs.js
  if (GLOBAL.config.inputs.length) {
    GLOBAL.config.inputs.inputs();
  }


  // Replace selectors
  // Required: /js/src/plugins/jquery.stylish-select.js
  if (GLOBAL.config.selectors.length) {
    GLOBAL.config.selectors.sSelect();
  }


  // Carousels
  // Required: /js/src/plugins/jquery.jcarousel.js
  // Optional: /js/src/plugins/jcarousel-plugins/jquery.jcarousel-swipe.js, /js/src/plugins/jcarousel-plugins/jquery.jcarousel-fade.js
  var carouselInit = function (container, options) {
    var
      $carousel = $('.jcarousel-wrapper', container).jcarousel({
        wrap: options.wrap,
        vertical: options.vertical
      }),
      isFadeSupported = $.isFunction($.jcarousel.fn.fade),
      method = isFadeSupported && options.method == 'fade' ? 'fade' : 'scroll';

    $carousel.jcarouselAutoscroll({
      interval: options.autoscrollInterval,
      target: '+=' + options.scrollableItems,
      autostart: !!options.autoscrollInterval,
      method: method // 'fade' is not supported here (https://github.com/jsor/jcarousel/issues/806)
    });

    $('.jcarousel-prev', container).on('jcarouselcontrol:active', function () {
      $(this).removeClass('jcarousel-controls-inactive');
    }).on('jcarouselcontrol:inactive', function () {
      $(this).addClass('jcarousel-controls-inactive');
    }).jcarouselControl({
      target: '-=' + options.scrollableItems,
      method: method
    });
    $('.jcarousel-next', container).on('jcarouselcontrol:active', function () {
      $(this).removeClass('jcarousel-controls-inactive');
    }).on('jcarouselcontrol:inactive', function () {
      $(this).addClass('jcarousel-controls-inactive');
    }).jcarouselControl({
      target: '+=' + options.scrollableItems,
      method: method
    });

    if (options.pagination && $carousel.jcarousel('items').length > options.scrollableItems) {
      $('.jcarousel-pagination', container).on('click', function (e) {
        e.preventDefault();
      }).on('jcarouselpagination:active', 'a', function () {
        $(this).addClass('jcarousel-pagination-active');
      }).on('jcarouselpagination:inactive', 'a', function () {
        $(this).removeClass('jcarousel-pagination-active');
      }).jcarouselPagination({
        'item': function (page, carouselItems) {
          return '<a href="">' + page + '</a>';
        },
        method: method
      });
    }

    if ('jcarouselSwipe' in $carousel && options.touchable) {
      var touchConfig = {};
      if (isFadeSupported) {
        touchConfig = {
          draggable: false,
          method: method
        };
      }
      $carousel.jcarouselSwipe(touchConfig);
    }
  };

  $.each(GLOBAL.config.carousels, function (selector, options) {
    if ($(selector).length > 1) {
      $(selector).each(function () {
        carouselInit(this, options);
      });
    } else {
      carouselInit(selector, options);
    }
  });


  // Modal windows
  // Required: /js/src/plugins/jquery.uniloader.js
  var modalInit = function (activator) {
    var options = $.extend(true, {}, $(activator).data('modal-options'));
    // Backward compatibility
    if ($(activator).data('modal-node')) {
      options.node = $.extend(true, {}, $(activator).data('modal-node'));
    }
    $.overlayLoader(true, options);
  };

  for (var selector in GLOBAL.config.modals) {
    $(selector).each(function () {
      var options = makeOptions(this, selector, 'modals');
      $(this).on('click', function (e) {
        e.preventDefault();
        modalInit(this);
      });
    });
  }


  // Popups
  // Required: /js/src/plugins/jquery.unifloat.js
  var popupInit = function (activator) {
    if (!$(activator).length) {
      return;
    }
    var options = $.extend(true, {}, $(activator).data('popup-options')),
        target = options.rel || '#' + $(activator).attr('id') + '-content',
        self = activator;
    if (options.manipulation && !$(target).data('unifloat-manipulated')) {
      $(document.body).append($(target));
      $(target).data('unifloat-manipulated', true);
    }
    if ($(target).is(':hidden')) {
      $(target).unifloat('show', $.extend(true, {}, options, {
        rel: self
      })).data('unifloat-source', activator);
    } else {
      $(target).hide();
      if (options.onHide) {
        options.onHide(self, target);
      }
    }
  };

  for (var selector in GLOBAL.config.popups) {
    $(selector).each(function () {
      var options = makeOptions(this, selector, 'popups');
      $(this).on('click', function (e) {
        e.preventDefault();
        popupInit(this);
      });
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
      $('.popup:visible').each(function () {
        popupInit($(this).data('unifloat-source'));
      });
      popupInit(e.target);
      return;
    }
    if (isPopup) {
      return;
    } else {
      $('.popup:visible').each(function () {
        popupInit($(this).data('unifloat-source'));
      });
    }
  });
  // By close button
  $('.popup-close').not('.modal-close').on('click', function (e) {
    e.preventDefault();
    $(document.body).trigger('click');
  });


  // Tabs
  // Required: /js/src/plugins/jquery.easytabs.js
  $.each(GLOBAL.config.tabs, function (selector, options) {
    if ($(selector).length > 1) {
      $(selector).each(function () {
        $(this).easytabs(options);
      });
    } else {
      $(selector).easytabs(options);
    }
  });


  // Scroll links
  // Required: /js/src/plugins/jquery.scrollTo.js
  var scrollingInit = function (activator) {
    var options = $.extend(true, {}, $(activator).data('scrolling-options')),
        target = 'target' in options ? options.target : '#' + $(activator).attr('href').split('#')[1],
        duration = options.duration;
    delete options.target;
    delete options.duration;
    $.scrollTo(target, duration, options);
  };

  for (var selector in GLOBAL.config.scrollings) {
    $(selector).each(function () {
      var options = makeOptions(this, selector, 'scrollings');
      $(this).on('click', function (e) {
        e.preventDefault();
        if ($.isFunction(options.onBefore)) {
          options.onBefore();
        }
        scrollingInit(this);
      });
    });
  }

});