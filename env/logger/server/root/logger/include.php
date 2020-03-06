<?php

/* 
Include to .htaccess:
RewriteRule ^(.*logs/logger/include.php\?.*)$ $1 [NC,L]
RewriteRule ^(.*\.php(\?\.*)?)$ logs/logger/include.php [NC,L]
*/

{
	$redirectRedirectStatus = $_SERVER["REDIRECT_REDIRECT_STATUS"];
	$redirectStatus = $_SERVER["REDIRECT_STATUS"];
	$redirectUrl = $_SERVER["REDIRECT_URL"];
	$redirectQueryString = $_SERVER["REDIRECT_QUERY_STRING"];
	
	unset($_SERVER["REDIRECT_REDIRECT_STATUS"]);
	unset($_SERVER["REDIRECT_STATUS"]);
	unset($_SERVER["REDIRECT_URL"]);
	unset($_SERVER["REDIRECT_QUERY_STRING"]);
	
	unset($HTTP_SERVER_VARS["REDIRECT_REDIRECT_STATUS"]);
	unset($HTTP_SERVER_VARS["REDIRECT_STATUS"]);
	unset($HTTP_SERVER_VARS["REDIRECT_URL"]);
	unset($HTTP_SERVER_VARS["REDIRECT_QUERY_STRING"]);
	
	require_once("./includes/error_debug.php");
	require_once("./includes/error.php");
	
	/*if ($redirectStatus >= 300 && $redirectStatus < 400) {
		$url = $redirectUrl;
		$query = $redirectQueryString;
		
		if (strlen($query) > 0) {
			$separator = strpos($url, '?') !== false
			? '&'
			: '?';
			$url = $url.$separator.$query;
		}	
		
		echo '<pre>';
		var_dump(headers_list());
		var_dump($GLOBALS);
		echo "header('Location: ' . $url, true, $redirectStatus);";
		
		//header('Location: ' . $url, true, 200);
		
		exit;
	}
	
	//header('Location: ' . '/qwe?wer', true, 200);
	*/
	
	$redirectFile = "{$_SERVER['DOCUMENT_ROOT']}{$redirectUrl}";
	if (!$redirectFile || !is_file($redirectFile)) {
		//if (isset($_SERVER['HTTP_REFERER'])) {
		//	ErrorUtils::Log(LogRecType::Error, "File not found: ".$redirectFile);
		//}
		$redirectUrl = "/err404.php";
		$redirectFile = "{$_SERVER['DOCUMENT_ROOT']}{$redirectUrl}";
	}	

	$_SERVER["SCRIPT_NAME"] = $redirectUrl;
	$_SERVER["SCRIPT_FILENAME"] = $redirectFile;
	$_SERVER["PHP_SELF"] = $redirectUrl;
	
	$HTTP_SERVER_VARS["SCRIPT_NAME"] = $redirectUrl;
	$HTTP_SERVER_VARS["SCRIPT_FILENAME"] = $redirectFile;
	$HTTP_SERVER_VARS["PHP_SELF"] = $redirectUrl;
	
	$redirectDir = dirname($redirectFile);
	chdir($redirectDir);
	
	require($redirectFile);
}

?>