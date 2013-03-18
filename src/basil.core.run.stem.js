

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
			
			this.defaultStem = this.findDefaultStem();
			if (!this.defaultStem) {
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
			if (e && e.oldURL && e.oldURL.search('#') < 0) return;
			
			// fire hash change event passing the element
			// Trigger user, before hash change
			if (Basil.onHashChange) Basil.onHashChange(e);
			
			// override to not continue changing the page
			if (Basil.core.run.stem.ignoreHash) {
				Basil.core.run.stem.ignoreHash = false;
				return;
			}
			
			// Trigger leaf, before hash change
			// passes back a new stem element to populate that represents section you are in
			this.stemWrapper = this.cleanLeaves(this.stemWrapper);
			
			// ensures we load the appropriate leaf
			var newStemLeaf = this.locate();
	
			// Load the new stem
			this.loadStem(newStemLeaf);
			
			// fire hash change event passing the element
			// Trigger user, before hash change
			if (Basil.onStemChange) Basil.onStemChange(e);
			
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
			
			var newElement = Basil.util.clone(leafEl, true, false);
			
			//newElement.css('opacity', 1);
			Basil.util.css(newElement,'opacity',1);
			
			// insert it after the old element
			Basil.util.insertElementAfter(newElement,leafEl);
			//$(leafEl).after(newElement);
			
			// remove the old element
			Basil.util.fireEvent(leafEl, 'destroy');
				
			leafEl.parentNode.removeChild(leafEl);
	
			// return the new element
			return newElement;
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
			var foundPath = false;
			
			// Check if there is a valid stem and the stem isn't empty, use the stem we found
			var hash = window.location.hash.substr(2);
			
			// log hash change
			Basil.log.print(LOG_DASHES,'HASH CHANGE!',window.location.hash,LOG_DASHES);
			
			Basil.core.run.stem.hashParams = {};
			
			// if no hash or it is blank redirect
			if (!hash || hash == '') {
				window.location.hash = '#!' + this.defaultStem;
				var hash = window.location.hash.substr(2);
			}
			
			// if direct match return it
			if ((foundPath = Basil.core.settings.stems[hash])) return foundPath;
			
			var hashParts =  hash.replace(/(^\/|\/$)/g, '').split('/');
			
			Basil.util.each(Basil.core.settings.stems, function(stemHashPath,leafFile) {
				if (foundPath) return;

				// Check if stemHashPath matches hash directly
				if (stemHashPath == hash) {
					foundPath = stemHashPath;
					return;
				}
				
				// 
				var stemHashParts = stemHashPath.replace(/(^\/|\/$)/g, '').split('/');
				
				// if found a stem that has same parts as the hash then check the parts
				if (hashParts.length == stemHashParts.length) {
				
					var foundLoopPath = undefined;
					
					var stemMatchHash = true;
					
					// loop through each part of the stem
					Basil.util.each(stemHashParts, function(key, stemHashPart) {
						if (foundLoopPath) return;
						
						if (stemHashPart.search(':') != 0) {
							if (stemHashPart != hashParts[key]) {
								stemMatchHash = false;
								return;
							}
						}
						
						// If we are at the last key, and aren't failing at life, we found it!
						if (key == stemHashParts.length -1) {
							foundLoopPath = stemHashPath;
							return;
						}
						
					});
					
					if (foundLoopPath && stemMatchHash) {
						// Store hash parameters
						Basil.util.each(stemHashParts, function(key, stemHashPart) {
							if (stemHashPart.search(':') == 0) {
								Basil.core.run.stem.hashParams[stemHashPart.substr(1)] = hashParts[key];
							}
						});
						
						
						// return found path
						foundPath = foundLoopPath;
					}
				
				}
				
			}.bind(this));
			
			// if no foundPath, redirect to default
			if (!foundPath) {
				window.location.hash = '#!' + this.defaultStem;
				return;
			}
			
			this.stemPath = foundPath;
			return Basil.core.settings.stems[foundPath];
		};
		
		
	/***
		Finds the first stem and uses as the default
	*/
		this.findDefaultStem = function() {
			var defaultStem = false;
			Basil.util.each(Basil.core.settings.stems,function(key, value) {
				if (!defaultStem) defaultStem = key;
			});
			
			return defaultStem;	
		};
};