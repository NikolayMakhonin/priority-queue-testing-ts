<?php

//echo '<pre>';
//var_dump($_GET);
//echo '<br>';
//var_dump($GLOBALS);
	
require_once("./includes/error_debug.php");
require_once("./includes/error.php");

$http_code = $_GET['http_code'];
$url = $_GET['url'];
$requestUri = $_SERVER['REQUEST_URI'];

$pos = strpos($requestUri, '?');
if ($pos !== false) {
	$query = substr($requestUri, $pos + 1, strlen($requestUri) - $pos - 1);
} else {
	$query = '';
}

if (strlen($query) > 0) {
	$separator = strpos($url, '?') !== false
		? '&'
		: '?';
	$url = $url.$separator.$query;
}

if (!isset($http_code) || !$http_code) {
	$http_code = 302;
}

if (isset($_SERVER['HTTP_REFERER'])) {
	$referer = $_SERVER['HTTP_REFERER'];
	if ($referer) {
		ErrorUtils::Log(LogRecType::Warning, "Redirect ($http_code) in $referer to $url", null, $referer.'\n'.$url);
	}
}

header('Location: ' . $url, true, $http_code);

