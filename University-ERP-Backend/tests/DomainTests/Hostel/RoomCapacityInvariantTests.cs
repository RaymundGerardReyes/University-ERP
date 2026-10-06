namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using System;
using Hostel.Domain.Aggregates;

public class RoomCapacityInvariantTests
{
    [Fact]
    public void AllocateRoom_WithZeroCapacity_FailsInvariant()
    {
        var result = RoomAllocation.Allocate(
            Guid.NewGuid(), "Faraday Hall", "101", "Single", 500m, capacity: 0);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Hostel.InvalidCapacity");
    }

    [Fact]
    public void AllocateRoom_WithZeroOrNegativeFee_FailsInvariant()
    {
        var resultZero = RoomAllocation.Allocate(
            Guid.NewGuid(), "Faraday Hall", "101", "Single", 0m, capacity: 1);
        resultZero.IsFailure.Should().BeTrue();
        resultZero.Error.Code.Should().Be("Hostel.InvalidMonthlyFee");

        var resultNegative = RoomAllocation.Allocate(
            Guid.NewGuid(), "Faraday Hall", "101", "Single", -200m, capacity: 1);
        resultNegative.IsFailure.Should().BeTrue();
        resultNegative.Error.Code.Should().Be("Hostel.InvalidMonthlyFee");
    }

    [Fact]
    public void AllocateRoom_WhenOccupancyReachesCapacity_FailsInvariant()
    {
        // Room capacity 2, currentOccupancy 2 -> should reject
        var result = RoomAllocation.Allocate(
            Guid.NewGuid(), "Curie Hall", "204", "Double", 600m, capacity: 2, currentOccupancy: 2);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Hostel.RoomCapacityExceeded");
    }

    [Fact]
    public void AllocateRoom_WhenSpaceAvailable_SucceedsAndIncrementsOccupancy()
    {
        var result = RoomAllocation.Allocate(
            Guid.NewGuid(), "Curie Hall", "204", "Double", 600m, capacity: 2, currentOccupancy: 1);

        result.IsSuccess.Should().BeTrue();
        var allocation = result.Value;
        allocation.Status.Should().Be("Allocated");
        allocation.CurrentOccupancy.Should().Be(2);
    }

    [Fact]
    public void CheckInAndVacate_TransitionsLifecycleAccurately()
    {
        var allocation = RoomAllocation.Allocate(
            Guid.NewGuid(), "Bohr Complex", "302", "Single", 700m, capacity: 1, currentOccupancy: 0).Value;

        var checkInResult = allocation.CheckIn();
        checkInResult.IsSuccess.Should().BeTrue();
        allocation.Status.Should().Be("CheckedIn");

        var vacateResult = allocation.Vacate();
        vacateResult.IsSuccess.Should().BeTrue();
        allocation.Status.Should().Be("Vacated");
        allocation.CurrentOccupancy.Should().Be(0);
    }
}
