using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace LearningManagement.Application;

/// <summary>
/// Registers all Application-layer services for the LearningManagement module.
/// </summary>
public static class LearningManagementApplicationRegistration
{
    public static IServiceCollection AddLearningManagementApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));

        return services;
    }
}
