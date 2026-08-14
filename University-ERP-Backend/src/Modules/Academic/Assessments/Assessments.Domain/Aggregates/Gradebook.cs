namespace Assessments.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using Assessments.Domain.Events;
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class Gradebook : AggregateRoot<Guid>
{
    public string SectionId { get; private set; } = string.Empty;
    public string Status { get; private set; } = "Open";
    
    private readonly List<StudentGradeRecord> _roster = new();
    public IReadOnlyCollection<StudentGradeRecord> Roster => _roster.AsReadOnly();

    private Gradebook() { }

    public Gradebook(Guid id, string sectionId) : base(id)
    {
        SectionId = sectionId;
        Status = "Open";
    }

    public Result<bool> SubmitOfficialGrades(Dictionary<string, decimal> finalGrades)
    {
        if (Status == "Closed")
        {
            return Result<bool>.Failure(new Error("Assessments.Closed", "This gradebook has already been finalized and closed."));
        }

        foreach (var grade in finalGrades)
        {
            var studentRecord = _roster.FirstOrDefault(r => r.StudentId == grade.Key);
            if (studentRecord != null)
            {
                studentRecord.UpdateFinalGrade(grade.Value);
            }
        }

        Status = "Closed"; // Lock the gradebook

        // Raise the domain event to trigger the GPA computation saga
        RaiseDomainEvent(new SectionGradesPostedDomainEvent(
            Guid.NewGuid(),
            DateTime.UtcNow,
            SectionId,
            finalGrades
        ));

        return Result<bool>.Success(true);
    }
}

public sealed class StudentGradeRecord : Entity<Guid>
{
    public string StudentId { get; private set; } = string.Empty;
    public decimal? FinalGrade { get; private set; }
    public string Status { get; private set; } = "Pending";

    private StudentGradeRecord() { }

    internal StudentGradeRecord(Guid id, string studentId) : base(id)
    {
        StudentId = studentId;
        Status = "Pending";
    }

    public void UpdateFinalGrade(decimal grade)
    {
        FinalGrade = grade;
        Status = "Graded";
    }
}
