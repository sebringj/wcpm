var async = require('async'),
	http = require('http'),
	url = require('url'),
	xmlParser = require('xmldom').DOMParser;

module.exports = (function(){	
	function getItems(options, callback) {
		
		var i = 0, items = {}, seo = {}, vars = {};
		
		if (options.pageID) {
			if (!options.items) {
				options.items = [];
			}
			options.items.push({ id : options.pageID + '-vars-', kind : 'vars' });
			options.items.push({ id : options.pageID, kind : 'seo' });
		}
		
		if (!options.items || options.items.length === 0) {
			callback({
				seo : seo,
				items : items,
				vars : vars
			});
			return;
		}
		
		async.forEach(options.items, function(item, callback) {
			
			if (!item.kind) {
				item.kind = 'ids';
			}
			
			var reqOptions = {
				host: options.host, 
				port:80,
				path: options.basePath +  '/' + item.kind +'/' + item.id + '.txt'
			};
			
			if (item.kind === 'ids') {
				items[item.id] = {
					content : '',
					editorType : item.editorType,
					classNames : 'kitgui-id-' + item.id + ' kitgui-content-type-' + item.editorType
				};
			}
			
			getText(reqOptions, function(statusCode, content) {
				if (statusCode === 200) {
					if (item.kind === 'ids') {
						items[item.id].content = content;
					} else if (item.kind === 'vars') {
						vars = setVars(content);
					} else if (item.kind === 'seo') {
						seo = setSeo(content);
					}
				}
				callback();
			}, function(){
				callback();
			});
			
		}, function(err) {
			callback({
				seo : seo,
				vars : vars,
				items: items
			});
		});
	}

	return {
		getContents : getItems
	};
})();

function getText(options, onResult, onError) {

    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = [];
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output.push(chunk);
        });

        res.on('end', function() {
            var obj = output.join('');
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
		onError(err);
    });

    req.end();
};

function setVars(txt) {
	var query = {};
	try {
		query = url.parse('/?' + txt,true).query;
	} catch (e) { console.log(e); }
	return query;
}

function getXmlText(xmlDom, tag) {
	var elems = xmlDom.getElementsByTagName(tag);
	if (elems.length < 1 || !elems[0].firstChild || !elems[0].firstChild.nodeValue) { return ''; } 
	return elems[0].firstChild.nodeValue;
}

function getXmlBoolean($obj) {
	var val = getXmlText($obj);
	return (val === 'true');
}

function setSeo(txt) {
	var seo = {}, $xml;
	try {
		xmlDom = new xmlParser().parseFromString(txt);
		return {
			title : getXmlText(xmlDom, 'title'),
			description : getXmlText(xmlDom, 'description'),
			keywords : getXmlText(xmlDom, 'keywords'),
			noindex : getXmlBoolean(xmlDom, 'noindex'),
			nofollow : getXmlBoolean(xmlDom, 'nofollow')
		}
	} catch (e) { console.log(e); }
	return seo;
}