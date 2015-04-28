var MemoryUsagePlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<b>Memory</b>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = MemoryUsagePlugin;
}
