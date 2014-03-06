# kitgui - by Emerald Code Inc.

## Summary

consumes kitgui.com CMS SAAS

## API Documentation

var kitgui = require('kitgui');

kitgui.getContents({

    // CDN host
	host : String,
	
	// CDN base path
	basePath : String,
	
	// "items" consist of objects with the following.
	// "id" which is requires html id attribute format
	// "kind" which is "ids", "seo", or "vars"
	// "editorType" which is "INLINE", "HTML", "IMAGE-ROTATOR", "RAW", "TEAM" (so far)
	items : [{ id: String, kind : String, editorType : String }],
});

## License

This kitgui node packjage is dual licensed under the MIT and GPL licenses.

The KitGUI.com is privately owned by Emerald Code Inc. 

See [Pricing Details](https://www.kitgui.com)

## Thanks to�

* [Hubsoft](http://www.hubsoft.com/) and its clients

_� [Emerald Code](http://www.emeraldcode.com/)_