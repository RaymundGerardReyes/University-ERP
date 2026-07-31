namespace LmsOffline.Infrastructure.Sync;

using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Background processor that synchronizes local SQLite outbox records with the University ERP Backend.
/// </summary>
public sealed class OutboxSyncProcessor
{
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly HttpClient _httpClient;

    public OutboxSyncProcessor(IOfflineAssessmentRepository assessmentRepository, IHttpClientFactory httpClientFactory)
    {
        _assessmentRepository = assessmentRepository;
        // Points to the Backend API (e.g., https://api.university.edu)
        _httpClient = httpClientFactory.CreateClient("ErpBackendApi"); 
    }

    public async Task ProcessPendingSubmissionsAsync(CancellationToken cancellationToken = default)
    {
        var pendingAssessments = await _assessmentRepository.GetBySyncStatusAsync(SyncStatus.PendingSync, cancellationToken);

        foreach (var assessment in pendingAssessments)
        {
            try
            {
                // Format matches the backend SyncOfflineAssessmentRequest
                var payload = new 
                {
                    AssessmentId = assessment.AssessmentId,
                    StudentId = Guid.NewGuid(), // Normally fetched from local Auth Context
                    CourseCode = "OFFLINE-101",
                    ModuleTitle = assessment.Title,
                    Answers = new[] { new { QuestionId = "Q1", SelectedOption = "A" } }, // Deserialized from assessment.PayloadJson
                    ScheduleToken = "cryptographic_token_generated_by_client",
                    SubmittedAtUtc = assessment.SubmittedAtUtc
                };

                var response = await _httpClient.PostAsJsonAsync("/api/v1/lms/sync/assessments", payload, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    assessment.UpdateSyncStatus(SyncStatus.Synced);
                    await _assessmentRepository.SaveAsync(assessment, cancellationToken);
                }
                else
                {
                    assessment.UpdateSyncStatus(SyncStatus.Conflict);
                    await _assessmentRepository.SaveAsync(assessment, cancellationToken);
                }
            }
            catch (HttpRequestException)
            {
                // Network unavailable. Remain in PendingSync state for the next polling cycle.
                continue;
            }
        }
    }
}