namespace LmsOffline.Domain.Aggregates;

using System;
using LmsOffline.Domain.ValueObjects;
using LmsOffline.Domain.Exceptions;
using LmsOffline.Domain.Policies;

#region Aggregates
/// <summary>
/// Aggregate root for offline assessments.
/// </summary>
public sealed class OfflineAssessment
{
    public Guid Id { get; }
    public string Title { get; }
    public AvailabilityWindow Window { get; }
    public SyncStatus SyncState { get; private set; }
    public bool IsStarted { get; private set; }

    public OfflineAssessment(Guid id, string title, AvailabilityWindow window)
    {
        Id = id;
        Title = title;
        Window = window;
        SyncState = SyncStatus.PendingSync; // Default synchronization state
        IsStarted = false;
    }

    /// <summary>
    /// Starts the assessment by enforcing the window policy and single-attempt rules.
    /// </summary>
    public void Start(AttemptToken token, DateTime currentTimeUtc, WindowEnforcementPolicy policy)
    {
        if (IsStarted)
        {
            throw new InvalidOperationException("This assessment attempt has already been started.");
        }

        // Delegate the complex rule validation to the domain policy
        if (!policy.CanStartAssessment(Window, token, currentTimeUtc))
        {
            throw new AssessmentWindowClosedException("Cannot start assessment: The time window is closed or the attempt token is invalid.");
        }

        IsStarted = true;
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
