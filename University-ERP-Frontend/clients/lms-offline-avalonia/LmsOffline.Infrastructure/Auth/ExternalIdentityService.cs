namespace LmsOffline.Infrastructure.Auth;

using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.Aggregates; 
using LmsOffline.Domain.ValueObjects;
using SharedKernel.Domain.Primitives;

internal class BackendAuthResponse 
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;
    
    [JsonPropertyName("user")]
    public BackendUserDto User { get; set; } = new();
}

internal class BackendUserDto 
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
}

internal class BackendErrorResponse
{
    [JsonPropertyName("code")]
    public string Code { get; set; } = string.Empty;
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

public class ExternalIdentityService : IExternalIdentityService
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IOfflineIdentityRepository _identityRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly OfflineTokenCache _tokenCache;
    private readonly ILogger<ExternalIdentityService> _logger;

    public ExternalIdentityService(
        IHttpClientFactory httpClientFactory,
        IOfflineIdentityRepository identityRepository,
        IPasswordHasher passwordHasher,
        OfflineTokenCache tokenCache,
        ILogger<ExternalIdentityService> logger)
    {
        _httpClientFactory = httpClientFactory;
        _identityRepository = identityRepository;
        _passwordHasher = passwordHasher;
        _tokenCache = tokenCache;
        _logger = logger;
    }

    public async Task<Result<bool>> AuthenticateAndSyncAsync(string email, string plaintextPassword, CancellationToken cancellationToken = default)
    {
        try 
        {
            var client = _httpClientFactory.CreateClient();
            var payload = new { Email = email, Password = plaintextPassword };
            
            var response = await client.PostAsJsonAsync("http://localhost:5191/api/v1/platform/identity/login", payload, cancellationToken);
            
            if (response.IsSuccessStatusCode)
            {
                var authData = await response.Content.ReadFromJsonAsync<BackendAuthResponse>(cancellationToken: cancellationToken);
                
                if (authData != null && !string.IsNullOrEmpty(authData.Token) && authData.User != null)
                {
                    // 1. Cache the JWT for Outbox syncing
                    _tokenCache.CacheToken(new AttemptToken(authData.Token, DateTime.UtcNow, authData.User.Id));
                    
                    // 2. Dual-Hashing Translation Pattern (BCrypt -> PBKDF2)
                    var salt = _passwordHasher.GenerateSalt();
                    var localHash = _passwordHasher.HashPassword(plaintextPassword, salt);

                    // 3. Save into local SQLite table
                    var studentUserResult = StudentUser.Create(
                        authData.User.Id,
                        authData.User.Email,
                        authData.User.Name,
                        "General Program",
                        localHash,
                        salt
                    );
                    
                    if (studentUserResult.IsSuccess)
                    {
                        await _identityRepository.AddAsync(studentUserResult.Value, cancellationToken);
                    }
                    
                    _logger.LogInformation("Live authentication successful. Student profile synced to local encrypted vault.");
                    return Result<bool>.Success(true);
                }
            }
            
            _logger.LogWarning("Backend rejected authentication. Status Code: {StatusCode}", response.StatusCode);

            if (response.StatusCode == HttpStatusCode.Forbidden || response.StatusCode == HttpStatusCode.Unauthorized)
            {
                return Result<bool>.Failure(new Error("Auth.InvalidCredentials", "Invalid email or password."));
            }

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return Result<bool>.Failure(new Error("Auth.NotFound", "No student account was found for the provided identifier."));
            }

            try
            {
                var errPayload = await response.Content.ReadFromJsonAsync<BackendErrorResponse>(cancellationToken: cancellationToken);
                if (errPayload != null && !string.IsNullOrWhiteSpace(errPayload.Message))
                {
                    return Result<bool>.Failure(new Error(string.IsNullOrWhiteSpace(errPayload.Code) ? "Auth.InvalidCredentials" : errPayload.Code, errPayload.Message));
                }
            }
            catch
            {
                // Ignore JSON parse errors for non-JSON response bodies
            }

            return Result<bool>.Failure(new Error("Auth.InvalidCredentials", "Invalid email or password."));
        }
        catch (HttpRequestException ex)
        {
            _logger.LogWarning("Backend is unreachable. {Message}", ex.Message);
            return Result<bool>.Failure(new Error("Auth.NetworkError", "Unable to reach identity server. Please check network connection."));
        }
    }
}