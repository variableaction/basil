
Basil.core.run.leaf = function(leafEl,leafFile,leafParentLeafID) {
				
		this.element 		= leafEl;
		this.file 			= leafFile;

		this.data			= undefined;
		this.resource		= undefined;
		this.actions		= {};
				
		this.dataready 		= false;
		this.htmlready 		= false;
		
		
		var ajax 			= Basil.util.ajax;
		
		this.load 			= function() {};
		this.unload 		= function() {};
		
		// if the leaf exists in app, add the actions and the resource
		if (this.file) {
		
			var leafNameForCustomObjects = this.file.split('?').shift();
			
			if (Basil.app.leaves[leafNameForCustomObjects]) {
				Basil.util.each(Basil.app.leaves[leafNameForCustomObjects], function(name, obj) {
					this[name] = obj;
				}.bind(this));
			}
		}
				
		this.storeLeafInstance = function() {
		
			// Set unique leaf ID
			this.leaf_id 		= ++Basil.core.run.stem.leaf_unique_id_counter;
			
			// Set this parent ID if one was provided in arguments
			this.leaf_parent_id = (leafParentLeafID > -1) ? leafParentLeafID : null;
			
			// Add this ID to parent's child IDs
			if (Basil.core.run.stem.leaves[this.leaf_parent_id]) {
				if ( Basil.core.run.stem.leaves[this.leaf_parent_id].childIDs === undefined ) {
					Basil.core.run.stem.leaves[this.leaf_parent_id].childIDs = new Array;
				}
				Basil.core.run.stem.leaves[this.leaf_parent_id].childIDs.push(this.leaf_id);
			}
			
			// Store leaf to instances Array (really an object)
			Basil.core.run.stem.leaves[this.leaf_id] = this;
			
		}
		
		this.build = function() {

			if (!this.file) {
				this.process();
				return;
			}
		
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
			this.load();
						
			this.addUnloadEvent();
						
			this.showElement();
						
		};
		
		
		this.addUnloadEvent = function() {
		
			Basil.util.addEvent(this.element, 'destroy', function(e) {
				// call the unload function to do any necessary cleanup
				this.unload();
			
				// Remove leaf from leaf instances
				delete Basil.core.run.stem.leaves[this.leaf_id];
				
				// stops propagation so this only gets called once
				e.stopPropagation();
				return false;
			}.bind(this));
			
		}
		
		
		this.findLoops = function(leafEl) {
			// gets all items that have bsl-loop
			var leaves = Basil.util.getElementsByAttribute(leafEl, 'bsl-loop');

			// if no leaves then continue processing page
			if (!leaves.length) return;
			
			// for each leaf with a loop
			Basil.util.each(leaves, function(index, loop) {
			
				// get the data to be looping
				// items
				//!! FUTURE use cases:
				// items as item 
				data_key 	= loop.getAttribute('bsl-loop');
				
				// If the resource being requested 
				if (data_key.search('resource:') == 0) {
					var resource = data_key.split(':').pop();
					
					ajax.getJSON(resource, {
						callback: function(data) {
							this.processLoops(loop, data);
						}.bind(this),
						async: true
					});
					
				
				// else if the data exists then loop through the data
				} else if (this.data[data_key]) {
					
					this.processLoops(loop, this.data[data_key]);
					
				}
			}.bind(this));
			
		};
		
		this.processLoops = function(loop, data) {	
			
			//var loopCount = 0;
			
			
			// create template div to copy			
			templateHTML = loop.innerHTML;
			
			var templateCopy, newHTML = '';

			// loops through all the data
			Basil.util.each(data, function(index, obj) {
			
				// finds any data hugs
				newHTML += this.findHugs(templateHTML, obj);
										
				//loopCount++;
				//Basil.log.print(loopCount);
								
			}.bind(this));
			
			loop.innerHTML = newHTML;
			
		};


		this.findHugs = function(leafEl, data) {
			if (!data) data = this.data;
			if (typeof leafEl != 'string') var innerHTML = leafEl.innerHTML;
			else var innerHTML = leafEl;
			
			// process hash variables in hugs
			innerHTML = innerHTML.replace(/\{\{hash:(.*?)\}\}/g, function(hug, key) {
			
				hashParamBeingRequested = key.trim().split(':').pop();
			
				return Basil.core.run.stem.hashParams[hashParamBeingRequested];
				
			});
			
			// process normal data hugs
			innerHTML = innerHTML.replace(/\{\{(.*?)\}\}/ig, function(with_hugs, key){
				return data[key.trim()];
				
			}.bind(this));
			
			if (typeof leafEl == 'string') return innerHTML;
			else leafEl.innerHTML = innerHTML;
		};
		
		
		
		this.findLeaves = function(leafEl) {
			
			
			var leaves = Basil.util.getElementsByAttribute(leafEl, 'bsl-leaf');

			Basil.util.each(leaves,function(key,leaf) {
				
				var leafFile = leaf.getAttribute('bsl-leaf');
				
				if (leafFile != '') new Basil.core.run.leaf(leaf,leafFile,this.leaf_id);
				
			}.bind(this));
			
		};
		
		
		this.findEvents = function(leafEl) {
			/*var event_types = [	'focus','blur','change','click','dblclick','error',
								'keydown','keyup','keypress','load','contextmenu',
								'mousedown','mouseup','mouseenter','mouseleave','mousemove',
								'touchstart','touchmove','touchend','touchcancel',
								'resize','scroll','submit','unload'];*/
								
			// load
			// also need to add event in the future contentsloaded
			
			// get all leaves
			var leaves = Basil.util.getElements(leafEl);
			
			// store variables to help with memory
			var event, leafEvent, params, func, funcString, leaf_attributes;
			
			// loop through each leaf looking for events
			Basil.util.each(leaves, function(key, leaf) {

				// loop through all the attributes of the leaf
				Basil.util.each(leaf.attributes, function(index, attr) {
				
					// tries to remove bsl-e- from the attr to test if in array
					leafEvent = attr.nodeName.split('-e-')[1];
				
					// if there is an event attribute and it exists as a known 						
					if (!leafEvent) return;
					
					// get the value inside the node
					funcString 	= attr.nodeValue ? attr.nodeValue.trim() : '';
					
					funcs		= funcString.split(';');

					Basil.util.each(funcs, function(num, funcString) {

						split 		= funcString.split('(');
						func 		= split[0].trim();
						params		= split[1] ? split[1].split(')').shift() : '';
						
						if (params) {
							var new_params = [];

							Basil.util.each(params.split(','), function(index, param) {
								param = param.trim();
								
								// store the string
								if (param.search('\'') == 0 || param.search('"') == 0) new_params.push(param.substr(1, param.length -2));
								else if (param == 'this') new_params.push(leaf);
								else if (param == 'true') new_params.push(true);
								else if (param == 'false') new_params.push(false);
								else {
									new_params.push(window[param]);
								}
							});
							params = new_params;
						}

						// if provided in the leaf actions use this action
						if (this.actions[func]) {							
							Basil.util.addEvent(leaf, leafEvent, this.actions[func].bind(this), params);
						}
						
						else if (Basil.app.actions[func]) {							
							Basil.util.addEvent(leaf, leafEvent, Basil.app.actions[func], params);
						}
						
						else if (Basil.core.event_actions[func]) {							
							Basil.util.addEvent(leaf, leafEvent, Basil.core.event_actions[func], params);
						}
						
					}.bind(this));
					
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

		// stores the leaf id, the parent id of this leaf and adds to the list of leaves in stem
		this.storeLeafInstance();

		this.build();
};