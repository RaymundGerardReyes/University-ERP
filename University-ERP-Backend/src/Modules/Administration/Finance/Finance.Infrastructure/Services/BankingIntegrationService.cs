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
            Token = paymentToken,
            Amount = amount,
            Currency = currency
        };

        try
        {
            // Call the real external Banking System API
            var response = await _httpClient.PostAsJsonAsync("/api/banking/v1/charge", requestBody, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<BankingChargeResponse>(cancellationToken: cancellationToken);
                if (result != null && !string.IsNullOrEmpty(result.TransactionId))
                {
                    return Result<string>.Success(result.TransactionId);
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
        var requestBody = new
        {
            ReferenceId = sessionId,
            Amount = amount,
            Currency = currency,
            Type = "QR_PH"
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync("/api/banking/v1/instruments", requestBody, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<BankingInstrumentResponse>(cancellationToken: cancellationToken);
                if (result != null && !string.IsNullOrEmpty(result.Payload))
                {
                    return Result<string>.Success(result.Payload);
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
    
    private record BankingChargeResponse(string TransactionId, string Status);
    private record BankingInstrumentResponse(string InstrumentId, string Payload, string Type);
}
