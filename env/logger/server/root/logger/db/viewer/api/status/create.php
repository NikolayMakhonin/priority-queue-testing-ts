<?php

require_once('../includes/init.php');

$query = <<<SQL
	INSERT INTO Statuses (Id, Name) VALUES
	({$_POST["Id"]}, '{$_POST["Name"]}')
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