namespace Examination.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

/// <summary>
/// Enterprise Assessment and Examination Management.
/// Evaluates submissions from the LMS and calculates the final official grade.
/// </summary>
public sealed class ExamResult : AggregateRoot<Guid>
{
    public Guid AssessmentId { get; private set; }
    public Guid StudentId { get; private set; }
    public decimal Score { get; private set; }
    public string Grade { get; private set; } = string.Empty;
    public bool IsPublished { get; private set; }
    public DateTime GradedOnUtc { get; private set; }

    // Required by EF Core
    private ExamResult() { }

    private ExamResult(Guid id, Guid assessmentId, Guid studentId, decimal score, string grade) : base(id)
    {
        AssessmentId = assessmentId;
        StudentId = studentId;
        Score = score;
        Grade = grade;
        IsPublished = false;
        GradedOnUtc = DateTime.UtcNow;
    }

    public static Result<ExamResult> GradeAssessment(Guid assessmentId, Guid studentId, decimal score, string grade)
    {
        if (score < 0 || score > 100)
        {
            return Result<ExamResult>.Failure(new Error("Examination.InvalidScore", "Score must be between 0 and 100."));
        }

        var result = new ExamResult(Guid.NewGuid(), assessmentId, studentId, score, grade);
        return Result<ExamResult>.Success(result);
    }

    public void Publish()
    {
        IsPublished = true;
        // In the Application layer, this triggers the ExamResultPublishedIntegrationEvent
        // which updates the SIS/Registrar Transcript and the LMS Gradebook.
    }
}