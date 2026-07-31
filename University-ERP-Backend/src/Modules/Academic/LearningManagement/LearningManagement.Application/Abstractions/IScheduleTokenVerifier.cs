namespace LearningManagement.Application.Abstractions;

/// <summary>
/// Verifies the cryptographic schedule token embedded in offline submissions
/// from the Avalonia LmsOffline client to ensure the submission occurred within
/// the authorized AvailabilityWindow.
/// </summary>
public interface IScheduleTokenVerifier
{
    /// <summary>
    /// Returns true if the token is authentic and the submission timestamp
    /// falls within the encoded availability window.
    /// </summary>
    bool Verify(string scheduleToken, string resourceId, DateTimeOffset submittedAtUtc);
}
