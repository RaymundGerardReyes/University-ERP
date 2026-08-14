namespace Finance.Application.Abstractions;

using Finance.Domain.Aggregates;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public interface IPaymentSessionRepository
{
    Task AddAsync(PaymentSession session, CancellationToken cancellationToken = default);
    Task<PaymentSession?> GetBySessionIdAsync(string sessionId, CancellationToken cancellationToken = default);
    Task<List<PaymentSession>> GetAllAsync(CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

