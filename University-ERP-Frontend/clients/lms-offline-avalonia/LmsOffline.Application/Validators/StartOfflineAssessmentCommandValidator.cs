namespace LmsOffline.Application.Validators;

using System;
using FluentValidation;
using LmsOffline.Application.Commands;

#region Validators
/// <summary>
/// Validates the StartOfflineAssessmentCommand before execution.
/// </summary>
public sealed class StartOfflineAssessmentCommandValidator : AbstractValidator<StartOfflineAssessmentCommand>
{
    public StartOfflineAssessmentCommandValidator()
    {
        RuleFor(x => x.AssessmentId)
            .NotEmpty()
            .WithMessage("Assessment ID is required.");

        RuleFor(x => x.Token)
            .NotNull()
            .WithMessage("An attempt token must be provided.");

        RuleFor(x => x.CurrentTimeUtc)
            .NotEqual(default(DateTime))
            .WithMessage("A valid current time must be provided.");
    }
}
#endregion
