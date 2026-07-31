namespace LmsOffline.Domain.ValueObjects;

/// <summary>
/// Represents the synchronization state of an offline action (e.g., assignment submission)
/// with the central University ERP backend.
/// </summary>
public enum SyncStatus
{
    /// <summary>
    /// The submission is saved locally and waiting for internet connectivity.
    /// </summary>
    PendingSync,
    
    /// <summary>
    /// The submission has been successfully pushed to the backend API.
    /// </summary>
    Synced,
    
    /// <summary>
    /// A server-side conflict occurred during synchronization (e.g., submission arrived after the deadline).
    /// </summary>
    Conflict
}
