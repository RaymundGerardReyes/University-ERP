namespace LmsOffline.Presentation.Features.Courses;

using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public partial class ResourceItemModel : ObservableObject
{
    public string FileId { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public string FileSize { get; set; } = string.Empty;
    
    [ObservableProperty]
    private bool _isDownloaded;

    [ObservableProperty]
    private bool _isDownloading;
}

public partial class ResourcesViewModel : ObservableObject
{
    private readonly ILogger<ResourcesViewModel>? _logger;

    public string Title => "Course Resources";

    [ObservableProperty]
    private string _statusMessage = "Select files to securely download for offline access.";

    public ObservableCollection<ResourceItemModel> CourseFiles { get; } = new();

    public ResourcesViewModel(ILogger<ResourcesViewModel>? logger = null)
    {
        _logger = logger;
        LoadMockResources();
    }

    private void LoadMockResources()
    {
        CourseFiles.Add(new ResourceItemModel 
        { 
            FileId = "RES-101", FileName = "CS101_Course_Syllabus.pdf", FileType = "PDF", FileSize = "1.2 MB", IsDownloaded = true 
        });
        CourseFiles.Add(new ResourceItemModel 
        { 
            FileId = "RES-102", FileName = "Week_5_Architecture_Slides.pptx", FileType = "Presentation", FileSize = "4.5 MB", IsDownloaded = false 
        });
        CourseFiles.Add(new ResourceItemModel 
        { 
            FileId = "RES-103", FileName = "SQLCipher_Implementation_Guide.pdf", FileType = "PDF", FileSize = "3.1 MB", IsDownloaded = false 
        });
    }

    [RelayCommand]
    public async Task DownloadResourceAsync(ResourceItemModel resource)
    {
        if (resource == null || resource.IsDownloaded || resource.IsDownloading) return;

        resource.IsDownloading = true;
        StatusMessage = $"Downloading {resource.FileName} securely...";
        _logger?.LogInformation("Initiating secure asset download for {FileId}", resource.FileId);

        // Simulate network delay and file writing
        await Task.Delay(2000);

        resource.IsDownloading = false;
        resource.IsDownloaded = true;
        
        StatusMessage = $"{resource.FileName} cached securely for offline viewing.";
        _logger?.LogInformation("Asset {FileId} downloaded and encrypted locally.", resource.FileId);
    }
}
