namespace LearningManagement.Application.Abstractions;

using LearningManagement.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public interface ICourseSyllabusRepository
{
    Task<CourseSyllabus?> GetBySectionIdAsync(string sectionId, CancellationToken cancellationToken = default);
    Task AddAsync(CourseSyllabus syllabus, CancellationToken cancellationToken = default);
    Task UpdateAsync(CourseSyllabus syllabus, CancellationToken cancellationToken = default);
}
