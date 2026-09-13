namespace Curriculum.Infrastructure;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Curriculum.Application.Abstractions;
using Curriculum.Infrastructure.Persistence;
using Curriculum.Infrastructure.Repositories;
using MediatR;
using System.Reflection;

public static class CurriculumModuleRegistration
{
    /// <summary>
    /// Registers MediatR handlers from Curriculum.Application assembly.
    /// Call this from the API host's AddAcademicModules().
    /// </summary>
    public static IServiceCollection AddCurriculumApplicationModule(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(
                Assembly.Load("Curriculum.Application")));

        return services;
    }

    /// <summary>
    /// Registers CurriculumDbContext (PostgreSQL) and all curriculum repositories.
    /// Call this from the API host's AddAcademicModules().
    /// </summary>
    public static IServiceCollection AddCurriculumModule(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");

        services.AddDbContext<CurriculumDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<ICourseDefinitionRepository, CourseDefinitionRepository>();
        services.AddScoped<IAcademicProgramRepository, AcademicProgramRepository>();
        services.AddScoped<ICurriculumPlanRepository, CurriculumPlanRepository>();

        return services;
    }
}
