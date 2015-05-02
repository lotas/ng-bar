var utils = require('../utils.js')();

/**
 *  Routes debug
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Routes: <span id="ngbar-router">...</span></h4><div class="sub" id="ngbar-router-routes"></div>';

    setTimeout(function(){

        var routerInfo = document.getElementById('ngbar-router'),
            routesList = document.getElementById('ngbar-router-routes');

        // detect routing: angular or ui-router
        var router = detectRouter();
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

function detectRouter() {
    try {
        angular.module('ngRoute');
        return 'ng';
    } catch (e) {}

    try {
        angular.module('ui.router');
        return 'ui';
    } catch (e) {}

    return 'none';
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = initPlugin;
}
