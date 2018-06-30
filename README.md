# Ti.ImageView

Ti.ImageView is an extension on top of the existing `Ti.UI.createImageView` method. It allows you 
to add requestHeaders to fetching of an image, or pass the fetching of the image to your xhr library of choice. 

## General Note

When using this module, all images going through it will be downloaded using a XHR-request and will not follow 
the default downloading and caching method build into the platforms natively. If you don't need any of the 
functionalities provided by this module, it is recommended not to use this. 

Currently, this module also does not work with local images or blobs. Only use it when your images are remote.

## Usage

Install Ti.ImageView by running the NPM command below in your `lib` folder in alloy, or in classic run it 
in your `Resources` folder.

```
npm i ti.imageview
```

Then use it in your alloy project like this

```xml
<ImageView module="ti.imageview" id="myImage" />
```

In your classic project, you can use it by doing a simple require

```js
require('ti.imagecache').createImageView(args);
```

## Global Request Headers

The easiest way to set request headers is setting them globally. Just run the code below in `alloy.js` or any 
other file you know is called before the images are requested, and all images will be using those headers to fetch images. 

```js
require('ti.imageview').setRequestHeaders({
  'User-Agent': 'TiRocks'
});
```

Of course they can be changed at any point in time, and from then on the new values will be used.

## Adding Request Headers Per Image

For adding requestHeaders for a specific image you add a `requestHeaders` property to your tss. It should look like this:

```
'#myImage': {
  image: 'YOUR_IMAGE_URL',
  requestHeaders: {
    'User-Agent': 'TiRocks'
  }
}
```

These request headers will be automatically picked up and used in fetching the image. Keep in mind, if you set 
request headers globally, those won't be used if you set them inside an imageView. So this is just a way to 
override the global headers.

## Using Your Own XHR-Library

You can set that up by using the `setHttpHandler` property exposed in the module. This method will be called with an 
URL and a callback method. In case of `ti.xhr` you can set it up as shown in the snippet below. The callback function 
expects an [ImageView.image](https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.ImageView-property-image)
supported property back.

When using your own XHR-library, keep in mind the request headers you might've provided as described above will not 
be used. You are responsible of setting this up yourself in your own XHR-library. 

### Ti.XHR Example

For example, if you already use [Ti.XHR](https://www.npmjs.com/package/ti.xhr) in your app, and you've already have that 
configured to use the right request headers, you might as well want to use that module so you don't have to configure your
request headers twice.

```js
require('ti.imageview').setHttpHandler(function (url, cb) {
  xhr.GET({
    url : url,
    onSuccess : function (e) {
      cb(e.data);
    }
  });
});
```
Assuming you've already set up the requestHeaders with `ti.xhr` you don't have to do anything else besides the above. 
Now this method will be called every time an image needs downloading. 

## License

Apache 2.0

## Contributing

Code contributions are greatly appreciated, please submit a [new pull request](https://github.com/appcelerator-modules/ti.imageview/pull/new/master)!
