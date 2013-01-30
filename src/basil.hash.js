
/***
#############################################################################################################################

	Class: 			Basil.hash

	Description: 	The hash listener that handles everything that happens when a hash change occurs.

#############################################################################################################################
*/

Basil.hash = {
	ajax_path: '/ajax/',
	ajax_extension: '_call.ajax.php',
	

	/***
		Description:	Adds a hash listener event and calls the appropriate function
		@param: 		func (FUNCTION) the function to call when a hash change occurs
	*/
	hashChangeDetector: function(func) {
		if (typeof func != 'function') return;
		
		// if not on internet explorer use the built in hash listener
		if (("onhashchange" in window) && !(Browser.msie) && !(Browser.ie)) {
			window.onhashchange = func;
		}
		
		// if ie, we have to do a makeshift hash listener, not desirable
		else {
	        var prevHash = window.location.hash;

	        window.setInterval(function () {
	        	if (window.location.hash != prevHash) {
	        		prevHash = window.location.hash;       
	        		func();
	        	}
	        }, 100);
	    }
	    
	    func();
	},


	/***
		Method:			getHash
		Creator:		Jason Spangler
		Created:		12/18/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Stores the current hash as an array after the #!/
	*/
	getHash: function() {
		Basil.hash.hash = window.location.hash.substr(3).replace('-', '_').split('/');
	},
	

	/***
		Method:			getUrl
		Creator:		Jason Spangler
		Created:		12/18/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Sets the selected class on the top navigation while storing the URL and section
	*/
	getUrl: function() {
		// store the url
		Basil.hash.url = Basil.hash.ajax_path + Basil.hash.hash[0] + Basil.hash.ajax_extension;

		// stores the section we are in
		Basil.hash.section = Basil.hash.hash[0];
		
		// highlights the tab we are currently at in the navigation
		$$('#header a').removeClass('selected');
		
		// if secondary nav this will highlight that
		$$('.' + Basil.hash.section + '-nav').addClass('selected');
		
		// stores the section as the class on current view
		Basil.hash.view.className = Basil.hash.section;
	},
	

	/***
		Method:			handleResponse
		Creator:		Jason Spangler
		Created:		12/18/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	After AJAX call is made, data gets stored in $basil.view_object here. $basil.section_object is initialized and the section init function is called.
		@param: 		data (OBJECT) JSON object from AJAX call
	*/
	handleResponse: function(data) {

		// store the current section object to call functions
		basil.section_object = window[Basil.hash.section + '_Section'];
				
		// store the data
		basil.view_object = data;
		
		basil.change_detected = false;
		basil.hash_refresh = true;
		
		if (basil.section_object && basil.section_object.init) basil.section_object.init();
		
		basil.load_counter = 0;
		
		// load the view for current section
		basil.loadView(Basil.hash.view, basil.views_path + Basil.hash.section + '/views/main' + basil.view_ext);

	},


	/***
		Method:			listener
		Creator:		Jason Spangler
		Created:		12/18/12
	
		Modifier:		Jason Spangler
		Modified:		12/18/12
	
		Description:	Called when a hash change occurs. Does numerous checks to ensure we can go to next page.
						Function cleanupEvent is called to do any cleanup before changing section
						
		@param: 		e (EVENT) contains the oldURL to store for history
		@see			(CLASS) content_Section (METHOD) cleanupEvent
	*/
	listener: function(e) {
		if (e) Basil.hash.previousURL = e.oldURL;
		
		// the initial function to call immediately after hash change occurs
		if (basil.section_object && basil.section_object.cleanupEvent && !basil.section_object.cleanupEvent()) return;
		
		// returns array of the hash
		Basil.hash.getHash();
		
		// the url to call out to retrieve json information
		Basil.hash.getUrl();
		
		// post to the url to get the data for the page
		Basil.ajax.postJSON(Basil.hash.url, { hash: Basil.hash.hash }, Basil.hash.handleResponse);
		
	}
};
