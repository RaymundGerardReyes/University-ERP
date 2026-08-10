namespace LmsOffline.Presentation.Features.Assessments;

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SubmitOfflineAssessment;
using LmsOffline.Application.Interfaces;

public class QuizOptionItem : ObservableObject
{
    public string Key { get; set; } = string.Empty; // e.g., "A", "B", "C", "D"
    public string OptionText { get; set; } = string.Empty;

    private bool _isSelected;
    public bool IsSelected
    {
        get => _isSelected;
        set => SetProperty(ref _isSelected, value);
    }
}

public class QuizQuestionModel : ObservableObject
{
    public int QuestionIndex { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string CategoryBadge { get; set; } = "LOGIC";
    public ObservableCollection<QuizOptionItem> Options { get; } = new();

    private string? _selectedOptionKey;
    public string? SelectedOptionKey
    {
        get => _selectedOptionKey;
        set => SetProperty(ref _selectedOptionKey, value);
    }

    private bool _isAnswered;
    public bool IsAnswered
    {
        get => _isAnswered;
        set => SetProperty(ref _isAnswered, value);
    }
}

public partial class LogicQuizViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly IExamIntegrityService _integrityService;
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly ILogger<LogicQuizViewModel>? _logger;

    public string Title => "Interactive Logic Quiz";

    [ObservableProperty]
    private string _quizTitle = "Loading quiz...";

    [ObservableProperty]
    private string _timerText = "--:-- Remaining";

    [ObservableProperty]
    private QuizQuestionModel? _currentQuestion;

    [ObservableProperty]
    private int _currentQuestionIndex = 0;

    [ObservableProperty]
    private string _statusMessage = "Quiz active. Progress auto-encrypted in memory.";

    [ObservableProperty]
    private bool _isQuizSubmitted = false;

    public ObservableCollection<QuizQuestionModel> Questions { get; } = new();

    private Guid _assessmentId;

    public LogicQuizViewModel(
        ISender sender, 
        IExamIntegrityService integrityService,
        IOfflineAssessmentRepository assessmentRepository,
        ILogger<LogicQuizViewModel>? logger = null)
    {
        _sender = sender;
        _integrityService = integrityService;
        _assessmentRepository = assessmentRepository;
        _logger = logger;
        
        LoadQuestions();

        // Start active window focus monitoring & clipboard protection
        _integrityService.StartMonitoring();
    }

    public async Task InitializeAsync(Guid assessmentId)
    {
        _assessmentId = assessmentId;
        var assessment = await _assessmentRepository.GetByIdAsync(assessmentId);
        if (assessment != null)
        {
            QuizTitle = assessment.Title;
            TimerText = $"{assessment.Window.EndTimeUtc - DateTime.UtcNow:hh\\:mm} Remaining";
        }
    }

    private void LoadQuestions()
    {
        // Question 1
        var q1 = new QuizQuestionModel
        {
            QuestionIndex = 1,
            QuestionText = "In Boolean Logic, what is the output of (A AND B) OR (NOT A AND B)?",
            CategoryBadge = "BOOLEAN ALGEBRA"
        };
        q1.Options.Add(new QuizOptionItem { Key = "A", OptionText = "A" });
        q1.Options.Add(new QuizOptionItem { Key = "B", OptionText = "B" });
        q1.Options.Add(new QuizOptionItem { Key = "C", OptionText = "A AND B" });
        q1.Options.Add(new QuizOptionItem { Key = "D", OptionText = "True" });
        Questions.Add(q1);

        // Question 2
        var q2 = new QuizQuestionModel
        {
            QuestionIndex = 2,
            QuestionText = "Which property of Object-Oriented Programming allows derived classes to override methods of a base class?",
            CategoryBadge = "OOP PRINCIPLES"
        };
        q2.Options.Add(new QuizOptionItem { Key = "A", OptionText = "Encapsulation" });
        q2.Options.Add(new QuizOptionItem { Key = "B", OptionText = "Polymorphism" });
        q2.Options.Add(new QuizOptionItem { Key = "C", OptionText = "Abstraction" });
        q2.Options.Add(new QuizOptionItem { Key = "D", OptionText = "Multiple Inheritance" });
        Questions.Add(q2);

        // Question 3
        var q3 = new QuizQuestionModel
        {
            QuestionIndex = 3,
            QuestionText = "What guarantees transaction durability and encryption in SQLCipher offline storage?",
            CategoryBadge = "SECURITY & ARCHITECTURE"
        };
        q3.Options.Add(new QuizOptionItem { Key = "A", OptionText = "AES-256-CBC Encryption & Write-Ahead Logging (WAL)" });
        q3.Options.Add(new QuizOptionItem { Key = "B", OptionText = "Plaintext SQLite journal mode" });
        q3.Options.Add(new QuizOptionItem { Key = "C", OptionText = "In-memory caching without key ring" });
        q3.Options.Add(new QuizOptionItem { Key = "D", OptionText = "Unencrypted SHA-1 hashing" });
        Questions.Add(q3);

        CurrentQuestion = Questions.FirstOrDefault();
    }

    [RelayCommand]
    public void SelectOption(QuizOptionItem option)
    {
        if (CurrentQuestion == null) return;

        foreach (var opt in CurrentQuestion.Options)
        {
            opt.IsSelected = (opt.Key == option.Key);
        }

        CurrentQuestion.SelectedOptionKey = option.Key;
        CurrentQuestion.IsAnswered = true;
        StatusMessage = $"Selected Option {option.Key} for Question {CurrentQuestion.QuestionIndex}.";
    }

    [RelayCommand]
    public void JumpToQuestion(QuizQuestionModel question)
    {
        CurrentQuestion = question;
        CurrentQuestionIndex = question.QuestionIndex - 1;
        StatusMessage = $"Viewing Question {question.QuestionIndex} of {Questions.Count}.";
    }

    [RelayCommand]
    public void NextQuestion()
    {
        if (CurrentQuestionIndex < Questions.Count - 1)
        {
            CurrentQuestionIndex++;
            CurrentQuestion = Questions[CurrentQuestionIndex];
        }
    }

    [RelayCommand]
    public void PreviousQuestion()
    {
        if (CurrentQuestionIndex > 0)
        {
            CurrentQuestionIndex--;
            CurrentQuestion = Questions[CurrentQuestionIndex];
        }
    }

    [RelayCommand]
    public async Task SubmitQuizAsync()
    {
        StatusMessage = "Encrypting quiz answers and integrity logs...";
        _logger?.LogInformation("Student submitting Logic Quiz to Outbox.");

        // Stop integrity monitoring and retrieve violation records
        _integrityService.StopMonitoring();
        var violations = _integrityService.GetViolations();

        var answersList = Questions.Select(q => $"{{\"QuestionIndex\": {q.QuestionIndex}, \"SelectedOption\": \"{q.SelectedOptionKey ?? "NONE"}\"}}");
        var violationsJson = string.Join(",", violations.Select(v => $"{{\"Type\": \"{v.ViolationType}\", \"Time\": \"{v.TimestampUtc:O}\", \"Details\": \"{v.Details}\"}}"));

        string finalPayload = $@"{{
            ""Answers"": [{string.Join(",", answersList)}],
            ""IntegrityViolations"": [{violationsJson}]
        }}";

        var command = new SubmitOfflineAssessmentCommand(
            AssessmentId: _assessmentId,
            StudentAnswersJson: finalPayload,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            IsQuizSubmitted = true;
            StatusMessage = "SUCCESS: Quiz answers and integrity logs submitted & encrypted in local Outbox queue!";
            _logger?.LogInformation("Logic Quiz with integrity logs saved to outbox successfully.");
        }
        else
        {
            StatusMessage = $"Submission error: {result.Error.Description}";
            _logger?.LogError("Logic Quiz submit error: {Error}", result.Error.Description);
        }
    }
}
