namespace LmsOffline.Application.Features.Grades;

using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using Microsoft.Extensions.Logging;

public record SyncGradesFromBackendCommand(string StudentIdNumber) : IRequest<Result<bool>>;

public class GradesPackageDeltaDto
{
    public bool HasNewGrades { get; set; }
    public List<OfflineGradeDto> NewGrades { get; set; } = new();
}

public class OfflineGradeDto
{
    public string AssessmentId { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string AssessmentTitle { get; set; } = string.Empty;
    public double Score { get; set; }
    public double MaxScore { get; set; }
    public string Remarks { get; set; } = string.Empty;
    public DateTime EvaluatedOnUtc { get; set; }
}

public class SyncGradesFromBackendCommandHandler : IRequestHandler<SyncGradesFromBackendCommand, Result<bool>>
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILocalGradeRepository _gradeRepository;
    private readonly ILogger<SyncGradesFromBackendCommandHandler> _logger;

    public SyncGradesFromBackendCommandHandler(IHttpClientFactory httpClientFactory, ILocalGradeRepository gradeRepository, ILogger<SyncGradesFromBackendCommandHandler> logger)
    {
        _httpClientFactory = httpClientFactory;
        _gradeRepository = gradeRepository;
        _logger = logger;
    }

    public async Task<Result<bool>> Handle(SyncGradesFromBackendCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var client = _httpClientFactory.CreateClient();
            var response = await client.GetAsync($"http://localhost:5191/api/v1/academic/lms/grades/delta/{request.StudentIdNumber}", cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var payload = await response.Content.ReadFromJsonAsync<GradesPackageDeltaDto>(cancellationToken: cancellationToken);
                if (payload != null && payload.HasNewGrades)
                {
                    foreach (var dto in payload.NewGrades)
                    {
                        var grade = new GradeRecord(
                            Guid.Parse(dto.AssessmentId),
                            request.StudentIdNumber,
                            dto.CourseCode,
                            dto.AssessmentTitle,
                            dto.Score,
                            dto.MaxScore,
                            dto.Remarks,
                            dto.EvaluatedOnUtc
                        );
                        await _gradeRepository.UpsertAsync(grade, cancellationToken);
                    }
                    _logger.LogInformation("Grades sync completed successfully.");
                }
                return Result<bool>.Success(true);
            }

            _logger.LogWarning("Grades sync failed. Status code: {StatusCode}", response.StatusCode);
            return Result<bool>.Failure(new Error("GradesSync.Failed", "Failed to sync grades from backend."));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing grades.");
            return Result<bool>.Failure(new Error("GradesSync.Error", "Network or parsing error."));
        }
    }
}
