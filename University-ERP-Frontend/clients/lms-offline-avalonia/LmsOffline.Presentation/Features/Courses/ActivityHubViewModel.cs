namespace LmsOffline.Presentation.Features.Courses;

using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using LmsOffline.Application.Features.SubmitOfflineAssignment;
using LmsOffline.Application.Interfaces;

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
    private readonly IOfflineAssignmentRepository _assignmentRepository;
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

    public ActivityHubViewModel(ISender sender, IOfflineAssignmentRepository assignmentRepository, ILogger<ActivityHubViewModel>? logger = null)
    {
        _sender = sender;
        _assignmentRepository = assignmentRepository;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        var assignments = await _assignmentRepository.GetAllAsync();
        TodoTasks.Clear();
        InProgressTasks.Clear();
        CompletedTasks.Clear();

        foreach (var assignment in assignments)
        {
            var task = new StudentActivityTaskItem
            {
                ActivityId = assignment.Id.ToString(),
                CourseCode = assignment.CourseCode,
                Title = assignment.Title,
                DueDateText = "Due " + assignment.Window.EndTimeUtc.ToString("MMM dd"),
                PriorityBadge = (assignment.Window.EndTimeUtc - DateTime.UtcNow).TotalDays < 2 ? "URGENT" : "NORMAL",
                Status = assignment.SyncState == LmsOffline.Domain.ValueObjects.SyncStatus.Synced ? "Submitted" : (string.IsNullOrEmpty(assignment.DraftContent) ? "To Do" : "In Progress")
            };

            if (task.Status == "To Do") TodoTasks.Add(task);
            else if (task.Status == "In Progress") InProgressTasks.Add(task);
            else CompletedTasks.Add(task);
        }

        SelectedTask = InProgressTasks.FirstOrDefault() ?? TodoTasks.FirstOrDefault();
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
