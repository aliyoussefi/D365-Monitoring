using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Extensibility;

namespace Dynamics365.Monitoring.AzureFunctions
{
    public class MonitorWithApplicationInsightsExample
    {
        private readonly TelemetryClient telemetryClient;

        /// Using dependency injection will guarantee that you use the same configuration for telemetry collected automatically and manually.
        //public MonitorWithApplicationInsightsExample(TelemetryConfiguration telemetryConfiguration)
        //{
        //    this.telemetryClient = new TelemetryClient(telemetryConfiguration);
        //    this.telemetryClient.TrackTrace("MonitorWithApplicationInsightsExample constructor called. Using injected TelemetryConfiguration");
        //}

        public MonitorWithApplicationInsightsExample()
        {
            string key = System.Environment.GetEnvironmentVariable(
                "APPINSIGHTS_INSTRUMENTATIONKEY", EnvironmentVariableTarget.Process);
            this.telemetryClient = new TelemetryClient();
            this.telemetryClient.InstrumentationKey = key;
            this.telemetryClient.TrackTrace("MonitorWithApplicationInsightsExample constructor called. Using Environment Variable APPINSIGHTS_INSTRUMENTATIONKEY to get Application Insights Key");
        }

        [FunctionName("MonitorWithApplicationInsightsExample")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            telemetryClient.TrackTrace("MonitorWithApplicationInsightsExample Function called.");
            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;
            telemetryClient.TrackTrace("MonitorWithApplicationInsightsExample Function ended. Returning " + $"Hello, {name}");
            return name != null
                ? (ActionResult)new OkObjectResult($"Hello, {name}")
                : new BadRequestObjectResult("Please pass a name on the query string or in the request body");
        }
    }
}
