namespace LmsOffline.Presentation.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Microsoft.Extensions.Logging;
using Avalonia;
using LmsOffline.Presentation.Features.Auth;
using LmsOffline.Presentation.Features.Dashboard;
using LmsOffline.Presentation.Features.Calendar;
using LmsOffline.Presentation.Features.Courses;
using LmsOffline.Presentation.Features.Assessments;

public class TaxonomyNode : ObservableObject
{
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Icon { get; set; } = "📁";
    
    // Rich Course Workspace Properties
    public bool IsCourseRoot { get; set; } = false;
    public double Progress { get; set; } = 0;
    public string StatusText { get; set; } = string.Empty;
    public string AlertText { get; set; } = string.Empty;
    public string AlertColor { get; set; } = "Transparent";

    public ObservableCollection<TaxonomyNode> Children { get; } = new();
    public ObservableObject? TargetViewModel { get; set; }
    public bool IsExpanded { get; set; } = false;
}

public partial class MainWindowViewModel : ObservableObject
{
    private readonly ILogger<MainWindowViewModel>? _logger;

    [ObservableProperty]
    private ObservableObject _currentPage;

    [ObservableProperty]
    private bool _isOnlineMode = false;

    [ObservableProperty]
    private string _networkStatus = "Offline (Vault Active)";

    [ObservableProperty]
    private string _networkStatusColor = "#f59e0b"; // Warning amber

    [ObservableProperty]
    private int _pendingOutboxCount = 2;

    [ObservableProperty]
    private bool _isLoggedIn = false;

    private readonly LmsOffline.Presentation.Features.Dashboard.StudentDashboardViewModel _dashboardViewModel;

    // Standard Flat Navigation
    public ObservableCollection<ObservableObject> NavigationItems { get; } = new();

    // Hierarchical Taxonomy Navigation
    public ObservableCollection<TaxonomyNode> TaxonomyNodes { get; } = new();

    [ObservableProperty]
    private string _courseSearchQuery = string.Empty;

    [ObservableProperty]
    private TaxonomyNode? _selectedNode;

    public MainWindowViewModel(
        LmsOffline.Presentation.Features.Auth.LoginViewModel loginViewModel,
        LmsOffline.Presentation.Features.Dashboard.StudentDashboardViewModel dashboardViewModel,
        LmsOffline.Presentation.Features.Courses.CourseViewerViewModel courseViewerViewModel,
        LmsOffline.Presentation.Features.Assessments.LogicQuizViewModel logicQuizViewModel,
        LmsOffline.Presentation.Features.Courses.ActivityHubViewModel activityHubViewModel,
        LmsOffline.Presentation.Features.Calendar.TimelineScheduleViewModel timelineScheduleViewModel,
        LmsOffline.Presentation.Features.PackageManager.PackageManagerViewModel packageManagerViewModel,
        LmsOffline.Presentation.Features.Grades.GradesViewModel gradesViewModel,
        LmsOffline.Presentation.Features.Courses.ResourcesViewModel resourcesViewModel,
        ILogger<MainWindowViewModel>? logger = null)
    {
        _logger = logger;
        _dashboardViewModel = dashboardViewModel;

        // Base Flat Items
        NavigationItems.Add(dashboardViewModel);
        NavigationItems.Add(timelineScheduleViewModel);

        // Build the Flattened Learner-Centric Taxonomy
        BuildCourseTaxonomy(courseViewerViewModel, activityHubViewModel, logicQuizViewModel, packageManagerViewModel, gradesViewModel, resourcesViewModel);

        // Subscribe to login success
        loginViewModel.LoginSucceeded += (s, e) =>
        {
            IsLoggedIn = true;
            _dashboardViewModel.Initialize();
            CurrentPage = _dashboardViewModel;
            _logger?.LogInformation("Login successful. Routing to Student Dashboard.");
        };

        // Set default startup page
        _currentPage = loginViewModel;
    }

    private void BuildCourseTaxonomy(
        LmsOffline.Presentation.Features.Courses.CourseViewerViewModel courseViewer, 
        LmsOffline.Presentation.Features.Courses.ActivityHubViewModel labActivity, 
        LmsOffline.Presentation.Features.Assessments.LogicQuizViewModel quiz,
        LmsOffline.Presentation.Features.PackageManager.PackageManagerViewModel packageManager,
        LmsOffline.Presentation.Features.Grades.GradesViewModel gradesViewModel,
        LmsOffline.Presentation.Features.Courses.ResourcesViewModel resourcesViewModel)
    {
        // CS101 Course Root
        var cs101 = new TaxonomyNode 
        { 
            Title = "CS101", 
            Subtitle = "Introduction to Programming",
            Icon = "📘", 
            IsExpanded = true,
            IsCourseRoot = true,
            Progress = 73,
            StatusText = "Module 5 of 8",
            AlertText = "● Quiz Tomorrow",
            AlertColor = "#F59E0B", // Warning/Amber
            TargetViewModel = courseViewer
        };
        cs101.Children.Add(new TaxonomyNode { Title = "Overview", Icon = "📊", TargetViewModel = courseViewer });
        cs101.Children.Add(new TaxonomyNode { Title = "Modules", Icon = "📑", TargetViewModel = courseViewer });
        cs101.Children.Add(new TaxonomyNode { Title = "Assignments", Icon = "📝", TargetViewModel = labActivity });
        cs101.Children.Add(new TaxonomyNode { Title = "Quizzes", Icon = "🧠", TargetViewModel = quiz });
        cs101.Children.Add(new TaxonomyNode { Title = "Grades", Icon = "📈", TargetViewModel = gradesViewModel });
        cs101.Children.Add(new TaxonomyNode { Title = "Resources", Icon = "📦", TargetViewModel = resourcesViewModel });

        // Other Enrolled Courses
        var cs203 = new TaxonomyNode 
        { 
            Title = "CS203", 
            Subtitle = "Data Structures and Algorithms",
            Icon = "📗", 
            IsCourseRoot = true,
            Progress = 40,
            StatusText = "Module 3 of 6",
            TargetViewModel = courseViewer 
        };
        cs203.Children.Add(new TaxonomyNode { Title = "Overview", Icon = "📊", TargetViewModel = courseViewer });
        cs203.Children.Add(new TaxonomyNode { Title = "Modules", Icon = "📑", TargetViewModel = courseViewer });
        cs203.Children.Add(new TaxonomyNode { Title = "Assignments", Icon = "📝", TargetViewModel = labActivity });
        cs203.Children.Add(new TaxonomyNode { Title = "Quizzes", Icon = "🧠", TargetViewModel = quiz });
        cs203.Children.Add(new TaxonomyNode { Title = "Grades", Icon = "📈", TargetViewModel = gradesViewModel });
        cs203.Children.Add(new TaxonomyNode { Title = "Resources", Icon = "📦", TargetViewModel = resourcesViewModel });
        
        var cs305 = new TaxonomyNode 
        { 
            Title = "CS305", 
            Subtitle = "Database Systems Design",
            Icon = "📙", 
            IsCourseRoot = true,
            Progress = 100,
            StatusText = "Course Completed",
            AlertText = "✓ All Passed",
            AlertColor = "#10B981", // Success/Green
            TargetViewModel = courseViewer 
        };
        cs305.Children.Add(new TaxonomyNode { Title = "Overview", Icon = "📊", TargetViewModel = courseViewer });
        cs305.Children.Add(new TaxonomyNode { Title = "Modules", Icon = "📑", TargetViewModel = courseViewer });
        cs305.Children.Add(new TaxonomyNode { Title = "Assignments", Icon = "📝", TargetViewModel = labActivity });
        cs305.Children.Add(new TaxonomyNode { Title = "Quizzes", Icon = "🧠", TargetViewModel = quiz });
        cs305.Children.Add(new TaxonomyNode { Title = "Grades", Icon = "📈", TargetViewModel = gradesViewModel });
        cs305.Children.Add(new TaxonomyNode { Title = "Resources", Icon = "📦", TargetViewModel = resourcesViewModel });
        
        var ge101 = new TaxonomyNode 
        { 
            Title = "GE101", 
            Subtitle = "Understanding the Self",
            Icon = "📓", 
            IsCourseRoot = true,
            Progress = 15,
            StatusText = "Module 1 of 4",
            AlertText = "● Activity Due",
            AlertColor = "#EF4444", // Danger/Red
            TargetViewModel = courseViewer 
        };
        ge101.Children.Add(new TaxonomyNode { Title = "Overview", Icon = "📊", TargetViewModel = courseViewer });
        ge101.Children.Add(new TaxonomyNode { Title = "Modules", Icon = "📑", TargetViewModel = courseViewer });
        ge101.Children.Add(new TaxonomyNode { Title = "Assignments", Icon = "📝", TargetViewModel = labActivity });
        ge101.Children.Add(new TaxonomyNode { Title = "Quizzes", Icon = "🧠", TargetViewModel = quiz });
        ge101.Children.Add(new TaxonomyNode { Title = "Grades", Icon = "📈", TargetViewModel = gradesViewModel });
        ge101.Children.Add(new TaxonomyNode { Title = "Resources", Icon = "📦", TargetViewModel = resourcesViewModel });

        TaxonomyNodes.Add(cs101);
        TaxonomyNodes.Add(cs203);
        TaxonomyNodes.Add(cs305);
        TaxonomyNodes.Add(ge101);
    }

    // Triggers navigation and expansion automatically when a student clicks a node container
    partial void OnSelectedNodeChanged(TaxonomyNode? value)
    {
        if (value != null)
        {
            // 1. Log the exact UI element interaction
            _logger?.LogInformation("[UI EVENT] Student clicked Course Card / Node: '{NodeTitle}'", value.Title);

            // UX FIX: Divert the expand/collapse logic to the entire container click!
            value.IsExpanded = !value.IsExpanded;
            
            // 2. Log the resulting state change of the UI
            _logger?.LogInformation("[UI STATE] Node '{NodeTitle}' IsExpanded set to: {IsExpanded}", value.Title, value.IsExpanded);

            // Route to the target page if one exists
            if (value.TargetViewModel != null)
            {
                CurrentPage = value.TargetViewModel;
                
                // 3. Log the successful UI navigation (Matching your existing app.log format)
                _logger?.LogInformation("Navigated to nested taxonomy node: {PageTypeName}", value.TargetViewModel.GetType().Name);
            }
            else
            {
                // 4. Log a warning if the UI element is missing a target page
                _logger?.LogWarning("[UI WARNING] Node '{NodeTitle}' was clicked, but it has no TargetViewModel assigned!", value.Title);
            }
        }
    }

    [RelayCommand]
    public void Navigate(ObservableObject page)
    {
        CurrentPage = page;
        // Clear tree selection when using flat nav buttons
        SelectedNode = null; 
        _logger?.LogInformation("Navigated to page view: {PageTypeName}", page.GetType().Name);
    }

    [RelayCommand]
    public void ToggleNetworkMode()
    {
        IsOnlineMode = !IsOnlineMode;
        if (IsOnlineMode)
        {
            NetworkStatus = "Online (Connected)";
            NetworkStatusColor = "#10b981"; 
        }
        else
        {
            NetworkStatus = "Offline (Vault Active)";
            NetworkStatusColor = "#f59e0b"; 
        }
    }

    [RelayCommand]
    public void ToggleTheme()
    {
        if (Avalonia.Application.Current != null)
        {
            var isCurrentlyDark = Avalonia.Application.Current.RequestedThemeVariant == Avalonia.Styling.ThemeVariant.Default || 
                                   Avalonia.Application.Current.RequestedThemeVariant == Avalonia.Styling.ThemeVariant.Dark;
                                   
            Avalonia.Application.Current.RequestedThemeVariant = isCurrentlyDark ? Avalonia.Styling.ThemeVariant.Light : Avalonia.Styling.ThemeVariant.Dark;
        }
    }
}