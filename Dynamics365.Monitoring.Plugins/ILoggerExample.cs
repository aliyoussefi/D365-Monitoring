/*
# This Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. 
# THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, 
# INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE. 
# We grant You a nonexclusive, royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code form of the Sample Code, provided that. 
# You agree: 
# (i) to not use Our name, logo, or trademarks to market Your software product in which the Sample Code is embedded; 
# (ii) to include a valid copyright notice on Your software product in which the Sample Code is embedded; 
# and (iii) to indemnify, hold harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys’ fees, that arise or result from the use or distribution of the Sample Code 
*/
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins {
    public class ILoggerExample : IPlugin {
        public class TestObject
        {
            public string TestProperty { get; set; }
        }
        private readonly string _unsecureString;
        private readonly string _secureString;
        public ILoggerExample(string unsecureConfig, string secureConfig)
        {
            _unsecureString = unsecureConfig;
            _secureString = secureConfig;
        }
        public void Execute(IServiceProvider serviceProvider) {
            //https://msdn.microsoft.com/en-us/library/gg509027.aspx
            //When you use the Update method or UpdateRequest message, do not set the OwnerId attribute on a record unless the owner has actually changed.
            //When you set this attribute, the changes often cascade to related entities, which increases the time that is required for the update operation.
            //Extract the tracing service for use in debugging sandboxed plug-ins.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting ILoggerExample at " + DateTime.Now.ToString());
            ILogger logger = (ILogger)serviceProvider.GetService(typeof(ILogger));
            TestObject testObject = new TestObject();
            testObject.TestProperty = "Demo on " + DateTime.Now.ToString();
            logger.LogInformation("Log Information outside of scope", testObject);

            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            logger.BeginScope(new Dictionary<string, object> { 
                ["CorrelationId"] = context.CorrelationId.ToString(),
                ["InitiatingUserId"] = context.InitiatingUserId.ToString(),
                ["AdditionalProperties"] = testObject
            });
            logger.LogInformation("Log Information", testObject);
            logger.LogWarning("Log Warning");
            logger.LogTrace("Log Trace");
            logger.LogCritical("Log Critical");
            logger.LogDebug("Log Debug");
            logger.LogError("Log Error");
            logger.LogMetric("Log Metric", 10000);

            logger.LogWarning("The person {PersonId} could not be found.", 1);


            logger.AddCustomProperty("CorrelationId", context.CorrelationId.ToString());
            logger.AddCustomProperty("PrimaryEntityId", context.PrimaryEntityId.ToString());
            logger.Log(LogLevel.Information, "LogLevel Information Example");
            
            logger.LogInformation("Within Scope");

            using (HttpClient client = new HttpClient())
            {
                client.Timeout = TimeSpan.FromMilliseconds(15000); //15 seconds
                client.DefaultRequestHeaders.ConnectionClose = true; //Set KeepAlive to false
                client.DefaultRequestHeaders.Add(context.OrganizationName + "_requestId", context.CorrelationId.ToString());
                HttpResponseMessage response = client
                    .GetAsync(_unsecureString)
                    .GetAwaiter()
                    .GetResult(); //Make sure it is synchronous

                response.EnsureSuccessStatusCode();

                string responseText = response.Content
                    .ReadAsStringAsync()
                    .GetAwaiter()
                    .GetResult(); //Make sure it is synchronous

                foreach (KeyValuePair<string, IEnumerable<string>> header in response.Content.Headers)
                {
                    logger.LogInformation(header.Key + " " + header.Value);
                }

                string shortResponseText = responseText.Substring(0, 20);

                logger.LogInformation(shortResponseText);
                tracingService.Trace(shortResponseText);

                string outboundEndMsg = "Outbound call ended successfully";

                logger.LogInformation(outboundEndMsg);
                tracingService.Trace(outboundEndMsg);

            }


        }
    }
}
