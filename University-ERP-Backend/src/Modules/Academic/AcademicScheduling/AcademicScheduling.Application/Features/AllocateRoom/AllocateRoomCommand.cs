namespace AcademicScheduling.Application.Features.AllocateRoom;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using AcademicScheduling.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record AllocateRoomCommand(
    string RoomNumber, 
    string CourseCode, 
    string DayOfWeek, 
    TimeSpan StartTime, 
    TimeSpan EndTime,
    int ExpectedCapacity
) : IRequest<Result<Guid>>;

public sealed class AllocateRoomCommandHandler : IRequestHandler<AllocateRoomCommand, Result<Guid>>
{
    private readonly AcademicScheduling.Application.Abstractions.IAcademicSchedulingRepository _repository;

    public AllocateRoomCommandHandler(AcademicScheduling.Application.Abstractions.IAcademicSchedulingRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(AllocateRoomCommand request, CancellationToken cancellationToken)
    {
        bool conflictExists = await _repository.HasRoomConflictAsync(request.RoomNumber, request.DayOfWeek, request.StartTime, request.EndTime, cancellationToken);

        if (conflictExists)
        {
            return Result<Guid>.Failure(new Error("Scheduling.Conflict", "Room is already booked for this time slot."));
        }

        var allocationId = Guid.NewGuid();
        var allocation = new AcademicScheduling.Domain.Aggregates.RoomAllocation
        {
            Id = allocationId,
            RoomNumber = request.RoomNumber,
            CourseCode = request.CourseCode,
            DayOfWeek = request.DayOfWeek,
            StartTime = request.StartTime,
            EndTime = request.EndTime,
            ExpectedCapacity = request.ExpectedCapacity
        };

        await _repository.AddRoomAllocationAsync(allocation, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
        
        return Result<Guid>.Success(allocationId);
    }
}