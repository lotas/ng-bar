/**
 * Application-Specific Plugins
 *
 *
 * ASP structure: 
 * {
 *   title: 'Will be shown on hover',
 *   background: 'optional background for counter area',
 *   icon: 'className', // or nothing
 *   cnt: 42, // number
 *   cnt: 'value', // or some string
 *   cnt: function(){ return currentValueOfSomething(); }, // or something callable
 *   items: [ // some array of values
 *     'string',
 *     'or number'
 *   ], // or an array of objects
 *   items: [{
 *       title: 'key',
 *       info: 'some details',
 *       onclick: function() {some handler}
 *     }, {
 *       title: 'key',
 *       info: 'some'
 *     }
 *   ], // or just an object
 *   items: userObject     
 * }
 *
 * Example:
 *
 *   var aspPlugins = [{
 *        title: 'i18n',
 *        cnt: function() { return $translate.use(); },
 *        items: [
 *            '<a onclick="xlSetLocale(\'de\')">de</a>',
 *            '<a onclick="xlSetLocale(\'es\')">es</a>',
 *            '<a onclick="xlSetLocale(\'en\')">en</a>'
 *        ]
 *    }];
 *    if (typeof $window.NgBar !== 'undefined') {
 *      $window.NgBar.initASP(aspPlugins);
 *    } else { // delayed init 
 *        $window.NgBarASP = ($window.NgBarASP || []).concat(aspPlugins);
 *    }
 *
 * 
 *   User.identity().then(function(id){
 *           var user = id;
 *
 *            // let's add our plugins
 *           var aspPlugins = [{
 *               title: 'User',
 *               cnt: user.username,
 *               items: user
 *           }];
 *
 *           if (typeof $window.NgBar !== 'undefined') {
 *               $window.NgBar.initASP(aspPlugins);
 *           } else {
 *               $window.NgBarASP = ($window.NgBarASP || []).concat(aspPlugins);
 *           }
 *       });
 * 
 */

var Plugin = require('./plugin.js');
var utils = require('./utils.js')();
var pluginId = 1;

var NgBarASP = {

  /**
   * Create an interface for a single item
   * 
   * @return {element} 
   */
  createInterface: function(plugin) {
    if (!plugin || !plugin.title) {
      return false;
    }

    var elm = document.createElement('div'),
        cntId = 'ngbar-asp-' + pluginId,
        subId = 'ngbar-asp-sub-' + pluginId,
        subSubId = 'ngbar-asp-ssub-' + pluginId,
        optStyles = plugin.background ? ' style="background:' + plugin.background + '" ' : '',
        cnt = angular.isString(plugin.cnt) ? plugin.cnt : '..';

    var pluginInstance = new Plugin(cntId, plugin, elm, pluginId);
 
    elm.className = 'ng-bar-plugin';

    pluginId++;

    elm.innerHTML = '<h4><i class="help">' + plugin.title + ':</i>' + 
      '<span id="' + cntId + '"' + optStyles + '>' + cnt + '</span></h4>';

    if (plugin.items) {
      // main items container
      elm.innerHTML += '<div class="sub" id="' + subId + '"></div>';
      // one for sub-items
      elm.innerHTML += '<div class="sub hidden" id="' + subSubId + '"></div>';      

      setTimeout(pluginInstance.renderItems.bind(pluginInstance), 1000);
    }

    return pluginInstance;
  }

};

if (typeof module !== "undefined" && module.exports) {
  module.exports = NgBarASP;
}