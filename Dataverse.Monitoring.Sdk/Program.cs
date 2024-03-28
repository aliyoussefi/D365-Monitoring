/*
# This Sample Code is provided for the purpose of illustration only and is not intended to be used in a production environment. 
# THIS SAMPLE CODE AND ANY RELATED INFORMATION ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, 
# INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE. 
# We grant You a nonexclusive, royalty-free right to use and modify the Sample Code and to reproduce and distribute the object code form of the Sample Code, provided that. 
# You agree: 
# (i) to not use Our name, logo, or trademarks to market Your software product in which the Sample Code is embedded; 
# (ii) to include a valid copyright notice on Your software product in which the Sample Code is embedded; 
# and (iii) to indemnify, hold harmless, and defend Us and Our suppliers from and against any claims or lawsuits, including attorneys’ fees, that arise or result from the use or distribution of the Sample Code 
*/
using Dataverse.Monitoring.Sdk;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.AspNetCore.Extensions;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using System.Diagnostics;
using System.Threading.Channels;

namespace Dataverse.Monitoring.Sdk
{

    class Program
    {
        /// <summary>
        /// Contains the application's configuration settings. 
        /// </summary>
        IConfiguration Configuration { get; }

        /// <summary>
        /// Constructor. Loads the application configuration settings from a JSON file.
        /// </summary>
        Program()
        {
            // Get the path to the appsettings file. If the environment variable is set,
            // use that file path. Otherwise, use the runtime folder's settings file.
            string? path = Environment.GetEnvironmentVariable("DATAVERSE_APPSETTINGS");
            if (path == null) path = "appsettings.json";

            // Load the app's configuration settings from the JSON file.
            Configuration = new ConfigurationBuilder()
                .AddJsonFile(path, optional: false, reloadOnChange: true)
                .Build();
        }

        static void Main(string[] args)
        {
            Console.WriteLine("Hello, World!");
            Guid g = Guid.NewGuid();
            Console.WriteLine("SessionId will be " + g.ToString());
            Program app = new();
            using var channel = new InMemoryChannel();
            // Add a logger using the 'Logging' configuration section in the
            // appsettings.json file, and send the logs to the console.
            //builder.AddConsole()
            ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
                    builder
                           .AddConfiguration(app.Configuration.GetSection("Logging"))
                           .AddApplicationInsights(
                                configureTelemetryConfiguration: (config) =>
                                    config.ConnectionString = app.Configuration.GetConnectionString("APPLICATIONINSIGHTS_CONNECTION_STRING"),
                                configureApplicationInsightsLoggerOptions: (options) => { })
            //.AddConsole() //This will write all console logs to App Insights
            );
           
            IServiceCollection services = new ServiceCollection();
            //services.AddApplicationInsightsTelemetry(new ApplicationInsightsServiceOptions
            //{
            //    ConnectionString = "InstrumentationKey=00000000-0000-0000-0000-000000000000"
            //});
            TelemetryConfiguration telemetryConfiguration = new TelemetryConfiguration();
            //telemetryConfiguration.TelemetryInitializers.Add(new MyTelemetryInitializer());
            //TelemetryClient telemetryClient = new TelemetryClient(telemetryConfiguration);
            //telemetryClient.Context.Session.Id = g.ToString();
            services.Configure<TelemetryConfiguration>(config => config.TelemetryChannel = channel);
            //services.Configure<TelemetryClient>(config => config.Context.Session.Id = g.ToString()); //This adds the console logs back
            services.AddLogging(builder =>
            {
                // Only Application Insights is registered as a logger provider
                builder.AddApplicationInsights(
                    configureTelemetryConfiguration: (config) => config.ConnectionString = app.Configuration.GetConnectionString("APPLICATIONINSIGHTS_CONNECTION_STRING"),
                    configureApplicationInsightsLoggerOptions: (options) => {}
                    
                );
                //builder.Configure(config => config.ActivityTrackingOptions = ActivityTrackingOptions.SpanId);
                builder.Services.AddSingleton<ITelemetryInitializer, CloudRoleNameTelemetryInitializer>();
            });
            
            services.AddSingleton<ITelemetryInitializer, CloudRoleNameTelemetryInitializer>();
            IServiceProvider serviceProvider = services.BuildServiceProvider();
            ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            logger.BeginScope(new Dictionary<string, object>
            {
                ["CorrelationId"] = g.ToString(),
                ["InitiatingUserId"] = "test",
                ["AdditionalProperties"] = "test"
            });
            
            logger.LogInformation("Logger is working...");


            // Create a Dataverse service client using the default connection string.
            ServiceClient serviceClient = new ServiceClient(
                dataverseConnectionString: app.Configuration.GetConnectionString("default"),
                logger: loggerFactory.CreateLogger<Program>()
                );

            ILogger dataverseLogger = loggerFactory.CreateLogger("Program");
            
            dataverseLogger.LogTrace("Dataverse Logger is working...");
            
            serviceClient.SessionTrackingId = g;
            Debug.WriteLine(g);
            DataLayer dl = new DataLayer(serviceClient, g, logger);
            dl.WhoAmI();
            string[] logs = serviceClient.GetAllLogsAsStringList();
            
            serviceClient.GetAllLogs();
        }
    }
}