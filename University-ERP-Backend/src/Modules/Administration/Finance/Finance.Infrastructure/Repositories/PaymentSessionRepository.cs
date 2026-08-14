namespace Finance.Infrastructure.Repositories;

using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Finance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class PaymentSessionRepository : IPaymentSessionRepository
{
    private readonly FinanceDbContext _dbContext;

    public PaymentSessionRepository(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(PaymentSession session, CancellationToken cancellationToken = default)
    {
        await _dbContext.PaymentSessions.AddAsync(session, cancellationToken);
    }

    public async Task<PaymentSession?> GetBySessionIdAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.PaymentSessions
            .FirstOrDefaultAsync(s => s.SessionId == sessionId, cancellationToken);
    }

    public async Task<List<PaymentSession>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.PaymentSessions
            .OrderByDescending(s => s.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

