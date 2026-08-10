namespace LmsOffline.Application.Features.AuthenticateStudent;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using LmsOffline.Application.Interfaces;
using SharedKernel.Domain.Primitives;

public sealed class AuthenticateStudentCommandHandler : IRequestHandler<AuthenticateStudentCommand, Result<AuthenticateStudentResult>>
{
    private readonly IOfflineIdentityRepository _identityRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly IExternalIdentityService _externalIdentityService;
    private readonly ILogger<AuthenticateStudentCommandHandler> _logger;

    public AuthenticateStudentCommandHandler(
        IOfflineIdentityRepository identityRepository,
        IPasswordHasher passwordHasher,
        IExternalIdentityService externalIdentityService,
        ILogger<AuthenticateStudentCommandHandler> logger)
    {
        _identityRepository = identityRepository;
        _passwordHasher = passwordHasher;
        _externalIdentityService = externalIdentityService;
        _logger = logger;
    }

    public async Task<Result<AuthenticateStudentResult>> Handle(AuthenticateStudentCommand request, CancellationToken cancellationToken)
    {
        // 1. OFFLINE FIRST: Check local encrypted SQLite vault
        var localStudent = await _identityRepository.GetByEmailOrStudentIdAsync(request.Identifier, cancellationToken);
        
        if (localStudent != null)
        {
            // Verify using the local PBKDF2 hasher
            if (_passwordHasher.VerifyPassword(request.Password, localStudent.PasswordHash, localStudent.PasswordSalt))
            {
                _logger.LogInformation("Offline authentication successful via local encrypted vault.");
                
                localStudent.RecordSuccessfulLogin();
                await _identityRepository.UpdateAsync(localStudent, cancellationToken);

                var authResult = new AuthenticateStudentResult(
                    localStudent.Id,
                    localStudent.StudentIdNumber,
                    localStudent.FullName,
                    localStudent.AcademicProgram,
                    Guid.NewGuid().ToString("N"),
                    DateTime.UtcNow.AddHours(24),
                    localStudent.Role
                );

                return Result<AuthenticateStudentResult>.Success(authResult);
            }
            
            _logger.LogWarning("Offline authentication failed: Invalid password.");
            return Result<AuthenticateStudentResult>.Failure(new Error("Auth.InvalidCredentials", "Invalid email or password."));
        }

        // 2. ONLINE FALLBACK: Delegate dual-hashing, API call, and caching strictly to Infrastructure
        _logger.LogInformation("Attempting live backend authentication for {Identifier}...", request.Identifier);
        
        var onlineResult = await _externalIdentityService.AuthenticateAndSyncAsync(request.Identifier, request.Password, cancellationToken);
        
        if (onlineResult.IsSuccess)
        {
            var syncedStudent = await _identityRepository.GetByEmailOrStudentIdAsync(request.Identifier, cancellationToken);
            if (syncedStudent != null)
            {
                syncedStudent.RecordSuccessfulLogin();
                await _identityRepository.UpdateAsync(syncedStudent, cancellationToken);

                var authResult = new AuthenticateStudentResult(
                    syncedStudent.Id,
                    syncedStudent.StudentIdNumber,
                    syncedStudent.FullName,
                    syncedStudent.AcademicProgram,
                    Guid.NewGuid().ToString("N"),
                    DateTime.UtcNow.AddHours(24),
                    syncedStudent.Role
                );

                return Result<AuthenticateStudentResult>.Success(authResult);
            }

            return Result<AuthenticateStudentResult>.Success(new AuthenticateStudentResult(
                Guid.NewGuid(),
                request.Identifier,
                "Authenticated Student",
                "General Program",
                Guid.NewGuid().ToString("N"),
                DateTime.UtcNow.AddHours(24),
                "Student"
            ));
        }

        _logger.LogWarning("Authentication failed for identifier {Identifier}: {Error}", request.Identifier, onlineResult.Error.Description);
        return Result<AuthenticateStudentResult>.Failure(onlineResult.Error);
    }
}