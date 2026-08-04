namespace LmsOffline.Contracts.IntegrationEvents;

using System;

public sealed record PackageVerifiedEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid PackageId,
    string CourseCode,
    string VersionManifest
);