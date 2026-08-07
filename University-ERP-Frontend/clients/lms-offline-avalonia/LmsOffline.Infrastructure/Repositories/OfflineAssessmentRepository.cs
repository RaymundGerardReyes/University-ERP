namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;
using LmsOffline.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core implementation for the offline assessment repository.
/// </summary>
public class OfflineAssessmentRepository : IOfflineAssessmentRepository
{
    private readonly EncryptedSqliteContext _context;

    public OfflineAssessmentRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<OfflineAssessment>().FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task<IEnumerable<OfflineAssessment>> GetBySyncStatusAsync(SyncStatus status, CancellationToken cancellationToken = default)
    {
        return await _context.Set<OfflineAssessment>()
            .Where(a => a.SyncState == status)
            .ToListAsync(cancellationToken);
    }

    public async Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        _context.Set<OfflineAssessment>().Update(assessment);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task SaveAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        var exists = await _context.Set<OfflineAssessment>().AnyAsync(a => a.Id == assessment.Id, cancellationToken);
        if (exists)
        {
            _context.Set<OfflineAssessment>().Update(assessment);
        }
        else
        {
            await _context.Set<OfflineAssessment>().AddAsync(assessment, cancellationToken);
        }
        
        await _context.SaveChangesAsync(cancellationToken);
    }
}