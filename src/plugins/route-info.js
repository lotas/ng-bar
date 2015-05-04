var utils = require('../utils.js')();

/**
 *  Routes debug
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4><i class="help">Route:</i> <b id="ngbar-route-info">...</b></h4><div class="sub" id="ngbar-route-info-sub"></div>';

    setTimeout(function(){

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
            routeDetails.innerHTML = '<h5>Name: </h5><p>' + $state.current.name + '</p>' + 
                    // '<h5>Resolves:</h5><p>' + JSON.stringify($state.current.resolve) + '</p>' + 
                    // '<h5>Data:</h5><p>' + JSON.stringify($state.current.data) + '</p>' + 
                    '<h5>$stateParams</h5><pre>' + JSON.stringify($params, null, 2) + '</pre>';
            // routesList.innerHTML = '<h5>ui-router routes</h5><table>' + routes[0] + '</table>';

        } else {
            elm.querySelector('.help').innerHTML = 'Route:';
            
        }

    }, 1000);
}



if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}
