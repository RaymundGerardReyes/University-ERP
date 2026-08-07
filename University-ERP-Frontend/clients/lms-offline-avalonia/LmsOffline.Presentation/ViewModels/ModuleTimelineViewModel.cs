namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SyncPendingSubmissions;
using LmsOffline.Application.Features.DownloadModulePackage;

public partial class ModuleTimelineViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly ILogger<ModuleTimelineViewModel>? _logger;

    public string Title => "Module Progression Timeline";

    [ObservableProperty]
    private string _syncStatusMessage = "Module timeline loaded. All offline windows verified.";

    [ObservableProperty]
    private string _currentModuleName = "CS-201: Object-Oriented Programming & Design Patterns";

    [ObservableProperty]
    private string _availabilityWindowText = "Enforced Window: 2026-08-01 00:00:00 UTC to 2026-08-31 23:59:59 UTC";

    public ModuleTimelineViewModel(ISender sender, ILogger<ModuleTimelineViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
    }

    [RelayCommand]
    public async Task SyncNowAsync()
    {
        SyncStatusMessage = "Attempting to sync outbox with University ERP Backend...";
        _logger?.LogInformation("SyncNow command initiated from ModuleTimelineViewModel.");

        var command = new SyncPendingSubmissionsCommand();
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            SyncStatusMessage = "Sync complete! All pending submissions pushed to ERP backend.";
            _logger?.LogInformation("Module timeline outbox sync succeeded.");
        }
        else
        {
            SyncStatusMessage = $"Sync deferred: {result.Error.Description}";
            _logger?.LogWarning("Module timeline outbox sync failed: {Error}", result.Error.Description);
        }
    }

    [RelayCommand]
    public async Task DownloadPackageAsync()
    {
        SyncStatusMessage = "Downloading encrypted module package bundle...";
        _logger?.LogInformation("DownloadPackage command initiated from ModuleTimelineViewModel.");

        var command = new DownloadModulePackageCommand(
            ModuleId: Guid.NewGuid(), 
            StudentId: Guid.NewGuid()
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            SyncStatusMessage = "Package downloaded successfully. SQLCipher database schema updated.";
            _logger?.LogInformation("Offline module package download completed successfully.");
        }
        else
        {
            SyncStatusMessage = $"Download failed: {result.Error.Description}";
            _logger?.LogError("Offline module package download failed: {Error}", result.Error.Description);
        }
    }
}