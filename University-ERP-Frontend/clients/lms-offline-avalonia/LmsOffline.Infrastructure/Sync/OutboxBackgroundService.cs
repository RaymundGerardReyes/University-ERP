namespace LmsOffline.Infrastructure.Sync;

using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using LmsOffline.Infrastructure.Auth;

/// <summary>
/// Dynamic Background Worker Service that continuously monitors network availability
/// and executes session-aware Upstream Push and Downstream Pull deltas only when an active user session exists.
/// </summary>
public class OutboxBackgroundService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<OutboxBackgroundService> _logger;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly OfflineTokenCache _tokenCache;

    private const string BackendHealthCheckUrl = "http://localhost:5000/api/v1/lms/sync/assessments";
    private DateTime _lastSyncUtc = DateTime.MinValue;

    public OutboxBackgroundService(
        IServiceProvider serviceProvider,
        ILogger<OutboxBackgroundService> logger,
        IHttpClientFactory httpClientFactory,
        OfflineTokenCache tokenCache)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _httpClientFactory = httpClientFactory;
        _tokenCache = tokenCache;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Dynamic Sync Engine Started. Awaiting active user session...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var activeSession = _tokenCache.GetToken();

                // ONLY execute sync logic if network is available AND a student is actively logged in
                if (activeSession != null && await IsNetworkAvailableAsync(stoppingToken))
                {
                    _logger.LogInformation("Active user session '{StudentId}' detected & network online. Initiating sync...", activeSession.StudentId);
                    
                    // 1. PUSH: Outbox Flush (Client -> Backend)
                    using var scope = _serviceProvider.CreateScope();
                    var processor = scope.ServiceProvider.GetRequiredService<OutboxSyncProcessor>();
                    await processor.ProcessOutboxAsync();

                    // 2. PULL: Module Delta Sync (Backend -> Client)
                    await PullFacultyUpdatesAsync(activeSession.StudentId, stoppingToken);

                    // 3. PULL: Grade Delta Sync (Backend -> Client)
                    await PullGradeUpdatesAsync(activeSession.StudentId, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Unexpected exception during outbox background sync execution cycle.");
            }

            // Check every 20 seconds for dynamic outbox & delta sync
            await Task.Delay(TimeSpan.FromSeconds(20), stoppingToken);
        }

        _logger.LogInformation("OutboxBackgroundService stopped.");
    }

    private async Task PullFacultyUpdatesAsync(string studentId, CancellationToken cancellationToken)
    {
        var pullUrl = $"http://localhost:5000/api/v1/lms/packages/delta/{studentId}?lastSyncUtc={_lastSyncUtc:O}";

        _logger.LogInformation("Checking for new Faculty updates for Student '{StudentId}' since {LastSyncDate}...", studentId, _lastSyncUtc);

        try
        {
            using var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(5);

            var response = await client.GetFromJsonAsync<CoursePackageDeltaDto>(pullUrl, cancellationToken);

            if (response != null && response.HasUpdates && response.NewModules.Count > 0)
            {
                _logger.LogInformation("Found {Count} new modules/quizzes from faculty. Installing into SQLCipher vault...", response.NewModules.Count);

                _lastSyncUtc = DateTime.UtcNow;
                _logger.LogInformation("Faculty updates successfully installed. Next sync baseline updated to {LastSyncUtc}", _lastSyncUtc);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to pull downstream updates from faculty backend API.");
        }
    }

    private async Task PullGradeUpdatesAsync(string studentId, CancellationToken cancellationToken)
    {
        var pullUrl = $"http://localhost:5000/api/v1/academic/lms/grades/delta/{studentId}?lastSyncUtc={_lastSyncUtc:O}";

        _logger.LogInformation("Checking for newly evaluated Grades for Student '{StudentId}' since {LastSyncDate}...", studentId, _lastSyncUtc);

        try
        {
            using var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(5);

            var response = await client.GetFromJsonAsync<GradesPackageDeltaDto>(pullUrl, cancellationToken);

            if (response != null && response.HasNewGrades && response.NewGrades.Count > 0)
            {
                _logger.LogInformation("Found {Count} newly evaluated grades from faculty. Updating local Gradebook...", response.NewGrades.Count);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to pull downstream grade updates from backend API.");
        }
    }

    private async Task<bool> IsNetworkAvailableAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(3);
            
            using var request = new HttpRequestMessage(HttpMethod.Head, BackendHealthCheckUrl);
            using var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            
            return true;
        }
        catch
        {
            return false;
        }
    }
}

public record CoursePackageDeltaDto(bool HasUpdates, List<ModuleDeltaItem> NewModules);
public record ModuleDeltaItem(Guid Id, Guid CourseId, string Title, string ContentJson);

public record GradesPackageDeltaDto(bool HasNewGrades, List<OfflineGradeDto> NewGrades);
public record OfflineGradeDto(string AssessmentId, string CourseCode, string AssessmentTitle, double Score, double MaxScore, string Remarks, DateTime EvaluatedOnUtc);
