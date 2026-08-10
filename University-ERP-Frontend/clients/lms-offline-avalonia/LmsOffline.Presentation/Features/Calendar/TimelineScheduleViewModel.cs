namespace LmsOffline.Presentation.Features.Calendar;

using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using System.Threading.Tasks;

public class AgendaItemModel : ObservableObject
{
    public string TimeText { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? StatusColor { get; set; }
}

public partial class CalendarDayModel : ObservableObject
{
    [ObservableProperty] private DateTime _date;
    [ObservableProperty] private string _dayNumber = string.Empty;
    
    [ObservableProperty] 
    [NotifyPropertyChangedFor(nameof(BgColor))]
    [NotifyPropertyChangedFor(nameof(BorderColor))]
    [NotifyPropertyChangedFor(nameof(TextColor))]
    private bool _isToday;
    
    [ObservableProperty] 
    [NotifyPropertyChangedFor(nameof(BgColor))]
    [NotifyPropertyChangedFor(nameof(BorderColor))]
    [NotifyPropertyChangedFor(nameof(TextColor))]
    private bool _isSelected;
    
    // Status Indicators
    [ObservableProperty] 
    [NotifyPropertyChangedFor(nameof(TextColor))]
    private bool _hasMissed;
    
    [ObservableProperty] private bool _hasActive;
    [ObservableProperty] private bool _hasUpcoming;
    [ObservableProperty] private bool _hasDueToday;

    // Dynamic UI Colors based on State
    public string? BgColor => IsSelected ? "#1A6366F1" : (IsToday ? "#1A10B981" : null);
    public string? BorderColor => IsSelected ? "#6366F1" : (IsToday ? "#10B981" : null);
    public string? TextColor => IsSelected ? "#6366F1" : (HasMissed ? "#EF4444" : (IsToday ? "#10B981" : null));
}

public partial class TimelineScheduleViewModel : ObservableObject
{
    private readonly IOfflineAssessmentRepository _assessmentRepository;
    private readonly IOfflineAssignmentRepository _assignmentRepository;
    private readonly ILogger<TimelineScheduleViewModel>? _logger;

    private List<OfflineAssessment> _assessments = new();
    private List<OfflineAssignment> _assignments = new();

    public string Title => "Calendar & Schedule";

    [ObservableProperty] private string _currentMonthYear = "August 2026";
    [ObservableProperty] private string _selectedDateText = "August 7, 2026";
    [ObservableProperty] private string _selectedDateRelative = "Today";

    public ObservableCollection<CalendarDayModel> CalendarDays { get; } = new();
    public ObservableCollection<AgendaItemModel> SelectedDayAgenda { get; } = new();

    public TimelineScheduleViewModel(IOfflineAssessmentRepository assessmentRepository, IOfflineAssignmentRepository assignmentRepository, ILogger<TimelineScheduleViewModel>? logger = null)
    {
        _assessmentRepository = assessmentRepository;
        _assignmentRepository = assignmentRepository;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        _assessments = await _assessmentRepository.GetAllAsync();
        _assignments = await _assignmentRepository.GetAllAsync();

        GenerateCalendar(new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1)); 
        
        var today = CalendarDays.FirstOrDefault(d => d.IsToday);
        if (today != null) SelectDate(today);
    }

    private void GenerateCalendar(DateTime monthStart)
    {
        CalendarDays.Clear();
        int daysInMonth = DateTime.DaysInMonth(monthStart.Year, monthStart.Month);
        int startDayOfWeek = (int)monthStart.DayOfWeek; // 0 = Sunday, 6 = Saturday

        // 1. Pad empty days at start of month
        for (int i = 0; i < startDayOfWeek; i++)
        {
            CalendarDays.Add(new CalendarDayModel());
        }

        // 2. Generate actual days
        for (int i = 1; i <= daysInMonth; i++)
        {
            var date = new DateTime(monthStart.Year, monthStart.Month, i);
            var dayModel = new CalendarDayModel
            {
                Date = date,
                DayNumber = i.ToString(),
                IsToday = (date.Date == DateTime.UtcNow.Date)
            };

            // Inject Event Indicators
            var dayAssessments = _assessments.Where(a => a.Window.EndTimeUtc.Date == date.Date).ToList();
            var dayAssignments = _assignments.Where(a => a.Window.EndTimeUtc.Date == date.Date).ToList();

            if (date.Date < DateTime.UtcNow.Date && (dayAssessments.Any(a => !a.IsStarted) || dayAssignments.Any(a => a.SyncState != LmsOffline.Domain.ValueObjects.SyncStatus.Synced)))
            {
                dayModel.HasMissed = true;
            }
            if (date.Date == DateTime.UtcNow.Date && (dayAssessments.Any() || dayAssignments.Any()))
            {
                dayModel.HasActive = true;
                dayModel.HasDueToday = true;
            }
            if (date.Date > DateTime.UtcNow.Date && (dayAssessments.Any() || dayAssignments.Any()))
            {
                dayModel.HasUpcoming = true;
            }

            CalendarDays.Add(dayModel);
        }

        // 3. Pad empty days at end to complete a 42-cell grid (6 rows)
        while (CalendarDays.Count < 42)
        {
            CalendarDays.Add(new CalendarDayModel());
        }
    }

    [RelayCommand]
    public void SelectDate(CalendarDayModel day)
    {
        if (string.IsNullOrEmpty(day.DayNumber)) return;

        // Update UI Selection States
        foreach (var d in CalendarDays) 
        {
            d.IsSelected = false;
        }
        
        day.IsSelected = true;

        // Update Contextual Agenda Header
        SelectedDateText = day.Date.ToString("MMMM d, yyyy");
        SelectedDateRelative = day.IsToday ? "Today" : day.Date.DayOfWeek.ToString();

        LoadAgendaForDate(day.Date);
        _logger?.LogInformation("Calendar date selected: {Date}", SelectedDateText);
    }

    private void LoadAgendaForDate(DateTime date)
    {
        SelectedDayAgenda.Clear();

        var dayAssessments = _assessments.Where(a => a.Window.EndTimeUtc.Date == date.Date).ToList();
        var dayAssignments = _assignments.Where(a => a.Window.EndTimeUtc.Date == date.Date).ToList();

        foreach (var a in dayAssessments)
        {
            SelectedDayAgenda.Add(new AgendaItemModel 
            { 
                TimeText = a.Window.EndTimeUtc.ToString("hh:mm tt"), 
                CourseCode = "Assessment", 
                Title = a.Title, 
                Type = "Quiz/Exam", 
                Status = a.IsStarted ? "Started" : (date.Date < DateTime.UtcNow.Date ? "Missed" : "Due"), 
                StatusColor = a.IsStarted ? "#10B981" : (date.Date < DateTime.UtcNow.Date ? "#EF4444" : "#F59E0B") 
            });
        }

        foreach (var a in dayAssignments)
        {
            SelectedDayAgenda.Add(new AgendaItemModel 
            { 
                TimeText = a.Window.EndTimeUtc.ToString("hh:mm tt"), 
                CourseCode = a.CourseCode, 
                Title = a.Title, 
                Type = "Assignment", 
                Status = a.SyncState == LmsOffline.Domain.ValueObjects.SyncStatus.Synced ? "Submitted" : (date.Date < DateTime.UtcNow.Date ? "Missed" : "Due"), 
                StatusColor = a.SyncState == LmsOffline.Domain.ValueObjects.SyncStatus.Synced ? "#10B981" : (date.Date < DateTime.UtcNow.Date ? "#EF4444" : "#F59E0B") 
            });
        }

        if (!SelectedDayAgenda.Any())
        {
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "All Day", CourseCode = "---", Title = "No scheduled activities.", Type = "Rest Day", Status = "Clear", StatusColor = null });
        }
    }
}
