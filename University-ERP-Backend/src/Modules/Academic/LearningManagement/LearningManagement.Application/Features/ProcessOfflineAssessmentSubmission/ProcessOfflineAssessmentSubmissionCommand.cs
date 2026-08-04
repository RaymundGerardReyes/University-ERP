namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;

// This record explicitly declares it returns a Result<Guid>, matching our handler.
public sealed record ProcessOfflineAssessmentSubmissionCommand(
    Guid AssessmentId,
    Guid StudentId,
    string CourseCode,
    string ModuleTitle,
    string AnswersJson,
    string ScheduleToken,
    DateTime SubmittedAtUtc
) : IRequest<Result<Guid>>;