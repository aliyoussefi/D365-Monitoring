using Dynamics365.Monitoring.Plugins.Contracts;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins {
    public class PushMessageToApplicationInsights {
        public void SendRequest(PostBody message, ITracingService tracingService) {
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

                if (response.IsSuccessStatusCode) {
                    tracingService.Trace("Request success: ");
                }
                else {
                    tracingService.Trace("Request fail, please check the detailed error: ");
                }
                tracingService.Trace(result);

            }
        }

        public void SendRequestAsync(PostBody message, ITracingService tracingService, Stopwatch timer)
        {
            using (var client = new HttpClient())
            {
                Uri requestUri = new Uri("https://dc.services.visualstudio.com/v2/track");

                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings()
                {
                    UseSimpleDictionaryFormat = true
                });
                message.data.baseData.properties.Add("ExecutionDuration", timer.ElapsedMilliseconds.ToString());
                ser.WriteObject(stream1, message);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;
                var json1 = @"{""name"":""Microsoft.ApplicationInsights.Dev.7b18b7f7-3daf-4951-abba-8372cf9b21a9.Event"",""time"":""" + DateTime.Now.ToString() + @""",""data"":{""baseType"":""EventData"",""baseData"":{""name"":""sample"",""measurements"":{""measure1"":111,""measure2"":222},""properties"":{""Actual IP"":""192.168.1.1"",""DeveloperMode"":""true"", ""ExecutionDuration"":""" + timer.ElapsedMilliseconds.ToString() + @"""},""ver"":""2""}},""iKey"":""7b18b7f7-3daf-4951-abba-8372cf9b21a9""}";
                HttpResponseMessage responseFaster = client.PostAsync(requestUri, new StringContent(json1, Encoding.UTF8, "application/json")).Result;


                //string result = response.Content.ReadAsStringAsync().Result;

                //if (response.IsSuccessStatusCode)
                //{
                //    tracingService.Trace("Request success: ");
                //}
                //else
                //{
                //    tracingService.Trace("Request fail, please check the detailed error: ");
                //}
                //tracingService.Trace(result);

            }
        }
    }
}
