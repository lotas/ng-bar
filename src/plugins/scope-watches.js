var utils = require('../utils.js')();

var ScopeWatchesPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4>Watchers: <span id="ngbar-watches">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-watches').innerHTML = utils.getWatchersCount();
		setTimeout(calcThem, 1000);
	}, 1000);

}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeWatchesPlugin;
}
