namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityAccess.Infrastructure;

public static class PlatformModulesRegistration
{
    public static IServiceCollection AddPlatformModules(this IServiceCollection services, IConfiguration configuration)
    {
        // Register IdentityAccess bounded context
        services.AddIdentityAccessModule(configuration);
        
        return services;
    }
}