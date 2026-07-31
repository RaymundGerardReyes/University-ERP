namespace UniversityErp.Api.ModuleRegistration;

using LearningManagement.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentInformation.Infrastructure;

// Aggregates module self-registration calls for the Academic cluster.
public static class AcademicModulesRegistration
{
    public static IServiceCollection AddAcademicModules(this IServiceCollection services, IConfiguration configuration)
    {
        // Register the StudentInformation bounded context
        services.AddStudentInformationModule(configuration);

        // Register the LearningManagement bounded context (Offline LMS Sync ingestion)
        services.AddLearningManagementModule(configuration);

        return services;
    }
}
