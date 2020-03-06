<?php
    require_once(__DIR__ . "/error_debug.php");
	require_once(__DIR__ . "/error.php");

	LogEvent::StaticInit();
	
	if (!file_exists("{$_SERVER['DOCUMENT_ROOT']}/is_dev_version")) {
		$DebugLogAuth->CheckAuth();
	}
	