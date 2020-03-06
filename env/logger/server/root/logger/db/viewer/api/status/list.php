<?php

require_once('../includes/init.php');

$result = $db->query(
<<<SQL
    SELECT 
        Id,
        Name
    FROM Statuses
SQL
);
checkSqlErrors();

$rows = array();
while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}

$result = $db->query("SELECT Count(Id) Count FROM Statuses");
checkSqlErrors();
$totalCount = $result->fetch_object()->Count;

$result = array
(
	'Result' => 'OK',
	'Message' => null,
	'Records' => $rows,
	'TotalRecordCount' => $totalCount 
);

print json_encode_ext($result, JSON_PRETTY_PRINT);