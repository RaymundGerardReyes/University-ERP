namespace LearningManagement.Application.Features.GetCourseContent;

using MediatR;
using LearningManagement.Application.Abstractions;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

// Frontend DTOs
public sealed record ContentItemDto(string Id, string Name, string ContentType, string ResourceUrl);
public sealed record LearningModuleDto(string Id, string Title, string Description, int OrderSequence, List<ContentItemDto> Items);
public sealed record CourseContentDto(string SyllabusId, string SectionId, string Title, string Description, List<LearningModuleDto> Modules);

public sealed record GetCourseContentQuery(string SectionId) : IRequest<CourseContentDto?>;

public sealed class GetCourseContentQueryHandler : IRequestHandler<GetCourseContentQuery, CourseContentDto?>
{
    private readonly ICourseSyllabusRepository _repository;

    public GetCourseContentQueryHandler(ICourseSyllabusRepository repository)
    {
        _repository = repository;
    }

    public async Task<CourseContentDto?> Handle(GetCourseContentQuery request, CancellationToken cancellationToken)
    {
        var syllabus = await _repository.GetBySectionIdAsync(request.SectionId, cancellationToken);

        if (syllabus == null) return null;

        return new CourseContentDto(
            syllabus.Id.ToString(),
            syllabus.SectionId,
            syllabus.Title,
            syllabus.Description,
            syllabus.Modules.Select(m => new LearningModuleDto(
                m.Id.ToString(),
                m.Title,
                m.Description,
                m.OrderSequence,
                m.ContentItems.Select(c => new ContentItemDto(
                    c.Id.ToString(),
                    c.Name,
                    c.ContentType,
                    c.ResourceUrl
                )).ToList()
            )).ToList()
        );
    }
}
