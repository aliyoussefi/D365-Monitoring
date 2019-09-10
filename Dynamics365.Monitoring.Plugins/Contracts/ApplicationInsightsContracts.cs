using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins.Contracts {
    #region Contracts

    #region Exceptions
    public class ExceptionsData {
        List<ExceptionDetails> exceptions;
    }
    public class ExceptionDetails {
        public int id;
        public int outerId;
        public string typeName;
        public string message;
        public bool hasFullStack;
        public string stack;
        public List<StackFrame> parsedStack;

    }
    public class StackFrame {
        public int level;
        public string method;
        public string assembly;
        public string fileName;
        public int line;

    }
    #endregion
   
    #region base
    public class BaseData {

        public string name;
        public List<ExceptionDetails> exceptions;
        public Dictionary<string, int> measurements;
        public Dictionary<string, string> properties;
        public List<MetricDetails> metrics;
    }
    public class MetricDetails {
        public string name { get; set; }
        public int value { get; set; }
    }
    public class DataModel {
        public string baseType;
        public BaseData baseData;
    }
    public enum BaseType {
        EventData, ExceptionData, TraceData, DependencyData, MetricData
    }
    #endregion
    public class PostBody {
        public string name;
        public string time;
        public string iKey;
        public DataModel data;


        public PostBody() {
            //Default initialization as an sample
            name = "Microsoft.ApplicationInsights.Dev.applicationInsightsKey.Event";
            iKey = "";
            time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

            data = new DataModel {
                baseType = BaseType.EventData.ToString(),
                baseData = new BaseData {
                    name = "sample",

                    properties = new Dictionary<string, string>()
                        {
                            { "MessageName", ""},
                            { "RequestId", ""},
                            { "UserId", ""},
                            { "PrimaryEntityName", ""},
                            { "OrganizationId", ""},
                            { "Stage", ""},
                            { "OperationId", ""}
                        }
                }
            };

        }

        public PostBody(DataModel dataModel, string instrumentationKey) {
            name = "Microsoft.ApplicationInsights.Dev." + instrumentationKey + ".Event";

            time = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

            data = dataModel;
        }
    }
    #endregion
 
}
