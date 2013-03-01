<?

###########################################################################################################
#	includeBasil function
###########################################################################################################


	function includeBasil($pathToBasil,$developmentMode=true) {
	
		if (!$developmentMode) {
			echo '<script src="'.rtrim($pathToBasil,'/').'/basil.min.js"></script>';
		} else {
		
			if ($files = scandir(rtrim($pathToBasil, '/').'/src/')) {
				
				// for each file in src/
				foreach ($files AS $num => $file) {
					
					if (preg_match('/(.*?).js/', $file)) {
						
						echo '<script src="'.rtrim($pathToBasil,'/').'/src/'.$file.'"></script>';
						
					}
					
				}
				
			}	
	
		}
	}

###########################################################################################################
#	Example Usage:
###########################################################################################################
/*

	require "path/to/basil/src_developer_js_loader.php";
	includeBasil('path/to/basil/src/');

*/
?>