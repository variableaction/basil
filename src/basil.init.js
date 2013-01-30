
/*************************************************************************
	consoleLog
	- logs whatever object you send it, checks if console 
	  exists before trying to log to it
	  
	@require obj
**************************************************************************/
function consoleLog(obj) {
	//if (basil.settings.dev == 1) {
	if (typeof console !== 'undefined') console.log(obj);
	//}
}

function growl(obj) {
	consoleLog(obj);
}

/*************************************************************************
	basilInit
**************************************************************************/
function basilInit() {
	// prevents caching
	basil.random_number = parseInt(Math.random() * 100000);
	
	// hash bang interface
	if (window.location.hash == '') window.location.hash = '#!/home';
	
	if (window.location.pathname != '') window.location = '/' + window.location.hash;

	// stores the main view to look at initially
	Basil.hash.view = document.getElementById('bodySection');

	Basil.hash.hashChangeDetector(Basil.hash.listener);
};


// add onload event to fire up basil
if (window.addEventListener) window.addEventListener('load', basilInit, false);
else if (window.attachEvent) window.attachEvent('onload', basilInit);