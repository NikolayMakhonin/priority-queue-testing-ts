<?php
	require_once("./includes/auth.php");

	if (isset($_POST["clear_log"]) && $_POST["clear_log"] == 1 || isset($_GET["clear_log"]) && $_GET["clear_log"] == 1) {
		ErrorUtils::ClearLog();
		header("Location: ".$_SERVER["HTTP_REFERER"]);
		exit;
	}
	
	$template = isset($_GET['template']) ? '_'.$_GET['template'] : '_noNotice';
	
	header ("Content-Type:text/xml");  
	echo '<?xml version="1.0" encoding="utf-8" ?>'."\r\n";
	echo '<?xml-stylesheet type="text/xsl" href="DebugLog'.$template.'.xsl"?>'."\r\n";
	echo "<root>\r\n";
	echo "\t<LogUrls>\r\n";
	echo "\t\t<LogUrl></LogUrl>\r\n";
	echo "\t</LogUrls>\r\n";
	echo "\t<EventInfos>\r\n";
	if (LogEvent::$EventIds) {
	foreach (LogEvent::$EventIds as $guid => $eventInfo)
	{  
		echo "\t\t<EventInfo guid=\"".$guid."\"><LastTime>".LogEvent::microtimeToString($eventInfo[0])."</LastTime><Count>".$eventInfo[1]."</Count></EventInfo>\r\n";
	}
	}
	echo "\t</EventInfos>\r\n";
	if (file_exists(ErrorUtils::$error_log_file)) include(ErrorUtils::$error_log_file);
	echo "</root>\r\n";
?>