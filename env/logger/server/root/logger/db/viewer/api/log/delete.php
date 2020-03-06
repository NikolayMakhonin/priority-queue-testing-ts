<?php

require_once('../includes/init.php');

$db->query(<<<SQL
	DELETE FROM Events
	WHERE LogId = UNHEX('{$_POST["Id"]}')
SQL
);
checkSqlErrors();

$db->query(<<<SQL
	DELETE FROM Logs
	WHERE Id = UNHEX('{$_POST["Id"]}')
SQL
);
checkSqlErrors();
	
$result = array
(
	'Result' => 'OK',
	'Message' => null
);

print json_encode_ext($result, JSON_PRETTY_PRINT);