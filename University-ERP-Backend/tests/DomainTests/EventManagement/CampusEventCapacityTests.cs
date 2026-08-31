namespace DomainTests.EventManagement;

using Xunit;
using EventManagement.Domain.Aggregates;
using System;
using System.Threading.Tasks;

public class CampusEventCapacityTests
{
    [Fact]
    public async Task PlanEvent_ReturnsFailure_WhenMaxCapacityIsZeroOrNegative()
    {
        // Act
        var result = CampusEvent.Plan("Annual Tech Symposium", "ORG-01", "Auditorium A", DateTime.UtcNow.AddDays(10), 0);

        // Assert
        Assert.True(result.IsFailure);
        Assert.Equal("Event.InvalidCapacity", result.Error.Code);
    }
}
