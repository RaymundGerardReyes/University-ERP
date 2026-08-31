namespace Finance.Infrastructure;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Finance.Application.Abstractions;
using Finance.Infrastructure.Persistence;
using Finance.Infrastructure.Repositories;
using Polly;
using Polly.Extensions.Http;
using System;
using System.Net.Http;

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
                throw new InvalidOperationException("PaymentGateway:BaseUrl is missing in the configuration.");
            }
            if (string.IsNullOrEmpty(options.SourceAccountId))
            {
                throw new InvalidOperationException("PaymentGateway:SourceAccountId is missing in the configuration.");
            }
            
            client.BaseAddress = new Uri(options.BaseUrl);
            client.Timeout = TimeSpan.FromSeconds(30);
        })
        .AddPolicyHandler(GetRetryPolicy());

        return services;
    }

    private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
    {
        return HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(3, retryAttempt => 
                TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)));
    }
}