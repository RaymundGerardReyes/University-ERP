namespace LearningManagement.Application.Features.CreateSyllabus;

using MediatR;
using SharedKernel.Domain.Primitives;
using LearningManagement.Application.Abstractions;
using LearningManagement.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record CreateSyllabusCommand(string SectionId, string Title, string Description) : IRequest<Result<string>>;

public sealed class CreateSyllabusCommandHandler : IRequestHandler<CreateSyllabusCommand, Result<string>>
{
    private readonly ICourseSyllabusRepository _repository;

    public CreateSyllabusCommandHandler(ICourseSyllabusRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<string>> Handle(CreateSyllabusCommand request, CancellationToken cancellationToken)
    {
        var existingSyllabus = await _repository.GetBySectionIdAsync(request.SectionId, cancellationToken);
        if (existingSyllabus != null)
        {
            return Result<string>.Failure(new Error("LMS.SyllabusExists", "A syllabus already exists for this section."));
        }

        var newSyllabus = new CourseSyllabus(Guid.NewGuid(), request.SectionId, request.Title, request.Description);
        
        await _repository.AddAsync(newSyllabus, cancellationToken);
        
        return Result<string>.Success(newSyllabus.Id.ToString());
    }
}
