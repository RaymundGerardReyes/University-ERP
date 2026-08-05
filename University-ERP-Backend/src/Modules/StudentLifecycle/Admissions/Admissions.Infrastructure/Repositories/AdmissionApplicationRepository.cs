namespace Admissions.Infrastructure.Repositories;

using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Admissions.Application.Abstractions;
using Admissions.Domain.Aggregates;
using Admissions.Infrastructure.Persistence;

public sealed class AdmissionApplicationRepository : IAdmissionApplicationRepository
{
    private readonly AdmissionsDbContext _dbContext;

    public AdmissionApplicationRepository(AdmissionsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<AdmissionApplication?> GetByIdAsync(string id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications
            .Include(a => a.Documents)
            .Include(a => a.TimelineEvents)
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IReadOnlyList<AdmissionApplication>> GetByApplicantIdAsync(string applicantId, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications
            .Include(a => a.Documents)
            .Include(a => a.TimelineEvents)
            .Where(a => a.ApplicantId == applicantId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<AdmissionApplication>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Applications
            .Include(a => a.Documents)
            .Include(a => a.TimelineEvents)
            .ToListAsync(cancellationToken);
    }

    public void Add(AdmissionApplication application)
    {
        _dbContext.Applications.Add(application);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}