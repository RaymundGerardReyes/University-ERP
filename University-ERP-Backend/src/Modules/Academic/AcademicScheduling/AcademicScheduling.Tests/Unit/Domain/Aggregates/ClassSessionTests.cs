namespace AcademicScheduling.Tests.Unit.Domain.Aggregates;

using AcademicScheduling.Domain.Aggregates;
using SharedKernel.Domain.Primitives;
using FluentAssertions;
using Xunit;
using System;

// Source under test: AcademicScheduling.Domain/Aggregates/ClassSession.cs
public class ClassSessionTests
{
    [Fact]
    public void Should_Create_Valid_ClassSession_With_Correct_Duration()
    {
        // Arrange
        var courseCode = "CS101";
        var roomNumber = "ROOM-1A";
        var facultyId = Guid.NewGuid();
        var dayOfWeek = "Monday";
        var start = new TimeSpan(9, 0, 0);
        var end = new TimeSpan(10, 30, 0);

        // Act
        var result = ClassSession.Schedule(courseCode, roomNumber, facultyId, dayOfWeek, start, end);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.CourseCode.Should().Be(courseCode);
        result.Value.RoomNumber.Should().Be(roomNumber);
        result.Value.FacultyId.Should().Be(facultyId);
        result.Value.DayOfWeek.Should().Be(dayOfWeek);
        result.Value.StartTime.Should().Be(start);
        result.Value.EndTime.Should().Be(end);
    }

    [Theory]
    [InlineData(10, 30, 9, 0)]  // End before start
    [InlineData(9, 0, 9, 0)]    // End equals start
    public void Should_Reject_ClassSession_Creation_When_EndTime_Is_Before_Or_Equal_To_StartTime(int startHr, int startMin, int endHr, int endMin)
    {
        // Arrange
        var courseCode = "CS101";
        var roomNumber = "ROOM-1A";
        var facultyId = Guid.NewGuid();
        var dayOfWeek = "Monday";
        var start = new TimeSpan(startHr, startMin, 0);
        var end = new TimeSpan(endHr, endMin, 0);

        // Act
        var result = ClassSession.Schedule(courseCode, roomNumber, facultyId, dayOfWeek, start, end);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Scheduling.InvalidTime");
    }

    [Fact]
    public void Should_Create_Unique_Id_For_Each_Session()
    {
        // Arrange
        var start = new TimeSpan(9, 0, 0);
        var end = new TimeSpan(10, 30, 0);

        // Act
        var session1 = ClassSession.Schedule("CS101", "R1", Guid.NewGuid(), "Mon", start, end).Value;
        var session2 = ClassSession.Schedule("CS101", "R1", Guid.NewGuid(), "Mon", start, end).Value;

        // Assert
        session1.Id.Should().NotBe(session2.Id);
    }
}
