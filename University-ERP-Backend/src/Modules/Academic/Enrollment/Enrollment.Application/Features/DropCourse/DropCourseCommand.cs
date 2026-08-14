namespace Enrollment.Application.Features.DropCourse;

using MediatR;
using SharedKernel.Domain.Primitives;
using Enrollment.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record DropCourseCommand(string StudentId, string RegistrationLineItemId, string Reason) : IRequest<Result<bool>>;

public sealed class DropCourseCommandHandler : IRequestHandler<DropCourseCommand, Result<bool>>
{
    private readonly ITermRegistrationRepository _repository;

    public DropCourseCommandHandler(ITermRegistrationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(DropCourseCommand request, CancellationToken cancellationToken)
    {
        // 1. Retrieve the student's active registration aggregate
        var registration = await _repository.GetActiveRegistrationAsync(request.StudentId, cancellationToken);
        
        if (registration == null)
        {
            return Result<bool>.Failure(new Error("Enrollment.NoActiveRegistration", "No active registration found for this student."));
        }

        // 2. Delegate business logic to the aggregate
        var dropResult = registration.DropCourse(request.RegistrationLineItemId, request.Reason);
        
        if (dropResult.IsFailure)
        {
            return dropResult;
        }

        // 3. Persist the updated state to the database
        await _repository.UpdateAsync(registration, cancellationToken);

        return Result<bool>.Success(true);
    }
}
