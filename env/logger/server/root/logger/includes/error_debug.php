<?php

function ErrorDebugShutdownHandler()
{
	$error = error_get_last();
	$errno = $error['type'];
	
	if (is_array($error) && array_key_exists('type', $error) && 
	   ($errno & (E_ERROR | E_PARSE | E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_COMPILE_WARNING )) != 0) 
	{
		$logEvent = $error['message'].' in '.$error['file'].'('.$error['line'].')';
		echo $logEvent;
	}
}

register_shutdown_function("ErrorDebugShutdownHandler");	
