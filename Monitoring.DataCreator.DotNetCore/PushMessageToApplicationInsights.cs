using Monitoring.DataCreator.DotNetCore.Contracts;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading.Tasks;

namespace Monitoring.DataCreator.DotNetCore
{
    public class PushMessageToApplicationInsights {
        public void SendRequest(PostBody message) {
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
                    Debug.WriteLine("Request success: ");
                }
                else {
                    Debug.WriteLine("Request fail, please check the detailed error: ");
                }
                Debug.WriteLine(result);

            }
        }
    }
}
