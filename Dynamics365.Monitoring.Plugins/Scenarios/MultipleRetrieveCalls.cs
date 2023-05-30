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
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins {
    public class MultipleRetrieveCalls : IPlugin {
        public class TestObject
        {
            public string TestProperty { get; set; }
        }
        private readonly string _unsecureString;
        private readonly string _secureString;
        public MultipleRetrieveCalls(string unsecureConfig, string secureConfig)
        {
            _unsecureString = unsecureConfig;
            _secureString = secureConfig;
        }
        public void Execute(IServiceProvider serviceProvider) {
            //https://msdn.microsoft.com/en-us/library/gg509027.aspx
            //When you use the Update method or UpdateRequest message, do not set the OwnerId attribute on a record unless the owner has actually changed.
            //When you set this attribute, the changes often cascade to related entities, which increases the time that is required for the update operation.
            //Extract the tracing service for use in debugging sandboxed plug-ins.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting ILoggerExample at " + DateTime.Now.ToString());
            ILogger logger = (ILogger)serviceProvider.GetService(typeof(ILogger));
            TestObject testObject = new TestObject();
            testObject.TestProperty = "Demo on " + DateTime.Now.ToString();
            logger.LogInformation("Log Information outside of scope", testObject);

            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));

            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);


            logger.BeginScope(new Dictionary<string, object> { 
                ["CorrelationId"] = context.CorrelationId.ToString(),
                ["InitiatingUserId"] = context.InitiatingUserId.ToString(),
                ["AdditionalProperties"] = testObject
            });
            logger.LogInformation("Log Information", testObject);
            logger.LogWarning("Log Warning");
            logger.LogTrace("Log Trace");
            logger.LogCritical("Log Critical");
            logger.LogDebug("Log Debug");
            logger.LogError("Log Error");
            logger.LogMetric("Log Metric", 10000);

            logger.LogWarning("The person {PersonId} could not be found.", 1);
            // Query using the paging cookie.
            // Define the paging attributes.
            // The number of records per page to retrieve.
            int queryCount = 3;

            // Initialize the page number.
            int pageNumber = 1;

            // Initialize the number of records.
            int recordCount = 0;

            // Define the condition expression for retrieving records.




            
            logger.LogInformation("Within Scope");
            try
            {
                // Create the query expression and add condition.
                var pagequery = new QueryExpression();
                pagequery.EntityName = "account";
                pagequery.ColumnSet = new ColumnSet(true);

                // Assign the pageinfo properties to the query expression.
                pagequery.PageInfo = new PagingInfo();
                pagequery.PageInfo.Count = queryCount;
                pagequery.PageInfo.PageNumber = pageNumber;
                service.RetrieveMultiple(pagequery);

                pagequery.EntityName = "contact";
                service.RetrieveMultiple(pagequery);

                pagequery.EntityName = "account";
                service.RetrieveMultiple(pagequery);

                pagequery.EntityName = "contact";
                service.RetrieveMultiple(pagequery);

                logger.AddCustomProperty("CorrelationId", context.CorrelationId.ToString());
                logger.AddCustomProperty("PrimaryEntityId", context.PrimaryEntityId.ToString());
                logger.Log(LogLevel.Information, "LogLevel Information Example");
            }
            catch (Exception e)
            {
                string errMsg = "Plugin failed";
                logger.LogError(e, errMsg);
                tracingService.Trace($"{errMsg}:{e.Message}");
                throw new InvalidPluginExecutionException(e.Message, e);
            }



        }
    }
}
