namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the Academic cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class AcademicModulesRegistration
{
    public static IServiceCollection AddAcademicModules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
