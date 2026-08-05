namespace UniversityErp.Api.ModuleRegistration;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Finance.Infrastructure;
using Finance.Application;
using HumanResources.Infrastructure;
using HumanResources.Application;
using Procurement.Application;
using AssetManagement.Application;
using Payroll.Application;
using Transport.Application;
using Facilities.Application;
using Inventory.Application;
using MessCanteen.Application;
using Library.Application;

public static class AdministrationModulesRegistration
{
    public static IServiceCollection AddAdministrationCluster(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddFinanceModule(configuration);
        services.AddHumanResourcesModule(configuration);
        services.AddProcurementApplicationModule();
        services.AddAssetManagementApplicationModule();
        services.AddHumanResourcesApplicationModule();
        services.AddFinanceApplicationModule();
        services.AddPayrollApplicationModule();
        services.AddTransportApplicationModule();
        services.AddFacilitiesApplicationModule();
        services.AddInventoryApplicationModule();
        services.AddMessCanteenApplicationModule();
        services.AddLibraryApplicationModule();
        return services;
    }
}
