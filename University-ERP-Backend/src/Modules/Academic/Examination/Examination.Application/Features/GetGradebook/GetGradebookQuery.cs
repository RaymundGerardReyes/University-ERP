namespace Examination.Application.Features.GetGradebook;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Examination.Application.Abstractions;

// 1. DTO perfectly matching the frontend 'StudentGradeRecord' interface
public sealed record StudentGradeRecordDto(
    string StudentId,
    string StudentName,
    double? Prelim,
    double? Midterm,
    double? Final,
    string Status
);

// 2. The MediatR Query
public sealed record GetGradebookQuery(string SectionId) : IRequest<IReadOnlyList<StudentGradeRecordDto>>;

// 3. The Query Handler
public sealed class GetGradebookQueryHandler : IRequestHandler<GetGradebookQuery, IReadOnlyList<StudentGradeRecordDto>>
{
    private readonly IExaminationRepository _repository;

    public GetGradebookQueryHandler(IExaminationRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<StudentGradeRecordDto>> Handle(GetGradebookQuery request, CancellationToken cancellationToken)
    {
        var gradebook = await _repository.GetGradebookBySectionAsync(request.SectionId, cancellationToken);
        var dtos = new List<StudentGradeRecordDto>();

        foreach (var r in gradebook)
        {
            dtos.Add(new StudentGradeRecordDto(
                r.StudentId,
                r.StudentName,
                r.Prelim.HasValue ? (double)r.Prelim.Value : null,
                r.Midterm.HasValue ? (double)r.Midterm.Value : null,
                r.Final.HasValue ? (double)r.Final.Value : null,
                r.Status
            ));
        }

        return dtos;
    }
}