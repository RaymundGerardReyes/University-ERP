namespace Admissions.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Admissions.Application.Abstractions;
using Admissions.Infrastructure.Persistence;
using Admissions.Infrastructure.Repositories;

public static class AdmissionsModuleRegistration
{
    public static IServiceCollection AddAdmissionsInfrastructure(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // 1. Inject the PostgreSQL connection specifically for the Admissions context
        services.AddDbContext<AdmissionsDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                // Prevent cross-module corruption by isolating the EF migration history
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "admissions")
            ));

        // 2. Register Repositories for Dependency Injection
        services.AddScoped<IAdmissionApplicationRepository, AdmissionApplicationRepository>();
        
        // Assuming ProgramOfferingRepository exists based on your trace
        services.AddScoped<IProgramOfferingRepository, ProgramOfferingRepository>();

        return services;
    }
}