namespace Examination.Application.Features.GetGradebook;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

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
    public Task<IReadOnlyList<StudentGradeRecordDto>> Handle(GetGradebookQuery request, CancellationToken cancellationToken)
    {
        // In a production scenario, we query the IExaminationRepository to fetch 
        // the Examination Aggregates for the requested SectionId.
        
        // Supplying the exact mock structure required by the UI for seamless integration
        var gradebook = new List<StudentGradeRecordDto>
        {
            new("STU-001", "Alex Morgan", 92, 88, null, "Pending"),
            new("STU-002", "James Chen", 85, null, null, "Incomplete"),
            new("STU-003", "Sarah Jenkins", 95, 94, 96, "Graded")
        };

        return Task.FromResult<IReadOnlyList<StudentGradeRecordDto>>(gradebook);
    }
}