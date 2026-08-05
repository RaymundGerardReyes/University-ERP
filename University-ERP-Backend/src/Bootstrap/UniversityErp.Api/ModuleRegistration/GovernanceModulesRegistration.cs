namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.DependencyInjection;
using VisitorManagement.Application;
using QualityAccreditation.Application;
using Helpdesk.Application;
using GrievanceManagement.Application;
using EventManagement.Application;

public static class GovernanceModulesRegistration
{
    public static IServiceCollection AddGovernanceModules(this IServiceCollection services)
    {
        services.AddVisitorManagementApplicationModule();
        services.AddQualityAccreditationApplicationModule();
        services.AddHelpdeskApplicationModule();
        services.AddGrievanceManagementApplicationModule();
        services.AddEventManagementApplicationModule();
        return services;
    }
}
