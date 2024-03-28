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
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Extensions.Logging;
using Microsoft.PowerPlatform.Dataverse.Client;
using Microsoft.Rest;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dataverse.Monitoring.Sdk
{
    public class DataLayer
    {
        private ILogger _logger;
        private ServiceClient _serviceClient;
        Guid? _sessionTrackingId;
        ParameterCollection _parameterCollection;
        public DataLayer(ServiceClient client, Guid? sessionTrackingId, ILogger logger)
        {
            _logger = logger;
            _serviceClient = client;
            _sessionTrackingId = sessionTrackingId;
            _parameterCollection = new ParameterCollection();
            _parameterCollection.Add("tag", sessionTrackingId);
        }

        public Guid? WhoAmI()
        {



            // Send a WhoAmI message request to the Organization service to obtain  
            // information about the logged on user.
            WhoAmIResponse resp = (WhoAmIResponse)_serviceClient.Execute(new WhoAmIRequest()
            {
                RequestId = _sessionTrackingId,
                Parameters = _parameterCollection
            });
            Console.WriteLine("\nUser ID is {0}.", resp.UserId);
            _logger.LogInformation(resp.ResponseName + " completed.");       
            // Pause program execution before resource cleanup.
            Console.WriteLine("Press any key to continue.");
            //Console.ReadKey();
            //_serviceClient.Dispose();

            return new Guid();
        }

        public Guid? CreateRecord<T>() where T: Entity{



            // Send a WhoAmI message request to the Organization service to obtain  
            // information about the logged on user.
            WhoAmIResponse resp = (WhoAmIResponse)_serviceClient.Execute(new WhoAmIRequest());
            Console.WriteLine("\nUser ID is {0}.", resp.UserId);

            // Pause program execution before resource cleanup.
            Console.WriteLine("Press any key to continue.");
            Console.ReadKey();
            _serviceClient.Dispose();

            return new Guid();
        }

    }
}
