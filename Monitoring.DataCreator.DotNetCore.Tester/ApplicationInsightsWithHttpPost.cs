using Microsoft.VisualStudio.TestTools.UnitTesting;
using Monitoring.DataCreator.DotNetCore.Contracts;
using Monitoring.DataCreator.DotNetCore.Models;
using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;

namespace Monitoring.DataCreator.DotNetCore.Tester
{
    [TestClass]
    public class ApplicationInsightsWithHttpPost
    {
        [TestMethod]
        [TestCategory("ApplicationInsights")]
        [TestCategory("TraceTelemetry")]
        public void SendTraceDataUsingHttpPost()
        {
            PostBody message = new PostBody() { iKey = "" };
            try
            {
                Console.WriteLine("Create Custom Event Data DTO at " + DateTime.Now.ToString());
                message.data.baseData = Traces.CreateTraceData(message.data.baseData, 1, "", "Informational");
                //message.data.baseData.properties.Add("ExecutionTime", DateTime.Now.ToString());
                Console.WriteLine("Send Custom Event Request at " + DateTime.Now.ToString());
                PushMessageToApplicationInsights messenger = new PushMessageToApplicationInsights();
                messenger.SendRequest(message);
            }
            catch (Exception ex)
            {
                
            }

            using (var client = new HttpClient())
            {
                Uri requestUri = new Uri("https://dc.services.visualstudio.com/v2/track");
                MemoryStream stream1 = new MemoryStream();
                DataContractJsonSerializer ser = new DataContractJsonSerializer(typeof(PostBody), new DataContractJsonSerializerSettings()
                {
                    UseSimpleDictionaryFormat = true
                });

                ser.WriteObject(stream1, message);
                stream1.Position = 0;
                StreamReader sr = new StreamReader(stream1);
                HttpResponseMessage response = client.PostAsync(requestUri, new StringContent(sr.ReadToEnd(), Encoding.UTF8, "application/json")).Result;
                string result = response.Content.ReadAsStringAsync().Result;

                if (response.IsSuccessStatusCode)
                {
                    Debug.WriteLine("Request success: ");
                }
                else
                {
                    Debug.WriteLine("Request fail, please check the detailed error: ");
                }
                Debug.WriteLine(result);
            }

        }

    }
    
}
