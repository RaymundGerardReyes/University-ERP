namespace AcademicScheduling.Application.Abstractions;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AcademicScheduling.Domain.Aggregates;

public interface IClassSessionRepository
{
    Task<ClassSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ClassSession>> GetByFacultyIdAsync(Guid facultyId, CancellationToken cancellationToken = default);
    void Add(ClassSession classSession);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
