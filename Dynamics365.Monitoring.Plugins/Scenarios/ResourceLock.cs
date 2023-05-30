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
    public class ResourceLockPlugin : IPlugin {
        public void Execute(IServiceProvider serviceProvider) {
            //https://msdn.microsoft.com/en-us/library/gg509027.aspx
            //When you use the Update method or UpdateRequest message, do not set the OwnerId attribute on a record unless the owner has actually changed.
            //When you set this attribute, the changes often cascade to related entities, which increases the time that is required for the update operation.
            //Extract the tracing service for use in debugging sandboxed plug-ins.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting SendApplicationInsights at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            // Obtain the organization service reference.
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            Entity entity = (Entity)context.InputParameters["Target"];
            //Check to see if this is a create of a new employee booking.
            if (context.MessageName == "Create") {
                QueryExpression query = new QueryExpression();
                query.ColumnSet = new ColumnSet(true);
                query.EntityName = "incident";

                //FilterExpression fe = new FilterExpression();
                //fe.FilterOperator = LogicalOperator.And;
                //ConditionExpression ceArea = new ConditionExpression();
                //ceArea.AttributeName = "msft_areaid";
                //ceArea.Operator = ConditionOperator.Equal;
                //ceArea.Values.Add(((EntityReference)entity.Attributes["msft_areaid"]).Id);

                //fe.AddCondition(ceArea);

                //query.Criteria = new FilterExpression();
                //query.Criteria = fe;
                ////Order by Start Arrival Time ascending
                //query.AddOrder("msft_arrivaltimestart", OrderType.Ascending);
                query.NoLock = false;
                RetrieveMultipleRequest request = new RetrieveMultipleRequest();
                request.Query = query;
                
                tracingService.Trace("Executing the Query for entity {0}", query.EntityName);
                Collection<Entity> entityList = ((RetrieveMultipleResponse)service.Execute(request)).EntityCollection.Entities;
                tracingService.Trace("Returned the Query Response for entity {0}", query.EntityName);
                //Thread.Sleep(180000);
            }
        }
    }
}
