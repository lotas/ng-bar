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
            wrap = document.createElement('div'),
            self = this;

        wrap.id = 'ng-bar-wrap';
        body.appendChild(wrap);

        this._container = document.createElement('div');
        this._container.id = 'ng-bar';
        wrap.appendChild(this._container);

        var logo = document.createElement('div');
        logo.className = 'logo';
        logo.innerHTML = '<h4>angular.js v.'  + angular.version.full + ' &nbsp; <a href="https://github.com/lotas/ng-bar">∆</a></h4>';
        this._container.appendChild(logo);

        var onoff = document.createElement('div');
        onoff.id = 'ng-bar-onoff';
        onoff.innerHTML = '&lt;';
        body.appendChild(onoff);
        angular.element(onoff).on('click', function(){
            onoff.innerHTML = onoff.innerHTML === '&lt;' ? '&gt;' : '&lt;';
            angular.element(wrap).toggleClass('hidden');
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