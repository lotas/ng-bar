
/**
 * Plugin interface
 * 
 * @param {String} id  id of counter element (main plugin info)
 * @param {Object} def definition of plugin 
 * @param {Element} elm DOM element representing 
 */
var Plugin = function(id, def, elm, pluginId) {
  this.id = id;
  this.elm = elm;
  this.def = def;
  this.pluginId = pluginId; 
  this.subId = 'ngbar-asp-sub-' + pluginId;
  this.subSubId = 'ngbar-asp-ssub-' + pluginId; 
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

Plugin.prototype.getSubItemDetails = function(id) {
  var subItems = false;
  if (id && this.def.items) {
    angular.forEach(this.def.items, function(elm) {
      if (elm.id === id) {
        subItems = elm.items;
      }
    });
  }
  return subItems;
};

Plugin.prototype._itemsCache = null;
Plugin.prototype.renderItems = function (){
  var id = 0,
      self = this,
      plugin = self.def,
      sub = document.getElementById(this.subId);
  
  if (!sub || !plugin.items) {
    return false;
  }
  
  var items = angular.isFunction(plugin.items) ? plugin.items() : plugin.items;
  
  var newCache = JSON.stringify(items);
  
  if (newCache === self._itemsCache) {
    return false; // already drawn
  }
  
  self._itemsCache = newCache;
  sub.innerHTML = '';
  
  angular.forEach(items, function(subItem, key) {
    var itemElm = document.createElement('div');
    
    // assign id if it doesn't exist to help find reference later
    if (typeof subItem.id === 'undefined') {
      subItem.id = 'ngb-' + self.pluginId + '-' + (++id);
    }
    
    itemElm.setAttribute('id', subItem.id);
    
    if (angular.isDefined(key) && !angular.isNumber(key)) {
      itemElm.innerHTML = '<strong>' + key + '</strong>: ' + JSON.stringify(subItem, null, 2);
    } else if (angular.isString(subItem)) {
      itemElm.innerHTML = subItem;
    } else if (subItem.title) {
      itemElm.innerHTML = subItem.title;
      if (subItem.onclick) {
        itemElm.addEventListener('click', subItem.onclick);
      }
      if (subItem.info) {
        itemElm.innerHTML += "\n<pre>" + JSON.stringify(subItem.info, null, 2) + "</pre>";
      }
      if (subItem.items) {
        itemElm.addEventListener('click', onItemClickHandler);
      }
    }

    sub.appendChild(itemElm);
  });
  
  /**
   * Show sub-item details
   */
  function onItemClickHandler(evt) {
     var id = evt.target.id, 
         subSub = document.getElementById(self.subSubId);
        
     subSub.style.marginLeft = sub.offsetWidth + 'px';
     subSub.style.height = sub.offsetHeight + 'px';
     subSub.classList.remove('hidden');
     
     subSub.innerHTML = formatItemDetails(
       self.getSubItemDetails(id)
     );
  }
  
  /**
   * Format sub-item details
   * @param {Array|Object} details
   * @return {String}
   */
  function formatItemDetails(details) {
    var html = '';
    if (angular.isArray(details)) {
      html +=  '<pre>' + utils.formatObject(details) + '</pre>';
    } else if (angular.isObject(details)) {
      html += '<ul>';
      angular.forEach(details, function(elm, key) {
         html += '<li><b>' + key + '</b></li>';
         if (angular.isArray(elm)) {
           angular.forEach(elm, function(k, v) {
             html += '<li>' + k + '</li>';
           });
         } else {
          html += '<li>' + elm + '</li>';
         }
      });
      html += '</ul>';
    }
    return html;
  }
};



if (typeof module !== "undefined" && module.exports) {
  module.exports = Plugin;
}