var utils = require('../utils.js')();


/**
 *
 */
function initPlugin(elm) {
	var handlerInstalled = false;
    elm.innerHTML = '<h4 class="forms">Forms: <span id="ngbar-forms">...</span></h4><div class="sub" id="ngbar-forms-info"></div>';

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
		var name = form.name || form.attributes['name'].value,
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
