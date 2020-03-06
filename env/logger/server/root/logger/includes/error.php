<?php

date_default_timezone_set('UTC');

ErrorUtils::SetHandlers();

$DebugLogAuth = new BasicAuth("admin", "admin");

//ErrorUtils::Log(LogRecType::Error, GenerateRandomString());

//die(LogEvent::html_encode(GenerateRandomString()));

function GenerateRandomString() {
	$string = '';
	for ($i = 0; $i <= 65535; $i++) {
		$string .= chr(rand(0, 255));
	}
	return $string;
}

if (!defined("E_DEPRECATED")) define ("E_DEPRECATED", 8192);
if (!defined("E_USER_DEPRECATED")) define ("E_USER_DEPRECATED", 16384);

class ErrorUtils 
{
	public static $error_emails; //массив Email куда слать сообщения о критических ошибках
	public static $error_email_sender; //отправитель лога
	public static $error_log_file; //файл куда писать логи
	public static $error_msg_url; //куда перенаправлять пользователя в случае ошибок
	public static $error_level; //error_reporting
	public static $inlineIgnoreErrorTypes; //Включить оператор @ подавления ошибок для типов ошибок указанных в переменной
	public static $lockedFiles = array();
	
	private static function initSettings() {
		$currentFileDir = dirname(ErrorUtils::getCurrentFilePath());
		//Настройки лога
		LogEvent::$LogDistinct = true;//исключить повторяющиеся ошибки за время жизни сессии
		LogEvent::$DefaultNoNotice = true;//отключить показ Notice и Warning
		//ErrorUtils::$error_emails = array("VoyagerEternal@mail.ru"); //массив Email куда слать сообщения о критических ошибках
		//ErrorUtils::$error_email_sender = "DinoMS Error Log <noreply.dinoms.net>"; //отправитель лога
		ErrorUtils::$error_log_file = str_replace('\\', '/', $currentFileDir)."/DebugLog.xml"; //файл куда писать логи
		LogEvent::$LogEventStateFile = str_replace('\\', '/', $currentFileDir)."/DebugLogState.json"; //файл куда писать глобальные переменные лога
		ErrorUtils::$error_msg_url = "http://".str_replace('\\', '/', $_SERVER['SERVER_NAME'])."/500.phtml"; //куда перенаправлять пользователя в случае ошибок
		ErrorUtils::$IgnoreErrorTypes = 0; //только для события set_error_handler()
		ErrorUtils::$IgnoreLogRecTypes = LogRecType::None; //LogRecType::Warning; //только для метода Log()
		ErrorUtils::$error_level = E_ALL & ~E_NOTICE; // & ~E_STRICT & ~E_NOTICE & ~E_WARNING; 
		ErrorUtils::$inlineIgnoreErrorTypes = E_ALL | E_STRICT; // & ~E_STRICT & ~E_NOTICE & ~E_WARNING; 
		error_reporting(ErrorUtils::$error_level);
	}
	
	public static function ClearLog() {
		LogEvent::$EventIds = array();
		
		return 
			(!file_exists(ErrorUtils::$error_log_file) || ErrorUtils::clearFile(ErrorUtils::$error_log_file)) &&
			(!file_exists(LogEvent::$LogEventStateFile) || ErrorUtils::clearFile(LogEvent::$LogEventStateFile));
	}
	
	public static function getCurrentFilePath() {
		$stack = debug_backtrace();
		$firstFrame = $stack[1];
		$initialFile = $firstFrame['file'];
		return $initialFile;
	}
		
	public static function lockFile($filePath, $mode, $fileHandler, $tryGetLockTimeOut = 1000) {
		if (in_array($filePath, ErrorUtils::$lockedFiles)) {
			echo "<pre>\r\nFile dead lock: ".$filePath."\r\n";
			debug_print_backtrace();
			die(); 			
		}
		
		if (!file_exists($filePath)) {
			$file = fopen($filePath, 'a');
			fclose($file);
		}
		
		$file = fopen($filePath, $mode);
		try {
			array_push(ErrorUtils::$lockedFiles, $filePath);
			
			$streamTimeOut = $tryGetLockTimeOut * 2 * 1000;
			stream_set_timeout($file, floor($streamTimeOut / 1000000), $streamTimeOut % 1000000);
			
			while ($tryGetLockTimeOut > 0 && !flock($file, LOCK_EX | LOCK_NB)) {
				usleep(1 * 1000); //1 miliseconds
				$tryGetLockTimeOut--;
			}

			$result = $fileHandler($file);

			fflush($file);
			
			flock($file, LOCK_UN);
			fclose($file);
			
			$key = array_search($filePath, ErrorUtils::$lockedFiles);
			if($key !== false){
				unset(ErrorUtils::$lockedFiles[$key]);
			}
			
			return $result;
		} catch (Exception $ex) {
			flock($file, LOCK_UN);
			fclose($file);

			$key = array_search($filePath, ErrorUtils::$lockedFiles);
			if($key !== false){
				unset(ErrorUtils::$lockedFiles[$key]);
			}

			throw $ex;
		}		
	}
	
	public static function clearFile($filePath) {
		ErrorUtils::lockFile($filePath, "w", function($file) {
			ftruncate($file, 0);
		});
		return true;
	}

	//http://php.net/manual/en/function.sprintf.php#55837
	public static function mb_sprintf($format) {
		$argv = func_get_args();
		array_shift($argv);
		return ErrorUtils::mb_vsprintf($format, $argv);
	}
	
	//http://php.net/manual/en/function.sprintf.php#55837
	public static function mb_vsprintf($format, $argv) {
		$newargv = array();
	
		preg_match_all("`\%('.+|[0 ]|)([1-9][0-9]*|)s`U", $format, $results, PREG_SET_ORDER);
	
		foreach($results as $result) {
			list($string_format, $filler, $size) = $result;
			
			if (strlen($filler)>1) {
				$filler = substr($filler, 1);
			}
			
			while (!is_string($arg = array_shift($argv))) {
				$newargv[] = $arg;
			}
			
			$pos = strpos($format, $string_format);
			
			$format = substr($format, 0, $pos)
				.($size ? str_repeat($filler, $size-strlen($arg)) : '')
				.str_replace('%', '%%', $arg)
				.substr($format, $pos+strlen($string_format));
		}
	
		return vsprintf($format, $newargv) ;
	}
	
	public static function SetHandlers()
	{
		if (!defined('PHP_VERSION_ID')) {
			$version = explode('.', PHP_VERSION);
			define('PHP_VERSION_ID', ($version[0] * 10000 + $version[1] * 100 + $version[2]));
		}
		
		ErrorUtils::initSettings();
		
		set_error_handler(array("ErrorUtils", "UserErrorUtils"));
		set_exception_handler(array("ErrorUtils", "UserExceptionHandler"));
		register_shutdown_function(array("ErrorUtils", "ShutdownHandler"));
	}
	
	private static $prevErrorHandlers = array();
	private static $prevErrorHandlersTypes = array();
	private static $currentErrorHandler;
	private static $currentErrorHandlerTypes;
	public static function set_error_handler($error_handler, $error_types = NULL)
	{
		if ($error_types === NULL) $error_types = E_ALL | E_STRICT;
		$prevErrorHandler = ErrorUtils::$currentErrorHandler;
		if (ErrorUtils::$currentErrorHandler) {
			array_push(ErrorUtils::$prevErrorHandlers, ErrorUtils::$currentErrorHandler);
			array_push(ErrorUtils::$prevErrorHandlersTypes, ErrorUtils::$currentErrorHandlerTypes);
		}
		ErrorUtils::$currentErrorHandler = $error_handler;
		ErrorUtils::$currentErrorHandlerTypes = $error_types;
		return $prevErrorHandler;
	}
	public static function restore_error_handler()
	{
		ErrorUtils::$currentErrorHandler = array_pop(ErrorUtils::$prevErrorHandlers);
		ErrorUtils::$currentErrorHandlerTypes = array_pop(ErrorUtils::$prevErrorHandlersTypes);
		return true;
	}
	
	private static $prevExceptionHandlers = array();
	private static $currentExceptionHandler;
	public static function set_exception_handler($exception_handler)
	{
		$prevExceptionHandler = ErrorUtils::$currentExceptionHandler;
		if (ErrorUtils::$currentExceptionHandler) {
			array_push(ErrorUtils::$prevExceptionHandlers, ErrorUtils::$currentExceptionHandler);
		}
		ErrorUtils::$currentExceptionHandler = $exception_handler;
		return $prevExceptionHandler;
	}
	public static function restore_exception_handler()
	{
		ErrorUtils::$currentExceptionHandler = array_pop(ErrorUtils::$prevExceptionHandlers);
		return true;
	}
	
	private static $currentShutdownHandler;
	public static function register_shutdown_function($shutdown_handler)
	{
		$prevShutdownHandler = ErrorUtils::$currentShutdownHandler;
		ErrorUtils::$currentShutdownHandler = $shutdown_handler;
		return $prevShutdownHandler;
	}
	
	public static $IgnoreErrorTypes = 0;
	
	public static function UserErrorUtils ($errno, $errmsg, $filename, $linenum, $vars) 
	{
		if ( (error_reporting() != 0 || ($errno & ErrorUtils::$inlineIgnoreErrorTypes) == 0) 
			 && ($errno & ErrorUtils::$error_level) != 0 
			 && ($errno & ErrorUtils::$IgnoreErrorTypes) == 0 ) 
		{
			$logEvent = new LogEvent(null, $errno, $errmsg, null, debug_backtrace(), $filename, $linenum);
			//$err .= "\r\nVartrace: ".wddx_serialize_value($vars;"Variables");
			
			$logEvent->WriteToFile(ErrorUtils::$error_log_file);

			if (!ErrorUtils::$currentErrorHandler || ($errno & ErrorUtils::$currentErrorHandlerTypes) == 0) {
				if (($logEvent->RecType & (LogRecType::Fatal | LogRecType::Error)) != 0) 
				{
					$logEvent->SendLog(ErrorUtils::$error_email_sender, ErrorUtils::$error_emails);
				}

				$logEvent->ShowNotice(ErrorUtils::$error_msg_url);
			}
		}
		
		if (ErrorUtils::$currentErrorHandler && ($errno & ErrorUtils::$currentErrorHandlerTypes) != 0) {
			call_user_func(ErrorUtils::$currentErrorHandler, $errno, $errmsg, $filename, $linenum, $vars);
		}
	}
	
	public static function UserExceptionHandler($ex) 
	{
		$logEvent = new LogEvent(LogRecType::Error, null, $ex ? $ex->getMessage() : "", $ex, debug_backtrace(), null, null);
		
		$logEvent->WriteToFile(ErrorUtils::$error_log_file);

		if (!ErrorUtils::$currentExceptionHandler) {
			if (($logEvent->RecType & (LogRecType::Fatal | LogRecType::Error)) != 0) 
			{
				$logEvent->SendLog(ErrorUtils::$error_email_sender, ErrorUtils::$error_emails);
				$logEvent->ShowNotice(ErrorUtils::$error_msg_url);
			}
		}

		if (ErrorUtils::$currentExceptionHandler) {
			call_user_func(ErrorUtils::$currentExceptionHandler, $ex);
		}
	}

	public static function ShutdownHandler()
	{
		$error = error_get_last();
		$errno = $error['type'];
		
		if (is_array($error) && array_key_exists('type', $error) && 
		   ($errno & (E_ERROR | E_PARSE | E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_COMPILE_WARNING )) != 0) 
		{
			$logEvent = new LogEvent(LogRecType::Fatal, $errno, $error['message'], null, null, $error['file'], $error['line']);
			
			$logEvent->WriteToFile(ErrorUtils::$error_log_file);
			$logEvent->SendLog(ErrorUtils::$error_email_sender, ErrorUtils::$error_emails);
			
			if (!ErrorUtils::$currentShutdownHandler) {
				$logEvent->ShowNotice(ErrorUtils::$error_msg_url);
			}
		}

		if (ErrorUtils::$currentShutdownHandler) {
			call_user_func(ErrorUtils::$currentShutdownHandler);
		}
	}

	public static $IgnoreLogRecTypes = 0;

	public static function Log($recType, $message, $exception = null, $additionalIdentityHash = null)
	{
		if (($recType & ~ErrorUtils::$IgnoreLogRecTypes) == 0 ) return;
		$logEvent = new LogEvent($recType, null, $message, $exception, debug_backtrace(), null, null, $additionalIdentityHash);
		$logEvent->WriteToFile(ErrorUtils::$error_log_file);
	}
	
	public static function GetStackTraceString($includeArgs) {
		LogEvent::StackTraceToString(debug_backtrace(), $includeArgs);	
	}
}

class LogRecType
{
	const None = 0;
	/// <summary>
	/// Ошибка приводящая к завершению программы или к отмене загрузки страницы ASP.Net
	/// </summary>
	const Fatal = 1;
	const UserAction = 2;
	/// <summary>
	/// Эти данные не важны разработчику потому что ошибся пользователь
	/// </summary>
	const UserError = 4;
	/// <summary>
	/// Эти данные не важны разработчику потому что ошибся пользователь
	/// </summary>
	const UserWarning = 8;
	const Error = 16;
	const Warning = 32;
	const Info = 64;
	const Action = 128;
	const Process = 256;
	const Debug = 512;
	const Trace = 1024;
	
	private static $errorTypeToString = array (
		E_ERROR   				=>  "Error",
		E_WARNING   			=>  "Warning",
		E_PARSE   				=>  "Parsing Error",
		E_NOTICE  				=>  "Notice",
		E_CORE_ERROR  			=>  "Core Error",
		E_CORE_WARNING  		=>  "Core Warning",
		E_COMPILE_ERROR  		=>  "Compile Error",
		E_COMPILE_WARNING 		=>  "Compile Warning",
		E_USER_ERROR 			=>  "User Error",
		E_USER_WARNING 			=>  "User Warning",
		E_USER_NOTICE 			=>  "User Notice",
		E_STRICT 				=>  "Strict",
		E_RECOVERABLE_ERROR 	=>  "Recoverable Error",
		E_DEPRECATED 			=>  "Deprecated",
		E_USER_DEPRECATED 		=>  "User Deprecated"
	);

	private static $errorTypeToRecType = array (
		E_ERROR   				=>  LogRecType::Error,
		E_WARNING   			=>  LogRecType::Warning,
		E_PARSE   				=>  LogRecType::Fatal,
		E_NOTICE  				=>  LogRecType::Warning,
		E_CORE_ERROR  			=>  LogRecType::Fatal,
		E_CORE_WARNING  		=>  LogRecType::Warning,
		E_COMPILE_ERROR  		=>  LogRecType::Fatal,
		E_COMPILE_WARNING 		=>  LogRecType::Warning,
		E_USER_ERROR 			=>  LogRecType::UserError,
		E_USER_WARNING 			=>  LogRecType::UserWarning,
		E_USER_NOTICE 			=>  LogRecType::UserWarning,
		E_STRICT 				=>  LogRecType::Warning,
		E_RECOVERABLE_ERROR 	=>  LogRecType::Error,
		E_DEPRECATED 			=>  LogRecType::Warning,
		E_USER_DEPRECATED 		=>  LogRecType::UserWarning
	);

	private static $recTypeToString = array (
		LogRecType::None		=>  "None",
		LogRecType::Fatal		=>  "Fatal",
		LogRecType::UserAction	=>  "UserAction",
		LogRecType::UserError	=>  "UserError",
		LogRecType::UserWarning	=>  "UserWarning",
		LogRecType::Error		=>  "Error",
		LogRecType::Warning		=>  "Warning",
		LogRecType::Info		=>  "Info",
		LogRecType::Action		=>  "Action",
		LogRecType::Process		=>  "Process",
		LogRecType::Debug		=>  "Debug",
		LogRecType::Trace		=>  "Trace"
	);
	
	public static function RecTypeToString($recType) {
		$string = "";
		
		foreach(LogRecType::$recTypeToString as $key => $value) {
			if (($key & $recType) != 0) $string .= ($string ? "|" : "").$value;
		}
		
		if (!$string) $string = 'RecType'.$recType;
		
		return $string;
	}
	
	public static function ErrorTypeToString($errorType) {
		if ($errorType === null) return "";

		$string = "";
		
		foreach(LogRecType::$errorTypeToString as $key => $value) {
			if (($key & $errorType) != 0) $string .= ($string ? "|" : "").$value;
		}
		
		if (!$string) $string = 'ErrorType'.$errorType;
		
		return $string;
	}
	
	public static function ErrorTypeToRecType($errorType, $errorTypeToRecTypeArray = NULL, $defaultRecType = NULL, $bFlags = true) {
		if ($defaultRecType === NULL) $defaultRecType = LogRecType::Error;
		if ($errorTypeToRecTypeArray === NULL) $errorTypeToRecTypeArray = LogRecType::$errorTypeToRecType;
		
		$recType = LogRecType::None;
		
		foreach($errorTypeToRecTypeArray as $key => $value) {
			if ($bFlags) {
				if (($key & $errorType) != 0) $recType = $recType | $value;
			} else if ($key == $errorType) {
				$recType = $value;
				break;
			}
		}
		
		if ($recType == LogRecType::None) $recType = $defaultRecType;
		
		return $recType;
	}
}

class LogEvent
{
	const MaxVariableSizeInLog = 500000;
	const SessionID = "e46f1573-0aa0-4404-ad80-98dc4921f3f8";

	public static $DefaultNoSend = false;
	public static $DefaultNoWrite = false;
	public static $DefaultNoNotice = false;

	private $NoSend = false;
	private $NoWrite = false;
	private $NoNotice = false;

	public static $LogEventStateFile; //файл куда писать глобальные переменные лога 
	
	private $EventId;
	private $AdditionalIdentityHash;
	private $TimeStamp;
	private $IP;
	private $Url;
	private $GetStr;
	private $PostStr;
	private $UrlReferrer;
	public $RecType;
	private $ErrorType;
	private $Message;
	private $Exception;
	private $StackTrace;
	private $File;
	private $Line;
	private $MethodName;
	private $StackTraceStr;
	private $ExceptionStr;
	private $ExceptionMessage;
	private $ErrorTypeStr;
	public static $LogDistinct = true; //исключить повторяющиеся события за время жизни сессии
	
	public function __construct ($recType, $errorType, $message, $exception, $stackTrace, $file, $line, $additionalIdentityHash = null) {
		LogEvent::StaticInit();
		$this->AdditionalIdentityHash = $additionalIdentityHash;
		
		$this->TimeStamp = LogEvent::GetTimeStamp();
		$this->IP = LogEvent::GetIP();
		$this->Url = LogEvent::GetUrl();
		$this->GetStr = LogEvent::GetGetStr();
		$this->PostStr = LogEvent::GetPostStr();
		$this->UrlReferrer = LogEvent::GetUrlReferrer();
		
		$this->RecType = (!$recType && $errorType) ? LogRecType::ErrorTypeToRecType($errorType) : $recType;
		$this->ErrorType = $errorType;
		$this->Message = $message;
		$this->StackTrace = $stackTrace;

		$this->File = $file;
		$this->Line = $line;
		
		$this->Exception = $exception;
		if ($this->Exception) {
			if (!$this->File) $this->File = $this->Exception->getFile();
			if (!$this->Line) $this->Line = $this->Exception->getLine();
		}
		
		$lastMethod = LogEvent::GetLastMethod($this->StackTrace);
		if (!$this->File) $this->File = $lastMethod['File'];
		if (!$this->Line) $this->Line = $lastMethod['Line'];
		$this->MethodName = LogEvent::getFileName($this->File).'('.$this->Line.')'.($lastMethod['Method'] ? ': '.$lastMethod['Method'] : '');
		
		$this->ErrorTypeStr = $this->Exception ? get_class($this->Exception) : LogRecType::ErrorTypeToString($this->ErrorType);
		$this->ExceptionMessage = $exception ? $exception->getMessage() : "";
		if (!$this->Message) $this->Message = $this->ExceptionMessage;
		
		$this->EventId = $this->getEventId();
		$this->NoSend = LogEvent::$DefaultNoSend;
		$this->NoWrite = LogEvent::$DefaultNoWrite;
		$this->NoNotice = LogEvent::$DefaultNoNotice;
		if ($this->eventIsAddedToLog()) {
			$this->NoSend = true;
			$this->NoWrite = true;
			$this->NoNotice = true;
		}
		
		$this->StackTraceStr = '#0: '.$this->File.'('.$this->Line.")\r\n";
		
		if (!$this->NoSend || !$this->NoWrite) {
			$this->StackTraceStr .= LogEvent::StackTraceToString($this->StackTrace, true);
			$this->ExceptionStr = LogEvent::ExceptionToString($this->Exception);
		}
	}
	
	public static $EventIds;
	
	private function eventIsAddedToLog() {
		if (!LogEvent::$LogDistinct) return false;
		
		return ErrorUtils::lockFile(LogEvent::$LogEventStateFile, "r+", function($file) {
			$text = stream_get_contents($file);
			LogEvent::$EventIds = unserialize(trim($text));
			if (!isset(LogEvent::$EventIds) || !is_array(LogEvent::$EventIds)) LogEvent::$EventIds = array();

			if (array_key_exists($this->EventId, LogEvent::$EventIds)) {
				$eventInfo = LogEvent::$EventIds[$this->EventId];
				LogEvent::$EventIds[$this->EventId] = array($this->TimeStamp, $eventInfo[1] + 1);
				$result = true;
			} else {
				LogEvent::$EventIds[$this->EventId] = array($this->TimeStamp, 1);
				$result = false;
			}
			
			$text = trim(serialize(LogEvent::$EventIds));

			ftruncate($file, 0);
			fseek($file, 0);
			fwrite($file, $text);
		
			return $result;
		});		
	}
		
	private function getEventId() {
		$guidStr = $this->RecType.', '.$this->ErrorType.', ';
		if ($this->File) {
			$guidStr = $guidStr.$this->File.', ';
			if (file_exists($this->File)) $guidStr = $guidStr.filemtime($this->File).', '.filesize($this->File).', ';
		}
		if ($this->Line) $guidStr = $guidStr.$this->Line.', ';
		if ($this->ErrorTypeStr) $guidStr = $guidStr.$this->ErrorTypeStr.', ';
		if ($this->ExceptionMessage) $guidStr = $guidStr.$this->ExceptionMessage.', ';
		if ($this->MethodName) $guidStr = $guidStr.$this->MethodName.', ';
		if ($this->AdditionalIdentityHash) $guidStr = $guidStr.$this->AdditionalIdentityHash.', ';
		return md5($guidStr);
	}
	
	private static $unsafeArrayKeyPatterns = array('/pass|mail/i');
	private static function safeArrayCopy( array $array ) 
	{
			$result = array();
			foreach( $array as $key => $val ) {
				$check = true;
				foreach( LogEvent::$unsafeArrayKeyPatterns as $pattern ) {
					$test = preg_match($pattern, $key);
					if($test === false || $test) { $check = false; break; }
				}
				if ($check) $result[$key] = $val;
			}
			return $result;
	}

	public static function GetGetStr() 
	{
		return "[" . implode(",", LogEvent::array_map_assoc(function($k,$v){return "\r\n\t$k => \"$v\"";}, LogEvent::safeArrayCopy($_GET))) ."]";
	}
	
	public static function GetPostStr() 
	{
		return "[" . implode(",", LogEvent::array_map_assoc(function($k,$v){return "\r\n\t$k => \"$v\"";}, LogEvent::safeArrayCopy($_POST))) ."]";
	}
	
	//https://stackoverflow.com/a/6557147/5221762
	private static function array_map_assoc($callback, $array){
		$r = array();
		foreach ($array as $key=>$value) {
			$r[$key] = $callback($key,$value);
		}
		return $r;
	}
	
	private static function removePasswords(array $array) 
	{
		unset($array['pass']);
		unset($array['password']);
	}
	
	public static function GetTimeStamp() 
	{
		$oldZone = @date_default_timezone_get();
		date_default_timezone_set("UTC");
		$timeStamp = microtime(true);
		date_default_timezone_set($oldZone);
		return $timeStamp;
	}
	
	public static function GetIP() 
	{
		return isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "";
	}
	
	public static function GetUrl() 
	{
		return isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : "";
	}
	
	public static function GetUrlReferrer() 
	{
		return isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : "";
	}
	
	private static $isStaticInit = false;
	
	public static function StaticInit() {
		if (LogEvent::$isStaticInit) return;
		LogEvent::$isStaticInit = true;
		
		$text = ErrorUtils::lockFile(LogEvent::$LogEventStateFile, "r", function($file) {
			return stream_get_contents($file);
		});		
		LogEvent::$EventIds = unserialize(trim($text));
		
		if (!isset(LogEvent::$EventIds) || !is_array(LogEvent::$EventIds)) LogEvent::$EventIds = array();

		LogEvent::$xmlTemplate = <<<END
	<event>
		<guid>%s</guid>
		<date>%s</date>
		<ip>%s</ip>
		<rectype>%s</rectype>
		<message>%s</message>
		<exception>%s</exception>
		<logstacktrace>%s</logstacktrace>
		<threadstacktrace></threadstacktrace>
		<customstacktrace></customstacktrace>
		<exceptionType>%s</exceptionType>
		<methodName>%s</methodName>
		<machineName></machineName>
		<assemblyName></assemblyName>
		<assemblyVersion></assemblyVersion>
		<url>%s</url>
		<get>%s</get>
		<post>%s</post>
		<urlReferrer>%s</urlReferrer>
		<sourcePath>%s</sourcePath>
	</event>

END;

		LogEvent::$noticeTemplate = "[%s][%s][%s][%s]: %s, %s<br>\r\n%s<br>\r\n<br>\r\n";

		LogEvent::$mailTemplate = <<<END
<html>
    <head>
    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
    <style type="text/css">
        .Process{{color:#000000}}
        .Action{{color:#0000FF}}
        .UserAction{{color:#0000FF}}
        .UserError{{color:#FF4040}}
        .UserWarning{{color:#BF0000}}
        .Error{{color:#FF0000}}
        .Fatal{{color:#FF0000}}
        .Info{{color:#7F7F7F}}
        .None{{color:#000000}}
        .Warning{{color:#BF0000}}
        .Contract{{color:#BF0000}}
        p, pre{{margin-bottom: 0; margin-top: 0}}
        .exception{{color:#FF0000; font-size: 8pt}}
        .stacktrace{{color:#7F7F7F; font-size: 8pt}}
        A:link {{text-decoration: none}}
        A:hover {{text-decoration: none}}
    </style>
    </head>
    <span style="font-family: 'Courier New'; font-size: 10pt;">
        <span class="%s" title="">
            <pre><u><a href="%s">[%s][%s][%s][%s]</a></u>: %s, %s</pre><br>
            <pre>GUID = %s</pre>
            <pre>IP = %s</pre>
            <pre>File = %s</pre>
            <pre>Url = %s
			</pre>
            <pre>Get = 
			%s
			</pre>
            <pre>Post = 
			%s
			</pre>
            <pre>UrlReferrer = %s</pre>
            <pre class="exception">%s</pre>
            <br> 
            <pre class="stacktrace">StackTrace:\r\n%s</pre>
            <br> 
        </span>
    </span>
</html>
END;
	}
	
	private static $xmlTemplate;

	private static $noticeTemplate;

	private static $mailTemplate;

	public function ToXml() {
		$result = ErrorUtils::mb_sprintf(LogEvent::$xmlTemplate, 
			 LogEvent::xml_encode($this->EventId),
			 LogEvent::xml_encode(LogEvent::microtimeToString($this->TimeStamp)), //.Net Format: yyyy-MM-ddTHH\:mm\:ss.fffffff
			 LogEvent::xml_encode($this->IP),
			 LogEvent::xml_encode(LogRecType::RecTypeToString($this->RecType)),
			 LogEvent::xml_encode($this->Message),
			 LogEvent::xml_encode($this->ExceptionStr),
			 LogEvent::xml_encode($this->StackTraceStr),
			 LogEvent::xml_encode($this->ErrorTypeStr),
			 LogEvent::xml_encode($this->MethodName),
			 LogEvent::xml_encode($this->Url),
			 LogEvent::xml_encode($this->GetStr),
			 LogEvent::xml_encode($this->PostStr),
			 LogEvent::xml_encode($this->UrlReferrer),
			 LogEvent::xml_encode($this->File.'('.$this->Line.')')
		);
		
		return $result;
	}
	
	public function ToDisplayNotice() {
		$result = ErrorUtils::mb_sprintf(LogEvent::$noticeTemplate, 
			 LogEvent::html_encode(LogEvent::microtimeToString($this->TimeStamp)), //.Net Format: yyyy-MM-ddTHH\:mm\:ss.fffffff
			 LogEvent::html_encode(LogRecType::RecTypeToString($this->RecType)),
			 LogEvent::html_encode($this->ErrorTypeStr),
			 LogEvent::html_encode($this->MethodName),
			 LogEvent::html_encode($this->Message),
			 LogEvent::html_encode($this->ExceptionMessage),
			 LogEvent::html_encode($this->File.'('.$this->Line.')')
		);
		
		return $result;
	}

	public function ToMailNotice() {
		$result = ErrorUtils::mb_sprintf(LogEvent::$mailTemplate, 
			 LogEvent::html_encode(LogRecType::RecTypeToString($this->RecType)),
			 LogEvent::html_encode($this->File),
			 LogEvent::html_encode(LogEvent::microtimeToString($this->TimeStamp)), //.Net Format: yyyy-MM-ddTHH\:mm\:ss.fffffff
			 LogEvent::html_encode(LogRecType::RecTypeToString($this->RecType)),
			 LogEvent::html_encode($this->ErrorTypeStr),
			 LogEvent::html_encode($this->MethodName),
			 LogEvent::html_encode($this->Message),
			 LogEvent::html_encode($this->ExceptionMessage),
			 LogEvent::html_encode($this->EventId),
			 LogEvent::html_encode($this->IP),
			 LogEvent::html_encode($this->File.'('.$this->Line.')'),
			 LogEvent::html_encode($this->Url),
			 LogEvent::html_encode($this->GetStr),
			 LogEvent::html_encode($this->PostStr),
			 LogEvent::html_encode($this->UrlReferrer),
			 LogEvent::html_encode($this->ExceptionStr),
			 LogEvent::html_encode($this->StackTraceStr)
		);
		
		return $result;
	}
	
	public static function xml_encode($string, $escapeUnicode = true) {
		$result = LogEvent::xml_entities(LogEvent::html_encode($string, false));
		if ($escapeUnicode) {
			$result = LogEvent::utf8_encode($result);
		}
		return $result;
	}
	
	public static function html_encode($string, $escapeUnicode = true) {
		//$result = htmlspecialchars($string);
		$result = LogEvent::xml_entities($string);
		if ($escapeUnicode) {
			$result = LogEvent::utf8_encode($result);
		}
		return $result;
	}
	
	public static function xml_entities($string) {
		return str_replace(
			array("&",     "<",    ">",    '"',      "'"),
			array("&amp;", "&lt;", "&gt;", "&quot;", "&apos;"), 
			$string
		);
	}

	public static function utf8_encode($string) {
		/*
		[\x00-\x7f] | 
		[\xc0-\xdf][\x80-\xbf] | 
		[\xe0-\xef][\x80-\xbf]{2} | 
		[\xf0-\xf7][\x80-\xbf]{3} |
		[\xf8-\xfb][\x80-\xbf]{4} |
		[\xfc-\xfd][\x80-\xbf]{5}
		*/
		
		$result = '';
		$length = strlen($string);
		$incorrect = '';
		$i = 0;
		while ($i < $length) {
			$c = $string[$i];
			$o = ord($c);
			if ($o <= 0x7f) {
				if ($o == 9 || $o == 10 || $o == 13 || $o > 31) {
					if ($incorrect != '') { $result .= self::utf8_encode_symbol($incorrect); $incorrect = ''; }
					$result .= $c;
				} else {
					$incorrect .= $c;
				}
			} else if ($o <= 0xbf || $o == 0xc0) {
				$incorrect .= $c;
			} else if ($o <= 0xfd) {
				if ($o <= 0xdf) $n = 1;
				else if ($o <= 0xef) $n = 2;
				else if ($o <= 0xf7) $n = 3;
				else if ($o <= 0xfb) $n = 4;
				else $n = 5;
				
				if ($i + $n < $length) {
					$s = $c;
					$correct = true;
					for ($j = 1; $j <= $n; $j++) {
						$c2 = $string[$i + $j];
						$o2 = ord($c2);
						$s .= $c2;
						if (($j == 1) && 
							(
								$o == 0xe0 && $o2 < 0xA0 ||
								$o == 0xf0 && $o2 < 0x90 ||
								$o == 0xf0 && $o2 < 0x90 ||
								$o == 0xf8 && $o2 < 0x88 ||
								$o == 0xfc && $o2 < 0x84
							) || 
							($o2 < 0x80 || $o2 > 0xbf)) 
						{
							$correct = false;
							break;
						}
					}
					if ($correct) {
						if ($incorrect != '') { $result .= self::utf8_encode_symbol($incorrect); $incorrect = ''; }
						$result .= $s;
						$i += $n;
					} else {
						$incorrect .= $c;
					}
				} else {
					$incorrect .= $c;
				}
			} else {
				$incorrect .= $c;
			}
			
			$i++;
		}
		if ($incorrect != '') $result .= self::utf8_encode_symbol($incorrect);
		
		return $result;
	}

	public static function utf8_encode_symbol($string) {
		$length = strlen($string);
		
		$encoded = '<span class="symbol">';
		for ($i = 0; $i < $length; $i++)  {
			$encoded .= '&#x'.dechex(ord($string[$i])).';';
		}
		$encoded .= '</span>';
		
		return $encoded;
	}
	
	public static function microtimeToString($microtime) {
		$oldZone = date_default_timezone_get();
		date_default_timezone_set("UTC");
		$microSec = ''.floor(($microtime - floor($microtime))*10000000);
		for ($i = strlen($microSec); $i < 7; $i++)  {
			$microSec = '0'.$microSec;
		}
		$timeString = date('Y-m-d\TH:i:s.', floor($microtime)).$microSec; //.Net Format: yyyy-MM-ddTHH\:mm\:ss.fffffff
		date_default_timezone_set($oldZone);
		return $timeString;
	}
	
	public static function ExceptionToString($ex)
	{
		if (!$ex) return "";
		$err = "\r\n[".get_class($ex)."] [".date("Y-m-d H:i:s")."]: ".$ex->getMessage()
		."\r\nFile: ".$ex->getFile()." line ".$ex->getLine()
		."\r\nREQUEST_URI: ".LogEvent::GetUrl()
		."\r\nCode: ".$ex->getCode()
		."\r\nExceptionTrace:\r\n".$ex->getTraceAsString()."\r\n";
		if (PHP_VERSION_ID >= 50300) $err .= "\r\nInnerException: ".LogEvent::ExceptionToString($ex->getPrevious());
		return $err;
	}

	private static function getFileName($filePath) 
	{
		$n = max(strrpos($filePath, '/'), strrpos($filePath, "\\"));
		return $n ? substr($filePath, $n+1, strlen($filePath) - $n - 1) : $filePath;
	}	
	
	public static function GetLastMethod($stackTrace)
	{
		$methodName = ""; 
		$path = ""; 
		$line = ""; 
		if ($stackTrace) {
			foreach ($stackTrace as $T)
			{  
				if (array_key_exists('class', $T) && in_array($T['class'], array('ErrorUtils', 'LogEvent')) && !in_array($T['function'], array('Log'))) continue;
				
				$path = (array_key_exists('file', $T)) ? $T['file'] : "";
				$file = LogEvent::getFileName($path);
				
				$line = (array_key_exists('line', $T)) ? $T['line'] : "";
				
				$methodName = '';  
				if(isset($T['class'])) $methodName .= $T['class'].$T['type'];
				$methodName .= $T['function'];
				
				break;
			}
		}
		return array('Method' => $methodName, 'File' => $path, 'Line' => $line);
	}
	
	private static function objectToString($object)
	{
		if (is_object($object)) 
		{
			if (method_exists($object, '__toString')) 
			{
				return call_user_func_array(array($object, '__toString'), array()).'';
			}
			return '<'.gettype($object).'>';
		}
		return $object.'';
	}
	
	public static function StackTraceToString($stackTrace, $includeArgs)
	{
		//$stackTrace = debug_backtrace();
		if (!$stackTrace) return "";
		$result = ""; 
		$num = 1;
		foreach ($stackTrace as $T)
	    {  
			if (array_key_exists('class', $T) && in_array($T['class'], array('ErrorUtils', 'LogEvent')) && !in_array($T['function'], array('Log'))) continue;
			
			$path = (array_key_exists('file', $T)) ? $T['file'] : "";
			$ft = '#'.($num++).': '.$path.'('.((array_key_exists('line', $T)) ? $T['line'] : "").'): ';  
			if(isset($T['class'])) $ft .= $T['class'].$T['type'];
			$ft .= $T['function'].'(';
			if($includeArgs && isset($T['args']))
			{
				$ct = '';
				foreach($T['args'] as $A)
				{
					$val = LogEvent::objectToString($A);
					if (strlen($val) > LogEvent::MaxVariableSizeInLog) $val = substr($val, 0, LogEvent::MaxVariableSizeInLog);
					$ft .= $ct . $val;
					$ct = ', ';
				}
			}
			$ft .= ")\r\n";
			$result .= $ft;
		}
		return $result;
	}
	
	public function SendLog($from, $mails) {
		if ($this->NoSend || !$mails || count($mails) == 0) return;
		
		$subject = '[Log]['.(isset($_SERVER["SERVER_NAME"]) ? $_SERVER["SERVER_NAME"] : "").']['.$this->MethodName.']['.$this->Message.']';
		$headers = array
		(
			'MIME-Version: 1.0',
			'Content-Type: text/html; charset="UTF-8";',
			'Content-Transfer-Encoding: 7bit',
			'Date: ' . date('r', isset($_SERVER["REQUEST_TIME"]) ? $_SERVER["REQUEST_TIME"] : ""),
			'Message-ID: <' . (isset($_SERVER["REQUEST_TIME"]) ? $_SERVER["REQUEST_TIME"] : "") . md5((isset($_SERVER["REQUEST_TIME"]) ? $_SERVER["REQUEST_TIME"] : "")) . '@' . (isset($_SERVER["SERVER_NAME"]) ? $_SERVER["SERVER_NAME"] : "") . '>',
			'From: ' . $from,
			'Reply-To: ' . $from,
			'Return-Path: ' . $from,
			'X-Mailer: PHP v' . phpversion(),
			//'X-Originating-IP: ' . $_SERVER['SERVER_ADDR'],
		);
		foreach ($mails as $mail)
	    {  
			mail($mail, $subject, $this->ToMailNotice(), implode("\n", $headers));
		}
	}
		
	public function WriteToFile($error_log_file) 
	{
		if ($this->NoWrite) return;
		
		$text = $this->ToXml()."\n";
		
		ErrorUtils::lockFile($error_log_file, "a", function($file) use ($text) {
			fwrite($file, $text);
		});
	}

	public function ShowNotice($error_msg_url) 
	{
		
		//if (($this->RecType & (LogRecType::Fatal | LogRecType::Error)) != 0) 
		{
		//	header("location: ".$error_msg_url."?msg=".urlencode("<pre>".$this->ToDisplayNotice()."</pre>"));
		}
		//else 
		{
			if (!$this->NoNotice) {
				echo "<pre>".$this->ToDisplayNotice()."</pre>";
			}
		}
	}
}

class BasicAuth
{
	private $login;
	private $password;

	public function __construct ($login, $password) {
		$this->login = $login;
		$this->password = $password;
	}
	
	public function CheckAuth() {
		if (!isset($_SERVER['PHP_AUTH_USER'])) {
			BasicAuth::sendAuthHeader();
		} else {
			$auth_user = $_SERVER['PHP_AUTH_USER'];
			$auth_pass = $_SERVER['PHP_AUTH_PW'];
			if (($auth_user != $this->login) || ($auth_pass != $this->password)) {
				BasicAuth::sendAuthHeader();
			};
		};
	}

	private static function sendAuthHeader(){
		header('WWW-Authenticate: Basic realm="Closed Zone"');
		//header('HTTP/1.0 401 Unauthorized');
		//echo "<html><body bgcolor=white link=blue vlink=blue alink=red>"
		//,"<h1>Authentication error</h1>"
		//,"</body></html>";
		exit;
	}
}

?>