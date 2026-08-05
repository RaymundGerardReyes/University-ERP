namespace Helpdesk.Application;

using Microsoft.Extensions.DependencyInjection;

public static class ModuleRegistration
{
    public static IServiceCollection AddHelpdeskApplicationModule(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(ModuleRegistration).Assembly));
        return services;
    }
}
