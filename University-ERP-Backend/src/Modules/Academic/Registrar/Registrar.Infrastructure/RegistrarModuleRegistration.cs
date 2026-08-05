namespace Registrar.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Registrar.Application.Abstractions;
using Registrar.Infrastructure.Repositories;
using Registrar.Infrastructure.Persistence;

public static class RegistrarModuleRegistration
{
    public static IServiceCollection AddRegistrarModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.AddDbContext<RegistrarDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "registrar")
            ));

        // Add scoped repositories here as you implement them in the Application layer
        // e.g., services.AddScoped<ICourseRegistrationRepository, CourseRegistrationRepository>();

        services.AddScoped<IRegistrarRepository, RegistrarRepository>();
        return services;
    }
}