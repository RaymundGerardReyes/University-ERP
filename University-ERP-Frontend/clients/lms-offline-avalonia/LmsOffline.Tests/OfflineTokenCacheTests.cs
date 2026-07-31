namespace LmsOffline.Tests;

using System;
using Xunit;
using LmsOffline.Infrastructure.Auth;
using LmsOffline.Domain.ValueObjects;

public class OfflineTokenCacheTests
{
    [Fact]
    public void IsSessionValid_Exceeds24Hours_ReturnsFalseAndClearsCache()
    {
        // Arrange
        var cache = new OfflineTokenCache();
        var token = new AttemptToken("secure_jwt_string", DateTime.UtcNow);
        
        // Cache the token as if we just synced online
        cache.CacheToken(token);

        // Act: Simulate the device being offline for 25 hours
        var timeAttemptedOffline = DateTime.UtcNow.AddHours(25);
        bool isValid = cache.IsSessionValid(timeAttemptedOffline);

        // Assert
        Assert.False(isValid);
        Assert.Null(cache.GetToken()); // Cache must wipe itself for security
    }

    [Fact]
    public void IsSessionValid_Under24Hours_ReturnsTrue()
    {
        // Arrange
        var cache = new OfflineTokenCache();
        var token = new AttemptToken("secure_jwt_string", DateTime.UtcNow);
        cache.CacheToken(token);

        // Act: Simulate device offline for only 5 hours
        var timeAttemptedOffline = DateTime.UtcNow.AddHours(5);
        bool isValid = cache.IsSessionValid(timeAttemptedOffline);

        // Assert
        Assert.True(isValid);
        Assert.NotNull(cache.GetToken());
    }
}
