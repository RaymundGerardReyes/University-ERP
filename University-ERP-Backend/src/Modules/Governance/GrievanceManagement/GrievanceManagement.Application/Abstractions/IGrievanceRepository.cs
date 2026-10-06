namespace GrievanceManagement.Application.Abstractions;

using GrievanceManagement.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public interface IGrievanceRepository
{
    Task<Complaint?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(Complaint complaint, CancellationToken cancellationToken = default);
    Task UpdateAsync(Complaint complaint, CancellationToken cancellationToken = default);
}
