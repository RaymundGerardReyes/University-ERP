namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.Dashboard;

public partial class StudentDashboardViewModel : ObservableObject
{
    private readonly ILogger<StudentDashboardViewModel>? _logger;
    private readonly IMediator _mediator;

    public string Title => "Student Dashboard";

    [ObservableProperty]
    private string _studentName = "Loading...";

    [ObservableProperty]
    private string _studentId = "Loading...";

    [ObservableProperty]
    private string _academicProgram = "Loading...";

    [ObservableProperty]
    private double _overallProgress = 0;

    [ObservableProperty]
    private string _currentGpa = "0.0 / 4.0";

    [ObservableProperty]
    private int _completedModulesCount = 0;

    [ObservableProperty]
    private int _pendingOutboxCount = 0;

    [ObservableProperty]
    private string _lastActiveLessonTitle = "Loading...";

    [ObservableProperty]
    private string _statusMessage = "Synchronizing with offline vault...";

    public ObservableCollection<UrgentAlertDto> UrgentAlerts { get; } = new();
    public ObservableCollection<RecentActivityDto> RecentActivities { get; } = new();

    public StudentDashboardViewModel(IMediator mediator, ILogger<StudentDashboardViewModel>? logger = null)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger;
        
        // Fire and forget data load
        _ = LoadDashboardDataAsync();
    }

    private async Task LoadDashboardDataAsync()
    {
        try
        {
            var result = await _mediator.Send(new GetStudentDashboardStatsQuery());

            if (result.IsSuccess && result.Value != null)
            {
                var dto = result.Value;
                
                StudentName = dto.StudentName;
                StudentId = dto.StudentId;
                AcademicProgram = dto.AcademicProgram;
                OverallProgress = dto.OverallProgress;
                CurrentGpa = dto.CurrentGpa;
                CompletedModulesCount = dto.CompletedModulesCount;
                PendingOutboxCount = dto.PendingOutboxCount;
                LastActiveLessonTitle = dto.LastActiveLessonTitle;

                UrgentAlerts.Clear();
                foreach (var alert in dto.UrgentAlerts)
                {
                    UrgentAlerts.Add(alert);
                }

                RecentActivities.Clear();
                foreach (var activity in dto.RecentActivities)
                {
                    RecentActivities.Add(activity);
                }
                
                StatusMessage = "Offline Student Vault fully synchronized & encrypted.";
            }
            else
            {
                StatusMessage = $"Error loading data: {result.Error?.Description}";
                _logger?.LogWarning("Failed to load dashboard data: {Error}", result.Error?.Description);
            }
        }
        catch (Exception ex)
        {
            StatusMessage = "An error occurred while loading dashboard data.";
            _logger?.LogError(ex, "Exception in LoadDashboardDataAsync");
        }
    }

    [RelayCommand]
    public void ResumeLastLesson()
    {
        StatusMessage = $"Resuming lesson: {LastActiveLessonTitle}...";
        _logger?.LogInformation("Student clicked Resume Last Lesson: {LessonTitle}", LastActiveLessonTitle);
    }
}