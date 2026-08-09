namespace LmsOffline.Presentation.Services;

using System;
using System.Collections.Generic;
using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using LmsOffline.Application.Interfaces;

/// <summary>
/// Monitors window focus state and enforces clipboard security during offline exams.
/// </summary>
public class AvaloniaExamIntegrityService : IExamIntegrityService
{
    private readonly List<IntegrityViolation> _violations = new();
    private bool _isMonitoring = false;
    private Window? _mainWindow;

    public void StartMonitoring()
    {
        _violations.Clear();
        _isMonitoring = true;

        if (Application.Current?.ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            _mainWindow = desktop.MainWindow;
            if (_mainWindow != null)
            {
                // Hook into Window Deactivation (User navigated away from the app)
                _mainWindow.Deactivated += OnWindowDeactivated;
            }
        }
        
        ClearClipboard();
    }

    public void StopMonitoring()
    {
        _isMonitoring = false;
        if (_mainWindow != null)
        {
            _mainWindow.Deactivated -= OnWindowDeactivated;
        }
    }

    public IReadOnlyList<IntegrityViolation> GetViolations()
    {
        return _violations.AsReadOnly();
    }

    public void ClearClipboard()
    {
        if (_mainWindow?.Clipboard != null)
        {
            _mainWindow.Clipboard.ClearAsync();
        }
    }

    private void OnWindowDeactivated(object? sender, EventArgs e)
    {
        if (!_isMonitoring) return;

        // Record the focus violation
        _violations.Add(new IntegrityViolation
        {
            TimestampUtc = DateTime.UtcNow,
            ViolationType = "FocusLost",
            Details = "The student navigated away from the active examination window."
        });

        // Clear clipboard immediately upon losing focus
        ClearClipboard();
    }
}
