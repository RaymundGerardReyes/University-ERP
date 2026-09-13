namespace Curriculum.Application.Features.UpdatePrerequisite;

using MediatR;
using SharedKernel.Domain.Primitives;
using Curriculum.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record UpdatePrerequisiteEnforcementCommand(string CourseId, string RuleId, bool IsEnforced) : IRequest<Result<bool>>
{
    public UpdatePrerequisiteEnforcementCommand(Guid courseId, string ruleId, bool isEnforced)
        : this(courseId.ToString(), ruleId, isEnforced)
    {
    }
}

public sealed class UpdatePrerequisiteEnforcementCommandHandler : IRequestHandler<UpdatePrerequisiteEnforcementCommand, Result<bool>>
{
    private readonly ICourseDefinitionRepository _repository;

    public UpdatePrerequisiteEnforcementCommandHandler(ICourseDefinitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(UpdatePrerequisiteEnforcementCommand request, CancellationToken cancellationToken)
    {
        var course = Guid.TryParse(request.CourseId, out var guid)
            ? await _repository.GetByIdAsync(guid, cancellationToken)
            : await _repository.GetByIdAsync(request.CourseId, cancellationToken);
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

public sealed record UpdatePrerequisiteCommand : IRequest<Result<bool>>
{
    public string CourseId { get; init; }
    public string RequiredCourseCode { get; init; }
    public string MinimumGrade { get; init; }
    public bool IsEnforced { get; init; }

    public UpdatePrerequisiteCommand(string courseId, string requiredCourseCode, string minimumGrade, bool isEnforced)
    {
        CourseId = courseId;
        RequiredCourseCode = requiredCourseCode;
        MinimumGrade = minimumGrade;
        IsEnforced = isEnforced;
    }

    public UpdatePrerequisiteCommand(Guid courseId, string requiredCourseCode, string minimumGrade, bool isEnforced)
        : this(courseId.ToString(), requiredCourseCode, minimumGrade, isEnforced)
    {
    }
}

public sealed class UpdatePrerequisiteCommandHandler : IRequestHandler<UpdatePrerequisiteCommand, Result<bool>>
{
    private readonly ICourseDefinitionRepository _repository;

    public UpdatePrerequisiteCommandHandler(ICourseDefinitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(UpdatePrerequisiteCommand request, CancellationToken cancellationToken)
    {
        var course = Guid.TryParse(request.CourseId, out var guid)
            ? await _repository.GetByIdAsync(guid, cancellationToken)
            : await _repository.GetByIdAsync(request.CourseId, cancellationToken);
        if (course == null)
        {
            return Result<bool>.Failure(new Error("Curriculum.CourseNotFound", "The specified course definition was not found."));
        }

        course.AddPrerequisite(request.RequiredCourseCode, request.MinimumGrade, request.IsEnforced);
        await _repository.UpdateAsync(course, cancellationToken);

        return Result<bool>.Success(true);
    }
}
