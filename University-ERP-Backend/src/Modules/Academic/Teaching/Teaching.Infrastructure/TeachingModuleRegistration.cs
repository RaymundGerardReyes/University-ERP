namespace Teaching.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using Teaching.Application.Abstractions;
using Teaching.Infrastructure.Repositories;

public static class TeachingModuleRegistration
{
    public static IServiceCollection AddTeachingInfrastructure(this IServiceCollection services)
    {
        // Register the repository for the MediatR handlers to use
        services.AddScoped<ICourseSectionRepository, CourseSectionRepository>();
        
        return services;
    }
}
