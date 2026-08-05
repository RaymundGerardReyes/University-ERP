namespace StudentInformation.Domain.Aggregates;

using System;

public sealed class FacultyAdvisee
{
    public string Id { get; set; } = string.Empty;
    public Guid FacultyId { get; set; }
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty;
    public int DegreeProgress { get; set; }
    public string Status { get; set; } = string.Empty;
}
