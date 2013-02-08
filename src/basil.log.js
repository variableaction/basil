
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
	
	/***
		ALIAS for exception
	*/	
	
		error: function() {
			Basil.log.exception.apply(this,arguments);
		},
		
		
		
		as: function() {
			if (Basil.log.available()) {
				
				// Check the log level for category is >= than level of log being passed in
				
				// pop off first two arguments: category, level
				
				// print the rest
				for (arg in arguments) console.warn(arguments[arg]);
			
			}
		}
		
		
	
	
};