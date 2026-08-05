namespace AcademicScheduling.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Infrastructure.Persistence;

public static class AcademicSchedulingModuleRegistration
{
    public static IServiceCollection AddAcademicSchedulingInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AcademicSchedulingDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "academic_scheduling")
            ));

        services.AddScoped<IClassSessionRepository, ClassSessionRepository>();

        services.AddScoped<IAcademicSchedulingRepository, AcademicSchedulingRepository>();
        return services;
    }
}