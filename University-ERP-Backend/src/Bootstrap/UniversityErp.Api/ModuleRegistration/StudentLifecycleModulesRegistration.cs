namespace UniversityErp.Api.ModuleRegistration;

using Admissions.Infrastructure;
using Admissions.Application;
using Alumni.Application;
using GuidanceCounseling.Application;
using HealthCenter.Application;
using Hostel.Application;
using PlacementCareer.Application;

// Aggregates module self-registration calls for the StudentLifecycle cluster.
public static class StudentLifecycleModulesRegistration
{
    public static IServiceCollection AddStudentLifecycleModules(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAdmissionsInfrastructure(configuration);
        services.AddAdmissionsApplicationModule();
        services.AddAlumniApplicationModule();
        services.AddGuidanceCounselingApplicationModule();
        services.AddHealthCenterApplicationModule();
        services.AddHostelApplicationModule();
        services.AddPlacementCareerApplicationModule();
        
        return services;
    }
}

