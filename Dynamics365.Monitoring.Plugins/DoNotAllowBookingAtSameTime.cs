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
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Serialization.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Xml;

namespace Dynamics365.Monitoring.Plugins {
    public class DoNotAllowBookingAtSameTime : IPlugin
    {

        public void Execute(IServiceProvider serviceProvider) {
            // Create a tracing service to add instrumentation.
            ITracingService tracingService =
                (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            tracingService.Trace("Starting DoNotAllowBookingAtSameTime at " + DateTime.Now.ToString());
            // Obtain the execution context from the service provider.
            IPluginExecutionContext context = (IPluginExecutionContext)
                serviceProvider.GetService(typeof(IPluginExecutionContext));
            // Obtain the organization service reference.
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            try
            {
                //Confirm that the input from the execution pipeline is the right type to work with.
                if (context.InputParameters.Contains("Target") && context.InputParameters["Target"] is Entity) {
                    // Obtain the target entity from the input parameters.
                    Entity entity = (Entity)context.InputParameters["Target"];
                    //Check to see if this is a create of a new employee booking.
                    if (context.MessageName == "Create") {
                        QueryExpression query = new QueryExpression();
                        query.ColumnSet = new ColumnSet(true);
                        query.EntityName = "msft_employeebooking";

                        FilterExpression fe = new FilterExpression();
                        fe.FilterOperator = LogicalOperator.And;
                        ConditionExpression ceArea = new ConditionExpression();
                        ceArea.AttributeName = "msft_areaid";
                        ceArea.Operator = ConditionOperator.Equal;
                        ceArea.Values.Add(((EntityReference)entity.Attributes["msft_areaid"]).Id);

                        ConditionExpression ceFacility = new ConditionExpression();
                        ceFacility.AttributeName = "msft_facilityid";
                        ceFacility.Operator = ConditionOperator.Equal;
                        ceFacility.Values.Add(((EntityReference)entity.Attributes["msft_facilityid"]).Id);

                        //On or After Arrival Start Time
                        ConditionExpression ceStartTime = new ConditionExpression();
                        ceStartTime.AttributeName = "msft_arrivaltimestart";
                        ceStartTime.Operator = ConditionOperator.OnOrAfter;
                        ceStartTime.Values.Add(entity.Attributes["msft_arrivaltimestart"]);

                        //On or before Arrival End Time
                        ConditionExpression ceDepartTime = new ConditionExpression();
                        ceDepartTime.AttributeName = "msft_arrivaltimeend";
                        ceDepartTime.Operator = ConditionOperator.OnOrBefore;
                        ceDepartTime.Values.Add(entity.Attributes["msft_arrivaltimeend"]);

                        fe.AddCondition(ceArea);
                        fe.AddCondition(ceFacility);
                        fe.AddCondition(ceStartTime);
                        fe.AddCondition(ceDepartTime);
                        query.Criteria = new FilterExpression();
                        query.Criteria = fe;
                        //Order by Start Arrival Time ascending
                        query.AddOrder("msft_arrivaltimestart", OrderType.Ascending);

                        RetrieveMultipleRequest request = new RetrieveMultipleRequest();
                        request.Query = query;

                        tracingService.Trace("Executing the Query for entity {0}", query.EntityName);
                        Collection<Entity> entityList = ((RetrieveMultipleResponse)service.Execute(request)).EntityCollection.Entities;
                        tracingService.Trace("Returned the Query Response for entity {0}", query.EntityName);
                        if (entityList.Count > 0) {
                            //Get Area Capacity
                            Entity area = service.Retrieve("msft_area", ((EntityReference)entity.Attributes["msft_areaid"]).Id, new ColumnSet("msft_capacity"));
                            tracingService.Trace(String.Format("Found Area with capacity of {0}", (int)area.Attributes["msft_capacity"]));
                            //Define counter to count current active bookings.
                            int currentBookingsWithinRequest = 0;
                            DateTime requestedStartTime = (DateTime)entity.Attributes["msft_arrivaltimestart"];
                            DateTime requestedDepartTime = (DateTime)entity.Attributes["msft_arrivaltimeend"];
                            foreach (Entity previousBooking in entityList) {
                                //Does the current requested booking start date equal or greater?
                                bool isRequestedStartTimeValid = true;
                                bool isRequestedDepartTimeValid = true;
                                if (requestedStartTime >= (DateTime)previousBooking.Attributes["msft_arrivaltimestart"]) {
                                    //If so, does it start before the depart time of this booking?
                                    if (requestedDepartTime <= (DateTime)previousBooking.Attributes["msft_arrivaltimeend"]) {
                                        tracingService.Trace(String.Format("Found existing arrival time of {0} this matches requested {1}", (DateTime)previousBooking.Attributes["msft_arrivaltimestart"], (DateTime)previousBooking.Attributes["msft_arrivaltimestart"]));
                                        isRequestedStartTimeValid = false;
                                    }
                                }//Is the request depart time later than the previous start time?
                                if (requestedDepartTime > (DateTime)previousBooking.Attributes["msft_arrivaltimestart"]) {
                                    if (requestedStartTime < (DateTime)previousBooking.Attributes["msft_arrivaltimeend"]) {
                                        tracingService.Trace(String.Format("Found existing arrival time of {0} this matches requested {1}", (DateTime)previousBooking.Attributes["msft_arrivaltimestart"], (DateTime)previousBooking.Attributes["msft_arrivaltimestart"]));
                                        isRequestedDepartTimeValid = false;
                                    }
                                    else {
                                    }
                                }
                                if (!isRequestedStartTimeValid || !isRequestedDepartTimeValid) { currentBookingsWithinRequest++; }
                            }
                            //if current bookings are greater than capacity, do not allow.
                            if ((int)area.Attributes["msft_capacity"] <= currentBookingsWithinRequest) { throw new Exception("Unable to book due to max capacity"); }
                        }
                        
                    }
                }

            }
            catch (Exception ex)
            {
                throw new InvalidPluginExecutionException(ex.Message);
            }

        }
    }
}
