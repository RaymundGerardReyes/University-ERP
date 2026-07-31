namespace LmsOffline.Application.Features.SubmitOfflineAssignment;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command triggered when the student clicks "Submit" offline.
/// </summary>
public sealed record SubmitOfflineAssignmentCommand(
    Guid AssessmentId,
    string StudentAnswersJson,
    DateTime SubmittedAtUtc
) : IRequest<Result<Guid>>;
