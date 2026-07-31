namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Persistence;

public sealed class OfflineAssignmentRepository : IOfflineAssignmentRepository
{
    private readonly EncryptedSqliteContext _context;

    public OfflineAssignmentRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<OfflineAssignment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Assignments.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(OfflineAssignment assignment, CancellationToken cancellationToken = default)
    {
        _context.Assignments.Update(assignment);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
