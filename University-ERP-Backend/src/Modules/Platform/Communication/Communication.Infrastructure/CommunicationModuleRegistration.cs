namespace Communication.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Communication.Application.Abstractions;
using Communication.Infrastructure.Persistence;
using Communication.Infrastructure.Repositories;

public static class CommunicationModuleRegistration
{
    public static IServiceCollection AddCommunicationInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CommunicationDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "platform_communication")
            ));

        services.AddScoped<ICommunicationRepository, CommunicationRepository>();

        return services;
    }
}