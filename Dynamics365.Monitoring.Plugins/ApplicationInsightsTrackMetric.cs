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
    public class ApplicationInsightsTrackMetric : IPlugin
    {
        #region prop
        private readonly string _unsecureString;
        private readonly string _secureString;
        private string _instrumentationKey;
        #endregion
        #region ctor
        public ApplicationInsightsTrackMetric(string unsecureConfig, string secureConfig) {
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
                //SendMetric
                SendRequest(BaseType.MetricData, context, tracingService);
            }
            catch (Exception ex) {

                throw new InvalidPluginExecutionException(ex.Message);
            }

        }



        public void SendRequest(BaseType messageType, IPluginExecutionContext context, ITracingService tracingService) {
            using (var client = new HttpClient()) {

                Uri requestUri = new Uri("https://dc.services.visualstudio.com/v2/track");
                PostBody postBody = new PostBody();
                postBody.iKey = _instrumentationKey;
                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings() {
                    UseSimpleDictionaryFormat = true
                });
                postBody.data.baseType = messageType.ToString();
                switch (postBody.data.baseType) {
                    case "EventData":
                        postBody.data.baseData = Events.CreateCustomEventData(postBody.data.baseData, context);
                        break;
                    case "ExceptionData":
                        try {
                            throw new InvalidPluginExecutionException("Test Exception");
                        }
                        catch (InvalidPluginExecutionException e) {
                            postBody.data.baseData = Exceptions.CreateExceptionEventData(postBody.data.baseData, e, context);
                        }
                        break;
                    case "MetricData":
                            postBody.data.baseData = Metrics.CreateCustomMetricData(postBody.data.baseData, context);
                        break;
                }

                ser.WriteObject(stream1, postBody);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;
                string result = response.Content.ReadAsStringAsync().Result;

                if (response.IsSuccessStatusCode) {
                    tracingService.Trace("Request success: ");
                }
                else {
                    tracingService.Trace("Request fail, please check the detailed error: ");
                }
                tracingService.Trace(result);

            }

        }

    }
}
