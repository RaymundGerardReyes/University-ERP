namespace Examination.Infrastructure.Repositories;

using Microsoft.EntityFrameworkCore;
using Examination.Application.Abstractions;
using Examination.Domain.Aggregates;
using Examination.Infrastructure.Persistence;
using System.Threading;
using System.Threading.Tasks;

public sealed class ExamSessionRepository : IExamSessionRepository
{
    private readonly ExaminationDbContext _dbContext;

    public ExamSessionRepository(ExaminationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ExamSession?> GetByIdAsync(System.Guid id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.ExamSessions.FindAsync(new object[] { id }, cancellationToken);
    }

    public async Task AddAsync(ExamSession session, CancellationToken cancellationToken)
    {
        await _dbContext.ExamSessions.AddAsync(session, cancellationToken);
    }

    public Task UpdateAsync(ExamSession session, CancellationToken cancellationToken = default)
    {
        _dbContext.ExamSessions.Update(session);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}