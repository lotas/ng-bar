(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}],2:[function(require,module,exports){
(function(){
    var utils = require('./utils.js')();
    
    var cssString = "#ng-bar-wrap {\n  width: 100%;\n  position: fixed;\n  bottom: 0px;\n  z-index: 9999;\n  height: 32px;\n  font-family: Verdana;\n  font-size: 12px;\n  border: 1px solid #11163e;\n  background-color: #ffffff;\n}\n#ng-bar-wrap.hidden {\n  display: none;\n}\n#ng-bar-onoff {\n  width: 20px;\n  position: fixed;\n  bottom: 0px;\n  left: 0px;\n  z-index: 9999;\n  height: 32px;\n  padding: 0 0 0 6px;\n  line-height: 32px;\n  font-size: 14px;\n  font-weight: bold;\n  background: #eeeeee;\n  border: 1px solid #11163e;\n  border-left: none;\n  cursor: pointer;\n}\n#ng-bar-onoff:hover {\n  background: #EFEEEF;\n}\n#ng-bar {\n  margin-left: 24px;\n  margin-bottom: 28px;\n  color: #111111;\n}\n#ng-bar > div {\n  padding: 2px 5px;\n  font-size: 12px;\n  display: block;\n  float: left;\n  border-right: 1px solid #000;\n  position: relative;\n  cursor: pointer;\n}\n#ng-bar .hidden {\n  display: none;\n}\n#ng-bar .errors {\n  background: #ff0000;\n  color: #ffffff;\n}\n#ng-bar .enable-debug {\n  line-height: 28px;\n  color: #ffffff;\n  background: #ff0000;\n  padding: auto 8px;\n}\n#ng-bar .angular {\n  background: url(\"data:image/png;base64,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\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n  margin-left: 10px;\n  margin-right: 10px;\n}\n#ng-bar .logo {\n  float: right;\n  color: ##627E96;\n  font-size: 12px;\n  line-height: 24px;\n}\n#ng-bar .github {\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAXCAYAAAAV1F8QAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUCDQsTIsdI5wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAPDSURBVEjHxVZtaFtVGH5u7k2WtEmaYIj92JdrdZudVj2UKZmbP5SOOj82xCHMTtmPIVr0lzo/BmpbW4WKWhSVgsgcYtWBUt0UmQzRWdbZzDWmXdOun8vH2ibpkib33tzXH0lvbtJUEaMeOD/Oec95n3Pe533eczgiwn/RdDkjEhEJzZ65Iv0DcJIRj8zfGU/lzxOpXRzrpgcYI8a20e7mN6h3aIFSGvufdTl8no699jjtdjFibCsd7A3l7OWyoVPg/6yJdrV7Ncewgh1oxSv7a+dT0yN230QQ4YUriCUJepMZZY5KXFOzFvrBD/HCix9jMJHdaXB14sSb2zlLZixkTRLmxufy7htFf3czGrth/7sRFINTiKZAFh5cHkccBD1fPPYFIwSuYDLo4bx+DYoFZbuuGlYduOVAtIhJjx+pIgFFL7hxSQQtA5IufkItH00ULXKK5x10HA9AyQVKYrinB76iSlRG/5ETmJLTt0oDSdP08+lQgcU8SqylMPyFy1VmC0xcAcPoDzgXVjTpLQUxFNSuMOCGRzvQcsCFKqMOgIJkJIDpmQBmI3GICo9VZjuc5eUod1hh0AFQFjBy/C08c/gYxlU/AVwIyYDDkAFSRMREjUwb2tH52O2wBL9F23MfwLvmYbQ8fy82bK7gNuQcOQHfp4focM8sWHMbnmx8Fm8nxrGn7SzktJoQlxQNR5weRlW6TuzadyvsXBSnO1vwxbkxeHpfRfvJOZVYlXD/N9T6+ncYGjuLoy91wR3nUXnXI9huykrGlBFTGkgow2rbkrESWyr0gOTHgDeuVo2R/imIeUCJqX6MLiVwxIPzl2XAVIXNV6tqQpVN0AAZKqvr1vNqtiRlAngznJasU7PTvEzMgtkBs1pYLHCU6gBFRlLOzJVtwkY7rw2ddbTuHpYhbAw/DcdAfDnuaNqBUgAw1GNf41ro84AM1fdjb23ahb1hP26z66CEB9E3neHatRM1pkx1UEt9fJC69jBijBHb+z4NLRIRiTQ77CZvMEnKCs+DsniJPG4fhSUiSkXol9adaR/1TXTkokhL63I2JSe/pKcb0mA7Dr5LpybjKwLk91R0mL7ueIi2MkaM3Ucvfx8gufB7lMmkqIe+eq8L3Z/3YUbW4aprGW6+sRYb1zlRVmKEsFS0KAUpEcO8fxS//+bGrwPjiAKw1T2Ipw49gbtrSjithrmV/gwkhs54fjzJTvUNwOubwEzgMuYiMSxKMhTioOMFGEsssDkqsHp9NTZtuQn1rm24ZZ2FK/QCcP/P5+RfbH8A/R0GppXw1owAAAAASUVORK5CYII=\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n  width: 28px;\n  height: 28px;\n}\n#ng-bar .ngbar-app-name {\n  margin-left: 8px;\n}\n.ng-bar-plugin {\n  user-select: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n}\n.ng-bar-plugin h4 {\n  margin: 8px;\n  font-family: Verdana;\n  font-size: 12px;\n}\n.ng-bar-plugin h4 span {\n  font-weight: bolder;\n  padding: 2px 4px;\n  border: 1px solid #bbbbbb;\n  border-radius: 4px;\n  background: #eeeeee;\n}\n.ng-bar-plugin .sub {\n  display: none;\n  position: absolute;\n  bottom: 33px;\n  left: 0;\n  margin-bottom: 2px;\n  border: 1px solid #1c2466;\n  max-height: 300px;\n  min-height: 40px;\n  min-width: 180px;\n  overflow-x: auto;\n  overflow-y: auto;\n  background: #ffffff !important;\n  color: #111111 !important;\n  padding: 4px 20px 4px 10px;\n  user-select: text;\n  -moz-user-select: text;\n  -webkit-user-select: text;\n  -ms-user-select: text;\n}\n.ng-bar-plugin .sub ul {\n  padding-left: 10px;\n}\n.ng-bar-plugin .sub li {\n  list-style-type: none;\n  white-space: nowrap;\n}\n.ng-bar-plugin .sub li h5 {\n  background: #eeeeee;\n  margin: 2px 0 2px -10px;\n  padding: 4px 0 4px 10px;\n}\n.ng-bar-plugin .sub li.has-sub:hover:before {\n  content: '>';\n  float: right;\n}\n.ng-bar-plugin .sub pre {\n  padding: 2px 4px;\n  border: 1px solid #ccc;\n  background: #eee;\n  border-radius: 4px;\n}\n.ng-bar-plugin .cnt {\n  font-weight: bold;\n  paddin-left: 10px;\n  color: #333333;\n}\n.ng-bar-plugin .help {\n  font-weight: normal;\n  display: none;\n}\n.ng-bar-plugin:hover .help {\n  display: inline;\n}\n.ng-bar-plugin.active {\n  background: #c9e7f4;\n}\n.ng-bar-plugin.active .sub {\n  display: block;\n}\n.ng-bar-plugin table {\n  margin: 4px 10px 4px 10px;\n}\n.ng-bar-plugin table .nw td,\n.ng-bar-plugin table .nw th {\n  white-space: nowrap;\n}\n.ng-bar-plugin .missing {\n  color: #5e5e5e;\n}\n.ng-bar-plugin h4.forms {\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAYAAACkVDyJAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUCDDQc62QVfQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAALASURBVEjH7dZfSFNRHAfw71lu/pmaBgX5MDTKB50rWEEZIUQE1UNk7EGSzKnzT9PKChph7z04w/nQNgs1ZP6hhwy0P/gS+IegqNSM1tKCjBxqLJ1zf+6vh1lru3dumvgQHTgv5x7u5/c793fOPYyIsJFNhA1u/z4YEzrg/jZEHcZ76HsxgZlFX5SvYRAnp0Fx/AJ05/awZFGUGbo/36fLqmo09jyH9asTXLRhkxcL03Z4U7cgTsRhdlBPhXkH6dSNXvriRnBVEpG/++xdfVUHSKk8RNr2MXL4KPAs6u7DzMBNylcqSbncj+p6acpD9GtOIEOXTdX/2g3IilCrykLSqr8uh9nBeiqr6cKnP0ZnntxC67hLYEk5FxwuAElbkbQJ3WvBNDWdQRgASHYXIH9n7HpWKYe5IT82GYopqmBuLEJmPGNRgeR8RxbdWSq82kZj8xwJY3oqqxbCKmE2FCNbGsAEt0UAG6e2i6UwvFwC8Bal9iWYmkooJ1HEgrEOQczUqOZhK2TowaSlbhlbHhk1QqO9g5F5jgAOc8MNpBHAxDl+TJ7Ix1YAY7BtXx52hIYxaoRGa8Kzp/Wk0VowwcMqYDaEx1YAGaSK88zYVIAMHtqMWl1nWCybWfG45xV953jxRioaEVL3X2ImARThMoufxsNraly/3Y8pD2xrOLwjo2J5OUwGNeSJIgbvLKw219/+LcKjYnk5TE0lCFTuuv2e+OhasOB9yMRIkABw/YCLg4ofih9tvptBluFYHD5zDJnSEOz38RgPCYuUYVw6cncBsLWjZWAa3jDTNyvyWYXmBONh5IT1gRn9DiBZsRfbJRAkWeASRVh400TF6lZ8BJCSngVZiiS6NScfnPYPeD+1CCTkoq5Dj5NpMZFA/3HlGOmmBn0LHo3Y4VnVIS6FLPc0Kq+U44gsNuzOZ/+vievdfgLTK1+woVmGqAAAAABJRU5ErkJggg==\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n}\n.ng-bar-plugin h4.ui-router {\n  background: url(\"data:image/png;base64,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\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n}\n.ng-bar-plugin h4.ng-route {\n  background: url(\"data:image/png;base64,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\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n}\n.ng-bar-plugin h4.services {\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUCDQUgA5QEfwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAMSSURBVEjH1VZrSNNRFP/dTcnElIw2ikyyl0qUIaxCU8tCUKKX+EBkZG5FpEUgFYY9oA9qSS8LsxZFpRQkFawPmhLiAzGJ2TLUmZJJTttqc+g29z99EfX/d9PhKujA/XLuufd3zu887mVEhL8tIvwD8XLPzIL3RQrKrxkGBwBeUiQWlePkBh/mUSQ8Gm391FDfiWGDAQaDAQZ9B5o+DGF8yhqzse4ExIZ+dQHti0qg3EcaMnEArIPoGuJbfe8YhA0AZ2wj1fEEikktpoYfDqdQjJ94O769zif5xVr8nNAsiYzH2uEGNPeNCY76YKVsC/w/v8NH04RqxUFcU51GdKCIuQRxDDynrL2F0HpQcD4xJVBfjWH+zAVdYmmsMSM+wIM6kiIxZRP82Gw5EUsCd58rRop0fhCrFCU4tTWAieZKPMM4zKNC7QKEp57H/Vd1aGysZVVlZ7F3tXgGiMloBblMvL2f1LdK8aZdh56eHgyOCDw8/AgPj4Yz32k0kLmNSjKUqBjgOyNZvR5rQtYgIikb8mgJE09GYtXh5ZNqNGlmAsBLBmVaGHwFPLNFESwze6PA2Aq9ToPG6he490KHMbfHin8QpAuZ0xbzW74Mfn9kdhm70GvinGw4YOz+gpFZjjIeiG8Ey7mUi6zUPdixeRl4fpMGd8qaYOSwiwcxVEel5Z2Ca5ciVLYTe9KUyJOHwcd5xwMY09KVA3JU6vlqyfYsHEuPQ+hiDnptDR6XPkaLkW8TfOQZKhUhzHuuKcxZ9Phlnxm6vl6FC/WqWZk1f+2HmQtRBopw1/Xssn+l5zmpKGy1zXeoQHamAteTg3jR8BLPjXSj5ZPNg7EyBm1LF8wclC6rS7Q4lhXcyELoZDN7Y11SJvbLBMUAAOJgxKYfQtK0zheHZ+NmQRyEdIGIBMsBk+YB5aQp6Orbb2QlAlmaKS86kiIjp1ZsfitZiMCN9pH6spxSTj6kdpODZt5HTqrLmdh7SZWWjNt9U6qQE1V4mhnE3Hm/3XvjvaVsW9IOam40TrzxEsRHSd39ILgZyf/wJfoNXO1bWdAV9N8AAAAASUVORK5CYII=\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n}\n.ng-bar-plugin h4.plug {\n  background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAfCAYAAAAbW8YEAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wUCDQgIg4/SyAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAALHSURBVEjH7ddRSFNRGAfw/9mc4rooViZpJSuKsE0iCCNC16tIalAgPZhb1Ax8Mc0lQYG4F52WI8npULDEJzVFyKQEDcvCCrRCM9ECrZmII6851/16kdqm3bstZwSdx8Pl/u75vu9851xGRNjoIcNfGOuEEpxTj+lu1Q2y3X9HC4L40yHrAS6ONVOBzowBHgDuYTyqg0qTOBaklXqDALCAmTknhOCEdy0QCE3MRX5ylOiLZb4C/Fg71Xd9IKcEWGs5i/1Kxv4wpwR+tIku6SvxfDECQ3w9XdP0o9gLVGhyYa3S4cAmcRAAmPg+JXx730z5OWY8438FJxwCFuEOGlBr0UPNeYLfZ3rpZuF1NL1RIOliJcqyE5iSSYRXmH9K5XnuIABvUH0BVotuNWjvIZM+H03DDkCYxYC1Dq94kER4eQzVlKDNLvJV27Nwy6KHhpN5gC77IzLpL6N92m1y90HEhUoUkjD3hGyiIoDpTjR2f8SSB/iQSnVeYGw6yirPIF4BJoouvO7EoFOqJBzoM+XA2DJJSwBcn7upJKcIHZ/cwQyU24pxPFrOJKp3GTNvJzxWIAUXfskmrs2CB3Zv8Aq0bqAIKoCf4/1oFA70Wy2eU3GZMNuMSNkqZz7uU4YwLizwZrXjJCrqipC8BiiSUwViEuKhCPDgUp/OwpHfgCIoA5eYhkMBqQKGK87B2DpJTn97r2zzMXY+c1uA8Z1Hb2MrRlaage8NX3DBFcYFZsamo+x2HjRKMN8bvuDAi2oD5TaO++0x1SmYqwuQHO1PTldAQ8Oo20GshGpPJKQuIapUI+40FIqCq1e6JhgJ7dV6mE7EsNnBTmpp70Lv4Agm7F8hhCixZedeqA9rkZqRjpR9EUzuSzR+Hm1iYMYuFhqU2yD/kmo2ABSp3uCBnuFdnqKe1h5MLTOEq7RIOxobFNCH68r/34p/EP0BIpI91X+FzxwAAAAASUVORK5CYII=\") no-repeat left top;\n  background-size: contain;\n  padding-left: 18px;\n}\n.ng-bar-plugin #ngbar-scopes {\n  margin-left: 8px;\n  background: #eaeef8;\n}\n.ng-bar-plugin #ngbar-watchers {\n  margin-left: 8px;\n  background: #FFF5F8;\n}\n";
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
    NgBar.prototype.version = '1.1.0';

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

        if (typeof window.NgBarASP !== 'undefined') {
            self.initASP(window.NgBarASP);
        }
    };
    /**    
     * Application Specific Plugins
     */
    NgBar.prototype.initASP = function(plugins) {
        var self = this;
        angular.forEach(plugins, function(plugin) {
            var elm = ngBarASP.createInterface(plugin);
            if (!elm) {
                return;
            }

            elm.className = 'ng-bar-plugin';
            elm.addEventListener('click', self.elmClickHandler);

            self._container.appendChild(elm);
            plugin._elm = elm;
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
},{"./asp.js":1,"./plugins/angular-info.js":3,"./plugins/angular-services.js":4,"./plugins/forms.js":5,"./plugins/memory-usage.js":6,"./plugins/route-info.js":7,"./plugins/routes.js":8,"./utils.js":9}],3:[function(require,module,exports){
var utils = require('../utils.js')();


function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4><div class="sub" id="ngbar-app-deps"></div>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();
		var deps = buildDeps(mainModule);

		elm.innerHTML = '<h4 class="plug" title="Application dependencies"><span class="ngbar-app-name"><strong>' + mainModule + '</strong></h4>' + 
			 '<div class="sub" id="ngbar-app-deps">' + deps + '</div>' + 
			 '<div class="sub" style="display: none;" id="ngbar-app-services"><ul id="ngbar-app-services-details"></ul></div>';

	    document.getElementById('ngbar-app-deps').addEventListener('click', onDepClickHandler);
	}, 500);
}

function buildDeps(mod) {
	var html = '<li><h5>App Dependencies:</h5></li>';

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
    var elm = angular.element(e.target),
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

},{"../utils.js":9}],4:[function(require,module,exports){
var utils = require('../utils.js')();

/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4 class="services"><i class="help">Services:</i> <span id="ngbar-services">...</span></h4>' +
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

        listElm.addEventListener('click', function(e){
            var elm = angular.element(e.target),
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

},{"../utils.js":9}],5:[function(require,module,exports){
var utils = require('../utils.js')();


/**
 *
 */
function initPlugin(elm) {
	var handlerInstalled = false;
    elm.innerHTML = '<h4 class="forms"><i class="help">Forms:</i> <span id="ngbar-forms">...</span></h4><div class="sub" id="ngbar-forms-info"></div>';

    setTimeout(function showFormsInfo(){
    	var forms = [];
    	angular.forEach(document.querySelectorAll('form'), function(form) {
    		forms.push(form);
    	});
    	angular.forEach(document.querySelectorAll('ng-form'), function(form) {
    		forms.push(form);
    	});

    	var counter = document.getElementById('ngbar-forms');
    	counter.innerHTML = forms.length;

        if (hasErrors(forms)) {
        	angular.element(counter).addClass('errors');
        } else {
        	angular.element(counter).removeClass('errors');
        }

        var info = document.getElementById('ngbar-forms-info')
        info.innerHTML = '<ul>' + getFieldsInfo(forms) + '</ul>';

        if (!handlerInstalled) {
        	handlerInstalled = true;
	        info.addEventListener('click', function(e) {
	        	if (e.target.attributes && e.target.attributes['name']) {
	        		var elm = document.querySelector('[name="' + e.target.attributes['name'].value + '"]');
	        		elm.focus();
	        	}
	        	return false;
	        });
	    }

        setTimeout(showFormsInfo, 5000);
    }, 1000);
}

/**
 * TODO: Detect elements without names
 */
function getFieldsInfo(forms) {
	var html = '';

	angular.forEach(forms, function(form) {
		var name = form.name || (form.attributes['name'] ? form.attributes['name'].value : 'form'),
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

},{"../utils.js":9}],6:[function(require,module,exports){
var utils = require('../utils.js')();


/**
 * Chrome only
 * Chrome uses non-standard window.performance.memory
 * May be required to use --enable-precise-memory-info flag.
 * [chrome.executable] --args --enable-precise-memory-info 
 */
function initPlugin(elm) {
	elm.innerHTML = '<h4><i class="help">Mem:</i> <span id="ngbar-mem">...</span>' +
		' <i class="help">Scopes:</i> <span title="Number of scopes" id="ngbar-scopes">...</span> ' + 
		' <i class="help">Watchers:</i> <span title="Number of watchers" id="ngbar-watchers">..</span></h4>';

	setTimeout(function calcThem(){
		document.getElementById('ngbar-mem').innerHTML = utils.getMemUsage();
		
		var scopesInfo = utils.getScopesInfo()
		document.getElementById('ngbar-scopes').innerHTML = scopesInfo.count;
		document.getElementById('ngbar-watchers').innerHTML = scopesInfo.watchers;
		setTimeout(calcThem, 2000);
	}, 100);
}


if (typeof module !== "undefined" && module.exports) {
	module.exports = initPlugin;
}

},{"../utils.js":9}],7:[function(require,module,exports){
var utils = require('../utils.js')();

/**
 *  Routes debug
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4><i class="help">Route:</i> <b id="ngbar-route-info">...</b></h4><div class="sub" id="ngbar-route-info-sub"></div>';

    setTimeout(function showRouteInfo(){

        var routeInfo = document.getElementById('ngbar-route-info'),
            routeDetails = document.getElementById('ngbar-route-info-sub');

        // detect routing: angular or ui-router
        var router = utils.detectRouter();
        
        if (router === 'ui') {
            elm.querySelector('.help').innerHTML = 'State:';   

            // TODO: add on state navigate listener
            var $state = utils.getService('$state'),
                $params = utils.getService('$stateParams');

            routeInfo.innerHTML = $state.current && $state.current.name;
            routeDetails.innerHTML = '<h5>$state: <strong>' + $state.current.name + '</strong></h5>' + 
                    '<pre>' + utils.formatObject($state.current) + '</pre>' +
                    '<h5>$stateParams</h5><pre>' + utils.formatObject($params) + '</pre>';
        } else if (router === 'ng') {
           
            // TODO: listen to route start / end 
            var $route = utils.getService('$route'),
                $loc = utils.getService('$location'),
                ctrl = $route.current && $route.current.$$route ? $route.current.$$route.controller : '?';

            if (!$route || !$route.current) {
                return;
            }

            elm.querySelector('.help').innerHTML = 'Route:';

            routeInfo.innerHTML = $loc.path();
            routeDetails.innerHTML = '<h5><strong>' + $loc.path() + '</strong></h5>' + 
                    '<p><strong>controller:</strong> ' + ctrl + '</p>' + 
                    '<p><strong>templateUrl:</strong> ' + $route.current.templateUrl + '</p>' + 
                    '<p><strong>params:</strong> <pre>' + utils.formatObject($route.current.params) + '</pre></p>';
        }

        // TODO: listen to events .... 
        setTimeout(showRouteInfo, 5000);
    }, 1000);
}



if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":9}],8:[function(require,module,exports){
var utils = require('../utils.js')();

/**
 *  Routes debug
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4><i class="help">Routes:</i> <span id="ngbar-router">...</span></h4><div class="sub" id="ngbar-router-routes"></div>';

    setTimeout(function(){

        var routerInfo = document.getElementById('ngbar-router'),
            routesList = document.getElementById('ngbar-router-routes');

        // detect routing: angular or ui-router
        var router = utils.detectRouter();
        routerInfo.innerHTML = router;

        if (router === 'ui') {
            var routes = enumerateUiRoutes();
            routerInfo.innerHTML = routes[1].length;
            routesList.innerHTML = '<h5>ui-router routes</h5><table>' + routes[0] + '</table>';

            elm.querySelector('h4').className = 'ui-router';
        } else {
            var routes = enumerateNgRoutes();
            routerInfo.innerHTML = routes[1].length;
            routesList.innerHTML = '<h5>ngRoute routes</h5><table>' + routes[0] + '</table>';

            elm.querySelector('h4').className = 'ng-route';
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
    var html = '',
        $route = utils.getService('$route'),
        routes = $route.routes,
        names = [],
        routesByName = {};

    // first run - collect routes
    angular.forEach(routes, function(route) {
        names.push(route.originalPath);
        routesByName[route.originalPath] = route;

        if (angular.isUndefined(route.originalPath)) {
            html += '<tr class="nw"><th>Otherwise:</th><td colspan="2">' + route.redirectTo + '</td></tr>';
        } else {
            html += '<tr class="nw"><td><a href="' + route.originalPath + '">' + route.originalPath + '</a></td><td>' + (route.controller || 'n/a') + '</td><td>' + (route.templateUrl || 'n/a') + '</td></tr>';
        }
    });

    return [html, names, routesByName];
}


if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}

},{"../utils.js":9}],9:[function(require,module,exports){
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
        return '<i class="missing">performance.memory missing</i>';
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
    },


    detectRouter: function() {
      try {
          angular.module('ngRoute');
          return 'ng';
      } catch (e) {}

      try {
          angular.module('ui.router');
          return 'ui';
      } catch (e) {}

      return 'none';
    },


    formatObject: function(obj) {
      var str = '';

      angular.forEach(obj, function(v, k){
        str += '<b>' + k + '</b>: ' + JSON.stringify(v, null, 2) +  "\n";
      });

      return str;
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
},{}]},{},[2]);
