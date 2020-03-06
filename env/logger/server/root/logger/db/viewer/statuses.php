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

    <script type="text/javascript">

        $(document).ready(function () {

            // #region Init table layout

            var setDialogLoadingMode = function(id, isLoading) {
                if (isLoading) {
                    $(id).parent().find(".dialog-submit-button").attr("disabled", "disabled");
                    $(id).find(".loading-overlay").show();
                } else {
                    $(id).parent().find(".dialog-submit-button").removeAttr("disabled");
                    $(id).find(".loading-overlay").hide();
                }
            };

            // #endregion

            // #region Init table layout

            var jtableLogsParams = {

                // #region Container

                title: 'Statuses',

                paging: true,
                pageSize: 20,
                pageSizes: [10, 15, 20, 30, 50, 100],
                pageSizeChangeArea: true,

                sorting: true,
                defaultSorting: 'Id ASC',
                multiSorting: true,

                multiselect: false,
                columnResizable: false,
                columnSelectable: true,
                selecting: false,
                selectingCheckboxes: false,
                selectOnRowClick: false,

                saveUserPreferences: true,
                animationsEnabled: true,
                defaultDateFormat: 'yyyy-mm-dd',
                deleteConfirmation: true,

                openChildAsAccordion: true,

                toolbar: {
                    hoverAnimation: true, //Enable/disable small animation on mouse hover to a toolbar item.
                    hoverAnimationDuration: 60, //Duration of the hover animation.
                    hoverAnimationEasing: undefined, //Easing of the hover animation. Uses jQuery's default animation ('swing') if set to undefined.
                    items: [
                        {
                            //icon: '/images/excel.png',
                            text: 'Reload',
                            click: function () {
                               jtable.jtable('reload');
                            }
                        }
                    ]
                },

                actions: {
                    listAction: 'api/status/list.php',
                    deleteAction: 'api/status/delete.php',
                    updateAction: 'api/status/update.php',
                    createAction: 'api/status/create.php'
                },

                // #endregion

                // #region Fields

                fields: {
                    Id: {
                        title: 'Id',
                        key: true,
                        create: true,
                        edit: true,
                        list: true
                    },
                    Name: {
                        title: 'Name'
                    }
                },

                // #endregion

                // #region Events

                //JQuery Validation: https://jqueryvalidation.org/documentation/

                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.validate();
                    data.form.find('input[name="Name"]').rules( "add", {
                        maxlength: 50
                    });
                },

                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    var validator = data.form.validate();
                    return validator.form();
                },

                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                    var validator = data.form.validate();
                    if (validator.destroy) validator.destroy();
                }

                // #endregion
            };

            var jtable = $('#jTable').jtable(jtableLogsParams);

            var loadData = function() {
                //Load table data
                jtable.jtable('load');
            };

            loadData();

            // #endregion

        });


    </script>

    <div id="jTable" class="jtable-container"></div>

</body>
</html>