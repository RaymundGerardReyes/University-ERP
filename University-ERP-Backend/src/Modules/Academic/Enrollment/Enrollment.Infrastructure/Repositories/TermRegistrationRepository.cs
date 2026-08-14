namespace Enrollment.Infrastructure.Repositories;

using Enrollment.Application.Abstractions;
using Enrollment.Domain.Aggregates;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed class TermRegistrationRepository : ITermRegistrationRepository
{
    private readonly DbContext _dbContext;

    public TermRegistrationRepository(DbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Used by the Registrar Dashboard to populate the Validation Queue
    public async Task<IReadOnlyList<TermRegistration>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<TermRegistration>()
            .Include(r => r.LineItems)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }

    // Used by the DropCourse/AddCourse workflows to safely mutate state
    public async Task<TermRegistration?> GetActiveRegistrationAsync(string studentId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<TermRegistration>()
            .Include(r => r.LineItems)
            .Where(r => r.StudentId == studentId && r.Status != "WITHDRAWN" && r.Status != "COMPLETED")
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(TermRegistration registration, CancellationToken cancellationToken = default)
    {
        await _dbContext.Set<TermRegistration>().AddAsync(registration, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(TermRegistration registration, CancellationToken cancellationToken = default)
    {
        _dbContext.Set<TermRegistration>().Update(registration);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
