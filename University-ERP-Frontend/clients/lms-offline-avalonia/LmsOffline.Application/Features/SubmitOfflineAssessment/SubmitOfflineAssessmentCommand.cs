namespace LmsOffline.Application.Features.SubmitOfflineAssessment;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

public record SubmitOfflineAssessmentCommand(
    Guid AssessmentId,
    string StudentAnswersJson,
    DateTime SubmittedAtUtc
) : IRequest<Result<bool>>;