

Basil.core.run.leaf = function(leafEl,leafFile) {
		
		
		this.element 	= leafEl;
		this.file 		= leafFile;
		this.data		= undefined;
		
		this.dataready 	= false;
		this.htmlready 	= false;
		
		var ajax 		= Basil.util.ajax;
		
		this.build = function() {
						
			// Run cleanup on insides of element?
			// Check for destrcut events on each element?
			// Run those actions
			// Remove contents
						
			// Apply events
			//this.applyEvents(leafEl);
			console.log('check it out');
			console.log(this.file);
			console.log(Basil.app.leaves);
			
			if (Basil.app.leaves[this.file] && typeof Basil.app.leaves[this.file].data == 'string') {
				
				// Check for hug in data, if there, fill it in
					// if it is 'hash:param', get it from Basil.core.run.stem.hashParams
				
				// data: '/+/user.json?id={{hash:id}}',			// {{hash:*}}
				var new_data_url = Basil.app.leaves[this.file].data.replace(/\{\{(.*?)\}\}/g, function(hug, key) {
				
					hashParamBeingRequested = key.trim().split(':').pop();
				
					return Basil.core.run.stem.hashParams[hashParamBeingRequested];
					
				});
				
				//var leafInstanceDataLoaded = {};
				ajax.getJSON(new_data_url,{
					
					callback: function(response) {
						//Basil.util.elData(el,'data',leafInstanceDataLoaded);
						
						this.data = response;
						
						if (this.htmlready) {
							this.process();
						}	
						
						this.dataready = true;
						
						
					}.bind(this)
					
					
				});
				
			} else {
				this.dataready = true;
			}
			
			// accessed later by hugs like this:
			//Basil.util.elData(el,'data',).property;
			
			
			
			
			
			// Check for actual leaf object
			
			// If leaf object
				// Load data if dataURL is set?
			
				// If cleanup method
					// Store cleanup method to el.data('cleanup',func);
					// by attribute bsl-leaf="whatever"
					// Basil.settings.stems['whatever'].cleanup()
			
			// Get the actual leaf contents and load it into element
/*
			ajax.get(Basil.core.settings.leaf_path + leafFile, {
				callback: Basil.util.populate.pass(leafEl)
				target: leafEl
			});
*/
			
			Basil.util.ajax.get(Basil.core.settings.leaf_path + leafFile, {
				callback: function(response) {
					
					this.view_response = response;
					
					if (this.dataready) {
						this.process();
					}	
					
					this.htmlready = true;
					//this.findLeaves(leafEl);
					
					
				}.bind(this)
			});
			
			
			
			
			
			
			// Remove attributes (if not in debug mode)
			//if (!Basil.core.settings.debug) this.removeBasilAttributes();
			
			
			
			
			
	
		};
		
		
		this.process = function() {

			this.findHugs();
			
			Basil.util.html(this.element, this.view_response);
			
			this.findLeaves(this.element);
			
			this.removeBasilAttributes();
			
		};
		
		this.removeBasilAttributes = function() {
			
		};
		
		
		this.findHugs = function() {
			
			// process hash variables in hugs
			this.view_response = this.view_response.replace(/\{\{hash:(.*?)\}\}/g, function(hug, key) {
			
				hashParamBeingRequested = key.trim().split(':').pop();
			
				return Basil.core.run.stem.hashParams[hashParamBeingRequested];
				
			});
			
			// process normal data hugs
			this.view_response = this.view_response.replace(/\{\{(.*?)\}\}/ig, function(with_hugs, key){

				return this.data[key.trim()];
				
			}.bind(this));
		};
		
		
		this.findLeaves = function(leafEl) {
						
			var leaves = Basil.util.getElementsByAttribute(leafEl, 'bsl-leaf');

			Basil.util.each(leaves,function(key,leaf) {
				
				var leafFile = leaf.getAttribute('bsl-leaf');
				
				if (leafFile != '') new Basil.core.run.leaf(leaf,leafFile);
				
			}.bind(this));
			
		};


		this.build();
};