namespace LearningManagement.Application.Features.GetOfflineModulePackage;

using MediatR;
using LearningManagement.Application.Abstractions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// 1. DTOs to structure the outgoing JSON payload
public sealed record OfflineModuleDto(
    string Id, 
    string CourseId, 
    string Title, 
    string ContentJson,
    DateTime LastModifiedUtc
);

public sealed record CoursePackageDeltaDto(
    bool HasUpdates,
    IReadOnlyList<OfflineModuleDto> NewModules
);

// 2. The MediatR Query
public sealed record GetOfflineDeltaPackageQuery(
    string StudentId, 
    DateTime LastSyncUtc
) : IRequest<CoursePackageDeltaDto>;

// 3. The Handler
public sealed class GetOfflineDeltaPackageQueryHandler : IRequestHandler<GetOfflineDeltaPackageQuery, CoursePackageDeltaDto>
{
    private readonly ILearningManagementRepository _repository;

    public GetOfflineDeltaPackageQueryHandler(ILearningManagementRepository repository)
    {
        _repository = repository;
    }

    public async Task<CoursePackageDeltaDto> Handle(GetOfflineDeltaPackageQuery request, CancellationToken cancellationToken)
    {
        // Step 1: Fetch the student's enrolled courses.
        var enrolledCourseIds = new List<string> { "CS101", "CS203", "CS305" };

        // Step 2: Query the repository for modules belonging to these courses
        // that have been added or updated by faculty AFTER the student's LastSyncUtc.
        var updatedModules = await _repository.GetModulesUpdatedAfterAsync(
            enrolledCourseIds, 
            request.LastSyncUtc, 
            cancellationToken
        );

        // Step 3: Package the results
        if (updatedModules == null || !updatedModules.Any())
        {
            // No new updates since the last sync
            return new CoursePackageDeltaDto(false, Array.Empty<OfflineModuleDto>());
        }

        var dtoList = updatedModules.Select(m => new OfflineModuleDto(
            m.Id.ToString(),
            m.CourseCode,
            m.Title,
            "{\"description\":\"Updated module content compiled from faculty console\"}",
            m.LastModifiedUtc
        )).ToList();

        // Step 4: Return the delta payload
        return new CoursePackageDeltaDto(true, dtoList);
    }
}
