var utils = require('../utils.js')();

/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4 class="services">Services: <span id="ngbar-services">...</span></h4>' +
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
