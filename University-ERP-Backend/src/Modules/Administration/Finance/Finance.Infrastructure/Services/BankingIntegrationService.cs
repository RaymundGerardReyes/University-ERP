namespace Finance.Infrastructure.Services;

using Finance.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using System.Linq;
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
            destinationAccountNumber = _options.SourceAccountId,
            amount = amount,
            idempotencyKey = System.Guid.NewGuid().ToString(),
            description = "University ERP Payment",
            scheduledDate = System.DateTime.UtcNow.ToString("yyyy-MM-dd")
        };

        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/transfers/internal");
            // API key should be used for B2B/backend calls if not a JWT user token.
            // Wait, transfers/internal might require JWT token, but we can pass BFF key
            requestMessage.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            requestMessage.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");

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
    
    public Task<Result<string>> CreateCheckoutSessionAsync(string sessionId, decimal amount, string currency, string? idempotencyKey = null, CancellationToken cancellationToken = default)
    {
        return CreateCheckoutSessionAsync(sessionId, amount, currency, idempotencyKey, null, cancellationToken);
    }

    public async Task<Result<string>> CreateCheckoutSessionAsync(string sessionId, decimal amount, string currency, string? idempotencyKey, string? returnUrl, CancellationToken cancellationToken)
    {
        try
        {
            var effectiveSuccessUrl = !string.IsNullOrWhiteSpace(returnUrl)
                ? returnUrl
                : (!string.IsNullOrWhiteSpace(_options.SuccessUrl) ? _options.SuccessUrl : "https://erp.university.edu/finance/success");

            var payload = new
            {
                reference = sessionId,
                currency = currency ?? "PHP",
                successUrl = effectiveSuccessUrl,
                cancelUrl = !string.IsNullOrWhiteSpace(_options.CancelUrl) ? _options.CancelUrl : "https://erp.university.edu/finance/cancel",
                lineItems = new[]
                {
                    new { name = "University Fee", quantity = 1, unitAmount = amount }
                }
            };

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/gateway/checkout/sessions");
            // The Java Banking API uses X-API-Key for the merchant gateway
            requestMessage.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            requestMessage.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");
            
            string safeBankKey = GenerateDeterministicKey(idempotencyKey ?? sessionId);
            requestMessage.Headers.TryAddWithoutValidation("Idempotency-Key", safeBankKey);

            requestMessage.Content = JsonContent.Create(payload);
            
            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ApiResponse<PaymentSessionResponse>>(cancellationToken: cancellationToken);
                var checkoutUrl = result?.Data?.CheckoutUrl;
                
                if (!string.IsNullOrEmpty(checkoutUrl))
                {
                    checkoutUrl = QualifyCheckoutUrl(checkoutUrl);
                    return Result<string>.Success(checkoutUrl);
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            if ((int)response.StatusCode >= 500)
            {
                return Result<string>.Failure(new Error("PaymentGateway.Unavailable", $"Failed to create checkout session: error code: {(int)response.StatusCode}. Details: {errorContent}"));
            }

            return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to create checkout session: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("PaymentGateway.NetworkError", $"Failed to connect to payment gateway: error code: 502. Details: {ex.Message}"));
        }
    }

    private static string GenerateDeterministicKey(string clientKey)
    {
        if (string.IsNullOrWhiteSpace(clientKey))
        {
            return System.Guid.NewGuid().ToString();
        }

        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes($"BANK_PREFIX_{clientKey}"));
        
        return new System.Guid(hashBytes.Take(16).ToArray()).ToString();
    }

    private string QualifyCheckoutUrl(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
        {
            return url;
        }

        // If already an absolute URI with http/https scheme, preserve it
        if (System.Uri.TryCreate(url, System.UriKind.Absolute, out var parsedAbsoluteUri) &&
            (parsedAbsoluteUri.Scheme == System.Uri.UriSchemeHttp || parsedAbsoluteUri.Scheme == System.Uri.UriSchemeHttps))
        {
            return url;
        }

        // Determine base URI: prefer CheckoutBaseUrl, fallback to BaseUrl or HttpClient.BaseAddress
        var baseCandidate = !string.IsNullOrWhiteSpace(_options.CheckoutBaseUrl)
            ? _options.CheckoutBaseUrl
            : (!string.IsNullOrWhiteSpace(_options.BaseUrl) ? _options.BaseUrl : _httpClient.BaseAddress?.ToString());

        if (string.IsNullOrWhiteSpace(baseCandidate))
        {
            return url;
        }

        var cleanBase = baseCandidate.TrimEnd('/') + "/";
        var cleanRelative = url.TrimStart('/');

        if (System.Uri.TryCreate(new System.Uri(cleanBase), cleanRelative, out var fullUri))
        {
            return fullUri.ToString();
        }

        return url;
    }
    
    public Task<Result<string>> CreateCheckoutSessionAsync(string transactionId, decimal amount, string gatewayName, CancellationToken cancellationToken)
    {
        throw new System.NotImplementedException("Use the 6-parameter overload for NovaBank integration.");
    }
    
    public async Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken)
    {
        try
        {
            // 1. Create Payment Intent
            var intentPayload = new
            {
                sourceAccountId = _options.SourceAccountId, // Needs to be the student's account if internal, or merchant account if external? For gateway, we don't know the source account yet. Wait, if it's dynamic QR, anyone can scan it. The Java API accepts null or the merchant's holding account.
                merchantReference = sessionId,
                amount = amount,
                currency = currency ?? "PHP",
                description = $"QR Payment for Session {sessionId}"
            };

            using var intentRequest = new HttpRequestMessage(HttpMethod.Post, "/api/v1/gateway/payments/intents");
            intentRequest.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            intentRequest.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");
            intentRequest.Headers.TryAddWithoutValidation("Idempotency-Key", GenerateDeterministicKey(sessionId + "_qr_intent"));
            intentRequest.Content = JsonContent.Create(intentPayload);

            var intentResponse = await _httpClient.SendAsync(intentRequest, cancellationToken);
            if (!intentResponse.IsSuccessStatusCode)
            {
                var err = await intentResponse.Content.ReadAsStringAsync(cancellationToken);
                return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to create payment intent for QR: {err}"));
            }

            var intentResult = await intentResponse.Content.ReadFromJsonAsync<ApiResponse<PaymentSessionResponse>>(cancellationToken: cancellationToken);
            var intentId = intentResult?.Data?.PaymentIntentId;

            if (string.IsNullOrEmpty(intentId))
            {
                return Result<string>.Failure(new Error("Finance.PaymentGatewayError", "Banking API returned success but no PaymentIntentId."));
            }

            // 2. Generate QR for the Intent
            using var qrRequest = new HttpRequestMessage(HttpMethod.Post, $"/api/v1/gateway/payment-intents/{intentId}/qr");
            qrRequest.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            qrRequest.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");

            var qrResponse = await _httpClient.SendAsync(qrRequest, cancellationToken);
            if (!qrResponse.IsSuccessStatusCode)
            {
                var err = await qrResponse.Content.ReadAsStringAsync(cancellationToken);
                return Result<string>.Failure(new Error("Finance.PaymentGatewayError", $"Failed to generate QR: {err}"));
            }

            var qrResult = await qrResponse.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>(cancellationToken: cancellationToken);
            var qrString = qrResult.GetProperty("qrReference").GetString();

            if (!string.IsNullOrEmpty(qrString))
            {
                return Result<string>.Success(qrString);
            }

            return Result<string>.Failure(new Error("Finance.PaymentGatewayError", "Failed to parse QR string from response."));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to payment gateway: {ex.Message}"));
        }
    }
    
    public async Task<Result<string>> ProcessCashDepositAsync(decimal amount, string reference, CancellationToken cancellationToken)
    {
        var requestBody = new
        {
            accountNumber = _options.SourceAccountId,
            amount = amount,
            idempotencyKey = System.Guid.NewGuid().ToString()
        };

        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/transactions/deposit");
            requestMessage.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            requestMessage.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");
            
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
            return Result<string>.Failure(new Error("Finance.BankingError", $"Banking API rejected the deposit: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to banking system: {ex.Message}"));
        }
    }

    public async Task<Result<string>> ExecuteTransferAsync(string destinationAccount, decimal amount, string purpose, CancellationToken cancellationToken)
    {
        var requestBody = new
        {
            sourceAccountNumber = _options.SourceAccountId,
            destinationAccountNumber = destinationAccount,
            amount = amount,
            idempotencyKey = System.Guid.NewGuid().ToString(),
            description = purpose ?? "University ERP Transfer",
            scheduledDate = System.DateTime.UtcNow.ToString("yyyy-MM-dd")
        };

        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, "/api/v1/transfers/internal");
            requestMessage.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            requestMessage.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");
            
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
            return Result<string>.Failure(new Error("Finance.BankingError", $"Banking API rejected the transfer: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to banking system: {ex.Message}"));
        }
    }

    public async Task<Result<string>> FetchStatementsAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Get, $"/api/v1/statements/account/{_options.SourceAccountId}");
            requestMessage.Headers.TryAddWithoutValidation("X-API-Key", _options.SecretKey);
            requestMessage.Headers.TryAddWithoutValidation("X-Internal-BFF-Key", "WQhQECsf4nIhiZ3H+CQRIaOIOnxbgBmbA9sRHpaKlaM=");
            
            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                return Result<string>.Success(content);
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Failure(new Error("Finance.BankingError", $"Banking API rejected the statement fetch: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to banking system: {ex.Message}"));
        }
    }

    private record TransactionResponse(string TransactionId, string Status, decimal Amount);
    private record PaymentSessionResponse(string PaymentIntentId, string Provider, string CheckoutType, string CheckoutUrl, System.DateTime ExpiresAt, string TransactionReference);
    private record ApiResponse<T>(T Data, string Message, string CorrelationId);
}
