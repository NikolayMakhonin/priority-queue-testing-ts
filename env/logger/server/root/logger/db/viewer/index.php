<?php 
	require_once("../../includes/auth.php");
?>
<!DOCTYPE html>
<html>
<head>
	<title>Log View</title>
	<script type="text/javascript" src="assets/js/libs/modernizr-2.6.2.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/bootstrap.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/respond.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery-ui-1.9.2.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.validate.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.validate-vsdoc.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.livequery.js"></script>
	<script type="text/javascript" src="assets/js/libs/jtable/jquery.jtable.js"></script>
	<script type="text/javascript" src="assets/js/site.js"></script>
	<link rel="stylesheet" type="text/css" href="assets/css/libs/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/css/libs/themes/base/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="assets/js/libs/jtable/themes/lightcolor/blue/jtable.css">
	<link rel="stylesheet" type="text/css" href="assets/css/site.css">
</head>
<body>
	<div class="row">
	    <div class="panel panel-primary main_panel">
	        <!--<div class="panel-heading">
	            Log View
	        </div>-->
	        <div class="panel-body">
	            <!-- Tabs -->
	            <ul class="nav nav-tabs">
	                <li class="nav active"><a href="#tab_logs" data-toggle="tab">Logs</a></li>
	                <li class="nav"><a href="#tab_statuses" data-toggle="tab">Statuses</a></li>
	                <li class="nav"><a href="#tab_logs_self" data-toggle="tab">Logger self log</a></li>
	            </ul>

	            <!-- Tab panes -->
	            <div class="tab-content">
	                <div class="tab-pane fade in active" id="tab_logs">
	                    <iframe class="tab_iframe" data-src="logs.php" frameBorder="0"></iframe>
	                </div>
	                <div class="tab-pane fade" id="tab_statuses">
	                    <iframe class="tab_iframe" data-src="statuses.php" frameBorder="0"></iframe>
	                </div>
	                <div class="tab-pane fade" id="tab_logs_self">
	                    <iframe class="tab_iframe" data-src="../../" frameBorder="0"></iframe>
	                </div>
	            </div>
	        </div>
	    </div>
	</div>
</body>
</html>