var utils = require('../utils.js')();

var MemoryUsagePlugin = {
	init: initPlugin
};

/**
 * Chrome only
 * Chrome uses non-standard window.performance.memory
 * May be required to use --enable-precise-memory-info flag.
 * [chrome.executable] --args --enable-precise-memory-info 
 */
function initPlugin(elm) {
	elm.innerHTML = '<h4><span id="ngbar-mem">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-mem').innerHTML = utils.getMemUsage();
		setTimeout(calcThem, 1000);
	}, 1000);
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = MemoryUsagePlugin;
}
