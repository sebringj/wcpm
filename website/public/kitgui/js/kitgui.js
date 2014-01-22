/* © 2010 kitGUI LLC. All Rights Reserved, patent pending */
(function (w, k) {
    var d = w.document,
	j = '1.6.2',
	a = '/kitgui/',
	s = function (_, loaded) {
	    var s = d.createElement('script');
	    s.type = 'text/javascript';
	    s.src = _ + '.js';
	    s.async = false;
	    s.onreadystatechange = s.onload = function() {
	        var state = s.readyState;
	        if (loaded.done || (!state || /loaded|complete/.test(state))) {
	            loaded.done = true;
	            loaded();
	        }
	    };
		d.getElementsByTagName('head')[0].appendChild(s);	
	},
	c = function (_) {
	    var link = d.createElement('link');
	    link.type = 'text/css';
	    link.rel = 'stylesheet';
	    link.href = a + 'css/' + _ + '.css';
	    link.media = 'screen';
	    d.getElementsByTagName('head')[0].appendChild(link);
	};
    k.loggedin = (d.cookie.indexOf('kitgui=1') > -1);
    k.showTab = function () { };
    function init() {
        if (k.loggedin) {
            c('editor');
            s(a + 'js/editor', function () { });
        } else {
            c('login');
            s(a + 'js/login', function () { });
        }
    }
    if (!w.jQuery || w.jQuery.fn.jquery !== j) {
        var jq = null, $ = null;
        if (w.jQuery) { jq = w.jQuery; }
        if (w.$) { $ = w.$; }
        s('//ajax.googleapis.com/ajax/libs/jquery/' + j + '/jquery.min', function () {
            k.$ = w.jQuery.noConflict(true);
            if (jq) { w.jQuery = jq; }
            if ($) { w.$ = $; }
            init();
        });
    } else {
        k.$ = w.jQuery;
        init();
    }
})(this, kitgui);