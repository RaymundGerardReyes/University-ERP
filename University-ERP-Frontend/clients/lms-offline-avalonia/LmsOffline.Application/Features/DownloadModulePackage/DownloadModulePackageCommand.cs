namespace LmsOffline.Application.Features.DownloadModulePackage;

using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;

// Internal DTO to match the backend response
internal record ModulePackageResponse(Guid ModuleId, string CourseCode, string ModuleTitle, AssessmentResponse[] Assessments, AssignmentResponse[] Assignments);
internal record AssessmentResponse(Guid AssessmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd, int MaxAttempts);
internal record AssignmentResponse(Guid AssignmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd);

// 1. The Command
public sealed record DownloadModulePackageCommand(Guid ModuleId, Guid StudentId) : IRequest<bool>;

// 2. The Handler
public sealed class DownloadModulePackageCommandHandler : IRequestHandler<DownloadModulePackageCommand, bool>
{
    private readonly IOfflineModuleRepository _moduleRepository;
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly IOfflineAssignmentRepository _assignmentRepository;
    private readonly HttpClient _httpClient;

    public DownloadModulePackageCommandHandler(
        IOfflineModuleRepository moduleRepository,
        IOfflineAssessmentRepository assessmentRepository,
        IOfflineAssignmentRepository assignmentRepository,
        HttpClient httpClient)
    {
        _moduleRepository = moduleRepository;
        _assessmentRepository = assessmentRepository;
        _assignmentRepository = assignmentRepository;
        _httpClient = httpClient;
    }

    public async Task<bool> Handle(DownloadModulePackageCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Fetch package securely from the Backend ERP
            var response = await _httpClient.GetAsync($"http://localhost:5000/api/v1/lms/packages/{request.ModuleId}/student/{request.StudentId}", cancellationToken);
            response.EnsureSuccessStatusCode();

            var package = await response.Content.ReadFromJsonAsync<ModulePackageResponse>(cancellationToken: cancellationToken);
            if (package == null) return false;

            // 2. Map to Domain Aggregate: OfflineModule
            var module = new OfflineModule(package.ModuleId, package.CourseCode, package.ModuleTitle);
            await _moduleRepository.AddAsync(module, cancellationToken);

            // 3. Map to Domain Aggregate: OfflineAssessments
            foreach (var asmnt in package.Assessments)
            {
                var window = AvailabilityWindow.Create(asmnt.WindowStart.UtcDateTime, asmnt.WindowEnd.UtcDateTime);
                var assessment = new OfflineAssessment(asmnt.AssessmentId, package.ModuleId, asmnt.Title, window, asmnt.MaxAttempts);
                await _assessmentRepository.AddAsync(assessment, cancellationToken);
            }

            // 4. Map to Domain Aggregate: OfflineAssignments
            foreach (var asgn in package.Assignments)
            {
                var window = AvailabilityWindow.Create(asgn.WindowStart.UtcDateTime, asgn.WindowEnd.UtcDateTime);
                var assignment = new OfflineAssignment(asgn.AssignmentId, package.ModuleId, asgn.Title, window);
                await _assignmentRepository.AddAsync(assignment, cancellationToken);
            }

            return true;
        }
        catch
        {
            // Log networking or cryptographic errors
            return false;
        }
    }
}