namespace IdentityAccess.Infrastructure;

using IdentityAccess.Application.Abstractions;
using IdentityAccess.Infrastructure.Persistence;
using IdentityAccess.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityAccess.Application;

public static class IdentityAccessModuleRegistration
{
    public static IServiceCollection AddIdentityAccessModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // 1. Register Application Layer (MediatR)
        services.AddIdentityAccessApplication();

        // 2. Register the isolated DbContext using PostgreSQL
        services.AddDbContext<IdentityAccessDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // 3. Register the Repository
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}

