var ScopeWatchesPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = 'Watches: <b>333</b>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeWatchesPlugin;
}
