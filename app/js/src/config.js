// Supported plugins configuration
GLOBAL.config = {

  // Replace checkboxes and radio buttons
  inputs: $(),

  // Replace selectors
  selectors: $(),

  // Carousels
  carousels: {
    /*'#main': {
      wrap: false,
      vertical: false,
      method: 'scroll',
      scrollableItems: 1,
      autoscrollInterval: 0, // ms
      pagination: true,
      touchable: GLOBAL.isTouchscreen
    }*/
  },

  // Modal windows
  modals: {
    /*'.presentation': {
      node: '#presentation',
      fixedElements: 'header',
      onHide: function () {
        $.overlayLoader(true, {
          node: $('#presentation-success')
        });
      }
    },*/
    '.open-modal': {}
  },

  // Popups
  popups: {
    /*'#cat-item-action-faq': {
      rel: '#popup-faq',
      posTop: {
        value: 'under + 10',
        auto: false
      },
      posLeft: {
        value: 'center - 31',
        auto: false
      },
      manipulation: true,
      effect: false,
      onShow: function (source, target) {
        if (!GLOBAL.isTouchscreen) {
          $(target).find('input:first').focus();
        }
      }
    },*/
    '.open-popup': {}
  },

  // Tabs
  tabs: {
    /*'#product-functions': {
      updateHash: false
    }*/
  },

  // Scrollings
  scrollings: {
    /*'#up': {
      target: 0,
      duration: 200
    },*/
    '.scroll-to': {
      duration: 200
    }
  }

};