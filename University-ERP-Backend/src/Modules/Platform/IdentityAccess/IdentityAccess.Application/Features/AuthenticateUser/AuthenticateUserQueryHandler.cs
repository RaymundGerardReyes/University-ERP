namespace IdentityAccess.Application.Features.AuthenticateUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;

// Note: The class MUST be marked 'partial' for compile-time logging to work!
public sealed partial class AuthenticateUserQueryHandler : IRequestHandler<AuthenticateUserQuery, Result<AuthResponseDto>>
{
    private readonly ILogger<AuthenticateUserQueryHandler> _logger;

    public AuthenticateUserQueryHandler(ILogger<AuthenticateUserQueryHandler> logger)
    {
        _logger = logger;
    }

    // =================================================================================
    // High-Performance Compile-Time Logging Generators (Best Practice #2 & #10)
    // =================================================================================
    
    [LoggerMessage(Level = LogLevel.Information, Message = "Authentication attempt for user email: {Email}")]
    private partial void LogAuthAttempt(string email);

    [LoggerMessage(Level = LogLevel.Information, Message = "Authentication successful for user: {UserId}")]
    private partial void LogAuthSuccess(string userId);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Authentication failed for email: {Email} - {Reason}")]
    private partial void LogAuthFailed(string email, string reason);

    public Task<Result<AuthResponseDto>> Handle(AuthenticateUserQuery request, CancellationToken cancellationToken)
    {
        // 1. Log the attempt securely (Best Practice #10: NEVER log the PasswordHash!)
        LogAuthAttempt(request.Email);

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            LogAuthFailed("Unknown", "Email cannot be empty.");
            return Task.FromResult(Result<AuthResponseDto>.Failure(new Error("Auth.Empty", "Email cannot be empty.")));
        }

        // Simple mock authentication logic
        var mockUser = new UserDto("usr-123", request.Email, "Admin User", "Admin");
        var response = new AuthResponseDto("mock-jwt-token-from-backend", mockUser);

        // 2. Log success
        LogAuthSuccess(mockUser.Id);

        return Task.FromResult(Result<AuthResponseDto>.Success(response));
    }
}
