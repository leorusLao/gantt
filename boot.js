__CreateJSPath = function (js) {
    var scripts = document.getElementsByTagName("script");
    var path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    var href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");

    if (path.indexOf("http:") == -1 && path.indexOf("file:") == -1) {
        path = href + "/" + path;
    }
    return path;
}

var bootPATH = __CreateJSPath("boot.js");


//link
//document.write('<link href="' + bootPATH + 'platform.css" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'libs/jquery/dateField/jquery.dateField.css" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'gantt.css" rel="stylesheet" type="text/css" />');
//document.write('<link href="' + bootPATH + 'ganttPrint.css" rel="stylesheet" type="text/css" />');

//libs
document.write('<script src="' + bootPATH + 'libs/jquery/jquery-3.1.1.min.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/jquery-ui.min.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/jquery.livequery.1.1.1.min.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/jquery.timers.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/utilities.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/forms.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/date.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/dialogs.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'libs/layer/layer.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/layout.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/i18nJs.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/dateField/jquery.dateField.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/JST/jquery.JST.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/svg/jquery.svg.min.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'libs/jquery/svg/jquery.svgdom.1.8.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'libs/upload.js" type="text/javascript"></script>');

//editor
//document.write('<script src="' + bootPATH + 'editor/Window.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/TaskWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/TaskLookWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/DepartmentWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/SupplierWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/ImportPlanWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/VersionWindow.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'editor/PreCalculation.js" type="text/javascript"></script>');

//base
document.write('<script src="' + bootPATH + 'ganttUtilities.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'ganttTask.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'ganttDrawerSVG.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'ganttZoom.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'ganttGridEditor.js" type="text/javascript"></script>');
document.write('<script src="' + bootPATH + 'ganttMaster.js" type="text/javascript"></script>');

//hander
//document.write('<script src="' + bootPATH + 'TreeStructure.js" type="text/javascript"></script>');
//document.write('<script src="' + bootPATH + 'Layout.js" type="text/javascript"></script>');