(function(){
	var utils = require('./utils.js');
	var cssString = require('fs').readFileSync(__dirname + '/ng-bar.css', 'utf8');

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