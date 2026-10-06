namespace Hostel.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class RoomAllocation : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public string HostelName { get; private set; } = string.Empty;
    public string RoomNumber { get; private set; } = string.Empty;
    public string RoomType { get; private set; } = string.Empty;
    public decimal MonthlyFee { get; private set; }
    public int Capacity { get; private set; }
    public int CurrentOccupancy { get; private set; }
    public string Status { get; private set; } = string.Empty;
    public DateTime AllocatedOnUtc { get; private set; }

    private RoomAllocation() { }

    private RoomAllocation(
        Guid id,
        Guid studentId,
        string hostelName,
        string roomNumber,
        string roomType,
        decimal monthlyFee,
        int capacity,
        int currentOccupancy) : base(id)
    {
        StudentId = studentId;
        HostelName = hostelName;
        RoomNumber = roomNumber;
        RoomType = roomType;
        MonthlyFee = monthlyFee;
        Capacity = capacity;
        CurrentOccupancy = currentOccupancy;
        Status = "Allocated";
        AllocatedOnUtc = DateTime.UtcNow;
    }

    public static Result<RoomAllocation> Allocate(
        Guid studentId,
        string hostelName,
        string roomNumber,
        string roomType,
        decimal monthlyFee,
        int capacity,
        int currentOccupancy = 0)
    {
        if (studentId == Guid.Empty)
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.InvalidStudentId", "Valid student ID is required for room allocation."));
        }

        if (string.IsNullOrWhiteSpace(hostelName))
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.InvalidHostel", "Hostel name is required."));
        }

        if (string.IsNullOrWhiteSpace(roomNumber))
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.InvalidRoomNumber", "Room number is required."));
        }

        if (monthlyFee <= 0)
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.InvalidMonthlyFee", "Monthly accommodation fee must be greater than zero."));
        }

        if (capacity <= 0)
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.InvalidCapacity", "Room capacity must be at least 1."));
        }

        if (currentOccupancy >= capacity)
        {
            return Result<RoomAllocation>.Failure(new Error("Hostel.RoomCapacityExceeded", $"Room {roomNumber} in {hostelName} has reached maximum occupancy of {capacity}."));
        }

        var allocation = new RoomAllocation(
            Guid.NewGuid(),
            studentId,
            hostelName,
            roomNumber,
            roomType,
            monthlyFee,
            capacity,
            currentOccupancy + 1
        );

        return Result<RoomAllocation>.Success(allocation);
    }

    public Result<bool> CheckIn()
    {
        if (Status != "Allocated")
        {
            return Result<bool>.Failure(new Error("Hostel.InvalidState", $"Cannot check in when allocation status is {Status}."));
        }

        Status = "CheckedIn";
        return Result<bool>.Success(true);
    }

    public Result<bool> Vacate()
    {
        if (Status != "CheckedIn" && Status != "Allocated")
        {
            return Result<bool>.Failure(new Error("Hostel.InvalidState", $"Cannot vacate when allocation status is {Status}."));
        }

        Status = "Vacated";
        CurrentOccupancy = Math.Max(0, CurrentOccupancy - 1);
        return Result<bool>.Success(true);
    }
}

