namespace LmsOffline.Presentation.ViewModels;

using System;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using LmsOffline.Application.Interfaces;

public partial class CourseContentViewModel : ObservableObject
{
    private readonly IOfflineModuleRepository _moduleRepository;

    [ObservableProperty]
    private string _moduleTitle = "Select a module to begin";

    [ObservableProperty]
    private string _textContent = string.Empty;

    [ObservableProperty]
    private bool _isLoading;

    public CourseContentViewModel(IOfflineModuleRepository moduleRepository)
    {
        _moduleRepository = moduleRepository;
    }

    [RelayCommand]
    public async Task LoadModuleContentAsync(Guid moduleId)
    {
        IsLoading = true;
        
        // Fetch decrypted offline content from secure SQLite DB
        var offlineModule = await _moduleRepository.GetByIdAsync(moduleId);
        
        if (offlineModule != null)
        {
            ModuleTitle = offlineModule.Title;
            TextContent = offlineModule.DecryptedContentPayload; // e.g., Markdown or HTML string
        }
        else
        {
            ModuleTitle = "Module not found";
            TextContent = "The requested learning material is not available offline.";
        }

        IsLoading = false;
    }
}