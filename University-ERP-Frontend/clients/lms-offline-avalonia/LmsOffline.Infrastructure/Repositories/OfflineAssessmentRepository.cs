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

public class OfflineAssessmentRepository : IOfflineAssessmentRepository
{
    private readonly EncryptedSqliteContext _dbContext;

    public OfflineAssessmentRepository(EncryptedSqliteContext dbContext)
    {
        _dbContext = dbContext;
    }

    // 1. Restored: The original codebase pattern for offline saving
    public async Task SaveAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        var exists = await _dbContext.Set<OfflineAssessment>().AnyAsync(a => a.Id == assessment.Id, cancellationToken);
        if (!exists)
        {
            await _dbContext.Set<OfflineAssessment>().AddAsync(assessment, cancellationToken);
        }
        else
        {
            _dbContext.Set<OfflineAssessment>().Update(assessment);
        }
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    // 2. New: Retrieves all assessments that the OutboxSyncProcessor needs to push
    public async Task<List<OfflineAssessment>> GetPendingSyncAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<OfflineAssessment>()
            .Where(a => a.SyncState == SyncStatus.PendingSync || a.SyncState == SyncStatus.Conflict)
            .ToListAsync(cancellationToken);
    }

    // 3. New: Updates an existing assessment's state (e.g., changing status to 'Synced')
    public async Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        _dbContext.Set<OfflineAssessment>().Update(assessment);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    // 4. New: Explicit add method
    public async Task AddAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        await _dbContext.Set<OfflineAssessment>().AddAsync(assessment, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    // 5. New: Standard aggregate retrieval by ID
    public async Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<OfflineAssessment>()
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<List<OfflineAssessment>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<OfflineAssessment>().ToListAsync(cancellationToken);
    }
}