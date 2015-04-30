var utils = require('../utils.js')();


/**
 * 
 */
function initPlugin(elm) {
	var handlerInstalled = false;
    elm.innerHTML = '<h4>Forms: <span id="ngbar-forms">...</span></h4><div class="sub" id="ngbar-forms-info"></div>';

    setTimeout(function showFormsInfo(){
    	var forms = [];
    	angular.forEach(document.querySelectorAll('form'), function(form) { 
    		forms.push(form); 
    	});
    	angular.forEach(document.querySelectorAll('ng-form'), function(form) { 
    		forms.push(form); 
    	});
    	// console.log(forms);
        document.getElementById('ngbar-forms').innerHTML = forms.length;

        if (hasErrors(forms)) {
        	angular.element(elm).addClass('errors');
        } else {
        	angular.element(elm).removeClass('errors');
        }

        var info = document.getElementById('ngbar-forms-info')
        info.innerHTML = '<ul>' + getFieldsInfo(forms) + '</ul>';

        if (!handlerInstalled) {
        	handlerInstalled = true;
	        angular.element(info).on('click', function(e) {
	        	if (e.toElement.attributes && e.toElement.attributes['name']) {
	        		var elm = document.querySelector('[name="' + e.toElement.attributes['name'].value + '"]');
	        		elm.focus();
	        	}
	        	return false;
	        });
	    }

        setTimeout(showFormsInfo, 1000);
    }, 1000);
}

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
