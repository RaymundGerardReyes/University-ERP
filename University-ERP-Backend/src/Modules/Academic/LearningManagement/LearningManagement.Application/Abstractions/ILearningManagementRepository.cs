namespace LearningManagement.Application.Abstractions;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using LearningManagement.Domain.Aggregates;

public interface ILearningManagementRepository
{
    Task<IReadOnlyList<Assessment>> GetAssessmentsAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<ClassPerformance>> GetClassPerformanceAsync(string facultyId, CancellationToken cancellationToken);
    Task<IReadOnlyList<Assessment>> GetModulesUpdatedAfterAsync(List<string> courseIds, DateTime lastSyncUtc, CancellationToken cancellationToken);
    Task<bool> HasBeenProcessedAsync(string outboxId, CancellationToken cancellationToken);
    Task<Assessment?> GetAssessmentByIdAsync(string assessmentId, CancellationToken cancellationToken);
    Task<IReadOnlyList<StudentGradeRecord>> GetStudentGradesUpdatedAfterAsync(string studentId, DateTime lastSyncUtc, CancellationToken cancellationToken);
}
