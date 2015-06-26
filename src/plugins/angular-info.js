var utils = require('../utils.js')();

if (typeof module !== 'undefined' && module.exports) {
	
	var mainModule = utils.guessMainModule();
	var deps = buildDeps(mainModule);
		
	module.exports = [{
		title: 'ng-app',
		cnt: mainModule,
		items: deps
	}];
	
	function buildDeps(mod) {
		var deps = [];
	
		angular.forEach(angular.module(mod).requires, function(elm) {
			// those hacks probably wouldn't be appreciated much
			var servicesCount = angular.module(elm)._invokeQueue.length;
			
			deps.push({
				title: elm + '&nbsp;(' + servicesCount + ')',
				items: {
					'Services': buildDepDetails(elm)
				} 
			});
		});
	
		return deps;
	}
	
	function buildDepDetails(mod) {
		var details = [];
	
		angular.forEach(angular.module(mod)._invokeQueue, function(obj, name) {
			details.push(obj[2][0]);
		});
	
		return details;
	}
}