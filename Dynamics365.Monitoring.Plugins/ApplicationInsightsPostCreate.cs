using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace Dynamics365.Monitoring.Plugins {
    public class ApplicationInsightsPostCreate : IPlugin
    {
        #region prop
        private readonly string _unsecureString;
        private readonly string _secureString;
        private string _instrumentationKey;
        #endregion
        #region ctor
        public ApplicationInsightsPostCreate(string unsecureConfig, string secureConfig) {
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
            logger.LogInformation("Creating ITracingService");
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            logger.LogInformation("Created ITracingService", tracingService);
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            logger.LogInformation("Created IPluginExecutionContext", context);
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(_unsecureString);
            _instrumentationKey = GetValueNode(doc, "instrumentationKey");
            
            //logger.LogInformation("Log Information");
            //logger.LogWarning("Log Warning");
            //logger.LogTrace("Log Trace");
            //logger.LogCritical("Log Critical");
            //logger.LogDebug("Log Debug");
            //logger.LogError("Log Error");
            //logger.LogMetric("Log Metric", 10000);
            try
            {
                //Do Sleepy Thread
                SendRequest(BaseType.EventData, context, logger);
                if (context.MessageName == "Create") {
                    Thread.Sleep(3000);
                    SendRequest(BaseType.EventData, context, logger);
                }

                //Do Exception Tracking
                SendRequest(BaseType.ExceptionData, context, logger);
                //Do Parallel Tracking
                HttpWebRequest rtnObject =
                  (HttpWebRequest)WebRequest.Create(@"https://dynamics365andazurefunction.azurewebsites.net/api/ReturnObject?PluginCorrelationId="+ context.CorrelationId);

                rtnObject.KeepAlive = false;

                rtnObject.ContentType = "application/json; charset=utf-8";
                rtnObject.Accept = "application/json";
                rtnObject.Method = "GET";
                HttpWebResponse myHttpWebResponse1 =
                  (HttpWebResponse)rtnObject.GetResponse();
                logger.LogInformation("Log Request to https://dynamics365andazurefunction.azurewebsites.net/api/ReturnObject?PluginCorrelationId=", rtnObject);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, ex.Message);
                throw new InvalidPluginExecutionException(ex.Message);
            }

        }

        public BaseData CreateCustomEventData(BaseData data, IPluginExecutionContext context) {
            data.measurements = new Dictionary<string, int>()
                            {
                            { "depth",context.Depth},
                            { "measure2",222}
                        };
            data.properties = new Dictionary<string, string>();
            data.properties.Add("Source", "Plugin");
            data.properties.Add("InitiatingUserId", context.InitiatingUserId.ToString());
            data.properties.Add("RequestId", context.RequestId.ToString());
            data.properties.Add("OperationId", context.OperationId.ToString());
            data.properties.Add("CorrelationId", context.CorrelationId.ToString());
            data.properties.Add("MessageName", context.MessageName);
            data.properties.Add("OrganizationId", context.OrganizationId.ToString());
            data.properties.Add("PrimaryEntityId", context.PrimaryEntityId.ToString());
            data.properties.Add("Stage", context.Stage.ToString());
            data.properties.Add("UserId", context.UserId.ToString());
            return data;
        }
        public BaseData CreateExceptionEventData(BaseData data, InvalidPluginExecutionException ex,  IPluginExecutionContext context) {
            data.properties = new Dictionary<string, string>();
            data.properties.Add("InitiatingUserId", context.InitiatingUserId.ToString());
            data.properties.Add("RequestId", context.RequestId.ToString());
            data.properties.Add("OperationId", context.OperationId.ToString());
            data.properties.Add("CorrelationId", context.CorrelationId.ToString());
            data.properties.Add("MessageName", context.MessageName);
            data.properties.Add("OrganizationId", context.OrganizationId.ToString());
            data.properties.Add("PrimaryEntityId", context.PrimaryEntityId.ToString());
            data.properties.Add("Stage", context.Stage.ToString());
            data.properties.Add("UserId", context.UserId.ToString());

            data.exceptions = new List<ExceptionDetails>();
            data.exceptions.Add(new ExceptionDetails() {
                message = ex.Message,
                typeName = ex.GetType().ToString(),
                stack = ex.StackTrace
            });
            return data;
        }
        public BaseData CreateCustomMetricData(BaseData data) {
            data.metrics = new List<MetricDetails>();
            data.metrics.Add(new MetricDetails() { name = "test", value = 111 });

            return data;
        }

        public void SendRequest(BaseType messageType, IPluginExecutionContext context, ILogger logger) {
            //PostBody message = new PostBody();
            //message.data = new DataModel();
            //message.data.baseData = 
            //HttpWebRequest rtnObject =
            //  (HttpWebRequest)WebRequest.Create("https://dc.services.visualstudio.com/v2/track");

            //rtnObject.KeepAlive = false;

            //rtnObject.ContentType = "application/json; charset=utf-8";
            //rtnObject.Accept = "application/json";
            //rtnObject.Method = "POST";
            
            ////XmlDocument soapEnvelope = new XmlDocument();
            //WebResponse webResponse;
            //Stream requestStream;
            //Stream responseStream;
            //StreamReader responseReader = null;
            ////Build Request
            //MemoryStream stream1 = new MemoryStream();
            //DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings() {
            //    UseSimpleDictionaryFormat = true
            //});

            //ser.WriteObject(stream1, message);
            ////Get Response
            //requestStream = rtnObject.GetRequestStream();
            //requestStream.Close();
            //webResponse = rtnObject.GetResponse();
            //responseStream = webResponse.GetResponseStream();
            ////read response
            //responseReader = new StreamReader(responseStream);


            //HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;


            //rtnObject.GetResponseAsync();

            //// Assign the response object of HttpWebRequest to a HttpWebResponse variable.
            //HttpWebResponse myHttpWebResponse1 =
            //  (HttpWebResponse)myHttpWebRequest1.GetResponse();


            using (var client = new HttpClient()) {
            
                Uri requestUri = new Uri("https://dc.services.visualstudio.com/v2/track");
                PostBody postBody = new PostBody();
                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings() {
                    UseSimpleDictionaryFormat = true
                });

                //postBody.data.baseType = BaseType.ExceptionData.ToString();
                postBody.data.baseType = messageType.ToString();
                //postBody.data.baseType = BaseType.DependencyData.ToString(); //Doesnt work
                //postBody.data.baseType = BaseType.MetricData.ToString();
                switch (postBody.data.baseType) {
                    case "EventData":
                        postBody.data.baseData = CreateCustomEventData(postBody.data.baseData, context);
                        break;
                    case "ExceptionData":
                        try {
                            throw new InvalidPluginExecutionException("Test Exception");
                        }
                        catch (InvalidPluginExecutionException e) {
                            postBody.data.baseData = CreateExceptionEventData(postBody.data.baseData, e, context);
                        }
                        break;
                    case "MetricData":

                        break;
                }

                ser.WriteObject(stream1, postBody);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;
                string result = response.Content.ReadAsStringAsync().Result;
                logger.LogInformation("Send message to Application Insights", result);
                if (response.IsSuccessStatusCode) {
                    Console.WriteLine("Request success: ");

                }
                else {
                    Console.WriteLine("Request fail, please check the detailed error: ");
                    logger.LogWarning("Send message to Application Insights failed", result);
                }
                Console.WriteLine(result);

            }

        }

        public class ExceptionsData {
            List<ExceptionDetails> exceptions;
        }
        public class ExceptionDetails {
            public int id;
            public int outerId;
            public string typeName;
            public string message;
            public bool hasFullStack;
            public string stack;
            public List<StackFrame> parsedStack;

        }
        public class StackFrame {
            public int level;
            public string method;
            public string assembly;
            public string fileName;
            public int line;

        }
        public class BaseData {

            public string name;
            public List<ExceptionDetails> exceptions;
            public Dictionary<string, int> measurements;
            public Dictionary<string, string> properties;
            public List<MetricDetails> metrics;
        }
        public class MetricDetails {
            public string name { get; set; }
            public int value { get; set; }
        }
        public class DataModel {
            public string baseType;
            public BaseData baseData;
        }
        public enum BaseType {
            EventData, ExceptionData, TraceData, DependencyData, MetricData
        }
        public class PostBody {
            public string name;
            public string time;
            public string iKey;
            public DataModel data;


            public PostBody() {
                //Default initialization as an sample
                name = "Microsoft.ApplicationInsights.Dev.7b18b7f7-3daf-4951-abba-8372cf9b21a9.Event";
                iKey = "";
                time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

                data = new DataModel {
                    baseType = BaseType.EventData.ToString(),
                    baseData = new BaseData {
                        name = "sample",

                        properties = new Dictionary<string, string>()
                            {
                            { "MessageName", ""},
                            { "RequestId", ""},
                            { "UserId", ""},
                            { "PrimaryEntityName", ""},
                            { "OrganizationId", ""},
                            { "Stage", ""},
                            { "OperationId", ""}
                        }
                    }
                };

            }

            public PostBody(DataModel dataModel, string instrumentationKey) {
                name = "Microsoft.ApplicationInsights.Dev." + instrumentationKey + ".Event";

                time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

                data = dataModel;
            }
        }
    }
}
