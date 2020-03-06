<?php

require_once('../includes/init.php');

$result = $db->query(
<<<SQL
    SELECT 
        Id Value,
        Name DisplayText
    FROM Statuses
SQL
);
checkSqlErrors();

$rows = array();
while($r = $result->fetch_assoc()) 
{
    $rows[] = $r;
}

$result = array
(
	'Result' => 'OK',
	'Message' => null,
	'Options' => $rows
);

print json_encode_ext($result, JSON_PRETTY_PRINT);