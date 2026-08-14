namespace Curriculum.Application.Features.UpdatePrerequisite;

using MediatR;
using SharedKernel.Domain.Primitives;
using Curriculum.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record UpdatePrerequisiteEnforcementCommand(string CourseId, string RuleId, bool IsEnforced) : IRequest<Result<bool>>;

public sealed class UpdatePrerequisiteEnforcementCommandHandler : IRequestHandler<UpdatePrerequisiteEnforcementCommand, Result<bool>>
{
    private readonly ICourseDefinitionRepository _repository;

    public UpdatePrerequisiteEnforcementCommandHandler(ICourseDefinitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(UpdatePrerequisiteEnforcementCommand request, CancellationToken cancellationToken)
    {
        var course = await _repository.GetByIdAsync(request.CourseId, cancellationToken);
        if (course == null)
        {
            return Result<bool>.Failure(new Error("Curriculum.CourseNotFound", "The specified course definition was not found."));
        }

        var result = course.TogglePrerequisiteEnforcement(request.RuleId, request.IsEnforced);
        if (result.IsSuccess)
        {
            await _repository.UpdateAsync(course, cancellationToken);
        }

        return result;
    }
}
