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
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.PowerPlatform.Dataverse.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Dataverse.Monitoring.Sdk.DotNetFramework
{
    internal class Program
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
            //string path = Environment.GetEnvironmentVariable("DATAVERSE_APPSETTINGS");
            //if (path == null) path = "App.config";

            //// Load the app's configuration settings from the JSON file.
            //Configuration = new ConfigurationBuilder()
            //    .AddJsonFile(path, optional: false, reloadOnChange: true)
            //    .Build();
        }
        static void Main(string[] args)
        {
                Console.WriteLine("Hello, World!");

                Program app = new Program();
                var channel = new InMemoryChannel();


            // Add a logger using the 'Logging' configuration section in the
            // appsettings.json file, and send the logs to the console.
            ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
                        builder.AddConsole()
                               //.AddConfiguration(app.Configuration.GetSection("Logging"))
                               .AddApplicationInsights(
                                    configureTelemetryConfiguration: (config) =>
                                        config.ConnectionString = System.Configuration.ConfigurationManager.AppSettings["APPLICATIONINSIGHTS_CONNECTION_STRING"],
                                    configureApplicationInsightsLoggerOptions: (options) => { })
                );

                IServiceCollection services = new ServiceCollection();

                services.Configure<TelemetryConfiguration>(config => config.TelemetryChannel = channel);
                services.AddLogging(builder =>
                {
                    // Only Application Insights is registered as a logger provider
                    builder.AddApplicationInsights(
                        configureTelemetryConfiguration: (config) => config.ConnectionString = System.Configuration.ConfigurationManager.AppSettings["APPLICATIONINSIGHTS_CONNECTION_STRING"],
                        configureApplicationInsightsLoggerOptions: (options) => { }
                    );
                });

                IServiceProvider serviceProvider = services.BuildServiceProvider();
                ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

                logger.LogInformation("Logger is working...");



                // Create a Dataverse service client using the default connection string.
                ServiceClient serviceClient = new ServiceClient(
                    dataverseConnectionString: System.Configuration.ConfigurationManager.AppSettings["default"],
                    logger: loggerFactory.CreateLogger<Program>());

                ILogger dataverseLogger = loggerFactory.CreateLogger("traces");

                logger.LogInformation("Logger is working...");
                dataverseLogger.LogInformation("Dataverse Logger is working...");
                Guid g = Guid.NewGuid();
                serviceClient.SessionTrackingId = g;
                Debug.WriteLine(g);
                DataLayer dl = new DataLayer(serviceClient, g);
                dl.WhoAmI();
                string[] logs = serviceClient.GetAllLogsAsStringList();

                serviceClient.GetAllLogs();
            
        }
    }
}
