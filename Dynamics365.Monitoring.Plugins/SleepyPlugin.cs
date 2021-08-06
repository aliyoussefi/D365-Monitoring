﻿using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins {
    public class SleepyPlugin : IPlugin {
        public class TestObject
        {
            public string TestProperty { get; set; }
        }
        public void Execute(IServiceProvider serviceProvider) {
            //https://msdn.microsoft.com/en-us/library/gg509027.aspx
            //When you use the Update method or UpdateRequest message, do not set the OwnerId attribute on a record unless the owner has actually changed.
            //When you set this attribute, the changes often cascade to related entities, which increases the time that is required for the update operation.
            //Extract the tracing service for use in debugging sandboxed plug-ins.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            TestObject testObject = new TestObject();
            testObject.TestProperty = "Demo on " + DateTime.Now.ToString();
            ILogger logger = (ILogger)serviceProvider.GetService(typeof(ILogger));
            logger.LogInformation("Log Information", testObject);
            logger.LogWarning("Log Warning");
            logger.LogTrace("Log Trace");
            logger.LogCritical("Log Critical");
            logger.LogDebug("Log Debug");
            logger.LogError("Log Error");
            logger.LogMetric("Log Metric", 10000);
            
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            Thread.Sleep(180000);
        }
    }
}
