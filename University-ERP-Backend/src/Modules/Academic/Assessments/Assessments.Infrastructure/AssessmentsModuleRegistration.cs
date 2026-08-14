namespace Assessments.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using Assessments.Application.Abstractions;
using Assessments.Infrastructure.Persistence;
using Assessments.Infrastructure.Repositories;

public static class AssessmentsModuleRegistration
{
    public static IServiceCollection AddAssessmentsInfrastructure(this IServiceCollection services)
    {
        // For development/demonstration purposes, use In-Memory DB if connection string isn't provided here
        // (Usually, you'd pull the real PostgreSQL connection string from IConfiguration)
        
        // Register the repository so that SubmitGradesCommandHandler can resolve it
        services.AddScoped<IGradebookRepository, GradebookRepository>();
        
        return services;
    }
}
