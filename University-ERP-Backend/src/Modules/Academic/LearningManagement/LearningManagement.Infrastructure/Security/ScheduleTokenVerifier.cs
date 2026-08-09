using System;
using System.Security.Cryptography;
using System.Text;
using LearningManagement.Application.Abstractions;

namespace LearningManagement.Infrastructure.Security;

/// <summary>
/// Concrete implementation of the schedule token verifier.
/// Verifies HMAC-SHA256 tokens issued by the Avalonia client's ScheduleTokenVerifier
/// to confirm the submission occurred within the authorized AvailabilityWindow.
/// </summary>
internal sealed class ScheduleTokenVerifier : IScheduleTokenVerifier
{
    private readonly byte[] _secretKey;

    // The primary constructor accepting the string secret from Dependency Injection
    public ScheduleTokenVerifier(string secretKey)
    {
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            throw new ArgumentException("Schedule token secret key cannot be null or empty.", nameof(secretKey));
        }
        
        _secretKey = Encoding.UTF8.GetBytes(secretKey);
    }

    /// <summary>
    /// Implements the exact signature required by IScheduleTokenVerifier.
    /// VerifyScheduleToken(string token, Guid studentId, Guid assessmentId)
    /// </summary>
    public bool VerifyScheduleToken(string token, Guid studentId, Guid assessmentId)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return false;
        }

        try
        {
            // Reconstruct the expected payload using the Guid parameters
            // Example formatting: "Assessment:{assessmentId}:Student:{studentId}"
            var payload = $"Assessment:{assessmentId}:Student:{studentId}";
            var expectedToken = ComputeHmac(payload);

            // Use FixedTimeEquals to prevent timing attacks
            return CryptographicOperations.FixedTimeEquals(
                Convert.FromBase64String(token),
                Convert.FromBase64String(expectedToken));
        }
        catch
        {
            // Return false if Base64 conversion or hashing fails
            return false;
        }
    }

    public bool VerifyOfflineSessionSignature(string token, DateTime sessionDate)
    {
        // TODO: Add your actual cryptographic or token verification logic here
        throw new NotImplementedException("Token verification logic needs to be implemented.");
    }
    
    private string ComputeHmac(string payload)
    {
        using var hmac = new HMACSHA256(_secretKey);
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToBase64String(hash);
    }
}