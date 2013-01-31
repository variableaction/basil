/***
#############################################################################################################################

	Class: 			Basil.util

	Description: 	Utility functions for Basil

#############################################################################################################################
*/

Basil.util = {
	
	/***
		Loops through an object calling the passed in function
	*/	
		each: function(obj, func) {
			for (var key in obj) {
		
			   if (obj.hasOwnProperty(key)) {
			      var item = obj[key];
			      
			      if ((response = func(key, item))) return response;
			   }
			}
		},
		
		
		getElementsByAttribute: function(el, attr) {
						
			if (window.jQuery) {
				return $(el).find('['+attr+']').get();
			
			} else if (window.MooTools) {
				return el.getElements('['+attr+']');
			}
			
		},
		
		domReady: function(func) {
			
			if (window.jQuery) {
				$(func);
			
			} else if (window.MooTools) {
				window.addEvent('domready', func);
			}
			
		},
		
		
		html: function(el, html) {
			
			if (window.jQuery) {
				$(el).html(html);
			
			} else if (window.MooTools) {
				el.set('html',html);
			}
			
		}
};


Basil.util.ajax = {
	
	/***
		Description:	request
		@param: 		url (STRING) The url to make a post request to
		@param:			options (OBJECT) data:{}, async:true, callback
	*/
		request: function(url, options) {
			defaults = {
				'method'	: 'POST',
				'async'		: false,
				'data'		: {},
				'dataType'	: 'html',
				'callback'	: function(response) {}
			};
			
			
			Basil.util.each(options, function(key, value) {
				defaults[key] = value;
			});
			
			options = defaults;
			
			if (window.jQuery) {
								
				$.ajax({
					dataType	: options.dataType,
					url			: url,
					type		: options.type,
					async		: !options.async,
					
					success		: function(data, textStatus, jqXHR) {
						Basil.log.print('AJAX SUCCESS', data);
						if (options.callback && typeof options.callback == 'function') options.callback(data);
					},
					
					error		: function(jqXHR, textStatus, errorThrown) {
						//"timeout", "error", "abort", and "parsererror"
						Basil.log.exception('AJAX ERROR', jqXHR, textStatus, errorThrown);
					},
					
					beforeSend	: function(jqXHR) {
						Basil.log.print('AJAX REQUEST', url, options.data);
					}
					
				});
				
				
			} else if (window.MooTools) {
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
		},
	
	/***
		Description:	get
		@param: 		url (STRING) The url to make a post request to
		@param:			options (OBJECT) data:{}, async:true, callback
	*/
		get: function(url, options) {
			Basil.util.ajax.request(url, options);
		},
		
	/***
		Description:	getJSON
		@param: 		url (STRING) The url to make a post request to
		@param:			options (OBJECT) data:{}, async:true, callback
	*/
		getJSON: function(url, options) {
			options.dataType = 'JSON'
			Basil.util.ajax.request(url, options);
		}
}


Basil.log = {

	/***
		Checks if debug is on and console exists in the browser
	*/
		available: function() {
			return Basil.core.settings.debug && console !== 'undefined';
		},
		
		
	/***
		Calls console.log to output the arguments
	*/	
		print: function() {
			if (Basil.log.available()) {
				for (arg in arguments) console.log(arguments[arg]);
			}
		},

		
	/***
		Calls console.warn to output the arguments
	*/
		warn: function() {
			if (Basil.log.available()) {
				for (arg in arguments) console.warn(arguments[arg]);
			}
		},
	
	/***
		Calls console.exceoption to output the arguments
	*/	
		exception: function() {
			if (Basil.log.available()) {
				for (arg in arguments) console.error(arguments[arg]);
			}
		},
	
	
};

