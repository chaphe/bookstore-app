(function (window) {
    window['env'] = window['env'] || {};
  
    // Environment variables
    window['env']['backendBaseUrl'] = '${BACKEND_BASE_URL}';

    window['env']['storeUrl'] = '${STORE_URL}';
    window['env']['reviewsUrl'] = '${REVIEWS_URL}';
    window['env']['catalogUrl'] = '${CATALOG_URL}';
  })(this);  