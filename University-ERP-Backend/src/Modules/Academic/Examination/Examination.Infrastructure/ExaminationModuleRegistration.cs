namespace Examination.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Examination.Application.Abstractions;
using Examination.Infrastructure.Persistence;
using Examination.Infrastructure.Repositories;

public static class ExaminationModuleRegistration
{
    // This method name MUST match exactly what is being called in AcademicModulesRegistration.cs
    public static IServiceCollection AddExaminationModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // 1. Register the isolated DbContext for the Examination boundary
        services.AddDbContext<ExaminationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "examination")
            ));

        // 2. Register Repositories
        services.AddScoped<IExamSessionRepository, ExamSessionRepository>();
        services.AddScoped<IExaminationRepository, ExaminationRepository>();

        return services;
    }
}