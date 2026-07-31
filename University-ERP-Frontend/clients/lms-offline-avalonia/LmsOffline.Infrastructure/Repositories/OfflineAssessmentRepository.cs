namespace LmsOffline.Infrastructure.Repositories;

using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LmsOffline.Domain.Aggregates;
using LmsOffline.Application.Interfaces;
using LmsOffline.Infrastructure.Persistence;

#region Repositories
/// <summary>
/// Concrete implementation of the offline assessment repository using Entity Framework Core.
/// </summary>
public sealed class OfflineAssessmentRepository : IOfflineAssessmentRepository
{
    private readonly EncryptedSqliteContext _context;

    public OfflineAssessmentRepository(EncryptedSqliteContext context)
    {
        _context = context;
    }

    public async Task<OfflineAssessment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        // Fetches the assessment directly from the local SQLite database
        return await _context.Assessments
            .FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task UpdateAsync(OfflineAssessment assessment, CancellationToken cancellationToken = default)
    {
        // Tracks the changes and commits them to the encrypted file
        _context.Assessments.Update(assessment);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
#endregion
