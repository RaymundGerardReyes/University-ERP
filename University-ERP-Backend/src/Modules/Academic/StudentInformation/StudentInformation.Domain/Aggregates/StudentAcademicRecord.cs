namespace StudentInformation.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;

public sealed class StudentAcademicRecord : AggregateRoot<Guid>
{
    public string StudentId { get; private set; } = string.Empty;
    public decimal CumulativeGpa { get; private set; }
    public int TotalEarnedUnits { get; private set; }
    
    // Default to Good Standing upon admission
    public string AcademicStanding { get; private set; } = "GOOD"; 

    public string GraduationStatus { get; private set; } = "Not Eligible";

    private readonly List<CourseGradeRecord> _courseRecords = new();
    public IReadOnlyCollection<CourseGradeRecord> CourseRecords => _courseRecords.AsReadOnly();

    private StudentAcademicRecord() { }

    public StudentAcademicRecord(Guid id, string studentId) : base(id)
    {
        StudentId = studentId;
    }

    /// <summary>
    /// Records a new course enrollment so the credits are available for future math computation.
    /// </summary>
    public void AddCourseRecord(string sectionId, string courseCode, int credits)
    {
        if (!_courseRecords.Any(c => c.SectionId == sectionId))
        {
            _courseRecords.Add(new CourseGradeRecord(Guid.NewGuid(), sectionId, courseCode, credits));
        }
    }

    /// <summary>
    /// The primary domain action triggered by the GradesPostedIntegrationEventConsumer.
    /// </summary>
    public Result<bool> RecordGradeAndComputeGpa(string sectionId, decimal finalGrade)
    {
        var course = _courseRecords.FirstOrDefault(c => c.SectionId == sectionId);
        
        if (course == null)
        {
            return Result<bool>.Failure(new Error("AcademicRecord.CourseNotFound", "The student is not enrolled in the specified section."));
        }

        // 1. Assign the grade to the specific course
        course.AssignGrade(finalGrade);

        // 2. Recompute the exact GPA mathematics
        ComputeCumulativeGpa();

        // 3. Enforce university academic standing policies
        EvaluateAcademicStanding();

        return Result<bool>.Success(true);
    }

    private void ComputeCumulativeGpa()
    {
        var gradedCourses = _courseRecords.Where(c => c.IsGraded).ToList();

        if (!gradedCourses.Any())
        {
            CumulativeGpa = 0;
            TotalEarnedUnits = 0;
            return;
        }

        decimal totalGradePoints = 0;
        int totalCredits = 0;

        foreach (var course in gradedCourses)
        {
            totalGradePoints += course.Grade!.Value * course.Credits;
            totalCredits += course.Credits;
        }

        TotalEarnedUnits = totalCredits;
        
        // Round strictly to two decimal places as required by standard academic transcripts
        CumulativeGpa = Math.Round(totalGradePoints / totalCredits, 2);
    }

    private void EvaluateAcademicStanding()
    {
        // Enforce the Academic Governance Thresholds dynamically
        if (CumulativeGpa >= 2.0m)
        {
            AcademicStanding = "GOOD";
        }
        else if (CumulativeGpa >= 1.0m)
        {
            AcademicStanding = "PROBATION";
        }
        else
        {
            AcademicStanding = "DISMISSED";
        }
    }

    public Result<bool> RequestGraduationClearance(int requiredCredits = 120)
    {
        if (TotalEarnedUnits < requiredCredits)
        {
            return Result<bool>.Failure(new Error("Graduation.InsufficientCredits", $"Student has only {TotalEarnedUnits} of {requiredCredits} required credits."));
        }

        if (AcademicStanding != "GOOD")
        {
            return Result<bool>.Failure(new Error("Graduation.NotGoodStanding", "Student must be in GOOD academic standing to graduate."));
        }

        GraduationStatus = "Pending Review";
        return Result<bool>.Success(true);
    }

    public Result<bool> ApproveGraduation()
    {
        if (GraduationStatus != "Pending Review")
        {
            return Result<bool>.Failure(new Error("Graduation.InvalidState", "Graduation clearance must be pending review before approval."));
        }

        GraduationStatus = "Approved";
        // Here we could raise a StudentGraduatedDomainEvent
        return Result<bool>.Success(true);
    }
}

public sealed class CourseGradeRecord : Entity<Guid>
{
    public string SectionId { get; private set; } = string.Empty;
    public string CourseCode { get; private set; } = string.Empty;
    public int Credits { get; private set; }
    public decimal? Grade { get; private set; }
    
    public bool IsGraded => Grade.HasValue;

    private CourseGradeRecord() { }

    internal CourseGradeRecord(Guid id, string sectionId, string courseCode, int credits) : base(id)
    {
        SectionId = sectionId;
        CourseCode = courseCode;
        Credits = credits;
    }

    internal void AssignGrade(decimal grade)
    {
        Grade = grade;
    }
}
