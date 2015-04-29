(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	var utils = require('./utils.js');
	
	var cssString = "#ng-bar-wrap {\n\twidth: 100%;\n\tposition: fixed;\n\tbottom: 0px;\n\tz-index: 9999;\n\theight: 32px;\n\tfont-family: Verdana;\n\tfont-size: 12px;\n\tborder:1px solid #11163E;\n\tbackground-color: #D6F3FF;\n\n/*\twidth:100%;\n\theight: 24px;\n\tposition:fixed;\n\tleft:0;\n\tright:0;\n\tbottom:0;\n\tpadding:0 40px 10px 0;\n\tfont-family: Verdana;*/\n}\n#ng-bar {\n\tmargin-bottom: 28px;\n}\n\n#ng-bar>div {\n\tpadding: 2px 10px;\n\tfont-size: 12px;\n\tdisplay: block;\n\tfloat: left;\n\tborder-right: 1px solid #000;\n}\n#ng-bar h4 {\n\tmargin: 8px 8px;\n\tfont-family: Verdana;\n\tfont-size: 12px;\n}\n#ng-bar .logo {\n\tfloat: right;\n\tcolor: ##627E96;\n}";

	// var _ = require('lodash');

	var ngBarPlugins = [
		require('./plugins/angular-info.js'),
		require('./plugins/memory-usage.js'),
		require('./plugins/scope-count.js'),
		require('./plugins/scope-watches.js')
	];

	if (typeof window.angular === 'undefined') {
		throw 'No Angular, No Toolbar';
	}


	function NgBar() {}
	NgBar.prototype.version = '1.0.0';

	NgBar.prototype.init = function() {		
		this._createContainer();
		this._initPlugins();
	};
	/**
	 * Create main container
	 */
	NgBar.prototype._createContainer = function() {
		var body = document.getElementsByTagName('body')[0],
			wrap = document.createElement('div');

		wrap.id = 'ng-bar-wrap';
		body.appendChild(wrap);

		this._container = document.createElement('div');
		this._container.id = 'ng-bar';
		wrap.appendChild(this._container);

		var logo = document.createElement('div');
		logo.className = 'logo';
		logo.innerHTML = '<h4><a href="http://yaraslav.com/ng-bar">ng-bar ' + this.version + '</a></h4>';
		this._container.appendChild(logo);

		this._styles = document.createElement('style');
		this._styles.innerHTML = cssString;
		body.appendChild(this._styles);
	};
	/**
	 * Init plugins & create containers for them
	 * @return {[type]} [description]
	 */
	NgBar.prototype._initPlugins = function() {
		var self = this;
		this.plugins = [];

		angular.forEach(ngBarPlugins, function(plugin) {
			var elm = document.createElement('div');
			self._container.appendChild(elm);
			plugin._elm = elm;
			plugin.init(elm);

			self.plugins.push(plugin);
		});
	};

	window.NgBar = new NgBar();
	window.NgBar.init();
})();
},{"./plugins/angular-info.js":2,"./plugins/memory-usage.js":3,"./plugins/scope-count.js":4,"./plugins/scope-watches.js":5,"./utils.js":6}],2:[function(require,module,exports){
var AngularInfoPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = AngularInfoPlugin;
}

},{}],3:[function(require,module,exports){
var utils = require('../utils.js')();

var MemoryUsagePlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4><span id="ngbar-mem">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-mem').innerHTML = utils.getMemUsage();
		setTimeout(calcThem, 1000);
	}, 1000);
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = MemoryUsagePlugin;
}

},{"../utils.js":6}],4:[function(require,module,exports){
var utils = require('../utils.js')();

var ScopeCountPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4>Scopes: <span id="ngbar-scopes">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-scopes').innerHTML = utils.getScopesCount();
		setTimeout(calcThem, 1000);
	}, 1000);
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeCountPlugin;
}

},{"../utils.js":6}],5:[function(require,module,exports){
var utils = require('../utils.js')();

var ScopeWatchesPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<h4>Watchers: <span id="ngbar-watches">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-watches').innerHTML = utils.getWatchersCount();
		setTimeout(calcThem, 1000);
	}, 1000);

}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeWatchesPlugin;
}

},{"../utils.js":6}],6:[function(require,module,exports){
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
		nFractDigit	= nFractDigit !== undefined ? nFractDigit : 0;
		precision = Math.pow(10, nFractDigit);
		i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes*precision / Math.pow(1024, i))/precision + ' ' + sizes[i];
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
		},

		getMemUsage: function() {
			if (window.performance && window.performance.memory) {
				return bytesToSize(window.performance.memory.totalJSHeapSize);
			} else {
				return 'performance.memory missing';
			}
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
},{}]},{},[1]);
