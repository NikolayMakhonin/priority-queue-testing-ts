<?php 
	require_once("../../includes/auth.php");
	require_once("api/includes/db.php");
?>
<!DOCTYPE html>
<html>
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Log View</title>
	<script type="text/javascript" src="assets/js/libs/modernizr-2.6.2.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery-1.9.1.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/bootstrap.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/bootstrap-multiselect.js"></script>
	<script type="text/javascript" src="assets/js/libs/respond.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery-ui-1.9.2.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.validate.min.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.validate-vsdoc.js"></script>
	<script type="text/javascript" src="assets/js/libs/jquery.livequery.js"></script>
	<script type="text/javascript" src="assets/js/libs/jtable/jquery.jtable.js"></script>
	<script type="text/javascript" src="assets/js/site.js"></script>
	<link rel="stylesheet" type="text/css" href="assets/css/libs/bootstrap.min.css">
	<link rel="stylesheet" type="text/css" href="assets/css/libs/bootstrap-multiselect.css">
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

            // #region Clear Dialog

            setDialogLoadingMode("#clear-dialog", false);

            var clearDialog = $("#clear-dialog").dialog({
                title: "Clear Logs",
                autoOpen: false,
                height: 200,
                width: 400,
                modal: true,
                buttons: [
                    {
                        text: "Close",
                        click: function() {
                            $(this).dialog( "close" );
                            $('form#clear-options')[0].reset();
                        }
                    },
                    {
                        'class': "dialog-submit-button",
                        text: "Clear",
                        click: function() {
                            setDialogLoadingMode("#clear-dialog", true);

                            var dialog = this;

                            $.ajax({
                                url: "api/log/clear.php",
                                method: 'POST',
                                data: $('form#clear-options, form#jTable_filters').serialize()
                            })
                            .done(function(data) {
                                if (data.Result != "OK") {
                                    showErrorDialog( "Clear failed: " + data.Result + " " + data.Message);
                                    setDialogLoadingMode("#clear-dialog", false);
                                    return;
                                }

                                setDialogLoadingMode("#clear-dialog", false);

                                $(dialog).dialog( "close" );
                                
                                jtable.jtable('reload');
                            })
                            .fail(function(data) {
                                showErrorDialog( "Clear failed!\n" + JSON.stringify(data));
                                setDialogLoadingMode("#clear-dialog", false);
                            });
                        }
                    }
                ]
            });

            // #endregion

            // #region Init table layout

            // #region IPs Table

            var jtableIPsParams = function() {
                return {
                    title: 'IPs',

                    addRecordButton: false,

                    paging: false,
                    pageSize: 20,
                    pageSizes: [10, 15, 20, 30, 50, 100],
                    pageSizeChangeArea: true,

                    sorting: true,
                    defaultSorting: 'LastTime DESC',
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

                    actions: {
                        listAction: 'api/event/list.php'
                    },
                    fields: {
                        IP: {
                            title: 'IP',
                        },
                        LastTime: {
                            title: 'LastTime',
                            display: function (data) {
                                return getJtableDisplayTime(data.record.LastTime);
                            }
                        },
                        Count: {
                            title: 'CountSameEvents'
                        }
                    }
                };
            }

            // #endregion

            var jtableLogsParams = {

                // #region Container

                title: 'Logs',

                paging: true,
                pageSize: 20,
                pageSizes: [10, 15, 20, 30, 50, 100],
                pageSizeChangeArea: true,

                sorting: true,
                defaultSorting: 'AppName DESC, LastTime DESC',
                multiSorting: true,

                multiselect: true,
                columnResizable: false,
                columnSelectable: true,
                selecting: true,
                selectingCheckboxes: true,
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
                        },
                        {
                            text: 'Delete',
                            click: function () {
                                var selectedRows = jtable.jtable('selectedRows');
                                jtable.jtable('deleteRows', selectedRows);
                                jtable.jtable('reload');
                            }
                        },
                        /*{
                            text: 'Clear',
                            click: function () {
                                clearDialog.dialog("open");
                            }
                        }*/
                    ]
                },

                actions: {
                    listAction: 'api/log/list.php',
                    deleteAction: 'api/log/delete.php',
                    updateAction: 'api/log/update.php',
                    createAction: 'api/log/create.php'
                },
                
                // #endregion

                // #region Fields

                fields: {
                    IPs: {
                        title: '',
                        width: '0',
                        sorting: false,
                        edit: false,
                        create: false,
                        listClass: 'jtable-icon-cell',
                        display: function (productData) {
                            var $html = $('<a href="#">IPs</a>');
                            $html.click(function () {
                                $('#jTable').jtable('openChildTable',
                                    $html.closest('tr'),
                                    jtableIPsParams(),
                                    function (data) { //opened handler
                                        data.childTable.jtable('load', {
                                            logId: productData.record.Id
                                        });
                                    });
                            });
                            return $html;
                        }
                    },

                    Details: {
                        title: '',
                        width: '0',
                        sorting: false,
                        edit: false,
                        create: false,
                        listClass: 'jtable-icon-cell',
                        display: function (productData) {
                            var $html = $('<a href="api/log/details.php?id=' + productData.record.Id + '" target="_blank">Details</a>');
                            return $html;
                        }
                    },

                    Id: {
                        key: true,
                        create: false,
                        edit: false,
                        list: false
                    },
                    StatusId: {
                        title: 'Status',
                        defaultValue: -1,
                        options: 'api/status/options.php',
                        optionsSorting: 'text'
                    },
                    TypeId: {
                        title: 'Type',
                        defaultValue: -1,
                        options: 'api/type/options.php',
                        optionsSorting: 'text',
                        edit: false
                    },
                    LastTime: {
                        title: 'LastTime',
                        display: function (data) {
                            return getJtableDisplayTime(data.record.LastTime);
                        },
                        edit: false
                    },
                    LastIP: {
                        title: 'LastIP',
                        edit: false
                    },
                    AppName: {
                        title: 'AppName',
                        edit: false
                    },
                    AppVersion: {
                        title: 'AppVersion',
                        edit: false
                    },
                    CountIPs: {
                        title: 'IPs',
                        edit: false
                    },
                    AvgCountPerIP: {
                        title: 'PerIP',
                        display: function(data) {
                            return data.record.CountIPs ? data.record.TotalCount / data.record.CountIPs : 0;
                        },
                        edit: false
                    },
                    TotalCount: {
                        title: 'Total',
                        edit: false
                    },
                    MessageShort: {
                        title: 'MessageShort',
                        display: function(data) {
                            return data.record.MessageShort ? data.record.MessageShort.truncate(200, false).escapeHtml() : "";
                        },
                        edit: false
                    }

                },

                // #endregion

                // #region Events

                //JQuery Validation: https://jqueryvalidation.org/documentation/

                //Initialize validation logic when a form is created
                formCreated: function (event, data) {
                    data.form.validate();
                    //data.form.find('input[name="AppName"]').rules( "add", {
                    //    maxlength: 50
                    //});
                },

                //Validate form when it is being submitted
                formSubmitting: function (event, data) {
                    var validator = data.form.validate();
                    if (!validator.form()) {
                        return false;
                    }

                    var selectedRows = jtable.jtable('selectedRows');
                    jtable.jtable('deselectRows', selectedRows);
                    if (selectedRows && selectedRows.length) {
                        var editedRecord = getFormParamsAsObject(data.form[0]);
                        selectedRows.each(function () {
                            var record = $(this).data('record');
                            jtable.jtable('updateRecord', {
                                record: {
                                    Id: record.Id,
                                    StatusId: editedRecord.StatusId
                                }
                            });
                        });
                        return false;
                    }
                },

                //Dispose validation logic when form is closed
                formClosed: function (event, data) {
                    var validator = data.form.validate();
                    if (validator.destroy) validator.destroy();
                }

                // #endregion
            };

            var jtable = $('#jTable').jtable(jtableLogsParams);

            var filersForm = $('form#jTable_filters');

            var loadData = function() {
                //Load table data
                jtable.jtable('load', getFormParamsAsObject(filersForm[0]));
            };

            filersForm.submit(function (e) {
                e.preventDefault();
                loadData();
            });

            loadData();

            // #endregion

        });


    </script>

    <div id="jTable" class="jtable-container" style="top: 101px;"></div>

    <form id="jTable_filters" class="jtable-filters" action="">
        <label>Status: 
            <select name="filter_status[]" multiple="multiple">
                <?php 
                    $result = $db->query('SELECT * FROM Statuses'); 
                    while($obj = $result->fetch_object()) { 
                ?>
                    
                    <option value="<?php echo $obj->Id; ?>"><?php echo $obj->Name; ?></option>
                    
                <?php } ?>
            </select>
        </label>
        
        <label>Type: 
            <select name="filter_type[]" multiple="multiple">
                <?php 
                    $result = $db->query('SELECT * FROM Types'); 
                    while($obj = $result->fetch_object()) { 
                ?>
                    
                    <option value="<?php echo $obj->Id; ?>"><?php echo $obj->Name; ?></option>
                    
                <?php } ?>
            </select>
        </label>
        
        <span><?php echo "DB Size: ".(getDbSize()/1024/1024)." MB"; ?></span>
        
        <br>
        
        <label style="width: calc(100% - 3px);">Message: <input type="text" name="filter_message" value="" style="box-sizing: border-box; width: calc(100% - 110px);" /></label>
        
        <br>
        
        <label style="width: calc(100% - 55px);">IP: <input type="text" name="filter_ip" value="" style="box-sizing: border-box; width: calc(100% - 68px);"  /></label>

        <button>Filter</button>
        
        <script type="text/javascript">
            $(document).ready(function() {
                $('[name="filter_status[]"]').multiselect();
                $('[name="filter_type[]"]').multiselect();
            });
        </script>
    </form>

    <div id="clear-dialog" title="Clear Logs" style="display: none;">
        <form id="clear-options">
            <fieldset>
		    	<div>Do you want to clear the logs?</div>
                <input type="submit" tabindex="-1" style="position:absolute; top:-1000px">
            </fieldset>
        </form>
        <div class="loading-overlay"></div>
    </div>
</body>
</html>