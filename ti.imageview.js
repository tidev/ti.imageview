var storedHeaders = [];
var httpHandler;

function setRequestHeaders(headers) {
	storedHeaders = headers;
}

/*
 * Allow overriding the http handler. This means, if you already use a 3rd party http module
 * you can hook it into this module. This is especially powerful if your http module 
 * already is configured with requestHeaders, so you don't need to do work twice
 */
function setHttpHandler(handler) {
	httpHandler = handler;
}


/*
 * This method is called whenever you put module="ti.imageview" inside an imageview xml tag.
 */
function createImageView(args) {
	var url = args.image;
	
	delete args.image;
	var imageView = Ti.UI.createImageView(args);
	fetchImage(url, args.requestHeaders ? args.requestHeaders : storedHeaders, function(blob) {
		imageView.image = blob;
	});
	
	return imageView;	
}

/*
 * Internal method for fetching the image based on provided properties
 */
function fetchImage(url, headers, cb) {
	// if a custom http handler is provided, use that instead
	if (httpHandler) return httpHandler(url, cb);
	
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			cb(this.responseData);
		}, onerror: function(e) {
			e.url = this.url;
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

module.exports = {
	setRequestHeaders: setRequestHeaders,
	createImageView: createImageView,
	setHttpHandler: setHttpHandler
};
