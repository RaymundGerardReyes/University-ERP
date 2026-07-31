namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the StudentLifecycle cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class StudentLifecycleModulesRegistration
{
    public static IServiceCollection AddStudentLifecycleModules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
