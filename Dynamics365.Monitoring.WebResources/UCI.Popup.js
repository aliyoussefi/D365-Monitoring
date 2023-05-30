var AdobeTools = {};

window.onerror = function (message, file, lineNumber) {
    var browser_ = encodeURI(navigator.appVersion);
    var error_ = encodeURI("msg:" + message + "\n\tfile:" + file + "\n\tln:" + lineNumber);
    var user_ = encodeURI("");

    //...
    window.alert("in my custom onerror");
    //return false;
}

//window.appInsights.trackEvent = function (name, properties, measurements) {

//    window.alert("in my custom trackEvent");
//}


function captureTelemetry(formContext) {
    //var cat = localStorage.getItem('appInsights');
    //var sdkInstance = "appInsightsSDK"; window[sdkInstance] = "appInsights"; var aiName = window[sdkInstance], aisdk = window[aiName] || function (e) { function n(e) { i[e] = function () { var n = arguments; i.queue.push(function () { i[e].apply(i, n) }) } } var i = { config: e }; i.initialize = !0; var a = document, t = window; setTimeout(function () { var n = a.createElement("script"); n.src = e.url || "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", a.getElementsByTagName("script")[0].parentNode.appendChild(n) }); try { i.cookie = a.cookie } catch (e) { } i.queue = [], i.version = 2; for (var r = ["Event", "PageView", "Exception", "Trace", "DependencyData", "Metric", "PageViewPerformance"]; r.length;)n("track" + r.pop()); n("startTrackPage"), n("stopTrackPage"); var o = "Track" + r[0]; if (n("start" + o), n("stop" + o), !(!0 === e.disableExceptionTracking || e.extensionConfig && e.extensionConfig.ApplicationInsightsAnalytics && !0 === e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)) { n("_" + (r = "onerror")); var s = t[r]; t[r] = function (e, n, a, t, o) { var c = s && s(e, n, a, t, o); return !0 !== c && i["_" + r]({ message: e, url: n, lineNumber: a, columnNumber: t, error: o }), c }, e.autoExceptionInstrumented = !0 } return i }
    //    (
    //        {
    //            instrumentationKey: "",
    //            distributedTracingMode: 2 // DistributedTracingModes.W3C
    //            /* ...other configuration options... */
    //        }
    //    );
    //window[aiName] = aisdk, aisdk.queue && 0 === aisdk.queue.length && aisdk.trackPageView({});
    //window.appInsights = appInsights;
    ////""
}

AdobeTools.Popup = (function () {
    //url - Complete url for the webresource
    //width - Width of the popup window in pixels
    //height - Height of the popup window in pixels
    function showPopup(url, width, height) {
        return new Promise((resolve, reject) => {
            try {
                buildHtml(url, width, height);

                var closePopupEventHandler = function (event) {
                    closePopup();

                    //Once the popup is closed stop listening to the event
                    window.top.document.removeEventListener('closePopup', closePopupEventHandler);
                    //If the event does not contain any data to be passed to the calling function - return a success string
                    //Else return the data
                    if (IsNull(event.detail))
                        resolve("Successfully closed popup window");
                    else
                        resolve(event.detail);
                };
                //Add Event Listener for closePopup
                //closePopup event will close the window and resolve the promise
                window.top.document.addEventListener('closePopup', closePopupEventHandler, false);
            }
            catch (error) {
                reject("Error occurred in popup window" + error);
            }
        });
    }

    function buildHtml(url, width, height) {
        //Close button in the popup
        var closeDiv = document.createElement("div");
        closeDiv.id = "close-btn";
        closeDiv.style = "position: absolute; float: right; width: 16px; height: 16px; top: 4%; right: 2%; cursor: pointer;  z-index: 1007; background:url('../WebResources/ces_close.png');  background-repeat: no-repeat; background-position-x: -260px;";
        closeDiv.addEventListener('click', closeHandler, false);

        //To place the popup in the centre of page we are using the below logic
        //Find the width of window
        //Find the difference between popup width and window width
        //Divide the difference by 2 so that we get equal space to the left and right of popup in the window
        //Dividing by windowWidth and multiplying by 100 gives us the percentage value
        var windowWidth = window.top.innerWidth;
        var windowWidthDiff = windowWidth - parseInt(width);
        var windowWidthPercentage = ((windowWidthDiff / 2) / windowWidth) * 100;

        //Div and Iframe of the popup
        var divTag = document.createElement("div");
        divTag.id = "testdiv";
        divTag.style.zIndex = "1006";
        divTag.style.width = width;
        divTag.style.height = height;
        //Values based on existing Dynamics experience
        divTag.style.position = "absolute";
        divTag.style.marginLeft = "20%";
        divTag.style.top = "2.5%";
        divTag.style.left = windowWidthPercentage + "%";
        divTag.style.margin = "0px 0px 0px 0px";
        divTag.style.maxHeight = "95%";
        divTag.style.maxWidth = "95%";
        divTag.style.boxShadow = "0 0 1em black";
        divTag.style.background = "url(../Webresources/ces_loadingimage.gif) center center no-repeat #fff";
        divTag.innerHTML = '<iframe src="' + url + '" style="width: 100%; height: 100%;"></iframe>';
        divTag.append(closeDiv);

        //Adding a div on whole page just behind the popup with no content to disable click on parent page
        var disableDivTag = document.createElement("div");
        disableDivTag.id = "adobepopupdisableclick";
        disableDivTag.style = "position: fixed; padding: 0; margin: 0; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.5; z-index: 1005; background-color: black";

        window.top.document.body.append(divTag);
        window.top.document.body.append(disableDivTag);
    }

    //Closes the popup
    function closePopup() {
        var parentNode = window.top.document.getElementById("adobepopupdiv").parentNode;
        parentNode.removeChild(window.top.document.getElementById("adobepopupdiv"));
        parentNode.removeChild(window.top.document.getElementById("adobepopupdisableclick"));
    }

    //Close event handler for the close button present in the popup window
    function closeHandler(event) {
        event.preventDefault();
        var closeWindowEvent = new CustomEvent('closePopup');
        window.top.document.dispatchEvent(closeWindowEvent);
    }

    function constructUrl(webResource) {
        var scripts = document.getElementsByTagName("script");
        var images = document.getElementsByTagName("img");

        var isCachingTokenFound = false;
        var resourceCache = "";
        var url;
        var p1, p2;

        //Traverse through all images in the page to find caching token for webresources
        for (i = 0; i < images.length; i++) {
            url = images[i].src;
            p1 = url.search("/%7B");
            if (p1 > 0) {
                p2 = url.search("%7D/", p1) + 4;
                resourceCache = url.substr(p1, p2 - p1);
                isCachingTokenFound = true;
                break;
            }
        }

        //If caching token is not already found in image tags try getting it from script tags
        if (!isCachingTokenFound) {
            for (var i = 0; i < scripts.length; i++) {
                url = scripts[i].src;
                p1 = url.search("/%7B");
                if (p1 > 0) {
                    p2 = url.search("%7D/", p1) + 4;
                    resourceCache = url.substr(p1, p2 - p1);
                    isCachingTokenFound = true;
                    break;
                }
            }
        }

        //If caching token is found return the url with caching token
        //If not return the absolute url
        if (isCachingTokenFound)
            url = resourceCache + "Webresources/" + webResource;
        else
            url = "/Webresources/" + webResource;
        return url;
    }

    //Placeholder function to add dependency
    function initialize() {
        //Call this from ribbon
        console.log("This function is used to include this js in ribbons");
    }

    return {
        Initialize: initialize,
        ShowPopup: showPopup,
        CreateUrl: constructUrl
    };

})();

var PfeTools = {};
PfeTools.Popup = (function () {
    //https://bettercrm.blog/2017/10/29/dynamics-365-9-0-client-side-navigation/
    function showPopup(url, width, height) {
        window.appInsightsAli = {};
        window.appInsightsAli.Test = "test string";
        localStorage.setItem("Ali", window.appInsightsAli);
        captureTelemetry("test");
        window.MyProperty = function () { alert("Hello World"); };
        //window.appInsights.config.instrumentationKey = "";
        window.appInsights.trackEvent("test", null, null);
        var alertStrings = { confirmButtonLabel: "Yes", text: "This is an alert." };
        var alertOptions = { height: 120, width: 260 };
        // Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
        //     function success(result) {
        //         console.log("Alert dialog closed");
        //     },
        //     function (error) {
        //         console.log(error.message);
        //     }
        // );
        window.appInsights.trackPageView();
        var url = "http://google.com";
        var openUrlOptions = {
            height: 400,
            width: 800
        };

        //Xrm.Navigation.openUrl(url, openUrlOptions);
    }

    function openAlertDialog() {
        var alertStrings = { confirmButtonLabel: "Yes", text: "This is an alert." };
        var alertOptions = { height: 120, width: 260 };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function success(result) {
                console.log("Alert dialog closed");
            },
            function (error) {
                console.log(error.message);
            }
        );
    }

    function openConfirmDialog() {
        var confirmStrings = { text: "This is a confirmation.", title: "Confirmation Dialog" };
        var confirmOptions = { height: 200, width: 450 };
        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            function (success) {
                if (success.confirmed)
                    console.log("Dialog closed using OK button.");
                else
                    console.log("Dialog closed using Cancel button or X.");
            });
    }

    function openErrorDialog() {
        Xrm.Navigation.openErrorDialog({ errorCode: 1234 }).then(
            function (success) {
                console.log(success);
                window.appInsights.trackEvent('customevent sent from UCI.Popup.js');
            },
            function (error) {
                console.log(error);
            });
    }

    function openFile() {
        var file = {
            fileContent: "bXkgc2VjcmV0IGNvbnRlbnQ=", //Contents of the file. 
            fileName: "example.txt", //Name of the file.
            fileSize: 24, //Size of the file in KB.
            mimeType: "text/plain" //MIME type of the file.
        };
        Xrm.Navigation.openFile(file);
    }

    function openForm() {

    }

    function openUrl() {
        var url = "http://google.com";
        var openUrlOptions = {
            height: 400,
            width: 800
        };

        //Xrm.Navigation.openUrl(url, openUrlOptions);

    }

    function openWebResource() {
        var windowOptions = {
            openInNewWindow: false,
            height: 400,
            width: 400
        };

        Xrm.Navigation.openWebResource("new_mywebresource.html", windowOptions, "someAdditionalParameter");
    }

    return {
        ShowPopup: showPopup,
        OpenAlertDialog: openAlertDialog,
        OpenConfirmDialog: openConfirmDialog,
        OpenErrorDialog: openErrorDialog,
        OpenFile: openFile,
        OpenForm: openForm,
        openUrl: openUrl,
        OpenWebResource: openWebResource
    };
})();