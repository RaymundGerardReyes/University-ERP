namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.StartOfflineAssessment;
using LmsOffline.Application.Features.SubmitOfflineAssessment;

public partial class AssessmentViewModel : ObservableObject
{
    private readonly ISender _sender;

    [ObservableProperty]
    private string _statusMessage = "Ready to start assessment.";

    // NEW: Captures the student's JSON answers from the UI
    [ObservableProperty]
    private string _answersJson = string.Empty;

    public AssessmentViewModel(ISender sender)
    {
        _sender = sender;
    }

    [RelayCommand]
    public async Task StartAssessmentAsync()
    {
        StatusMessage = "Starting offline assessment...";
        
        var command = new StartOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(),
            TokenValue: "secure_offline_token_123",
            TokenIssuedAtUtc: DateTime.UtcNow.AddMinutes(-10),
            CurrentDeviceTimeUtc: DateTime.UtcNow
        );

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

    // NEW: Wires the UI to securely save the exam to the SQLite Outbox
    [RelayCommand]
    public async Task SubmitAssessmentAsync()
    {
        StatusMessage = "Saving assessment securely to offline outbox...";

        var command = new SubmitOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(), 
            StudentAnswersJson: AnswersJson,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            StatusMessage = "Success! Assessment safely saved to outbox. It will sync automatically.";
            AnswersJson = string.Empty; // Clear UI state after secure save
        }
        else
        {
            StatusMessage = $"Failed to save: {result.Error.Description}";
        }
    }
}