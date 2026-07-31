using System;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Microsoft.Extensions.DependencyInjection;
using MediatR;
using LmsOffline.Application.Features.StartOfflineAssessment;
using LmsOffline.Infrastructure.Data;
using LmsOffline.Infrastructure.Repositories;
using LmsOffline.Infrastructure.Auth;
using LmsOffline.Infrastructure.Sync;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Policies;
using LmsOffline.Presentation.ViewModels;

namespace LmsOffline.Presentation;

public partial class App : Application
{
    public new static App? Current => Application.Current as App;
    
    // The main Dependency Injection Container for the Avalonia App
    public IServiceProvider? Services { get; private set; }

    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        Services = ConfigureServices();

        if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            // Resolve the ViewModel and inject it into the MainWindow
            desktop.MainWindow = new MainWindow
            {
                DataContext = Services.GetRequiredService<AssessmentViewModel>()
            };
        }

        base.OnFrameworkInitializationCompleted();
    }

    private static IServiceProvider ConfigureServices()
    {
        var services = new ServiceCollection();

        // 1. Register Infrastructure (Encrypted SQLite Database, Repositories, Auth & Sync)
        services.AddSingleton(sp => new EncryptedSqliteContext("lms_offline.db", "offline_exam_secure_passphrase_2026"));
        services.AddScoped<IOfflineAssessmentRepository, OfflineAssessmentRepository>();
        services.AddScoped<IOfflineModuleRepository, OfflineModuleRepository>();
        services.AddScoped<IOfflineAssignmentRepository, OfflineAssignmentRepository>();
        services.AddSingleton<OfflineTokenCache>();
        services.AddTransient<OutboxSyncProcessor>();

        // 2. Register Domain Policies
        services.AddSingleton<WindowEnforcementPolicy>();

        // 3. Register MediatR (Application Layer commands)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(StartOfflineAssessmentCommand).Assembly));

        // 4. Register MVVM ViewModels
        services.AddTransient<AssessmentViewModel>();
        services.AddTransient<AssignmentSubmissionViewModel>();
        services.AddTransient<ModuleTimelineViewModel>();

        return services.BuildServiceProvider();
    }
}