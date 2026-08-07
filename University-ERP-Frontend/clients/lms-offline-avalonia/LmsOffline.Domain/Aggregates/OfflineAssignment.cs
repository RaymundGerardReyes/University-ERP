namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;

public sealed class OfflineAssignment
{
    public Guid Id { get; private set; }
    public Guid ModuleId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string DraftContent { get; private set; } = string.Empty;
    public AvailabilityWindow Window { get; private set; } = null!;
    public SyncStatus SyncState { get; private set; }

    public OfflineAssignment(Guid id, Guid moduleId, string title, AvailabilityWindow window)
    {
        Id = id;
        ModuleId = moduleId;
        Title = title;
        Window = window ?? throw new ArgumentNullException(nameof(window));
        SyncState = SyncStatus.PendingSync;
    }

    private OfflineAssignment() { }

    public void UpdateDraft(string content) => DraftContent = content;

    public void UpdateSyncStatus(SyncStatus status) => SyncState = status;
}