namespace LmsOffline.Domain.Aggregates;

using System;
using SharedKernel.Domain.Primitives;

public sealed class GradeRecord : AggregateRoot<Guid>
{
    public string StudentIdNumber { get; private set; } = string.Empty;
    public string CourseCode { get; private set; } = string.Empty;
    public string AssessmentTitle { get; private set; } = string.Empty;
    public double Score { get; private set; }
    public double MaxScore { get; private set; }
    public string Remarks { get; private set; } = string.Empty;
    public DateTime EvaluatedOnUtc { get; private set; }
    public DateTime SyncedAtUtc { get; private set; }

    private GradeRecord() { }

    public GradeRecord(Guid id, string studentIdNumber, string courseCode, string assessmentTitle, double score, double maxScore, string remarks, DateTime evaluatedOnUtc) : base(id)
    {
        StudentIdNumber = studentIdNumber;
        CourseCode = courseCode;
        AssessmentTitle = assessmentTitle;
        Score = score;
        MaxScore = maxScore;
        Remarks = remarks;
        EvaluatedOnUtc = evaluatedOnUtc;
        SyncedAtUtc = DateTime.UtcNow;
    }
}
