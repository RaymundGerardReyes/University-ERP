namespace LmsOffline.Application;

using Microsoft.Extensions.DependencyInjection;

/// <summary>
/// Self-registers all Application layer dependencies for the Offline LMS.
/// </summary>
public static class ModuleRegistration
{
    public static IServiceCollection AddLmsOfflineApplication(this IServiceCollection services)
    {
        // Register all MediatR Commands/Queries from this assembly automatically
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(typeof(ModuleRegistration).Assembly));

        return services;
    }
}
