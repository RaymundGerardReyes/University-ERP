namespace StudentInformation.Infrastructure;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentInformation.Application.Abstractions;
using StudentInformation.Application.Features.EnrollStudent;
using StudentInformation.Infrastructure.Persistence;
using StudentInformation.Infrastructure.Repositories;

/// <summary>
/// Registers all dependencies for the StudentInformation bounded context.
/// This acts as the module's Composition Root.
/// </summary>
public static class StudentInformationModuleRegistration
{
    public static IServiceCollection AddStudentInformationModule(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        // 1. Register the isolated DbContext using PostgreSQL
        services.AddDbContext<StudentInformationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // 2. Register Repositories
        services.AddScoped<IStudentRepository, StudentRepository>();

        // 3. Register MediatR (Points to the Application Assembly)
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(typeof(EnrollStudentCommand).Assembly));

        // 4. Register FluentValidation (Points to the Application Assembly)
        services.AddValidatorsFromAssembly(typeof(EnrollStudentCommandValidator).Assembly);

        return services;
    }
}
