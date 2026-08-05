namespace LearningManagement.Application.Features.Assessments;

using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LearningManagement.Application.Abstractions;

public sealed record AssessmentDto(string Id, string Title, DateTime DueDate, int MaxScore);

public sealed record GetAssessmentsQuery() : IRequest<IEnumerable<AssessmentDto>>;

public sealed class GetAssessmentsQueryHandler : IRequestHandler<GetAssessmentsQuery, IEnumerable<AssessmentDto>>
{
    private readonly ILearningManagementRepository _repository;

    public GetAssessmentsQueryHandler(ILearningManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<AssessmentDto>> Handle(GetAssessmentsQuery request, CancellationToken cancellationToken)
    {
        var assessments = await _repository.GetAssessmentsAsync(cancellationToken);
        var dtos = new List<AssessmentDto>();

        foreach (var a in assessments)
        {
            dtos.Add(new AssessmentDto(
                a.Id.ToString(),
                a.Title,
                a.DueDateUtc,
                a.MaxScore
            ));
        }

        return dtos;
    }
}
