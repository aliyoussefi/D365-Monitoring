function RetrieveEntity(entName) {
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.2/" + entName, false);
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
                    //window.appInsights.trackMetric("RetrieveEntity Response Returned: " + Xrm.Page.context.getClientUrl() + "/api/data/v8.2/" + entName + " with status of " + this.status,
                    //    timeDiff,
                    //    numOfEntities,
                    //    null,
                    //    null,
                    //    null);
                }
                else {
                    var xmlHttpRequestResourceEntry = window.performance.getEntriesByName(req.responseURL)[0];
                    //window.appInsights.trackMetric("RetrieveEntity Response Returned using resource entry: " + req.responseURL + " with status of " + this.status,
                    //    xmlHttpRequestResourceEntry.duration,
                    //    numOfEntities,
                    //    xmlHttpRequestResourceEntry.startTime,
                    //    xmlHttpRequestResourceEntry.responseEnd,
                    //    {
                    //        "Source": "WebResource",
                    //        "Verb": "GET",
                    //        "Status": this.status,
                    //        "RequestLimits": this.getResponseHeader("x-ms-ratelimit-burst-remaining-xrm-requests"),
                    //        "URL": req.responseURL,
                    //        ["resource"]: JSON.stringify(xmlHttpRequestResourceEntry),
                    //        ["request"]: JSON.stringify(respObj)
                    //    });
                }
                //window.appInsights.trackEvent("RetrieveEntity Response Returned: " + req.responseURL + " with status of " + this.status);
            }

        }
    };

//    window.appInsights.trackEvent("RetrieveEntity Begin Send: " + req.responseURL);
    startTime = new Date();
    req.send();

}