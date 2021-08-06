using Dynamics365.Monitoring.Plugins.Contracts;
using Dynamics365.Monitoring.Plugins.Models;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;
using System.Xml;


namespace Dynamics365.Monitoring.Plugins
{
    public class ApplicationInsightsTrackCustomEvent : IPlugin
    {
        #region prop
        private readonly string _unsecureString;
        private readonly string _secureString;
        private string _instrumentationKey;
        #endregion
        #region ctor
        public ApplicationInsightsTrackCustomEvent(string unsecureConfig, string secureConfig) {
            _unsecureString = unsecureConfig;
            _secureString = secureConfig;
        }
        #endregion
        #region Helpers


        private string GetValueNode(XmlDocument doc, string key) {
            XmlNode node = doc.SelectSingleNode(String.Format("Settings/setting[@name='{0}']", key));

            if (node != null) {
                return node.SelectSingleNode("value").InnerText;
            }
            return string.Empty;
        }
        #endregion
        public void Execute(IServiceProvider serviceProvider) {
            //https://msdn.microsoft.com/en-us/library/gg509027.aspx
            //When you use the Update method or UpdateRequest message, do not set the OwnerId attribute on a record unless the owner has actually changed.
            //When you set this attribute, the changes often cascade to related entities, which increases the time that is required for the update operation.
            //Extract the tracing service for use in debugging sandboxed plug-ins.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            Microsoft.Xrm.Sdk.PluginTelemetry.ILogger logger = (Microsoft.Xrm.Sdk.PluginTelemetry.ILogger)
                serviceProvider.GetService(typeof(Microsoft.Xrm.Sdk.PluginTelemetry.ILogger));
            XmlDocument doc = new XmlDocument();
            DateTime executionTime = DateTime.Now.ToUniversalTime();
            tracingService.Trace("Parse and Search Unsecure Config at " + DateTime.Now.ToString());
            doc.LoadXml(_unsecureString);
            _instrumentationKey = GetValueNode(doc, "instrumentationKey");
            PostBody postBody = new PostBody() { iKey = _instrumentationKey };
            try {
                logger.IsEnabled(Microsoft.Xrm.Sdk.PluginTelemetry.LogLevel.Information);
                logger.LogInformation("test from ILogger");
                logger.LogTrace("Log Trace");
                logger.LogWarning("Log Trace");
                //logger.LogMetric("testMetric", new long());
                logger.LogError("Log Trace");
                logger.LogCritical("Log Trace");
                tracingService.Trace("Create Custom Event Data DTO at " + DateTime.Now.ToString());
                postBody.data.baseData = Events.CreateCustomEventData(postBody.data.baseData, context);
                postBody.data.baseData.properties.Add("ExecutionTime", executionTime.ToString());
                tracingService.Trace("Send Custom Event Request at " + DateTime.Now.ToString());
                PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
                messenger.SendRequest(postBody, tracingService, logger);
            }
            catch (InvalidPluginExecutionException ex) {
                postBody.data.baseData = Exceptions.CreateExceptionEventData(postBody.data.baseData, ex, context);
                PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
                messenger.SendRequest(postBody, tracingService, logger);
                throw new InvalidPluginExecutionException(ex.Message);
            }

        }

    }
}
