var utils = require('../utils.js')();

var ScopeCountPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4>Scopes: <span id="ngbar-scopes">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-scopes').innerHTML = utils.getScopesCount();
		setTimeout(calcThem, 1000);
	}, 1000);
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeCountPlugin;
}
