namespace UniversityErp.Api.ModuleRegistration;

using Admissions.Infrastructure;

// Aggregates module self-registration calls for the StudentLifecycle cluster.
public static class StudentLifecycleModulesRegistration
{
    public static IServiceCollection AddStudentLifecycleModules(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAdmissionsInfrastructure(configuration);
        services.AddMediatR(cfg => 
        {
            cfg.RegisterServicesFromAssembly(typeof(Alumni.Application.Features.GetAlumniStatus.GetAlumniStatusQuery).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(HealthCenter.Application.Features.GetHealthAppointments.GetHealthAppointmentsQuery).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(PlacementCareer.Application.Features.GetJobPostings.GetJobPostingsQuery).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(GuidanceCounseling.Application.Features.GetGuidanceSessions.GetGuidanceSessionsQuery).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(Admissions.Application.Features.GetApplicationStatus.GetApplicationStatusQuery).Assembly);
            cfg.RegisterServicesFromAssembly(typeof(Hostel.Application.Features.GetRoomAllocation.GetRoomAllocationQuery).Assembly);
        });
        
        return services;
    }
}
