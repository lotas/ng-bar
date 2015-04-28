var NgBarUtils = function() {
	var angular = window.angular;

	function _getRootElm() {
		return angular.element(document.querySelector('.ng-scope'));
	}

	return {
		
		getAngularVersion: function() {
			return angular.version.full;
		},

		getScopesCount: function() {
			// iterate scopes
		},

		getWatchersCount: function() {
			// iterate scopes
			return _getRootElm().scope().$$watchers.length;
		},

		getService: function(service) {
			return _getRootElm().injector().get(service);
		}
	};
};

if (typeof module !== "undefined" && module.exports) {
	module.exports = NgBarUtils;
}