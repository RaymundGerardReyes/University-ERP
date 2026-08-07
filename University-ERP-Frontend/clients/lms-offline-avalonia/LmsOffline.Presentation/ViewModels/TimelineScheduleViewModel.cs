namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public class ScheduleMilestoneNode : ObservableObject
{
    public string MonthDayText { get; set; } = string.Empty; // e.g., "AUG 01"
    public string CourseCode { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public string AvailabilityWindow { get; set; } = string.Empty;
    public string Status { get; set; } = "Unlocked"; // "Completed", "Active", "Locked"
    public string NodeColor { get; set; } = "#34d399"; // Green completed, Blue active, Red/Gray locked
    public string Icon { get; set; } = "✅";
}

public partial class TimelineScheduleViewModel : ObservableObject
{
    private readonly ILogger<TimelineScheduleViewModel>? _logger;

    public string Title => "Timeline Schedule";

    [ObservableProperty]
    private string _selectedFilter = "All Courses";

    [ObservableProperty]
    private string _statusMessage = "Semester 2026 Academic Timeline loaded.";

    public ObservableCollection<ScheduleMilestoneNode> TimelineNodes { get; } = new();

    public TimelineScheduleViewModel(ILogger<TimelineScheduleViewModel>? logger = null)
    {
        _logger = logger;
        LoadTimelineSchedule();
    }

    private void LoadTimelineSchedule()
    {
        TimelineNodes.Add(new ScheduleMilestoneNode
        {
            MonthDayText = "AUG 01",
            CourseCode = "CS-201",
            EventTitle = "Module 1 & 2 Package Bundle Downloaded",
            AvailabilityWindow = "Unlocked Aug 01, 2026",
            Status = "Completed",
            NodeColor = "#10b981",
            Icon = "✅"
        });

        TimelineNodes.Add(new ScheduleMilestoneNode
        {
            MonthDayText = "AUG 07",
            CourseCode = "CS-201",
            EventTitle = "Logic & Boolean Algebra Offline Quiz 2",
            AvailabilityWindow = "Active: Aug 07 08:00 - Aug 08 23:59 UTC",
            Status = "Active Now",
            NodeColor = "#3b82f6",
            Icon = "⚡"
        });

        TimelineNodes.Add(new ScheduleMilestoneNode
        {
            MonthDayText = "AUG 14",
            CourseCode = "CS-305",
            EventTitle = "SQLCipher Database Encryption Assessment",
            AvailabilityWindow = "Enforced: Aug 14 00:00 - Aug 16 23:59 UTC",
            Status = "Locked Window",
            NodeColor = "#f59e0b",
            Icon = "🔒"
        });

        TimelineNodes.Add(new ScheduleMilestoneNode
        {
            MonthDayText = "AUG 28",
            CourseCode = "CS-410",
            EventTitle = "Outbox Sync Engine Research Presentation",
            AvailabilityWindow = "Enforced: Aug 28 00:00 - Aug 30 23:59 UTC",
            Status = "Future",
            NodeColor = "#64748b",
            Icon = "📅"
        });
    }

    [RelayCommand]
    public void FilterTimeline(string filter)
    {
        SelectedFilter = filter;
        StatusMessage = $"Timeline filtered by: {filter}";
        _logger?.LogInformation("Timeline schedule filtered by {Filter}", filter);
    }
}
