namespace AnalyticsBI.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class DashboardReport : AggregateRoot<Guid>
{
    public string ReportName { get; private set; } = string.Empty;
    public string DataSourceContext { get; private set; } = string.Empty;
    public string DataPayloadJson { get; private set; } = string.Empty;
    public DateTime GeneratedOnUtc { get; private set; }

    private DashboardReport() { }

    private DashboardReport(Guid id, string reportName, string dataSourceContext, string dataPayloadJson) : base(id)
    {
        ReportName = reportName;
        DataSourceContext = dataSourceContext;
        DataPayloadJson = dataPayloadJson;
        GeneratedOnUtc = DateTime.UtcNow;
    }

    public static Result<DashboardReport> Generate(string reportName, string dataSourceContext, string dataPayloadJson)
    {
        if (string.IsNullOrWhiteSpace(reportName))
            return Result<DashboardReport>.Failure(new Error("Analytics.InvalidName", "Report name is required."));
            
        if (string.IsNullOrWhiteSpace(dataSourceContext))
            return Result<DashboardReport>.Failure(new Error("Analytics.InvalidSource", "Data source context is required."));

        return Result<DashboardReport>.Success(new DashboardReport(Guid.NewGuid(), reportName, dataSourceContext, dataPayloadJson));
    }
}
