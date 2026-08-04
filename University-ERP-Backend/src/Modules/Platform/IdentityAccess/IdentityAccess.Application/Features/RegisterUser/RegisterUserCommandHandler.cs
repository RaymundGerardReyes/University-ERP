namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using Microsoft.Extensions.Logging;
using IdentityAccess.Application.Abstractions;
using IdentityAccess.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Handles execution of the RegisterUserCommand.
/// Validates, hashes the password, checks for duplicate emails, and persists the new user.
/// </summary>
public sealed partial class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result<Guid>>
{
    private readonly ILogger<RegisterUserCommandHandler> _logger;
    private readonly IUserRepository _userRepository;

    public RegisterUserCommandHandler(ILogger<RegisterUserCommandHandler> logger, IUserRepository userRepository)
    {
        _logger = logger;
        _userRepository = userRepository;
    }

    [LoggerMessage(Level = LogLevel.Information, Message = "Attempting to register new user with Email: {Email}")]
    private partial void LogRegistrationAttempt(string email);

    [LoggerMessage(Level = LogLevel.Information, Message = "Successfully registered user with ID: {UserId}")]
    private partial void LogRegistrationSuccess(Guid userId);

    [LoggerMessage(Level = LogLevel.Warning, Message = "Registration failed — email already in use: {Email}")]
    private partial void LogDuplicateEmail(string email);

    public async Task<Result<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        LogRegistrationAttempt(request.Email);

        // 1. Check for duplicate email
        var emailTaken = await _userRepository.ExistsWithEmailAsync(request.Email, cancellationToken);
        if (emailTaken)
        {
            LogDuplicateEmail(request.Email);
            return Result<Guid>.Failure(new Error("User.DuplicateEmail", $"An account with email '{request.Email}' already exists."));
        }

        // 2. Hash the password using BCrypt (work factor 12 is a secure default)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12);

        // 3. Create the domain aggregate
        var userResult = User.Register(request.Email, request.FirstName, request.LastName, passwordHash);
        if (!userResult.IsSuccess)
            return Result<Guid>.Failure(userResult.Error);

        // 4. Persist to the database
        await _userRepository.AddAsync(userResult.Value, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        LogRegistrationSuccess(userResult.Value.Id);
        return Result<Guid>.Success(userResult.Value.Id);
    }
}