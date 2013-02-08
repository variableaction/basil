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
		
		createElementFromString: function(str) {
			return new Element('div', { html: str }).getFirst();	
		},
		
		insertElementAfter: function(el, after) {
			after.inject(el, 'after');
		},
		
		domReady: function(func) {
			window.addEvent('domready', func);
		},
		
		html: function(el, html) {
			el.set('html',html);
		},
		
		css: function(el, style, value) {
			return el.setStyle(style, value);	
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