var utils = require('../utils.js')();


function initPlugin(elm) {
	elm.innerHTML = '<h4>Scopes: <span id="ngbar-scopes">...</span> | Watchers: <span id="ngbar-watchers">..</span></h4>';

	setTimeout(function calcThem(){
		var scopesInfo = utils.getScopesInfo()
		document.getElementById('ngbar-scopes').innerHTML = scopesInfo.count;
		document.getElementById('ngbar-watchers').innerHTML = scopesInfo.watchers;
		setTimeout(calcThem, 500);
	}, 500);
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}
