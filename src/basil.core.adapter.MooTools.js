//##########################################################################################################
//##########################################################################################################
//	MooTools framework adapater
//##########################################################################################################
//##########################################################################################################


//##########################################################################################################
//	Dependencies
//##########################################################################################################

	// None yet
	
	
//##########################################################################################################
//	Adapter
//##########################################################################################################


	Basil.core.adapter.MooTools = {
		
		getElementBySelector: function(selector) {
			return $$(selector)[0];
		},
		
		getElementsBySelector: function(selector) {
			return $$(selector);
		},
		
		getElementsByAttribute: function(el, attr) {
			var attr_str = attr == '' ? '*' : '[' + attr + ']';
			
			return el.getElements(attr_str);
			
		},
		
		
		domReady: function(func) {
			window.addEvent('domready', func);
		},
		
		html: function(el, html) {
			el.set('html',html);
		},
		
		addEvent: function(el, event, func, data) {
			if (data) return el.addEvent(event, func.apply(this, data));
			else return el.addEvent(event, func);
		},
		
		fireEvent: function(el, event) {
			el.fireEvent(event);	
		},
		
		
		ajax: function(url,options) {
			new Request({
				url: url,
				format: options.dataType,
				async: !options.async,
				onRequest: function(response) {
					Basil.log.print(url, data);
				},
				onSuccess: function(json, text) {
					Basil.log.print('AJAX SUCCESS', json);
					if (options.callback && typeof options.callback == 'function') options.callback(json);
				},
				onError: function(response) {
					Basil.log.exception('AJAX ERROR', response);
				},
				onFailure: function(response) {
					Basil.log.exception('AJAX FAILURE', response);
				}
			}).post(options.data);
		}
		
	}