namespace LmsOffline.Presentation.Features.Courses;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public partial class CourseViewerViewModel : ObservableObject
{
    private readonly ILogger<CourseViewerViewModel>? _logger;

    public string Title => "Course Overview";

    [ObservableProperty]
    private string _courseTitle = "CS101 - Introduction to Programming";

    [ObservableProperty]
    private string _instructor = "Prof. Grace Hopper";

    [ObservableProperty]
    private string _courseDescription = "An introduction to algorithmic thinking, data structures, and object-oriented programming concepts. This course is fully downloaded and available offline.";

    [ObservableProperty]
    private double _courseProgress = 35.5;

    public CourseViewerViewModel(ILogger<CourseViewerViewModel>? logger = null)
    {
        _logger = logger;
    }

    [RelayCommand]
    public void StartNextModule()
    {
        _logger?.LogInformation("Student clicked Start Next Module for {Course}", CourseTitle);
    }
}
