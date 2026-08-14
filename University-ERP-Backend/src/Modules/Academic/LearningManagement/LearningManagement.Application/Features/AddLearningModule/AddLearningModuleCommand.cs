namespace LearningManagement.Application.Features.AddLearningModule;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record AddLearningModuleCommand(string SectionId, string Title, string Description, int OrderSequence) : IRequest<Result<bool>>;

public sealed class AddLearningModuleCommandHandler : IRequestHandler<AddLearningModuleCommand, Result<bool>>
{
    private readonly ICourseSyllabusRepository _repository;

    public AddLearningModuleCommandHandler(ICourseSyllabusRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(AddLearningModuleCommand request, CancellationToken cancellationToken)
    {
        var syllabus = await _repository.GetBySectionIdAsync(request.SectionId, cancellationToken);
        if (syllabus == null)
        {
            return Result<bool>.Failure(new Error("LMS.SyllabusNotFound", "Syllabus not found for this section."));
        }

        syllabus.AddModule(request.Title, request.Description, request.OrderSequence);
        
        await _repository.UpdateAsync(syllabus, cancellationToken);
        
        return Result<bool>.Success(true);
    }
}
