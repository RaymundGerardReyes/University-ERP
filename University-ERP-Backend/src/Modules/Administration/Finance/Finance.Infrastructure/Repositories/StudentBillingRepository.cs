namespace Finance.Infrastructure.Repositories;

using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Finance.Infrastructure.Persistence;

public sealed class StudentBillingRepository : IStudentBillingRepository
{
    private readonly FinanceDbContext _dbContext;

    public StudentBillingRepository(FinanceDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(StudentBilling billing, CancellationToken cancellationToken = default)
    {
        await _dbContext.StudentBillings.AddAsync(billing, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}