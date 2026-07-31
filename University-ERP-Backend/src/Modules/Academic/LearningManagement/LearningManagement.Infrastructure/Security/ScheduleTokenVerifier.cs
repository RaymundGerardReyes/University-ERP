using LearningManagement.Application.Abstractions;
using System.Security.Cryptography;
using System.Text;

namespace LearningManagement.Infrastructure.Security;

/// <summary>
/// Concrete implementation of the schedule token verifier.
/// Verifies HMAC-SHA256 tokens issued by the Avalonia client's ScheduleTokenVerifier
/// to confirm the submission occurred within the authorized AvailabilityWindow.
/// Must match the secret key configured in the Avalonia client.
/// </summary>
internal sealed class ScheduleTokenVerifier : IScheduleTokenVerifier
{
    private readonly byte[] _secretKey;
    private const int MaxOfflineWindowHours = 24;

    public ScheduleTokenVerifier(string secretKey)
        => _secretKey = Encoding.UTF8.GetBytes(secretKey);

    public bool Verify(string scheduleToken, string resourceId, DateTimeOffset submittedAtUtc)
    {
        // 1. Enforce maximum offline window from submission timestamp to now
        var hoursSinceSubmission = (DateTimeOffset.UtcNow - submittedAtUtc).TotalHours;
        if (hoursSinceSubmission > MaxOfflineWindowHours)
            return false;

        // 2. Verify HMAC-SHA256 signature: token must equal HMAC(secretKey, resourceId + submittedAtUtc.Ticks)
        try
        {
            var payload = $"{resourceId}:{submittedAtUtc.UtcTicks}";
            var expectedToken = ComputeHmac(payload);
            return CryptographicOperations.FixedTimeEquals(
                Convert.FromBase64String(scheduleToken),
                Convert.FromBase64String(expectedToken));
        }
        catch
        {
            return false;
        }
    }

    private string ComputeHmac(string payload)
    {
        using var hmac = new HMACSHA256(_secretKey);
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToBase64String(hash);
    }
}
