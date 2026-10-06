namespace Hostel.Application.Abstractions;

using Hostel.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public interface IRoomAllocationRepository
{
    Task<RoomAllocation?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<RoomAllocation?> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<int> GetRoomOccupancyAsync(string hostelName, string roomNumber, CancellationToken cancellationToken = default);
    Task AddAsync(RoomAllocation allocation, CancellationToken cancellationToken = default);
    Task UpdateAsync(RoomAllocation allocation, CancellationToken cancellationToken = default);
}

