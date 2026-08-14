namespace Curriculum.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using Curriculum.Application.Abstractions;
using Curriculum.Infrastructure.Persistence;
using Curriculum.Infrastructure.Repositories;

public static class CurriculumModuleRegistration
{
    public static IServiceCollection AddCurriculumInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<ICourseDefinitionRepository, CourseDefinitionRepository>();
        return services;
    }
}
