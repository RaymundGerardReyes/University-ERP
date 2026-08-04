namespace LmsOffline.Presentation.ViewModels;

using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MediatR;
using System.Threading.Tasks;
using LmsOffline.Application.Features.Diagnostics;

public partial class DiagnosticsViewModel : ObservableObject
{
    private readonly ISender _sender;
    
    public string Title => "Diagnostics & Security";

    [ObservableProperty]
    private string _databaseEngine = "Checking...";

    [ObservableProperty]
    private string _storageUsed = "Checking...";

    [ObservableProperty]
    private bool _isEncrypted = false;

    public DiagnosticsViewModel(ISender sender)
    {
        _sender = sender;
        _ = LoadDiagnosticsAsync(); // Auto-load on creation
    }

    [RelayCommand]
    public async Task LoadDiagnosticsAsync()
    {
        var result = await _sender.Send(new GetSystemHealthQuery());
        
        DatabaseEngine = result.DatabaseEngine;
        StorageUsed = result.StorageUsed;
        IsEncrypted = result.IsEncrypted;
    }
}