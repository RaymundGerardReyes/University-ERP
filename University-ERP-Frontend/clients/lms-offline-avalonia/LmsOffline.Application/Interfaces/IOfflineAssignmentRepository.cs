namespace LmsOffline.Application.Interfaces;

using System;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using LmsOffline.Domain.Aggregates;

public interface IOfflineAssignmentRepository
{
    Task UpdateAsync(OfflineAssignment assignment, CancellationToken cancellationToken = default);
    Task<OfflineAssignment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<OfflineAssignment>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(OfflineAssignment assignment, CancellationToken cancellationToken = default);
}
