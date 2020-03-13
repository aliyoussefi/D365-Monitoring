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
         ["version"]:   globalContext.getVersion(),
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
        
        //Perform WebAPI Requests
        RetrieveEntity('accounts');
        //This will ping for App Insights context and write a create method.
        //pingForAppInsightsContext(); 

        if (clientType !== "Mobile") {
            var resources = window.performance.getEntriesByType('resource');

            resources.forEach(function (elem, index) {
                //pageViews
                PfeAppInsights.trackPageView(null, elem.name, { ["userName"]: userName, ["organizationId"]: organizationId, ["client"]: clientContext.getClient() }, { ["startTime"]: elem.startTime, ["responseEnd"]: elem.responseEnd }, elem.duration);
            });
        }


    }
    catch (exception) {
        appInsights.trackException(exception, null, null,null);
    }
}

//Entry point for Application Insights Demo
function testApplicationInsights(formContext) {

    try {
        //DEMO: trackTrace
            appInsights.trackTrace("Begin " + "testApplicationInsights");
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
             ["source"]:"WebResource",
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

        //DEMO: customEvent===================================================
            appInsights.trackTrace("Begin " + "DEMO: customEvent");
            testTrackCustomEvent();
            appInsights.trackTrace("End " + "DEMO: customEvent");
        //END DEMO: customEvent================================================

        //DEMO: pageViews===================================================
            appInsights.trackTrace("Begin DEMO: " + "pageViews");
            //This will demo pageViews, which is set by default but not reliable. Instead we can use navigation timings.
            //Also we call startTrackPage and stopTrackPage
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
                ["NavigationType"]: navigationType
            };
        appInsights.trackPageView(name, window.location.href, dimensions, measurements, pageReady - navigationStart);
        
            appInsights.trackTrace("End DEMO: " + "pageViews");
        //END DEMO: pageViews===============================================

        //DEMO: exceptions===================================================
            appInsights.trackTrace("Begin DEMO: " + "exceptions");
            testTrackException();
            appInsights.trackTrace("End DEMO: " + "exceptions");
        //END DEMO: exceptions===============================================

        //DEMO: customMetrics===================================================
            appInsights.trackTrace("Begin DEMO: " + "customMetrics");
            testTrackCustomMetric();
            appInsights.trackTrace("End DEMO: " + "customMetrics");
        //END DEMO: customMetrics===============================================



    } catch (e) {
        appInsights.trackException(e);
    }

}

//Form and Execution Context Helper Methods========================================================================================
function successCallBackCustomEventPush(result) {
    var dimensions = {
        ["name"]: result


    };
    appInsights.trackEvent("Gilles Demo", dimensions, null);
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
    appInsights.trackEvent("Gilles Demo", dimensions, null);
}

function errorCallBackCustomEventPush(result) {

}
//Form and Execution Context Helper Methods========================================================================================

//Application Insights Demo Helper Methods==========================================================================================
function captureTelemetry(formContext) {
    RetrieveEnvironmentVariable("pfe_InstrumentationKey");
    var PfeAppInsights = window.PfeAppInsights || function (config) {
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
        instrumentationKey: appInsightsInstrumentationKey,
        disableTelemetry: false,
        application: { ver: "2.9" },
        isBrowserLinkTrackingEnabled: true,
        //autoTrackPageView will write to customMetrics
        autoTrackPageVisitTime: true,
        disableAjaxTracking: false
        //verboseLogging: true,
        //enableDebug: true
    });
    window.PfeAppInsights = PfeAppInsights;

}

function testTrackAvailabilityResults() {
    appInsights.trackTrace("Begin testTrackAvailabilityResults");
    try {
        //coordinates on mobile
        var isCrmForMobile = (clientContext.getClient() === "Mobile");
        clientType = clientContext.getClient();
        appInsights.trackTrace("WebClientBootType: " + localStorage.WebClientBootType);
        if (isCrmForMobile) {
            Xrm.Device.getCurrentPosition().then(
                function success(location) {
                    Xrm.Navigation.openAlertDialog({
                        text: "Latitude: " + location.coords.latitude +
                        ", Longitude: " + location.coords.longitude
                    });
                },
                function (error) {
                    Xrm.Navigation.openAlertDialog({ text: error.message });
                }
            );
        }
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackAvailabilityResults");
}

function testTrackCustomMetric() {
    appInsights.trackTrace("Begin testTrackCustomMetric");
    try {
        RetrieveEntity("contacts");
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackCustomMetric");
}

function testTrackDependency() {
    appInsights.trackTrace("Begin testTrackDependency");
    try {
        //BROWSER FEATURE DETECTION******************************************************
        //Let's begin by testing browser feature detection
        //This will not populate in iOS:
        var resources = window.performance.getEntriesByType('resource');
        if (typeof resources === undefined) {
            appInsights.trackTrace("resources is undefined.");
        }
        else if (resources === null) {
            appInsights.trackTrace("resources is null.");
        } else {
            //resources exist! Let's check:
            appInsights.trackTrace("testTrackDependency: resources count: " + resources.length);
            resources.forEach(function (elem, index) {
                appInsights.trackPageView(null, elem.name, { ["userName"]: userName, ["organizationId"]: organizationId, ["client"]: clientContext.getClient() }, { ["startTime"]: elem.startTime, ["responseEnd"]: elem.responseEnd }, elem.duration);
            });
        }
        //BROWSER FEATURE DETECTION******************************************************
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackDependency");
}

function testTrackException() {
    appInsights.trackTrace("Begin testTrackException");
    try {
        throw new Error('Thrown on purpose.');
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackException");
}

function testTrackCustomEvent() {
    appInsights.trackTrace("Begin testTrackCustomEvent");
    try {
        //Loop through each attribute to add track
        formContext.getFormContext().data.entity.attributes.forEach(function (attribute, index) {
            formContext.getFormContext().getAttribute(index).addOnChange(trackAttributeChange);
        });
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackCustomEvent");
}
function trackAttributeChange(formContext) {
    var globalContext = Xrm.Utility.getGlobalContext();
    var formAttributes = formContext.getFormContext().data.entity.attributes;
    var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    var clientContext = Xrm.Utility.getGlobalContext().client;

    var userName = userSettings.userName;
    var organizationId = organizationSettings.organizationId;

    dimensions = {
     ["Source"]: "WebResource",
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
    appInsights.trackEvent(formContext.getEventSource().getName() + " on " + Xrm.Page.data.entity.getEntityName() + " of " + Xrm.Page.context.getClientUrl() + " has been altered.", dimensions, null);
}

function testTrackRequest() {
    appInsights.trackTrace("Begin testTrackRequest");
    try {
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + "contacts", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var remainingXrmRequests = this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests");
                    var numOfEntities = JSON.parse(req.responseText).value.length;
                    var respObj = Object();

                    respObj.verb = "GET";
                    respObj.status = this.status;
                    respObj.requestLimits = this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests");
                    respObj.url = req.responseURL;

                    if (clientType === "Mobile") {
                        //trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: {[string]:string})
                        appInsights.trackMetric("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status,
                            timeDiff,
                            numOfEntities,
                            null,
                            null,
                            {
                                "Source": "WebResource",
                                "resource": null,
                                "request": JSON.stringify(respObj)
                            });
                    }
                    else {
                        var xmlHttpRequestResourceEntry = window.performance.getEntriesByName(req.responseURL)[0];
                        appInsights.trackMetric("RetrieveEntity Response Returned using resource entry: " + req.responseURL + " with status of " + this.status,
                            xmlHttpRequestResourceEntry.duration,
                            numOfEntities,
                            xmlHttpRequestResourceEntry.startTime,
                            xmlHttpRequestResourceEntry.responseEnd,
                            {
                                "Source":"WebResource",
                                "resource": JSON.stringify(xmlHttpRequestResourceEntry),
                                "request": JSON.stringify(respObj)
                            });
                    }
                    //dimensions = {
                    //    "request": "request": JSON.stringify(respObj),
                    //    "":""
                    //}
                    //appInsights.trackEvent("EVT: RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
                    //appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status, dimensions, null);
                }

            }
        };
        appInsights.trackEvent("RetrieveEntity Begin Send: " + req.responseURL);
        startTime = new Date();
        req.send();
    } catch (e) {
        appInsights.trackException(e);
    }
    appInsights.trackTrace("End testTrackRequest");
}
//Application Insights Demo Helper Methods==========================================================================================
function onSaveTrackEvent(executionContext) {
    alert('Hi i am saving now.');
    //https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure
    performance.mark("Marking User Interaction Time-End: " + Xrm.Page.data.entity.getEntityName());

    //var entries = window.performance.getEntries();
    if (clientType === "Mobile") {
        var resources = window.performance.getEntriesByType('resource');
    }
    //resources.forEach(function (elem, index) {
    //    //pageViews
    //    appInsights.trackPageView(null, elem.name, { ["userName"]: userName, ["organizationId"]: organizationId, ["client"]: clientContext.getClient() }, { ["startTime"]: elem.startTime, ["responseEnd"]: elem.responseEnd }, elem.duration);
    //});

    // Measure between the two different markers.
    var interactTime = window.performance.measure(
      "mySetTimeout",
      "Marking User Interaction Time-Start: " + Xrm.Page.data.entity.getEntityName(),
      "Marking User Interaction Time-End: " + Xrm.Page.data.entity.getEntityName()
    );
    appInsights.trackMetric("SAVE METRIC: Save Mode: " + executionContext.getEventArgs().getSaveMode() + " on " + Xrm.Page.data.entity.getEntityName() + " of " + Xrm.Page.context.getClientUrl(), interactTime, null, null, null, null);
    appInsights.trackEvent("SAVE EVNT: Save Mode: " + executionContext.getEventArgs().getSaveMode() + " on " + Xrm.Page.data.entity.getEntityName() + " of " + Xrm.Page.context.getClientUrl() + " has been altered.");
    window.performance.clearResourceTimings();
}

function testTrackPageView(name, url, properties, measurements, duration) {
    //trackPageView(name?: string, url?: string, properties?:{[string]:string}, measurements?: {[string]:number}, duration?: number)
    var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;
    var userSettings = Xrm.Utility.getGlobalContext().userSettings;
    var clientContext = Xrm.Utility.getGlobalContext().client;

    var userName = userSettings.userName;
    var organizationId = organizationSettings.organizationId;

    //if (name == null) {

    //}
    //if (url == null) {

    //}
    if (properties === null) {
        properties = {
            ["userName"]: userName,
            ["organizationId"]: organizationId,
            ["getClientUrl"]: Xrm.Utility.getGlobalContext().getClientUrl()



        };
    }
    //if (measurements == null) {

    //}
    //if (duration == null) {

    //}
    appInsights.trackPageView(name, url, properties, measurements, duration);

}



function PerformDOMLatency() {
    var start = Date.now();
    while (Date.now() < start + 3000) { alert('in the DOM latency test'); }
    Xrm.Navigation.openWebResource("new_/html/AzureApplicationInsights/TestHarness.htm");
    Xrm.Navigation.openWebResource("new_/html/AzureApplicationInsights/TestHarness.htm");
    Xrm.Navigation.openWebResource("new_/html/AzureApplicationInsights/TestHarness.htm");
    Xrm.Navigation.openWebResource("new_/html/AzureApplicationInsights/TestHarness.htm");
    Xrm.Navigation.openWebResource("new_/html/AzureApplicationInsights/TestHarness.htm");
}
//Nav and Resource Timings Helpers======================================================================================================================
function createEntity(ent, entName, upd) {
    var startTime, endTime;
    var jsonEntity = JSON.stringify(ent);

    var entity = ent;

    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.0/ayw_applicationinsightstestruns", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            endTime = new Date();
            var timeDiff = endTime - startTime;
            if (this.status === 204) {
                var uri = this.getResponseHeader("OData-EntityId");
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec(uri);
                var newEntityId = matches[1];
            } else {
                //Xrm.Utility.alertDialog(this.statusText);
            }
            if (clientType === "Mobile") {
                appInsights.trackMetric("createEntity Response Returned: " + Xrm.Page.context.getClientUrl() + "/api/data/v9.0/ayw_applicationinsightstestruns" + entName + " with status of " + this.status,
                                        timeDiff,
                                        0,
                                        0,
                                        0,
                                        null);
            }
            else {
                var xmlHttpRequestResourceEntry = window.performance.getEntriesByName(req.responseURL)[0];
                appInsights.trackMetric("createEntity Response Returned using resource entry: " + req.responseURL + " with status of " + this.status,
                    xmlHttpRequestResourceEntry.duration,
                    1,
                    xmlHttpRequestResourceEntry.startTime,
                    xmlHttpRequestResourceEntry.responseEnd,
                    { "Source": "WebResource", ["resource"]: JSON.stringify(xmlHttpRequestResourceEntry) });
            }
            appInsights.trackEvent("createEntity Response Returned: " + Xrm.Page.context.getClientUrl() + "/api/data/v9.0/ayw_applicationinsightstestruns" + entName + " with status of " + this.status);
        }
    };
    startTime = new Date();
    appInsights.trackEvent("EVT: createEntity Begin Send: " + Xrm.Page.context.getClientUrl() + "/api/data/v9.0/ayw_applicationinsightstestruns" + entName);
    req.send(JSON.stringify(entity));

    //var newEntity = JSON.parse(req.responseText).d;
    //return newEntity;

}

function RetrieveEnvironmentVariable(variableName) {
    var environmentVariableDefinition = RetrieveEnvironmentVariableDefinition(variableName);
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/environmentvariablevalues?$filter=_environmentvariabledefinitionid_value eq " + classLevelenvironmentVariableDefinition, false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var environmentVariable = JSON.parse(req.responseText).value[0];
                appInsightsInstrumentationKey = environmentVariable.value;
            }
            else {
                //
            }
            appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
        }

    };
    req.send();
}

var classLevelenvironmentVariableDefinition = "";
var appInsightsInstrumentationKey = "";
function RetrieveEnvironmentVariableDefinition(definitionId) {
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
                classLevelenvironmentVariableDefinition = environmentVariableDefinition;
                return environmentVariableDefinition;
            }
            else {
                //
            }
            appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
        }

    };
    req.send();
  
}


function RetrieveEntity(entName) {
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + entName, false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var remainingXrmRequests = this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests");
                var numOfEntities = JSON.parse(req.responseText).value.length;
                var respObj = Object();

                respObj.verb = "GET";
                respObj.status = this.status;
                respObj.requestLimits = this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests");
                respObj.url = req.responseURL;

                if (clientType === "Mobile") {
                    //trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: {[string]:string})
                    appInsights.trackMetric("RetrieveEntity Response Returned: " + Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + entName + " with status of " + this.status,
                        timeDiff,
                        numOfEntities,
                        null,
                        null,
                        null);
                }
                else {
                    var xmlHttpRequestResourceEntry = window.performance.getEntriesByName(req.responseURL)[0];
                    appInsights.trackMetric("RetrieveEntity Response Returned using resource entry: " + req.responseURL + " with status of " + this.status,
                        xmlHttpRequestResourceEntry.duration,
                        numOfEntities,
                        xmlHttpRequestResourceEntry.startTime,
                        xmlHttpRequestResourceEntry.responseEnd,
                        {
                            "Source": "WebResource",
                            "Verb": "GET",
                            "Status": this.status,
                            "RequestLimits": this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests"),
                            "URL": req.responseURL,
                            ["resource"]: JSON.stringify(xmlHttpRequestResourceEntry),
                            ["request"]: JSON.stringify(respObj)
                        });
                }
                appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
            }

        }
    };
    //appInsights.trackMetric("MET: RetrieveEntity Begin Send: " + Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + entName, interactTime, null, null, null, null);
    ////customEvents
    appInsights.trackEvent("RetrieveEntity Begin Send: " + req.responseURL);
    startTime = new Date();
    req.send();

}
function pingForAppInsightsContext() {
    var refreshIntervalId = setInterval(function () {
        if (appInsights !== null) {
            if (appInsights.context != null) {
                if (appInsights.context.operation.id != null) {
                    //appinsights operationj is
                    var operationId = appInsights.context.operation.id;
                    /* later */
                    clearInterval(refreshIntervalId);
                    //create App Insights Test Run entry
                    if (Xrm.Page.data.entity.getId().substring(1, 37) !== null) {
                        var post = Object();
                        post.ayw_name = "Test Run";
                        post.ayw_operationid = appInsights.context.operation.id;
                        post.ayw_sessionid = "";
                        post.ayw_userid = appInsights.context.user.id;
                        post["ayw_ApplicationInsightTest@odata.bind"] = Xrm.Page.data.entity.getEntityName() + "s(" +
                            Xrm.Page.data.entity.getId().substring(1, 37) + ")";
                        createEntity(post, "ayw_applicationinsightstestrun", "");
                    }
                }
            }
        }


    }, 1000);



}

//End Nav and Resource Timings  Helpers==================================================================================================================