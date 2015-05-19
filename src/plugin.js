
/**
 * Plugin interface
 * 
 * @param {String} id  id of counter element (main plugin info)
 * @param {Object} def definition of plugin 
 * @param {Element} elm DOM element representing 
 */
var Plugin = function(id, def, elm) {
  this.id = id;
  this.elm = elm;
  this.def = def;
};

Plugin.prototype.getElement = function() {
	return this.elm;
};

/**
 * Update counter - redraw it's value
 */
Plugin.prototype.updateCnt = function() {
  if (angular.isFunction(this.def.cnt)) {
    document.getElementById(this.id).innerHTML = this.def.cnt();
  }
};


if (typeof module !== "undefined" && module.exports) {
  module.exports = Plugin;
}