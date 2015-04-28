var AngularInfoPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = AngularInfoPlugin;
}
