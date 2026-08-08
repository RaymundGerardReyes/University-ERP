namespace LmsOffline.Presentation.Features.Assessments;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.StartOfflineAssessment;
using LmsOffline.Application.Features.SubmitOfflineAssessment;

public partial class AssessmentViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly ILogger<AssessmentViewModel>? _logger;

    public string Title => "Offline Exam Vault";

    [ObservableProperty]
    private string _examTitle = "CS-201: Midterm Security & Outbox Architecture Exam";

    [ObservableProperty]
    private string _statusMessage = "Ready to initialize secure exam window.";

    [ObservableProperty]
    private string _timerDisplay = "45:00 Remaining";

    [ObservableProperty]
    private bool _isExamActive = false;

    [ObservableProperty]
    private string _answersJson = "[\n  { \"QuestionId\": \"Q1\", \"SelectedOption\": \"B\" },\n  { \"QuestionId\": \"Q2\", \"SelectedOption\": \"A\" }\n]";

    public AssessmentViewModel(ISender sender, ILogger<AssessmentViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
    }

    [RelayCommand]
    public async Task StartAssessmentAsync()
    {
        StatusMessage = "Validating cryptographic token and starting offline exam...";
        _logger?.LogInformation("Student started offline assessment session.");
        
        var command = new StartOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(),
            TokenValue: "secure_offline_token_123",
            TokenIssuedAtUtc: DateTime.UtcNow.AddMinutes(-10),
            CurrentDeviceTimeUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            IsExamActive = true;
            StatusMessage = $"Exam Active! Window enforced safely offline. Exam Token ID: {result.Value}";
            _logger?.LogInformation("Offline assessment started successfully with Token ID {TokenId}", result.Value);
        }
        else
        {
            StatusMessage = $"Failed to start exam window: {result.Error.Description}";
            _logger?.LogWarning("Failed to start assessment: {Error}", result.Error.Description);
        }
    }

    [RelayCommand]
    public async Task SubmitAssessmentAsync()
    {
        StatusMessage = "Encrypting student payload and writing to SQLCipher Outbox...";
        _logger?.LogInformation("Student submitting assessment payload to Outbox.");

        var command = new SubmitOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(), 
            StudentAnswersJson: AnswersJson,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            IsExamActive = false;
            StatusMessage = "SUCCESS: Exam answers encrypted and stored in SQLCipher Outbox! Will auto-sync when online.";
            _logger?.LogInformation("Assessment submission saved safely to SQLCipher outbox.");
        }
        else
        {
            StatusMessage = $"Failed to save submission: {result.Error.Description}";
            _logger?.LogError("Failed to submit assessment to outbox: {Error}", result.Error.Description);
        }
    }
}
