
Basil.core.event_actions = {
	leaf: function(e, targetEl, targetFile, optionalHashAliasChange) {

		if (optionalHashAliasChange) {
			Basil.core.run.stem.ignoreHash = true;
			window.location.hash = optionalHashAliasChange;
		}
		
		var leafEl = Basil.util.getElementBySelector(targetEl);
		
		// cleans up every leaf inside the element
		// removes itself from the dom to do it's cleanup
		// passes back a skeleton clone
		var elementToPass = Basil.core.run.stem.cleanLeaves(leafEl);

		new Basil.core.run.leaf(elementToPass, targetFile);
	},
	
	alert: function(e, str) { alert(str); },
	
	location: function(e, url) {
		if (url.search('#') == 0) window.location.hash = url;
		else window.location = url;
	}
}