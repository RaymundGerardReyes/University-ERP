namespace LmsOffline.Application.Interfaces;

using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

#region Interfaces
/// <summary>
/// Repository abstraction for managing OfflineAssessment aggregates.
/// </summary>
public interface IOfflineAssessmentRepository
{
    /// <summary>
    /// Retrieves an offline assessment by its unique identifier.
    /// </summary>
    Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists changes to an existing offline assessment.
    /// </summary>
    Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default);
}
#endregion
