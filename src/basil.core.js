
Basil.core.event_actions = {
	leaf: function(targetEl, targetFile, optionalHashAliasChange) {
		if (optionalHashAliasChange) {
			Basil.core.run.stem.ignoreHash = true;
			window.location.hash = optionalHashAliasChange;
		}
		
		var leafEl = Basil.util.getElementBySelector(targetEl);
		
		new Basil.core.run.leaf(leafEl, targetFile);
	},
	
	alert: function(str) { alert(str); },
	
	location: function(url) {
		if (url.search('#') == 0) window.location.hash = url;
		else window.location = url;
	}
}