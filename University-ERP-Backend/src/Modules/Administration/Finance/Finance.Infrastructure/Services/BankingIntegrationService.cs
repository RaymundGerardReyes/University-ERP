namespace Finance.Infrastructure.Services;

using Finance.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Options;

public sealed class BankingIntegrationService : IPaymentGatewayService
{
    private readonly HttpClient _httpClient;
    private readonly PaymentGatewayOptions _options;

    public BankingIntegrationService(HttpClient httpClient, IOptions<PaymentGatewayOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<Result<string>> ProcessChargeAsync(string paymentToken, decimal amount, string currency, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(paymentToken))
        {
            return Result<string>.Failure(new Error("PaymentGateway.InvalidToken", "Payment token is missing or invalid."));
        }

        var requestBody = new
        {
            sourceAccountNumber = paymentToken,
            destinationAccountNumber = "UNIV-ACCT-001",
            amount = amount,
            idempotencyKey = System.Guid.NewGuid().ToString(),
            description = "University ERP Payment",
            scheduledDate = System.DateTime.UtcNow.ToString("yyyy-MM-dd")
        };

        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/transfers/internal");
            requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.SecretKey);

            requestMessage.Content = JsonContent.Create(requestBody);

            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ApiResponse<TransactionResponse>>(cancellationToken: cancellationToken);
                if (result?.Data != null && !string.IsNullOrEmpty(result.Data.TransactionId))
                {
                    return Result<string>.Success(result.Data.TransactionId);
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Failure(new Error("Finance.BankingError", $"Banking API rejected the transaction: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to banking system: {ex.Message}"));
        }
    }
    
    public async Task<Result<string>> CreateCheckoutSessionAsync(string sessionId, decimal amount, string currency, string successUrl, string cancelUrl, CancellationToken cancellationToken)
    {
        try
        {
            var payload = new
            {
                sourceAccountId = "UNIV-ACCT-001",
                amount = amount,
                description = $"Payment Session {sessionId}",
                merchantReference = sessionId
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/gateway/payments/intents");
            requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.SecretKey);

            requestMessage.Content = JsonContent.Create(payload);
            
            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ApiResponse<PaymentSessionResponse>>(cancellationToken: cancellationToken);
                var checkoutUrl = result?.Data?.CheckoutUrl;
                
                if (!string.IsNullOrEmpty(checkoutUrl))
                {
                    return Result<string>.Success(checkoutUrl);
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to create checkout session: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to payment gateway: {ex.Message}"));
        }
    }
    
    public Task<Result<string>> CreateCheckoutSessionAsync(string transactionId, decimal amount, string gatewayName, CancellationToken cancellationToken)
    {
        throw new System.NotImplementedException("Use the 6-parameter overload for NovaBank integration.");
    }
    
    public async Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken)
    {
        // Mock fallback for local dev if hitting the dummy payload
        if (_httpClient.BaseAddress?.Host == "api.banking.university.edu" || string.IsNullOrEmpty(_options.SecretKey) || _options.SecretKey == "sk_test_mocked")
        {
            return Result<string>.Success($"qrph_mock_payload_for_session_{sessionId}");
        }

        try
        {
            var amountInCentavos = (long)(amount * 100);
            
            var payload = new
            {
                data = new
                {
                    attributes = new
                    {
                        amount = amountInCentavos,
                        description = $"QR Payment for Session {sessionId}"
                    }
                }
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/v1/links");
            var authHeader = System.Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{_options.SecretKey}:"));
            requestMessage.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authHeader);
            requestMessage.Content = JsonContent.Create(payload);
            
            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>(cancellationToken: cancellationToken);
                var checkoutUrl = result.GetProperty("data").GetProperty("attributes").GetProperty("checkout_url").GetString();
                
                if (!string.IsNullOrEmpty(checkoutUrl))
                {
                    return Result<string>.Success(checkoutUrl);
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to generate QR payment link: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to payment gateway: {ex.Message}"));
        }
    }
    
    private record TransactionResponse(string TransactionId, string Status, decimal Amount);
    private record PaymentSessionResponse(string PaymentIntentId, string Provider, string CheckoutType, string CheckoutUrl, System.DateTime ExpiresAt, string TransactionReference);
    private record ApiResponse<T>(T Data, string Message, string CorrelationId);
}
