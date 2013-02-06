

/***
#############################################################################################################################

	Basil.core.run.stem
	
	Stems are the backbone elements that spawn leaves.

#############################################################################################################################
*/
Basil.core.run.stem = new function() {
	this.leaves = new Object;
	this.leaf_unique_id_counter = 0;
	
	
	/***
		First time stem launch / hash listener setup, etc
	*/
		this.init = function() {
	
			// cache the app and stem wrapper element "<div bsl-app></div>"
			this.appWrapper 	= Basil.util.getElementsByAttribute(document.body, 'bsl-app')[0];
			
			if (!this.appWrapper) {
				Basil.log.warn('No bsl-app detected!');
				return;
			}
		
			if (!this.findDefaultStem()) {
				Basil.log.exception('No stems found');
				return;
			}
	
			// sets the location if no hash is present or no stem for location is found
			var leafFile = this.locate();
			
			this.setupHashListener();
						
			// Once we find the stem, pass the main-app-element to leaf.build()
			new Basil.core.run.leaf(this.appWrapper, false);
			
			this.stemWrapper 	= Basil.util.getElementsByAttribute(document.body, 'bsl-stem')[0];
			
			// if no stem is found inject it into the dom inside the app
			if (!this.stemWrapper) {
				this.appWrapper.innerHTML = '<div bsl-stem></div>';
				this.stemWrapper 	= Basil.util.getElementsByAttribute(document.body, 'bsl-stem')[0];
				Basil.log.warn('No stem wrapper found, inserting into app wrapper.');
			}
			
			// Load stem
			this.loadStem(leafFile);
		
		};
		
		
	/***
		First time stem launch / hash listener setup, etc
	*/
		this.setupHashListener = function() {
				
			// if not on internet explorer use the built in hash listener
			if (("onhashchange" in window) && !(window.msie) && !(window.ie)) {
				window.onhashchange = this.hashChangeEvent.bind(this);
			}
			
			// if ie, we have to do a makeshift hash listener, not desirable
			else {
		        var prevHash = window.location.hash;
	
		        window.setInterval(function () {
		        	if (window.location.hash != prevHash) {
		        		prevHash = window.location.hash;       
		        		this.hashChangeEvent();
		        	}
		        }, 100);
		    }
		}

	/***
		Called when a hash change occurs
	*/
		this.hashChangeEvent = function(e) {
			if (e.oldURL.search('#') < 0) return;
			
			// override to not continue changing the page
			if (Basil.core.run.stem.ignoreHash) {
				Basil.core.run.stem.ignoreHash = false;
				return;
			}
			
			// fire hash change event passing the element
			// Trigger user, before hash change
			if (Basil.onHashChange) Basil.onHashChange(e);
			
			// Trigger leaf, before hash change
			// passes back a new stem element to populate that represents section you are in
			this.stemWrapper = this.cleanLeaves(this.stemWrapper);
			
			// ensures we load the appropriate leaf
			var newStemLeaf = this.locate();
	
			// Load the new stem
			this.loadStem(newStemLeaf);
			
		};
	
	
	/***
		Loops through all child leaves, removes them appropriately to clean up all data
	*/
		this.cleanLeaves = function(leafEl) {
			// get all child leaves
			var childLeaves	= Basil.util.getElementsByAttribute(leafEl, 'bsl-leaf');

			// loop through each child and perform its unload function
			for (var i = childLeaves.length - 1; i >= 0; i--) {
				var el = childLeaves[i];
				
				Basil.util.fireEvent(el, 'destroy');
				
				el.parentNode.removeChild(el);
			}
			
			// clear the inner contents to clone element
			leafEl.innerHTML = '';
			
			// simple clone method
			var elementWrapper = leafEl.outerHTML;
			
			// create the new element
			var newElement = $(elementWrapper);
			
			// insert it after the old element
			$(leafEl).after(newElement);
			
			// remove the old element
			Basil.util.fireEvent(leafEl, 'destroy');
				
			leafEl.parentNode.removeChild(leafEl);
	
			// return the new element
			return $(newElement).get(0);
		};
	
	
	/***
		Initializes the creation of the first leaf in the stem (section)
	*/
		this.loadStem = function(stemLeaf) {
			new Basil.core.run.leaf(this.stemWrapper, stemLeaf);			
		};
		
	
	/***
		Stores the current hash as an array after the #!/
	*/
		this.locate = function() {
			// Check if there is a valid stem and the stem isn't empty, use the stem we found
			var hash = window.location.hash.substr(2);
			
			Basil.log.print(LOG_DASHES,'HASH CHANGE!',window.location.hash,LOG_DASHES);
			
			Basil.core.run.stem.hashParams = {};
			
			// if no hash or it is blank redirect
			if (!hash || hash == '') {
				window.location.hash = '#!' + this.defaultStem;
				var hash = window.location.hash.substr(2);
			}
			
			
			var foundPath = Basil.core.settings.stems[hash];
			
			if (foundPath) return foundPath;
			
			var hashParts =  hash.replace(/(^\/|\/$)/g, '').split('/');
			
			foundPath = Basil.util.each(Basil.core.settings.stems, function(stemHashPath,leafFile) {
				
				// Check if stemHashPath matches hash directly
				if (stemHashPath == hash) return stemHashPath;
				
				var stemHashParts = stemHashPath.replace(/(^\/|\/$)/g, '').split('/');
				
				if (hashParts.length == stemHashParts.length) {
				
					var foundLoopPath = undefined;
					var foundLoopPath = Basil.util.each(stemHashParts, function(key, stemHashPart) {
						if (stemHashPart.search(':') != 0) {
							if (stemHashPart != hashParts) {
								return undefined;
							}
						}
						
						// If we are at the last key, and aren't failing at life, we found it!
						if (key == stemHashParts.length -1) {
							return stemHashPath;
						}
						
					});
					
					if (foundLoopPath) {
						// Store hash parameters
						Basil.util.each(stemHashParts, function(key, stemHashPart) {
							if (stemHashPart.search(':') == 0) {
								Basil.core.run.stem.hashParams[stemHashPart.substr(1)] = hashParts[key];
							}
						});
						
						
						// return found path
						return foundLoopPath;
					}
				
				}
				
			}.bind(this));
			
			// if no foundPath, redirect to default
			if (!foundPath) window.location.hash = '#!' + this.defaultStem;

			return Basil.core.settings.stems[foundPath];
		};
		
		
	/***
		Finds the first stem and uses as the default
	*/
		this.findDefaultStem = function() {
			var defaultStem = false;
			this.defaultStem = Basil.util.each(Basil.core.settings.stems,function(key, value) {
				if (!defaultStem) return key;
			});
			
			return this.defaultStem ? this.defaultStem : false;	
		};
};