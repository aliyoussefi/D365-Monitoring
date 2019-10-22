function initApplicationInsights(formContext) {
    var sdkInstance = "appInsightsSDK"; window[sdkInstance] = "appInsights";
    var aiName = window[sdkInstance], aisdk = window[aiName] || function (e) {
        function n(e) {
        t[e] = function () {
            var n = arguments; t.queue.push(function () {
                t[e].apply(t, n)
            })
        }
        } var t = { config: e };
        t.initialize = !0; var i = document, a = window;
        setTimeout(function () {
            var n = i.createElement("script");
            n.src = e.url || "https://az416426.vo.msecnd.net/scripts/b/ai.2.min.js", i.getElementsByTagName("script")[0].parentNode.appendChild(n)
        }); try { t.cookie = i.cookie } catch (e) { } t.queue = [], t.version = 2; for (var r = ["Event", "PageView", "Exception", "Trace", "DependencyData", "Metric", "PageViewPerformance"]; r.length;)n("track" + r.pop()); n("startTrackPage"), n("stopTrackPage"); var s = "Track" + r[0]; if (n("start" + s), n("stop" + s), n("setAuthenticatedUserContext"), n("clearAuthenticatedUserContext"), n("flush"), !(!0 === e.disableExceptionTracking || e.extensionConfig && e.extensionConfig.ApplicationInsightsAnalytics && !0 === e.extensionConfig.ApplicationInsightsAnalytics.disableExceptionTracking)) { n("_" + (r = "onerror")); var o = a[r]; a[r] = function (e, n, i, a, s) { var c = o && o(e, n, i, a, s); return !0 !== c && t["_" + r]({ message: e, url: n, lineNumber: i, columnNumber: a, error: s }), c }, e.autoExceptionInstrumented = !0 } return t
    }(
        {
            instrumentationKey: "7b18b7f7-3daf-4951-abba-8372cf9b21a9",
            enableAutoRouteTracking: true, //Automatically track route changes in Single Page Applications (SPA). If true, each route change will send a new Pageview to Application Insights.
            isBrowserLinkTrackingEnabled: true //Default is false. If true, the SDK will track all Browser Link requests.
        }
    ); window[aiName] = aisdk, aisdk.queue && 0 === aisdk.queue.length && aisdk.trackPageView({});
}

function compareAi2ToAi0(executionContext) {
    var appInsights0 = window.appInsights0 || function (config) {
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
    window.appInsights0 = appInsights0;
}

function formRibbonTestHarness(primaryControl) {


}

function gridRibbonTestHarness(gridControl) {

}

function testHarness(executionContext) {
    var formContext = executionContext.getFormContext();

}
