namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.SyncPendingSubmissions;
using LmsOffline.Application.Features.DownloadModulePackage;

public partial class ModuleTimelineViewModel : ObservableObject
{
    private readonly ISender _sender;

    [ObservableProperty]
    private string _syncStatusMessage = "All systems operational.";

    public ModuleTimelineViewModel(ISender sender)
    {
        _sender = sender;
    }

    [RelayCommand]
    public async Task SyncNowAsync()
    {
        SyncStatusMessage = "Attempting to sync with University ERP Backend...";
        var command = new SyncPendingSubmissionsCommand();
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            SyncStatusMessage = "Sync complete! All outbox items have been processed.";
        }
        else
        {
            SyncStatusMessage = "Sync failed. Are you connected to the internet?";
        }
    }

    // NEW: Wires the UI to download the encrypted offline package
    [RelayCommand]
    public async Task DownloadPackageAsync()
    {
        SyncStatusMessage = "Downloading secure offline module package...";

        // Note: In a real flow, ModuleId and StudentId are provided by the user context/Auth SDK
        var command = new DownloadModulePackageCommand(
            ModuleId: Guid.NewGuid(), 
            StudentId: Guid.NewGuid()
        );

        var isSuccess = await _sender.Send(command);

        if (isSuccess)
        {
            SyncStatusMessage = "Package downloaded successfully. Ready for offline learning.";
        }
        else
        {
            SyncStatusMessage = "Download failed. Please check your internet connection.";
        }
    }
}