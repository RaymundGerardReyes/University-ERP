namespace LearningManagement.Application.Features.GetOfflineModulePackage;

using MediatR;

// DTOs for the secure offline payload
public sealed record OfflineAssessmentDto(Guid AssessmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd, int MaxAttempts);
public sealed record OfflineAssignmentDto(Guid AssignmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd);
public sealed record ModulePackageDto(Guid ModuleId, string CourseCode, string ModuleTitle, IReadOnlyList<OfflineAssessmentDto> Assessments, IReadOnlyList<OfflineAssignmentDto> Assignments);

public sealed record GetOfflineModulePackageQuery(Guid ModuleId, Guid StudentId) : IRequest<ModulePackageDto>;

public sealed class GetOfflineModulePackageQueryHandler : IRequestHandler<GetOfflineModulePackageQuery, ModulePackageDto>
{
    public Task<ModulePackageDto> Handle(GetOfflineModulePackageQuery request, CancellationToken cancellationToken)
    {
        // In a real application, this would query the core LMS tables to build the package for the specific student.
        // We are generating a secure mock package here to fulfill the DBMA pattern.
        var mockPackage = new ModulePackageDto(
            request.ModuleId,
            "CS-305",
            "Database Management & DBMA",
            new List<OfflineAssessmentDto> 
            {
                new(Guid.NewGuid(), "Midterm Exam (Offline)", DateTimeOffset.UtcNow.AddDays(-1), DateTimeOffset.UtcNow.AddDays(2), 1)
            },
            new List<OfflineAssignmentDto>
            {
                new(Guid.NewGuid(), "Architecture Essay", DateTimeOffset.UtcNow.AddDays(-1), DateTimeOffset.UtcNow.AddDays(7))
            }
        );

        return Task.FromResult(mockPackage);
    }
}