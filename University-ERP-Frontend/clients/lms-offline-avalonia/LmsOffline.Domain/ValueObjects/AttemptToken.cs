namespace LmsOffline.Domain.ValueObjects;

using System;

/// <summary>
/// Represents a token from the backend authorizing an offline attempt.
/// </summary>
public sealed class AttemptToken
{
    public string TokenValue { get; }
    public DateTime IssuedAtUtc { get; }

    public AttemptToken(string tokenValue, DateTime issuedAtUtc)
    {
        if (string.IsNullOrWhiteSpace(tokenValue))
            throw new ArgumentException("Token value cannot be empty.");

        TokenValue = tokenValue;
        IssuedAtUtc = issuedAtUtc;
    }
}
