namespace LearningManagement.Domain.Aggregates;

using System;

public sealed class StudentGradeRecord
{
    public Guid AssessmentId { get; set; }
    public string CourseCode { get; set; } = string.Empty;
    public string AssessmentTitle { get; set; } = string.Empty;
    public double Score { get; set; }
    public double MaxScore { get; set; }
    public string? FacultyRemarks { get; set; }
    public DateTime EvaluatedOnUtc { get; set; }
}
