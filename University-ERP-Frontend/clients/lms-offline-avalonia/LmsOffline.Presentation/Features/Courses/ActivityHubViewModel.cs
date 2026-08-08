namespace LmsOffline.Presentation.Features.Courses;

using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.SubmitOfflineAssignment;

public class StudentActivityTaskItem : ObservableObject
{
    public string ActivityId { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string DueDateText { get; set; } = string.Empty;
    public string PriorityBadge { get; set; } = "NORMAL";
    public string Status { get; set; } = "To Do"; // "To Do", "In Progress", "Submitted"
}

public partial class ActivityHubViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly ILogger<ActivityHubViewModel>? _logger;

    public string Title => "Activity Hub";

    [ObservableProperty]
    private string _statusMessage = "Select an activity task to work on your offline submission.";

    [ObservableProperty]
    private StudentActivityTaskItem? _selectedTask;

    [ObservableProperty]
    private string _reflectionDraftText = "Write your offline lab activity response, code snippets, or peer reflection here...";

    [ObservableProperty]
    private int _characterCount;

    public ObservableCollection<StudentActivityTaskItem> TodoTasks { get; } = new();
    public ObservableCollection<StudentActivityTaskItem> InProgressTasks { get; } = new();
    public ObservableCollection<StudentActivityTaskItem> CompletedTasks { get; } = new();

    public ActivityHubViewModel(ISender sender, ILogger<ActivityHubViewModel>? logger = null)
    {
        _sender = sender;
        _logger = logger;
        LoadDefaultActivities();
    }

    partial void OnReflectionDraftTextChanged(string value)
    {
        CharacterCount = value?.Length ?? 0;
    }

    private void LoadDefaultActivities()
    {
        TodoTasks.Add(new StudentActivityTaskItem
        {
            ActivityId = "ACT-201-01",
            CourseCode = "CS-201",
            Title = "Lab Exercise 4: Virtual Method Invocation",
            DueDateText = "Due in 2 days",
            PriorityBadge = "HIGH",
            Status = "To Do"
        });

        InProgressTasks.Add(new StudentActivityTaskItem
        {
            ActivityId = "ACT-305-02",
            CourseCode = "CS-305",
            Title = "Database Security Analysis Essay",
            DueDateText = "Tomorrow at 11:59 PM",
            PriorityBadge = "URGENT",
            Status = "In Progress"
        });

        CompletedTasks.Add(new StudentActivityTaskItem
        {
            ActivityId = "ACT-410-01",
            CourseCode = "CS-410",
            Title = "Outbox Engine Architecture Reflection",
            DueDateText = "Submitted Today",
            PriorityBadge = "COMPLETED",
            Status = "Submitted"
        });

        SelectedTask = InProgressTasks.FirstOrDefault();
    }

    [RelayCommand]
    public void SelectTask(StudentActivityTaskItem task)
    {
        SelectedTask = task;
        StatusMessage = $"Active Task: {task.CourseCode} - {task.Title}";
        _logger?.LogInformation("Student selected activity task: {TaskTitle}", task.Title);
    }

    [RelayCommand]
    public async Task SaveActivityToOutboxAsync()
    {
        if (SelectedTask == null) return;

        StatusMessage = $"Encrypting activity payload for {SelectedTask.ActivityId} and saving to SQLCipher Outbox...";
        _logger?.LogInformation("Student saving activity {ActivityId} to Outbox.", SelectedTask.ActivityId);

        var command = new SubmitOfflineAssignmentCommand(
            AssessmentId: Guid.NewGuid(),
            StudentAnswersJson: ReflectionDraftText,
            SubmittedAtUtc: DateTime.UtcNow
        );

        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            SelectedTask.Status = "Submitted";
            if (!CompletedTasks.Contains(SelectedTask))
            {
                CompletedTasks.Add(SelectedTask);
            }
            StatusMessage = $"SUCCESS: {SelectedTask.Title} saved to Outbox! Auto-sync when online.";
            _logger?.LogInformation("Activity saved to outbox successfully.");
        }
        else
        {
            StatusMessage = $"Save error: {result.Error.Description}";
            _logger?.LogError("Activity save error: {Error}", result.Error.Description);
        }
    }
}
