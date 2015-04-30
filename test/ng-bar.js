(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){
    var utils = require('./utils.js')();
    
    var cssString = "#ng-bar-wrap {\n  width: 100%;\n  position: fixed;\n  bottom: 0px;\n  z-index: 9999;\n  height: 32px;\n  font-family: Verdana;\n  font-size: 12px;\n  border:1px solid #11163E;\n  background-color: #FFF;\n\n/*  width:100%;\n  height: 24px;\n  position:fixed;\n  left:0;\n  right:0;\n  bottom:0;\n  padding:0 40px 10px 0;\n  font-family: Verdana;*/\n}\n#ng-bar {\n  margin-left: 24px;\n  margin-bottom: 28px;\n}\n\n#ng-bar>div {\n  padding: 2px 10px;\n  font-size: 12px;\n  display: block;\n  float: left;\n  border-right: 1px solid #000;\n  position: relative;\n  cursor: pointer;\n}\n#ng-bar h4 {\n  margin: 8px 8px;\n  font-family: Verdana;\n  font-size: 12px;\n}\n#ng-bar .logo {\n  float: right;\n  color: ##627E96;\n}\n#ng-bar-onoff {\n  width: 28px;\n  position: fixed;\n  bottom: 0px;\n  left: 0px;\n  z-index: 9999;\n  height: 32px;\n\n  padding: 4px;\n  line-height: 24px;\n  font-size: 14px;\n  font-weight: bold;\n  background: #EEE;\n  border: 1px solid #11163E;\n  border-left: none;\n  // border-radius: 0 4px 4px 0;\n}\n#ng-bar-onoff:hover {\n  background: #EFEEEF;\n}\n#ng-bar .ngbar-app-name {\n  margin-left: 8px;\n}\n\n#ng-bar .sub {\n  display: none;\n  position: absolute;\n  bottom: 32px;\n  left: 0;\n  margin-bottom: 2px;\n  border: 1px solid #ccc;\n  max-height: 300px;\n  min-height: 40px;\n  min-width: 180px;\n  overflow-x: auto;\n  overflow-y: auto;\n  background: #fff !important;\n  color: #111111 !important;\n  padding: 4px 20px 4px 10px;\n}\n#ng-bar .active {\n  background: #C9E7F4;\n}\n#ng-bar .active .sub {\n  display: block;\n}\n\n#ng-bar .ng-bar-plugin {\n  \n}\n#ng-bar .sub ul {\n  padding-left: 15px;\n}\n#ng-bar .sub li { \n  list-style-type: none;\n  white-space: nowrap;\n}\n#ng-bar li.has-sub:hover:after {\n  content: '▶';\n  float: right;\n}\n#ng-bar li h5 {\n  background: #eee;\n  margin:2px 0;\n  padding: 4px 0;\n}\n#ng-bar .hidden, #ng-bar-wrap.hidden {\n  display: none;\n}\n#ng-bar .cnt {\n  font-weight: bold;\n  paddin-left: 10px;\n  color: #302F31;\n}\n#ng-bar table  {\n  margin: 4px 10px 4px 10px;\n}\n#ng-bar .nw td, #ng-bar .nw th {\n  white-space: nowrap;\n}\n\n#ng-bar .errors {\n  background: #ff0000;\n  color: #ffffff;\n}\n";

    // var _ = require('lodash');

    var ngBarPlugins = [
        require('./plugins/angular-info.js'),
        require('./plugins/memory-usage.js'),
        require('./plugins/scopes-info.js'),
        require('./plugins/angular-services.js'),
        require('./plugins/routes.js'),
        require('./plugins/forms.js')
    ];

    if (typeof window.angular === 'undefined') {
        throw 'No Angular, No Toolbar';
    }


    function NgBar() {}
    NgBar.prototype.version = '1.0.6';

    NgBar.prototype.init = function() {     
        this._createContainer();
        this._initPlugins();
    };
    /**
     * Create main container
     */
    NgBar.prototype._createContainer = function() {
        var body = document.getElementsByTagName('body')[0],
            wrap = document.createElement('div'),
            self = this;

        wrap.id = 'ng-bar-wrap';
        body.appendChild(wrap);

        this._container = document.createElement('div');
        this._container.id = 'ng-bar';
        wrap.appendChild(this._container);

        var logo = document.createElement('div');
        logo.className = 'logo';
        logo.innerHTML = '<h4>v.'  + angular.version.full + ' &nbsp; <a href="https://github.com/lotas/ng-bar">ng-bar</a></h4>';
        this._container.appendChild(logo);

        var isHidden = localStorage.getItem('ng-bar.is') === '1';

        var onoff = document.createElement('div');
        onoff.id = 'ng-bar-onoff';
        onoff.innerHTML = isHidden ? '&rarr;' : '&larr;';
        body.appendChild(onoff);
        if (isHidden) {
            angular.element(wrap).addClass('hidden');
        }
        angular.element(onoff).on('click', function(){
            isHidden = !isHidden;
            onoff.innerHTML = isHidden ? '&rarr;' : '&larr;';
            angular.element(wrap).toggleClass('hidden');
            localStorage.setItem('ng-bar.is', isHidden ? '1' : '0');
        });

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
},{"./plugins/angular-info.js":2,"./plugins/angular-services.js":3,"./plugins/forms.js":4,"./plugins/memory-usage.js":5,"./plugins/routes.js":6,"./plugins/scopes-info.js":7,"./utils.js":8}],2:[function(require,module,exports){
var utils = require('../utils.js')();


function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4><div class="sub" id="ngbar-app-deps"></div>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();
		var deps = buildDeps(mainModule);

		elm.innerHTML = '<h4>ng-app <span class="ngbar-app-name"><strong>' + mainModule + '</strong></h4>' + 
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

},{"../utils.js":8}],3:[function(require,module,exports){
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
            listElm = document.getElementById('ngbar-services-list'),
            groups = {};

        angular.forEach(services, function(obj, name) {
            if (angular.isUndefined(name)) {
                return;
            }
            if (angular.isUndefined(groups[obj[0]])) {
                groups[obj[0]] = [];
            }

            groups[obj[0]].push(name);
            names.push(name);
            // console.log(obj);
        });        
        document.getElementById('ngbar-services').innerHTML = names.length;

        names.sort();

        var html = '';
        angular.forEach(groups, function(items, group) {
            html += '<li><h5>' + group + '</h5></li>';
            items.sort();
            angular.forEach(items, function(name) {
                html += '<li class="has-sub" data-service="' + name + '"><a data-service="' + name + '">' + name + '</a></li>';
            });
        });
        listElm.innerHTML = '<ul id="ngbar-services-ul">' + html + '</ul>';

        angular.element(listElm).on('click', function(e){
            var elm = angular.element(e.toElement),
                serviceName = elm.attr('data-service'),
                subElm = document.getElementById('ngbar-services-sub'),
                list = document.getElementById('ngbar-services-list');

            if (serviceName && services[serviceName]) {
                document.getElementById('ngbar-services-details').innerHTML = buildServiceDetails(services[serviceName][1]);
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
    } else if (angular.isString(service)) {
        return '<li><b>"' + service + '"</b></li>';
    } else {
        angular.forEach(service, function(obj, name) {
            if (typeof obj === 'function') {
                callables += '<li>&nbsp; ' + name + '</li>';
            }
        });

        if (callables) {
            callables = '<li><b>Methods:</b></li>' + callables;
        } else {
            callables = '<li><pre>' + JSON.stringify(service, null, 2) + '</pre></li>';
        }
    }
    return callables === '' ? '<i>no info</i>' : callables;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":8}],4:[function(require,module,exports){
var utils = require('../utils.js')();


/**
 * 
 */
function initPlugin(elm) {
	var handlerInstalled = false;
    elm.innerHTML = '<h4>Forms: <span id="ngbar-forms">...</span></h4><div class="sub" id="ngbar-forms-info"></div>';

    setTimeout(function showFormsInfo(){
    	var forms = [];
    	angular.forEach(document.querySelectorAll('form'), function(form) { 
    		forms.push(form); 
    	});
    	angular.forEach(document.querySelectorAll('ng-form'), function(form) { 
    		forms.push(form); 
    	});
    	// console.log(forms);
        document.getElementById('ngbar-forms').innerHTML = forms.length;

        if (hasErrors(forms)) {
        	angular.element(elm).addClass('errors');
        } else {
        	angular.element(elm).removeClass('errors');
        }

        var info = document.getElementById('ngbar-forms-info')
        info.innerHTML = '<ul>' + getFieldsInfo(forms) + '</ul>';

        if (!handlerInstalled) {
        	handlerInstalled = true;
	        angular.element(info).on('click', function(e) {
	        	if (e.toElement.attributes && e.toElement.attributes['name']) {
	        		var elm = document.querySelector('[name="' + e.toElement.attributes['name'].value + '"]');
	        		elm.focus();
	        	}
	        	return false;
	        });
	    }

        setTimeout(showFormsInfo, 1000);
    }, 1000);
}

function getFieldsInfo(forms) {
	var html = '';
	
	angular.forEach(forms, function(form) {
		var name = form.name || form.attributes['name'].value,
			ngForm = angular.element(form).scope()[name];

		if (!ngForm) {
			return false;
		}

		html += '<li><h5>' + name + '</li></h5>';

		// enumerate fields
		angular.forEach(ngForm, function(obj, name) {
			if (name && name.charAt(0) !== '$') {
				html += '<li '+(obj && obj.$invalid ? 'class="errors"' : '')+' name="' + name + '">' + name + ' ' + extractValidators(obj) + '</li>';
			}
		});
	});

	return html;
}

function extractValidators(elm) {
	if (!elm || !elm.$error) {
		return '';
	}
	var data = [];

	angular.forEach(elm.$error, function(val, name) {
		data.push(name);
	});

	return '[ ' + data.join(', ') + ' ]';
}

function hasErrors(forms) {
	var hasErrors = false;

	angular.forEach(forms, function(form) {
		if (form && form.className && form.className.match(/ng-invalid/)) {
			hasErrors = true;
		}
	});

	return hasErrors;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":8}],5:[function(require,module,exports){
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

},{"../utils.js":8}],6:[function(require,module,exports){
var utils = require('../utils.js')();

/**
 *  Routes debug 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Routes: <span id="ngbar-router">...</span></h4><div class="sub" id="ngbar-router-routes"></div>';

    setTimeout(function(){

        var routerInfo = document.getElementById('ngbar-router'),
            routesList = document.getElementById('ngbar-router-routes');

        // detect routing: angular or ui-router
        var router = detectRouter();
        routerInfo.innerHTML = router;

        if (router === 'ui') {
            var routes = enumerateUiRoutes();
            routerInfo.innerHTML += ' (' + routes[1].length + ')';
            routesList.innerHTML = '<h5>ui-router routes</h5><table>' + routes[0] + '</table>';         
        } else {
            routesList.innerHTML = 'TODO '+ router;
        }
        
    }, 1000);
}

function enumerateUiRoutes() {
    var html = '',
        $state = utils.getService('$state'),
        routes = $state.get(),
        names = [],
        routesByName = {};

    // first run - collect routes
    angular.forEach(routes, function(route) {
        names.push(route.name);
        routesByName[route.name] = route;
    });

    // 2nd run - collect full urls (with parent)
    angular.forEach(routes, function(route) {
        var url = $state.href(route.name, null, {absolute: true}),
            viewUrl = $state.href(route.name, null, {absolute: false});

        if (url) {
            html += '<tr class="nw"><th>'+ route.name + '</th><td><a href="' + url + '">' + viewUrl + '</a></td></tr>';
        }
    });

    return [html, names, routesByName];
}

function enumerateNgRoutes() {
    return 'TODO';
}

function detectRouter() {
    try {
        angular.module('ngRoute');      
        return 'ng';
    } catch (e) {}

    try {
        angular.module('ui.router');
        return 'ui';
    } catch (e) {}

    return 'none';
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":8}],7:[function(require,module,exports){
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

},{"../utils.js":8}],8:[function(require,module,exports){
var NgBarUtils = function() {
  var angular = window.angular;

  function _getRootElm() {
    return angular.element(document);
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
      var rootScope = angular.element(document).injector().get('$rootScope');

      var cnt = 0,
          watchers = 0;

      iterateScopes(rootScope, function(scope) {
        cnt++;
        watchers += getWatchersFromScope(scope).length;
      });

      return {count: cnt, watchers: watchers};
    },

    getService: function(service) {
      return angular.element(document).injector().get(service);
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
},{}]},{},[1]);
