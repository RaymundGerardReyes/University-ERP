namespace LmsOffline.Application.Features.StartOfflineAssessment;

using System;
using MediatR;
using SharedKernel.Domain.Primitives;

/// <summary>
/// CQRS Command to start an offline assessment securely.
/// </summary>
public sealed record StartOfflineAssessmentCommand(
    Guid AssessmentId,
    string TokenValue,
    DateTime TokenIssuedAtUtc,
    DateTime CurrentDeviceTimeUtc
) : IRequest<Result<Guid>>;
