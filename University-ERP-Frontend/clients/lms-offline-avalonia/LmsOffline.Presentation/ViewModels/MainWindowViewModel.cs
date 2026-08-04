namespace LmsOffline.Presentation.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Collections.ObjectModel;
using System.Linq;

public partial class MainWindowViewModel : ObservableObject
{
    [ObservableProperty]
    private ObservableObject _currentPage;

    public ObservableCollection<ObservableObject> NavigationItems { get; } = new();

    public MainWindowViewModel(
        LearningTimelineViewModel timelineViewModel,
        PackageManagerViewModel packageManagerViewModel,
        SyncHubViewModel syncHubViewModel,
        DiagnosticsViewModel diagnosticsViewModel)
    {
        NavigationItems.Add(timelineViewModel);
        NavigationItems.Add(packageManagerViewModel);
        NavigationItems.Add(syncHubViewModel);
        NavigationItems.Add(diagnosticsViewModel);

        // Set default startup page
        _currentPage = timelineViewModel;
    }

    [RelayCommand]
    public void Navigate(ObservableObject page)
    {
        CurrentPage = page;
    }
}