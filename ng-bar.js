(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    var utils = require('./utils.js')();
    
    var cssString = "#ng-bar-wrap {\n\twidth: 100%;\n\tposition: fixed;\n\tbottom: 0px;\n\tz-index: 9999;\n\theight: 32px;\n\tfont-family: Verdana;\n\tfont-size: 12px;\n\tborder:1px solid #11163E;\n\tbackground-color: #D6F3FF;\n\n/*\twidth:100%;\n\theight: 24px;\n\tposition:fixed;\n\tleft:0;\n\tright:0;\n\tbottom:0;\n\tpadding:0 40px 10px 0;\n\tfont-family: Verdana;*/\n}\n#ng-bar {\n\tmargin-bottom: 28px;\n}\n\n#ng-bar>div {\n\tpadding: 2px 10px;\n\tfont-size: 12px;\n\tdisplay: block;\n\tfloat: left;\n\tborder-right: 1px solid #000;\n\tposition: relative;\n\tcursor: pointer;\n}\n#ng-bar h4 {\n\tmargin: 8px 8px;\n\tfont-family: Verdana;\n\tfont-size: 12px;\n}\n#ng-bar .logo {\n\tfloat: right;\n\tcolor: ##627E96;\n}\n#ng-bar .ngbar-app-name {\n\tmargin-left: 8px;\n}\n\n#ng-bar .sub {\n\tdisplay: none;\n\tposition: absolute;\n\tbottom: 32px;\n\tleft: 0;\n\tmargin-bottom: 2px;\n\tborder: 1px solid #ccc;\n\tmax-height: 300px;\n\tmin-height: 40px;\n\tmin-width: 180px;\n\toverflow-y: auto;\n\tbackground: #fff;\n\tpadding-right:20px;\n}\n#ng-bar .active {\n\tbackground: #C9E7F4;\n}\n#ng-bar .active .sub {\n\tdisplay: block;\n}\n\n#ng-bar .ng-bar-plugin {\n\t\n}\n#ng-bar .sub ul {\n\tpadding-left: 15px;\n}\n#ng-bar .sub li { \n\tlist-style-type: none;\n\twhite-space: nowrap;\n}\n#ng-bar li.has-sub:hover:after {\n\tcontent: '▶';\n\tfloat: right;\n}\n#ng-bar .hidden {\n\tdisplay: none;\n}\n#ng-bar .cnt {\n\tfont-weight: bold;\n\tpaddin-left: 10px;\n\tcolor: #302F31;\n}";

    // var _ = require('lodash');

    var ngBarPlugins = [
        require('./plugins/angular-info.js'),
        require('./plugins/memory-usage.js'),
        require('./plugins/scopes-info.js'),
        require('./plugins/angular-services.js'),
        require('./plugins/forms.js')
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
        logo.innerHTML = '<h4><a href="https://github.com/lotas/ng-bar">ng-bar ' + this.version + '</a></h4>';
        this._container.appendChild(logo);

        var _styles = document.createElement('style');
        _styles.innerHTML = cssString;
        body.appendChild(_styles);
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
            elm.className = 'ng-bar-plugin';
            self._container.appendChild(elm);
            plugin._elm = elm;
            plugin(elm);

            angular.element(elm).on('click', self.elmClickHandler);

            self.plugins.push(plugin);
        });
    };
    NgBar.prototype.elmClickHandler = function(e) {
        var elm = angular.element(e.toElement);

        if (utils.hasParentWithClass(elm, 'sub')) {
            return false;
        }

        // find parent 
        while (elm && !elm.hasClass('ng-bar-plugin')) {
            elm = elm.parent();
        }

        elm.toggleClass('active');
    };

    window.NgBar = new NgBar();
    window.NgBar.init();
})();
},{"./plugins/angular-info.js":2,"./plugins/angular-services.js":3,"./plugins/forms.js":4,"./plugins/memory-usage.js":5,"./plugins/scopes-info.js":6,"./utils.js":7}],2:[function(require,module,exports){
var utils = require('../utils.js')();


function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4><div class="sub" id="ngbar-app-deps"></div>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();
		var deps = buildDeps(mainModule);

		elm.innerHTML = '<h4 title="'+angular.version.codeName+'">ng ' + angular.version.full + 
			 ' <span class="ngbar-app-name">App: <strong>' + mainModule + '</strong></h4>' + 
			 '<div class="sub" id="ngbar-app-deps">' + deps + '</div>' + 
			 '<div class="sub" style="display: none;" id="ngbar-app-services"><ul id="ngbar-app-services-details"></ul></div>';

	    angular.element(document.getElementById('ngbar-app-deps')).on('click', onDepClickHandler);
	}, 500);
}

function buildDeps(mod) {
	var html = '<li><b>Requires:</b></li>';

	angular.forEach(angular.module(mod).requires, function(elm) {
		// those hacks probably wouldn't be appreciated much
		var servicesCount = angular.module(elm)._invokeQueue.length;

		html += '<li class="has-sub" data-dep="' + elm + '">' + elm + ' <span class="cnt">' + servicesCount + '</span></li>';
	});

	return '<ul>' + html + '</ul>';
}
function buildDepDetails(mod) {
	var html = '<li><b>' + mod + ' Services:</b></li>';

	angular.forEach(angular.module(mod)._invokeQueue, function(obj, name) {
		html += '<li>' + obj[2][0] + '</li>';
	});

	return html;
}

function onDepClickHandler(e){
    var elm = angular.element(e.toElement),
        depName = elm.attr('data-dep'),
        subElm = document.getElementById('ngbar-app-services'),
        list = document.getElementById('ngbar-app-deps');

    if (depName) {
        document.getElementById('ngbar-app-services-details').innerHTML = buildDepDetails(depName);
        subElm.style.display = '';

        // adjust second sub position
        subElm.style.marginLeft = list.offsetWidth + 'px';
        subElm.style.height = list.offsetHeight + 'px';
    } else {
        subElm.style.display = 'none';
    }

    e.stopImmediatePropagation();
    return false;
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}

},{"../utils.js":7}],3:[function(require,module,exports){
var utils = require('../utils.js')();

/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Services: <span id="ngbar-services">...</span></h4>' +
        '<div class="sub" id="ngbar-services-list"></div>' +
        '<div class="sub" style="display: none;" id="ngbar-services-sub"><ul id="ngbar-services-details"></ul></div>';

    setTimeout(function(){
        var names = [], 
            services = utils.enumerateServices(utils.guessMainModule()),
            listElm = document.getElementById('ngbar-services-list');

        angular.forEach(services, function(obj, name) {
            if (angular.isUndefined(name)) {
                return;
            }
            names.push(name);
            // console.log(obj);
        });        
        document.getElementById('ngbar-services').innerHTML = names.length;

        names.sort();

        var html = '';
        angular.forEach(names, function(name) {
            html += '<li class="has-sub" data-service="' + name + '"><a data-service="' + name + '">' + name + '</a></li>';
        });
        listElm.innerHTML = '<ul id="ngbar-services-ul">' + html + '</ul>';

        angular.element(listElm).on('click', function(e){
            var elm = angular.element(e.toElement),
                serviceName = elm.attr('data-service'),
                subElm = document.getElementById('ngbar-services-sub'),
                list = document.getElementById('ngbar-services-list');

            if (serviceName && services[serviceName]) {
                document.getElementById('ngbar-services-details').innerHTML = buildServiceDetails(services[serviceName]);
                subElm.style.display = '';

                // adjust second sub position
                subElm.style.marginLeft = list.offsetWidth + 'px';
                subElm.style.height = list.offsetHeight + 'px';
            } else {
                subElm.style.display = 'none';
            }

            e.stopImmediatePropagation();
            return false;
        });


    }, 1000);
}


function buildServiceDetails(service) {
    var callables = '';
    if (typeof service === 'function') {
        return '<li><b>Factory method</b></li><li>' + service.toString().substr(0, 100) + ' ...</li>';
    } else {
        angular.forEach(service, function(obj, name) {
            if (typeof obj === 'function') {
                callables += '<li>&nbsp; ' + name + '</li>';
            }
        });
    }
    return callables === '' ? '<i>no methods</i>' : '<li><b>Methods:</b></li>' + callables;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":7}],4:[function(require,module,exports){
var utils = require('../utils.js')();


/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Forms: <span id="ngbar-forms">...</span></h4>';

    setTimeout(function(){
        

    }, 1000);
}


if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":7}],5:[function(require,module,exports){
var utils = require('../utils.js')();


/**
 * Chrome only
 * Chrome uses non-standard window.performance.memory
 * May be required to use --enable-precise-memory-info flag.
 * [chrome.executable] --args --enable-precise-memory-info 
 */
function initPlugin(elm) {
	elm.innerHTML = '<h4><span id="ngbar-mem">...</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-mem').innerHTML = utils.getMemUsage();
		setTimeout(calcThem, 1000);
	}, 1000);
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}

},{"../utils.js":7}],6:[function(require,module,exports){
var utils = require('../utils.js')();


function initPlugin(elm) {
	elm.innerHTML = '<h4>Scopes: <span id="ngbar-scopes">...</span> | Watchers: <span id="ngbar-watchers">..</span></h4>';

	setTimeout(function calcThem(){
		var scopesInfo = utils.getScopesInfo()
		document.getElementById('ngbar-scopes').innerHTML = scopesInfo.count;
		document.getElementById('ngbar-watchers').innerHTML = scopesInfo.watchers;
		setTimeout(calcThem, 500);
	}, 500);
}

if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}

},{"../utils.js":7}],7:[function(require,module,exports){
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
        r[a[2][0]] = inj(a[2][0]); 
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
},{}]},{},[1]);
