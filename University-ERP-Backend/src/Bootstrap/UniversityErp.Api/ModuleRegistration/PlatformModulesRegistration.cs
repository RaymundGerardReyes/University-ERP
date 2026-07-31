namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the Platform cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class PlatformModulesRegistration
{
    public static IServiceCollection AddPlatformModules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
