//Application Insights Demo Helper Methods==========================================================================================
function captureTelemetry(formContext) {
    var appInsights = window.appInsights || function (config) {
        function i(config) {
            t[config] = function () {
                var i = arguments; t.queue.push(function () { t[config].apply(t, i) })
            }
        }
        var t = { config: config }, u = document, e = window, o = "script", s = "AuthenticatedUserContext", h = "start", c = "stop", l = "Track", a = l + "Event", v = l + "Page", y = u.createElement(o), r, f;
        y.src = config.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js";
        u.getElementsByTagName(o)[0].parentNode.appendChild(y);
        try { t.cookie = u.cookie } catch (p) { }
        for (t.queue = [], t.version = "1.0", r = ["Event", "Exception", "Metric", "PageView", "Trace", "Dependency"]; r.length;)
            i("track" + r.pop());
        return i("set" + s), i("clear" + s), i(h + a), i(c + a), i(h + v), i(c + v), i("flush"), config.disableExceptionTracking || (r = "onerror", i("_" + r), f = e[r], e[r] = function (config, i, u, e, o) {
            var s = f && f(config, i, u, e, o);
            return s !== !0 && t["_" + r](config, i, u, e, o), s
        }), t
    }({
        instrumentationKey: "7b18b7f7-3daf-4951-abba-8372cf9b21a9",
        disableTelemetry: false,
        application: { ver: "2.9" },
        isBrowserLinkTrackingEnabled: true,
        //autoTrackPageView will write to customMetrics
        autoTrackPageVisitTime: true,
        disableAjaxTracking: false
        //verboseLogging: true,
        //enableDebug: true
    });
    window.appInsights = appInsights;

}

function ApplicationInsightsDemo_UCI_onLoad(formContext) {
    try {
        //DEMO: trackTrace
        appInsights.trackTrace("Begin " + "testApplicationInsights_UCI_onLoad");
        //XRM Variables******************************************************
        appInsights.trackTrace("Begin " + "formContext variable");
        var globalContext = Xrm.Utility.getGlobalContext();
        var formAttributes = formContext.getFormContext().data.entity.attributes;
        var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var clientContext = Xrm.Utility.getGlobalContext().client;

        var userName = userSettings.userName;
        var organizationId = organizationSettings.organizationId;

        dimensions = {
            ["source"]: "WebResource",
            ["userName"]: userName,
            ["userId"]: userSettings.userId,
            ["organizationId"]: organizationId,
            ["client"]: clientContext.getClient(),
            ["uniqueName"]: organizationSettings.uniqueName,
            ["clientState"]: clientContext.getClientState(),
            ["formFactor"]: clientContext.getFormFactor(),
            ["isOffline"]: clientContext.isOffline(),
            ["clientUrl"]: globalContext.getClientUrl(),
            ["currentAppUrl"]: globalContext.getCurrentAppUrl(),
            ["version"]: globalContext.getVersion(),
            ["baseCurrencyId"]: organizationSettings.baseCurrencyId,
            ["defaultCountryCode"]: organizationSettings.defaultCountryCode,
            ["isAutoSaveEnabled"]: organizationSettings.isAutoSaveEnabled,
            ["languageId"]: organizationSettings.languageId
        };

        globalContext.getCurrentAppName().then(successCallBackCustomEventPush, errorCallBackCustomEventPush);
        globalContext.getCurrentAppProperties().then(successCallBackAppPropertiesCustomEventPush, errorCallBackCustomEventPush);

        appInsights.trackTrace("End " + "formContext variable");
        //XRM Variables******************************************************
        //END DEMO: trackTrace

    } catch (e) {
        appInsights.trackException(e);
    }
}
//Application Insights Demo Helper Methods==========================================================================================
//Form and Execution Context Helper Methods========================================================================================
function successCallBackCustomEventPush(result) {
    var dimensions = {
        ["name"]: result


    };
    appInsights.trackEvent("UCI Demo", dimensions, null);
}

function successCallBackAppPropertiesCustomEventPush(result) {
    var dimensions = {
        ["appId"]: result.appId,
        ["displayName"]: result.displayName,
        ["uniqueName"]: result.uniqueName,
        ["url"]: result.url,
        ["webResourceId"]: result.webResourceId,
        ["webResourceName"]: result.webResourceName


    };
    appInsights.trackEvent("UCI Demo", dimensions, null);
}

function errorCallBackCustomEventPush(result) {
    var dimensions = { [""]: "" };
    appInsights.trackEvent("UCI Demo", dimensions, null);
}
//Form and Execution Context Helper Methods========================================================================================
