using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.PluginTelemetry;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dynamics365.Monitoring.Plugins.Helpers
{
    internal class Logger : ILogger
    {
        private readonly ITracingService _tracingService;
        private readonly Dictionary<string, object> _customProperties = new Dictionary<string, object>();
        public Logger(ITracingService tracingService)
        {
            _tracingService = tracingService;
        }
        public void AddCustomProperty(string propertyName, string propertyValue)
        {
            if (_customProperties.ContainsKey(propertyName)){
                _customProperties.Remove(propertyName);
            }
            _customProperties.Add(propertyName, propertyValue);
        }

        public IDisposable BeginScope<TState>(TState state)
        {
            if (state is Dictionary<string, object> dict)
            {
                _customProperties.Clear();
                foreach (var item in dict)
                {
                    _customProperties.Add(item.Key, item.Value);
                }
            }
            // Consider what to do if state is not the expected type.
            // For example, you might want to log a warning or throw an exception.
            return null; // Ensure you return an appropriate IDisposable object.
        }

        public IDisposable BeginScope(string messageFormat, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void Execute(string activityName, Action action, IEnumerable<KeyValuePair<string, string>> additionalCustomProperties = null)
        {
            throw new NotImplementedException();
        }

        public Task ExecuteAsync(string activityName, Func<Task> action, IEnumerable<KeyValuePair<string, string>> additionalCustomProperties = null)
        {
            throw new NotImplementedException();
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            throw new NotImplementedException();
        }
        #region Log
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
        {
            throw new NotImplementedException();
        }

        public void Log(LogLevel logLevel, EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void Log(LogLevel logLevel, EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void Log(LogLevel logLevel, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void Log(LogLevel logLevel, string message, params object[] args)
        {
            this.Log(((int)logLevel).ToString("D3"), message, args);
        }
        #endregion
        #region Critical
        public void LogCritical(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogCritical(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogCritical(Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogCritical(string message, params object[] args)
        {
            this.Log("CRITICAL", message, args);
        }
        #endregion
        #region Debug
        public void LogDebug(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogDebug(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogDebug(Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogDebug(string message, params object[] args)
        {
            this.Log("DEBUG", message, args);
        }
        #endregion
        #region Error
        public void LogError(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogError(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogError(Exception exception, string message, params object[] args)
        {
            this.LogError(message, args);
            _tracingService.Trace($"{message}:{exception.Message}");
        }

        public void LogError(string message, params object[] args)
        {
            this.Log("ERROR", message, args);
        }
        #endregion
        #region Information
        public void LogInformation(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogInformation(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogInformation(Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogInformation(string message, params object[] args)
        {
            this.Log("INFORMATION", message, args);

        }
        #endregion
        #region Metric
        public void LogMetric(string metricName, long value)
        {
            this.Log("METRIC", metricName + " : " + value);
        }

        public void LogMetric(string metricName, IDictionary<string, string> metricDimensions, long value)
        {
            throw new NotImplementedException();
        }
        #endregion
        #region Trace
        public void LogTrace(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogTrace(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogTrace(Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogTrace(string message, params object[] args)
        {
            this.Log("TRACE", message, args);
        }
        #endregion
        #region Warning
        public void LogWarning(EventId eventId, Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogWarning(EventId eventId, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogWarning(Exception exception, string message, params object[] args)
        {
            throw new NotImplementedException();
        }

        public void LogWarning(string message, params object[] args)
        {
            this.Log("WARNING", message, args);
        }
        #endregion

        private void Log(string level, string message, params object[] args)
        {
            if (_customProperties.Any())
            {
                _tracingService.Trace("======");
                foreach (var item in _customProperties)
                {
                    _tracingService.Trace($"[{level}]: {item.Key} : {item.Value}");
                }
                _tracingService.Trace($"[{level}]: " + message, args);
                _tracingService.Trace("======");
            }
            else
            {
                _tracingService.Trace($"[{level}]: " + message, args);
            }
        }
    }

}
