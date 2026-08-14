namespace LearningManagement.Application.Features.AddContentItem;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

public sealed record AddContentItemCommand(string SectionId, string ModuleId, string Name, string ContentType, string ResourceUrl) : IRequest<Result<bool>>;

public sealed class AddContentItemCommandHandler : IRequestHandler<AddContentItemCommand, Result<bool>>
{
    private readonly ICourseSyllabusRepository _repository;

    public AddContentItemCommandHandler(ICourseSyllabusRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(AddContentItemCommand request, CancellationToken cancellationToken)
    {
        var syllabus = await _repository.GetBySectionIdAsync(request.SectionId, cancellationToken);
        if (syllabus == null)
        {
            return Result<bool>.Failure(new Error("LMS.SyllabusNotFound", "Syllabus not found for this section."));
        }

        var module = syllabus.Modules.FirstOrDefault(m => m.Id.ToString() == request.ModuleId);
        if (module == null)
        {
            return Result<bool>.Failure(new Error("LMS.ModuleNotFound", "Learning module not found within the syllabus."));
        }

        module.AddContent(request.Name, request.ContentType, request.ResourceUrl);
        
        await _repository.UpdateAsync(syllabus, cancellationToken);
        
        return Result<bool>.Success(true);
    }
}
