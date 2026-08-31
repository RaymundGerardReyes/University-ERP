namespace AcademicScheduling.Tests.Unit.Domain.Aggregates;

using AcademicScheduling.Domain.Aggregates;
using FluentAssertions;
using Xunit;
using System;

// Source under test: AcademicScheduling.Domain/Aggregates/CourseSection.cs
public class CourseSectionTests
{
    [Fact]
    public void Should_Create_Valid_CourseSection_With_Properties_Assigned()
    {
        // Arrange
        var id = "CS101-A";
        var courseCode = "CS101";
        var courseName = "Intro to Computer Science";
        var sectionName = "A";
        var facultyId = Guid.NewGuid();
        var schedule = "MWF 10:00-11:00";
        var room = "ROOM-1";
        var enrolledCount = 25;

        // Act
        var section = new CourseSection
        {
            Id = id,
            CourseCode = courseCode,
            CourseName = courseName,
            SectionName = sectionName,
            FacultyId = facultyId,
            Schedule = schedule,
            Room = room,
            EnrolledCount = enrolledCount
        };

        // Assert
        section.Id.Should().Be(id);
        section.CourseCode.Should().Be(courseCode);
        section.CourseName.Should().Be(courseName);
        section.SectionName.Should().Be(sectionName);
        section.FacultyId.Should().Be(facultyId);
        section.Schedule.Should().Be(schedule);
        section.Room.Should().Be(room);
        section.EnrolledCount.Should().Be(enrolledCount);
    }

    [Fact]
    public void Should_Have_Empty_Strings_As_Defaults()
    {
        // Act
        var section = new CourseSection();

        // Assert
        section.Id.Should().Be(string.Empty);
        section.CourseCode.Should().Be(string.Empty);
        section.CourseName.Should().Be(string.Empty);
        section.SectionName.Should().Be(string.Empty);
        section.Schedule.Should().Be(string.Empty);
        section.Room.Should().Be(string.Empty);
    }

    [Fact]
    public void Should_Allow_Updating_Enrolled_Count()
    {
        // Arrange
        var section = new CourseSection { EnrolledCount = 10 };

        // Act
        section.EnrolledCount += 5;

        // Assert
        section.EnrolledCount.Should().Be(15);
    }
}
