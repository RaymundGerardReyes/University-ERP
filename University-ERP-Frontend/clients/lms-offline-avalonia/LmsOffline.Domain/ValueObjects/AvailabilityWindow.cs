namespace LmsOffline.Domain.ValueObjects;

using System;

/// <summary>
/// Represents an immutable, tamper-evident time window during which an offline assessment can be taken.
/// </summary>
public sealed class AvailabilityWindow : IEquatable<AvailabilityWindow>
{
    public DateTime StartTimeUtc { get; }
    public DateTime EndTimeUtc { get; }

    private AvailabilityWindow(DateTime startTimeUtc, DateTime endTimeUtc)
    {
        StartTimeUtc = startTimeUtc;
        EndTimeUtc = endTimeUtc;
    }

    public static AvailabilityWindow Create(DateTime startTimeUtc, DateTime endTimeUtc)
    {
        if (endTimeUtc <= startTimeUtc)
        {
            throw new ArgumentException("End time must be strictly after the start time.");
        }

        return new AvailabilityWindow(startTimeUtc, endTimeUtc);
    }

    /// <summary>
    /// Evaluates if a given time falls within the allowed assessment window.
    /// </summary>
    public bool IsWithinWindow(DateTime currentTimeUtc)
    {
        return currentTimeUtc >= StartTimeUtc && currentTimeUtc <= EndTimeUtc;
    }

    public bool Equals(AvailabilityWindow? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return StartTimeUtc.Equals(other.StartTimeUtc) && EndTimeUtc.Equals(other.EndTimeUtc);
    }

    public override bool Equals(object? obj) => Equals(obj as AvailabilityWindow);

    public override int GetHashCode() => HashCode.Combine(StartTimeUtc, EndTimeUtc);
}
