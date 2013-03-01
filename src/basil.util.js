/***
#############################################################################################################################

	Class: 			Basil.util

	Description: 	Utility functions for Basil

#############################################################################################################################
*/


Basil.util = {


//##########################################################################################################
//	Custom Basil Utility Methods
//##########################################################################################################

/***
	Loops through an object calling the passed in function
*/	
	


	getElements: function(el) {
	
		// Not sure if this next line is correct, but it is making things work...
		//el = el || document.body;
		
		
		return Basil.util.getElementsByAttribute(el, '');	
	
	},
	
	hashPart: function(num) {
		var hashParts = window.location.hash.split('/');
		return hashParts[num + 1];
	},

//##########################################################################################################
//	Framework-proxied-methods
//##########################################################################################################
	each: function(obj, func) {
		return Basil.core.adapter[Basil.core.framework].each.apply(this, arguments);
	},

	getElementBySelector: function() {
		return Basil.core.adapter[Basil.core.framework].getElementBySelector.apply(this, arguments);
	},
	
	getElementsBySelector: function() {
		return Basil.core.adapter[Basil.core.framework].getElementsBySelector.apply(this, arguments);
	},
		
	getElementsByAttribute: function() {
		return Basil.core.adapter[Basil.core.framework].getElementsByAttribute.apply(this, arguments);
	},
	
	createElementFromString: function() {
		return Basil.core.adapter[Basil.core.framework].createElementFromString.apply(this, arguments);
	},
	
	insertElementAfter: function() {
		return Basil.core.adapter[Basil.core.framework].insertElementAfter.apply(this, arguments);
	},
	
	domReady: function() {
		return Basil.core.adapter[Basil.core.framework].domReady.apply(this, arguments);	
	},
	
	html: function() {
		return Basil.core.adapter[Basil.core.framework].html.apply(this, arguments);
	},
	
	css: function() {
		return Basil.core.adapter[Basil.core.framework].css.apply(this, arguments);
	},
		
	addEvent: function(el, event, func, data) {
		return Basil.core.adapter[Basil.core.framework].addEvent.apply(this, arguments);
	},
	
	fireEvent: function(el, event) {
		return Basil.core.adapter[Basil.core.framework].fireEvent.apply(this, arguments);	
	},
	
	clone: function(el, keepAttributes, goDeep) {
		return Basil.core.adapter[Basil.core.framework].clone.apply(this, arguments);	
	},
	
//##########################################################################################################
//	Ajax methods
//##########################################################################################################

	ajax: {
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
			
			arguments[1] = defaults;
						
			Basil.core.adapter[Basil.core.framework].ajax.apply(this, arguments);
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
};
