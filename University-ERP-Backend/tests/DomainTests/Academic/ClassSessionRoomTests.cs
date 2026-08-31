namespace DomainTests.Academic;

using Xunit;
using Moq;
using AcademicScheduling.Domain.Aggregates;
using AcademicScheduling.Application.Abstractions;
using AcademicScheduling.Application.Features.AllocateRoom;
using System.Threading;
using System.Threading.Tasks;

public class ClassSessionRoomTests
{
    [Fact]
    public async Task AllocateRoom_PreventsDoubleBooking_WhenRoomIsAlreadyOccupied()
    {
        // Arrange
        var mockRepo = new Mock<IAcademicSchedulingRepository>();
        mockRepo.Setup(r => r.IsRoomOccupiedAsync("Room-A101", "2026-09-01", "09:00", "10:30", It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

        var handler = new AllocateRoomCommandHandler(mockRepo.Object);
        var command = new AllocateRoomCommand("SEC-101", "Room-A101", "2026-09-01", "09:00", "10:30");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsFailure);
        Assert.Equal("Academic.RoomDoubleBooked", result.Error.Code);
    }
}
