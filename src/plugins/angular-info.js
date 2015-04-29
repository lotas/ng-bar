var utils = require('../utils.js')();

var AngularInfoPlugin = {
	init: initPlugin
};

function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4><div class="sub" id="ngbar-app-deps"></div>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();
		var deps = buildDeps(mainModule);

		elm.innerHTML = '<h4 title="'+angular.version.codeName+'">ng ' + angular.version.full + 
			 ' <span class="ngbar-app-name">App: <strong>' + mainModule + '</strong></h4><div class="sub" id="ngbar-app-deps">' + deps + '</div>';
	}, 500);
}

function buildDeps(mod) {
	var html = '<li><b>Requires:</b></li>';

	angular.forEach(angular.module(mod).requires, function(elm) {
		// those hacks probably wouldn't be appreciated much
		var servicesCount = angular.module(elm)._invokeQueue.length;
		
		html += '<li>' + elm + ' <span class="cnt">' + servicesCount + '</span></li>';
	});

	return '<ul>' + html + '</ul>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = AngularInfoPlugin;
}
