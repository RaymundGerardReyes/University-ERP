namespace Registrar.Application.Features.RegisterCourse;

using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command to register a student for a specific course curriculum.
/// </summary>
public sealed record RegisterCourseCommand(
    Guid StudentId, 
    string CourseCode, 
    string AcademicTerm
) : IRequest<Result<Guid>>;

public sealed class RegisterCourseCommandHandler : IRequestHandler<RegisterCourseCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(RegisterCourseCommand request, CancellationToken cancellationToken)
    {
        // DBMA implementation: In a full scenario, this would validate prerequisites 
        // against the Registrar.Domain constraints and persist the registration.
        
        var registrationId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(registrationId));
    }
}