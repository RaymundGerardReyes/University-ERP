namespace StudentInformation.Application.Features.EnrollStudent;

using FluentValidation;

/// <summary>
/// Input validation rules for enrolling a student.
/// </summary>
public sealed class EnrollStudentCommandValidator : AbstractValidator<EnrollStudentCommand>
{
    public EnrollStudentCommandValidator()
    {
        RuleFor(x => x.IdentityUserId)
            .NotEmpty().WithMessage("A valid Identity User ID is required.");

        RuleFor(x => x.EnrollmentNumber)
            .NotEmpty().WithMessage("Enrollment number is required.")
            .MaximumLength(20).WithMessage("Enrollment number cannot exceed 20 characters.");
    }
}
