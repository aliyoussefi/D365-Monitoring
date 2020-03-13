using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Monitoring.DataCreator.DotNetCore.Contracts;

namespace Monitoring.DataCreator.DotNetCore.Models {

    public static class Metrics {
        public static BaseData CreateCustomMetricData(BaseData data) {
            data.metrics = new List<MetricDetails>();
            data.metrics.Add(new MetricDetails() { name = "test", value = 111 });

            return data;
        }
    }
    public static class Exceptions {
        public static BaseData CreateExceptionEventData(BaseData data, Exception ex) {
            data.properties = new Dictionary<string, string>();
            //data.properties.Add("InitiatingUserId", context.InitiatingUserId.ToString());
            //data.properties.Add("RequestId", context.RequestId.ToString());
            //data.properties.Add("OperationId", context.OperationId.ToString());
            //data.properties.Add("CorrelationId", context.CorrelationId.ToString());
            //data.properties.Add("MessageName", context.MessageName);
            //data.properties.Add("OrganizationId", context.OrganizationId.ToString());
            //data.properties.Add("PrimaryEntityId", context.PrimaryEntityId.ToString());
            //data.properties.Add("Stage", context.Stage.ToString());
            //data.properties.Add("UserId", context.UserId.ToString());

            data.exceptions = new List<ExceptionDetails>();
            data.exceptions.Add(new ExceptionDetails() {
                message = ex.Message,
                typeName = ex.GetType().ToString(),
                stack = ex.StackTrace
            });
            return data;
        }
    }
    public static class Events {
        public static BaseData CreateCustomEventData(BaseData data) {
            data.measurements = data.measurements;
            data.properties = new Dictionary<string, string>();
            data.properties.Add("Source", "Plugin");
            //data.properties.Add("InitiatingUserId", context.InitiatingUserId.ToString());
            //data.properties.Add("OperationId", context.OperationId.ToString());
            //data.properties.Add("MessageName", context.MessageName);
            //data.properties.Add("OrganizationId", context.OrganizationId.ToString());
            //data.properties.Add("PrimaryEntityId", context.PrimaryEntityId.ToString());
            //data.properties.Add("Stage", context.Stage.ToString());
            //data.properties.Add("UserId", context.UserId.ToString());
            ////Plugin Trace Log record fields
            //data.properties.Add("TypeName", context.OwningExtension.Name);
            //data.properties.Add("PrimaryEntityName", context.PrimaryEntityName);
            //data.properties.Add("PluginStepId", context.OwningExtension.Id.ToString());
            //data.properties.Add("OperationType", context.GetType().FullName);
            //data.properties.Add("Depth", context.Depth.ToString());
            //data.properties.Add("Synchorous", context.Mode.ToString());
            //data.properties.Add("CorrelationId", context.CorrelationId.ToString());
            //data.properties.Add("RequestId", context.RequestId.ToString());
            return data;
        }
    }

    #region Traces
    public static class Traces
    {
        public static BaseData CreateTraceData(BaseData data, int ver, string message, string severityLevel)
        {
            data.ver = 1;
            data.message = "";
            data.severityLevel = "";
            return data;
        }
    }
    #endregion
}
