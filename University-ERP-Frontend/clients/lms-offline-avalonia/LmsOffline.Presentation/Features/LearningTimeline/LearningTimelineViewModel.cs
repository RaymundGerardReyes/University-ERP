namespace LmsOffline.Presentation.Features.LearningTimeline;

using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;
using MediatR;
using LmsOffline.Application.Features.PackageManager;

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
    private readonly IMediator _mediator;
    private readonly ILogger<LearningTimelineViewModel>? _logger;

    public string Title => "Learning Timeline";

    [ObservableProperty]
    private string _searchQuery = string.Empty;

    [ObservableProperty]
    private OfflineCourseModuleItem? _selectedModule;

    [ObservableProperty]
    private string _statusMessage = "Select a course module to review your offline learning progression.";

    public ObservableCollection<OfflineCourseModuleItem> CourseModules { get; } = new();

    public LearningTimelineViewModel(IMediator mediator, ILogger<LearningTimelineViewModel>? logger = null)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public async Task InitializeAsync()
    {
        var result = await _mediator.Send(new GetInstalledPackagesQuery());
        if (result.IsSuccess && result.Value != null)
        {
            CourseModules.Clear();
            foreach (var package in result.Value)
            {
                CourseModules.Add(new OfflineCourseModuleItem
                {
                    CourseCode = package.CourseCode,
                    ModuleTitle = package.Title,
                    Instructor = package.Instructor,
                    CompletedLessons = package.CompletedLessons,
                    TotalLessons = package.TotalLessons,
                    NextMilestone = "Continue Learning",
                    StatusBadge = package.TotalLessons > 0 ? $"{(int)((double)package.CompletedLessons / package.TotalLessons * 100)}% Complete" : "0% Complete"
                });
            }
            SelectedModule = CourseModules.FirstOrDefault();
        }
    }

    [RelayCommand]
    public void SelectModule(OfflineCourseModuleItem module)
    {
        SelectedModule = module;
        StatusMessage = $"Active module: {module.CourseCode} - {module.ModuleTitle}";
        _logger?.LogInformation("User selected offline course module: {CourseCode}", module.CourseCode);
    }
}
