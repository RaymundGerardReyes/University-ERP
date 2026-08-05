namespace LearningManagement.Domain.Aggregates;

using System;

public sealed class ClassPerformance
{
    public Guid Id { get; set; }
    public Guid FacultyId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public decimal AverageGrade { get; set; }
    public decimal PassRate { get; set; }
    public int AtRiskCount { get; set; }
}
