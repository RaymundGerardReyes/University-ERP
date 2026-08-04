namespace Admissions.Infrastructure.Repositories;

using Admissions.Application.Abstractions;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public sealed class ProgramOfferingRepository : IProgramOfferingRepository
{
    private readonly AdmissionsDbContext _dbContext;

    public ProgramOfferingRepository(AdmissionsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<ProgramOffering>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.ProgramOfferings.ToListAsync(cancellationToken);
    }

    public async Task<ProgramOffering?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.ProgramOfferings.FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }
}
