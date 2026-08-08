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
    private readonly ILogger<LogicQuizViewModel>? _logger;

    public string Title => "Interactive Logic Quiz";

    [ObservableProperty]
    private string _quizTitle = "CS-201: Logic & Boolean Algebra Evaluation";

    [ObservableProperty]
    private string _timerText = "29:45 Remaining";

    [ObservableProperty]
    private QuizQuestionModel? _currentQuestion;

    [ObservableProperty]
    private int _currentQuestionIndex = 0;

    [ObservableProperty]
    private string _statusMessage = "Quiz active. Progress auto-encrypted in memory.";

    [ObservableProperty]
    private bool _isQuizSubmitted = false;

    public ObservableCollection<QuizQuestionModel> Questions { get; } = new();

    public LogicQuizViewModel(ISender sender, ILogger<LogicQuizViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
        LoadQuestions();
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
        StatusMessage = "Encrypting quiz answers and dispatching to SQLCipher Outbox...";
        _logger?.LogInformation("Student submitting Logic Quiz to Outbox.");

        var answersList = Questions.Select(q => $"{{\"QuestionIndex\": {q.QuestionIndex}, \"SelectedOption\": \"{q.SelectedOptionKey ?? "NONE"}\"}}");
        string jsonAnswers = $"[{string.Join(",", answersList)}]";

        var command = new SubmitOfflineAssessmentCommand(
            AssessmentId: Guid.NewGuid(),
            StudentAnswersJson: jsonAnswers,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            IsQuizSubmitted = true;
            StatusMessage = "SUCCESS: Quiz submitted & safely encrypted in local Outbox queue!";
            _logger?.LogInformation("Logic Quiz saved to outbox successfully.");
        }
        else
        {
            StatusMessage = $"Submission error: {result.Error.Description}";
            _logger?.LogError("Logic Quiz submit error: {Error}", result.Error.Description);
        }
    }
}
