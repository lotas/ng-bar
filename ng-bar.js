(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
	var utils = require('./utils.js');
	var cssString = "#ng-bar {\n\twidth:100%;\n\theight: 32px;\n\tposition:fixed;\n\tleft:0;\n\tright:0;\n\tbottom:0;\n\tpadding:0 40px 10px 0;\n\tborder:1px solid #11163E;\n\tbackground-color: #D6F3FF;\n}\n\n#ng-bar>div {\n\tpadding: 2px 10px; \n\tfont-size: 12px;\n\tdisplay: inline-block;\n\tmargin-right: 10px;\n}";

	// var _ = require('lodash');

	var ngBarPlugins = [
		require('./plugins/angular-info.js'),
		require('./plugins/memory-usage.js'),
		require('./plugins/scope-watches.js')
	];

	if (typeof window.angular === 'undefined') {
		throw 'No Angular, No Toolbar';
	}


	function NgBar() {}

	NgBar.prototype.init = function() {		
		this._createContainer();
		this._initPlugins();
	};
	/**
	 * Create main container
	 */
	NgBar.prototype._createContainer = function() {
		var body = document.getElementsByTagName('body')[0];

		this._container = document.createElement('div');
		this._container.id = 'ng-bar';
		body.appendChild(this._container);

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
},{"./plugins/angular-info.js":2,"./plugins/memory-usage.js":3,"./plugins/scope-watches.js":4,"./utils.js":5}],2:[function(require,module,exports){
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
var MemoryUsagePlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = '<b>Memory</b>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = MemoryUsagePlugin;
}

},{}],4:[function(require,module,exports){
var ScopeWatchesPlugin = {
	init: initPlugin
};

function initPlugin(elm) {
	elm.innerHTML = 'Watches: <b>333</b>';
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = ScopeWatchesPlugin;
}

},{}],5:[function(require,module,exports){
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
},{}]},{},[1]);
