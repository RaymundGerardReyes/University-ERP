namespace AcademicScheduling.Application.Features.AllocateRoom;

using MediatR;
using SharedKernel.Domain.Primitives;

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
    public Task<Result<Guid>> Handle(AllocateRoomCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch Room details from scheduling repository
        // 2. Verify ExpectedCapacity <= Room.Capacity
        // 3. Query existing ClassSessions for overlap on DayOfWeek / StartTime -> EndTime
        // 4. Return Conflict Error if overlap detected
        
        bool hasConflict = false; // Mock DBMA check
        if (hasConflict)
        {
            return Task.FromResult(Result<Guid>.Failure(new Error("Scheduling.Conflict", "Room is already booked for this time slot.")));
        }

        var allocationId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(allocationId));
    }
}