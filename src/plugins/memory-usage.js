var MemoryUsagePlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4>Memory</h4>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = MemoryUsagePlugin;
}
