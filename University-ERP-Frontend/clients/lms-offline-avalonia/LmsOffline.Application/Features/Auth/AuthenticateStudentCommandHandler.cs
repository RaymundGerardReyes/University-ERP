namespace LmsOffline.Application.Features.Auth;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Application.Features.AuthenticateStudent;

public sealed record AuthenticateStudentCommand(string Email, string Password) : IRequest<Result<AuthenticateStudentResult>>;

public sealed class AuthenticateStudentCommandHandler : IRequestHandler<AuthenticateStudentCommand, Result<AuthenticateStudentResult>>
{
    private readonly IOfflineIdentityRepository _identityRepository;
    private readonly ILogger<AuthenticateStudentCommandHandler> _logger;

    public AuthenticateStudentCommandHandler(
        IOfflineIdentityRepository identityRepository,
        ILogger<AuthenticateStudentCommandHandler> logger)
    {
        _identityRepository = identityRepository;
        _logger = logger;
    }

    public async Task<Result<AuthenticateStudentResult>> Handle(AuthenticateStudentCommand request, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Authenticating student profile...");

        var existingStudent = await _identityRepository.GetByEmailOrStudentIdAsync(request.Email, cancellationToken);
        if (existingStudent is null)
        {
            _logger.LogWarning("No student profile found for {Email}.", request.Email);
            return Result<AuthenticateStudentResult>.Failure(new Error("Auth.UserNotFound", "No student profile was found."));
        }

        existingStudent.RecordSuccessfulLogin();
        await _identityRepository.UpdateAsync(existingStudent, cancellationToken);

        _logger.LogInformation("Student profile updated successfully in the local encrypted database.");

        var authResult = new AuthenticateStudentResult(
            existingStudent.Id,
            existingStudent.StudentIdNumber,
            existingStudent.FullName,
            existingStudent.AcademicProgram,
            Guid.NewGuid().ToString("N"),
            DateTime.UtcNow.AddHours(24),
            existingStudent.Role
        );

        return Result<AuthenticateStudentResult>.Success(authResult);
    }
}
