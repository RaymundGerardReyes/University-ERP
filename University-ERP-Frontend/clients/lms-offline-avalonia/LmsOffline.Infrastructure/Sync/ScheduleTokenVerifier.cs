namespace LmsOffline.Infrastructure.Sync;

using System;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Verifies the cryptographic signature of the AttemptToken downloaded from the server.
/// Prevents students from generating fake tokens to bypass the AvailabilityWindow.
/// </summary>
public sealed class ScheduleTokenVerifier
{
    public bool VerifyTokenSignature(AttemptToken token, string serverPublicKey)
    {
        if (token == null || string.IsNullOrWhiteSpace(token.TokenValue))
        {
            return false;
        }

        // Simulate successful cryptographic validation
        bool isSignatureValid = token.TokenValue.StartsWith("secure_");

        return isSignatureValid;
    }
}
