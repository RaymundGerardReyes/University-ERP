namespace LmsOffline.Presentation.Features.Calendar;

using System;
using System.Collections.ObjectModel;
using System.Linq;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public class AgendaItemModel : ObservableObject
{
    public string TimeText { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string StatusColor { get; set; } = "#94A3B8"; // Default muted
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
    public string BgColor => IsSelected ? "#1A6366F1" : (IsToday ? "#1A10B981" : "Transparent");
    public string BorderColor => IsSelected ? "#6366F1" : (IsToday ? "#10B981" : "Transparent");
    public string TextColor => HasMissed && !IsSelected ? "#EF4444" : (IsToday && !IsSelected ? "#10B981" : "#F8FAFC");
}

public partial class TimelineScheduleViewModel : ObservableObject
{
    private readonly ILogger<TimelineScheduleViewModel>? _logger;

    public string Title => "Calendar & Schedule";

    [ObservableProperty] private string _currentMonthYear = "August 2026";
    [ObservableProperty] private string _selectedDateText = "August 7, 2026";
    [ObservableProperty] private string _selectedDateRelative = "Today";

    public ObservableCollection<CalendarDayModel> CalendarDays { get; } = new();
    public ObservableCollection<AgendaItemModel> SelectedDayAgenda { get; } = new();

    public TimelineScheduleViewModel(ILogger<TimelineScheduleViewModel>? logger = null)
    {
        _logger = logger;
        GenerateCalendar(new DateTime(2026, 8, 1)); // Boot to August 2026
        
        // Auto-select "Today" (August 7)
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
                IsToday = (date.Year == 2026 && date.Month == 8 && date.Day == 7) // Simulated Today
            };

            // Inject Mock Event Indicators
            if (i == 5) dayModel.HasMissed = true;
            if (i == 7) { dayModel.HasActive = true; dayModel.HasDueToday = true; }
            if (i == 14) dayModel.HasUpcoming = true;

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

        if (date.Day == 7) // Today
        {
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "08:00 AM", CourseCode = "CS-201", Title = "Long Quiz", Type = "Introduction to Cryptography", Status = "Active Now", StatusColor = "#10B981" });
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "10:30 AM", CourseCode = "CS-201", Title = "Laboratory Exercise", Type = "Introduction to Cryptography", Status = "Upcoming", StatusColor = "#0EA5E9" });
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "11:59 PM", CourseCode = "CS-305", Title = "Assignment Submission", Type = "Database Systems", Status = "Due Today", StatusColor = "#F59E0B" });
        }
        else if (date.Day == 5) // Missed Example
        {
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "11:59 PM", CourseCode = "CS-305", Title = "Laboratory Exercise", Type = "Database Systems", Status = "Missed", StatusColor = "#EF4444" });
        }
        else if (date.Day == 14) // Locked/Future Example
        {
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "08:00 AM", CourseCode = "CS-305", Title = "Long Quiz", Type = "Database Systems", Status = "Locked", StatusColor = "#64748B" });
        }
        else
        {
            SelectedDayAgenda.Add(new AgendaItemModel { TimeText = "All Day", CourseCode = "---", Title = "No scheduled activities.", Type = "Rest Day", Status = "Clear", StatusColor = "#94A3B8" });
        }
    }
}
