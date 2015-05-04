var utils = require('../utils.js')();


/**
 * Chrome only
 * Chrome uses non-standard window.performance.memory
 * May be required to use --enable-precise-memory-info flag.
 * [chrome.executable] --args --enable-precise-memory-info 
 */
function initPlugin(elm) {
	elm.innerHTML = '<h4><i class="help">Mem:</i> <span id="ngbar-mem">...</span>' +
		' <i class="help">Scopes:</i> <span title="Number of scopes" id="ngbar-scopes">...</span> ' + 
		' <i class="help">Watchers:</i> <span title="Number of watchers" id="ngbar-watchers">..</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-mem').innerHTML = utils.getMemUsage();
		
		var scopesInfo = utils.getScopesInfo()
		document.getElementById('ngbar-scopes').innerHTML = scopesInfo.count;
		document.getElementById('ngbar-watchers').innerHTML = scopesInfo.watchers;
		setTimeout(calcThem, 2000);
	}, 100);
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}
