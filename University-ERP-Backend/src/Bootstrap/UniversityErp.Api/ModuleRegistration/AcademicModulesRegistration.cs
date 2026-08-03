namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentInformation.Infrastructure;
using LearningManagement.Infrastructure;

public static class AcademicModulesRegistration
{
    public static IServiceCollection AddAcademicModules(this IServiceCollection services, IConfiguration configuration)
    {
        // Self-register each academic bounded context
        services.AddStudentInformationModule(configuration);
        services.AddLearningManagementModule(configuration);
        
        return services;
    }
}