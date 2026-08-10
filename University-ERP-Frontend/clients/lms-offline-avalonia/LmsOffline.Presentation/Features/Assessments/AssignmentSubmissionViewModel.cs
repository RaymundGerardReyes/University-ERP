namespace LmsOffline.Presentation.Features.Assessments;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SubmitOfflineAssignment;
using LmsOffline.Application.Interfaces;

public partial class AssignmentSubmissionViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly IOfflineAssignmentRepository _assignmentRepository;
    private readonly ILogger<AssignmentSubmissionViewModel>? _logger;

    public string Title => "Assignment Workspace";

    [ObservableProperty]
    private string _assignmentTitle = "Loading assignment...";

    [ObservableProperty]
    private string _draftContent = string.Empty;

    [ObservableProperty]
    private string _statusMessage = "Loading draft from local encrypted vault...";

    [ObservableProperty]
    private int _characterCount;

    private Guid _currentAssignmentId;

    public AssignmentSubmissionViewModel(ISender sender, IOfflineAssignmentRepository assignmentRepository, ILogger<AssignmentSubmissionViewModel>? logger = null)
    {
        _sender = sender;
        _assignmentRepository = assignmentRepository;
        _logger = logger;
        UpdateCharacterCount();
    }

    public async Task InitializeAsync(Guid assignmentId)
    {
        _currentAssignmentId = assignmentId;
        var assignment = await _assignmentRepository.GetByIdAsync(assignmentId);
        if (assignment != null)
        {
            AssignmentTitle = assignment.Title;
            DraftContent = assignment.DraftContent ?? string.Empty;
            StatusMessage = "Draft loaded from local encrypted vault.";
        }
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
