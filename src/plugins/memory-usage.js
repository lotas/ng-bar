var utils = require('../utils.js')();


/**
 * Memory info is for chrome only
 * Chrome uses non-standard window.performance.memory
 * May be required to use --enable-precise-memory-info flag.
 * [chrome.executable] --args --enable-precise-memory-info 
 */
var pluginInfo = [{
	title: 'Scopes',
	background: '#EAEEF8',
	cnt: function() { return utils.getScopesInfo().count; }
}, {
	title: 'Watchers',
	background: '#FFF5F8',
	cnt: function() { return utils.getScopesInfo().watchers; }
}];

if (utils.getMemUsage() !== false) {
	pluginInfo.unshift({
		title: 'Mem',
		background: '',
		cnt: utils.getMemUsage
	});
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = pluginInfo;
}
