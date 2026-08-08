using Avalonia;
using Avalonia.Controls;
using Avalonia.Input;
using Avalonia.Threading;
using System;
using LmsOffline.Presentation.ViewModels;

namespace LmsOffline.Presentation;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
#if DEBUG
        this.AttachDevTools();
#endif
        this.SizeChanged += OnWindowSizeChanged;
        this.Opened += MainWindow_Opened;
    }

    private void MainWindow_Opened(object? sender, EventArgs e)
    {
        // Window is now using standard OS decorations — no DPI hacks needed.
    }

    private void OnWindowSizeChanged(object? sender, SizeChangedEventArgs e)
    {
        var splitView = this.FindControl<SplitView>("MainSplitView");
        var viewModel = this.DataContext as MainWindowViewModel;

        if (splitView != null)
        {
            // If we are on the login screen, we don't want the sidebar to take up any space
            if (viewModel != null && !viewModel.IsLoggedIn)
            {
                splitView.DisplayMode = SplitViewDisplayMode.Overlay;
                splitView.IsPaneOpen = false;
                return;
            }

            // Standard responsive layout for the application shell
            if (e.NewSize.Width < 900)
            {
                splitView.DisplayMode = SplitViewDisplayMode.Overlay;
                splitView.IsPaneOpen = false;
            }
            else if (e.NewSize.Width < 1280)
            {
                splitView.DisplayMode = SplitViewDisplayMode.CompactInline;
                splitView.IsPaneOpen = false;
            }
            else
            {
                splitView.DisplayMode = SplitViewDisplayMode.Inline;
                splitView.IsPaneOpen = true;
            }
        }
    }
}