namespace LmsOffline.Application.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface IOfflineAssessmentRepository
{
    // Restored: The existing codebase pattern for offline saving
    Task SaveAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
    
    // Kept: The methods required for the Outbox Sync Processor
    Task<List<OfflineAssessment>> GetPendingSyncAsync(CancellationToken cancellationToken = default);
    Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
    Task AddAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
    Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}