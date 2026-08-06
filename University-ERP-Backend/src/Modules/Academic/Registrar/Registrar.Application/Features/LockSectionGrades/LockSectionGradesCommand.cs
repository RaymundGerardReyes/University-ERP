namespace Registrar.Application.Features.LockSectionGrades;

using MediatR;
using SharedKernel.Domain.Primitives;
using System.Threading;
using System.Threading.Tasks;

public sealed record LockSectionGradesCommand(string SectionId) : IRequest<Result<string>>;

public sealed class LockSectionGradesCommandHandler : IRequestHandler<LockSectionGradesCommand, Result<string>>
{
    // private readonly ICourseSectionRepository _repository;

    public LockSectionGradesCommandHandler()
    {
    }

    public async Task<Result<string>> Handle(LockSectionGradesCommand request, CancellationToken cancellationToken)
    {
        // var section = await _repository.GetByIdAsync(request.SectionId, cancellationToken);
        // if (section == null) return Result.Failure(new Error("NotFound", "Section not found."));

        // var result = section.LockGrades();
        // if (result.IsFailure) return result;

        // await _repository.UpdateAsync(section, cancellationToken);
        
        await Task.CompletedTask;
        return Result<string>.Success($"Successfully locked grades for section {request.SectionId}");
    }
}
