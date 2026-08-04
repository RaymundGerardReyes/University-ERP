namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Represents an xAPI-compliant learning analytics event tracked locally (Local LRS).
/// </summary>
public sealed class LearningEvent : AggregateRoot<Guid>
{
    public Guid StudentId { get; private set; }
    public string ActionVerb { get; private set; } = string.Empty; // e.g., "watched", "completed", "paused"
    public string TargetObject { get; private set; } = string.Empty; // e.g., "video:cs101_lec1", "quiz:math202"
    public string ContextDataJson { get; private set; } = string.Empty; // e.g., "{ timestamp: '12:04', speed: 1.5 }"
    public DateTime OccurredOnUtc { get; private set; }
    public SyncStatus SyncState { get; private set; }

    private LearningEvent() { }

    public static LearningEvent Create(Guid studentId, string verb, string target, string contextData)
    {
        return new LearningEvent
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            ActionVerb = verb,
            TargetObject = target,
            ContextDataJson = contextData,
            OccurredOnUtc = DateTime.UtcNow,
            SyncState = SyncStatus.PendingSync
        };
    }

    public void MarkAsSynced() => SyncState = SyncStatus.Synced;
}