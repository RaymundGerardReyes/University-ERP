namespace AcademicScheduling.Domain.Aggregates;

using System;

public sealed class RoomAllocation
{
    public Guid Id { get; set; }
    public string RoomNumber { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string DayOfWeek { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int ExpectedCapacity { get; set; }
}
