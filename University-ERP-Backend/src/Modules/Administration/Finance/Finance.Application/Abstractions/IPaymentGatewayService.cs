namespace Finance.Application.Abstractions;

using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;

public interface IPaymentGatewayService
{
    Task<Result<string>> ProcessChargeAsync(string paymentToken, decimal amount, string currency, CancellationToken cancellationToken);
    
    Task<Result<string>> CreateCheckoutSessionAsync(string sessionId, decimal amount, string currency, string? idempotencyKey = null, CancellationToken cancellationToken = default);

    Task<Result<string>> CreateCheckoutSessionAsync(string transactionId, decimal amount, string gatewayName, CancellationToken cancellationToken);
    
    Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken);
}
