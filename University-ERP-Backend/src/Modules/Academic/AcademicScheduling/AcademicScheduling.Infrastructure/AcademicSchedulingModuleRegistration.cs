namespace AcademicScheduling.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Infrastructure.Persistence;
using AcademicScheduling.Infrastructure.Repositories;

public static class AcademicSchedulingModuleRegistration
{
    public static IServiceCollection AddAcademicSchedulingModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AcademicSchedulingDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "academicscheduling")
            ));

        services.AddScoped<IAcademicSchedulingRepository, AcademicSchedulingRepository>();
        services.AddScoped<IClassSessionRepository, ClassSessionRepository>();

        return services;
    }
}