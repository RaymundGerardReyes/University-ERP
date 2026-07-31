namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Represents an offline assignment that a student drafts locally.
/// </summary>
public sealed class OfflineAssignment
{
    public Guid Id { get; private set; }
    public Guid ModuleId { get; private set; }
    public string Title { get; private set; }
    public string DraftContent { get; private set; } = string.Empty;
    public AvailabilityWindow Window { get; private set; }
    public SyncStatus SyncState { get; private set; }

    public OfflineAssignment(Guid id, Guid moduleId, string title, AvailabilityWindow window)
    {
        Id = id;
        ModuleId = moduleId;
        Title = title;
        Window = window ?? throw new ArgumentNullException(nameof(window));
        SyncState = SyncStatus.PendingSync;
    }

    private OfflineAssignment() { } // Required for EF Core

    public void UpdateDraft(string content)
    {
        DraftContent = content;
    }

    public void MarkForSync()
    {
        SyncState = SyncStatus.PendingSync;
    }

    public void UpdateSyncStatus(SyncStatus newStatus)
    {
        SyncState = newStatus;
    }
}
