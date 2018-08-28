var storedHeaders = [];
var httpHandler;
var debug = false;

function log(value) {
  if (debug) Ti.API.info(value);
}

/*
 * This method is called whenever you put module="ti.imageview" inside an imageview xml tag.
 */
function createImageView(args) {
  log('creating ImageView for ' + args.image);
  var url = false;
  if (args.image.indexOf('http') === 0) {
    url = args.image;
    delete args.image;
  }
  var imageView = Ti.UI.createImageView(args);
  
  
  if (url) { 
    fetchImage(url, args.requestHeaders ? args.requestHeaders : storedHeaders, function(blob) {
      imageView.image = blob;
    });
  }
  
  return imageView;
}

/*
 * Internal method for fetching the image based on provided properties
 */
function fetchImage(url, headers, cb) {
  // if a custom http handler is provided, use that instead
  log('fetching image: ' + url);
  if (httpHandler)
    return httpHandler(url, cb);

  var client = Ti.Network.createHTTPClient({
    onload : function(e) {
      cb(this.responseData);
      log('fetched image ' + url);
    },
    onerror : function(e) {
      e.url = this.url;
      log('fetching image failed');
      Ti.API.error('ti.imagecache: unable to download image');
      Ti.API.error(e);
    }
  });

  client.open("GET", url);

  _.each(headers, function(value, name) {
    client.setRequestHeader(name, value);
  });

  client.send();

}

/*
 * Allow overriding the http handler. This means, if you already use a 3rd party http module
 * you can hook it into this module. This is especially powerful if your http module
 * already is configured with requestHeaders, so you don't need to do work twice
 */
Object.defineProperty(exports, "httpHandler", {
  get : function() {
    return httpHandler;
  },
  set : function(handler) {
    httpHandler = handler;
    log('updating httpHandler');
  },
});

// exports getter/setter for default requestHeaders
Object.defineProperty(exports, "defaultRequestHeaders", {
  get : function() {
    return storedHeaders;
  },
  set : function(requestHeaders) {
    storedHeaders = requestHeaders;
    log('setting default requestHeaders to ' + JSON.stringify(requestHeaders));
  },
});

// exports getter/setter for updating the debug state
Object.defineProperty(exports, "debug", {
  get : function() {
    return debug;
  },
  set : function(state) {
    debug = state;
    Ti.API.info('setting debug state to ' + state);
  },
});

exports.createImageView = createImageView;
