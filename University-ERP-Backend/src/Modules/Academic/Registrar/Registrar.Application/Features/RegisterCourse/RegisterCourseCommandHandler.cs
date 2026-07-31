namespace Registrar.Application.Features.RegisterCourse;

using MediatR;
using SharedKernel.Domain.Primitives;
using Registrar.Domain.Aggregates;
using Registrar.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class RegisterCourseCommandHandler : IRequestHandler<RegisterCourseCommand, Result<Guid>>
{
    private readonly IRegistrarRepository _repository;

    public RegisterCourseCommandHandler(IRegistrarRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(RegisterCourseCommand request, CancellationToken cancellationToken)
    {
        // 1. Ensure Domain Aggregates create a valid state
        var registrationResult = CourseRegistration.Register(
            request.StudentId, 
            request.CourseCode, 
            request.AcademicTerm);

        if (registrationResult.IsFailure)
        {
            return Result<Guid>.Failure(registrationResult.Error);
        }

        // 2. Infrastructure Check: Prevent duplicate registrations for the exact same term
        bool isAlreadyRegistered = await _repository.IsStudentRegisteredAsync(
            request.StudentId, 
            request.CourseCode, 
            request.AcademicTerm, 
            cancellationToken);

        if (isAlreadyRegistered)
        {
            return Result<Guid>.Failure(new Error(
                "Registrar.DuplicateRegistration", 
                "The student is already officially registered for this course in the selected term."));
        }

        // 3. Save to authoritative DB
        await _repository.AddRegistrationAsync(registrationResult.Value, cancellationToken);

        return Result<Guid>.Success(registrationResult.Value.Id);
    }
}