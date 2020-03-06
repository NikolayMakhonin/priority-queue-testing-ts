<?php
$db = mysqli_connect("localhost", "otoka112_logs", "B3p1VqIS9H", "otoka112_logs");
$db->query("SET time_zone = '+00:00'");
$db->set_charset("utf8mb4");

function getDbSize() {
    global $db;
    
    $query = <<<SQL
        SELECT SUM(data_length + index_length) Size
        FROM information_schema.tables
        WHERE table_schema = "otoka112_logs"   
SQL
;

    return $db->query($query)->fetch_object()->Size;
}