namespace Registrar.Domain.Aggregates;

using System;

public sealed class CourseSection
{
    public string Id { get; set; } = string.Empty;
    public string CourseCode { get; set; } = string.Empty;
    public string Schedule { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public Guid FacultyId { get; set; }
}
