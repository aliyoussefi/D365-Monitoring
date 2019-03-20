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
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(_unsecureString);
            _instrumentationKey = GetValueNode(doc, "instrumentationKey");
            try {
                PostBody postBody = new PostBody();
                postBody.iKey = _instrumentationKey;
                try {
                    throw new InvalidPluginExecutionException("Test Exception");
                }
                catch (InvalidPluginExecutionException e) {
                    postBody.data.baseData = Exceptions.CreateExceptionEventData(postBody.data.baseData, e, context);
                    PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
                    messenger.SendRequest(postBody, tracingService);
                }

            }
            catch (Exception ex) {

                throw new InvalidPluginExecutionException(ex.Message);
            }

        }



        //public void SendRequest(BaseType messageType, IPluginExecutionContext context, ITracingService tracingService) {

        //    PostBody postBody = new PostBody();
        //    postBody.iKey = _instrumentationKey;

        //    postBody.data.baseType = messageType.ToString();
        //    switch (postBody.data.baseType) {
        //        case "EventData":
        //            postBody.data.baseData = Events.CreateCustomEventData(postBody.data.baseData, context);
        //            break;
        //        case "ExceptionData":
        //            try {
        //                throw new InvalidPluginExecutionException("Test Exception");
        //            }
        //            catch (InvalidPluginExecutionException e) {
        //                postBody.data.baseData = Exceptions.CreateExceptionEventData(postBody.data.baseData, e, context);
        //            }
        //            break;
        //        case "MetricData":
        //                postBody.data.baseData = Metrics.CreateCustomMetricData(postBody.data.baseData, context);
        //            break;
        //    }

        //    PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
        //    messenger.SendRequest(postBody, tracingService);

        //}

    }
}
