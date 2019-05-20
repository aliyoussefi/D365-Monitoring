using System;
using System.Collections.Generic;
using Dynamics365.Monitoring.Plugins;
using FakeXrmEasy;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;

namespace Dynamics.Ready.Plugins.UnitTests {
    [TestClass]
    public class UnitTest1 {
        public XrmFakedContext BuildPostOpCreateContext(Guid? correlationId)
        {
            var fakedContext = new XrmFakedContext();
            var wfContext = fakedContext.GetDefaultPluginContext();
            wfContext.MessageName = "Create";
            wfContext.Stage = 40;
            wfContext.CorrelationId = correlationId ?? new Guid();

            return fakedContext;
        }

        [TestMethod]
        public void TestApplicationInsightsPostCreate() {
            string unsecureConfig = null;
            string secureConfig = null;
            var fakedContext = new XrmFakedContext();
            var wfContext = fakedContext.GetDefaultPluginContext();
            wfContext.MessageName = "Create";
            wfContext.Stage = 40;
            wfContext.CorrelationId = new Guid("b374239d-4233-41a9-8b17-a86cb4f737b5");
            Entity accountEntity = new Entity();
            accountEntity.Attributes = new AttributeCollection();
            accountEntity.Attributes.Add(new KeyValuePair<string, object>("branch", "Some Branch"));
            accountEntity.Attributes.Add(new KeyValuePair<string, object>("parentaccountid", new EntityReference("parentaccount", null)));
            //((EntityReference)accountEntity.Attributes["parentaccountid"]).Id = null;

            wfContext.InputParameters = new ParameterCollection();
            wfContext.InputParameters.Add(new KeyValuePair<string, object>("Target", accountEntity));

            var result = fakedContext.ExecutePluginWithConfigurations<ApplicationInsightsPostCreate>(wfContext, unsecureConfig, secureConfig);

        }
    }
}
