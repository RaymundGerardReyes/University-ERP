namespace LmsOffline.Infrastructure.Sync;

using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Infrastructure.Persistence;
using LmsOffline.Domain.ValueObjects;

public sealed class OutboxSyncProcessor
{
    private readonly EncryptedSqliteContext _dbContext;

    public OutboxSyncProcessor(EncryptedSqliteContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task ProcessPendingOutboxAsync(CancellationToken cancellationToken = default)
    {
        // 1. Sync Assessments
        var pendingAssessments = await _dbContext.Assessments
            .Where(a => a.SyncState == SyncStatus.PendingSync && a.IsStarted)
            .ToListAsync(cancellationToken);

        foreach (var assessment in pendingAssessments)
        {
            assessment.UpdateSyncStatus(SyncStatus.Synced); // Simulated success
        }

        // 2. Sync Assignments
        var pendingAssignments = await _dbContext.Assignments
            .Where(a => a.SyncState == SyncStatus.PendingSync)
            .ToListAsync(cancellationToken);

        foreach (var assignment in pendingAssignments)
        {
            assignment.UpdateSyncStatus(SyncStatus.Synced); // Simulated success
        }

        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}
