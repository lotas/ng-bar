var utils = require('../utils.js')();

var FormsPlugin = {
    init: initPlugin
};

/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Forms: <span id="ngbar-forms">...</span></h4>';

    setTimeout(function(){
        

    }, 1000);
}


if (typeof module !== "undefined" && module.exports) {
    module.exports = FormsPlugin;
}
