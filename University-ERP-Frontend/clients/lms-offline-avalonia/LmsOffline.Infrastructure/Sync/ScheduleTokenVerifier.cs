namespace LmsOffline.Infrastructure.Sync;

using System;
using LmsOffline.Domain.ValueObjects;

public sealed class ScheduleTokenVerifier
{
    public bool VerifyTokenSignature(AttemptToken token, string serverPublicKey)
    {
        if (token == null || string.IsNullOrWhiteSpace(token.TokenValue))
        {
            return false;
        }

        // Simulates cryptographic verification
        return token.TokenValue.StartsWith("secure_");
    }
}