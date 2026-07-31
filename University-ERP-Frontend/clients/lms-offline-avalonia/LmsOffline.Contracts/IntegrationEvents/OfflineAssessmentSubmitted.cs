namespace LmsOffline.Contracts.IntegrationEvents;

using System;

/// <summary>
/// The public contract sent to the ERP Backend when internet is restored.
/// Built with primitive types to maintain strict DBMA cross-runtime boundaries.
/// </summary>
public sealed record OfflineAssessmentSubmitted(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid AssessmentId,
    Guid StudentId,
    string AnswersPayloadJson
);
