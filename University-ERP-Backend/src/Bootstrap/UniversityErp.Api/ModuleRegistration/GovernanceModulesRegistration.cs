namespace UniversityErp.Api.ModuleRegistration;

// Aggregates module self-registration calls for the Governance cluster.
// Each module below must expose Add<ModuleName>Module(IServiceCollection) in its own ModuleRegistration.cs.
public static class GovernanceModulesRegistration
{
    public static IServiceCollection AddGovernanceModules(this IServiceCollection services)
    {
        // TODO: services.AddXxxModule();
        return services;
    }
}
