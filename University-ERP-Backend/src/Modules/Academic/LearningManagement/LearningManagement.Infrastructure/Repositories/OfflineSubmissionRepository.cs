namespace LearningManagement.Infrastructure.Repositories;

using LearningManagement.Application.Abstractions;
using LearningManagement.Infrastructure.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class OfflineSubmissionRepository : IOfflineSubmissionRepository
{
    private readonly LearningManagementDbContext _context;

    public OfflineSubmissionRepository(LearningManagementDbContext context)
    {
        _context = context;
    }

    public async Task SaveAssessmentSubmissionAsync(
        Guid submissionId, 
        Guid assessmentId, 
        Guid studentId, 
        string answersJson, 
        DateTime submittedAtUtc, 
        CancellationToken cancellationToken = default)
    {
        // Persistence logic for assessment submissions
        await Task.CompletedTask;
    }

    public async Task SaveAssignmentSubmissionAsync(
        Guid submissionId, 
        Guid assignmentId, 
        Guid studentId, 
        string essayContent, 
        DateTime submittedAtUtc, 
        CancellationToken cancellationToken = default)
    {
        // Persistence logic for assignment submissions
        await Task.CompletedTask;
    }
}