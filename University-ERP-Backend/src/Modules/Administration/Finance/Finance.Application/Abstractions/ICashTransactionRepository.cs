namespace Finance.Application.Abstractions;

using Finance.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface ICashTransactionRepository
{
    Task AddAsync(CashTransaction transaction, CancellationToken cancellationToken = default);
    Task<CashTransaction?> GetByTokenAsync(string token, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}