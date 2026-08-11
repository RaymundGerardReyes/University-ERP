namespace Finance.Application.Abstractions;

using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;

public interface IPaymentGatewayService
{
    Task<Result<string>> ProcessChargeAsync(string paymentToken, decimal amount, string currency, CancellationToken cancellationToken);
    
    // NEW: Ask the bank to generate a valid, authoritative payment instrument (like a QR Ph payload)
    Task<Result<string>> GeneratePaymentInstrumentAsync(string sessionId, decimal amount, string currency, CancellationToken cancellationToken);
}
