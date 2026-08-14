namespace Curriculum.Application.Features.UpdateMasterData;

using MediatR;
using SharedKernel.Domain.Primitives;
using Curriculum.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record UpdateCourseMasterDataCommand(string CourseId, string Title, int Units, string Status, string Description) : IRequest<Result<bool>>;

public sealed class UpdateCourseMasterDataCommandHandler : IRequestHandler<UpdateCourseMasterDataCommand, Result<bool>>
{
    private readonly ICourseDefinitionRepository _repository;

    public UpdateCourseMasterDataCommandHandler(ICourseDefinitionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(UpdateCourseMasterDataCommand request, CancellationToken cancellationToken)
    {
        var course = await _repository.GetByIdAsync(request.CourseId, cancellationToken);
        if (course == null)
        {
            return Result<bool>.Failure(new Error("Curriculum.CourseNotFound", "The specified course definition was not found."));
        }

        course.UpdateMasterData(request.Title, request.Units, request.Status, request.Description);
        
        await _repository.UpdateAsync(course, cancellationToken);
        
        return Result<bool>.Success(true);
    }
}
