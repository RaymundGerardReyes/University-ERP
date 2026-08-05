namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentInformation.Infrastructure;
using LearningManagement.Infrastructure;
using LearningManagement.Application;
using Registrar.Application;
using Registrar.Infrastructure;
using Examination.Application;
using Examination.Infrastructure;
using AcademicScheduling.Application;
using AcademicScheduling.Infrastructure;

public static class AcademicModulesRegistration
{
    public static IServiceCollection AddAcademicModules(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddStudentInformationModule(configuration);
        services.AddLearningManagementModule(configuration);
        services.AddLearningManagementApplication();
        
        services.AddRegistrarApplicationModule();
        services.AddRegistrarModule(configuration);
        
        services.AddExaminationApplicationModule();
        services.AddExaminationModule(configuration);
        
        services.AddAcademicSchedulingApplicationModule();
        services.AddAcademicSchedulingInfrastructure(configuration);
        
        return services;
    }
}