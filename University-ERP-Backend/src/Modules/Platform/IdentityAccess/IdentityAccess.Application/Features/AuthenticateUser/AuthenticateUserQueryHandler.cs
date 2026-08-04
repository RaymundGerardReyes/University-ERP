namespace IdentityAccess.Application.Features.AuthenticateUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using IdentityAccess.Application.Abstractions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

public sealed partial class AuthenticateUserQueryHandler : IRequestHandler<AuthenticateUserQuery, Result<AuthResponseDto>>
{
    private readonly ILogger<AuthenticateUserQueryHandler> _logger;
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthenticateUserQueryHandler(
        ILogger<AuthenticateUserQueryHandler> logger,
        IUserRepository userRepository,
        IConfiguration configuration)
    {
        _logger = logger;
        _userRepository = userRepository;
        _configuration = configuration;
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Authentication attempt for user email: {Email}")]
    private partial void LogAuthAttempt(string email);

    [LoggerMessage(Level = LogLevel.Information, Message = "Authentication successful for user: {UserId}")]
    private partial void LogAuthSuccess(string userId);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Authentication failed for email: {Email} - {Reason}")]
    private partial void LogAuthFailed(string email, string reason);

    public async Task<Result<AuthResponseDto>> Handle(AuthenticateUserQuery request, CancellationToken cancellationToken)
    {
        LogAuthAttempt(request.Email);

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            LogAuthFailed("Unknown", "Email cannot be empty.");
            return Result<AuthResponseDto>.Failure(new Error("Auth.Empty", "Email cannot be empty."));
        }

        // 1. Find user by email
        var user = await _userRepository.FindByEmailAsync(request.Email, cancellationToken);
        if (user is null)
        {
            LogAuthFailed(request.Email, "User not found.");
            return Result<AuthResponseDto>.Failure(new Error("Auth.InvalidCredentials", "Invalid email or password."));
        }

        // 2. Verify BCrypt password hash
        var passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!passwordValid)
        {
            LogAuthFailed(request.Email, "Invalid password.");
            return Result<AuthResponseDto>.Failure(new Error("Auth.InvalidCredentials", "Invalid email or password."));
        }

        // 3. Generate JWT token
        var token = GenerateJwtToken(user.Id.ToString(), user.Email, $"{user.FirstName} {user.LastName}");

        LogAuthSuccess(user.Id.ToString());

        var userDto = new UserDto(user.Id.ToString(), user.Email, $"{user.FirstName} {user.LastName}", "User");
        return Result<AuthResponseDto>.Success(new AuthResponseDto(token, userDto));
    }

    private string GenerateJwtToken(string userId, string email, string name)
    {
        var secretKey = _configuration["JWT_SECRET_KEY"]
            ?? throw new InvalidOperationException("JWT_SECRET_KEY is not configured.");
        var issuer = _configuration["JWT_ISSUER"] ?? "https://auth.university.edu";
        var audience = _configuration["JWT_AUDIENCE"] ?? "university-erp-api";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

