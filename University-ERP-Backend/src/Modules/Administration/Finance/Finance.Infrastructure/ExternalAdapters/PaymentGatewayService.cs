namespace Finance.Infrastructure.ExternalAdapters;

using Finance.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using Microsoft.Extensions.Configuration;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;

public class PaymentGatewayService : IPaymentGatewayService
{
    private readonly IConfiguration _configuration;
    private readonly IHttpClientFactory _httpClientFactory;

    public PaymentGatewayService(IConfiguration configuration, IHttpClientFactory httpClientFactory)
    {
        _configuration = configuration;
        _httpClientFactory = httpClientFactory;
    }

    public async Task<Result<string>> CreateCheckoutSessionAsync(
        string transactionId, 
        decimal amount, 
        string gatewayName, 
        CancellationToken cancellationToken)
    {
        // 1. Dynamically fetch the URL format and credentials based on the standard naming convention
        string urlConfigKey = $"PaymentGateways:{gatewayName}:CheckoutUrlFormat";
        string? urlFormat = _configuration[urlConfigKey];

        if (string.IsNullOrWhiteSpace(urlFormat))
        {
            return Result<string>.Failure(
                new Error("Finance.UnsupportedGateway", $"The payment gateway '{gatewayName}' is not configured in the environment."));
        }

        string publicKey = _configuration[$"PaymentGateways:{gatewayName}:PublicKey"] ?? string.Empty;
        string secretKey = _configuration[$"PaymentGateways:{gatewayName}:SecretKey"] ?? string.Empty;
        string merchantId = _configuration[$"PaymentGateways:{gatewayName}:MerchantId"] ?? string.Empty;

        // 2. Prepare the JSON Payload
        var payload = new 
        { 
            transactionId = transactionId, 
            amount = amount,
            currency = "PHP" 
        };

        string targetEndpoint = string.Format(urlFormat, transactionId);

        // 3. Create the HTTP Request
        using var request = new HttpRequestMessage(HttpMethod.Post, targetEndpoint);
        request.Content = JsonContent.Create(payload);

        // 4. Attach Dynamic Authorization (Bearer Token if SecretKey exists)
        if (!string.IsNullOrWhiteSpace(secretKey))
        {
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", secretKey);
        }

        if (!string.IsNullOrWhiteSpace(merchantId))
        {
            request.Headers.Add("X-Merchant-Id", merchantId);
        }

        // 5. Dispatch the Request using the Factory
        using var client = _httpClientFactory.CreateClient("PaymentGatewayClient");
        
        try
        {
            using var response = await client.SendAsync(request, cancellationToken);
            
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
                return Result<string>.Failure(new Error("Finance.GatewayError", $"Gateway returned {response.StatusCode}: {errorContent}"));
            }

            var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Success(responseContent);
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.NetworkError", $"Failed to connect to payment gateway: {ex.Message}"));
        }
    }

    public Task<Result<string>> ProcessChargeAsync(string paymentToken, decimal amount, string currency, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<string>.Success(Guid.NewGuid().ToString("N")));
    }

    public Task<Result<string>> CreateCheckoutSessionAsync(string sessionId, decimal amount, string currency, string? idempotencyKey = null, CancellationToken cancellationToken = default)
    {
        return CreateCheckoutSessionAsync(sessionId, amount, "Paynamics", cancellationToken);
    }

    public Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken)
    {
        return Task.FromResult(Result<string>.Success($"qrph_mock_payload_for_session_{sessionId}"));
    }
}
