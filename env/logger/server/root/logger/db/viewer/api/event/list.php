<?php

require_once('../includes/init.php');

$result = $db->query(
<<<SQL
    SELECT 
        INET_NTOA(IP) IP,
        LastTime,
        Count
    FROM Events
    WHERE LogId = UNHEX('{$_POST["logId"]}')
    ORDER BY {$_GET["jtSorting"]}
    LIMIT 10
SQL
);
checkSqlErrors();

$rows = array();
while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}

$result = $db->query("SELECT Count(IP) Count FROM Events WHERE LogId = UNHEX('{$_POST["logId"]}')");
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