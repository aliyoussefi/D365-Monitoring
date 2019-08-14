using FakeXrmEasy;
using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins.UnitTests
{
    public interface IContextBuilder
    {
        IServiceProvider PostOperation();
        IServiceProvider PreOperation();
        IServiceProvider ValidateOperation();


        IOrganizationService PostOperationTest();

    }
    public class ContextBuilder : IContextBuilder
    {
        public ContextBuilder()
        {

        }
        public XrmFakedContext BuildPostOpCreateContext(Guid? correlationId)
        {
            var fakedContext = new XrmFakedContext();
            var wfContext = fakedContext.GetDefaultPluginContext();
            wfContext.MessageName = "Create";
            wfContext.Stage = 40;
            wfContext.CorrelationId = correlationId ?? new Guid();

            return fakedContext;
        }

        public IServiceProvider PostOperation()
        {
            throw new NotImplementedException();
        }

        public IPluginExecutionContext PostOperationTest()
        {
            var fakedContext = new XrmFakedContext();
            var wfContext = fakedContext.GetDefaultPluginContext();
            wfContext.MessageName = "Create";
            wfContext.Stage = 40;
            wfContext.CorrelationId = new Guid();

            return wfContext;
            throw new NotImplementedException();
        }

        public IServiceProvider PreOperation()
        {
            throw new NotImplementedException();
        }

        public IServiceProvider ValidateOperation()
        {
            throw new NotImplementedException();
        }

        IOrganizationService IContextBuilder.PostOperationTest()
        {
            throw new NotImplementedException();
        }
    }
}
