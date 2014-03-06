var async = require('async');

module.exports = {
	get : getCache,
	set : setCache,
	remove : removeCache,
	removeAll : removeAllCache
};

// designed around async for redis at a later point in time

var items = {};

function getCache(options, callback) {
	if (!callback) {
		return;
	}
	return callback(items[options.name]);
}

function setCache(options, callback) {
	items[options.name] = options.item;
	if (!callback) {
		return;
	}
	return callback();
}

function removeCache(options, callback) {
	delete items[options.name];
	if (!callback) {
		return;
	}
	return callback();
}

function removeAllCache(callback) {
	var keys = [], i;
	for(i in items) {
		if (items.hasOwnProperty(i)) { keys.push(i); }
	}
	for(i = 0; i < keys.length; i++) {
		delete items[keys[i]];
	}
	if (!callback) {
		return;
	}
	return callback();
}