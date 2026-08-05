namespace LearningManagement.Application.Features.Analytics;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LearningManagement.Application.Abstractions;
using System;

public sealed record ClassPerformanceDto(
    string CourseCode,
    double AverageGrade,
    double PassRate,
    int AtRiskCount
);

public sealed record GetClassPerformanceQuery(string FacultyId) : IRequest<IReadOnlyList<ClassPerformanceDto>>;

public sealed class GetClassPerformanceQueryHandler : IRequestHandler<GetClassPerformanceQuery, IReadOnlyList<ClassPerformanceDto>>
{
    private readonly ILearningManagementRepository _repository;

    public GetClassPerformanceQueryHandler(ILearningManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ClassPerformanceDto>> Handle(GetClassPerformanceQuery request, CancellationToken cancellationToken)
    {
        var metrics = await _repository.GetClassPerformanceAsync(request.FacultyId, cancellationToken);
        var dtos = new List<ClassPerformanceDto>();

        foreach (var m in metrics)
        {
            dtos.Add(new ClassPerformanceDto(
                m.CourseCode,
                (double)m.AverageGrade,
                (double)m.PassRate,
                m.AtRiskCount
            ));
        }

        return dtos;
    }
}
