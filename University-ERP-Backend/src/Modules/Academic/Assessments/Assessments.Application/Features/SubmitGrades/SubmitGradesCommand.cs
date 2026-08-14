namespace Assessments.Application.Features.SubmitGrades;

using MediatR;
using SharedKernel.Domain.Primitives;
using Assessments.Application.Abstractions;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// Expected payload from the frontend assessments API
public sealed record StudentGradePayload(string Prelim, string Midterm, string Final);

public sealed record SubmitGradesCommand(
    string SectionId, 
    Dictionary<string, StudentGradePayload> Grades
) : IRequest<Result<bool>>;

public sealed class SubmitGradesCommandHandler : IRequestHandler<SubmitGradesCommand, Result<bool>>
{
    private readonly IGradebookRepository _repository;

    public SubmitGradesCommandHandler(IGradebookRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(SubmitGradesCommand request, CancellationToken cancellationToken)
    {
        var gradebook = await _repository.GetBySectionIdAsync(request.SectionId, cancellationToken);
        
        if (gradebook == null)
        {
            return Result<bool>.Failure(new Error("Assessments.NotFound", "Gradebook not found for the specified section."));
        }

        // Map the DTO payloads to strict decimal final grades for the domain aggregate
        var finalGrades = new Dictionary<string, decimal>();
        foreach (var entry in request.Grades)
        {
            if (decimal.TryParse(entry.Value.Final, out decimal finalGrade))
            {
                finalGrades.Add(entry.Key, finalGrade);
            }
        }

        var result = gradebook.SubmitOfficialGrades(finalGrades);

        if (result.IsSuccess)
        {
            await _repository.UpdateAsync(gradebook, cancellationToken);
        }

        return result;
    }
}
