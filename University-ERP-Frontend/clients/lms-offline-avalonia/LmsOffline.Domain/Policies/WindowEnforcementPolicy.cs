namespace LmsOffline.Domain.Policies;

using System;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Domain policy responsible for enforcing the strict rules around starting an offline assessment.
/// </summary>
public sealed class WindowEnforcementPolicy
{
    /// <summary>
    /// Evaluates whether the offline assessment can be legally started.
    /// </summary>
    public bool CanStartAssessment(AvailabilityWindow window, AttemptToken token, DateTime currentTimeUtc)
    {
        // Rule 1: The current device time must be strictly within the instructor's allowed window.
        if (!window.IsWithinWindow(currentTimeUtc))
        {
            return false;
        }

        // Rule 2: The token must have been issued before the window ends to be valid.
        if (token.IssuedAtUtc > window.EndTimeUtc)
        {
            return false;
        }

        return true;
    }
}
