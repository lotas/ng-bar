var utils = require('../utils.js')();

var AngularServicesPlugin = {
    init: initPlugin
};

/**
 * 
 */
function initPlugin(elm) {
    elm.innerHTML = '<h4>Services: <span id="ngbar-services">...</span></h4>' +
        '<div class="sub" id="ngbar-services-list"></div>' +
        '<div class="sub" style="display: none;" id="ngbar-services-sub"><ul id="ngbar-services-details"></ul></div>';

    setTimeout(function(){
        var names = [], 
            services = utils.enumerateServices(utils.guessMainModule()),
            listElm = document.getElementById('ngbar-services-list');

        angular.forEach(services, function(obj, name) {
            if (angular.isUndefined(name)) {
                return;
            }
            names.push(name);
            // console.log(obj);
        });        
        document.getElementById('ngbar-services').innerHTML = names.length;

        names.sort();

        var html = '';
        angular.forEach(names, function(name) {
            html += '<li class="has-sub" data-service="' + name + '"><a data-service="' + name + '">' + name + '</a></li>';
        });
        listElm.innerHTML = '<ul id="ngbar-services-ul">' + html + '</ul>';

        angular.element(listElm).on('click', function(e){
            var elm = angular.element(e.toElement),
                serviceName = elm.attr('data-service'),
                subElm = document.getElementById('ngbar-services-sub'),
                list = document.getElementById('ngbar-services-list');

            if (serviceName && services[serviceName]) {
                document.getElementById('ngbar-services-details').innerHTML = buildServiceDetails(services[serviceName]);
                subElm.style.display = '';
            }

            // adjust second sub position
            subElm.style.marginLeft = list.offsetWidth + 'px';
            subElm.style.height = list.offsetHeight + 'px';

            e.stopImmediatePropagation();
            return false;
        });


    }, 1000);
}

function buildServiceDetails(service) {
    var callables = '';
    if (typeof service === 'function') {
        return '<li><b>Factory method</b></li><li>' + service.toString().substr(0, 100) + ' ...</li>';
    } else {
        angular.forEach(service, function(obj, name) {
            if (typeof obj === 'function') {
                callables += '<li>&nbsp; ' + name + '</li>';
            }
        });
    }
    return callables === '' ? '<i>no methods</i>' : '<li><b>Methods:</b></li>' + callables;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = AngularServicesPlugin;
}
