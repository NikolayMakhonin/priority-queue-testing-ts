using BusinessAutomationWeb.Helpers.Bundles;
using System.Web.Optimization;

namespace BusinessAutomationWeb
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleHelpers.InitBundles();

            #region Base Site Pages

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundleExt("~/scripts/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundleExt("~/bundles/jqueryval").Include(
                "~/Scripts/jquery.validate*"));

            #endregion

            #region Common

            bundles.Add(new ScriptBundleExt("~/scripts/common").Include(
                "~/Scripts/modernizr-*",
                "~/Scripts/jquery-{version}.js",
                "~/Scripts/bootstrap.js",
                "~/Scripts/respond.js",
                "~/Scripts/jquery-ui-{version}.js",
                "~/Scripts/jquery.validate*",
                "~/Scripts/jquery.validate*",
                "~/Scripts/jquery.livequery.js"));

            bundles.Add(new ScriptBundleExt("~/scripts/site").Include(
                "~/Scripts/site.js"));

            bundles.Add(new StyleBundleExt("~/styles/common").Include(
                "~/Content/bootstrap.css",
                "~/Content/themes/base/jquery-ui.css"));

            bundles.Add(new StyleBundleExt("~/styles/site").Include(
                "~/Content/site.css"));

            #endregion

            #region JTable

            bundles.Add(new ScriptBundleExt("~/scripts/jtable").Include(
                "~/Scripts/jtable/jquery.jtable.js"));

            bundles.Add(new ScriptBundleExt("~/styles/jtable").Include(
                //"~/Scripts/jtable/themes/basic/jtable_basic.css",
                //"~/Scripts/jtable/themes/metro/jtable_metro_base.css",
                //"~/Scripts/jtable/themes/metro/blue/jtable.css",
                "~/Scripts/jtable/themes/lightcolor/blue/jtable.css"));

            #endregion

            #region File Upload

            bundles.Add(new ScriptBundleExt("~/scripts/file-upload").Include(
                //<!-- The Templates plugin is included to render the upload/download listings -->
                //"~/Scripts/jQuery.FileUpload/vendor/jquery.ui.widget.js",
                "~/Scripts/BlueImp.Templates/js/tmpl.min.js",

                //<!-- The Load Image plugin is included for the preview images and image resizing functionality -->
                "~/Scripts/BlueImp.LoadImage/js/load-image.all.min.js",
                
                //<!-- The Canvas to Blob plugin is included for image resizing functionality -->
                "~/Scripts/BlueImp.CanvasToBlob/js/canvas-to-blob.min.js",
                
                //<!-- The Iframe Transport is required for browsers without support for XHR file uploads -->
                "~/Scripts/jQuery.FileUpload/jquery.iframe-transport.js",
                
                //<!-- The basic File Upload plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload.js",
                
                //<!-- The File Upload processing plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-process.js",
                
                //<!-- The File Upload image preview & resize plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-image.js",
                
                //<!-- The File Upload audio preview plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-audio.js",
                
                //<!-- The File Upload video preview plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-video.js",
                
                //<!-- The File Upload validation plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-validate.js",
                
                //!-- The File Upload user interface plugin -->
                "~/Scripts/jQuery.FileUpload/jquery.fileupload-ui.js",
                
                //Blueimp Gallery 2 
                "~/Content/blueimp-gallery2/js/blueimp-gallery.js",
                "~/Content/blueimp-gallery2/js/blueimp-gallery-video.js",
                "~/Content/blueimp-gallery2/js/blueimp-gallery-indicator.js",
                "~/Content/blueimp-gallery2/js/jquery.blueimp-gallery.js"
            ));

            bundles.Add(new ScriptBundleExt("~/scripts/file-upload-gallery").Include(//Blueimp Gallery 2 
                "~/Content/blueimp-gallery2/js/blueimp-gallery.js",
                "~/Content/blueimp-gallery2/js/blueimp-gallery-video.js",
                "~/Content/blueimp-gallery2/js/blueimp-gallery-indicator.js",
                "~/Content/blueimp-gallery2/js/jquery.blueimp-gallery.js"
            ));

            bundles.Add(new StyleBundleExt("~/styles/file-upload").Include(
                "~/Content/jQuery.FileUpload/css/jquery.fileupload.css",
                "~/Content/jQuery.FileUpload/css/jquery.fileupload-ui.css",
                "~/Content/blueimp-gallery2/css/blueimp-gallery.css",
                "~/Content/blueimp-gallery2/css/blueimp-gallery-video.css",
                "~/Content/blueimp-gallery2/css/blueimp-gallery-indicator.css"
            ));

            #endregion

            //BundleTable.EnableOptimizations = true;

            //ScriptManager.ScriptResourceMapping.AddDefinition(
            //    "respond",
            //    new ScriptResourceDefinition
            //    {
            //        Path = "~/Scripts/common.js",
            //        DebugPath = "~/Scripts/common.js",
            //    });
        }
    }
}
