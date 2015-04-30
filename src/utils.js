var NgBarUtils = function() {
  var angular = window.angular;

  function _getRootElm() {
    return angular.element(document.querySelector('.ng-scope'));
  }


  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  var precision;
  var i;
  function bytesToSize( bytes, nFractDigit ){
    if (bytes === 0) {
      return 'n/a';
    }
    nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
    precision = Math.pow(10, nFractDigit);
    i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
  }


  return {

    guessMainModule: function() {
      var app = document.querySelector('[ng-app]').attributes['ng-app'].value;
      return app ? app : 'ng';
    },
    
    /**
     * Get number of scopes and watchers
     * 
     * @return {Object} {count: int, watchers: int}
     */
    getScopesInfo: function() {
      var rootScope = angular.element(document.querySelector('.ng-scope')).scope().$root;

      var cnt = 0,
          watchers = 0;

      iterateScopes(rootScope, function(scope) {
        cnt++;
        watchers += getWatchersFromScope(scope).length;
      });

      return {count: cnt, watchers: watchers};
    },

    getService: function(service) {
      return _getRootElm().injector().get(service);
    },

    getMemUsage: function() {
      if (window.performance && window.performance.memory) {
        return bytesToSize(window.performance.memory.totalJSHeapSize);
      } else {
        return 'performance.memory missing';
      }
    },

    /**
     * Get the list of all services
     * @type {[type]}
     */
    enumerateServices: enumerateAllServices,

    enumerateModuleDeps: function(mod) {
      try {
        return angular.module(mod).requires;
      } catch (e) {
        return [];
      }
    },

    hasParentWithClass: function(elm, className) {
        while (elm && !elm.hasClass(className) && elm[0] && elm[0].tagName !== 'body') {
            elm = elm.parent();
        }
        return elm.hasClass(className);
    }
  };

  function enumerateAllServices(mod, r) {
    var inj = angular.element(document).injector().get;

    if (!r) r = {};

    angular.forEach(angular.module(mod).requires, function(m) {
      enumerateAllServices(m,r);
    });
    angular.forEach(angular.module(mod)._invokeQueue, function(a) {
      try { 
        r[a[2][0]] = [a[1], inj(a[2][0])]; 
      } catch (e) {}
    });
    return r;
  }

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