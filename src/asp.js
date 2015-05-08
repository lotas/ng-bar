/**
 * Application-Specific Plugins
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
 */

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
        cnt = angular.isString(plugin.cnt) ? cnt : '..';
 
    pluginId++;

    elm.innerHTML = '<h4><i class="help">' + plugin.title + ':</i>' + 
      '<span id="' + cntId + '">' + cnt + '</span></h4>' +
      '<div class="sub" id="' + subId + '"></div>';


    if (angular.isFunction(plugin.cnt)) {
      var fn = plugin.cnt;
      setTimeout(function updCnt(){
        document.getElementById(cntId).innerHTML = fn();
      }, 1000);
    }

    if (plugin.items) {
      setTimeout(function calcThem(){
        var sub = document.getElementById(subId);
        sub.innerHTML = '';
        angular.forEach(plugin.items, function(subItem) {
          var elm = document.createElement('div');

          if (angular.isString(subItem)) {
            elm.innerHTML = subItem;
          } else if (subItem.title) {
            elm.innerHTML = subItem.title;
            if (subItem.onclick) {
              elm.addEventListener(subItem.onclick);
            }
            if (subItem.info) {
              elm.innerHTML += "\n<pre>" + JSON.stringify(subItem.info, null, 2) + "</pre>";
            }
          }

          sub.appendChild(elm);
        });

      }, 100);
    }

    return elm;
  }

};

if (typeof module !== "undefined" && module.exports) {
  module.exports = NgBarASP;
}