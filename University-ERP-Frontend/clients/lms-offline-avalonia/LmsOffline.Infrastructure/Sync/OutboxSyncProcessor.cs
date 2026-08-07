namespace LmsOffline.Infrastructure.Sync;

using System;
using System.Net.Http; // ADDED: Resolves the CS0246 IHttpClientFactory error
using System.Threading.Tasks;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Processes pending outbox items and syncs them to the ERP backend.
/// </summary>
public class OutboxSyncProcessor
{
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly IHttpClientFactory _httpClientFactory;

    public OutboxSyncProcessor(
        IOfflineAssessmentRepository assessmentRepository,
        IHttpClientFactory httpClientFactory)
    {
        _assessmentRepository = assessmentRepository;
        _httpClientFactory = httpClientFactory;
    }

    public async Task ProcessOutboxAsync()
    {
        // Fetch all assessments waiting to be synced
        var pendingAssessments = await _assessmentRepository.GetBySyncStatusAsync(SyncStatus.PendingSync);

        foreach (var assessment in pendingAssessments)
        {
            try
            {
                // Create an HTTP client for making API requests
                using var client = _httpClientFactory.CreateClient();
                
                // (Simulated network call to the University ERP API would go here)
                
                // Mark as synced upon successful API call
                assessment.UpdateSyncStatus(SyncStatus.Synced);
                await _assessmentRepository.SaveAsync(assessment);
            }
            catch (Exception)
            {
                // Mark as a conflict if the network call fails
                assessment.UpdateSyncStatus(SyncStatus.Conflict);
                await _assessmentRepository.SaveAsync(assessment);
            }
        }
    }
}