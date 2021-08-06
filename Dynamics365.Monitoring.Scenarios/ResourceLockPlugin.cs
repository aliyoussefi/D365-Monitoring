using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins {
    public class test1 : IPlugin {
        public void Execute(IServiceProvider serviceProvider) {
            //ITracingService tracingService =
            //    (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            //tracingService.Trace("Starting WorkWithResourceLockPlugin at " + DateTime.Now.ToString());
            //// Obtain the execution context from the service provider.
            //IPluginExecutionContext context = (IPluginExecutionContext)
            //    serviceProvider.GetService(typeof(IPluginExecutionContext));
            //// Obtain the organization service reference.
            //IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            //IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            //Entity entity = (Entity)context.InputParameters["Target"];
            ////Check to see if this is a create of a new employee booking.
            //if (context.MessageName == "Create") {
            //    QueryExpression query = new QueryExpression();
            //    //query.ColumnSet = new ColumnSet(true);
            //    query.EntityName = "incident";
            //    //query.NoLock = false;
            //    RetrieveMultipleRequest request = new RetrieveMultipleRequest();
            //    request.Query = query;
                
            //    tracingService.Trace("Executing the Query for entity {0}", query.EntityName);
            //    Collection<Entity> entityList = ((RetrieveMultipleResponse)service.Execute(request)).EntityCollection.Entities;
            //    tracingService.Trace("Returned the Query Response for entity {0}", query.EntityName);
            //}
        }
    }
}
