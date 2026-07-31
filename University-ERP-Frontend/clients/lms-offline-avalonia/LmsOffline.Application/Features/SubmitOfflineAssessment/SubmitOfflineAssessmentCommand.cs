namespace LmsOffline.Application.Features.SubmitOfflineAssessment;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command triggered when the student finishes an offline quiz/exam.
/// </summary>
public sealed record SubmitOfflineAssessmentCommand(
    Guid AssessmentId,
    string ExamAnswersJson,
    DateTime SubmittedAtUtc
) : IRequest<Result<Guid>>;
