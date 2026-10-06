namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using Moq;
using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Application.Features.AllocateRoom;
using System;
using System.Threading;
using System.Threading.Tasks;

public class ClassSessionRoomTests
{
    [Fact]
    public async Task AllocateRoom_PreventsDoubleBooking_WhenConflictExists()
    {
        // Arrange
        var mockRepo = new Mock<IAcademicSchedulingRepository>();
        mockRepo.Setup(r => r.HasRoomConflictAsync(
            "Room-A101", "Monday", TimeSpan.FromHours(9), TimeSpan.FromHours(10.5), It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var handler = new AllocateRoomCommandHandler(mockRepo.Object);
        var command = new AllocateRoomCommand(
            "Room-A101", "CS-101", "Monday", TimeSpan.FromHours(9), TimeSpan.FromHours(10.5), 40);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Scheduling.Conflict");
    }

    [Fact]
    public async Task AllocateRoom_Succeeds_WhenNoConflictExists()
    {
        // Arrange
        var mockRepo = new Mock<IAcademicSchedulingRepository>();
        mockRepo.Setup(r => r.HasRoomConflictAsync(
            "Room-B202", "Tuesday", TimeSpan.FromHours(13), TimeSpan.FromHours(15), It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var handler = new AllocateRoomCommandHandler(mockRepo.Object);
        var command = new AllocateRoomCommand(
            "Room-B202", "MATH-201", "Tuesday", TimeSpan.FromHours(13), TimeSpan.FromHours(15), 35);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeEmpty();
    }
}
