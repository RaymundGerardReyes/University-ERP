namespace LearningManagement.Application.Abstractions;

using System;
using System.Threading;
using System.Threading.Tasks;

public interface IOfflineSubmissionRepository
{
    Task SaveAssessmentSubmissionAsync(
        Guid submissionId, 
        Guid assessmentId, 
        Guid studentId, 
        string answersJson, 
        DateTime submittedAtUtc, 
        CancellationToken cancellationToken = default);
    
    Task SaveAssignmentSubmissionAsync(
        Guid submissionId, 
        Guid assignmentId, 
        Guid studentId, 
        string essayContent, 
        DateTime submittedAtUtc, 
        CancellationToken cancellationToken = default);
}