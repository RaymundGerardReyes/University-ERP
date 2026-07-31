namespace LmsOffline.Application.Commands;

using System;
using MediatR;
using LmsOffline.Domain.ValueObjects;

#region Commands
/// <summary>
/// Command to initiate an offline assessment attempt.
/// </summary>
public sealed record StartOfflineAssessmentCommand(
    Guid AssessmentId,
    AttemptToken Token,
    DateTime CurrentTimeUtc
) : IRequest<bool>;
#endregion
