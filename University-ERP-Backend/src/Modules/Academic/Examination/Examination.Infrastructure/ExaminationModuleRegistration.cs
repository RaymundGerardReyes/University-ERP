namespace Examination.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Examination.Application.Abstractions;
using Examination.Infrastructure.Persistence;

public static class ExaminationModuleRegistration
{
    public static IServiceCollection AddExaminationModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // 1. Inject the PostgreSQL connection specifically for the Examination context
        services.AddDbContext<ExaminationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                // Isolate migration history to prevent cross-module corruption
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "examination")
            ));

        // 2. Register the Repository for Dependency Injection
        services.AddScoped<IExamSessionRepository, ExamSessionRepository>();

        services.AddScoped<IExaminationRepository, ExaminationRepository>();
        return services;
    }
}