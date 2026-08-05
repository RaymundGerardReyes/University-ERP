using LearningManagement.Application;
using LearningManagement.Application.Abstractions;
using LearningManagement.Infrastructure.Persistence;
using LearningManagement.Infrastructure.Repositories;
using LearningManagement.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LearningManagement.Infrastructure;

/// <summary>
/// Composition root for the LearningManagement bounded context.
/// Registers all Application and Infrastructure services.
/// </summary>
public static class LearningManagementModuleRegistration
{
    public static IServiceCollection AddLearningManagementModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // 1. Application layer (MediatR handlers)
        services.AddLearningManagementApplication();

        // 2. EF Core DbContext (PostgreSQL)
        services.AddDbContext<LearningManagementDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("UniversityErpDb"),
                npgsql => npgsql.MigrationsHistoryTable("__EFMigrationsHistory", "lms")));

        // 3. Repository (Dependency Inversion)
        services.AddScoped<IOfflineSubmissionRepository, OfflineSubmissionRepository>();

        // 4. Schedule Token Verifier
        var scheduleSecret = configuration["LmsOffline:ScheduleTokenSecret"]
            ?? throw new InvalidOperationException("LmsOffline:ScheduleTokenSecret is not configured.");
        services.AddSingleton<IScheduleTokenVerifier>(_ => new ScheduleTokenVerifier(scheduleSecret));

        services.AddScoped<ILearningManagementRepository, LearningManagementRepository>();
        return services;
    }
}
