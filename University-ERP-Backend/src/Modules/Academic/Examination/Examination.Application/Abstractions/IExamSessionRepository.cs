namespace Examination.Application.Abstractions;

using Examination.Domain.Aggregates;
using System;
using System.Threading;
using System.Threading.Tasks;

public interface IExamSessionRepository
{
    Task<ExamSession?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ExamSession>> GetAllAsync(CancellationToken cancellationToken = default);
    Task UpdateAsync(ExamSession session, CancellationToken cancellationToken = default);
}