namespace LmsOffline.Presentation.Features.Assessments;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.StartOfflineAssessment;
using LmsOffline.Application.Features.SubmitOfflineAssessment;
using LmsOffline.Application.Interfaces;

public partial class AssessmentViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly ILogger<AssessmentViewModel>? _logger;
    private Guid _assessmentId;

    public string Title => "Offline Exam Vault";

    [ObservableProperty]
    private string _examTitle = "Loading assessment...";

    [ObservableProperty]
    private string _statusMessage = "Loading secure exam window...";

    [ObservableProperty]
    private string _timerDisplay = "--:-- Remaining";

    [ObservableProperty]
    private bool _isExamActive = false;

    [ObservableProperty]
    private string _answersJson = "[\n  { \"QuestionId\": \"Q1\", \"SelectedOption\": \"B\" },\n  { \"QuestionId\": \"Q2\", \"SelectedOption\": \"A\" }\n]";

    public AssessmentViewModel(ISender sender, IOfflineAssessmentRepository assessmentRepository, ILogger<AssessmentViewModel>? logger = null)
    {
        _sender = sender;
        _assessmentRepository = assessmentRepository;
        _logger = logger;
    }

    public async Task InitializeAsync(Guid assessmentId)
    {
        _assessmentId = assessmentId;
        var assessment = await _assessmentRepository.GetByIdAsync(assessmentId);
        if (assessment != null)
        {
            ExamTitle = assessment.Title;
            StatusMessage = "Ready to initialize secure exam window.";
            TimerDisplay = $"{assessment.Window.EndTimeUtc - DateTime.UtcNow:hh\\:mm} Remaining";
        }
    }

    [RelayCommand]
    public async Task StartAssessmentAsync()
    {
        StatusMessage = "Validating cryptographic token and starting offline exam...";
        _logger?.LogInformation("Student started offline assessment session.");
        
        var command = new StartOfflineAssessmentCommand(
            AssessmentId: _assessmentId,
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
            AssessmentId: _assessmentId, 
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
