(function(){
    var utils = require('./utils.js')();
    var fs = require('fs');
    var cssString = fs.readFileSync(__dirname + '/ng-bar.css', 'utf8');
    var Plugin = require('./plugin.js');
    var ngBarASP = require('./asp.js');

    // var _ = require('lodash');

    var ngBarPlugins = [
        require('./plugins/angular-info.js'),
        require('./plugins/memory-usage.js'),
        require('./plugins/angular-services.js'),
        require('./plugins/forms.js'),
        require('./plugins/routes.js'),
        require('./plugins/route-info.js')
    ];

    if (typeof window.angular === 'undefined') {
        throw 'No Angular, No Toolbar';
    }


    function NgBar() {}
    NgBar.prototype.version = '1.1.2';

    NgBar.prototype.init = function() { 
        this.plugins = [];
        this._createContainer();
        this._initPlugins();

        this._pollUpdates();
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

        var _styles = document.createElement('style');
        _styles.innerHTML = cssString;
        body.appendChild(_styles);

        this._container = document.createElement('div');
        this._container.id = 'ng-bar';
        wrap.appendChild(this._container);

        var logo = document.createElement('div');
        logo.className = 'logo';
        logo.innerHTML = '<span class="angular">' + angular.version.full + '</span><a class="github" href="https://github.com/lotas/ng-bar"></a> ';
        this._container.appendChild(logo);

        var isHidden = localStorage.getItem('ng-bar.is') === '1';

        var onoff = document.createElement('div');
        onoff.id = 'ng-bar-onoff';
        onoff.innerHTML = isHidden ? '&rarr;' : '&larr;';
        body.appendChild(onoff);
        if (isHidden) {
            angular.element(wrap).addClass('hidden');
        }
        onoff.addEventListener('click', function(){
            isHidden = !isHidden;
            onoff.innerHTML = isHidden ? '&rarr;' : '&larr;';
            angular.element(wrap).toggleClass('hidden');
            localStorage.setItem('ng-bar.is', isHidden ? '1' : '0');
        });

        // Detect if debug info was disabled
        if (angular.isUndefined(angular.element(document).scope())) {
            console.info('Looks like your angular app was compiled without compile info.' + 
                "\n\nThis is defenitely good for an end user!\nBut a little bit not helpfull for developers and for this debug toolbar.\nSee https://docs.angularjs.org/guide/production#disabling-debug-data\n" +
                "You can just click on a red link saying 'Reload with debug'\nOr do it yourself here, by running angular.reloadWithDebugInfo()\n");

            var enableDebug = document.createElement('a');
            enableDebug.className = 'enable-debug';
            enableDebug.innerHTML = 'reloadWithDebugInfo()';
            enableDebug.addEventListener('click', angular.reloadWithDebugInfo);
            this._container.appendChild(enableDebug);
        }
    };
    /**
     * Init plugins & create containers for them
     * @return {[type]} [description]
     */
    NgBar.prototype._initPlugins = function() {
        var self = this;
        this.plugins = [];

        angular.forEach(ngBarPlugins, function(plugin) {
            if (angular.isArray(plugin)) {
                return self.initASP(plugin);
            } else if (angular.isFunction(plugin) && plugin.asp === true) {
                return self.initASP(plugin()); // delayed init of function
            }

            var elm = document.createElement('div');
            elm.className = 'ng-bar-plugin';
            self._container.appendChild(elm);
            plugin._elm = elm;
            plugin(elm);

            elm.addEventListener('click', self.elmClickHandler);

            self.plugins.push(plugin);
        });

        if (typeof window.NgBarASP !== 'undefined') {
            self.initASP(window.NgBarASP);
        }
    };
    /**    
     * Application Specific Plugins
     */
    NgBar.prototype.initASP = function(plugins) {
        var self = this;
        angular.forEach(plugins, function(pluginDef) {
            var plugin = ngBarASP.createInterface(pluginDef);
            if (!plugin) {
                return;
            }

            plugin.getElement().addEventListener('click', self.elmClickHandler);

            self._container.appendChild(plugin.getElement());
            self.plugins.push(plugin);
        });
    };
    NgBar.prototype.elmClickHandler = function(e) {
        var elm = angular.element(e.target);

        if (utils.hasParentWithClass(elm, 'sub')) {
            return false;
        }

        // find parent 
        while (elm && !elm.hasClass('ng-bar-plugin')) {
            elm = elm.parent();
        }

        elm.toggleClass('active');
    };
    NgBar.prototype._pluginUpdateInterval = 1000;
    NgBar.prototype._pollUpdates = function() {
        var self = this;
        setTimeout(function updCnts(){
            angular.forEach(self.plugins, function(plugin){
                if (typeof plugin.updateCnt === 'function') {
                    plugin.updateCnt();
                }
                
                if (typeof plugin.renderItems === 'function') {
                    plugin.renderItems();
                }
            });

            setTimeout(updCnts, 1000);
        }, 1000);
    };


    if (document.loaded) {
        runNgBar();
    } else if (window.addEventListener) {  
        window.addEventListener('load', runNgBar, false);
    } else {
        window.attachEvent('onload', runNgBar);
    }

    function runNgBar() {
        window.NgBar = new NgBar();
        window.NgBar.init();
    }
})();