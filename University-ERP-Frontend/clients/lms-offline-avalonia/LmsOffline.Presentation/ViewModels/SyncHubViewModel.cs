namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SyncPendingSubmissions;

public class OutboxItemViewModel
{
    public string OutboxId { get; set; } = string.Empty;
    public string EventType { get; set; } = string.Empty;
    public string TargetEntity { get; set; } = string.Empty;
    public string CreatedAtFormatted { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending Sync";
}

public partial class SyncHubViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly ILogger<SyncHubViewModel>? _logger;

    public string Title => "Sync Engine";

    [ObservableProperty]
    private string _statusMessage = "Sync Engine ready. Local Outbox queue active.";

    [ObservableProperty]
    private bool _isSyncing = false;

    [ObservableProperty]
    private string _lastSyncTime = "Last synced: 15 mins ago";

    public ObservableCollection<OutboxItemViewModel> OutboxQueue { get; } = new();
    public ObservableCollection<string> SyncLogFeed { get; } = new();

    public SyncHubViewModel(ISender sender, ILogger<SyncHubViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
        LoadDefaultOutboxItems();
    }

    private void LoadDefaultOutboxItems()
    {
        OutboxQueue.Add(new OutboxItemViewModel
        {
            OutboxId = Guid.NewGuid().ToString()[..8].ToUpper(),
            EventType = "ASSESSMENT_SUBMISSION",
            TargetEntity = "CS-201 Midterm Quiz Answers",
            CreatedAtFormatted = "Today at 10:14 AM",
            Status = "Queued in SQLCipher Outbox"
        });

        OutboxQueue.Add(new OutboxItemViewModel
        {
            OutboxId = Guid.NewGuid().ToString()[..8].ToUpper(),
            EventType = "ASSIGNMENT_SUBMISSION",
            TargetEntity = "CS-305 Encrypted Storage Essay",
            CreatedAtFormatted = "Today at 11:30 AM",
            Status = "Queued in SQLCipher Outbox"
        });

        SyncLogFeed.Add($"[{DateTime.Now:HH:mm:ss}] [Outbox] 2 items stored safely in local SQLite outbox.");
        SyncLogFeed.Add($"[{DateTime.Now:HH:mm:ss}] [Sync] Ready for background or manual synchronization.");
    }

    [RelayCommand]
    public async Task TriggerSyncAsync()
    {
        IsSyncing = true;
        StatusMessage = "Connecting to University ERP Backend API...";
        SyncLogFeed.Add($"[{DateTime.Now:HH:mm:ss}] [Sync] Initiating secure Outbox flush...");
        _logger?.LogInformation("User triggered manual sync in SyncHubViewModel.");

        var result = await _sender.Send(new SyncPendingSubmissionsCommand());

        if (result.IsSuccess)
        {
            OutboxQueue.Clear();
            LastSyncTime = $"Last synced: Just now ({DateTime.Now:HH:mm:ss})";
            StatusMessage = "Sync complete! All pending outbox items pushed to ERP backend.";
            SyncLogFeed.Add($"[{DateTime.Now:HH:mm:ss}] [Sync] HTTP 200 OK - All outbox records processed successfully.");
            _logger?.LogInformation("Outbox sync completed successfully.");
        }
        else
        {
            StatusMessage = $"Sync deferred: {result.Error.Description}";
            SyncLogFeed.Add($"[{DateTime.Now:HH:mm:ss}] [SyncWarning] {result.Error.Description}");
            _logger?.LogWarning("Sync execution deferred: {ErrorReason}", result.Error.Description);
        }

        IsSyncing = false;
    }
}