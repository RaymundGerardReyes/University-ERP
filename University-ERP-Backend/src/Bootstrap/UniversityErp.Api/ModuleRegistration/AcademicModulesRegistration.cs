namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// Import Application layers
using AcademicScheduling.Application;
using Examination.Application;
using LearningManagement.Application;
using Registrar.Application;
using StudentInformation.Application;

// Import Infrastructure layers
using AcademicScheduling.Infrastructure;
using Examination.Infrastructure;
using LearningManagement.Infrastructure;
using Registrar.Infrastructure;
using StudentInformation.Infrastructure;

public static class AcademicModulesRegistration
{
    public static IServiceCollection AddAcademicModules(this IServiceCollection services, IConfiguration configuration)
    {
        // 1. Student Information
        services.AddStudentInformationModule(configuration);

        // 2. Academic Scheduling
        services.AddAcademicSchedulingApplicationModule();
        services.AddAcademicSchedulingModule(configuration);

        // 3. Examination
        services.AddExaminationApplicationModule();
        services.AddExaminationModule(configuration);

        // 4. Learning Management
        services.AddLearningManagementApplication();
        services.AddLearningManagementModule(configuration);

        // 5. Registrar
        services.AddRegistrarApplicationModule();
        services.AddRegistrarModule(configuration);

        return services;
    }
}