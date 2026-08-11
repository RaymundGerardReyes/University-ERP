namespace Finance.Infrastructure.Repositories;

using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Finance.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

public sealed class CashTransactionRepository : ICashTransactionRepository
{
    private readonly FinanceDbContext _dbContext;

    public CashTransactionRepository(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(CashTransaction transaction, CancellationToken cancellationToken = default)
    {
        await _dbContext.CashTransactions.AddAsync(transaction, cancellationToken);
    }

    public async Task<CashTransaction?> GetByTokenAsync(string token, CancellationToken cancellationToken = default)
    {
        return await _dbContext.CashTransactions
            .FirstOrDefaultAsync(t => t.TransactionToken == token, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}