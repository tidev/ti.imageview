# ti.imageview

ti.imageview is an extension on top of the existing Ti.UI.createImageView method. It allows you to add requestHeaders to fetching of an image, or pass the fetching of the image to your xhr library of choice. 

## How to use it
Install ti.imageview by running the npm command below in your `lib` folder in alloy, or in classic run it in your `Resources` folder.

```
npm install ti.imageview
```

Then use it in your alloy project like this

```xml
<ImageView module="ti.imageview" id="myImage" />
```

In your classic project you can use it by doing a simple require

```js
require('ti.imagecache').createImageView(args);
```

## Adding global requestHeaders
The easiest way to set requestHeaders is setting them globally. Just run the code below in `alloy.js` or any other file you know is called before the images are requested, and all images will be using those headers to fetch images. 

```js
require('ti.imageview').setRequestHeaders({
    myRequestHeader: "valueOfRequestHeader"
});
```

Of course they can be changed at any point in time, and from then on the new values will be used.

## Adding requestheaders per image

For adding requestHeaders for a specific image you add a `requestHeaders` property to your tss. It should look like this:

```
"#myImage": {
  image: '[image_url]',
  requestHeaders: {
    "myRequestHeader": "valueOfRequestHeader"
  },
  height: 300,
  width: Ti.UI.SIZE
}
```
These requestHeaders will be automatically picked up and used in fetching the image. Keep in mind, if you set requestHeaders globally those won't be used if you set them inside an imageView. So this is just a way to override the global headers.

## Using your own xhr library
So for example, if you already use [ti.xhr](https://www.npmjs.com/package/ti.xhr) in your app, and you've already have that configured to use the right requestHeaders, you might as well want to use that module so you don't have to configure your requestHeaders twice.

You can set that up by using the `setHttpHandler` property exposed in the module. This method will be called with a url and a callback method. In case of `ti.xhr` you can set it up like this:

```js
//ti.xhr sample
require('ti.imageview').setHttpHandler(function(url, cb) {
  xhr.GET({
    url : url,
    onSuccess : function(e) {
      cb(e.data);
    },
  });
});
```
Assuming you've already set up the requestHeaders with `ti.xhr` you don't have to do anything else besides the above. Now this method will be called every time an image needs downloading. 
