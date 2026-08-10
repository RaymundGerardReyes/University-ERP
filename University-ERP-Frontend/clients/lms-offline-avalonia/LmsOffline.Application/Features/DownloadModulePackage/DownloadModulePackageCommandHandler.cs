namespace LmsOffline.Application.Features.DownloadModulePackage;

using System.Threading;
using System.Threading.Tasks;
using System.Net.Http;
using System.Net.Http.Json;
using System.Collections.Generic;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;
using System;

public class DownloadModulePackageCommandHandler : IRequestHandler<DownloadModulePackageCommand, Result<bool>>
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOfflineModuleRepository _moduleRepository;
    private readonly ILocalPackageRepository _packageRepository;
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly IOfflineAssignmentRepository _assignmentRepository;

    public DownloadModulePackageCommandHandler(
        IHttpClientFactory httpClientFactory,
        IOfflineModuleRepository moduleRepository,
        ILocalPackageRepository packageRepository,
        IOfflineAssessmentRepository assessmentRepository,
        IOfflineAssignmentRepository assignmentRepository)
    {
        _httpClientFactory = httpClientFactory;
        _moduleRepository = moduleRepository;
        _packageRepository = packageRepository;
        _assessmentRepository = assessmentRepository;
        _assignmentRepository = assignmentRepository;
    }

    public async Task<Result<bool>> Handle(DownloadModulePackageCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"http://localhost:5191/api/v1/lms/packages/{request.ModuleId}/student/{request.StudentId}", cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var packageDto = await response.Content.ReadFromJsonAsync<ModulePackageDto>(cancellationToken: cancellationToken);
                if (packageDto != null)
                {
                    // Add Course Package
                    var packageResult = CoursePackage.Install(packageDto.CourseCode, packageDto.ModuleTitle, packageDto.VersionManifest, packageDto.SizeInBytes, packageDto.EcdsaSignature);
                    if (packageResult.IsSuccess)
                    {
                        await _packageRepository.AddAsync(packageResult.Value, cancellationToken);
                    }

                    // Add Offline Module
                    var offlineModule = new OfflineModule(packageDto.ModuleId, packageDto.CourseCode, packageDto.ModuleTitle);
                    await _moduleRepository.AddAsync(offlineModule, cancellationToken);

                    // Add Assessments
                    if (packageDto.Assessments != null)
                    {
                        foreach (var a in packageDto.Assessments)
                        {
                            var window = AvailabilityWindow.Create(a.WindowStart.UtcDateTime, a.WindowEnd.UtcDateTime);
                            var assessment = new OfflineAssessment(a.AssessmentId, packageDto.ModuleId, a.Title, window, a.MaxAttempts);
                            await _assessmentRepository.AddAsync(assessment, cancellationToken);
                        }
                    }

                    // Add Assignments
                    if (packageDto.Assignments != null)
                    {
                        foreach (var a in packageDto.Assignments)
                        {
                            var window = AvailabilityWindow.Create(a.WindowStart.UtcDateTime, a.WindowEnd.UtcDateTime);
                            var assignment = new OfflineAssignment(a.AssignmentId, packageDto.ModuleId, packageDto.CourseCode, a.Title, window);
                            await _assignmentRepository.AddAsync(assignment, cancellationToken);
                        }
                    }

                    return Result<bool>.Success(true);
                }
            }

            return Result<bool>.Failure(new Error("PackageDownload.Failed", "Failed to download module package."));
        }
        catch (Exception)
        {
            return Result<bool>.Failure(new Error("PackageDownload.Error", "Network or parsing error."));
        }
    }
}

public sealed record ModulePackageDto(
    Guid ModuleId, 
    string CourseCode, 
    string ModuleTitle, 
    string VersionManifest,
    long SizeInBytes,
    string EcdsaSignature,
    List<AssessmentDto> Assessments, 
    List<AssignmentDto> Assignments);

public sealed record AssessmentDto(Guid AssessmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd, int MaxAttempts);
public sealed record AssignmentDto(Guid AssignmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd);