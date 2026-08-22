namespace Finance.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Finance.Application.Abstractions;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Repositories;

public static class FinanceModuleRegistration
{
    public static IServiceCollection AddFinanceModule(this IServiceCollection services, IConfiguration configuration)
    {
        return services.AddFinanceInfrastructure(configuration);
    }

    public static IServiceCollection AddFinanceInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        services.AddDbContext<FinanceDbContext>(options =>
            options.UseNpgsql(
                configuration.GetConnectionString("DefaultConnection"),
                npgsqlOptions => npgsqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "finance")
            ));

        services.Configure<PaymentGatewayOptions>(configuration.GetSection("PaymentGateway"));

        services.AddScoped<IStudentBillingRepository, StudentBillingRepository>();
        
        // NEW: Register CashTransactionRepository
        services.AddScoped<ICashTransactionRepository, CashTransactionRepository>();
        
        // NEW: Register PaymentSessionRepository
        services.AddScoped<IPaymentSessionRepository, PaymentSessionRepository>();

        services.AddHttpClient<IPaymentGatewayService, Finance.Infrastructure.Services.BankingIntegrationService>((provider, client) =>
        {
            var options = provider.GetRequiredService<Microsoft.Extensions.Options.IOptions<PaymentGatewayOptions>>().Value;
            if (string.IsNullOrEmpty(options.BaseUrl))
            {
                throw new System.InvalidOperationException("PaymentGateway:BaseUrl is missing in the configuration.");
            }
            
            client.BaseAddress = new System.Uri(options.BaseUrl);
            client.Timeout = System.TimeSpan.FromSeconds(30);
        });

        return services;
    }
}