namespace LmsOffline.Presentation.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;

public partial class PackageManagerViewModel : ObservableObject
{
    // Identifies this ViewModel for UI binding if needed
    public string Title => "Package Library";
    
    [ObservableProperty]
    private string _storageUsage = "4.2 GB / 10.0 GB Used";

    [ObservableProperty]
    private string _signatureStatus = "Verified (SHA-256)";
}