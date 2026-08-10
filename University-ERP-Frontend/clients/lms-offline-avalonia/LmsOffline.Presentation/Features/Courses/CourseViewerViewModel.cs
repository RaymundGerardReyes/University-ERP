namespace LmsOffline.Presentation.Features.Courses;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;
using MediatR;
using LmsOffline.Application.Features.PackageManager;
using System.Linq;
using System.Threading.Tasks;

public partial class CourseViewerViewModel : ObservableObject
{
    private readonly IMediator _mediator;
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

    public CourseViewerViewModel(IMediator mediator, ILogger<CourseViewerViewModel>? logger = null)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public async Task InitializeAsync(string courseCode)
    {
        var result = await _mediator.Send(new GetInstalledPackagesQuery());
        if (result.IsSuccess && result.Value != null)
        {
            var package = result.Value.FirstOrDefault(p => p.CourseCode == courseCode);
            if (package != null)
            {
                CourseTitle = $"{package.CourseCode} - {package.Title}";
                Instructor = package.Instructor;
                CourseDescription = "Course downloaded and available offline.";
                CourseProgress = package.TotalLessons > 0 ? ((double)package.CompletedLessons / package.TotalLessons) * 100 : 0;
            }
        }
    }

    [RelayCommand]
    public void StartNextModule()
    {
        _logger?.LogInformation("Student clicked Start Next Module for {Course}", CourseTitle);
    }
}
