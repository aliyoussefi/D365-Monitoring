using System;
using System.Collections.Generic;
using System.Security;
using System.Text.RegularExpressions;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;

namespace Dynamics.Ready.Plugins.UnitTests {
    //[TestClass]
    public class TelemetryTests {
        /// <summary>
        ///  IpAddress
        /// </summary>
        public string IpAddress { get; }
        /// <summary>
        ///  Azure Key
        /// </summary>
        public string AzureKey { get; }

        /// <summary>
        /// Execution Id
        /// </summary>
        public string ExecutionId { get; }

        /// <summary>
        /// Request Id
        /// </summary>
        public string RequestId { get; }

        [TestMethod]
        public void TestAvailabilityTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = ""
            .ToString()
            };

            var properties = new Dictionary<string, string>();
            var metrics = new Dictionary<string, double>();

            properties.Add("ExecutionId", ExecutionId);
            properties.Add("RequestId", RequestId);
            properties.Add("Scalegroup", null);
            properties.Add("Org", null);
            //List<PerformanceMarker> results = new List<PerformanceMarker>();
            //foreach (PerformanceMarker result in results)
            //{
            //    if (metrics.ContainsKey(result.Name))
            //    {
            //        var existingValue = metrics[result.Name];
            //        if (existingValue < (double)result.ExecutionTime)
            //            metrics[result.Name] = (double)result.ExecutionTime;
            //    } else
            //        metrics.Add(result.Name, (double)result.ExecutionTime);
            //}
            AvailabilityTelemetry availability = new AvailabilityTelemetry();
            DateTime dt = DateTime.Now;
            availability.Duration = new TimeSpan(dt.Hour, dt.Minute, dt.Second);
            availability.Id = "TestAvailabilityTelemetry" + Guid.NewGuid().ToString();
            availability.Message = "TestAvailabilityTelemetry Unit Test";
            //availability.Metrics = metrics;
            availability.Name = "TestAvailabilityTelemetry";
            availability.RunLocation = "TelemetryUnitTests.cs";
            availability.Success = true;
            availability.Timestamp = dt;



            telemetry.TrackAvailability(availability);


            telemetry.Flush();
        }

        [TestMethod]
        public void TestDependencyTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };

            for (int i = 0; i < 1000; i++) {
                DependencyTelemetry dependencyTelemetry = new DependencyTelemetry();
                DateTime dt = DateTime.Now;
                dependencyTelemetry.Duration = new TimeSpan(dt.Hour, dt.Minute, dt.Second);
                dependencyTelemetry.Id = "TestDependencyTelemetry" + Guid.NewGuid().ToString();
                dependencyTelemetry.Data = "TestDependencyTelemetry Unit Test";
                //availability.Metrics = metrics;
                dependencyTelemetry.Name = "TestDependencyTelemetry";
                dependencyTelemetry.Type = "Unit Test Assembly";

                dependencyTelemetry.Success = true;
                dependencyTelemetry.Timestamp = dt;


                telemetry.TrackDependency(dependencyTelemetry);
            }

            telemetry.Flush();
        }

        [TestMethod]
        public void TestExceptionTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 100; i++) {
                ExceptionTelemetry exceptionTelemetry = new ExceptionTelemetry();
                DateTime dt = DateTime.Now;
                exceptionTelemetry.Exception = new Exception("I am a custom Unit Test Exception.");
                exceptionTelemetry.ProblemId = "Unit Test Problem Id";
                exceptionTelemetry.SeverityLevel = SeverityLevel.Critical;
                exceptionTelemetry.Timestamp = dt;

                //telemetry.Context.Cloud.RoleName = System.Configuration.ConfigurationManager.AppSettings["OnlineCrmUrl"].ToString();
                //telemetry.Context.User.Id = System.Configuration.ConfigurationManager.AppSettings["OnlineUsername"].ToString();
                //telemetry.Context.Operation.Name = "TestMetricTelemetry Unit TEST";
                //telemetry.Context.Device.OperatingSystem = Environment.OSVersion.ToString();
                //telemetry.Context.User.UserAgent = System.Configuration.ConfigurationManager.AppSettings["BrowserType"].ToString();

                telemetry.TrackException(exceptionTelemetry);
            }
            telemetry.Flush();
        }

        [TestMethod]
        public void TestMetricTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 100; i++) {
                MetricTelemetry metricTelemetry = new MetricTelemetry();
                DateTime dt = DateTime.Now;
                metricTelemetry.Count = 1;
                metricTelemetry.Max = 10;
                metricTelemetry.Min = 0;
                metricTelemetry.Sequence = i.ToString();
                metricTelemetry.Sum = Math.Sqrt(i * 12334);


                telemetry.TrackMetric(metricTelemetry);
            }
            telemetry.Flush();
        }

        [TestMethod]
        public void TestPageViewTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 1000; i++) {
                PageViewTelemetry pageViewTelemetry = new PageViewTelemetry();
                DateTime dt = DateTime.Now;
                pageViewTelemetry.Duration = new TimeSpan(dt.Hour, dt.Minute, dt.Second);
                pageViewTelemetry.Name = "TestPageViewTelemetry";
                pageViewTelemetry.Url = new Uri("Dynamics.Ready.2019.com/UnitTests");
                pageViewTelemetry.Sequence = i.ToString();





                telemetry.TrackPageView(pageViewTelemetry);
            }
            telemetry.Flush();
        }

        [TestMethod]
        public void TestEventTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 1000; i++) {
                EventTelemetry eventTelemetry = new EventTelemetry();
                DateTime dt = DateTime.Now;
                RemoteExecutionContext context = new RemoteExecutionContext();
                eventTelemetry.Name = "TestEventTelemetry";
                //eventTelemetry.Properties.Add(new KeyValuePair<string, string>("", ));
                eventTelemetry.Properties.Add("InitiatingUserId", context.InitiatingUserId.ToString());
                eventTelemetry.Properties.Add("RequestId", context.RequestId.ToString());
                eventTelemetry.Properties.Add("OperationId", context.OperationId.ToString());
                eventTelemetry.Properties.Add("CorrelationId", context.CorrelationId.ToString());
                eventTelemetry.Properties.Add("MessageName", context.MessageName);
                eventTelemetry.Properties.Add("OrganizationId", context.OrganizationId.ToString());
                eventTelemetry.Properties.Add("PrimaryEntityId", context.PrimaryEntityId.ToString());
                eventTelemetry.Properties.Add("Stage", context.Stage.ToString());
                eventTelemetry.Properties.Add("UserId", context.UserId.ToString());
                telemetry.TrackEvent(eventTelemetry);
            }
            telemetry.Flush();
        }

        [TestMethod]
        public void TestRequestTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 1000; i++) {
                RequestTelemetry requestTelemetry = new RequestTelemetry();
                DateTime dt = DateTime.Now;
                requestTelemetry.Duration = new TimeSpan(dt.Hour, dt.Minute, dt.Second);
                requestTelemetry.Name = "TestRequestTelemetry";
                requestTelemetry.Url = new Uri("Dynamics.Ready.2019.com/UnitTests");
                requestTelemetry.Sequence = i.ToString();
                requestTelemetry.ResponseCode = "200";


                telemetry.TrackRequest(requestTelemetry);
            }
            telemetry.Flush();
        }

        [TestMethod]
        public void TestTraceTelemetry() {
            var telemetry = new Microsoft.ApplicationInsights.TelemetryClient {
                InstrumentationKey = "2119853a-bc51-429e-962d-4b7f9cda9a3f"
            .ToString()
            };
            for (int i = 0; i < 1000; i++) {
                TraceTelemetry traceTelemetry = new TraceTelemetry();
                DateTime dt = DateTime.Now;
                traceTelemetry.SeverityLevel = SeverityLevel.Information;
                traceTelemetry.Message = "This is from the TestTraceTelemetry Unit Test";
                traceTelemetry.Sequence = i.ToString();


                //telemetry.Context.Cloud.RoleName = System.Configuration.ConfigurationManager.AppSettings["OnlineCrmUrl"].ToString();
                //telemetry.Context.User.Id = System.Configuration.ConfigurationManager.AppSettings["OnlineUsername"].ToString();
                //telemetry.Context.Operation.Name = "TestTraceTelemetry Unit TEST";
                //telemetry.Context.Device.OperatingSystem = Environment.OSVersion.ToString();
                //telemetry.Context.User.UserAgent = System.Configuration.ConfigurationManager.AppSettings["BrowserType"].ToString();


                telemetry.TrackTrace(traceTelemetry);
            }
            telemetry.Flush();
        }

    }
}
