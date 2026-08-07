namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SubmitOfflineAssignment;

public partial class AssignmentSubmissionViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly ILogger<AssignmentSubmissionViewModel>? _logger;

    public string Title => "Assignment Workspace";

    [ObservableProperty]
    private string _assignmentTitle = "CS-305: Analysis of Encrypted Local Databases in Edge Computing";

    [ObservableProperty]
    private string _draftContent = "In this assignment, we analyze how SQLCipher uses AES-256-CBC encryption to secure offline academic records...";

    [ObservableProperty]
    private string _statusMessage = "Draft loaded from local encrypted vault.";

    [ObservableProperty]
    private int _characterCount;

    private readonly Guid _currentAssignmentId = Guid.NewGuid();

    public AssignmentSubmissionViewModel(ISender sender, ILogger<AssignmentSubmissionViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
        UpdateCharacterCount();
    }

    partial void OnDraftContentChanged(string value)
    {
        UpdateCharacterCount();
    }

    private void UpdateCharacterCount()
    {
        CharacterCount = DraftContent?.Length ?? 0;
    }

    [RelayCommand]
    public async Task SubmitAssignmentAsync()
    {
        StatusMessage = "Encrypting draft essay and saving to SQLCipher Outbox...";
        _logger?.LogInformation("Student submitted assignment draft ({Length} characters).", CharacterCount);

        var command = new SubmitOfflineAssignmentCommand(
            AssessmentId: _currentAssignmentId,
            StudentAnswersJson: DraftContent,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            StatusMessage = "SUCCESS: Assignment encrypted and queued in SQLCipher Outbox for sync!";
            _logger?.LogInformation("Assignment submission stored safely in SQLCipher outbox.");
        }
        else
        {
            StatusMessage = $"Failed to save draft: {result.Error.Description}";
            _logger?.LogError("Failed to submit assignment to outbox: {Error}", result.Error.Description);
        }
    }
}
