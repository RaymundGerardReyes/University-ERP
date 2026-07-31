namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the Administration cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class AdministrationModulesRegistration
{
    public static IServiceCollection AddAdministrationModules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
