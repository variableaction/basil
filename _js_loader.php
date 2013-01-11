<?
	//session_start();
   ob_start("ob_gzhandler");
   header ("content-type: text/javascript; charset: UTF-8");
   header ("cache-control: must-revalidate");
   
   error_reporting(1);
   ini_set('display_errors',1);
   
   //$offset = 60 * 60;
   // offset by 30 days (30 * 24 * 60 * 60)
   // offset by 1 hour (60 * 60)
   $offset = ($_SERVER['REMOTE_ADDR'] == "174.79.250.227") ? 0 : (60 * 60);
   $expire = "expires: " . gmdate ("D, d M Y H:i:s", time() + $offset) . " GMT";
   header ($expire);

   $jsFiles = array();
   
   function addFilesFromDirectory($directory, $arr) {
	   
	   if ($files = scandir($directory)) {
			
			foreach ($files AS $num => $file) {
				
				if (preg_match('/(.*?).js/', $file)) {
					
					$arr[] = $directory . $file;
					
				}
				
			}
			
		}
		
		return $arr;
   }
################################################################################################################################
#	ZESTY MAIN CSS (NEW VERSION)
################################################################################################################################
	$jsFiles = addFilesFromDirectory('lib/', $jsFiles);
	
	$jsFiles[] = '__init.js';
	$jsFiles[] = '_ajax.js';
	$jsFiles[] = '_basil.js';
	$jsFiles[] = '_hash.js';
	
################################################################################################################################
#	SECTIONS
################################################################################################################################
	$arr = array('home', 'zesty_n', 'zesty_accounts', 'zeal', 'dash', 'basil');


	foreach ($arr as $section) {
		$jsFiles = addFilesFromDirectory('sections/' . $section . '/', $jsFiles);
		$jsFiles = addFilesFromDirectory('sections/' . $section . '/helpers/', $jsFiles);	
	}
	
	$jsFiles = addFilesFromDirectory('shared/behaviors/', $jsFiles);
	
	$jsFiles = addFilesFromDirectory('shared/triggers/', $jsFiles);
		
	foreach ($jsFiles as $file) {
		include($file);
	}

?>		