using System;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Markup.Xaml;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MediatR;
using LmsOffline.Application.Features.StartOfflineAssessment;
using LmsOffline.Infrastructure.Persistence;
using LmsOffline.Infrastructure.Repositories;
using LmsOffline.Infrastructure.Persistence.Repositories;
using LmsOffline.Infrastructure.Auth;
using LmsOffline.Infrastructure.Sync;
using LmsOffline.Infrastructure.Data;
using LmsOffline.Infrastructure.Security;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Policies;
using LmsOffline.Presentation.ViewModels;
using LmsOffline.Presentation.Features.Auth;
using LmsOffline.Presentation.Features.Dashboard;
using LmsOffline.Presentation.Features.Calendar;
using LmsOffline.Presentation.Features.Courses;
using LmsOffline.Presentation.Features.Assessments;
using LmsOffline.Presentation.Features.LearningTimeline;
using LmsOffline.Presentation.Features.PackageManager;
using LmsOffline.Presentation.Features.SyncHub;
using LmsOffline.Presentation.Services;

namespace LmsOffline.Presentation;

public partial class App : Avalonia.Application
{
    public new static App? Current => Avalonia.Application.Current as App;
    
    // The main Dependency Injection Container for the Avalonia App
    public IServiceProvider? Services { get; private set; }

    public override void Initialize()
    {
        AvaloniaXamlLoader.Load(this);
    }

    public override void OnFrameworkInitializationCompleted()
    {
        try
        {
            // FORCE the provider to e_sqlcipher to override any implicit e_sqlite3 transitive dependencies
            SQLitePCL.raw.SetProvider(new SQLitePCL.SQLite3Provider_e_sqlcipher());
            SQLitePCL.Batteries_V2.Init();
        }
        catch
        {
            // Fallback if native provider already initialized
        }

        try
        {
            Services = ConfigureServices();

            var logger = Services.GetRequiredService<ILogger<App>>();
            logger.LogInformation("==================================================");
            logger.LogInformation("LMS Offline Avalonia Client Bootstrapping...");
            logger.LogInformation("SQLCipher AES-256 Engine Initialized.");

            // Ensure local SQLite database and schema exist
            using (var scope = Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<LmsOffline.Infrastructure.Persistence.EncryptedSqliteContext>();
                
                // Ensure local SQLite database and schema exist
                dbContext.Database.EnsureCreated();
                logger.LogInformation("Encrypted SQLite Database schema validated successfully.");
            }

            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                // Resolve the ViewModel and inject it into the MainWindow
                desktop.MainWindow = new MainWindow
                {
                    DataContext = Services.GetRequiredService<MainWindowViewModel>()
                };
                logger.LogInformation("MainWindow UI rendering started.");
            }
        }
        catch (Exception ex)
        {
            System.IO.File.WriteAllText("crash.log", ex.ToString());
            throw;
        }

        base.OnFrameworkInitializationCompleted();
    }

    private static IServiceProvider ConfigureServices()
    {
        var services = new ServiceCollection();

        // 0. Register Logging System (Console + app.log FileLogger)
        services.AddLogging(builder =>
        {
            builder.AddConsole();
            builder.AddProvider(new FileLoggerProvider("app.log"));
            builder.SetMinimumLevel(LogLevel.Information);
        });

        // 1. Register HTTP Client
        services.AddHttpClient();

        // Register Identity & Hashing Services
        services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<IOfflineIdentityRepository, LmsOffline.Infrastructure.Repositories.OfflineIdentityRepository>();
        services.AddTransient<LmsOffline.Presentation.Features.Auth.LoginViewModel>();
        //   Register Infrastructure (Encrypted SQLite Database, Repositories, Diagnostics, Auth & Sync)
        services.AddScoped<IExternalIdentityService, ExternalIdentityService>();

        // 2. Register Infrastructure (Encrypted SQLite Database, Repositories, Diagnostics, Auth & Sync)
        services.AddSingleton(sp => new LmsOffline.Infrastructure.Persistence.EncryptedSqliteContext("lms_offline.db", "offline_exam_secure_passphrase_2026"));
        services.AddScoped<IOfflineIdentityRepository, LmsOffline.Infrastructure.Repositories.OfflineIdentityRepository>();
        services.AddScoped<IOfflineAssessmentRepository, OfflineAssessmentRepository>();
        services.AddScoped<IOfflineModuleRepository, OfflineModuleRepository>();
        services.AddScoped<IOfflineAssignmentRepository, OfflineAssignmentRepository>();
        services.AddScoped<ILocalGradeRepository, GradeRepository>();
        services.AddScoped<ILocalPackageRepository, LocalPackageRepository>();
        services.AddScoped<IDashboardRepository, DashboardRepository>();
        services.AddSingleton<ILocalStorageDiagnostics, SqliteStorageDiagnostics>();
        services.AddSingleton<OfflineTokenCache>();
        services.AddTransient<OutboxSyncProcessor>();
        services.AddHostedService<OutboxBackgroundService>();

        // 3. Register Domain Policies & Services
        services.AddSingleton<WindowEnforcementPolicy>();
        services.AddSingleton<IExamIntegrityService, AvaloniaExamIntegrityService>();

        // 4. Register MediatR (Application Layer commands)
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(StartOfflineAssessmentCommand).Assembly));

        // 5. Register MVVM ViewModels
        services.AddTransient<MainWindowViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Courses.CourseViewerViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Dashboard.StudentDashboardViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Assessments.LogicQuizViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Courses.ActivityHubViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Calendar.TimelineScheduleViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.LearningTimeline.LearningTimelineViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.PackageManager.PackageManagerViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.SyncHub.SyncHubViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Diagnostics.DiagnosticsViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Courses.CourseContentViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Assessments.AssessmentViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Assessments.AssignmentSubmissionViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Courses.ModuleTimelineViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Grades.GradesViewModel>();
        services.AddTransient<LmsOffline.Presentation.Features.Courses.ResourcesViewModel>();

        return services.BuildServiceProvider();
    }
}