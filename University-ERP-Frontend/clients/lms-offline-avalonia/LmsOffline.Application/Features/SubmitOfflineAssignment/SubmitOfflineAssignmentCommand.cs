namespace LmsOffline.Application.Features.SubmitOfflineAssignment;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

public record SubmitOfflineAssignmentCommand(
    Guid AssessmentId,
    string StudentAnswersJson,
    DateTime SubmittedAtUtc
) : IRequest<Result<bool>>;