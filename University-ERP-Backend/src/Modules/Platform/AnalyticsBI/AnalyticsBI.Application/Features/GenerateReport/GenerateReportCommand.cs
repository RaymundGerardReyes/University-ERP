namespace AnalyticsBI.Application.Features.GenerateReport;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using AnalyticsBI.Domain.Aggregates;
using AnalyticsBI.Application.Abstractions;

public sealed record GenerateReportCommand(string ReportName, string DataSourceContext, string DataPayloadJson) : IRequest<Result<Guid>>;

public sealed class GenerateReportCommandHandler : IRequestHandler<GenerateReportCommand, Result<Guid>>
{
    private readonly IAnalyticsRepository _repository;

    public GenerateReportCommandHandler(IAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(GenerateReportCommand request, CancellationToken cancellationToken)
    {
        var reportResult = DashboardReport.Generate(
            request.ReportName, 
            request.DataSourceContext, 
            request.DataPayloadJson);

        if (reportResult.IsFailure)
        {
            return Result<Guid>.Failure(reportResult.Error);
        }

        await _repository.AddAsync(reportResult.Value, cancellationToken);
        return Result<Guid>.Success(reportResult.Value.Id);
    }
}
