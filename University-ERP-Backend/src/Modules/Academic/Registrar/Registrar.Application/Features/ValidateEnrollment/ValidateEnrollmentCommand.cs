namespace Registrar.Application.Features.ValidateEnrollment;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ValidateEnrollmentCommand(Guid StudentId, string AcademicTerm) : IRequest<Result<string>>;

public sealed class ValidateEnrollmentCommandHandler : IRequestHandler<ValidateEnrollmentCommand, Result<string>>
{
    // Mocking the repository interface pattern from the codebase
    // private readonly ICourseRegistrationRepository _repository;

    public ValidateEnrollmentCommandHandler()
    {
    }

    public async Task<Result<string>> Handle(ValidateEnrollmentCommand request, CancellationToken cancellationToken)
    {
        // 1. Fetch all pending CourseRegistration aggregates for this StudentId and AcademicTerm
        // var registrations = await _repository.GetPendingForStudentAsync(request.StudentId, request.AcademicTerm, cancellationToken);
        
        // 2. Validate prerequisites and maximum units load (Business Rules)
        
        // 3. Call Validate() on each aggregate
        // foreach (var reg in registrations)
        // {
        //     reg.Validate();
        //     await _repository.UpdateAsync(reg, cancellationToken);
        // }

        // MOCK SUCCESS
        await Task.CompletedTask;
        return Result<string>.Success($"Successfully validated enrollment for student {request.StudentId}");
    }
}
