namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using System;
using StudentInformation.Domain.Aggregates;

public class EnrollmentInvariantTests
{
    [Fact]
    public void NewStudentRecord_InitializesInGoodStandingWithZeroGpa()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0001");
        record.AcademicStanding.Should().Be("GOOD");
        record.CumulativeGpa.Should().Be(0.00m);
        record.TotalEarnedUnits.Should().Be(0);
        record.GraduationStatus.Should().Be("Not Eligible");
    }

    [Fact]
    public void RecordGradeAndComputeGpa_CalculatesAccurateWeightedGpa()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0002");
        record.AddCourseRecord("SEC-01", "CS-101", 3);
        record.AddCourseRecord("SEC-02", "MATH-101", 4);

        // CS-101 grade: 3.5 * 3 = 10.5
        record.RecordGradeAndComputeGpa("SEC-01", 3.5m);
        // MATH-101 grade: 4.0 * 4 = 16.0
        // Total points: 26.5 / 7 = 3.7857 -> rounded to 3.79
        record.RecordGradeAndComputeGpa("SEC-02", 4.0m);

        record.TotalEarnedUnits.Should().Be(7);
        record.CumulativeGpa.Should().Be(3.79m);
        record.AcademicStanding.Should().Be("GOOD");
    }

    [Fact]
    public void EvaluateAcademicStanding_TransitionsToProbation_WhenGpaBetweenOneAndTwo()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0003");
        record.AddCourseRecord("SEC-01", "CS-101", 3);

        record.RecordGradeAndComputeGpa("SEC-01", 1.5m);

        record.CumulativeGpa.Should().Be(1.50m);
        record.AcademicStanding.Should().Be("PROBATION");
    }

    [Fact]
    public void EvaluateAcademicStanding_TransitionsToDismissed_WhenGpaBelowOne()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0004");
        record.AddCourseRecord("SEC-01", "CS-101", 3);

        record.RecordGradeAndComputeGpa("SEC-01", 0.75m);

        record.CumulativeGpa.Should().Be(0.75m);
        record.AcademicStanding.Should().Be("DISMISSED");
    }

    [Fact]
    public void RequestGraduationClearance_WithInsufficientCredits_FailsInvariant()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0005");
        record.AddCourseRecord("SEC-01", "CS-101", 3);
        record.RecordGradeAndComputeGpa("SEC-01", 3.5m);

        var result = record.RequestGraduationClearance(requiredCredits: 120);
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Graduation.InsufficientCredits");
    }

    [Fact]
    public void RequestGraduationClearance_InProbationStanding_FailsInvariant()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0006");
        record.AddCourseRecord("SEC-01", "CAPSTONE", 120);
        record.RecordGradeAndComputeGpa("SEC-01", 1.8m); // GPA 1.8 -> PROBATION

        var result = record.RequestGraduationClearance(requiredCredits: 120);
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Graduation.NotGoodStanding");
    }

    [Fact]
    public void RequestGraduationClearance_WhenEligible_SucceedsAndCanBeApproved()
    {
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-2026-0007");
        record.AddCourseRecord("SEC-01", "CURRICULUM-FULL", 120);
        record.RecordGradeAndComputeGpa("SEC-01", 3.8m);

        var requestResult = record.RequestGraduationClearance(requiredCredits: 120);
        requestResult.IsSuccess.Should().BeTrue();
        record.GraduationStatus.Should().Be("Pending Review");

        var approveResult = record.ApproveGraduation();
        approveResult.IsSuccess.Should().BeTrue();
        record.GraduationStatus.Should().Be("Approved");
    }
}
