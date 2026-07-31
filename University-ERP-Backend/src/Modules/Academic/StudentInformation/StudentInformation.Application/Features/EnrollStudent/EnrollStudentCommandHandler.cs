namespace StudentInformation.Application.Features.EnrollStudent;

using MediatR;
using SharedKernel.Domain.Primitives;
using StudentInformation.Domain.Aggregates;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Application.Abstractions;

/// <summary>
/// Handles execution of the EnrollStudentCommand.
/// </summary>
public sealed class EnrollStudentCommandHandler : IRequestHandler<EnrollStudentCommand, Result<StudentId>>
{
    private readonly IStudentRepository _studentRepository;

    public EnrollStudentCommandHandler(IStudentRepository studentRepository)
    {
        _studentRepository = studentRepository;
    }

    public async Task<Result<StudentId>> Handle(
        EnrollStudentCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Ensure the enrollment number isn't already taken
        bool isUnique = await _studentRepository.IsEnrollmentNumberUniqueAsync(request.EnrollmentNumber, cancellationToken);
        if (!isUnique)
        {
            return Result<StudentId>.Failure(new Error(
                "Student.DuplicateEnrollmentNumber", 
                "The specified enrollment number is already assigned to an active student."));
        }

        // 2. Instantiate the Student Aggregate Root
        var studentId = StudentId.CreateUnique();
        var studentResult = Student.Enroll(
            studentId,
            request.IdentityUserId,
            request.EnrollmentNumber,
            DateTime.UtcNow);

        if (studentResult.IsFailure)
        {
            return Result<StudentId>.Failure(studentResult.Error);
        }

        // 3. Persist the Aggregate
        await _studentRepository.AddAsync(studentResult.Value, cancellationToken);

        return Result<StudentId>.Success(studentResult.Value.Id);
    }
}
