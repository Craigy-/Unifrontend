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
      scrollableItems: 1,
      autoscrollInterval: 0, // ms
      pagination: true,
      touchable: GLOBAL.isTouchscreen
    }*/
  },

  // Modal windows
  modals: {
    /*'.presentation': {
      node: 'presentation',
      onHide: function () {
        $.overlayLoader(true, {
          node: $('#presentation-success')
        });
      }
    }*/
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
      effect: false
    }*/
  },

  // Tabs
  tabs: {
    /*'#product-functions': {
      updateHash: false
    }*/
  }

};