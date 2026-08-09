namespace LmsOffline.Domain.ValueObjects;

using System;

/// <summary>
/// Represents a token from the backend authorizing an offline attempt.
/// </summary>
public sealed class AttemptToken
{
    public string TokenValue { get; }
    public DateTime IssuedAtUtc { get; }
    public string StudentId { get; }

    public AttemptToken(string tokenValue, DateTime issuedAtUtc, string studentId = "88888888-8888-8888-8888-888888888888")
    {
        if (string.IsNullOrWhiteSpace(tokenValue))
            throw new ArgumentException("Token value cannot be empty.");

        TokenValue = tokenValue;
        IssuedAtUtc = issuedAtUtc;
        StudentId = string.IsNullOrWhiteSpace(studentId) ? "88888888-8888-8888-8888-888888888888" : studentId;
    }
}
