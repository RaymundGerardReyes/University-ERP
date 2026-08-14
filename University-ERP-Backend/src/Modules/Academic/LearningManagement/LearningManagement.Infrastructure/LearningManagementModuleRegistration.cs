namespace LearningManagement.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using LearningManagement.Application.Abstractions;
using LearningManagement.Infrastructure.Persistence;
using LearningManagement.Infrastructure.Repositories;

public static class LearningManagementModuleRegistration
{
    public static IServiceCollection AddLearningManagementModule(this IServiceCollection services, Microsoft.Extensions.Configuration.IConfiguration configuration)
    {
        return services.AddLearningManagementInfrastructure();
    }

    public static IServiceCollection AddLearningManagementInfrastructure(this IServiceCollection services)
    {
        // Register the repository for MediatR to resolve
        services.AddScoped<ICourseSyllabusRepository, CourseSyllabusRepository>();
        
        return services;
    }
}
