namespace LmsOffline.Presentation.ViewModels;

using System.Collections.ObjectModel;
using System.Linq;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public class OfflineCourseModuleItem
{
    public string CourseCode { get; set; } = string.Empty;
    public string ModuleTitle { get; set; } = string.Empty;
    public string Instructor { get; set; } = string.Empty;
    public int CompletedLessons { get; set; }
    public int TotalLessons { get; set; }
    public double ProgressPercentage => TotalLessons > 0 ? (double)CompletedLessons / TotalLessons * 100 : 0;
    public string NextMilestone { get; set; } = string.Empty;
    public string StatusBadge { get; set; } = "In Progress";
}

public partial class LearningTimelineViewModel : ObservableObject
{
    private readonly ILogger<LearningTimelineViewModel>? _logger;

    public string Title => "Learning Timeline";

    [ObservableProperty]
    private string _searchQuery = string.Empty;

    [ObservableProperty]
    private OfflineCourseModuleItem? _selectedModule;

    [ObservableProperty]
    private string _statusMessage = "Select a course module to review your offline learning progression.";

    public ObservableCollection<OfflineCourseModuleItem> CourseModules { get; } = new();

    public LearningTimelineViewModel(ILogger<LearningTimelineViewModel>? logger = null)
    {
        _logger = logger;
        LoadDefaultModules();
    }

    private void LoadDefaultModules()
    {
        CourseModules.Add(new OfflineCourseModuleItem
        {
            CourseCode = "CS-201",
            ModuleTitle = "Object-Oriented Programming & Design",
            Instructor = "Dr. Alan Turing",
            CompletedLessons = 8,
            TotalLessons = 10,
            NextMilestone = "Week 4: Encapsulation & Polymorphism Exam",
            StatusBadge = "80% Complete"
        });

        CourseModules.Add(new OfflineCourseModuleItem
        {
            CourseCode = "CS-305",
            ModuleTitle = "Database Systems & SQLCipher Architecture",
            Instructor = "Prof. Grace Hopper",
            CompletedLessons = 5,
            TotalLessons = 12,
            NextMilestone = "Encrypted SQLite Transactions Workshop",
            StatusBadge = "41% Complete"
        });

        CourseModules.Add(new OfflineCourseModuleItem
        {
            CourseCode = "CS-410",
            ModuleTitle = "Distributed Systems & Outbox Sync Patterns",
            Instructor = "Dr. Leslie Lamport",
            CompletedLessons = 12,
            TotalLessons = 12,
            NextMilestone = "Final Research Submission",
            StatusBadge = "100% Completed"
        });

        SelectedModule = CourseModules.FirstOrDefault();
    }

    [RelayCommand]
    public void SelectModule(OfflineCourseModuleItem module)
    {
        SelectedModule = module;
        StatusMessage = $"Active module: {module.CourseCode} - {module.ModuleTitle}";
        _logger?.LogInformation("User selected offline course module: {CourseCode}", module.CourseCode);
    }
}