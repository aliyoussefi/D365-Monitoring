using Dynamics365.Monitoring.Plugins.Contracts;
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

namespace Dynamics365.Monitoring.Plugins {
    public class PushMessageToApplicationInsights {
        public void SendRequest(PostBody message, ITracingService tracingService, ILogger logger) {
            using (var client = new HttpClient()) {
                Uri requestUri = new Uri("https://dc.services.visualstudio.com/v2/track");
                
                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings() {
                    UseSimpleDictionaryFormat = true
                });

                ser.WriteObject(stream1, message);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;
                string result = response.Content.ReadAsStringAsync().Result;
                logger.LogInformation("Send message to Application Insights", result);
                if (response.IsSuccessStatusCode)
                {
                    Console.WriteLine("Request success: ");

                }
                else
                {
                    Console.WriteLine("Request fail, please check the detailed error: ");
                    logger.LogWarning("Send message to Application Insights failed", result);
                }
                Console.WriteLine(result);

            }
        }
    }
}
