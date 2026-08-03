namespace IdentityAccess.Application.Features.RegisterUser;

using MediatR;
using SharedKernel.Domain.Primitives;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Handles execution of the RegisterUserCommand.
/// </summary>
public sealed partial class RegisterUserCommandHandler : IRequestHandler<RegisterUserCommand, Result<Guid>>
{
    private readonly ILogger<RegisterUserCommandHandler> _logger;

    // Inject the centralized ILogger abstraction
    public RegisterUserCommandHandler(ILogger<RegisterUserCommandHandler> logger)
    {
        _logger = logger;
    }

    // =================================================================================
    // High-Performance Compile-Time Logging Generators
    // This enforces structured logging and prevents allocations from string interpolation
    // =================================================================================
    [LoggerMessage(Level = LogLevel.Information, Message = "Attempting to register new user with Email: {Email}")]
    private partial void LogRegistrationAttempt(string email);

    [LoggerMessage(Level = LogLevel.Information, Message = "Successfully registered user with ID: {UserId}")]
    private partial void LogRegistrationSuccess(Guid userId);

    public Task<Result<Guid>> Handle(RegisterUserCommand request, CancellationToken cancellationToken)
    {
        // 1. Log the attempt securely (Notice we DO NOT log the password!)
        LogRegistrationAttempt(request.Email);

        var newUserId = Guid.NewGuid();

        // 2. Log the successful creation
        LogRegistrationSuccess(newUserId);

        return Task.FromResult(Result<Guid>.Success(newUserId));
    }
}