using Dynamics365.Monitoring.Plugins.Contracts;
using Dynamics365.Monitoring.Plugins.Models;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
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
    public class ApplicationInsightsTrackException : IPlugin
    {
        #region prop
        private readonly string _unsecureString;
        private readonly string _secureString;
        private string _instrumentationKey;
        #endregion
        #region ctor
        public ApplicationInsightsTrackException(string unsecureConfig, string secureConfig) {
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
            ILogger logger = (ILogger)serviceProvider.GetService(typeof(ILogger));
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(_unsecureString);
            tracingService.Trace("Loaded Unsecure Configuration XML " + DateTime.Now.ToString());
            _instrumentationKey = GetValueNode(doc, "instrumentationKey");
            try {
                PostBody postBody = new PostBody();
                postBody.iKey = _instrumentationKey;
                tracingService.Trace("Created PostBody with iKey = " + postBody.iKey + " " + DateTime.Now.ToString());
                try {
                    throw new InvalidPluginExecutionException("Test Exception");
                }
                catch (InvalidPluginExecutionException e) {
                    postBody.data.baseData = Exceptions.CreateExceptionEventData(postBody.data.baseData, e, context);
                    tracingService.Trace("Set baseData for Exception Request " + DateTime.Now.ToString());
                    PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
                    messenger.SendRequest(postBody, tracingService, logger);
                    tracingService.Trace("Sent Request " + DateTime.Now.ToString());
                    throw e;
                }

            }
            catch (Exception ex) {
                tracingService.Trace("Caught final exception " + DateTime.Now.ToString());
                throw new InvalidPluginExecutionException(ex.Message);
            }

        }

    }
}
