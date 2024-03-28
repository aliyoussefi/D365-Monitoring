//Application Insights Demo Helper Methods==========================================================================================
function test(context){
}
function captureTelemetry(formContext) {
    
    //var appInsightsKey = RetrieveInstrumentationKeyEnvironmentVariable("pfe_InstrumentationKey")
    var insights = asyncRetrieveInstrumentationKeyEnvironmentVariable("pfe_InstrumentationKey")
    .then(
function(res){
    document.write('<script type="text/javascript" language="javascript" src="https://js.monitor.azure.com/scripts/b/ext/ai.clck.2.6.2.min.js"></script>');
    var clickPluginInstance = new Microsoft.ApplicationInsights.ClickAnalyticsPlugin();
    // Click Analytics configuration
    var clickPluginConfig = {
      autoCapture : true,
      dataTags: {
        useDefaultContentNameOrId: true
      }
    }
    // Application Insights Configuration
    var configObj = {
      instrumentationKey: "2002f686-da1b-4894-974c-056bf5bb9b34",
      extensions: [
        clickPluginInstance
      ],
      extensionConfig: {
        [clickPluginInstance.identifier] : clickPluginConfig
      },
    };
   
  
  !function(T,l,y){var S=T.location,k="script",D="instrumentationKey",C="ingestionendpoint",I="disableExceptionTracking",E="ai.device.",b="toLowerCase",w="crossOrigin",N="POST",e="appInsightsSDK",t=y.name||"appInsights";(y.name||T[e])&&(T[e]=t);var n=T[t]||function(d){var g=!1,f=!1,m={initialize:!0,queue:[],sv:"5",version:2,config:d};function v(e,t){var n={},a="Browser";return n[E+"id"]=a[b](),n[E+"type"]=a,n["ai.operation.name"]=S&&S.pathname||"_unknown_",n["ai.internal.sdkVersion"]="javascript:snippet_"+(m.sv||m.version),{time:function(){var e=new Date;function t(e){var t=""+e;return 1===t.length&&(t="0"+t),t}return e.getUTCFullYear()+"-"+t(1+e.getUTCMonth())+"-"+t(e.getUTCDate())+"T"+t(e.getUTCHours())+":"+t(e.getUTCMinutes())+":"+t(e.getUTCSeconds())+"."+((e.getUTCMilliseconds()/1e3).toFixed(3)+"").slice(2,5)+"Z"}(),iKey:e,name:"Microsoft.ApplicationInsights."+e.replace(/-/g,"")+"."+t,sampleRate:100,tags:n,data:{baseData:{ver:2}}}}var h=d.url||y.src;if(h){function a(e){var t,n,a,i,r,o,s,c,u,p,l;g=!0,m.queue=[],f||(f=!0,t=h,s=function(){var e={},t=d.connectionString;if(t)for(var n=t.split(";"),a=0;a<n.length;a++){var i=n[a].split("=");2===i.length&&(e[i[0][b]()]=i[1])}if(!e[C]){var r=e.endpointsuffix,o=r?e.location:null;e[C]="https://"+(o?o+".":"")+"dc."+(r||"services.visualstudio.com")}return e}(),c=s[D]||d[D]||"",u=s[C],p=u?u+"/v2/track":d.endpointUrl,(l=[]).push((n="SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details)",a=t,i=p,(o=(r=v(c,"Exception")).data).baseType="ExceptionData",o.baseData.exceptions=[{typeName:"SDKLoadFailed",message:n.replace(/\./g,"-"),hasFullStack:!1,stack:n+"\nSnippet failed to load ["+a+"] -- Telemetry is disabled\nHelp Link: https://go.microsoft.com/fwlink/?linkid=2128109\nHost: "+(S&&S.pathname||"_unknown_")+"\nEndpoint: "+i,parsedStack:[]}],r)),l.push(function(e,t,n,a){var i=v(c,"Message"),r=i.data;r.baseType="MessageData";var o=r.baseData;return o.message='AI (Internal): 99 message:"'+("SDK LOAD Failure: Failed to load Application Insights SDK script (See stack for details) ("+n+")").replace(/\"/g,"")+'"',o.properties={endpoint:a},i}(0,0,t,p)),function(e,t){if(JSON){var n=T.fetch;if(n&&!y.useXhr)n(t,{method:N,body:JSON.stringify(e),mode:"cors"});else if(XMLHttpRequest){var a=new XMLHttpRequest;a.open(N,t),a.setRequestHeader("Content-type","application/json"),a.send(JSON.stringify(e))}}}(l,p))}function i(e,t){f||setTimeout(function(){!t&&m.core||a()},500)}var e=function(){var n=l.createElement(k);n.src=h;var e=y[w];return!e&&""!==e||"undefined"==n[w]||(n[w]=e),n.onload=i,n.onerror=a,n.onreadystatechange=function(e,t){"loaded"!==n.readyState&&"complete"!==n.readyState||i(0,t)},n}();y.ld<0?l.getElementsByTagName("head")[0].appendChild(e):setTimeout(function(){l.getElementsByTagName(k)[0].parentNode.appendChild(e)},y.ld||0)}try{m.cookie=l.cookie}catch(p){}function t(e){for(;e.length;)!function(t){m[t]=function(){var e=arguments;g||m.queue.push(function(){m[t].apply(m,e)})}}(e.pop())}var n="track",r="TrackPage",o="TrackEvent";t([n+"Event",n+"PageView",n+"Exception",n+"Trace",n+"DependencyData",n+"Metric",n+"PageViewPerformance","start"+r,"stop"+r,"start"+o,"stop"+o,"addTelemetryInitializer","setAuthenticatedUserContext","clearAuthenticatedUserContext","flush"]),m.SeverityLevel={Verbose:0,Information:1,Warning:2,Error:3,Critical:4};var s=(d.extensionConfig||{}).ApplicationInsightsAnalytics||{};if(!0!==d[I]&&!0!==s[I]){var c="onerror";t(["_"+c]);var u=T[c];T[c]=function(e,t,n,a,i){var r=u&&u(e,t,n,a,i);return!0!==r&&m["_"+c]({message:e,url:t,lineNumber:n,columnNumber:a,error:i}),r},d.autoExceptionInstrumented=!0}return m}(y.cfg);function a(){y.onInit&&y.onInit(n)}(T[t]=n).queue&&0===n.queue.length?(n.queue.push(a),n.trackPageView({})):a()}(window,document,{
  src: "https://js.monitor.azure.com/scripts/b/ai.2.min.js", // The SDK URL Source
  // name: "appInsights", // Global SDK Instance name defaults to "appInsights" when not supplied
  // ld: 0, // Defines the load delay (in ms) before attempting to load the sdk. -1 = block page load and add to head. (default) = 0ms load after timeout,
  // useXhr: 1, // Use XHR instead of fetch to report failures (if available),
  crossOrigin: "anonymous", // When supplied this will add the provided value as the cross origin attribute on the script tag
  // onInit: null, // Once the application insights instance has loaded and initialized this callback function will be called with 1 argument -- the sdk instance (DO NOT ADD anything to the sdk.queue -- As they won't get called)
  cfg: configObj});
    });
}

async function asyncRetrieveInstrumentationKeyEnvironmentVariable(variableName){
    let response = await RetrieveEnvironmentVariableDefinition(variableName);
    //.then(RetrieveEnvironmentVariable);
    return await RetrieveEnvironmentVariable(response);
}

var RetrieveInstrumentationKeyEnvironmentVariable = function (variableName){

    return RetrieveEnvironmentVariableDefinition(variableName)
    .then(RetrieveEnvironmentVariable);


//return instrumentationkey;
};

function Demo_SlowPerformance_LoadForm(){
    console.log("Hello");
    setTimeout(() => {  console.log("World!"); }, 10000);  
}

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
        pingForAppInsightsContext(); 

        if (clientType !== "Mobile") {
            var resources = window.performance.getEntriesByType('resource');

            resources.forEach(function (elem, index) {
                //pageViews
                appInsights.trackPageView(null, elem.name, { ["userName"]: userName, ["organizationId"]: organizationId, ["client"]: clientContext.getClient() }, { ["startTime"]: elem.startTime, ["responseEnd"]: elem.responseEnd }, elem.duration);
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
    //var environmentVariableDefinition = RetrieveEnvironmentVariableDefinition(variableName);

    // var environmentVariableDefinition = RetrieveEnvironmentVariableDefinition(variableName)
    // .then(function (environmentVariableDefinition){
        return new Promise(function(resolve, reject){
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

    return new Promise(function (resolve, reject){
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
module.exports = {test};