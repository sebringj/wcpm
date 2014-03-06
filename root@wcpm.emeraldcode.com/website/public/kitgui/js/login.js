/* © 2010 kitGUI LLC. All Rights Reserved, patent pending */
(function (win, $, k, undefined) {
    $(function () {
        var $win = $(win),
		$document = $(win.document),
		pr = 's',
		baseURL = (k.env) ? 'https://' + k.env + '.kitgui.com/' : 'https://www.kitgui.com/',
		loginURL = baseURL + 'login',
		statusURL = baseURL + 'status',
		blankURL = 'http' + pr + '://s3.amazonaws.com/kitgui/blank.htm',
		$body = $('body').append(
			'<div id="kitgui_tab" class="kitgui_tab_stealth"></div>' +
			'<div id="kitgui_login"></div>'
		),
		$tab = $('#kitgui_tab'),
		th = $tab.outerHeight(),
		lh = 0,
		$iframe = null,
		$login = $('#kitgui_login'),
		loginHeight = 90,
		loginanimationtime = 500,
		trycount = 0,
		trytime = 2000,
		maxtries = 15,
		trytimeout = null,
		trystate = k.loggedin,
		adjustTimespan = 250,
		tabLeft = 20,
		adjustTimeout = null,
        addEvent = function (ev, el, f) {
            if (el.addEventListener) {
                el.addEventListener(ev, f, false);
            } else if (el.attachEvent) {
                return el.attachEvent('on' + ev, f);
            }
        },
		handleLoginSwitch = function () {
		    win.document.cookie = 'kitgui=' + ((k.loggedin) ? '1' : '0') + ';path=/;';
		    if (k.token !== undefined) {
		        win.document.cookie = 'kitgui_token=' + escape(k.token) + ';path=/;';
		    }
		    var hi = win.location.href.indexOf('#');
		    if (hi === -1) {
		        win.location = win.location.href;
		    } else {
		        win.location = win.location.href.substr(0, hi);
		    }
		},
		checklogin = function () {
		    if (k.loggedin !== trystate) {
		        handleLoginSwitch();
		        return;
		    }
		    if (trycount < maxtries) {
		        $.getScript(statusURL + '?r=' + escape(Math.random()) + '&k=' + escape(k.key), function () {
		            trytimeout = win.setTimeout(function () {
		                checklogin();
		            }, trytime);
		            trycount++;
		        });
		    } else {
		        $tab.removeAttr('class');
		        $tab.addClass('kitgui_tab_on');
		        $tab.trigger('click');
		        trytimeout = null;
		    }
		},
		adjustTab = function () {
		    var h1 = $win.height() + $win.scrollTop(), h2 = $document.height(), hd = Math.abs(h1 - h2);
		    if (k.tabVisible && hd < 100) {
		        $tab.show();
		        $login.show();
		    } else {
		        $tab.hide();
		        $login.hide();
		    }
		    window.setTimeout(function () { adjustTab(); }, adjustTimespan);
		};
        if (k.tabVisible === undefined) { k.tabVisible = true; }
        $tab.bind('click.kitgui', function () {
            if ($tab.hasClass('kitgui_tab_stealth')) { $tab.removeAttr('class'); $tab.addClass('kitgui_tab_off'); }
            var newClass = ($tab.hasClass('kitgui_tab_on')) ? 'kitgui_tab_off' : 'kitgui_tab_on';
            $tab.removeAttr('class');
            $tab.addClass(newClass);
            if (newClass === 'kitgui_tab_on') {
                if ($iframe === null) {
                    $iframe = $('<iframe frameborder="no" scrolling="no" src="' + loginURL + '?k=' + escape(k.key) + '"></iframe>');
                    $login.append($iframe);
                } else {
                    $iframe.attr('src', loginURL + '?k=' + escape(k.key));
                }
                if (!window.postMessage && trytimeout === null) {
                    trycount = 0;
                    checklogin();
                }
                $login.css({ 'display': 'block', 'height': 0 });
                $login.animate({ 'height': loginHeight }, loginanimationtime);
                $tab.animate({ 'bottom': loginHeight }, loginanimationtime);
            } else {
                $tab.animate({ 'bottom': 0 }, loginanimationtime);
                $login.animate({ 'height': 0 }, loginanimationtime,
					function () {
					    $login.css({ 'display': 'none' });
					    $tab.removeAttr('class');
					    $tab.addClass('kitgui_tab_stealth');
					}
				);
                trycount = maxtries;
            }
            return false;
        });
        $win.unload(function () {
            $tab.unbind();
        });
        if (k.tabImage !== undefined) {
            $tab.css({ 'backgroundImage': 'url(' + k.tabImage + ')' });
        }
        adjustTab();
        // public accessors
        k.showTab = function () {
            k.tabVisible = true;
        };
        if (window.postMessage) {
            addEvent('message', window, function (ev) {
                var data = null;
                if (ev.origin + '/' !== baseURL) {
                    return;
                }
                data = $.parseJSON(ev.data);
                switch (data.messageType) {
                    case 'login':
                        k.loggedin = data.success;
                        handleLoginSwitch();
                        break;
                }
            });
        }
    });
})(this, kitgui.$, kitgui);