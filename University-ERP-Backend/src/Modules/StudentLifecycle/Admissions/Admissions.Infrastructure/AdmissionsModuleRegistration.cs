namespace Admissions.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Admissions.Infrastructure.Persistence;
using Microsoft.Extensions.Configuration;

using Admissions.Application.Abstractions;
using Admissions.Infrastructure.Repositories;

public static class AdmissionsModuleRegistration
{
    public static IServiceCollection AddAdmissionsInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AdmissionsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "admissions")));

        services.AddScoped<IAdmissionApplicationRepository, AdmissionApplicationRepository>();
        services.AddScoped<IProgramOfferingRepository, ProgramOfferingRepository>();

        return services;
    }
}
