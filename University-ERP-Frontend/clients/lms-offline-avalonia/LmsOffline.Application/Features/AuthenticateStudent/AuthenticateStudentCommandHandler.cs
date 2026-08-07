namespace LmsOffline.Application.Features.AuthenticateStudent;

using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using SharedKernel.Domain.Primitives;
using LmsOffline.Application.Interfaces;
using LmsOffline.Domain.ValueObjects;

public sealed class AuthenticateStudentCommandHandler : IRequestHandler<AuthenticateStudentCommand, Result<AuthenticateStudentResult>>
{
    private readonly IOfflineIdentityRepository _identityRepository;
    private readonly IPasswordHasher _passwordHasher;

    public AuthenticateStudentCommandHandler(
        IOfflineIdentityRepository identityRepository,
        IPasswordHasher passwordHasher)
    {
        _identityRepository = identityRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result<AuthenticateStudentResult>> Handle(
        AuthenticateStudentCommand request, 
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Identifier) || string.IsNullOrWhiteSpace(request.PlainPassword))
        {
            return Result<AuthenticateStudentResult>.Failure(
                new Error("Auth.MissingInput", "Please provide both student ID/email and password."));
        }

        // 1. Fetch Student from Encrypted Identity Store
        var student = await _identityRepository.GetByEmailOrStudentIdAsync(request.Identifier, cancellationToken);
        if (student == null)
        {
            return Result<AuthenticateStudentResult>.Failure(
                new Error("Auth.InvalidCredentials", "Invalid student credentials or offline account not found."));
        }

        if (!student.IsActive)
        {
            return Result<AuthenticateStudentResult>.Failure(
                new Error("Auth.AccountDisabled", "Student account is suspended in local vault."));
        }

        // 2. Cryptographic Password Verification
        bool isValid = _passwordHasher.VerifyPassword(request.PlainPassword, student.PasswordHash, student.PasswordSalt);
        if (!isValid)
        {
            return Result<AuthenticateStudentResult>.Failure(
                new Error("Auth.InvalidCredentials", "Invalid student credentials."));
        }

        // 3. Record Successful Login
        student.RecordSuccessfulLogin();
        await _identityRepository.UpdateAsync(student, cancellationToken);

        // 4. Issue Offline Session Token (Bounded 24-hour lifespan)
        var expiresAtUtc = DateTime.UtcNow.AddHours(24);
        string tokenValue = $"offline_jwt_{student.Id:N}_{DateTime.UtcNow.Ticks}";

        var resultDto = new AuthenticateStudentResult(
            StudentId: student.Id,
            StudentIdNumber: student.StudentIdNumber,
            FullName: student.FullName,
            AcademicProgram: student.AcademicProgram,
            TokenValue: tokenValue,
            ExpiresAtUtc: expiresAtUtc,
            Role: student.Role
        );

        return Result<AuthenticateStudentResult>.Success(resultDto);
    }
}