<?php

require_once('../includes/db.php');

$query = <<<SQL
	SELECT MessageFull FROM Logs
	WHERE Id = UNHEX('{$_GET["id"]}')
	LIMIT 1
SQL
;

$result = $db->query($query);

if ($db->error) {
    ErrorUtils::Log(LogRecType::Error, htmlspecialchars($db->error, ENT_COMPAT | ENT_HTML401, 'UTF-8'));
    die($db->error);
}

$message = $result->fetch_object()->MessageFull;

header('Content-Type: text/html; charset=utf-8');
echo "<pre>\r\n$message\r\n</pre>";