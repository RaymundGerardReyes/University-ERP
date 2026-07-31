namespace Facilities.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class FacilityReservation : AggregateRoot<Guid>
{
    public string RoomName { get; private set; } = string.Empty;
    public string ReservedBy { get; private set; } = string.Empty;
    public DateTime StartTime { get; private set; }
    public DateTime EndTime { get; private set; }
    public string Status { get; private set; } = string.Empty;

    private FacilityReservation() { }

    private FacilityReservation(Guid id, string roomName, string reservedBy, DateTime startTime, DateTime endTime) : base(id)
    {
        RoomName = roomName;
        ReservedBy = reservedBy;
        StartTime = startTime;
        EndTime = endTime;
        Status = "Confirmed";
    }

    public static Result<FacilityReservation> Book(string roomName, string reservedBy, DateTime startTime, DateTime endTime)
    {
        if (startTime >= endTime)
        {
            return Result<FacilityReservation>.Failure(new Error("Facilities.InvalidTime", "Start time must be before end time."));
        }

        return Result<FacilityReservation>.Success(new FacilityReservation(Guid.NewGuid(), roomName, reservedBy, startTime, endTime));
    }
}
