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
