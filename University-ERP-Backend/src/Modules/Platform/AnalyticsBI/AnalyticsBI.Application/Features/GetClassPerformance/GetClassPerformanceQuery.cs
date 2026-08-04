namespace AnalyticsBI.Application.Features.GetClassPerformance;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public sealed record ClassPerformanceDto(
    string CourseCode, 
    double AverageGrade, 
    int PassRate, 
    int AtRiskCount
);

public sealed record GetClassPerformanceQuery(string FacultyId) : IRequest<IReadOnlyList<ClassPerformanceDto>>;

public sealed class GetClassPerformanceQueryHandler : IRequestHandler<GetClassPerformanceQuery, IReadOnlyList<ClassPerformanceDto>>
{
    public Task<IReadOnlyList<ClassPerformanceDto>> Handle(GetClassPerformanceQuery request, CancellationToken cancellationToken)
    {
        var mockData = new List<ClassPerformanceDto>
        {
            new("CS-101", 88.5, 95, 2),
            new("CS-305", 76.2, 82, 8)
        };

        return Task.FromResult<IReadOnlyList<ClassPerformanceDto>>(mockData);
    }
}