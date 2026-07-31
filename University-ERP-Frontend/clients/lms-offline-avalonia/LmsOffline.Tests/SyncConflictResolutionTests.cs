namespace LmsOffline.Tests;

using System;
using Xunit;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Domain.ValueObjects;

public class SyncConflictResolutionTests
{
    [Fact]
    public void UpdateSyncStatus_ToConflict_Succeeds_WhenStateIsPending()
    {
        // Arrange: Create a valid assessment window and entity
        var window = AvailabilityWindow.Create(DateTime.UtcNow.AddHours(-1), DateTime.UtcNow.AddHours(1));
        var assessment = new OfflineAssessment(Guid.NewGuid(), Guid.NewGuid(), "Biology 101", window, 1);
        
        // Act: The UI marks it pending, but the Outbox Processor encounters a network conflict
        assessment.UpdateSyncStatus(SyncStatus.PendingSync);
        assessment.UpdateSyncStatus(SyncStatus.Conflict);

        // Assert: The domain successfully transitioned to the Conflict state
        Assert.Equal(SyncStatus.Conflict, assessment.SyncState);
    }

    [Fact]
    public void UpdateSyncStatus_ToSynced_Succeeds_WhenNetworkIsRestored()
    {
        // Arrange
        var window = AvailabilityWindow.Create(DateTime.UtcNow.AddHours(-1), DateTime.UtcNow.AddHours(1));
        var assessment = new OfflineAssessment(Guid.NewGuid(), Guid.NewGuid(), "History 201", window, 1);
        
        assessment.UpdateSyncStatus(SyncStatus.PendingSync);

        // Act: The Outbox Processor successfully pushes to the API
        assessment.UpdateSyncStatus(SyncStatus.Synced);

        // Assert
        Assert.Equal(SyncStatus.Synced, assessment.SyncState);
    }
}
