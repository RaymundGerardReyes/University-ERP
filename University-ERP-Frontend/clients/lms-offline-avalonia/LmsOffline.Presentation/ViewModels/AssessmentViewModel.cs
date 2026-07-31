namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.StartOfflineAssessment;

public partial class AssessmentViewModel : ObservableObject
{
    private readonly ISender _sender;

    [ObservableProperty]
    private string _statusMessage = "Ready to start assessment.";

    public AssessmentViewModel(ISender sender)
    {
        _sender = sender;
    }

    [RelayCommand]
    public async Task StartAssessmentAsync()
    {
        StatusMessage = "Starting offline assessment...";

        // In a real flow, these values are populated by the selected UI assessment data
        var command = new StartOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(),
            TokenValue: "secure_offline_token_123",
            TokenIssuedAtUtc: DateTime.UtcNow.AddMinutes(-10),
            CurrentDeviceTimeUtc: DateTime.UtcNow
        );

        // Dispatch the command to the Application layer
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            StatusMessage = $"Success! Assessment Started safely offline. ID: {result.Value}";
        }
        else
        {
            StatusMessage = $"Failed to start: {result.Error.Description}";
        }
    }
}
