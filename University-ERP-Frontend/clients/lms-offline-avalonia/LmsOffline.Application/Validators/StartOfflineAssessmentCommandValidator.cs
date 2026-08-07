namespace LmsOffline.Application.Validators;

using FluentValidation;
// FIXED: Pointing to the new Clean Architecture Features namespace instead of the deleted Commands folder
using LmsOffline.Application.Features.StartOfflineAssessment; 

public class StartOfflineAssessmentCommandValidator : AbstractValidator<StartOfflineAssessmentCommand>
{
    public StartOfflineAssessmentCommandValidator()
    {
        RuleFor(x => x.AssessmentId)
            .NotEmpty()
            .WithMessage("Assessment ID is required.");

        RuleFor(x => x.TokenValue)
            .NotEmpty()
            .WithMessage("Security token is required.");
    }
}