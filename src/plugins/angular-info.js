var utils = require('../utils.js')();


function initPlugin(elm) {	
	elm.innerHTML = '<h4 title="'+angular.version.codeName+'">' + angular.version.full + '</h4><div class="sub" id="ngbar-app-deps"></div>';

	setTimeout(function(){
		var mainModule = utils.guessMainModule();
		var deps = buildDeps(mainModule);

		elm.innerHTML = '<h4 title="'+angular.version.codeName+'">ng ' + angular.version.full + 
			 ' <span class="ngbar-app-name">App: <strong>' + mainModule + '</strong></h4>' + 
			 '<div class="sub" id="ngbar-app-deps">' + deps + '</div>' + 
			 '<div class="sub" style="display: none;" id="ngbar-app-services"><ul id="ngbar-app-services-details"></ul></div>';

	    angular.element(document.getElementById('ngbar-app-deps')).on('click', onDepClickHandler);
	}, 500);
}

function buildDeps(mod) {
	var html = '<li><b>Requires:</b></li>';

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
    var elm = angular.element(e.toElement),
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
