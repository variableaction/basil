
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