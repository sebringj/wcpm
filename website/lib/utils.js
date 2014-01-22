module.exports = {
	getLayoutData : getLayoutData,
	getPageId : getPageId
};

function getPageId(path) {
	return path.replace(/[^a-z0-9]/gi,'-').replace(/-+/gi,'-');
}

function getLayoutData(req) {
	return {
		year : (new DateTime().getFullYear())
	};
}