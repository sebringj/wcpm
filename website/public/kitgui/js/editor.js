/* © 2010 kitGUI LLC. All Rights Reserved, patent pending */
(function (win, $, k, und) {
    var JSON; if (!JSON) { JSON = {} } (function () { "use strict"; function f(n) { return n < 10 ? '0' + n : n } if (typeof Date.prototype.toJSON !== 'function') { Date.prototype.toJSON = function (key) { return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours()) + ':' + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds()) + 'Z' : null }; String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) { return this.valueOf() } } var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' }, rep; function quote(string) { escapable.lastIndex = 0; return escapable.test(string) ? '"' + string.replace(escapable, function (a) { var c = meta[a]; return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4) }) + '"' : '"' + string + '"' } function str(key, holder) { var i, k, v, length, mind = gap, partial, value = holder[key]; if (value && typeof value === 'object' && typeof value.toJSON === 'function') { value = value.toJSON(key) } if (typeof rep === 'function') { value = rep.call(holder, key, value) } switch (typeof value) { case 'string': return quote(value); case 'number': return isFinite(value) ? String(value) : 'null'; case 'boolean': case 'null': return String(value); case 'object': if (!value) { return 'null' } gap += indent; partial = []; if (Object.prototype.toString.apply(value) === '[object Array]') { length = value.length; for (i = 0; i < length; i += 1) { partial[i] = str(i, value) || 'null' } v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']'; gap = mind; return v } if (rep && typeof rep === 'object') { length = rep.length; for (i = 0; i < length; i += 1) { k = rep[i]; if (typeof k === 'string') { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v) } } } } else { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = str(k, value); if (v) { partial.push(quote(k) + (gap ? ': ' : ':') + v) } } } } v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}'; gap = mind; return v } } if (typeof JSON.stringify !== 'function') { JSON.stringify = function (value, replacer, space) { var i; gap = ''; indent = ''; if (typeof space === 'number') { for (i = 0; i < space; i += 1) { indent += ' ' } } else if (typeof space === 'string') { indent = space } rep = replacer; if (replacer && typeof replacer !== 'function' && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) { throw new Error('JSON.stringify') } return str('', { '': value }) } } if (typeof JSON.parse !== 'function') { JSON.parse = function (text, reviver) { var j; function walk(holder, key) { var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v } else { delete value[k] } } } } return reviver.call(holder, key, value) } text = String(text); cx.lastIndex = 0; if (cx.test(text)) { text = text.replace(cx, function (a) { return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4) }) } if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) { j = eval('(' + text + ')'); return typeof reviver === 'function' ? walk({ '': j }, '') : j } throw new SyntaxError('JSON.parse') } } } ());
    $(function () {
        var $win = $(win),
		$document = $(win.document),
		pr = 's',
		baseURL = (k.env) ? 'http' + pr + '://' + k.env + '.kitgui.com/' : 'http' + pr + '://www.kitgui.com/',
		statusURL = baseURL + 'status',
		logoutURL = baseURL + 'logout',
		editURL = baseURL + 'edit',
        postMessageURL = baseURL + 'postmessage',
		fileExplorerURL = baseURL + 'fileexplorer',
		manageURL = baseURL + 'manage',
        inlineURL = baseURL + 'inline',
		blankURL = '//s3.amazonaws.com/kitgui/blank.htm',
		contentURL = baseURL + 'content',
		$body = $('body').append(
			'<div id="kitgui_tab" class="kitgui_tab_on"></div><div id="kitgui_toolbar"><form action="#">' +
            '<div class="kitgui_font kitgui_toggle_edit"><label><input type="checkbox" checked="checked" /> enable edit mode</label></div>' +
            '<button class="kitgui_font kitgui_btn kitgui_logout_btn">logout</button>' +
			'<button class="kitgui_font kitgui_btn kitgui_manageaccount_btn">settings</button>' +
			'<button class="kitgui_font kitgui_btn kitgui_fileexplorer_btn">file explorer</button></form></div>' +
			'<div id="kitgui_modal"></div><div id="kitgui_editor"><div id="kitgui_editor_bar"><a id="kitgui_editor_minmax" href="#"></a>' +
			'<a id="kitgui_editor_close" href="#"></a></div><iframe id="kitgui_editor_iframe" name="kitgui_editor_iframe" frameborder="no" scrolling="yes" src="' + blankURL + '"></iframe></div>'
		),
        $toggleEdit = $('#kitgui_toolbar .kitgui_toggle_edit input'),
		$tab = $('#kitgui_tab'),
		tabAnimationTime = 250,
		$toolbar = $('#kitgui_toolbar'),
		toolbarHeight = $toolbar.height(),
		toolbarOpen = true,
		$toolbarForm = $toolbar.find('form'),
		$logoutBtn = $toolbar.find('.kitgui_logout_btn'),
		$fileExplorerBtn = $toolbar.find('.kitgui_fileexplorer_btn'),
		$manageBtn = $toolbar.find('.kitgui_manageaccount_btn'),
		$modal = $('#kitgui_modal'),
		modalMargin = 21,
		modalMargin2 = modalMargin * 2,
		$editor = $('#kitgui_editor'),
		$bar = $('#kitgui_editor_bar'),
		$close = $('#kitgui_editor_close'),
		$minmax = $('#kitgui_editor_minmax'),
		$editorIframe = $('#kitgui_editor_iframe'),
		classIDPrefix = 'kitgui-id-',
		classContentTypePrefix = 'kitgui-content-type-',
		idpattern = /^kitgui-id-[a-zA-Z0-9\-\_]+$/,
		contentpattern = /^kitgui-content-type-[a-zA-Z0-9\-\_]+$/,
		modalMode = false,
		currentID = null,
        addEvent = function (ev, el, f) {
            if (el.addEventListener) {
                el.addEventListener(ev, f, false);
            } else if (el.attachEvent) {
                return el.attachEvent('on' + ev, f);
            }
        },
        extractFromPattern = function (className, pattern) {
            var classes = className.split(' ');
            for (var i = 0; i < classes.length; i++) {
                if (pattern.test(classes[i])) {
                    return classes[i];
                }
            }
            return null;
        },
		extractID = function (className) {
		    return extractFromPattern(className, idpattern);
		},
		extractContentType = function (className) {
		    return extractFromPattern(className, contentpattern);
		},
		adjustEditor = function () {
		    var st = $win.scrollTop(),
			sl = $win.scrollLeft(),
			wh = $win.height(),
			ww = $win.width(),
			ew = ww - modalMargin2,
			eh = wh - modalMargin2,
			ex = parseInt((ww - ew) / 2 + sl - (modalMargin / 4)),
			ey = parseInt((wh - eh) / 2 + st - (modalMargin / 4)),
			bh = $body.height(), bw = $body.width(),
			who = parseInt(wh + st),
			mh = (who < bh) ? bh : who,
			bw = $body.width(),
			wwo = parseInt(ww + sl),
			mw = (wwo < bw) ? bw : wwo;
		    $editor.css({ left: ex + 'px', top: ey + 'px', width: ew + 'px', height: eh + 'px' });
		    $editorIframe.css({ width: $editor.width() + 'px', height: $editor.height() + 'px' });
		    $modal.css({ display: 'block', left: '0', top: '0', width: mw + 'px', height: mh + 'px' });
		    if (modalMode) {
		        $editor.css({ display: 'block', left: ex + 'px', top: ey + 'px' });
		    } else {
		        $editor
					.css({ display: 'none', left: ex + 'px', top: ey + 'px' })
					.show('fast');
		        modalMode = true;
		    }
		},
		hideObjectEmbed = function () {
		    $('object:visible,embed:visible').each(function () {
		        $(this)
				.addClass('kitgui-object-modified')
				.css({ 'visibility': 'hidden' });
		    });
		},
		openModal = function (url) {
		    modalMode = true;
		    editOff();
		    $editorIframe.attr('src', url);
		    adjustEditor();
		    $win.bind('resize.kitgui scroll.kitgui', adjustEditor);
		    hideObjectEmbed();
		    currentID = null;
		},
		openEditor = function (id, contentType) {
		    openModal(editURL + '?ref=' + escape(window.location.href) + '&r=' + escape(Math.random()) + '&id=' + escape(id) + '&k=' + escape(k.key) + '&t=' + escape(contentType));
		    currentID = id;
		},
		closeModal = function () {
		    modalMode = false;
		    editOn();
		    $win.unbind('resize.kitgui scroll.kitgui', adjustEditor);
		    $editor.hide('fast', function () {
		        $modal.css({ 'display': 'none' });
		        $editor.css({ 'display': 'none' });
		    });
		    $editorIframe.attr('src', blankURL);
		    $('.kitgui-object-modified').each(function () {
		        $(this)
				.removeClass('.kitgui-object-modified')
				.css({ 'visibility': 'visible' });
		    });
			var contentType = extractContentType($('.kitgui.' + classIDPrefix + currentID).get(0).className);
			if (/-json$/i.test(contentType)) {
				location.reload();
			} else {
			    $.getScript(contentURL + '?r=' + escape(Math.random()) + '&id=' + escape(currentID) + '&k=' + escape(k.key), function () {
			        if (k.loggedin) {
			            if (!k.error) {
			                k.content = ($.trim(k.content) === '') ? '&nbsp;' : k.content;
			                $('.kitgui.' + classIDPrefix + currentID).html(k.content + '&nbsp;');
			            } else {
			                // TODO handle error and error code
			                // k.errorcode
			            }
			        } else {
			            handleLoginSwitch();
			        }
			    });
			}
			$.ajax({cache:false,url:window.location.href}); // force recache
		},
		logout = function () {
		    var ex = new Date();
		    ex.setDate(ex.getDate() - 1);
		    var ap = ';expires=' + ex.toUTCString() + ';path=/;',
			hi = win.location.href.indexOf('#');
		    win.document.cookie = 'kitgui=0' + ap;
		    win.document.cookie = 'kitgui_token=' + ap;
		    if (hi === -1) { win.location = win.location.href; }
		    else { win.location = win.location.href.substr(0, hi); }
		},
		addOverlay = function (el) {
		    var id = extractID(el.className),
			contentType = extractContentType(el.className);
		    if (id !== null && $('.kitgui_edit').filter('.' + id).length === 0) {
		        var $jq = $(el);
		        var h = $jq.outerHeight();
		        $body.append('<div class="kitgui_edit ' + id + ' ' + contentType + '"><div class="kitgui_edit_icon"></div><div class="kitgui_edit_loader"></div><div>');
		    }
		},
		editOn = function () {
		    var $editPanels = $('.kitgui_edit').remove();
		    var els = $('.kitgui');
		    for (var i = 0; i < els.length; i++) {
		        addOverlay(els[i]);
		    }
		},
		editOff = function () {
		    $('.kitgui_edit').remove();
		},
		adjustOverlays = function () {
		    $('.kitgui_edit').hide();
		    if (!$toggleEdit.attr('checked')) { return; }
		    var $jq = null, p = null, w = null, h = null, z = 1, $els = null, id = null;
		    $("[class*='kitgui-id-']")
			.not('.kitgui').not('.kitgui_edit')
			.addClass('kitgui')
			.each(function () {
			    var $el = $(this), html = $el.html();
			    if (html === null || $.trim(html) === '' || $el.is(':hidden')) {
			        $el.css({'min-width':'16px','min-height':'16px'});
			    }
			    addOverlay(this);
			});
		    $els = $('.kitgui:visible');
		    for (var i = 0; i < $els.length; i++) {
		        id = extractID($els[i].className);
		        if (id !== null) {
		            $jq = $($els[i]);
		            p = $jq.offset();
		            w = $jq.width();
		            h = $jq.height();
		            z = (w * h);
		            $('.kitgui_edit.' + id).not('.kitgui_no_show').css({ 'z-index': (1147483500 - z), 'left': parseInt(p.left) + 'px', 'top': parseInt(p.top) + 'px', 'width': w + 'px', 'height': h + 'px' }).show();
		        }
		    }
		},
		adjustUI = function () {
		    if (!modalMode) {
		        adjustOverlays();
		    }
		},
		showOverlayTimeout = null,
		hideOverlays = function () {
		    $('.kitgui_edit').hide();
		},
		showOverlays = function () {
		    if (!$toggleEdit.attr('checked')) { return; }
		    $('.kitgui_edit').show();
		},
		checkLogin = function () {
		    $.getScript(statusURL + '?r=' + escape(Math.random()) + '&k=' + escape(k.key), function () {
		        if (!k.loggedin) {
		            logout();
		        } else {
		            if (k.token !== und) {
		                win.document.cookie = 'kitgui_token=' + escape(k.token) + ';path=/;';
		            }
		            window.setTimeout(checkLogin, 1000 * 60 * 11);
		        }
		    });
		},
        showStatus = function (msg) {
            alert(msg);
        };
        $manageBtn.click(function (ev) {
            ev.preventDefault();
            openModal(manageURL + '?k=' + escape(k.key));
        });
        $fileExplorerBtn.click(function (ev) {
            ev.preventDefault();
            openModal(fileExplorerURL + '?k=' + escape(k.key));
        });
        $close.bind('click.kitgui', function () {
            closeModal();
            return false;
        });
        $win.bind('scroll.kitgui resize.kitgui', function () {
            if (showOverlayTimeout !== null) {
                window.clearTimeout(showOverlayTimeout);
                showOverlayTimeout = null;
            }
            hideOverlays();
            showOverlayTimeout = window.setTimeout(function () { showOverlays(); }, 200);
        });
        $win.unload(function () {
            $('.kitgui_edit').die();
            $win.die();
            $close.unbind('kitgui.click');
        });
        $('.kitgui_edit').live('mouseover', function () {
            $(this).addClass('kitgui_hover');
        });
        $('.kitgui_edit').live('mouseout', function () {
            $(this).removeClass('kitgui_hover');
        });
        $('.kitgui_edit').live('contextmenu', function (ev) {
            $(this).addClass('kitgui_no_show');
            return false;
        });
        $('.kitgui_edit').live('click', function (ev) {
            var getSetElement = function (id, className) {
                if ($('#' + id).length === 0) {
                    $('body').append($('<div />').attr('id', id).addClass(className));
                }
                return $('#' + id);
            },
            id = extractID(this.className), contentType = extractContentType(this.className),
            $el = null, $save, $cancel, $loader = null, $this = $(this), pos = $this.offset();
            if (id === null) { return; }
            currentID = id.substr(classIDPrefix.length);
            editOff();
            $this.find('.kitgui_edit_loader').show().hide();
            if (contentType.toLowerCase().indexOf('-inline') > -1) {
                $editorIframe.attr('src', postMessageURL);
                $el = $('.' + id).not('.kitgui_edit');
                $this.addClass('kitgui_no_show').hide();
                $el.unbind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel')
                .bind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel', function (ev) {
                    ev.stopImmediatePropagation();
                    ev.stopPropagation();
                    ev.preventDefault();
                }).data('kitgui-original', $el.html()).attr('contenteditable', true).focus();
                $save = getSetElement(id + '-kitgui-save', 'kitgui-save-icon');
                $cancel = getSetElement(id + '-kitgui-cancel', 'kitgui-cancel-icon');
                $loader = getSetElement(id + '-kitgui-loader', 'kitgui-loader-icon');
                $checkbox = getSetElement(id + '-kitgui-checkbox', 'kitgui-checkbox-icon');
                $el.unbind('keypress.kitgui').bind('keypress.kitgui', function () {
                    var pos = $el.offset();
                    $cancel.css({ left: pos.left + 26, top: pos.top + $el.outerHeight() }).show();
                    $save.css({ left: pos.left, top: pos.top + $el.outerHeight() }).show();
                    $loader.css({ left: pos.left, top: pos.top + $el.outerHeight() });
                    $checkbox.css({ left: pos.left, top: pos.top + $el.outerHeight() });
                }).trigger('keypress');
                $cancel.unbind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel')
                .bind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel', function () {
                    $cancel.unbind('click.kitgui').remove();
                    $save.unbind('click.remove').remove();
                    $loader.remove();
                    $checkbox.remove();
                    $el.unbind('keypress.kitgui')
                    .unbind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel').attr('contenteditable', false);
                    $this.find('.kitgui_edit_loader').hide();
                    $this.removeClass('kitgui_no_show').show();
                    $el.html($el.data('kitgui-original'));
                    editOn();
                });
                $save.unbind('click.kitgui').bind('click.kitgui', function () {
                    var msgObj = {};
                    if (window.postMessage) {
                        $loader.show();
                        $save.hide();
                        $cancel.hide();
                        msgObj.operation = 'save';
                        msgObj.k = k.key;
                        msgObj.id = currentID;
                        msgObj.content = $el.html();
                        $el.attr('contenteditable', false);
                        window.frames['kitgui_editor_iframe'].postMessage(JSON.stringify(msgObj), postMessageURL);
                    }
                });
            } else {
                openEditor(id.substr(classIDPrefix.length), contentType.substr(classContentTypePrefix.length));
            }
        });
        $logoutBtn.click(function () {
            $.getScript(logoutURL + '?r=' + escape(Math.random()), function () {
                logout();
            });
        });
        $toolbarForm.submit(function (ev) { ev.preventDefault(); });
        $tab.click(function () {
            if ($tab.hasClass('kitgui_tab_stealth')) { $tab.removeAttr('class').addClass('kitgui_tab_off'); }
            if ($tab.hasClass('kitgui_tab_off')) {
                $toolbar.animate({ height: toolbarHeight + 'px', bottom: '0' }, tabAnimationTime);
                $tab.animate({ bottom: '+=' + toolbarHeight }, tabAnimationTime);
                $tab.removeAttr('class').addClass('kitgui_tab_on');
                toolbarOpen = true;
            } else {
                $tab.animate({ bottom: '0' }, tabAnimationTime);
                $toolbar.animate({ height: '0', bottom: '0' }, tabAnimationTime, function () {
                    $tab.removeAttr('class').addClass('kitgui_tab_stealth');
                });
                toolbarOpen = false;
            }
            return false;
        });
        editOn();
        if (k.tabImage !== und) {
            $tab.css({ 'backgroundImage': 'url("' + k.tabImage + '")' });
        }
        $('meta').each(function () {
            if ($(this).attr('name') === 'kitgui-page-id') {
                if (k.buttons === und) {
                    k.buttons = [];
                }
                k.buttons.unshift({
                    label: 'SEO',
                    url: editURL + '?ref=' + escape(window.location.href) + '&r=' + escape(Math.random()) + '&id=' + escape($(this).attr('content')) + '&k=' + escape(k.key) + '&t=SEO'
                });
                k.buttons.unshift({
                    label: 'variables',
                    url: editURL + '?ref=' + escape(window.location.href) + '&r=' + escape(Math.random()) + '&id=' + escape($(this).attr('content')+'-vars-') + '&k=' + escape(k.key) + '&t=VARS'
                });
            }
        });
        $toggleEdit.click(function () {
            if ($toggleEdit.attr('checked')) {
                $('.kitgui_no_show').removeClass('kitgui_no_show');
            }
        });
        if (k.buttons !== und) {
            (function () {
                var i = 0, customClass = '';
                for (i = 0; i < k.buttons.length; i++) {
                    customClass = 'kitgui-custom-button-' + i;
                    $toolbarForm.append('<button class="kitgui_font kitgui_btn ' + customClass + '">' + $('<div />').text(k.buttons[i].label).html() + '</button>');
                    $toolbarForm.find('.' + customClass).data('url', k.buttons[i].url + '').click(function (ev) {
                        ev.preventDefault();
                        openModal($(this).data('url'));
                    });
                }
            })();
        }
        window.setInterval(adjustUI, 500);
        checkLogin();
        if (window.postMessage) {
            addEvent('message', window, function (ev) {
                var pairs = null, data = {}, i = 0,
                pos = $('.kitgui-loader-icon:visible').position(),
                $checkbox = $('.kitgui-checkbox-icon');
                if (ev.origin + '/' !== baseURL) {
                    return;
                }
                data = $.parseJSON(ev.data);
                if (data.success) {
                    $checkbox.css({
                        left: pos.left,
                        top: pos.top
                    }).show().delay(1000).fadeOut('fast', function () { $checkbox.remove(); });
                    $('.kitgui-save-icon').remove();
                    $('.kitgui-cancel-icon').remove();
                    $('.kitgui-loader-icon').remove();
                    $('.kitgui_no_show').removeClass('kitgui_no_show').show();
                } else {
                    showStatus(data.msg);
                    $('.kitgui-cancel-icon').trigger('click');
                }
                $('.kitgui.' + classIDPrefix + currentID)
                .unbind('click.kitgui-cancel dragover.kitgui-cancel drop.kitgui-cancel');
                editOn();
            });
        }
        if (!window.postMessage) {
            alert('your browser does not support saving directly on the page');
        }
    });
})(this, kitgui.$, kitgui);