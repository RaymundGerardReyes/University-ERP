namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.SubmitOfflineAssignment;

public partial class AssignmentSubmissionViewModel : ObservableObject
{
    private readonly ISender _sender;

    [ObservableProperty]
    private string _draftContent = string.Empty;

    [ObservableProperty]
    private string _statusMessage = "Ready to type.";

    // In a real app, this would be passed in via navigation parameters
    private readonly Guid _currentAssignmentId = Guid.NewGuid(); 

    public AssignmentSubmissionViewModel(ISender sender)
    {
        _sender = sender;
    }

    [RelayCommand]
    public async Task SubmitAssignmentAsync()
    {
        StatusMessage = "Saving securely to offline outbox...";

        var command = new SubmitOfflineAssignmentCommand(
            AssessmentId: _currentAssignmentId,
            StudentAnswersJson: DraftContent,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            StatusMessage = "Success! Assignment safely saved to outbox. It will sync automatically.";
        }
        else
        {
            StatusMessage = $"Failed to save: {result.Error.Description}";
        }
    }
}
