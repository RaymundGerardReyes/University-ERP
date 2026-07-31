namespace LmsOffline.Presentation.ViewModels;

using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.SyncPendingSubmissions;

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
}
