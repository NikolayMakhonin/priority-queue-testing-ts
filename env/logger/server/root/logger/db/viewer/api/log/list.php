<?php

require_once('../includes/init.php');

$filters = "";

if (isset($_POST["filter_status"]) && count($_POST["filter_status"]) > 0) {
    $filter = "";
    foreach ($_POST["filter_status"] as $value) {
        if ($filter != "") {
            $filter .= ", ";
        }
        $filter .= $value;
    }   
    
    if ($filters != "") {
        $filters .= " AND ";
    }
    
    $filters .= "l.StatusId IN ({$filter})";
}

if (isset($_POST["filter_type"]) && count($_POST["filter_type"]) > 0) {
    $filter = "";
    foreach ($_POST["filter_type"] as $value) {
        if ($filter != "") {
            $filter .= ", ";
        }
        $filter .= $value;
    }   
    
    if ($filters != "") {
        $filters .= " AND ";
    }
    
    $filters .= "l.TypeId IN ({$filter})";
}

if (isset($_POST["filter_message"]) && strlen($_POST["filter_message"]) > 0) {
    $filter = $db->real_escape_string($_POST['filter_message']);
    
    if ($filters != "") {
        $filters .= " AND ";
    }
    
    $filters .= "(l.MessageShort LIKE '%$filter%' OR l.MessageFull LIKE '%$filter%')";
}

if (isset($_POST["filter_ip"]) && strlen($_POST["filter_ip"]) > 0) {
    $filter = "";
    foreach (preg_split("/,/",$_POST["filter_ip"]) as $value) {
        if ($filter != "") {
            $filter .= ", ";
        }
        $filter .= "INET_ATON('".trim($value)."')";
    }   
    
    if ($filters != "") {
        $filters .= " AND ";
    }
    
    $filters .= "e.IP IN ({$filter})";
}

if ($filters != "") {
    $filters = "WHERE {$filters}";
}

//echo $filters;

//var_dump($_GET);

$result = $db->query(
<<<SQL
	SELECT
    	LOWER(HEX(q1.Id)) Id,
        q1.StatusId,
        q1.TypeId,
        q1.AppName,
        q1.AppVersion,
        q1.MessageShort,
        q1.LastTime,
        q1.CountIPs,
        q1.TotalCount,
        (SELECT INET_NTOA(e2.IP) FROM Events e2 WHERE e2.LogId = q1.Id AND e2.LastTime = q1.LastTime LIMIT 1)  LastIP
	FROM
        (SELECT 
            l.Id,
         	l.StatusId,
         	l.TypeId,
        	l.AppName,
            l.AppVersion,
            l.MessageShort,
            MAX(e.LastTime) LastTime,
            COUNT(e.IP) CountIPs,
            SUM(e.Count) TotalCount
        FROM Logs l
        LEFT JOIN Events e ON e.LogId = l.Id
        {$filters}
        GROUP BY l.Id) q1
    ORDER BY {$_GET["jtSorting"]}
    LIMIT {$_GET["jtStartIndex"]}, {$_GET["jtPageSize"]}
SQL
);
checkSqlErrors();

$rows = array();
while($r = $result->fetch_assoc()) {
    $rows[] = $r;
}

$result = $db->query("SELECT Count(Id) Count FROM Logs");
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