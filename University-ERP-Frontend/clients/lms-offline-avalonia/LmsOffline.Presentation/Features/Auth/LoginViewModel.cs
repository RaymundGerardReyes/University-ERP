namespace LmsOffline.Presentation.Features.Auth;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Features.AuthenticateStudent;
using LmsOffline.Infrastructure.Auth;
using LmsOffline.Domain.ValueObjects;
using LmsOffline.Presentation.ViewModels;
using LmsOffline.Presentation.Features.Dashboard;

public partial class LoginViewModel : ObservableObject
{
    private readonly ISender _sender;
    private readonly OfflineTokenCache _tokenCache;
    private readonly ILogger<LoginViewModel>? _logger;
    private readonly Action<ObservableObject>? _navigateToDashboard;

    public event EventHandler? LoginSucceeded;

    public string Title => "Student Portal Authentication";

    [ObservableProperty]
    private string _username = "alex.rivera@university.edu";

    [ObservableProperty]
    private string _password = "admin123";

    [ObservableProperty]
    private string _statusMessage = string.Empty;

    [ObservableProperty]
    private bool _isAuthenticating = false;

    // UI State Properties for the Enterprise Design System
    public bool HasStatusMessage => !string.IsNullOrWhiteSpace(StatusMessage);
    public string StatusBorderColor => StatusMessage.Contains("Error", StringComparison.OrdinalIgnoreCase) || StatusMessage.Contains("failed", StringComparison.OrdinalIgnoreCase) ? "#EF4444" : "#243247";
    public string StatusTextColor => StatusMessage.Contains("Error", StringComparison.OrdinalIgnoreCase) || StatusMessage.Contains("failed", StringComparison.OrdinalIgnoreCase) ? "#EF4444" : "#38BDF8";

    public LoginViewModel(
        ISender sender,
        OfflineTokenCache tokenCache,
        ILogger<LoginViewModel>? logger = null,
        Action<ObservableObject>? navigateToDashboard = null)
    {
        _sender = sender;
        _tokenCache = tokenCache;
        _logger = logger;
        _navigateToDashboard = navigateToDashboard;
    }

    [RelayCommand]
    public async Task AuthenticateAsync()
    {
        if (string.IsNullOrWhiteSpace(Username) || string.IsNullOrWhiteSpace(Password))
        {
            StatusMessage = "Please enter your credentials.";
            OnPropertyChanged(nameof(HasStatusMessage));
            OnPropertyChanged(nameof(StatusBorderColor));
            OnPropertyChanged(nameof(StatusTextColor));
            return;
        }

        IsAuthenticating = true;
        StatusMessage = string.Empty;
        OnPropertyChanged(nameof(HasStatusMessage));

        _logger?.LogInformation("Student initiating authentication via MediatR CQRS pipeline.");

        var cachedToken = _tokenCache.GetToken();
        if (cachedToken is not null && _tokenCache.IsSessionValid(DateTime.UtcNow))
        {
            _logger?.LogInformation("Reusing cached offline session for student {StudentId}.", cachedToken.StudentId);
            await Task.Delay(300);
            IsAuthenticating = false;
            LoginSucceeded?.Invoke(this, EventArgs.Empty);
            return;
        }

        _tokenCache.ClearCache();

        // Dispatch Command via MediatR (Clean Architecture)
        var command = new AuthenticateStudentCommand(Username, Password);
        var result = await _sender.Send(command);

        if (result.IsSuccess)
        {
            var authData = result.Value;

            // Cache token locally for 24-hour offline bounding
            var attemptToken = new AttemptToken(authData.TokenValue, DateTime.UtcNow, authData.StudentId.ToString());
            _tokenCache.CacheToken(attemptToken);

            _logger?.LogInformation("Authenticated student ID {StudentId} successfully.", authData.StudentId);
            IsAuthenticating = false;

            // Navigate to Dashboard
            if (_navigateToDashboard != null && LmsOffline.Presentation.App.Current?.Services != null)
            {
                var dashboardVm = (StudentDashboardViewModel?)LmsOffline.Presentation.App.Current.Services.GetService(typeof(StudentDashboardViewModel));
                if (dashboardVm != null)
                {
                    _navigateToDashboard(dashboardVm);
                }
            }
        }
        else
        {
            IsAuthenticating = false;
            StatusMessage = $"Authentication Error: {result.Error.Description}";
            OnPropertyChanged(nameof(HasStatusMessage));
            OnPropertyChanged(nameof(StatusBorderColor));
            OnPropertyChanged(nameof(StatusTextColor));
            _logger?.LogWarning("Authentication failed: {Error}", result.Error.Description);
        }
    }
}
