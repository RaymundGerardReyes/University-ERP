namespace LmsOffline.Presentation.Features.Dashboard;

using System;
using System.Collections.ObjectModel;
using System.Linq;
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

    public string Title => "Home";

    // ── Welcome ───────────────────────────────────────────────────────────────
    [ObservableProperty] private string _studentName = "Loading...";
    [ObservableProperty] private string _studentId = "Loading...";
    [ObservableProperty] private string _academicProgram = "Loading...";
    [ObservableProperty] private string _welcomeSubtitle = "Here's what needs your attention today.";
    [ObservableProperty] private string _todayDateString = DateTime.Now.ToString("dddd, MMMM d");
    [ObservableProperty] private string _topUrgentActionMessage = "Synchronizing data...";
    [ObservableProperty] private string _statusMessage = "Synchronizing with offline vault...";

    // ── KPI Cards ─────────────────────────────────────────────────────────────
    public ObservableCollection<KpiCardDto> KpiCards { get; } = new();

    // ── Continue Learning ─────────────────────────────────────────────────────
    [ObservableProperty] private ContinueLearningDto? _continueLearning;

    // ── Immediate Horizon (split by Bucket) ───────────────────────────────────
    public ObservableCollection<DeadlineDto> OverdueDeadlines { get; } = new();
    public ObservableCollection<DeadlineDto> TodayDeadlines { get; } = new();
    public ObservableCollection<DeadlineDto> UpcomingDeadlines { get; } = new();

    // ── Course Progress ───────────────────────────────────────────────────────
    public ObservableCollection<CourseProgressDto> CourseProgresses { get; } = new();

    // ── Recent Activity ───────────────────────────────────────────────────────
    public ObservableCollection<RecentActivityDto> RecentActivities { get; } = new();

    // ── Feedback ──────────────────────────────────────────────────────────────
    public ObservableCollection<FeedbackDto> Feedbacks { get; } = new();

    // ── Academic Snapshot ─────────────────────────────────────────────────────
    [ObservableProperty] private string _academicYear = string.Empty;
    [ObservableProperty] private string _semester = string.Empty;
    [ObservableProperty] private int _activeCourseCount;

    // ── Visibility helpers ────────────────────────────────────────────────────
    public bool HasOverdue => OverdueDeadlines.Count > 0;
    public bool HasToday => TodayDeadlines.Count > 0;
    public bool HasUpcoming => UpcomingDeadlines.Count > 0;

    public StudentDashboardViewModel(IMediator mediator, ILogger<StudentDashboardViewModel>? logger = null)
    {
        _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));
        _logger = logger;
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

                Avalonia.Threading.Dispatcher.UIThread.Post(() =>
                {
                    // Welcome
                    StudentName          = dto.StudentName;
                    StudentId            = dto.StudentId;
                    AcademicProgram      = dto.AcademicProgram;
                    WelcomeSubtitle      = dto.WelcomeSubtitle;
                    TodayDateString      = dto.TodayDateString;
                    TopUrgentActionMessage = dto.TopUrgentActionMessage;

                    // KPIs
                    KpiCards.Clear();
                    foreach (var kpi in dto.KpiCards)
                        KpiCards.Add(kpi);

                    // Continue Learning
                    ContinueLearning = dto.ContinueLearning;

                    // Immediate Horizon — split by bucket
                    OverdueDeadlines.Clear();
                    TodayDeadlines.Clear();
                    UpcomingDeadlines.Clear();
                    foreach (var d in dto.Deadlines)
                    {
                        if (d.Bucket == "Overdue")   OverdueDeadlines.Add(d);
                        else if (d.Bucket == "Today") TodayDeadlines.Add(d);
                        else                          UpcomingDeadlines.Add(d);
                    }
                    OnPropertyChanged(nameof(HasOverdue));
                    OnPropertyChanged(nameof(HasToday));
                    OnPropertyChanged(nameof(HasUpcoming));

                    // Course Progress
                    CourseProgresses.Clear();
                    foreach (var cp in dto.CourseProgresses)
                        CourseProgresses.Add(cp);

                    // Recent Activity
                    RecentActivities.Clear();
                    foreach (var ra in dto.RecentActivities)
                        RecentActivities.Add(ra);

                    // Feedback
                    Feedbacks.Clear();
                    foreach (var fb in dto.Feedbacks)
                        Feedbacks.Add(fb);

                    // Academic Snapshot
                    AcademicYear      = dto.AcademicYear;
                    Semester          = dto.Semester;
                    ActiveCourseCount = dto.ActiveCourseCount;

                    StatusMessage = "Offline vault synchronized.";
                });
            }
            else
            {
                Avalonia.Threading.Dispatcher.UIThread.Post(() =>
                    StatusMessage = $"Error loading data: {result.Error?.Description}");
                _logger?.LogWarning("Failed to load dashboard data: {Error}", result.Error?.Description);
            }
        }
        catch (Exception ex)
        {
            Avalonia.Threading.Dispatcher.UIThread.Post(() =>
                StatusMessage = "An error occurred while loading dashboard data.");
            _logger?.LogError(ex, "Exception in LoadDashboardDataAsync");
        }
    }

    [RelayCommand]
    public void PerformAction(string target)
    {
        StatusMessage = $"Navigating to {target}...";
        _logger?.LogInformation("Student clicked action: {Target}", target);
    }
}
