namespace LmsOffline.Application.Interfaces;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Defines the contract for accessing offline assessment data.
/// </summary>
public interface IOfflineAssessmentRepository
{
    // Default cancellation tokens satisfy callers with 1 or 2 arguments
    Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<OfflineAssessment>> GetBySyncStatusAsync(SyncStatus status, CancellationToken cancellationToken = default);
    Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
    Task SaveAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
}