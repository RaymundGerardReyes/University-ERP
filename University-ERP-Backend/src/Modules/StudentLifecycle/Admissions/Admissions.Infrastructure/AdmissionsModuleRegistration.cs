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
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AdmissionsDbContext>(options =>
            options.UseNpgsql(
                connectionString,
                // Prevent cross-module corruption by isolating the EF migration history
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "admissions")
            ));

        // Ensure database column FilePath exists automatically on startup
        if (!string.IsNullOrEmpty(connectionString))
        {
            try
            {
                using var conn = new Npgsql.NpgsqlConnection(connectionString);
                conn.Open();
                using var cmd = conn.CreateCommand();
                cmd.CommandText = @"
                    CREATE SCHEMA IF NOT EXISTS admissions;
                    ALTER TABLE admissions.""AdmissionDocuments"" ADD COLUMN IF NOT EXISTS ""FilePath"" TEXT;
                ";
                cmd.ExecuteNonQuery();
            }
            catch
            {
                // Non-blocking in case DB is unready during initial build
            }
        }

        // 2. Register Repositories for Dependency Injection
        services.AddScoped<IAdmissionApplicationRepository, AdmissionApplicationRepository>();
        
        // Assuming ProgramOfferingRepository exists based on your trace
        services.AddScoped<IProgramOfferingRepository, ProgramOfferingRepository>();

        return services;
    }
}