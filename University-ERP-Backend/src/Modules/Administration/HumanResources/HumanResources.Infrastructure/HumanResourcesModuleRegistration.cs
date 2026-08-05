namespace HumanResources.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using HumanResources.Application.Abstractions;
using HumanResources.Infrastructure.Persistence;
using HumanResources.Infrastructure.Repositories;

public static class HumanResourcesModuleRegistration
{
    public static IServiceCollection AddHumanResourcesModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.AddDbContext<HumanResourcesDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "hr")
            ));

        services.AddScoped<IEmployeeRepository, EmployeeRepository>();

        return services;
    }
}