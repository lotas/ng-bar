var utils = require('../utils.js')();

var MemoryUsagePlugin = {
	init: initPlugin
};

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
