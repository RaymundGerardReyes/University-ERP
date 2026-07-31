namespace UniversityErp.Api.ModuleRegistration;

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
        
        // Future academic modules (Registrar, Examination, etc.) will be added here
        
        return services;
    }
}
