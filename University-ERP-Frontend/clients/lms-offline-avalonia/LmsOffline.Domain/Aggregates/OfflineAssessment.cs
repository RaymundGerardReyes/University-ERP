namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;
using LmsOffline.Domain.Policies;
using LmsOffline.Domain.Exceptions;

#region Aggregates
/// <summary>
/// The Aggregate Root representing an offline quiz or exam downloaded to the local device.
/// </summary>
public sealed class OfflineAssessment
{
    public Guid Id { get; private set; }
    public Guid ModuleId { get; private set; }
    public string Title { get; private set; }
    public AvailabilityWindow Window { get; private set; }
    public int MaxAttempts { get; private set; }
    
    // Added the SyncState tracking mentioned in your summary
    public SyncStatus SyncState { get; private set; }
    
    // Track the student's progress locally
    public bool IsStarted { get; private set; }
    public DateTime? StartedAtUtc { get; private set; }

    public OfflineAssessment(Guid id, Guid moduleId, string title, AvailabilityWindow window, int maxAttempts)
    {
        Id = id;
        ModuleId = moduleId;
        Title = title;
        Window = window ?? throw new ArgumentNullException(nameof(window));
        MaxAttempts = maxAttempts;
        IsStarted = false;
        
        // Configured default SyncState as specified in your summary
        SyncState = SyncStatus.PendingSync; 
    }

    /// <summary>
    /// Attempts to start the offline assessment, enforcing strict timing policies.
    /// </summary>
    public void Start(AttemptToken token, DateTime currentTimeUtc, WindowEnforcementPolicy policy)
    {
        if (IsStarted)
        {
            throw new InvalidOperationException("This assessment has already been started.");
        }

        // Delegate the complex rule validation to the Domain Policy
        if (!policy.CanStartAssessment(Window, token, currentTimeUtc))
        {
            throw new AssessmentWindowClosedException(
                $"Cannot start assessment '{Title}'. The current time {currentTimeUtc:O} is outside the allowed window.");
        }

        IsStarted = true;
        StartedAtUtc = currentTimeUtc;
    }

    /// <summary>
    /// Updates the synchronization status of the assessment.
    /// </summary>
    public void UpdateSyncStatus(SyncStatus newStatus)
    {
        SyncState = newStatus;
    }
}
#endregion
