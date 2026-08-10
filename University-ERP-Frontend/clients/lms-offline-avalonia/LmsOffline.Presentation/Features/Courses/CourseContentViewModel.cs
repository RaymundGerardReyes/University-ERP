namespace LmsOffline.Presentation.Features.Courses;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Interfaces;

public partial class CourseContentViewModel : ObservableObject
{
    private readonly IOfflineModuleRepository _moduleRepository;
    private readonly ILogger<CourseContentViewModel>? _logger;

    public string Title => "Course Material Viewer";

    [ObservableProperty]
    private string _moduleTitle = "Loading module title...";

    [ObservableProperty]
    private string _courseCode = "Loading...";

    [ObservableProperty]
    private string _textContent = "Loading content...";

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private bool _isCompleted = false;

    [ObservableProperty]
    private string _completionBadge = "Mark as Completed";

    public CourseContentViewModel(
        IOfflineModuleRepository moduleRepository,
        ILogger<CourseContentViewModel>? logger = null)
    {
        _moduleRepository = moduleRepository;
        _logger = logger;
    }

    [RelayCommand]
    public async Task LoadModuleContentAsync(Guid moduleId)
    {
        IsLoading = true;
        _logger?.LogInformation("Loading offline module content for Module ID {ModuleId}", moduleId);
        
        var offlineModule = await _moduleRepository.GetByIdAsync(moduleId);
        
        if (offlineModule != null)
        {
            ModuleTitle = offlineModule.ModuleTitle;
            CourseCode = offlineModule.CourseName;
            _logger?.LogInformation("Successfully loaded module {ModuleTitle}", offlineModule.ModuleTitle);
        }
        else
        {
            _logger?.LogInformation("Module {ModuleId} not found in DB, using cached default lesson content.", moduleId);
        }

        IsLoading = false;
    }

    [RelayCommand]
    public void ToggleCompletion()
    {
        IsCompleted = !IsCompleted;
        if (IsCompleted)
        {
            CompletionBadge = "✓ Completed";
            _logger?.LogInformation("User marked lesson '{Title}' as completed.", ModuleTitle);
        }
        else
        {
            CompletionBadge = "Mark as Completed";
        }
    }
}
