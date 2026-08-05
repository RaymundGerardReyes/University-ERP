namespace Registrar.Application.Abstractions;

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Registrar.Domain.Aggregates;

public interface IRegistrarRepository
{
    Task<IReadOnlyList<CourseSection>> GetFacultyScheduleAsync(string facultyId, CancellationToken cancellationToken);
}
