namespace IdentityAccess.Application;

using Microsoft.Extensions.DependencyInjection;
using IdentityAccess.Application.Features.RegisterUser;

public static class IdentityAccessApplicationRegistration
{
    public static IServiceCollection AddIdentityAccessApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => 
            cfg.RegisterServicesFromAssembly(typeof(RegisterUserCommand).Assembly));

        return services;
    }
}
