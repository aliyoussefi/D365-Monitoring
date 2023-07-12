using Dataverse.Monitoring.Sdk;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Xrm.Sdk;
using System.Diagnostics;
using System.Threading.Channels;

namespace PowerPlatform.Dataverse.CodeSamples
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

            Program app = new();
            using var channel = new InMemoryChannel();
            // Add a logger using the 'Logging' configuration section in the
            // appsettings.json file, and send the logs to the console.
            ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
                    builder.AddConsole()
                           .AddConfiguration(app.Configuration.GetSection("Logging"))
                           .AddApplicationInsights(
                                configureTelemetryConfiguration: (config) =>
                                    config.ConnectionString = app.Configuration.GetConnectionString("APPLICATIONINSIGHTS_CONNECTION_STRING"),
                                configureApplicationInsightsLoggerOptions: (options) => { })
            );

            IServiceCollection services = new ServiceCollection();
            
            services.Configure<TelemetryConfiguration>(config => config.TelemetryChannel = channel);
            services.AddLogging(builder =>
            {
                // Only Application Insights is registered as a logger provider
                builder.AddApplicationInsights(
                    configureTelemetryConfiguration: (config) => config.ConnectionString = app.Configuration.GetConnectionString("APPLICATIONINSIGHTS_CONNECTION_STRING"),
                    configureApplicationInsightsLoggerOptions: (options) => {}
                );
            });

            IServiceProvider serviceProvider = services.BuildServiceProvider();
            ILogger<Program> logger = serviceProvider.GetRequiredService<ILogger<Program>>();

            logger.LogInformation("Logger is working...");



            // Create a Dataverse service client using the default connection string.
            ServiceClient serviceClient = new ServiceClient(
                dataverseConnectionString: app.Configuration.GetConnectionString("default"),
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