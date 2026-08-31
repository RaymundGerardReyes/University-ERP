namespace AcademicScheduling.Tests.Unit.Domain.Aggregates;

using AcademicScheduling.Domain.Aggregates;
using FluentAssertions;
using Xunit;
using System;

// Source under test: AcademicScheduling.Domain/Aggregates/RoomAllocation.cs
public class RoomAllocationTests
{
    [Fact]
    public void Should_Create_Valid_RoomAllocation()
    {
        // Arrange
        var id = Guid.NewGuid();
        var roomNumber = "LAB-101";
        var courseCode = "CS202";
        var dayOfWeek = "Tuesday";
        var startTime = new TimeSpan(13, 0, 0);
        var endTime = new TimeSpan(15, 0, 0);
        var capacity = 30;

        // Act
        var allocation = new RoomAllocation
        {
            Id = id,
            RoomNumber = roomNumber,
            CourseCode = courseCode,
            DayOfWeek = dayOfWeek,
            StartTime = startTime,
            EndTime = endTime,
            ExpectedCapacity = capacity
        };

        // Assert
        allocation.Id.Should().Be(id);
        allocation.RoomNumber.Should().Be(roomNumber);
        allocation.CourseCode.Should().Be(courseCode);
        allocation.DayOfWeek.Should().Be(dayOfWeek);
        allocation.StartTime.Should().Be(startTime);
        allocation.EndTime.Should().Be(endTime);
        allocation.ExpectedCapacity.Should().Be(capacity);
    }

    [Fact]
    public void Should_Initialize_With_Empty_Defaults()
    {
        // Act
        var allocation = new RoomAllocation();

        // Assert
        allocation.RoomNumber.Should().Be(string.Empty);
        allocation.CourseCode.Should().Be(string.Empty);
        allocation.DayOfWeek.Should().Be(string.Empty);
    }
}
