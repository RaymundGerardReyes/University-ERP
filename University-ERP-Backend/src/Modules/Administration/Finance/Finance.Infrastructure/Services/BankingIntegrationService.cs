namespace Finance.Infrastructure.Services;

using Finance.Application.Abstractions;
using SharedKernel.Domain.Primitives;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading;
using System.Threading.Tasks;

public sealed class BankingIntegrationService : IPaymentGatewayService
{
    private readonly HttpClient _httpClient;

    public BankingIntegrationService(HttpClient httpClient)
    {
        _httpClient = httpClient;
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
    
    public async Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken)
    {
        try
        {
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"/api/v1/gateway/payment-intents/{sessionId}/qr");
            requestMessage.Headers.Add("X-Merchant-Id", "UNIV-ERP-01");
            
            var response = await _httpClient.SendAsync(requestMessage, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<DynamicQrPayment>(cancellationToken: cancellationToken);
                if (result != null && !string.IsNullOrEmpty(result.QrPayload))
                {
                    return Result<string>.Success(result.QrPayload);
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            return Result<string>.Failure(new Error("Finance.BankingInstrumentError", $"Bank failed to generate payment instrument: {errorContent}"));
        }
        catch (HttpRequestException ex)
        {
            return Result<string>.Failure(new Error("Finance.BankingConnectionError", $"Could not connect to banking system: {ex.Message}"));
        }
    }
    
    private record TransactionResponse(string TransactionId, string Status, decimal Amount);
    private record ApiResponse<T>(T Data, string Message, string CorrelationId);
    private record DynamicQrPayment(string QrPayload, string QrReference, string Status, System.DateTime Expiration);
}
