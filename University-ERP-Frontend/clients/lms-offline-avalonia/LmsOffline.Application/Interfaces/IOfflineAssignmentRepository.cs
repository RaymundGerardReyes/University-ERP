namespace LmsOffline.Application.Interfaces;

using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface IOfflineAssignmentRepository
{
    Task UpdateAsync(OfflineAssignment assignment, CancellationToken cancellationToken = default);
    Task<OfflineAssignment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
