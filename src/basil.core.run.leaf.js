

Basil.core.run.leaf = function(leafEl,leafFile) {
		
		this.cleanup	= function() {};
		
		this.element 	= leafEl;
		this.file 		= leafFile;
		this.data		= undefined;
		this.resource	= undefined;
		
		this.dataready 	= false;
		this.htmlready 	= false;
		
		var ajax 		= Basil.util.ajax;
		
		// if the leaf exists in app, add the actions and the resource
		if (Basil.app.leaves[this.file]) {
			Basil.util.each(Basil.app.leaves[this.file], function(name, obj) {
				this[name] = obj;
			}.bind(this));
		}
		
		this.build = function() {
		
			// immediately hide the element so we can load everything without looking janky
			this.hideElement();
						
			
			// Check for destrcut events on each element?
			// Run those actions
			// Remove contents
						
			// Apply events
			//this.applyEvents(leafEl);

			
			if (typeof this.resource == 'string') {
				
				// Check for hug in data, if there, fill it in
					// if it is 'hash:param', get it from Basil.core.run.stem.hashParams
				
				// data: '/+/user.json?id={{hash:id}}',			// {{hash:*}}
				var new_resource = this.resource.replace(/\{\{(.*?)\}\}/g, function(hug, key) {
				
					hashParamBeingRequested = key.trim().split(':').pop();
				
					return Basil.core.run.stem.hashParams[hashParamBeingRequested];
					
				});
				
				//var leafInstanceDataLoaded = {};
				ajax.getJSON(new_resource,{
					
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
										
					Basil.util.html(this.element, response);
					
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
			
			this.findLoops(this.element);
			
			this.findHugs(this.element);
			
			this.findLeaves(this.element);
			
			this.findEvents(this.element);
			
			//this.removeBasilAttributes();
			
			this.showElement();
			
		};
		
		
		this.findLoops = function(leafEl) {
			// gets all items that have bsl-loop
			var leaves = Basil.util.getElementsByAttribute(leafEl, 'bsl-loop');
			
			// if no leaves then continue processing page
			if (!leaves.length) return;
			
			// for each leaf with a loop
			Basil.util.each(leaves, function(index, leaf) {
			
				// get the data to be looping
				// items
				//!! FUTURE use cases:
				// items as item 
				data_key 	= leaf.getAttribute('bsl-loop');
				
				// if the data exists then loop through the data
				if (this.data[data_key]) {
					
					// loops through all the data
					Basil.util.each(this.data[data_key], function(index, obj) {
					
						// clones the loop node to insert into dom
						var loop_el	= leaf.cloneNode(true);
						
						// finds any data hugs
						this.findHugs(loop_el, obj);
						
						// inserts node into the dom
						leaf.parentNode.appendChild(loop_el);
					}.bind(this));
					
				}
				
				// removes the actual loop node from the dom
				leaf.parentNode.removeChild(leaf);
			}.bind(this));
			
		};


		this.findHugs = function(leafEl, data) {
			if (!data) data = this.data;
			
			// process hash variables in hugs
			leafEl.innerHTML = leafEl.innerHTML.replace(/\{\{hash:(.*?)\}\}/g, function(hug, key) {
			
				hashParamBeingRequested = key.trim().split(':').pop();
			
				return Basil.core.run.stem.hashParams[hashParamBeingRequested];
				
			});
			
			// process normal data hugs
			leafEl.innerHTML = leafEl.innerHTML.replace(/\{\{(.*?)\}\}/ig, function(with_hugs, key){
				return data[key.trim()];
				
			}.bind(this));
		};
		
		
		this.findLeaves = function(leafEl) {
						
			var leaves = Basil.util.getElementsByAttribute(leafEl, 'bsl-leaf');

			Basil.util.each(leaves,function(key,leaf) {
				
				var leafFile = leaf.getAttribute('bsl-leaf');
				
				if (leafFile != '') new Basil.core.run.leaf(leaf,leafFile);
				
			}.bind(this));
			
		};
		
		
		this.findEvents = function(leafEl) {
			var event_types = [	'focus','blur','change','click','dblclick','error',
								'keydown','keyup','keypress','load','contextmenu',
								'mousedown','mouseup','mouseenter','mouseleave','mousemove',
								'touchstart','touchmove','touchend','touchcancel',
								'resize','scroll','submit','unload'];
								
			var leaves = Basil.util.getElements(leafEl);
			var event, attr_str, params, func, func_str, leaf_attributes;
			
			Basil.util.each(leaves, function(key, leaf) {
				leaf_attributes = leaf.attributes;

				if (!leaf_attributes.length) return;
				
				Basil.util.each(leaf_attributes, function(index, attr) {
					// tries to remove bsl-e- from the attr to test if in array
					attr_str = attr.nodeName.split('-e-')[1];
										
					if (attr_str && (event = event_types.indexOf(attr_str)) > -1) {
						func_str 	= attr.nodeValue ? attr.nodeValue.trim() : '';
						func		= func_str.match(/^[a-zA-Z0-9_ ]+/)[0]; //func_str.match(/([a-zA-Z0-9_ ]+)\((.*?)\)/ig);
						params		= func_str.match(/\((.*?)\)/)[1];
						params		= params !== undefined ? params.split(',') : undefined;

						// if provided in the leaf actions use this action
						if (this.actions[func]) {
							Basil.util.addEvent(leaf, event_types[event], this.actions[func], params);
						}
						
						if (Basil.core.event_actions[func]) {
							Basil.util.addEvent(leaf, event_types[event], Basil.core.event_actions[func], params);
						}
							
					}
				}.bind(this));
				
			}.bind(this));
				
		};
		
		
		this.removeBasilAttributes = function() {
		
		};
		
		this.hideElement = function() {
			if (Basil.core.settings.displayGradually) {
				if (window.jQuery) $(this.element).hide();
			} else {
				this.element.style.visibility 	= 'hidden';
				this.element.style.opacity		= 0;
			}
		};
		
		
		this.showElement = function() {
			if (Basil.core.settings.displayGradually) {
				if (window.jQuery) $(this.element).fadeIn(Basil.core.settings.displaySpeed);
			} else {
				this.element.style.visibility 	= 'visible';
				this.element.style.opacity		= 1;
			}
		};


		this.build();
};