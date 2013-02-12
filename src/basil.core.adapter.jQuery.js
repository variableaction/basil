//##########################################################################################################
//##########################################################################################################
//	jQuery framework adapater
//##########################################################################################################
//##########################################################################################################



//##########################################################################################################
//	Dependencies
//##########################################################################################################

// ----------------------------------------------------------------------
//	custom destory event
// ----------------------------------------------------------------------

	
	
//##########################################################################################################
//	Adapter
//##########################################################################################################

	Basil.core.adapter.jQuery = {
	
		each: function(obj,func) {
			return $.each(obj,func);
		},
		
		getElementBySelector: function(selector) {
			return $(selector).get(0);
		},
		
		getElementsBySelector: function(selector) {
			return $(selector).get();
		},
		
		getElementsByAttribute: function(el, attr) {
			var attr_str = attr == '' ? '*' : '[' + attr + ']';
			
			//Basil.log.print('Running getElementsByAttribute from jQuery adapater... ',attr_str,el,$(el).find(attr_str));
			
			return $(el).find(attr_str).get();
			
		},
		
		createElementFromString: function(str) {
			var el = $(str);
			console.log(el);
			return el;
		},
		
		insertElementAfter: function(el, after) {
			$(after).after($(el));
			return el;
		},
		
		domReady: function(func) {
			$(func);
		},
		
		html: function(el, html) {
			$(el).each(function() {
				$(this).get(0).innerHTML = html;
			});
			//$(el).get(0).innerHTML = html;
			//$(el).html(html);
		},
		
		css: function(el, style, value) {
			return $(el).css(style, value);	
		},
		
		addEvent: function(el, event, func, data) {
			$(el).on(event, function(e) {
				if (data) {
					data.unshift(e);
					func.apply(this, data);
					data.shift();
				} else func(e);
			});
			return $(el);
		},
		
		fireEvent: function(el, event) {
			$(el).trigger(event);	
		},
		
		clone: function(el, keepAttributes, deep) {
			return $(el).clone(keepAttributes, deep).get(0);	
		},
		
		ajax: function(url,options) {
		
			$.ajax({
				dataType	: options.dataType,
				url			: url,
				type		: options.method,
				async		: !options.async,
				data		: options.data,
				
				success		: function(data, textStatus, jqXHR) {
					Basil.log.print('AJAX SUCCESS', {responseData: data});
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
			
		}
		
	}
