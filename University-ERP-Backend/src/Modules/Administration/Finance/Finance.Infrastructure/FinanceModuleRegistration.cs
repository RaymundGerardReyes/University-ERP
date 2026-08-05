namespace Finance.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Finance.Application.Abstractions;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Repositories;

public static class FinanceModuleRegistration
{
    public static IServiceCollection AddFinanceModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // 1. Inject the PostgreSQL connection specifically for the Finance context
        services.AddDbContext<FinanceDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "finance")
            ));

        // 2. Register the Repository for Dependency Injection
        services.AddScoped<IStudentBillingRepository, StudentBillingRepository>();

        return services;
    }
}