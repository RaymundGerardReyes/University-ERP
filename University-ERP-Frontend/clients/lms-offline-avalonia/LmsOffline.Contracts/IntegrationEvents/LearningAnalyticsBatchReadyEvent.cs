namespace LmsOffline.Contracts.IntegrationEvents;

using System;
using System.Collections.Generic;

public sealed record LearningAnalyticsBatchReadyEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid StudentId,
    int EventCount
);