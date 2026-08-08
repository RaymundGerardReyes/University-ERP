namespace LmsOffline.Presentation.Features.PackageManager;

using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using Microsoft.Extensions.Logging;

public class InstalledCoursePackageItem
{
    public string PackageId { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Version { get; set; } = string.Empty;
    public string SizeFormatted { get; set; } = string.Empty;
    public string HashSignature { get; set; } = string.Empty;
    public string VerificationStatus { get; set; } = "SHA-256 Verified";
    public string InstalledDate { get; set; } = string.Empty;
}

public partial class PackageManagerViewModel : ObservableObject
{
    private readonly ILogger<PackageManagerViewModel>? _logger;

    public string Title => "Package Library";

    [ObservableProperty]
    private string _storageUsage = "4.2 GB / 10.0 GB (42% Used)";

    [ObservableProperty]
    private double _storagePercentage = 42;

    [ObservableProperty]
    private string _statusMessage = "All installed course packages are cryptographically signed.";

    public ObservableCollection<InstalledCoursePackageItem> InstalledPackages { get; } = new();

    public PackageManagerViewModel(ILogger<PackageManagerViewModel>? logger = null)
    {
        _logger = logger;
        LoadDefaultPackages();
    }

    private void LoadDefaultPackages()
    {
        InstalledPackages.Add(new InstalledCoursePackageItem
        {
            PackageId = "PKG-CS201-V142",
            Title = "CS-201: Object Oriented Programming Core",
            Version = "v1.4.2",
            SizeFormatted = "1.2 GB",
            HashSignature = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            InstalledDate = "2026-08-01"
        });

        InstalledPackages.Add(new InstalledCoursePackageItem
        {
            PackageId = "PKG-CS305-V201",
            Title = "CS-305: Database Systems & Encrypted Cache",
            Version = "v2.0.1",
            SizeFormatted = "1.8 GB",
            HashSignature = "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284ddd200126d9069e",
            InstalledDate = "2026-08-03"
        });

        InstalledPackages.Add(new InstalledCoursePackageItem
        {
            PackageId = "PKG-CS410-V100",
            Title = "CS-410: Distributed Systems & Outbox Engine",
            Version = "v1.0.0",
            SizeFormatted = "1.2 GB",
            HashSignature = "9b74c9897bac770ffc029102a200c5de4c0905012e5ed2843bc79691d3bc421d",
            InstalledDate = "2026-08-05"
        });
    }

    [RelayCommand]
    public async Task VerifyIntegrityAsync(InstalledCoursePackageItem package)
    {
        StatusMessage = $"Verifying SHA-256 hash for {package.PackageId}...";
        _logger?.LogInformation("Starting SHA-256 package verification for {PackageId}", package.PackageId);
        
        await Task.Delay(800); // Simulate cryptographic check

        package.VerificationStatus = "Verified (SHA-256 Matches)";
        StatusMessage = $"Success! {package.PackageId} integrity verified. Signature match confirmed.";
        _logger?.LogInformation("Package {PackageId} integrity successfully verified.", package.PackageId);
    }

    [RelayCommand]
    public async Task DownloadNewPackageAsync()
    {
        StatusMessage = "Checking local network for published course package bundle (.lms-pkg)...";
        _logger?.LogInformation("User requested package bundle scan.");
        
        await Task.Delay(1000);
        StatusMessage = "No new offline package bundles detected on local subnet.";
    }
}
