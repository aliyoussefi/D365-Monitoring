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
        private ServiceClient _serviceClient;
        Guid? _sessionTrackingId;
        ParameterCollection _parameterCollection;
        public DataLayer(ServiceClient client, Guid? sessionTrackingId)
        {
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
            Trace.WriteLine("Trace");
            
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
