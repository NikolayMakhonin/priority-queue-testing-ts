<?php

require_once('../includes/init.php');

$query = <<<SQL
	UPDATE Logs 
	SET StatusId = {$_POST["StatusId"]}
	WHERE Id = UNHEX('{$_POST["Id"]}')
SQL
;

//echo $query;

$db->query($query);
checkSqlErrors();
	
$result = array
(
	'Result' => 'OK',
	'Message' => null
);

print json_encode_ext($result, JSON_PRETTY_PRINT);