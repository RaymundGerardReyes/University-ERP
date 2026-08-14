namespace Enrollment.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using Enrollment.Application.Abstractions;
using Enrollment.Infrastructure.Repositories;

public static class EnrollmentModuleRegistration
{
    public static IServiceCollection AddEnrollmentInfrastructure(this IServiceCollection services)
    {
        // Register the repository for the MediatR handlers to use
        services.AddScoped<ITermRegistrationRepository, TermRegistrationRepository>();
        
        return services;
    }
}
