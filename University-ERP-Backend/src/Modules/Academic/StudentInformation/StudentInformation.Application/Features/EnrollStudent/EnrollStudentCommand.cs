namespace StudentInformation.Application.Features.EnrollStudent;

using MediatR;
using SharedKernel.Domain.Primitives;
using StudentInformation.Domain.ValueObjects;

/// <summary>
/// CQRS Command to enroll a new student into the university.
/// Notice we use a primitive Guid for IdentityUserId to maintain strict DBMA module boundaries.
/// </summary>
public sealed record EnrollStudentCommand(
    Guid IdentityUserId,
    string EnrollmentNumber
) : IRequest<Result<StudentId>>;
