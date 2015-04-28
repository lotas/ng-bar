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
			var rootScope = angular.element(document.querySelector('.ng-scope')).scope().$root;

			var cnt = 0;
			iterateScopes(rootScope, function(scope) {
				cnt++;
			});
			return cnt;
		},

		getWatchersCount: function() {
			var rootScope = angular.element(document.querySelector('.ng-scope')).scope().$root;

		    var count = 0;
		    iterateScopes(rootScope, function(scope) {
		      count += getWatchersFromScope(scope).length;
		    });

			return count;
		},

		getService: function(service) {
			return _getRootElm().injector().get(service);
		}
	};


	// taken from ng-stats
  function getWatchersFromScope(scope) {
    return scope && scope.$$watchers ? scope.$$watchers : [];
  }
  function iterateScopes(current, fn) {
    if (typeof current === 'function') {
      fn = current;
      current = null;
    }
    current = current || getRootScope();
    current = _makeScopeReference(current);
    if (!current) {
      return;
    }
    var ret = fn(current);
    if (ret === false) {
      return ret;
    }
    return iterateChildren(current, fn);
  }

  function iterateSiblings(start, fn) {
    var ret;
    while (!!(start = start.$$nextSibling)) {
      ret = fn(start);
      if (ret === false) {
        break;
      }

      ret = iterateChildren(start, fn);
      if (ret === false) {
        break;
      }
    }
    return ret;
  }

  function iterateChildren(start, fn) {
    var ret;
    while (!!(start = start.$$childHead)) {
      ret = fn(start);
      if (ret === false) {
        break;
      }

      ret = iterateSiblings(start, fn);
      if (ret === false) {
        break;
      }
    }
    return ret;
  }


  function getScopeById(id) {
    var myScope = null;
    iterateScopes(function(scope) {
      if (scope.$id === id) {
        myScope = scope;
        return false;
      }
    });
    return myScope;
  }

  function _makeScopeReference(scope) {
    if (_isScopeId(scope)) {
      scope = getScopeById(scope);
    }
    return scope;
  }

  function _isScopeId(scope) {
    return typeof scope === 'string' || typeof scope === 'number';
  }
};

if (typeof module !== "undefined" && module.exports) {
	module.exports = NgBarUtils;
}