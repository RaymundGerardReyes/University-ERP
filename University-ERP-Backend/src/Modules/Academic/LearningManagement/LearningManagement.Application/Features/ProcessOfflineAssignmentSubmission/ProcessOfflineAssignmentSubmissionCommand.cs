namespace LearningManagement.Application.Features.ProcessOfflineAssignmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;

public sealed record ProcessOfflineAssignmentSubmissionCommand(
    Guid AssignmentId,
    Guid StudentId,
    string CourseCode,
    string AssignmentTitle,
    string EssayContent,
    string ScheduleToken,
    DateTime SubmittedAtUtc
) : IRequest<Result<Guid>>;