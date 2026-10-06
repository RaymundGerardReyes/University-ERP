namespace Hostel.Application.Features.AllocateRoom;

using MediatR;
using SharedKernel.Domain.Primitives;
using Hostel.Domain.Aggregates;
using Hostel.Application.Abstractions;
using Contracts.IntegrationEvents.StudentLifecycle;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record AllocateRoomCommand(
    Guid StudentId,
    string HostelName,
    string RoomNumber,
    string RoomType,
    decimal MonthlyFee,
    int Capacity
) : IRequest<Result<Guid>>;

public sealed class AllocateRoomCommandHandler : IRequestHandler<AllocateRoomCommand, Result<Guid>>
{
    private readonly IRoomAllocationRepository _repository;
    private readonly IPublisher _publisher;

    public AllocateRoomCommandHandler(IRoomAllocationRepository repository, IPublisher publisher)
    {
        _repository = repository;
        _publisher = publisher;
    }

    public async Task<Result<Guid>> Handle(AllocateRoomCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify student doesn't already have an active allocation
        var existing = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (existing != null && existing.Status != "Vacated")
        {
            return Result<Guid>.Failure(new Error("Hostel.AlreadyAllocated", "Student already has an active hostel room allocation."));
        }

        // 2. Query current room occupancy
        var currentOccupancy = await _repository.GetRoomOccupancyAsync(request.HostelName, request.RoomNumber, cancellationToken);

        // 3. Create aggregate enforcing capacity invariants
        var allocationResult = RoomAllocation.Allocate(
            request.StudentId,
            request.HostelName,
            request.RoomNumber,
            request.RoomType,
            request.MonthlyFee,
            request.Capacity,
            currentOccupancy
        );

        if (allocationResult.IsFailure)
        {
            return Result<Guid>.Failure(allocationResult.Error);
        }

        var allocation = allocationResult.Value;
        await _repository.AddAsync(allocation, cancellationToken);

        // 4. Publish cross-module integration event for Finance
        var integrationEvent = new RoomAllocatedIntegrationEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            request.StudentId,
            request.HostelName,
            request.RoomNumber,
            request.MonthlyFee
        );

        await _publisher.Publish(integrationEvent, cancellationToken);

        return Result<Guid>.Success(allocation.Id);
    }
}

