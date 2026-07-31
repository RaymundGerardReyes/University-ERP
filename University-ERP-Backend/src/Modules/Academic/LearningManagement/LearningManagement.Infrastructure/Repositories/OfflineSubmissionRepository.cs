using LearningManagement.Application.Abstractions;
using LearningManagement.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace LearningManagement.Infrastructure.Repositories;

/// <summary>
/// EF Core implementation of the offline submission repository.
/// </summary>
internal sealed class OfflineSubmissionRepository : IOfflineSubmissionRepository
{
    private readonly LearningManagementDbContext _context;

    public OfflineSubmissionRepository(LearningManagementDbContext context)
        => _context = context;

    // ─── Assessment Methods ────────────────────────────────────────────────────

    public async Task<bool> ExistsAsync(Guid assessmentId, CancellationToken cancellationToken = default)
        => await _context.OfflineAssessmentSubmissions
            .AnyAsync(e => e.AssessmentId == assessmentId, cancellationToken);

    public async Task SaveAssessmentSubmissionAsync(OfflineAssessmentRecord record, CancellationToken cancellationToken = default)
    {
        var entity = new OfflineAssessmentSubmissionEntity
        {
            AssessmentId   = record.AssessmentId,
            StudentId      = record.StudentId,
            CourseCode     = record.CourseCode,
            ModuleTitle    = record.ModuleTitle,
            AnswersJson    = JsonSerializer.Serialize(record.Answers),
            SubmittedAtUtc = record.SubmittedAtUtc,
            IngestedAtUtc  = DateTimeOffset.UtcNow
        };

        _context.OfflineAssessmentSubmissions.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }

    // ─── Assignment Methods ────────────────────────────────────────────────────

    public async Task<bool> ExistsAssignmentAsync(Guid assignmentId, CancellationToken cancellationToken = default)
        => await _context.OfflineAssignmentSubmissions
            .AnyAsync(e => e.AssignmentId == assignmentId, cancellationToken);

    public async Task SaveAssignmentSubmissionAsync(OfflineAssignmentRecord record, CancellationToken cancellationToken = default)
    {
        var entity = new OfflineAssignmentSubmissionEntity
        {
            AssignmentId   = record.AssignmentId,
            StudentId      = record.StudentId,
            CourseCode     = record.CourseCode,
            AssignmentTitle = record.AssignmentTitle,
            EssayContent   = record.EssayContent,
            SubmittedAtUtc = record.SubmittedAtUtc,
            IngestedAtUtc  = DateTimeOffset.UtcNow
        };

        _context.OfflineAssignmentSubmissions.Add(entity);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
