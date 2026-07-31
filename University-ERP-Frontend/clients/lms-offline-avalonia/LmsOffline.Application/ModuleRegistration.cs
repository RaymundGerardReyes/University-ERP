namespace LmsOffline.Application;

using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

/// <summary>
/// Registers Application-layer services for the Offline LMS client.
/// </summary>
public static class ModuleRegistration
{
    public static IServiceCollection AddLmsOfflineApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        return services;
    }
}