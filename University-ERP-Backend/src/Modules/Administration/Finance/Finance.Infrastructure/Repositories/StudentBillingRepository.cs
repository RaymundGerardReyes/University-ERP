namespace Finance.Infrastructure.Repositories;

using System;
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

    public async Task<StudentBilling?> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.StudentBillings
            .FirstOrDefaultAsync(b => b.StudentId == studentId, cancellationToken);
    }

    public async Task<System.Collections.Generic.IReadOnlyList<StudentBilling>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.StudentBillings.ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(StudentBilling billing, CancellationToken cancellationToken = default)
    {
        _dbContext.StudentBillings.Update(billing);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}