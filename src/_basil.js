
/***
#############################################################################################################################

	Class: 			Basil

	Description: 	The view controller that redirects views and functions

#############################################################################################################################
*/

// #############################################################################################################################
//	Basil API/object Outline
// #############################################################################################################################
	
	var Basil = {
		
	// ----------------------------------------------------------------------
	//	Internal
	// ----------------------------------------------------------------------
	
		// Utility Functions/methods, etc
		util: {},
		
		// Logging methods, etc
		log: {},
		
		core: {
			
			event_actions: {
				loadLeaf: function() {}
			},
			
			// Instances of data,etc being stored?
			active: {
				user_idle: false,
			},
			
			settings: {
				defaults: {},	// Our default settings for basil
				options: {}		// user-submitted options (provided in Basil.config(options))
			},
			
			run: {
				stem: {
					init: function() {}
				},
				leaf: {
					build: function() {}
				}
			}
			
		},
		
		app: {
			//stems: {},
			leaves: {},
			actions: {}
		},
		
		getStemParam: function(key) {},
			
	// ----------------------------------------------------------------------
	//	External (for the user)
	// ----------------------------------------------------------------------
		
		// Setup method (defined below)
		config: function(options) {},
		
		// Starts basil processing
		init: function() {},
		
		// User setup methods; should all be done before init
		addEvent:	function() {},
		addLeaf:	function() {},
		loadLeaf:	function(el,leafFile) {}
		
		// FUTURE
		//addLeafEvent:	function() {},
	
	};
	


// #############################################################################################################################
//	Setup & Initialization
// #############################################################################################################################

	// Default Settings
	Basil.core.settings = {
		debug: false,
		paths: '/assets/javascript/app/stems/',
		leaf_path_prefix: '/assets/javascript/app/leaves/'
	};


	Basil.prepare = function(options) {
		
		Basil.util.each(options, function(key, value) {
			Basil.core.settings[key] = value;
		});
				
		Basil.core.preflight();
		
		Basil.util.domReady(Basil.core.run.stem.init.bind(Basil.core.run.stem));
	}



Basil.core.preflight = function() {

// ----------------------------------------------------------------------
//	Check framework is included
// ----------------------------------------------------------------------

	if (!window.jQuery && !window.MooTools) {
		if (typeof console) {
			console.error('Basil currently depends on jQuery or MooTools to run');
		}
		return;
	}
	
}


Basil.addLeaf = function(leafFile,leafObject) {
	
	Basil.app.leaves[leafFile] = leafObject;
	
}




//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//	Old
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################
//##########################################################################################################

//Basil.addEvent();

/*

Basil.addEvent('eventName',function() {});


Basil.addLeaf('party.html',{
	data: 'magic.json',
	events: {
		doSomethingAwesome: function() {
			
		}
	}
});

Basil.addLeafEvent('party.html','eventName',function() {});

*/





var basil = {
	
	/***
		Method:			updateObject
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Takes an object of properties and injects them in the view_object
		@param: 		options (OBJECT) key value object that replaces anything in the view_object with that value
	*/
	updateObject: function(options) {
		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				basil.view_object[key] = options[key];
			}
		}
	},
	

	/***
		Method:			getElementsByAttribute
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	looks through all elements in dom for attribute passed in
		
		@param: 		oElm (ELEMENT) original element to find children of
		@param:			strTagName (STRING) the selector tag to find
		@param:			strAttributeName (STRING) a specific attribute of the children nodes
		@param:			strAttributeValue (STRING) gets a specific value for an attribute
		@return:		(ARRAY) all the elements that matched the description
	*/
	getElementsByAttribute: function(oElm, strTagName, strAttributeName, strAttributeValue){
	    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
	    var arrReturnElements = new Array();
	    var oAttributeValue = (typeof strAttributeValue != "undefined")? new RegExp("(^|\\s)" + strAttributeValue + "(\\s|$)", "i") : null;
	    var oCurrent;
	    var oAttribute;
	    for(var i=0; i<arrElements.length; i++){
	        oCurrent = arrElements[i];
	        oAttribute = oCurrent.getAttribute && oCurrent.getAttribute(strAttributeName);
	        if(typeof oAttribute == "string" && oAttribute.length > 0){
	            if(typeof strAttributeValue == "undefined" || (oAttributeValue && oAttributeValue.test(oAttribute))){
	                arrReturnElements.push(oCurrent);
	            }
	        }
	    }
	    return arrReturnElements;
	},


	/***
		Method:			updateChangeDetected
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Sets $basil.change_detected to true to warn the user that content has been changed.
						Then calls a handleChangeDetected method if it exists.
		@param: 		e (EVENT) checks the e.keyCode to ensure the key used is permissible
		@see:			(CLASS) content_Section (METHOD) handleChangeDetected
	*/
	updateChangeDetected: function(e) {
		if (e && e.keyCode && basil.ignore_keys.indexOf(e.keyCode) > -1) return;
		
		basil.change_detected = true;

		if (basil.section_object.handleChangeDetected) basil.section_object.handleChangeDetected();
	},


	/***
		Method:			findInputs
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	searches all inputs and adds a keylistener to store if a change	happened so 
						we can alert the user to save
		@param: 		el (ELEMENT) parent element to search for inputs
	*/
	findInputs: function(el) {
		var elements = [{ type: 'input', event: 'keyup' }, { type: 'textarea', event: 'keyup' }, { type: 'select', event: 'change' }];
		
		for (var k = 0; k < elements.length; k++) {
			var arr = el.getElementsByTagName(elements[k].type);
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].addEventListener) arr[i].addEventListener(elements[k].event, basil.updateChangeDetected, false);
				else if (arr[i].attachEvent) arr[i].attachEvent('on' + elements[k].event, basil.updateChangeDetected);
			}
		}
	},


	/***
		Method:			getItemInObject
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Given an object and a key, it will return the value at that key if it exists
		@param: 		obj (OBJECT) the object with keys to search through
		@param:			key (STRING) a period separated string that represents where in the object this item is located
		@return:		(MIXED) the value at that key
	*/
	getItemInObject: function(obj, key) {
		var arr = key.split('.');

		for (var i = 0; i < arr.length; i++) {

			obj = obj[arr[i]];
			
			if (!obj) return obj;
			
		}

		return obj;
	},
	
	
	/***
		Method:			getItemInSettings
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Direct function to get an item in $SETTINGS object
		@param: 		field (STRING) a period separated string that represents where in $SETTINGS this item is located
		@return:		(MIXED) the value at that key
	*/
	getItemInSettings: function(key) {
		return basil.getItemInObject(SETTINGS, key);
	},
	

	/***
		Method:			getItemInViewObject
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Direct function to get an item in the $basil.view_object object
		@param: 		field (STRING) a period separated string that represents where in $basil.view_object this item is located
		@return:		(MIXED) the value at that key
	*/
	getItemInViewObject: function(field) {
		return basil.getItemInObject(basil.view_object, field);
	},


	/***
		Method:			findDataFields
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	looks for any data-field to populate
		@param: 		el (ELEMENT) the element to search for data-fields
	*/
	findDataFields: function(el) {
		// searches the element for data-field's to populate
		var arr = basil.getElementsByAttribute(el, '*', 'data-field');
		
		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			
			// to be implemented
			if (item.getAttribute('data-loop')) continue;
			
			// the field value
			var field = item.getAttribute('data-field');
			
			// if calling an object other than basil.view_object
			var call = item.getAttribute('data-call');
			
			// if call is settings then look in settings object
			if (call && call == 'settings') var val = basil.getItemInSettings(field);
			else if (call) var val = basil.getItemInObject(window[call], field);
			else var val = basil.getItemInViewObject(field);

			if (val === undefined && item.nodeName != 'INPUT') {
				//alert(field + ' does not exist! View console for more information.');
				consoleLog(LOG_ERROR);
				consoleLog('	BAD ITEM: ' + field);
				consoleLog(item);
				consoleLog(val);
			}
			
			// a value is inserted depending on the type of node
			switch (item.nodeName) {
				case 'INPUT':
				case 'TEXTAREA':
				case 'SELECT':
					if (val !== undefined) item.value = val;
					if (item.type.toLowerCase() == 'checkbox') item.checked = val == '1' ? true : false;
					break;
				
				case 'IFRAME':
				case 'IMG':
					item.src = val;
					break;
				
				case 'FIELDSET':
					break;
				
				default:
					item.innerHTML = val;
					break;
			}
		}
	},

	
	/***
		Method:			findBehaviors
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Behaviors are events, this looks at loaded element and finds any behavior commands to attach
		@param: 		el (ELEMENT) the element to search for child data-behavior's
	*/
	findBehaviors: function(el) {
		// looks for behavior calls to do special things
		var arr = basil.getElementsByAttribute(el, '*', 'data-behavior');
		for (var i = 0; i < arr.length; i++) {
			var item = $(arr[i]);
			
			var behavior	= item.getAttribute('data-behavior').split(':');
			
			if (behavior.length > 1) {
				var func	= Behavior[behavior[1]];
				var event 	= behavior[0].match(/^on/) ? behavior[0] : 'on' + behavior[0];
			} else {
				var func 	= Behavior[behavior[0]];
				var event 	= 'onclick';
			}
			
			if (!func) return;
			
			if (item.addEventListener) item.addEventListener(event.substr(2), func, false);
			else if (item.attachEvent) item.attachEvent(event, func);
		}
	},
	

	/***
		Method:			findTriggers
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Triggers are functions to immediately call upon creation.
						Basil looks at loaded element and finds any trigger functions to call
		@param: 		el (ELEMENT) the element to search for child triggers
	*/
	findTriggers: function(el) {
		// looks for trigger calls to do special things
		var arr = basil.getElementsByAttribute(el, '*', 'data-trigger');
		for (var i = 0; i < arr.length; i++) {
			var item = $(arr[i]);

			var func = Trigger[item.getAttribute('data-trigger')];
			
			if (!func) return;
			
			func(item);
		}
	},


	/***
		Method:			findViews
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	looks at loaded element and finds more views inside the element
		@param: 		el (ELEMENT) the element to search for child views
	*/
	findViews: function(el) {

		// looks for more views
		var arr = basil.getElementsByAttribute(el, '*', 'data-view');
		for (var i = 0; i < arr.length; i++) {
			var item = $(arr[i]);
			
			var view = item.getAttribute('data-view');
			
			if (!view) {
				consoleLog(LOG_ERROR);
				consoleLog('View: ' + view + ' not found!');
			}
			
			var area = view.match(/^[^-]*/);
			
			if (area[0] == 'shared') {
				basil.loadView(item, '/basil/shared/views/' + view.replace(/[^-]*-/,'') + basil.view_ext);	
			} else {
				basil.loadView(item, basil.views_path + area[0] + '/views/' + view.replace(/[^-]*-/,'') + basil.view_ext);
			}
		}
		
	},


	/***
		Method:			findAll
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Centralized location to find all the element data attributes
		@param: 		el (ELEMENT) the element to search through
	*/
	findAll: function(el) {
		basil.findViews(el);
			
		basil.findDataFields(el);

		basil.findTriggers(el);
		
		basil.findBehaviors(el);
				
		basil.findInputs(el);
	},
	
	
	/***
		Method:			loadView
		Creator:		Jason Spangler
		Created:		08/29/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Passed the element and the template to load into the element.
						Loads the view into the element and then checks the new view for more views
		@param: 		el (ELEMENT) the element to search for views
		@param:			url (STRING) the path to the view file to load
	*/
	loadView: function(el, url) {
		// clears the element of any view that currently exists
		$(el).set('html', '');
		
		// our own basil-ready event tracker
		basil.load_counter += 1;

		// gets the basil template file with random number to prevent caching
		_ajax.get(url + '?' + basil.random_number,{},function(html) {
			
			// store the retrieved html into the view
			$(el).set('html', html);
						
			// find everything
			basil.findAll(el);
			
			// tick one away from counter
			basil.load_counter -= 1;
			
			// if counter is at zero, we have seen everything and can begin basil-ready events
			if (basil.load_counter == 0) {
			
				// check if this section has a basil-ready event
				if (basil.section_object && basil.section_object.basilDone) basil.section_object.basilDone();
			}
		});
	}
};