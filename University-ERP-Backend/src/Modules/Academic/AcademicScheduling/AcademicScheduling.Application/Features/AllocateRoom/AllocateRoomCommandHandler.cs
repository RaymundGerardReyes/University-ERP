namespace AcademicScheduling.Application.Features.AllocateRoom;

using MediatR;
using SharedKernel.Domain.Primitives;
using AcademicScheduling.Domain.Aggregates;
using AcademicScheduling.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class AllocateRoomCommandHandler : IRequestHandler<AllocateRoomCommand, Result<Guid>>
{
    private readonly ISchedulingRepository _repository;

    public AllocateRoomCommandHandler(ISchedulingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(AllocateRoomCommand request, CancellationToken cancellationToken)
    {
        // 1. Invoke the ClassSession Aggregate to validate invariants (e.g., StartTime < EndTime)
        var sessionResult = ClassSession.Schedule(
            request.CourseCode, 
            request.RoomNumber, 
            Guid.NewGuid(), // Placeholder: typically fetched from Context or Command
            request.DayOfWeek, 
            request.StartTime, 
            request.EndTime);

        if (sessionResult.IsFailure)
        {
            return Result<Guid>.Failure(sessionResult.Error);
        }

        // 2. Conflict detection via the Repository
        bool hasConflict = await _repository.HasOverlapAsync(
            request.RoomNumber, 
            request.DayOfWeek, 
            request.StartTime, 
            request.EndTime, 
            cancellationToken);

        if (hasConflict)
        {
            return Result<Guid>.Failure(new Error(
                "Scheduling.Conflict", 
                $"Room {request.RoomNumber} is already booked for this time slot."));
        }

        // 3. Persist the clean allocation
        await _repository.AddAsync(sessionResult.Value, cancellationToken);

        return Result<Guid>.Success(sessionResult.Value.Id);
    }
}