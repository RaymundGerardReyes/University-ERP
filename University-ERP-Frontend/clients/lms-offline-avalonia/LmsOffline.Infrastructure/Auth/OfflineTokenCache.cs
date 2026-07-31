namespace LmsOffline.Infrastructure.Auth;

using System;
using LmsOffline.Domain.ValueObjects;

/// <summary>
/// Enforces the Non-Functional Requirement: Offline Session Bounding.
/// Securely caches authorization tokens and dictates exactly how long 
/// the application can operate without reaching the central Identity server.
/// </summary>
public sealed class OfflineTokenCache
{
    private AttemptToken? _cachedToken;
    private DateTime? _lastOnlineSyncUtc;
    
    // Security NFR: Maximum allowed time offline before forced re-auth
    private readonly TimeSpan _maxOfflineAllowance = TimeSpan.FromHours(24);

    public void CacheToken(AttemptToken token)
    {
        _cachedToken = token;
        _lastOnlineSyncUtc = DateTime.UtcNow;
    }

    /// <summary>
    /// Checks if the cached session is still valid based on strict time bounding.
    /// </summary>
    public bool IsSessionValid(DateTime currentDeviceTimeUtc)
    {
        if (_cachedToken is null || _lastOnlineSyncUtc is null)
        {
            return false;
        }

        var timeSpentOffline = currentDeviceTimeUtc - _lastOnlineSyncUtc.Value;

        // If the student has been offline longer than 24 hours, invalidate the session.
        if (timeSpentOffline > _maxOfflineAllowance)
        {
            ClearCache();
            return false;
        }

        return true;
    }

    public AttemptToken? GetToken() => _cachedToken;

    public void ClearCache()
    {
        _cachedToken = null;
        _lastOnlineSyncUtc = null;
    }
}
