namespace LmsOffline.Application.Interfaces;

using System;
using System.Threading;
using System.Threading.Tasks;
using LmsOffline.Domain.Aggregates;

public interface IOfflineModuleRepository
{
    Task AddAsync(OfflineModule module, CancellationToken cancellationToken = default);
    Task<OfflineModule?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
