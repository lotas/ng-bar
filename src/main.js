(function(){
    var utils = require('./utils.js')();
    var fs = require('fs');
    var cssString = fs.readFileSync(__dirname + '/ng-bar.css', 'utf8');

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
    NgBar.prototype.version = '1.0.10';

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
            var elm = document.createElement('div');
            elm.className = 'ng-bar-plugin';
            self._container.appendChild(elm);
            plugin._elm = elm;
            plugin(elm);

            elm.addEventListener('click', self.elmClickHandler);

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