namespace LmsOffline.Presentation.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using Microsoft.Extensions.Logging;
using Avalonia;
using Avalonia.Styling;

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
    private string _encryptionBadge = "SQLCipher AES-256";

    [ObservableProperty]
    private bool _isLoggedIn = false;

    private readonly StudentDashboardViewModel _dashboardViewModel;

    public ObservableCollection<ObservableObject> NavigationItems { get; } = new();

    public MainWindowViewModel(
        LoginViewModel loginViewModel,
        StudentDashboardViewModel dashboardViewModel,
        LogicQuizViewModel logicQuizViewModel,
        ActivityHubViewModel activityHubViewModel,
        TimelineScheduleViewModel timelineScheduleViewModel,
        LearningTimelineViewModel learningTimelineViewModel,
        PackageManagerViewModel packageManagerViewModel,
        SyncHubViewModel syncHubViewModel,
        DiagnosticsViewModel diagnosticsViewModel,
        ILogger<MainWindowViewModel>? logger = null)
    {
        _logger = logger;
        _dashboardViewModel = dashboardViewModel;

        NavigationItems.Add(dashboardViewModel);
        NavigationItems.Add(logicQuizViewModel);
        NavigationItems.Add(activityHubViewModel);
        NavigationItems.Add(timelineScheduleViewModel);
        NavigationItems.Add(learningTimelineViewModel);
        NavigationItems.Add(packageManagerViewModel);
        NavigationItems.Add(syncHubViewModel);
        NavigationItems.Add(diagnosticsViewModel);

        // Subscribe to login success
        loginViewModel.LoginSucceeded += (s, e) =>
        {
            IsLoggedIn = true;
            CurrentPage = _dashboardViewModel;
            _logger?.LogInformation("Login successful. Routing to Student Dashboard.");
        };

        // Set default startup page to LoginView
        _currentPage = loginViewModel;
        _logger?.LogInformation("MainWindowViewModel initialized with {ItemCount} primary student navigation sections.", NavigationItems.Count);
    }

    [RelayCommand]
    public void Navigate(ObservableObject page)
    {
        CurrentPage = page;
        _logger?.LogInformation("Navigated to page view: {PageTypeName}", page.GetType().Name);
    }

    [RelayCommand]
    public void ToggleNetworkMode()
    {
        IsOnlineMode = !IsOnlineMode;
        if (IsOnlineMode)
        {
            NetworkStatus = "Online (Connected)";
            NetworkStatusColor = "#10b981"; // Emerald green
            _logger?.LogInformation("Network connectivity mode toggled to ONLINE.");
        }
        else
        {
            NetworkStatus = "Offline (Vault Active)";
            NetworkStatusColor = "#f59e0b"; // Warning amber
            _logger?.LogInformation("Network connectivity mode toggled to OFFLINE.");
        }
    }

    [RelayCommand]
    public void ToggleTheme()
    {
        // FIXED: Explicitly calling Avalonia.Application so it doesn't conflict with LmsOffline.Application
        if (Avalonia.Application.Current != null)
        {
            var isCurrentlyDark = Avalonia.Application.Current.RequestedThemeVariant == Avalonia.Styling.ThemeVariant.Default || 
                                  Avalonia.Application.Current.RequestedThemeVariant == Avalonia.Styling.ThemeVariant.Dark;
                                  
            Avalonia.Application.Current.RequestedThemeVariant = isCurrentlyDark ? Avalonia.Styling.ThemeVariant.Light : Avalonia.Styling.ThemeVariant.Dark;
            _logger?.LogInformation("Theme toggled to {ThemeVariant}", Avalonia.Application.Current.RequestedThemeVariant.Key);
        }
    }
}