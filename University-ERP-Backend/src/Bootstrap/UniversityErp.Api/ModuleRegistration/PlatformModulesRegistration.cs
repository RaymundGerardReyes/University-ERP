namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using IdentityAccess.Infrastructure;
using IdentityAccess.Application;
using AnalyticsBI.Application;
using DocumentManagement.Infrastructure;
using DocumentManagement.Application;
using MultiCampus.Application;
using CRM.Application;
using Communication.Infrastructure;
using Communication.Application;
using Notification.Application;

public static class PlatformModulesRegistration
{
    public static IServiceCollection AddPlatformCluster(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddIdentityAccessModule(configuration);
        services.AddCommunicationInfrastructure(configuration);
        services.AddDocumentManagementInfrastructure(configuration);
        
        services.AddAnalyticsBIApplicationModule();
        services.AddDocumentManagementApplicationModule();
        services.AddMultiCampusApplicationModule();
        services.AddCRMApplicationModule();
        services.AddCommunicationApplicationModule();
        services.AddNotificationApplicationModule();
        
        return services;
    }
}