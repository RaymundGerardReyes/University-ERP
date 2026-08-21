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
        
        // Mock fallback for local dev
        if (_httpClient.BaseAddress?.Host == "api.banking.university.edu")
        {
            return Result<string>.Success(System.Guid.NewGuid().ToString("N"));
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
            var response = await _httpClient.PostAsJsonAsync("/api/v1/transfers/internal", requestBody, cancellationToken);
            
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
        // Mock fallback for local dev if hitting the dummy payload
        if (_httpClient.BaseAddress?.Host == "api.banking.university.edu" || string.IsNullOrEmpty(_options.SecretKey) || _options.SecretKey == "sk_test_mocked")
        {
            return Result<string>.Success($"https://mock-checkout.paymongo.com/checkout?session={sessionId}");
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
                        line_items = new[]
                        {
                            new
                            {
                                name = $"Payment Session {sessionId}",
                                amount = amountInCentavos,
                                currency = currency,
                                quantity = 1
                            }
                        },
                        payment_method_types = new[]
                        {
                            "card",
                            "gcash",
                            "qrph"
                        },
                        reference_number = sessionId,
                        success_url = successUrl,
                        cancel_url = cancelUrl
                    }
                }
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/v1/checkout_sessions");
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
            return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to create checkout session: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to payment gateway: {ex.Message}"));
        }
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
    private record ApiResponse<T>(T Data, string Message, string CorrelationId);
}
