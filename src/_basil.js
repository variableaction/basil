var LOG_DASHES = '#---------------------------------------------';
var LOG_ERROR  = '#*********************************************';
var LOG_OPENER = '# ';

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
			
			// Framework method adapaters
			adapter: {},
			
			event_actions: {},
			
			// Instances of data,etc being stored?
			active: {
				user_idle: false
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
					build: function() {},
					cleanup: function() {}
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
		
		// pre hash change event
		onHashChange: function() {},
		
		// User setup methods; should all be done before init
		addAction:	function() {},
		addLeaf:	function() {},
		leaf:		function() {}
		
		// FUTURE
		//addLeafEvent:	function() {},
	
	};
	


// #############################################################################################################################
//	Setup & Initialization
// #############################################################################################################################

	// Default Settings
	Basil.core.settings = {
		debug: false,
		displayGradually: true,
		displaySpeed: 250,
		paths: '/assets/javascript/app/stems/',
		leaf_path_prefix: '/assets/javascript/app/leaves/'
	};


	Basil.prepare = function(options) {
		if (!Basil.core.preflight()) return false;

		Basil.util.each(options, function(key, value) {
			Basil.core.settings[key] = value;
		});
				
		Basil.util.domReady(Basil.core.run.stem.init.bind(Basil.core.run.stem));
	}
	
	
	Basil.addStems = function(options) {
		
		Basil.util.each(options, function(key, value) {
			Basil.core.settings.stems[key] = value;
		});
	}



Basil.core.preflight = function() {

	if (window.jQuery) {
		Basil.core.framework = 'jQuery';
	
	} else if (window.MooTools) {
		Basil.core.framework = 'MooTools';
	} else {
		Basil.core.framework = false;
		Basil.log.error('Basil currently depends on jQuery or MooTools');
	}

// ----------------------------------------------------------------------
//	Check framework is included
// ----------------------------------------------------------------------

	if (!Basil.core.framework) {
		if (typeof console) {
			console.error('Basil currently depends on jQuery or MooTools to run');
		}
		return;
	}
	
	return true;
}


Basil.addLeaf = function(leafFile,leafObject) {
	
	Basil.app.leaves[leafFile] = leafObject;
	
}

Basil.addAction = function(eventName, func) {
	
	Basil.app.actions[eventName] = func;
	
}

