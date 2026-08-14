namespace Teaching.Application.Abstractions;

using Teaching.Domain.Aggregates;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

public interface ICourseSectionRepository
{
    Task<IReadOnlyList<CourseSection>> GetByFacultyIdAsync(string facultyId, CancellationToken cancellationToken = default);
    Task<CourseSection?> GetByIdAsync(string sectionId, CancellationToken cancellationToken = default);
}
