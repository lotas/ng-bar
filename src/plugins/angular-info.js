var utils = require('../utils.js')();

var AngularInfoPlugin = {
	init: initPlugin
};

function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();

		elm.innerHTML = '<h4 title="'+angular.version.codeName+'">ng ' + angular.version.full + 
			 ' <span class="ngbar-app-name">App: <strong>' + mainModule + '</strong></h4>';
	}, 500);
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = AngularInfoPlugin;
}
