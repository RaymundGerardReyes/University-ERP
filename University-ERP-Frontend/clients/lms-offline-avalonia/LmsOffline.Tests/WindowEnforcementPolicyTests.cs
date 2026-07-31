namespace LmsOffline.Tests;

using System;
using Xunit;
using LmsOffline.Domain.Policies;
using LmsOffline.Domain.ValueObjects;

public class WindowEnforcementPolicyTests
{
    private readonly WindowEnforcementPolicy _policy = new();

    [Fact]
    public void CanStartAssessment_InsideWindow_WithValidToken_ReturnsTrue()
    {
        // Arrange: An exam currently in progress
        var startTime = DateTime.UtcNow.AddHours(-1);
        var endTime = DateTime.UtcNow.AddHours(1);
        var window = AvailabilityWindow.Create(startTime, endTime);
        
        var token = new AttemptToken("valid_token", startTime.AddMinutes(-10));
        var currentTime = DateTime.UtcNow;

        // Act
        bool result = _policy.CanStartAssessment(window, token, currentTime);

        // Assert: The student should be allowed to start
        Assert.True(result);
    }

    [Fact]
    public void CanStartAssessment_BeforeWindowOpens_ReturnsFalse()
    {
        // Arrange: An exam that hasn't started yet
        var startTime = DateTime.UtcNow.AddHours(1);
        var endTime = DateTime.UtcNow.AddHours(2);
        var window = AvailabilityWindow.Create(startTime, endTime);
        
        var token = new AttemptToken("valid_token", DateTime.UtcNow.AddMinutes(-10));
        var currentTime = DateTime.UtcNow; // We are trying to start early

        // Act
        bool result = _policy.CanStartAssessment(window, token, currentTime);

        // Assert: The cheating attempt is blocked
        Assert.False(result);
    }
}
