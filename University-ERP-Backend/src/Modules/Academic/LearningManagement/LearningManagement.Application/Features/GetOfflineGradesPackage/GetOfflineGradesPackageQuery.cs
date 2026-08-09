namespace LearningManagement.Application.Features.GetOfflineGradesPackage;

using MediatR;
using LearningManagement.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTOs to structure the outgoing JSON payload
public sealed record OfflineGradeDto(
    string AssessmentId,
    string CourseCode, 
    string AssessmentTitle, 
    double Score, 
    double MaxScore,
    string Remarks,
    DateTime EvaluatedOnUtc
);

public sealed record GradesPackageDeltaDto(
    bool HasNewGrades,
    IReadOnlyList<OfflineGradeDto> NewGrades
);

// 2. The MediatR Query
public sealed record GetOfflineGradesPackageQuery(
    string StudentId, 
    DateTime LastSyncUtc
) : IRequest<GradesPackageDeltaDto>;

// 3. The Handler
public sealed class GetOfflineGradesPackageQueryHandler : IRequestHandler<GetOfflineGradesPackageQuery, GradesPackageDeltaDto>
{
    private readonly ILearningManagementRepository _repository;

    public GetOfflineGradesPackageQueryHandler(ILearningManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<GradesPackageDeltaDto> Handle(GetOfflineGradesPackageQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Query the repository for any assessments belonging to this student 
        // that were evaluated/graded AFTER their last sync timestamp.
        var newlyGradedAssessments = await _repository.GetStudentGradesUpdatedAfterAsync(
            request.StudentId, 
            request.LastSyncUtc, 
            cancellationToken
        );

        // Step 2: Package the results
        if (newlyGradedAssessments == null || !newlyGradedAssessments.Any())
        {
            // No new grades since the last sync
            return new GradesPackageDeltaDto(false, Array.Empty<OfflineGradeDto>());
        }

        var dtoList = newlyGradedAssessments.Select(g => new OfflineGradeDto(
            g.AssessmentId.ToString(),
            g.CourseCode,
            g.AssessmentTitle,
            g.Score,
            g.MaxScore,
            g.FacultyRemarks ?? "Evaluated. No additional remarks.",
            g.EvaluatedOnUtc
        )).ToList();

        // Step 3: Return the delta payload
        return new GradesPackageDeltaDto(true, dtoList);
    }
}
