<?php
// respond to preflights
// see: https://dev.to/effingkay/cors-preflighted-requests--options-method-3024
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Headers: Content-Type, X-HASH, X-TOKEN');
  exit;
}

require_once("logger/includes/error_debug.php");
require_once("logger/includes/error.php");
header("Access-Control-Allow-Origin: *");

$hash = $_SERVER['HTTP_X_HASH'];
$token = $_SERVER['HTTP_X_TOKEN'];
$checkToken = md5($hash."607bf405-a5a8-4b8c-aa61-41e8c1208dba");

if ($checkToken != $token) {
  header('HTTP/1.0 403 Forbidden');
  exit;
}

require_once("logger/db/viewer/api/includes/db.php");

$exist = $db->query("SELECT Id FROM Logs WHERE Id = UNHEX('$hash') LIMIT 1")->fetch_object()->Id;

$ip = LogEvent::GetIP();

if (!$exist) {
    $content = file_get_contents('php://input');

    if ($_SERVER["HTTP_CONTENT_ENCODING"] == "gzip") {
        $content = gzdecode($content);
    }

    //var_dump($content);
    //exit;

    $message = json_decode($content, true);

    $typeStr = $message['Type'];
    $type;
    switch($typeStr)
    {
        case 'Trace':
            $type = 1;
            break;
        case 'Debug':
            $type = 2;
            break;
        case 'Info':
            $type = 3;
            break;
        case 'UserAction':
        case 'Action':
            $type = 4;
            break;
        case 'UserWarning':
            $type = 5;
            break;
        case 'UserError':
            $type = 6;
            break;
        case 'Warning':
            $type = 7;
            break;
        case 'Error':
            $type = 8;
            break;
        case 'Fatal':
            $type = 9;
            break;
        default:
            ErrorUtils::Log(LogRecType::Warning, "Unknown log type: {$message['Type']}");
            $type = 8;
            break;
    }

    $messageShort = isset($message["MessageShort"]) && $message["MessageShort"]
        ? $db->real_escape_string(substr($message["MessageShort"],0,200))
        : "";
    $messageFullOrig = isset($message["MessageFull"]) && $message["MessageFull"]
        ? $message["MessageFull"]
        : "";
    $messageFull = $db->real_escape_string($messageFullOrig) ;
    $appName = isset($message["AppName"]) && $message["AppName"]
        ? $db->real_escape_string(htmlspecialchars(substr($message["AppName"],0,50), ENT_COMPAT | ENT_HTML401, 'UTF-8'))
        : "";
    $appVersion = isset($message["AppVersion"]) && $message["AppVersion"]
        ? $db->real_escape_string(htmlspecialchars(substr($message["AppVersion"],0,50), ENT_COMPAT | ENT_HTML401, 'UTF-8'))
        : "";

    $query = <<<SQL
        INSERT IGNORE INTO Logs
        SET
            Id = UNHEX('$hash'),
            TypeId = $type,
            StatusId = 0,
            AppName = '$appName',
            AppVersion = '$appVersion',
            MessageShort = '$messageShort',
            MessageFull = '$messageFull';
SQL
;

    $db->query($query);

    switch($typeStr)
    {
        case 'Error':
        case 'Fatal':
            $mails = array(
				'nickolay.makhonin@theprojectdrivers.com',
				'error@alertpointsecurity.com'
			);
            $mail_subject = "[LOG][$appName][$appVersion][$typeStr][$hash]";
            $mail_headers = "MIME-Version: 1.0\r\n" . "Content-type: text/html; charset=UTF-8";
            $mail_message = <<<MSG
<pre>
Type: $typeStr
IP: $ip
AppName: $appName,
AppVersion: $appVersion,

$messageFullOrig
</pre>
MSG
;
            foreach ($mails as &$mail) {
                mail($mail, $mail_subject, $mail_message, $mail_headers);
            }
            break;
    }

    if ($db->error) {
        ErrorUtils::Log(LogRecType::Error, htmlspecialchars($db->error, ENT_COMPAT | ENT_HTML401, 'UTF-8'));
        die();
    }
}

$db->query(<<<SQL
    INSERT INTO Events 
        (LogId, IP, LastTime, Count) VALUES (UNHEX('$hash'), INET_ATON('$ip'), NOW(), 1) 
    ON DUPLICATE KEY UPDATE    
        LastTime = NOW(), Count = Count + 1
SQL
);

if ($db->error) {
    ErrorUtils::Log(LogRecType::Error, htmlspecialchars($db->error, ENT_COMPAT | ENT_HTML401, 'UTF-8'));
    die();
}

?>