var clientType;
var dimensions;
//Form registered methods==========================================================================================================

//Entry point for Navigation and Resource Timings Demo
function uploadResourceTimings(formContext) {
    try {
        var globalContext = Xrm.Utility.getGlobalContext();
        var formAttributes = formContext.getFormContext().data.entity.attributes;
        var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var clientContext = Xrm.Utility.getGlobalContext().client;

        var userName = userSettings.userName;
        var organizationId = organizationSettings.organizationId;

        dimensions = {
            ["userName"]: userName,
            ["userId"]: userSettings.userId,
            ["organizationId"]: organizationId,
            ["client"]: clientContext.getClient(),
            ["uniqueName"]: organizationSettings.uniqueName,
            ["clientState"]: clientContext.getClientState(),
            ["formFactor"]: clientContext.getFormFactor(),
            ["isOffline"]: clientContext.isOffline(),
            ["clientUrl"]: globalContext.getClientUrl(),
            ["version"]: globalContext.getVersion(),
            ["baseCurrencyId"]: organizationSettings.baseCurrencyId,
            ["defaultCountryCode"]: organizationSettings.defaultCountryCode,
            ["isAutoSaveEnabled"]: organizationSettings.isAutoSaveEnabled,
            ["languageId"]: organizationSettings.languageId
        };


        //Key metrics
        var fetchStart = window.performance.timing.fetchStart;
        var loadEventEnd = window.performance.timing.loadEventEnd;

        var navigationStart = window.performance.timing.navigationStart;
        var firstByte = window.performance.timing.responseStart;
        var domReady = window.performance.timing.domContentLoadedEventEnd;
        var pageReady = window.performance.timing.loadEventEnd;

        var DomContentLoadTime = window.performance.timing.domComplete - window.performance.timing.domInteractive;
        var DomParsingTime = window.performance.timing.domInteractive - window.performance.timing.domLoading;
        var RequestResponseTime = window.performance.timing.responseEnd - window.performance.timing.requestStart;
        var PageRenderTime = window.performance.timing.domComplete - window.performance.timing.domLoading;
        var NetworkLatency = window.performance.timing.responseEnd - window.performance.timing.fetchStart;
        var RedirectTime = window.performance.timing.redirectEnd - window.performance.timing.redirectStart;
        var RedirectCount = window.performance.navigation.redirectCount;
        var navigationType = window.performance.navigation.type;
        //Navigation in order

        //Contacting the Server
        var navigationNetworkDurationMeasurements = Object();
        navigationNetworkDurationMeasurements.navigationStart = window.performance.timing.navigationStart;
        navigationNetworkDurationMeasurements.redirectStart = window.performance.timing.redirectStart;
        navigationNetworkDurationMeasurements.unloadStart = window.performance.timing.unloadEventStart;
        navigationNetworkDurationMeasurements.unloadEnd = window.performance.timing.unloadEventEnd;
        navigationNetworkDurationMeasurements.redirectEnd = window.performance.timing.redirectEnd;
        navigationNetworkDurationMeasurements.fetchStart = window.performance.timing.fetchStart;
        navigationNetworkDurationMeasurements.domainLookupStart = window.performance.timing.domainLookupStart;
        navigationNetworkDurationMeasurements.domainLookupEnd = window.performance.timing.domainLookupEnd;
        navigationNetworkDurationMeasurements.connectStart = window.performance.timing.connectStart;
        navigationNetworkDurationMeasurements.connectEnd = window.performance.timing.connectEnd;

        var measurements = {
            ["fetchStart"]: fetchStart,
            ["loadEventEnd"]: loadEventEnd,
            ["navigationStart"]: navigationStart,
            ["DomContentLoadTime"]: DomContentLoadTime,
            ["DomParsingTime"]: DomParsingTime,
            ["RequestResponseTime"]: RequestResponseTime,
            ["PageRenderTime"]: PageRenderTime,
            ["NetworkLatency"]: NetworkLatency,
            ["RedirectTime"]: RedirectTime,
            ["RedirectCount"]: RedirectCount,
            ["navigationType"]: navigationType,
        };


        if (clientType !== "Mobile") {
            var resources = window.performance.getEntriesByType('resource');

            resources.forEach(function (elem, index) {
                //pageViews
                appInsights.trackPageView(null, elem.name, { ["userName"]: userName, ["organizationId"]: organizationId, ["client"]: clientContext.getClient() }, { ["startTime"]: elem.startTime, ["responseEnd"]: elem.responseEnd }, elem.duration);
            });
        }

        //Add sample Data
        var i;
        for (i = 0; i < 100; i++) {
            //pageViews
            appInsights.trackTrace("Monitoring MIP Trace Example from " + window.CURRENT_SESSION_ID);
        }

        for (i = 0; i < 100; i++) {
            //pageViews
            appInsights.trackEvent("Monitoring MIP Event Example from " + window.CURRENT_SESSION_ID);
        }

        for (i = 0; i < 100; i++) {
            //trackMetric
            var interactTime = window.performance.measure(
                "mySetTimeout",
                "Marking User Interaction Time-Start: " + Xrm.Page.data.entity.getEntityName(),
                "Marking User Interaction Time-End: " + Xrm.Page.data.entity.getEntityName()
            );
            appInsights.trackMetric("Monitoring MIP Metroc Example from " + executionContext.getEventArgs().getSaveMode() + " on " + Xrm.Page.data.entity.getEntityName() + " of " + Xrm.Page.context.getClientUrl(), interactTime, null, null, null, null);
        }


    }
    catch (exception) {
        appInsights.trackException(exception, null, null, null);
    }
}

//Form and Execution Context Helper Methods========================================================================================

//Application Insights Demo Helper Methods==========================================================================================
function captureTelemetry(formContext) {
    var appInsightsKey = RetrieveInstrumentationKeyEnvironmentVariable("pfe_InstrumentationKey")
        .then(function (res) {
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
                instrumentationKey: res,
                disableTelemetry: false,
                application: { ver: "2.9" },
                isBrowserLinkTrackingEnabled: true,
                //autoTrackPageView will write to customMetrics
                autoTrackPageVisitTime: true,
                disableAjaxTracking: false,
                tags: 6

                //verboseLogging: true,
                //enableDebug: true
            });
            window.appInsights = appInsights;

            uploadResourceTimings(formContext);
        });



}

var RetrieveInstrumentationKeyEnvironmentVariable = function (variableName) {

    return RetrieveEnvironmentVariableDefinition(variableName)
        .then(RetrieveEnvironmentVariable);


    //return instrumentationkey;
};

function RetrieveEnvironmentVariable(variableName) {
    //var environmentVariableDefinition = RetrieveEnvironmentVariableDefinition(variableName);

    // var environmentVariableDefinition = RetrieveEnvironmentVariableDefinition(variableName)
    // .then(function (environmentVariableDefinition){
    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq " + variableName, false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var environmentVariable = JSON.parse(req.responseText).value[0].value;
                    resolve(environmentVariable);
                }
                else {
                    //
                    reject();
                }
                //appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
            }

        };
        req.send();

    });




}

//function RetrieveEnvironmentVariable(variableName) {
//    var req = new XMLHttpRequest();
//    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq " + environmentVariableDefinition, false);
//    req.setRequestHeader("OData-MaxVersion", "4.0");
//    req.setRequestHeader("OData-Version", "4.0");
//    req.setRequestHeader("Accept", "application/json");
//    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//    req.onreadystatechange = function () {
//        if (this.readyState === 4) {
//            req.onreadystatechange = null;
//            if (this.status === 200) {
//                var environmentVariable = JSON.parse(req.responseText).value[0];

//            }
//            else {
//                //
//            }
//            appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
//        }

//    };
//    req.send();
//}

function RetrieveEnvironmentVariableDefinition(definitionId) {

    return new Promise(function (resolve, reject) {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/environmentvariabledefinitions?$filter=schemaname eq '" + definitionId + "'", false);

        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                //req.onreadystatechange = null;
                if (this.status === 200) {
                    var environmentVariable = JSON.parse(req.responseText).value[0];
                    var environmentVariableDefinition = environmentVariable.environmentvariabledefinitionid;
                    definitionId = environmentVariableDefinition;
                    return resolve(environmentVariableDefinition);
                    //callback.apply(environmentVariableDefinition);
                }
                else {
                    //
                    resolve();
                }
                //appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
            }

        };
        req.send();
        //resolve();


    })


}
