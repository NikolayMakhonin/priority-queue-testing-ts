<?php

require_once('../includes/init.php');

$db->query(<<<SQL
	DELETE FROM Events
SQL
);
checkSqlErrors();

$db->query(<<<SQL
	DELETE FROM Logs
SQL
);
checkSqlErrors();
	
$result = array
(
	'Result' => 'OK',
	'Message' => null
);

print json_encode_ext($result, JSON_PRETTY_PRINT);