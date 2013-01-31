


Basil.core.run.stem = new function() {
	
		// First time stem launch / hash listener setup, etc
		this.init = function() {
			
		
			if (!this.findDefaultStem()) this.exception('No stems found');

			// sets the location if no hash is present or no stem for location is found
			var leafFile = this.locate();
			
			this.setupHashListener();
			
			// cache the stem wrapper element "<div bsl-app></div>"
			this.stemWrapper = Basil.util.getElementsByAttribute(document.body, 'bsl-app')[0];
			
			// Once we find the stem, pass the main-app-element to leaf.build()
			this.loadStem(leafFile);
		
		};
		
		
		this.findStemLeaf = function() {
			// if we don't find a stem for current location use default stem
			if (!Basil.core.settings.stems[this.hashPath]) window.location.hash = '#!' + Basil.core.settings.stems[this.defaultStem];
			
			// else use the stem for current place
			else return Basil.core.settings.stems[this.hashPath];
		}
		
		
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
		
		
		// on hash change
		
		this.hashChangeEvent = function(e) {
			if (e.oldURL.search('#') < 0) return;
			// Trigger user, before hash change
			// Trigger leaf, before hash change
			
			// store params if exist in matched path (grab them from actual hash)
			
			// if no stem
			
			var newStemLeaf = this.locate();
			
			// Load that stem
			this.loadStem(newStemLeaf);
			
		}
		
		
		// Find stem or redirect
		
		// load stem?
		
		this.loadStem = function(stemLeaf) {

			//var el = Basil.util.getElementsByAttribute('bsl-app')[0];
			new Basil.core.run.leaf(this.stemWrapper, stemLeaf);
			
		}
		
	
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
			
			
			var foundPath = undefined;
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
				
				/*
				
				Test case:
					
					( Another for later is /users/* )
					
					stemHashPath	= /users/:id/
					hash			= /users/24/
					
				
				*/
				
				// Check how many slashes and if it matches
				
				
				
				
				
				// if it doesn't, check if stemHashPath matches with wildcard
					// break into pieces
					// compare pieces that aren't in variable positions
				
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