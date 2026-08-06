namespace Registrar.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// Using global:: prevents the compiler from getting confused by the 'Registrar' namespace name
using global::Registrar.Application.Abstractions;
using global::Registrar.Infrastructure.Persistence;
using global::Registrar.Infrastructure.Repositories;

public static class RegistrarModuleRegistration
{
    public static IServiceCollection AddRegistrarModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<RegistrarDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "registrar")
            ));

        services.AddScoped<IRegistrarRepository, RegistrarRepository>();

        return services;
    }
}