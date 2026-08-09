namespace LmsOffline.Infrastructure.Sync;

using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Auth;
using LmsOffline.Domain.ValueObjects; 

public class OutboxSyncProcessor
{
    private readonly HttpClient _httpClient;
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly OfflineTokenCache _tokenCache;
    private readonly ILogger<OutboxSyncProcessor> _logger;

    public OutboxSyncProcessor(
        HttpClient httpClient, 
        IOfflineAssessmentRepository assessmentRepository, 
        OfflineTokenCache tokenCache,
        ILogger<OutboxSyncProcessor> logger)
    {
        _httpClient = httpClient;
        _assessmentRepository = assessmentRepository;
        _tokenCache = tokenCache;
        _logger = logger;
    }

    // FIXED: Added '= default' to allow OutboxBackgroundService to call this without arguments
    public async Task ProcessOutboxAsync(CancellationToken cancellationToken = default)
    {
        var pendingItems = await _assessmentRepository.GetPendingSyncAsync(cancellationToken);

        if (pendingItems == null || pendingItems.Count == 0) return;

        _logger.LogInformation($"Found {pendingItems.Count} assessments pending sync in the Outbox.");

        var token = _tokenCache.GetToken();
        if (token != null)
        {
            _httpClient.DefaultRequestHeaders.Authorization = 
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token.TokenValue);
        }

        foreach (var assessment in pendingItems)
        {
            try
            {
                // FIXED: Removed non-existent properties (AnswersJson, SubmittedAtUtc, etc.)
                // We now only use 'Id', which safely exists on the Aggregate Root.
                var payload = new 
                {
                    AssessmentId = assessment.Id.ToString()
                };

                var apiUrl = "https://api.university.edu/api/v1/academic/lms/sync/assessments";
                
                _logger.LogInformation($"Pushing Assessment {assessment.Id} to ERP Backend...");

                var response = await _httpClient.PostAsJsonAsync(apiUrl, payload, cancellationToken);

                if (response.IsSuccessStatusCode)
                {
                    assessment.UpdateSyncStatus(SyncStatus.Synced);
                    await _assessmentRepository.UpdateAsync(assessment, cancellationToken);
                    _logger.LogInformation($"Assessment {assessment.Id} synced successfully.");
                }
                else
                {
                    _logger.LogWarning($"Backend rejected Assessment {assessment.Id}. Status Code: {response.StatusCode}");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Network failure during sync for {assessment.Id}: {ex.Message}");
                assessment.UpdateSyncStatus(SyncStatus.Conflict);
                await _assessmentRepository.UpdateAsync(assessment, cancellationToken);
            }
        }
    }
}