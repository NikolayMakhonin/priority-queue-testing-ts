<?php
require_once("../../../../includes/auth.php");
require_once(__DIR__ . "/db.php");
header('Content-Type: application/json');

function utf8ize($d) {
    return $d;
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}

function checkJsonErrors() 
{
    if (json_last_error()) 
    {
		$result = array
		(
			'Result' => 'Error',
			'Message' => utf8ize(json_last_error_msg())
		);

		print json_encode($result, JSON_PRETTY_PRINT);
		die();
    }
}

function json_encode_ext($data) {
    $json = json_encode(utf8ize($data));
    checkJsonErrors();
    return $json;
}

function checkSqlErrors() 
{
	if ($db->error) {
		$result = array
		(
			'Result' => 'Error',
			'Message' => $db->error
		);

		print json_encode_ext($result, JSON_PRETTY_PRINT);
		die();
	}
}
