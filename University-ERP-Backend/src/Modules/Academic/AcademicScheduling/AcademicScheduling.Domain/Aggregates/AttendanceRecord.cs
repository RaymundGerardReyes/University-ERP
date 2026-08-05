namespace AcademicScheduling.Domain.Aggregates;

using System;

public sealed class AttendanceRecord
{
    public Guid Id { get; set; }
    public string SectionId { get; set; } = string.Empty;
    public string Data { get; set; } = string.Empty; // Store as JSON string
    public DateTime SubmittedAtUtc { get; set; }
}
