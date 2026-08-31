namespace StudentInformation.Tests.Unit.Domain.Aggregates;

using StudentInformation.Domain.Aggregates;
using FluentAssertions;
using Xunit;
using System;

// Source under test: StudentInformation.Domain/Aggregates/StudentAcademicRecord.cs
public class StudentAcademicRecordTests
{
    [Fact]
    public void Should_Create_Valid_Record_With_Good_Standing_Default()
    {
        // Arrange & Act
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");

        // Assert
        record.CumulativeGpa.Should().Be(0);
        record.TotalEarnedUnits.Should().Be(0);
        record.AcademicStanding.Should().Be("GOOD");
        record.GraduationStatus.Should().Be("Not Eligible");
    }

    [Fact]
    public void Should_Successfully_Add_CourseRecord_UnGraded()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");

        // Act
        record.AddCourseRecord("SEC-1A", "CS101", 3);

        // Assert
        record.CourseRecords.Should().HaveCount(1);
        record.CourseRecords.First().IsGraded.Should().BeFalse();
        record.TotalEarnedUnits.Should().Be(0); // Credits not earned until graded
    }

    [Fact]
    public void Should_Reject_RecordGrade_When_Course_Not_Found()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");

        // Act
        var result = record.RecordGradeAndComputeGpa("SEC-INVALID", 4.0m);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("AcademicRecord.CourseNotFound");
    }

    [Fact]
    public void Should_Compute_Gpa_Correctly_With_Single_Course()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 3);

        // Act
        record.RecordGradeAndComputeGpa("SEC-1", 3.5m);

        // Assert
        record.CumulativeGpa.Should().Be(3.5m);
        record.TotalEarnedUnits.Should().Be(3);
        record.AcademicStanding.Should().Be("GOOD");
    }

    [Fact]
    public void Should_Compute_Gpa_Correctly_With_Multiple_Courses()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 3); // 3 credits * 4.0 = 12
        record.AddCourseRecord("SEC-2", "MATH101", 4); // 4 credits * 2.0 = 8

        // Act
        record.RecordGradeAndComputeGpa("SEC-1", 4.0m);
        record.RecordGradeAndComputeGpa("SEC-2", 2.0m);

        // Assert
        // Total points = 20, Total Credits = 7 -> 20/7 = 2.857... -> rounded to 2.86
        record.CumulativeGpa.Should().Be(2.86m);
        record.TotalEarnedUnits.Should().Be(7);
        record.AcademicStanding.Should().Be("GOOD");
    }

    [Fact]
    public void Should_Drop_AcademicStanding_To_Probation_When_Gpa_Below_Two()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 3);

        // Act
        record.RecordGradeAndComputeGpa("SEC-1", 1.5m); // GPA = 1.5

        // Assert
        record.AcademicStanding.Should().Be("PROBATION");
    }

    [Fact]
    public void Should_Drop_AcademicStanding_To_Dismissed_When_Gpa_Below_One()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 3);

        // Act
        record.RecordGradeAndComputeGpa("SEC-1", 0.5m); // GPA = 0.5

        // Assert
        record.AcademicStanding.Should().Be("DISMISSED");
    }

    [Fact]
    public void Should_Reject_Graduation_Clearance_When_Credits_Insufficient()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 110); 
        record.RecordGradeAndComputeGpa("SEC-1", 3.0m);

        // Act
        var result = record.RequestGraduationClearance(120);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Graduation.InsufficientCredits");
    }

    [Fact]
    public void Should_Reject_Graduation_Clearance_When_Not_Good_Standing()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 130); 
        record.RecordGradeAndComputeGpa("SEC-1", 1.5m); // Puts student on PROBATION

        // Act
        var result = record.RequestGraduationClearance(120);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Graduation.NotGoodStanding");
    }

    [Fact]
    public void Should_Successfully_Request_And_Approve_Graduation()
    {
        // Arrange
        var record = new StudentAcademicRecord(Guid.NewGuid(), "STU-1001");
        record.AddCourseRecord("SEC-1", "CS101", 130); 
        record.RecordGradeAndComputeGpa("SEC-1", 3.5m);

        // Act
        var reqResult = record.RequestGraduationClearance(120);
        var appResult = record.ApproveGraduation();

        // Assert
        reqResult.IsSuccess.Should().BeTrue();
        appResult.IsSuccess.Should().BeTrue();
        record.GraduationStatus.Should().Be("Approved");
    }
}
