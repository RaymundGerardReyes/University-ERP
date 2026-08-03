namespace IdentityAccess.Infrastructure;

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

        // 2. Register Repositories and Persistence later...

        return services;
    }
}
