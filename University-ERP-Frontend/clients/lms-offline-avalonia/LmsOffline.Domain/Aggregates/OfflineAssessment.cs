namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;
using LmsOffline.Domain.Policies;

public sealed class OfflineAssessment
{
    public Guid Id { get; private set; }
    public Guid ModuleId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public AvailabilityWindow Window { get; private set; } = null!;
    public int MaxAttempts { get; private set; }
    
    public bool IsStarted { get; private set; }
    public DateTime? StartedAtUtc { get; private set; }
    public SyncStatus SyncState { get; private set; }

    public OfflineAssessment(Guid id, Guid moduleId, string title, AvailabilityWindow window, int maxAttempts)
    {
        Id = id;
        ModuleId = moduleId;
        Title = title;
        Window = window ?? throw new ArgumentNullException(nameof(window));
        MaxAttempts = maxAttempts;
        IsStarted = false;
        SyncState = SyncStatus.PendingSync;
    }

    private OfflineAssessment() { }

    public void Start(AttemptToken token, DateTime currentTimeUtc, WindowEnforcementPolicy policy)
    {
        if (IsStarted) throw new InvalidOperationException("Assessment already started.");
        if (!policy.CanStartAssessment(Window, token, currentTimeUtc))
            throw new InvalidOperationException("Cannot start outside availability window.");
            
        IsStarted = true;
        StartedAtUtc = currentTimeUtc;
    }

    public void UpdateSyncStatus(SyncStatus status) => SyncState = status;
}